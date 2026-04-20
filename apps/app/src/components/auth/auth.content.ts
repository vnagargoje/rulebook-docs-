export const loginContent = {
    eyebrow: 'Yugo',
    title: 'Welcome to Yugo',
    description: 'Enter your phone number and continue with OTP verification.',
    heroDescription: 'Use your phone number to access bookings, support, and profile details.',
    phoneLabel: 'Phone number',
    phonePlaceholder: '98765 43210',
    termsLabel: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
    marketingLabel: 'Send me product updates and ride offers.',
    submitLabel: 'Continue',
} as const

export const otpContent = {
    eyebrow: 'Verification',
    title: 'Confirm your phone number',
    fallbackDescription: 'Enter the 4-digit code sent to your registered mobile number.',
    heroFallbackDescription: 'Enter the code sent to your registered mobile number to continue securely.',
    codeLabel: 'Verification code',
    codePlaceholder: '2222',
    submitLabel: 'Verify and continue',
    resendLabel: "Didn't receive a code? Request a new one in a moment.",
} as const
