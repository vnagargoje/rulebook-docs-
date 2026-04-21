import { BadRequestException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { BookingEntity } from '@yugo/nestjs-database/entities'
import { BookingStatus } from '@yugo/shared'
import { GetVehicleSurrenderDetailsQuery } from 'src/queries/impl'
import { DeepvueConfig } from 'src/types'
import { DataSource } from 'typeorm'
import xior from 'xior'

@QueryHandler(GetVehicleSurrenderDetailsQuery)
export class GetVehicleSurrenderDetailsHandler implements IQueryHandler<GetVehicleSurrenderDetailsQuery> {
    private readonly logger = new Logger(GetVehicleSurrenderDetailsHandler.name)
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        private readonly configService: ConfigService,
    ) {}

    async execute(query: GetVehicleSurrenderDetailsQuery) {
        const { vehicleNumber } = query
        const manager = this.datasource.manager
        const config = this.configService.getOrThrow<DeepvueConfig>('deepvue.config')

        const booking = await manager
            .createQueryBuilder(BookingEntity, 'booking')
            .innerJoinAndSelect('booking.vehicle', 'vehicle')
            .innerJoinAndSelect('booking.userPlan', 'userPlan')
            .innerJoinAndSelect('userPlan.user', 'user')
            .where('vehicle.vehicleNumber = :vehicleNumber', { vehicleNumber })
            .andWhere('booking.status = :status', { status: BookingStatus.ONGOING })
            .getOne()

        if (!booking) {
            throw new BadRequestException('No ongoing booking found for the given vehicle number')
        }

        const { userPlan, vehicle } = booking
        const { user, planSnapshot } = userPlan
        const depositAmount: number = planSnapshot?.deposit ?? 0

        const accessToken = await this.getAccessToken(config)
        const rtoPenalty = await this.fetchRtoPenalty(vehicle.rcNumber, accessToken, config)
        const refundAmount = Math.max(0, depositAmount - rtoPenalty)

        return {
            customerId: user.id,
            customerName: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
            depositAmount,
            rtoPenalty,
            refundAmount,
        }
    }

    async getAccessToken(config: DeepvueConfig): Promise<string> {
        const client = xior.create({ baseURL: config.baseUrl })
        const formData = new FormData()
        formData.append('client_id', config.clientId)
        formData.append('client_secret', config.clientSecret)
        const { data } = await client.post<{ access_token: string }>('/authorize', formData)
        return data.access_token
    }

    async fetchRtoPenalty(rcNumber: string, accessToken: string, config: DeepvueConfig): Promise<number> {
        const client = xior.create({
            baseURL: config.baseUrl,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'x-api-key': config.apiKey,
            },
        })

        try {
            const { data } = await client.get('/verification/rc-challan-details', {
                params: { rc_number: rcNumber },
            })

            this.logger.debug('RTO penalty details response from Deepvue:', data)
            const challans: any[] = data?.data?.challan_details?.challans ?? []
            return challans.reduce((sum: number, challan: any) => {
                return sum + (challan?.amount ?? 0)
            }, 0)
        } catch (error) {
            console.error('Error fetching RTO penalty details from Deepvue:', error)
            throw new BadRequestException('Failed to fetch RTO penalty details from Deepvue', JSON.stringify(error))
        }
    }
}
