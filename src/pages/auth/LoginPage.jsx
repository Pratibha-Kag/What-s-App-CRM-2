import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    UserCircle,
    Building2,
    Users,
    Headphones,
    Loader2,
    Settings,
    Eye,
    EyeOff,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockCustomerAccounts, mockDemoCredentials, mockUsers } from '../../mock/mockData'
import useAppStore, { PLATFORM_ACCOUNT, ROLE_MAP, getRolePath } from '../../store/useStore'
import { toast } from '../../components/ui/Toast'
import { DEFAULT_BRANDING, getContrastTextColor, isValidHexColor } from '../../lib/brandingUtils'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const demoAccounts = [
    {
        role: 'Super Admin',
        roleKey: 'SUPER_ADMIN',
        email: 'superadmin@example.com',
        icon: ShieldCheck,
        color: 'text-rose-400',
        hoverColor: 'hover:border-rose-400 hover:bg-rose-400/10',
    },
    {
        role: 'Admin',
        roleKey: 'ADMIN',
        email: 'admin@example.com',
        icon: Settings,
        color: 'text-indigo-400',
        hoverColor: 'hover:border-indigo-400 hover:bg-indigo-400/10',
    },
    {
        role: 'Manager',
        roleKey: 'MANAGER',
        email: 'manager@example.com',
        icon: Building2,
        color: 'text-blue-400',
        hoverColor: 'hover:border-blue-400 hover:bg-blue-400/10',
    },
    {
        role: 'Team Leader',
        roleKey: 'TEAM_LEADER',
        email: 'teamleader@example.com',
        icon: Users,
        color: 'text-emerald-400',
        hoverColor: 'hover:border-emerald-400 hover:bg-emerald-400/10',
    },
    {
        role: 'Support',
        roleKey: 'CUSTOMER_SUPPORT',
        email: 'support@example.com',
        icon: Headphones,
        color: 'text-amber-400',
        hoverColor: 'hover:border-amber-400 hover:bg-amber-400/10',
    },
    {
        role: 'Counselor',
        roleKey: 'COUNSELOR',
        email: 'counselor@example.com',
        icon: UserCircle,
        color: 'text-purple-400',
        hoverColor: 'hover:border-purple-400 hover:bg-purple-400/10',
    },
]

