import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail,
    Lock,
    ArrowRight,
    Building2,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    Info,
    ArrowLeft,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { mockCustomerAccounts, mockDemoCredentials, mockUsers } from '../../mock/mockData'
import useAppStore, { PLATFORM_ACCOUNT, ROLE_MAP, getRolePath } from '../../store/useStore'
import { toast } from '../../components/ui/Toast'
import { DEFAULT_BRANDING, getContrastTextColor, isValidHexColor } from '../../lib/brandingUtils'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginPage = () => {
    const { login, branding } = useAppStore()
    const navigate = useNavigate()

    const activeBranding = { ...DEFAULT_BRANDING, ...(branding || {}) }
    const brandPrimary = isValidHexColor(activeBranding.primaryColor)
        ? activeBranding.primaryColor
        : DEFAULT_BRANDING.primaryColor
    const brandAccent = isValidHexColor(activeBranding.accentColor)
        ? activeBranding.accentColor
        : DEFAULT_BRANDING.accentColor
    const isCustomPrimary = brandPrimary.toUpperCase() !== DEFAULT_BRANDING.primaryColor.toUpperCase()
    const brandPrimaryFg = getContrastTextColor(brandPrimary)

    const [selectedAccountId, setSelectedAccountId] = useState(mockCustomerAccounts[0].id)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showDemoInfo, setShowDemoInfo] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [feedback, setFeedback] = useState(null) // { type: 'error' | 'success', message: string }

    const accountOptions = [PLATFORM_ACCOUNT, ...mockCustomerAccounts]
    const activeAccount =
        accountOptions.find((acc) => acc.id === selectedAccountId) || mockCustomerAccounts[0]

    const validateForm = () => {
        const errors = {}
        const trimmedEmail = email.trim()

        if (!selectedAccountId) {
            errors.account = 'Please select a software or customer account.'
        }

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
            await new Promise((resolve) => setTimeout(resolve, 450))

            const normalizedEmail = email.trim().toLowerCase()
            const matchedCred = mockDemoCredentials.find(
                (cred) => cred.email.toLowerCase() === normalizedEmail
            )

            if (!matchedCred || matchedCred.password !== password) {
                const msg = 'Invalid email or password. Please verify your demo credentials.'
                setFeedback({ type: 'error', message: msg })
                toast.error(msg)
                setIsLoading(false)
                return
            }

            // Enforce customer account scope for non-platform demo credentials
            if (
                matchedCred.allowedAccountIds &&
                !matchedCred.allowedAccountIds.includes(selectedAccountId)
            ) {
                const assignedAccount =
                    accountOptions.find((acc) => acc.id === matchedCred.accountId) ||
                    mockCustomerAccounts[0]
                const msg = `This account is registered under "${assignedAccount.companyName}". Please select the matching customer account.`
                setFeedback({ type: 'error', message: msg })
                toast.error(msg)
                setIsLoading(false)
                return
            }

            const existingProfile = mockUsers.find(
                (u) => u.email.toLowerCase() === normalizedEmail
            )

            if (existingProfile && existingProfile.status !== 'Active') {
                const msg = 'This demo account is currently inactive.'
                setFeedback({ type: 'error', message: msg })
                toast.error(msg)
                setIsLoading(false)
                return
            }

            const sessionUser = {
                id: existingProfile?.id || matchedCred.userId,
                name: existingProfile?.name || matchedCred.name,
                email: matchedCred.email,
                role: matchedCred.role,
                status: 'Active',
                country: activeAccount?.country || existingProfile?.country || 'Global',
                accountId: activeAccount.id,
                companyName: activeAccount.companyName,
            }

            const frontendRole = ROLE_MAP[matchedCred.role] || matchedCred.role
            const targetPath = `/${getRolePath(matchedCred.role)}/dashboard`

            setFeedback({
                type: 'success',
                message: `Signed in as ${sessionUser.name} (${frontendRole}) • ${activeAccount.companyName}. Redirecting...`,
            })
            toast.success(`Welcome, ${sessionUser.name}`)

            login(matchedCred.role, sessionUser, activeAccount)
            navigate(targetPath, { replace: true })
        } catch {
            const msg = 'Unable to initialize demo session. Please try again.'
            setFeedback({ type: 'error', message: msg })
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[#020617] flex flex-col justify-center px-4 py-6 sm:p-6 relative overflow-x-hidden overflow-y-auto">
            {/* Background Animations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-5xl mx-auto relative z-10">
                <div className="mb-4 lg:mb-6 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors py-2"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Website</span>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                        Frontend Demo Mode
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr,430px] gap-8 lg:gap-14 items-center">
                    {/* Left Side: Branding */}
                    <div className="space-y-6 hidden lg:block">
                        <div className="flex items-center gap-3.5">
                            {activeBranding.logoDataUrl && (
                                <img
                                    src={activeBranding.logoDataUrl}
                                    alt={`${activeBranding.appName} logo`}
                                    className="h-12 w-12 rounded-2xl object-contain bg-white/5 border border-white/10 p-1.5 shrink-0"
                                />
                            )}
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-3xl font-black text-white uppercase tracking-tight leading-none">
                                    {activeBranding.appName || 'WhatsApp CRM'}
                                </span>
                                <span
                                    className="text-sm font-bold uppercase tracking-widest mt-1"
                                    style={{ color: brandAccent }}
                                >
                                    {activeBranding.companyName && activeBranding.companyName !== activeBranding.appName
                                        ? `${activeBranding.companyName} • Workspace Access`
                                        : 'Centralized Workspace Access'}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                            Identity{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                                Gateway
                            </span>
                        </h1>
                        <p className="text-gray-400 text-base font-medium leading-relaxed max-w-md">
                            Sign in to a customer software workspace or platform administration console to preview role-based WhatsApp CRM workflows.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                Selected Software Account
                            </p>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-white truncate">
                                    {activeAccount.companyName}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
                                    {activeAccount.planTier}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Workspace: <span className="text-slate-200 font-semibold">{activeAccount.workspaceCode}</span> • {activeAccount.industry}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Centralized Login Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 sm:p-6 md:p-7 rounded-[2rem] shadow-2xl flex flex-col gap-5"
                    >
                        <div className="text-center lg:text-left flex flex-col gap-1">
                            {/* Mobile & Tablet Header */}
                            <div className="flex flex-col items-center gap-2 lg:hidden mb-3">
                                {activeBranding.logoDataUrl && (
                                    <img
                                        src={activeBranding.logoDataUrl}
                                        alt={`${activeBranding.appName} logo`}
                                        className="h-11 w-11 rounded-xl object-contain bg-white/5 border border-white/10 p-1"
                                    />
                                )}
                                <h1 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                                    {activeBranding.appName || 'WhatsApp CRM'}
                                </h1>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: brandAccent }}>
                                    {activeBranding.companyName || 'Centralized Workspace Access'}
                                </p>
                            </div>

                            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                                Establish Session
                            </h2>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Select a software account and sign in
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {feedback && (
                                <motion.div
                                    key={feedback.type + feedback.message}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    role="alert"
                                    className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs font-semibold leading-snug ${
                                        feedback.type === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                                    }`}
                                >
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                                    ) : (
                                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                                    )}
                                    <span>{feedback.message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                            {/* Software / Customer Account Selector */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="customer-account-select"
                                    className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1"
                                >
                                    Software / Customer Account
                                </label>
                                <div className="relative group">
                                    <Building2
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none"
                                        size={16}
                                    />
                                    <select
                                        id="customer-account-select"
                                        value={selectedAccountId}
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            setSelectedAccountId(e.target.value)
                                            setFieldErrors((prev) => ({ ...prev, account: undefined }))
                                            setFeedback(null)
                                        }}
                                        className={`w-full min-h-[46px] bg-[#0B1224] border rounded-xl py-3 pl-11 pr-10 text-sm font-semibold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 ${
                                            fieldErrors.account ? 'border-rose-500/70' : 'border-white/10'
                                        }`}
                                    >
                                        {accountOptions.map((account) => (
                                            <option key={account.id} value={account.id} className="bg-[#0B1224] text-white">
                                                {account.companyName} ({account.planTier})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                                {/* Compact active account metadata pill */}
                                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                                    <span className="truncate font-medium">
                                        {activeAccount.whatsappNumber || activeAccount.industry}
                                    </span>
                                    <span className="text-[11px] font-bold text-indigo-300 shrink-0">
                                        {activeAccount.workspaceCode}
                                    </span>
                                </div>
                                {fieldErrors.account && (
                                    <p className="text-xs text-rose-400 px-1 font-medium">{fieldErrors.account}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="login-email"
                                    className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1"
                                >
                                    Access Email
                                </label>
                                <div className="relative group">
                                    <Mail
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none"
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
                                        className={`w-full min-h-[46px] bg-white/5 border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-500 disabled:opacity-50 ${
                                            fieldErrors.email ? 'border-rose-500/70' : 'border-white/10'
                                        }`}
                                        placeholder="name@company.com"
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="text-xs text-rose-400 px-1 font-medium">{fieldErrors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="login-password"
                                    className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1"
                                >
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none"
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
                                        className={`w-full min-h-[46px] bg-white/5 border rounded-xl py-3 pl-11 pr-11 text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-500 disabled:opacity-50 ${
                                            fieldErrors.password ? 'border-rose-500/70' : 'border-white/10'
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-xs text-rose-400 px-1 font-medium">{fieldErrors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={isCustomPrimary ? { backgroundColor: brandPrimary, color: brandPrimaryFg } : undefined}
                                className={`w-full min-h-[48px] py-3 mt-1 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCustomPrimary
                                        ? 'hover:brightness-110'
                                        : 'bg-white text-black hover:bg-indigo-500 hover:text-white'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>Verifying Session...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Workspace</span>
                                        <ArrowRight
                                            className="group-hover:translate-x-1 transition-transform"
                                            size={16}
                                            strokeWidth={3}
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Understated Demo Reference (no one-click bypass or role switcher) */}
                        <div className="pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setShowDemoInfo((prev) => !prev)}
                                className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <Info size={14} className="text-indigo-400" />
                                    Demo Credentials Reference
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${showDemoInfo ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {showDemoInfo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs text-slate-300">
                                            <div>
                                                <p className="font-bold text-white">Super Admin (Platform or Any Account)</p>
                                                <p className="text-slate-400 break-all">superadmin@example.com / Super@123</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Customer Admin (Apex Digital Solutions)</p>
                                                <p className="text-slate-400 break-all">admin@example.com / Admin@123</p>
                                            </div>
                                            <p className="text-[11px] text-slate-500 pt-1 border-t border-white/5">
                                                UI demonstration only — no live backend authentication.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
