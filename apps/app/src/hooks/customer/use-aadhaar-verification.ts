import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'
import type { OtpInputRef } from 'react-native-otp-entry'

import { showErrorMessage } from '@/components/ui'
import { useKycFlow } from '@/hooks/customer/use-kyc-flow'
import {
    useAadhaarConnect,
    useAadhaarGenerateOtp,
    useAadhaarReloadCaptcha,
    useAadhaarVerifyOtp,
} from '@/queries/customer/kyc.query'
import { aadhaarFormSchema, type AadhaarFormValues } from '@/schema/kyc/kyc.schema'
import { extractError } from '@/components/ui/utils'
import { isXiorError } from 'xior'

type Phase = 'form' | 'otp'

function getAadhaarErrorMessage(error: unknown, fallback: string): string {
    const backendMessage = isXiorError(error) ? extractError(error.response?.data) : extractError(error)
    const lowerMsg = backendMessage.toLowerCase()

    if (lowerMsg.includes('attempt') || lowerMsg.includes('limit') || lowerMsg.includes('exceed') || lowerMsg.includes('maximum')) {
        return 'Attempt limit reached. Redirecting to next step...'
    }
    if (lowerMsg.includes('invalid') || lowerMsg.includes('incorrect')) {
        return 'The OTP you entered is incorrect. Please try again.'
    }
    if (lowerMsg.includes('session') || lowerMsg.includes('expire')) {
        return 'Your session has expired. Please start again.'
    }
    if (lowerMsg.includes('conflict') || lowerMsg.includes('duplicate') || lowerMsg.includes('already')) {
        return 'This Aadhaar is already registered or verification failed.'
    }
    if (lowerMsg.includes('internal server error')) {
        return 'Aadhaar KYC Failed.'
    }

    return backendMessage.trim() || fallback
}

const CURRENT_ROUTE = '/customer/kyc/aadhaar'

export function useAadhaarVerification() {
    const { aadhaarState, refreshAndNavigate, navigateToNext } = useKycFlow()

    const [phase, setPhase] = useState<Phase>('form')
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [captchaBase64, setCaptchaBase64] = useState<string | null>(null)
    const [aadhaarNumber, setAadhaarNumberState] = useState<string>('')
    const [otp, setOtp] = useState<string>('')
    const otpInputRef = useRef<OtpInputRef>(null)
    const isSubmittingRef = useRef(false)

    const connect = useAadhaarConnect()
    const reloadCaptcha = useAadhaarReloadCaptcha()
    const generateOtp = useAadhaarGenerateOtp()
    const verifyOtp = useAadhaarVerifyOtp()

    const formMethods = useForm<AadhaarFormValues>({
        resolver: zodResolver(aadhaarFormSchema),
        mode: 'onBlur',
        defaultValues: { aadhaarNumber: '', captcha: '' },
    })

    const startSession = useCallback(async () => {
        try {
            const data = await connect.mutateAsync()
            setSessionId(data.sessionId)
            setCaptchaBase64(data.captcha)
        } catch {
            // error shown via onError in mutation
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        startSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleReloadCaptcha = useCallback(async () => {
        if (!sessionId) return
        try {
            const data = await reloadCaptcha.mutateAsync({ sessionId })
            setCaptchaBase64(data.captcha)
            formMethods.setValue('captcha', '')
        } catch {
            // handled by mutation onError
        }
    }, [sessionId, reloadCaptcha, formMethods])

    const handleFormSubmit = formMethods.handleSubmit(async (values) => {
        if (!sessionId || isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            Keyboard.dismiss()
            setAadhaarNumberState(values.aadhaarNumber)

            const result = await generateOtp.mutateAsync({
                sessionId,
                captcha: values.captcha,
                aadhaarNumber: values.aadhaarNumber,
            })

            if (result.success) {
                setOtp('')
                setPhase('otp')
            } else {
                const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                if (!navigated) {
                    showErrorMessage(result.message || 'Failed to send OTP. Please try again.')
                    await handleReloadCaptcha()
                }
            }
        } catch (error) {
            const msg = getAadhaarErrorMessage(error, 'Failed to send OTP. Please try again.')
            showErrorMessage(msg)

            const navigated = await refreshAndNavigate(CURRENT_ROUTE)
            if (!navigated) {
                await handleReloadCaptcha()
            }
        } finally {
            isSubmittingRef.current = false
        }
    })

    const handleOtpSubmit = useCallback(async () => {
        if (!sessionId || isSubmittingRef.current) return
        if (otp.length < 6) {
            showErrorMessage('Please enter the 6-digit OTP.')
            return
        }
        isSubmittingRef.current = true

        try {
            Keyboard.dismiss()

            const result = await verifyOtp.mutateAsync({
                sessionId,
                otp,
                aadhaarNumber,
            })

            if (result.success) {
                await navigateToNext('/customer/kyc/pan')
            } else {
                const navigated = await refreshAndNavigate(CURRENT_ROUTE)
                if (!navigated) {
                    showErrorMessage(result.message || 'OTP verification failed. Please try again.')
                    setOtp('')
                    otpInputRef.current?.clear()
                    setPhase('form')
                    await handleReloadCaptcha()
                }
            }
        } catch (error) {
            const msg = getAadhaarErrorMessage(error, 'OTP verification failed. Please try again.')
            showErrorMessage(msg)

            const navigated = await refreshAndNavigate(CURRENT_ROUTE)
            if (!navigated) {
                setOtp('')
                otpInputRef.current?.clear()
                setPhase('form')
                await handleReloadCaptcha()
            }
        } finally {
            isSubmittingRef.current = false
        }
    }, [sessionId, otp, aadhaarNumber, verifyOtp, navigateToNext, refreshAndNavigate, handleReloadCaptcha])

    const handleBackToForm = useCallback(() => {
        setOtp('')
        otpInputRef.current?.clear()
        setPhase('form')
        handleReloadCaptcha()
    }, [handleReloadCaptcha])

    const handleContinueToPan = useCallback(() => {
        navigateToNext('/customer/kyc/pan')
    }, [navigateToNext])

    const isConnecting = connect.isPending && !sessionId

    const isFormSubmitting = generateOtp.isPending || isSubmittingRef.current
    const isOtpSubmitting = verifyOtp.isPending || isSubmittingRef.current

    const isButtonDisabled =
        !sessionId ||
        generateOtp.isPending ||
        verifyOtp.isPending ||
        (phase === 'otp' && otp.length < 6)

    return {
        // state
        phase,
        sessionId,
        captchaBase64,
        otp,
        otpInputRef,
        isConnecting,
        isFormSubmitting,
        isOtpSubmitting,
        isButtonDisabled,
        aadhaarState,

        // form
        formMethods,

        // setters
        setOtp,

        // handlers
        handleFormSubmit,
        handleOtpSubmit,
        handleReloadCaptcha,
        handleBackToForm,
        handleContinueToPan,
    }
}
