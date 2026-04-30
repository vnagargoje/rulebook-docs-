import { registerAs } from '@nestjs/config';

export const razorpayConfig = registerAs('razorpay.config', () => ({
    apiKey: process.env.RAZORPAY_API_KEY,
    apiSecret: process.env.RAZORPAY_API_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
}));
