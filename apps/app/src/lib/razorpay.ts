import { toast } from 'sonner-native'
import type { PaymentErrorData } from 'react-native-razorpay/src/types'

/**
 * Reusable error handler for Razorpay Checkout flow.
 * Handles user cancellations and robustly sanitizes backend error strings.
 */
export function handleRazorpayError(error: unknown) {
    const razorpayError = error as PaymentErrorData

    let isCancelled = razorpayError?.code === 2
    let errorMessage = razorpayError?.description ?? 'Something went wrong. Please try again.'

    if (typeof errorMessage === 'string') {
        // Handle stringified JSON or raw backend error strings
        if (errorMessage.includes('{') || errorMessage.includes('BAD_REQUEST_ERROR')) {
            // If the user aborted during authentication (common when exiting via back button)
            if (
                errorMessage.includes('payment_cancelled') ||
                errorMessage.includes('canceled') ||
                (errorMessage.includes('BAD_REQUEST_ERROR') && errorMessage.includes('payment_authentication'))
            ) {
                isCancelled = true
            } else {
                errorMessage = 'Payment process was interrupted or could not be completed. Please try again.'
            }
        }
    }

    if (isCancelled) {
        toast.error('Payment cancelled', {
            description: 'You cancelled the payment. Your order is saved - try again anytime.',
        })
    } else {
        toast.error('Payment failed', {
            description: errorMessage,
        })
    }
}
