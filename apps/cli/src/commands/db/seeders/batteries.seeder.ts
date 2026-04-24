import { Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BatteryEntity, FileEntity } from '@yugo/nestjs-database/entities';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PNG } from 'pngjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const PDF_PATH = resolve(__dirname, 'battery-qr-codes.pdf');
const QR_WIDTH = 120;
const QR_HEIGHT = 120;

interface PdfImage {
    colorSpace: string;
    smaskObj: number | null;
    data: Buffer;
}

function extractBatteriesFromPdf(): {
    batteryQrId: string;
    pngBuffer: Buffer;
}[] {
    const buf = readFileSync(PDF_PATH);
    const str = buf.toString('latin1');

    const batteryIds: string[] = [];
    const textRegex = /\(ML3[^)]+\)/g;
    let m: RegExpExecArray | null;
    while ((m = textRegex.exec(str)) !== null) {
        batteryIds.push(m[0].slice(1, -1));
    }

    const imageMap = new Map<number, PdfImage>();
    const objRegex = /(\d+)\s+0\s+obj\s*<<([^]*?)>>\s*stream\n/g;
    while ((m = objRegex.exec(str)) !== null) {
        const objNum = parseInt(m[1], 10);
        const dict = m[2];
        if (!dict.includes('/Subtype /Image')) continue;

        const lengthM = dict.match(/\/Length\s+(\d+)/);
        const colorM = dict.match(/\/ColorSpace\s+\/(\w+)/);
        const smaskM = dict.match(/\/SMask\s+(\d+)\s+0\s+R/);
        if (!lengthM || !colorM) continue;

        const streamStart = m.index + m[0].length;
        const streamLen = parseInt(lengthM[1], 10);

        imageMap.set(objNum, {
            colorSpace: colorM[1],
            smaskObj: smaskM ? parseInt(smaskM[1], 10) : null,
            data: buf.slice(streamStart, streamStart + streamLen),
        });
    }

    const rgbEntries = [...imageMap.entries()]
        .filter(([, v]) => v.colorSpace === 'DeviceRGB')
        .sort((a, b) => a[0] - b[0]);

    if (rgbEntries.length !== batteryIds.length) {
        throw new Error(
            `PDF mismatch: found ${rgbEntries.length} QR images but ${batteryIds.length} battery IDs`,
        );
    }

    return rgbEntries.map(([, img], index) => {
        const alpha = img.smaskObj ? imageMap.get(img.smaskObj) : undefined;
        const png = new PNG({ width: QR_WIDTH, height: QR_HEIGHT });

        for (let i = 0; i < QR_WIDTH * QR_HEIGHT; i++) {
            const dst = i * 4;
            const rgb = i * 3;
            png.data[dst] = img.data[rgb];
            png.data[dst + 1] = img.data[rgb + 1];
            png.data[dst + 2] = img.data[rgb + 2];
            png.data[dst + 3] = alpha ? alpha.data[i] : 255;
        }

        return {
            batteryQrId: batteryIds[index],
            pngBuffer: PNG.sync.write(png),
        };
    });
}

export class BatteriesSeeder implements Seeder {
    private readonly logger = new Logger(BatteriesSeeder.name);

    public async run(dataSource: DataSource): Promise<void> {
        const s3Endpoint = process.env['S3_ENDPOINT'];
        const s3Region = process.env['S3_REGION'];
        const s3AccessKey = process.env['S3_ACCESS_KEY'];
        const s3SecretKey = process.env['S3_SECRET_KEY'];
        const s3ForcePathStyle = process.env['S3_FORCE_PATH_STYLE'] === 'true';
        const bucket = process.env['S3_BUCKET'] || 'yugo';

        if (!s3AccessKey || !s3SecretKey) {
            throw new Error(
                'S3_ACCESS_KEY and S3_SECRET_KEY must be set to run BatteriesSeeder',
            );
        }

        const s3Client = new S3Client({
            endpoint: s3Endpoint,
            region: s3Region,
            credentials: {
                accessKeyId: s3AccessKey,
                secretAccessKey: s3SecretKey,
            },
            forcePathStyle: s3ForcePathStyle,
        });

        this.logger.log('Extracting QR code images from battery-qr-codes.pdf…');
        const batteries = extractBatteriesFromPdf();
        this.logger.log(`Found ${batteries.length} batteries in PDF`);

        const manager = dataSource.manager;
        let created = 0;
        let skipped = 0;

        for (const { batteryQrId, pngBuffer } of batteries) {
            const existing = await manager.findOne(BatteryEntity, {
                where: { batteryQrId },
            });

            if (existing) {
                skipped += 1;
                continue;
            }

            const s3Key = `batteries/qr-codes/${batteryQrId}.png`;

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: s3Key,
                    Body: pngBuffer,
                    ContentType: 'image/png',
                }),
            );

            const baseUrl = (s3Endpoint ?? '').replace(/\/$/, '');
            const file = manager.create(FileEntity, {
                filename: `${batteryQrId}.png`,
                path: `${baseUrl}/${bucket}/${s3Key}`,
                mimeType: 'image/png',
                size: pngBuffer.length,
            });
            await manager.save(file);

            const battery = manager.create(BatteryEntity, {
                batteryQrId,
                qrCodeId: file.id,
            });
            await manager.save(battery);

            created += 1;
            this.logger.log(`Seeded battery ${batteryQrId}`);
        }

        this.logger.log(
            `BatteriesSeeder done — created: ${created}, skipped (already exist): ${skipped}`,
        );
    }
}
