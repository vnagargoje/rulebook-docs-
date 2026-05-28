import { useState, useEffect, useCallback } from 'react'
import { useResendOtp } from '@/queries/auth.query'

export const useOtpTimer = (initialTime: number, phoneNumber: string) => {
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const { mutateAsync: resendOtp, isPending: isResending } = useResendOtp()

    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const handleResend = useCallback(async () => {
        if (!phoneNumber) return

        await resendOtp(phoneNumber)
        setTimeLeft(initialTime)
    }, [phoneNumber, resendOtp, initialTime])

    return {
        timeLeft,
        isResending,
        canResend: timeLeft === 0,
        handleResend,
    }
}
