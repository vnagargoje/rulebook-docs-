import { useRouter } from 'expo-router'

import { EditProfileScreen } from '@/components/profile/edit-profile-screen'

export default function KycProfileScreen() {
    const router = useRouter()

    return (
        <EditProfileScreen
            onSuccess={() => {
                router.replace('/customer/kyc/address')
            }}
        />
    )
}
