declare module 'react-native-razorpay' {
    export interface RazorpayOptions {
        key: string
        amount: number | string
        currency?: string
        name?: string
        description?: string
        image?: string
        order_id?: string
        prefill?: {
            name?: string
            email?: string
            contact?: string
        }
        notes?: Record<string, string>
        theme?: {
            color?: string
            hide_topbar?: boolean
        }
        modal?: {
            backdropclose?: boolean
            escape?: boolean
            handleback?: boolean
            confirm_close?: boolean
            ondismiss?: () => void
            animation?: boolean
        }
        [key: string]: unknown
    }

    export interface PaymentSuccessData {
        razorpay_payment_id: string
        razorpay_order_id?: string
        razorpay_signature?: string
        [key: string]: unknown
    }

    export interface PaymentErrorData {
        code: number
        description: string
        source: string
        step: string
        reason: string
        metadata: {
            order_id?: string
            payment_id?: string
            [key: string]: unknown
        }
    }

    const RazorpayCheckout: {
        open(options: RazorpayOptions): Promise<PaymentSuccessData>
    }

    export default RazorpayCheckout
}

declare module 'react-native-razorpay/src/types' {
    export interface PaymentSuccessData {
        razorpay_payment_id: string
        razorpay_order_id?: string
        razorpay_signature?: string
        [key: string]: unknown
    }

    export interface PaymentErrorData {
        code: number
        description: string
        source: string
        step: string
        reason: string
        metadata: {
            order_id?: string
            payment_id?: string
            [key: string]: unknown
        }
    }
}
