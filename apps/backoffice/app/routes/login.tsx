import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
    IconRouteSquare,
    IconArrowRight,
    IconShieldCheck,
    IconLock,
    IconHistory,
    IconEye,
    IconEyeOff
} from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { canAccessAdminPanel } from '~/lib/ability'
import { v1AuthSignIn } from '~/services/api/sdk'
import { useAuth } from '~/lib/auth-context'
import type { Route } from './+types/login'

export async function clientLoader() {
    return null
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    try {
        const formData = await request.formData()
        const body = Object.fromEntries(formData)

        const { data } = await v1AuthSignIn(body as any)

        if (data) {
            if (!canAccessAdminPanel(data.user.roles)) {
                return { error: `Access Denied: Insufficient permissions.` }
            }
            return { success: true, data }
        }
    } catch (err: any) {
        if (err instanceof Response) throw err
        const error = err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.'
        return { error }
    }
    return null
}

export default function LoginRoute() {
    const actionData = useActionData<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (actionData?.success && actionData.data) {
            login(actionData.data)
            toast.success('Sign in successful')
            navigate('/dashboard', { replace: true })
        } else if (actionData?.error) {
            toast.error(actionData.error)
            setIsLoading(false)
        }
    }, [actionData, login, navigate])

    return (
        <div className="min-h-screen grow w-full bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-8 font-sans antialiased relative overflow-hidden">

            <div className="w-full max-w-5xl h-full max-h-[700px] bg-white rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-200 relative z-10">
                <div className="md:w-[42%] bg-[#00ADB1] p-10 flex flex-col relative overflow-hidden">
                    <div className="absolute top-[-15%] right-[-15%] w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#00ADB1] shadow-lg shadow-black/5">
                                <IconRouteSquare size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display text-xl font-black tracking-tight text-white leading-tight">YUGO</span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Operations Control</span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-auto">
                            <h2 className="font-display text-4xl leading-[1.15] font-bold text-white tracking-tight">
                                Manage your entire mobility fleet in one place.
                            </h2>
                            <p className="text-white/80 text-lg font-medium leading-relaxed">
                                Real-time telemetry, battery logistics, vehicle assignments, and customer management.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <StatItem label="Active vehicles" value="12k+" />
                            <StatItem label="Swap stations" value="340" />
                            <StatItem label="Fleet uptime" value="98%" />
                            <StatItem label="Monitoring" value="24/7" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-gradient-to-br from-white via-white to-slate-50 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ADB1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="w-full max-w-sm px-6 py-10 space-y-10 relative z-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/10">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF7B1A]">Admin access only</span>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
                                <p className="text-slate-500 font-medium text-sm">Sign in to your Yugo admin account.</p>
                            </div>
                        </div>

                        <Form method="post" onSubmit={() => setIsLoading(true)} className="space-y-6">
                            {actionData?.error && (
                                <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-700 rounded-xl">
                                    <AlertDescription className="text-xs font-bold uppercase tracking-wider">{actionData.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Work Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="yugo@admin.com"
                                        className="h-12 w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-primary focus:ring-primary/10 transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Password</label>
                                        <button type="button" className="text-[10px] font-bold text-primary hover:opacity-80 transition-opacity uppercase tracking-wider">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="••••••••"
                                            className="h-12 w-full rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-primary focus:ring-primary/10 transition-all font-medium pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-14 w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-bold shadow-xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Authenticating...</span>
                                ) : (
                                    <>
                                        Sign In <IconArrowRight size={20} />
                                    </>
                                )}
                            </Button>
                        </Form>

                        <div className="flex flex-wrap gap-2 pt-4">
                            <Badge icon={<IconShieldCheck size={14} />} label="Secure" />
                            <Badge icon={<IconLock size={14} />} label="Role Access" />
                            <Badge icon={<IconHistory size={14} />} label="Audit Log" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all hover:bg-white/20">
            <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</div>
        </div>
    )
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-slate-300">{icon}</span>
            {label}
        </div>
    )
}