const LoginPage = () => {
    const { login, branding, customers } = useAppStore()
    const navigate = useNavigate()

    const activeBranding = { ...DEFAULT_BRANDING, ...(branding || {}) }
    const brandPrimary = isValidHexColor(activeBranding.primaryColor)
        ? activeBranding.primaryColor
        : DEFAULT_BRANDING.primaryColor
    const brandAccent = isValidHexColor(activeBranding.accentColor)
        ? activeBranding.accentColor
        : DEFAULT_BRANDING.accentColor
    const isCustomPrimary = brandPrimary.toUpperCase() !== DEFAULT_BRANDING.primaryColor.toUpperCase()
    const isCustomAccent = brandAccent.toUpperCase() !== DEFAULT_BRANDING.accentColor.toUpperCase()
    const brandPrimaryFg = getContrastTextColor(brandPrimary)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [feedback, setFeedback] = useState(null)

    const customerList = customers && customers.length > 0 ? customers : mockCustomerAccounts

    const resolveAccountForUser = (accountId, roleKey) => {
        if (roleKey === 'SUPER_ADMIN' || accountId === 'platform') {
            return PLATFORM_ACCOUNT
        }
        return (
            customerList.find((acc) => acc.id === accountId) ||
            customerList[0] ||
            PLATFORM_ACCOUNT
        )
    }

    const completeLoginSession = (roleKey, existingProfile, matchedCred, fallbackEmail, fallbackName) => {
        const assignedAccount = resolveAccountForUser(matchedCred?.accountId, roleKey)
        const sessionUser = {
            id: existingProfile?.id || matchedCred?.userId || `usr-${roleKey.toLowerCase()}`,
            name: existingProfile?.name || matchedCred?.name || fallbackName || 'Demo User',
            email: matchedCred?.email || existingProfile?.email || fallbackEmail,
            role: roleKey,
            status: 'Active',
            country: assignedAccount?.country || existingProfile?.country || 'Global',
            accountId: assignedAccount.id,
            companyName: assignedAccount.companyName,
        }

        const frontendRole = ROLE_MAP[roleKey] || roleKey
        const targetPath = `/${getRolePath(roleKey)}/dashboard`

        setFeedback({
            type: 'success',
            message: `Signed in as ${sessionUser.name} (${frontendRole}). Redirecting...`,
        })
        toast.success(`Welcome, ${sessionUser.name}`)

        login(roleKey, sessionUser, assignedAccount)
        navigate(targetPath, { replace: true })
    }

    const validateForm = () => {
        const errors = {}
        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            errors.email = 'Email address is required.'
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = 'Please enter a valid email address.'
        }

        if (!password) {
            errors.password = 'Password is required.'
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters.'
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFeedback(null)

        if (!validateForm()) {
            setFeedback({
                type: 'error',
                message: 'Please fix the highlighted fields before continuing.',
            })
            return
        }

        setIsLoading(true)
        try {
            // Simulated frontend authentication delay (no backend/API)
            await new Promise((resolve) => setTimeout(resolve, 350))

            const normalizedEmail = email.trim().toLowerCase()
            const matchedCred = mockDemoCredentials.find(
                (cred) => cred.email.toLowerCase() === normalizedEmail
            )

            if (!matchedCred || matchedCred.password !== password) {
                const msg = 'Invalid email or password. Please check your credentials.'
                setFeedback({ type: 'error', message: msg })
                toast.error(msg)
                return
            }

            const existingProfile = mockUsers.find(
                (u) => u.email.toLowerCase() === normalizedEmail
            )

            if (existingProfile && existingProfile.status !== 'Active') {
                const msg = 'This demo account is currently inactive.'
                setFeedback({ type: 'error', message: msg })
                toast.error(msg)
                return
            }

            completeLoginSession(
                matchedCred.role,
                existingProfile,
                matchedCred,
                normalizedEmail,
                matchedCred.name
            )
        } catch {
            const msg = 'Login failed. Please check your credentials.'
            setFeedback({ type: 'error', message: msg })
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDemoLogin = async (demoAccount) => {
        setFieldErrors({})
        setFeedback(null)

        const normalizedEmail = demoAccount.email.toLowerCase()
        const matchedCred = mockDemoCredentials.find(
            (cred) => cred.email.toLowerCase() === normalizedEmail
        )
        const existingProfile = mockUsers.find(
            (u) => u.email.toLowerCase() === normalizedEmail
        )

        setEmail(demoAccount.email)
        setPassword(matchedCred?.password || 'Demo@123')
        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 250))
            const roleKey = matchedCred?.role || existingProfile?.role || demoAccount.roleKey
            completeLoginSession(
                roleKey,
                existingProfile,
                matchedCred,
                demoAccount.email,
                demoAccount.role
            )
        } catch {
            const msg = 'Demo login failed. Please try again.'
            setFeedback({ type: 'error', message: msg })
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const subtitleText =
        activeBranding.companyName && activeBranding.companyName !== activeBranding.appName
            ? activeBranding.companyName
            : 'Employee Monitoring'

    return (
        <div className="min-h-[100dvh] lg:h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-16 items-center relative z-10">
                {/* Left Side: Branding */}
                <div className="space-y-8">
                    <div className="space-y-6 hidden lg:block">
                        <div className="flex items-center gap-3">
                            {activeBranding.logoDataUrl && (
                                <img
                                    src={activeBranding.logoDataUrl}
                                    alt={`${activeBranding.appName} logo`}
                                    className="h-11 w-11 rounded-xl object-contain bg-white/5 border border-white/10 p-1 shrink-0"
                                />
                            )}
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex flex-col">
                                    <span className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-none">
                                        {activeBranding.appName || 'WhatsApp CRM'}
                                    </span>
                                    <span
                                        className="text-xs lg:text-sm font-bold text-indigo-400 uppercase tracking-widest mt-2"
                                        style={isCustomAccent ? { color: brandAccent } : undefined}
                                    >
                                        {subtitleText}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                            Identity{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                                Gateway
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                            Access the global multi-channel communication cluster. Integrated intelligence for modern lead orchestration.
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-6 rounded-[2rem] shadow-2xl flex flex-col gap-5"
                >
                    <div className="text-center md:text-left flex flex-col gap-1">
                        {/* Mobile Logo & Brand (visible only on mobile/tablet) */}
                        <div className="flex flex-col items-center gap-1 lg:hidden mb-4">
                            {activeBranding.logoDataUrl && (
                                <img
                                    src={activeBranding.logoDataUrl}
                                    alt={`${activeBranding.appName} logo`}
                                    className="h-10 w-10 rounded-xl object-contain bg-white/5 border border-white/10 p-1 mb-1"
                                />
                            )}
                            <div className="text-center">
                                <h1 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                                    {activeBranding.appName || 'WhatsApp CRM'}
                                </h1>
                                <p
                                    className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1"
                                    style={isCustomAccent ? { color: brandAccent } : undefined}
                                >
                                    {subtitleText}
                                </p>
                            </div>
                        </div>

                        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                            Establish Session
                        </h2>
                        <p className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            Enter credentials to initialize access
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div
                                key={feedback.type + feedback.message}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                role="alert"
                                className={`p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${
                                    feedback.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                                }`}
                            >
                                {feedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="login-email"
                                    className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] px-2"
                                >
                                    Access Credentials
                                </label>
                                <div className="relative group">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none"
                                        size={16}
                                    />
                                    <input
                                        id="login-email"
                                        type="email"
                                        autoComplete="email"
                                        inputMode="email"
                                        value={email}
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setFieldErrors((prev) => ({ ...prev, email: undefined }))
                                            if (feedback?.type === 'error') setFeedback(null)
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl py-3 pl-12 pr-4 text-xs font-black text-white tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-700 disabled:opacity-50 ${
                                            fieldErrors.email ? 'border-red-500/60' : 'border-white/10'
                                        }`}
                                        placeholder="IDENTITY ADDRESS"
                                        required
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="text-[11px] text-red-400 px-2 font-medium">{fieldErrors.email}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none"
                                        size={16}
                                    />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setFieldErrors((prev) => ({ ...prev, password: undefined }))
                                            if (feedback?.type === 'error') setFeedback(null)
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl py-3 pl-12 ${
                                            password ? 'pr-11' : 'pr-4'
                                        } text-xs font-black text-white tracking-[0.5em] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all disabled:opacity-50 ${
                                            fieldErrors.password ? 'border-red-500/60' : 'border-white/10'
                                        }`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {password && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    )}
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-[11px] text-red-400 px-2 font-medium">{fieldErrors.password}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={isCustomPrimary ? { backgroundColor: brandPrimary, color: brandPrimaryFg } : undefined}
                            className={`w-full py-3 mt-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed ${
                                isCustomPrimary
                                    ? 'hover:brightness-110'
                                    : 'bg-white text-black hover:bg-indigo-500 hover:text-white'
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <span>Initialize Access</span>
                                    <ArrowRight
                                        className="group-hover:translate-x-1 transition-transform"
                                        size={16}
                                        strokeWidth={3}
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                        <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                            Quick Access Demo
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.roleKey}
                                    type="button"
                                    onClick={() => handleDemoLogin(account)}
                                    disabled={isLoading}
                                    className={`bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group ${account.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <div
                                        className={`p-1 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors ${account.color}`}
                                    >
                                        <account.icon size={14} />
                                    </div>
                                    <span className="text-[7px] font-black text-white uppercase tracking-widest text-center leading-tight">
                                        {account.role}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginPage
