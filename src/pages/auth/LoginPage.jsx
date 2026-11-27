import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    UserCircle,
    Building2,
    Globe,
    Users,
    Activity,
    Headphones,
    BrainCircuit,
    Zap,
    Loader2,
    Settings
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { mockUsers } from '../../mock/mockData'
import useAppStore, { ROLE_MAP } from '../../store/useStore'
import { useNavigate } from 'react-router-dom'

const roleHomePages = {
    'Super Admin': '/super-admin/dashboard',
    'Admin': '/admin/dashboard',
    'Manager': '/manager/dashboard',
    'Team Leader': '/team-leader/dashboard',
    'Counselor': '/counselor/dashboard',
    'Customer Support': '/support/dashboard',
}

const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@example.com', icon: ShieldCheck, color: 'text-rose-400', hoverColor: 'hover:border-rose-400 hover:bg-rose-400/10' },
    { role: 'Admin', email: 'admin@example.com', icon: Settings, color: 'text-indigo-400', hoverColor: 'hover:border-indigo-400 hover:bg-indigo-400/10' },
    { role: 'Manager', email: 'manager@example.com', icon: Building2, color: 'text-blue-400', hoverColor: 'hover:border-blue-400 hover:bg-blue-400/10' },
    { role: 'Team Leader', email: 'teamleader@example.com', icon: Users, color: 'text-emerald-400', hoverColor: 'hover:border-emerald-400 hover:bg-emerald-400/10' },
    { role: 'Support', email: 'support@example.com', icon: Headphones, color: 'text-amber-400', hoverColor: 'hover:border-amber-400 hover:bg-amber-400/10' },
    { role: 'Counselor', email: 'counselor@example.com', icon: UserCircle, color: 'text-purple-400', hoverColor: 'hover:border-purple-400 hover:bg-purple-400/10' },
];

const LoginPage = () => {
    const { login } = useAppStore()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const performLogin = async (loginEmail, loginPassword) => {
        setIsLoading(true)
        setError('')
        try {
            await new Promise((resolve) => setTimeout(resolve, 350))
            const normalizedEmail = loginEmail.trim().toLowerCase()
            
            // Find existing mock user or construct user session
            let user = mockUsers.find((u) => u.email.toLowerCase() === normalizedEmail)
            if (!user) {
                user = {
                    id: 'usr-demo-' + Math.floor(Math.random() * 1000),
                    name: loginEmail.split('@')[0] || 'Demo User',
                    email: normalizedEmail,
                    role: 'SUPER_ADMIN',
                    status: 'Active',
                    country: 'Global'
                }
            }

            // Map role enum (e.g., 'SUPER_ADMIN') to frontend display role
            const frontendRole = ROLE_MAP[user.role] || user.role || 'Super Admin'

            // Update Zustand store and localStorage
            login(frontendRole, user)

            const homePath = roleHomePages[frontendRole] || '/super-admin/dashboard'
            navigate(homePath)
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await performLogin(email, password)
    }

    const handleDemoLogin = (demoEmail) => {
        setEmail(demoEmail)
        setPassword('password123')
        performLogin(demoEmail, 'password123')
    }

    return (
        <div className="h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-16 items-center relative z-10">
                {/* Left Side: Branding & Demo Accounts */}
                <div className="space-y-8">
                    <div className="space-y-6 hidden lg:block">
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex flex-col">
                                <span className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-none">WhatsApp CRM</span>
                                <span className="text-xs lg:text-sm font-bold text-indigo-400 uppercase tracking-widest mt-2">Employee Monitoring</span>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Gateway</span>
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
                            <div className="text-center">
                                <h1 className="text-lg font-black text-white uppercase tracking-tight leading-none">WhatsApp CRM</h1>
                                <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Employee Monitoring</p>
                            </div>
                        </div>

                        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Establish Session</h2>
                        <p className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest">Enter credentials to initialize access</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Access Credentials</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-black text-white tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="IDENTITY ADDRESS"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-black text-white tracking-[0.5em] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white py-3 mt-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <span>Initialize Access</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                        <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Quick Access Demo</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {demoAccounts.map((account, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleDemoLogin(account.email)}
                                    disabled={isLoading}
                                    className={`bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group ${account.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <div className={`p-1 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors ${account.color}`}>
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



