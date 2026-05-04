/**
 * Jest mock for react-native-razorpay.
 * In tests, spy on RazorpayCheckout.open:
 *   jest.spyOn(RazorpayCheckout, 'open').mockResolvedValue({ ... })
 */

const RazorpayCheckout = {
    open: (_options: unknown) =>
        Promise.resolve({
            razorpay_payment_id: 'pay_test_mock',
            razorpay_order_id: 'order_test_mock',
            razorpay_signature: 'sig_test_mock',
        }),
}

export default RazorpayCheckout
