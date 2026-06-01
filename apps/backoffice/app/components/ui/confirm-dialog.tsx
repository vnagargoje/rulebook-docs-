import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'

interface Props {
    isOpen: boolean
    isLoading?: boolean
    title: string
    description: string
    confirmText?: string
    loadingText?: string
    cancelText?: string
    onClose: () => void
    onConfirm: () => void
    variant?: 'default' | 'destructive'
}

export function ConfirmDialog({ 
    isOpen, 
    isLoading = false, 
    title, 
    description, 
    confirmText = 'Confirm',
    loadingText = 'Loading...',
    cancelText = 'Cancel',
    onClose, 
    onConfirm,
    variant = 'default'
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogContent showCloseButton={false} className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? loadingText : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
