import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { BatteryEntity } from '@yugo/nestjs-database/entities';
import { NestjsInngestFunction } from '@yugo/nestjs-inngest';
import { BatteryStatus, StationType } from '@yugo/shared';
import { HenchmenInngestClient } from '@yugo/utils';
import { type GetFunctionInput } from 'inngest';
import { DataSource } from 'typeorm';
import xior from 'xior';

interface MoovingLoginResponse {
    status: string;
    message: string;
    token: string;
    expiry: number;
}

interface MoovingIotResponse {
    status: string;
    message: string;
    data: {
        socPercent: number;
        lat: string;
        long: string;
        iotTimeStamp: string;
        locationTimeStamp: string;
    };
}

@Injectable()
export class BatteryFunctions {
    private readonly logger = new Logger(BatteryFunctions.name);

    constructor(
        private readonly configService: ConfigService,
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject(RedisService) private readonly redis: RedisService,
    ) {}

    @NestjsInngestFunction<HenchmenInngestClient>(
        { id: 'syncBatteryIotData' },
        { cron: '*/5 * * * *' },
    )
    async syncBatteryIotData({
        step,
    }: GetFunctionInput<HenchmenInngestClient>) {
        const results = await step.run('process-batches', async () => {
            const batteries = await this.datasource.manager.find(
                BatteryEntity,
                {
                    relations: ['station'],
                },
            );

            if (batteries.length === 0) {
                this.logger.log('No batteries found to sync.');
                return [];
            }

            const processedResults = [];
            for (let i = 0; i < batteries.length; i += 20) {
                const batch = batteries.slice(i, i + 20);
                const batchResults = await Promise.all(
                    batch.map((battery) => this.processBattery(battery)),
                );
                processedResults.push(...batchResults);
            }
            return processedResults;
        });

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;

        this.logger.log(
            `Sync completed. Success: ${successCount}, Failures: ${failureCount}`,
        );

        return {
            total: results.length,
            success: successCount,
            failures: failureCount,
        };
    }

    private async processBattery(battery: BatteryEntity) {
        try {
            const token = await this.getMoovingToken();
            const iotData = await this.fetchBatteryIotData(
                battery.batteryQrId,
                token,
            );

            battery.properties = {
                ...(battery.properties || {}),
                ...iotData.data,
            };

            let status: BatteryStatus | undefined;
            if (battery.stationId && battery.station) {
                status = this.determineBatteryStatus(
                    iotData.data.socPercent,
                    battery.station.type,
                );
                battery.status = status;
            }

            const updateQuery = this.datasource.manager.createQueryBuilder(BatteryEntity, 'battery')
                .update()
                .where('id = :id', { id: battery.id });

            const setValues: any = {
                properties: () => `JSON_MERGE_PATCH(COALESCE(properties, JSON_OBJECT()), :iotDataJson)`
            };
            updateQuery.setParameter('iotDataJson', JSON.stringify(iotData.data));

            if (status) {
                setValues.status = status;
            }

            updateQuery.set(setValues);
            await updateQuery.execute();

            return { batteryQrId: battery.batteryQrId, success: true };
        } catch (error: any) {
            this.logger.error(
                `[${battery.batteryQrId}] Sync failed: ${error.message}`,
            );
            return {
                batteryQrId: battery.batteryQrId,
                success: false,
                error: error.message,
            };
        }
    }

    private async getMoovingToken(): Promise<string> {
        const redisKey = 'mooving_auth_token';
        const client = this.redis.getOrThrow();
        const cachedToken = await client.get(redisKey);
        if (cachedToken) {
            return cachedToken;
        }
        const config = this.configService.getOrThrow('mooving.config');
        const { data } = await xior.post<MoovingLoginResponse>(
            `${config.baseUrl}/v1/external/login`,
            {
                companyId: config.companyId,
                secretKey: config.secretKey,
            },
        );

        if (data.status !== 'success' || !data.token) {
            throw new Error(`Mooving login failed: ${data.message}`);
        }

        await client.set(redisKey, data.token, 'EX', 900);
        return data.token;
    }

    private async fetchBatteryIotData(serialNumber: string, token: string) {
        const config = this.configService.getOrThrow('mooving.config');
        const { data } = await xior.post<MoovingIotResponse>(
            `${config.baseUrl}/iot/getIotData/live`,
            { batterySerialNumber: serialNumber },
            {
                headers: {
                    Authorization: token,
                },
            },
        );

        if (data.status !== 'success') {
            throw new Error(`Mooving IoT fetch failed: ${data.message}`);
        }

        return data;
    }

    private determineBatteryStatus(
        soc: number,
        stationType: StationType,
    ): BatteryStatus {
        if (stationType === StationType.HUB_STATION) {
            if (soc >= 90) {
                return BatteryStatus.CHARGED;
            }
            if (soc > 20) {
                return BatteryStatus.CHARGING;
            }
            return BatteryStatus.DRAINED;
        }

        if (stationType === StationType.SWAP_STATION) {
            if (soc >= 80) {
                return BatteryStatus.AVAILABLE;
            }
            return BatteryStatus.DRAINED;
        }

        return BatteryStatus.DRAINED;
    }
}
