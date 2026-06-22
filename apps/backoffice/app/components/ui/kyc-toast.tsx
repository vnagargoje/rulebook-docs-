import { toast } from 'sonner'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'

interface ShowKycRequiredToastProps {
    message: string
    onReview: () => void
}

export function showKycRequiredToast({ message, onReview }: ShowKycRequiredToastProps) {
    toast.custom(
        (t) => (
            <div className="flex w-[480px] sm:w-[560px] items-start gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-xl backdrop-blur-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <IconAlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-foreground">KYC Verification Required</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{message}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Button
                            variant="destructive"
                            onClick={() => {
                                toast.dismiss(t)
                                onReview()
                            }}
                            className="uppercase tracking-widest text-xs font-bold"
                        >
                            Review Customer KYC
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toast.dismiss(t)}
                            className="uppercase tracking-widest text-xs font-bold"
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            </div>
        ),
        {
            duration: Number.POSITIVE_INFINITY,
            style: { minWidth: '560px' },
            className: '!p-0 !bg-transparent !border-0 !shadow-none',
        }
    )
}
