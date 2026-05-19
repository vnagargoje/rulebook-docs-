import { registerAs } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3';

export const s3ClientConfig = registerAs(
    's3-client.config',
    (): S3ClientConfig => {
        const env = process.env;
        return {
            endpoint: env['S3_ENDPOINT'],
            region: env['S3_REGION'],
            credentials: {
                accessKeyId: env['S3_ACCESS_KEY']!,
                secretAccessKey: env['S3_SECRET_KEY']!,
            },
            forcePathStyle: env['S3_FORCE_PATH_STYLE'] === 'true',
        };
    },
);

export const S3_BUCKET = 's3-bucket';
export const s3BucketConfig = registerAs(S3_BUCKET, () => ({
    bucket: process.env['S3_BUCKET'] || 'yugo',
}));
