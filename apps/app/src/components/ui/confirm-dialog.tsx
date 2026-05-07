import { Modal } from 'react-native'

import { Button } from './button'
import { Text } from './text'
import { View } from './index'

type ConfirmDialogProps = {
    visible: boolean
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    visible,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
            onRequestClose={onCancel}>
            <View className='flex-1 items-center justify-center bg-black/45 px-5'>
                <View className='w-full max-w-md rounded-2xl bg-white p-5'>
                    <Text className='text-xl font-bold text-neutral-900'>{title}</Text>
                    {!!description && <Text className='mt-2 text-sm leading-6 text-neutral-600'>{description}</Text>}

                    <View className='mt-5 flex-row gap-3'>
                        <Button
                            label={cancelLabel}
                            onPress={onCancel}
                            variant='outline'
                            className='my-0 h-11 flex-1 rounded-xl border-neutral-300 bg-white'
                            textClassName='text-sm font-semibold text-neutral-700'
                        />
                        <Button
                            label={confirmLabel}
                            onPress={onConfirm}
                            variant='destructive'
                            loading={loading}
                            className='my-0 h-11 flex-1 rounded-xl'
                            textClassName='text-sm font-semibold text-white'
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
