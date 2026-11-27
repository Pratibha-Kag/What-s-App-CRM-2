import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    User,
    Mail,
    Lock,
    Palette,
    Upload,
    RotateCcw,
    CheckCircle2,
    X,
    Eye,
    EyeOff,
    Sparkles,
    Building2,
} from 'lucide-react';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import { toast } from '../components/ui/Toast';
import {
    DEFAULT_BRANDING,
    getContrastRatio,
    getContrastTextColor,
    isValidHexColor,
    readFileAsDataUrl,
    validateLogoFile,
} from '../lib/brandingUtils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Settings = () => {
    const {
        role,
        user,
        branding,
        setBranding,
        resetBranding,
        updateUserProfile,
    } = useAppStore();

    const canView = ['SUPER_ADMIN'].includes(normalizeRoleKey(role));
    const logoInputRef = useRef(null);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Super Admin',
        email: user?.email || 'superadmin@example.com',
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [profileFeedback, setProfileFeedback] = useState(null);

    // Simulated Password Update Panel State (never persisted to localStorage)
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPwFields, setShowPwFields] = useState({
        current: false,
        next: false,
        confirm: false,
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordFeedback, setPasswordFeedback] = useState(null);

    // White-Label Branding Draft State
    const [brandingDraft, setBrandingDraft] = useState(() => ({ ...DEFAULT_BRANDING, ...(branding || {}) }));
    const [brandingErrors, setBrandingErrors] = useState({});
    const [brandingFeedback, setBrandingFeedback] = useState(null);

    useEffect(() => {
        setProfileData({
            name: user?.name || 'Super Admin',
            email: user?.email || 'superadmin@example.com',
        });
    }, [user?.name, user?.email]);

    useEffect(() => {
        setBrandingDraft({ ...DEFAULT_BRANDING, ...(branding || {}) });
    }, [branding]);

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400 mb-2">
                        You do not have the required permissions to access system settings.
                    </p>
                </div>
            </div>
        );
    }

    // Profile Save Handler (Frontend-Only Demo State)
    const handleSaveProfile = (e) => {
        e.preventDefault();
        setProfileFeedback(null);
        const errors = {};
        const trimmedName = profileData.name.trim();
        const trimmedEmail = profileData.email.trim();

        if (!trimmedName || trimmedName.length < 2) {
            errors.name = 'Full name must be at least 2 characters.';
        }
        if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
            errors.email = 'Please enter a valid email address.';
        }

        setProfileErrors(errors);
        if (Object.keys(errors).length > 0) {
            setProfileFeedback({ type: 'error', message: 'Please correct the highlighted profile fields.' });
            return;
        }

        updateUserProfile({ name: trimmedName, email: trimmedEmail });
        setProfileFeedback({ type: 'success', message: 'Profile details updated for this demo session.' });
        toast.success('Profile settings saved.');
    };

    // Simulated Password Update Handler (Does NOT persist passwords anywhere)
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setPasswordFeedback(null);
        const errors = {};

        if (!passwordForm.currentPassword) {
            errors.currentPassword = 'Current password is required.';
        }
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters.';
        }
        if (passwordForm.confirmPassword !== passwordForm.newPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        setPasswordErrors(errors);
        if (Object.keys(errors).length > 0) {
            setPasswordFeedback({ type: 'error', message: 'Please fix the validation errors below.' });
            return;
        }

        // Clear password fields immediately; never persist passwords in localStorage
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
        toast.success('Password update simulated (frontend demo only — not stored).');
        setProfileFeedback({
            type: 'success',
            message: 'Simulated password update completed. No credentials are stored in browser storage.',
        });
    };

    // Logo Upload Handler
    const handleLogoSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateLogoFile(file);
        if (!validation.valid) {
            setBrandingErrors((prev) => ({ ...prev, logo: validation.error }));
            setBrandingFeedback({ type: 'error', message: validation.error });
            toast.error(validation.error);
            if (logoInputRef.current) logoInputRef.current.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            setBrandingDraft((prev) => ({ ...prev, logoDataUrl: dataUrl }));
            setBrandingErrors((prev) => ({ ...prev, logo: undefined }));
            setBrandingFeedback({ type: 'success', message: `Logo "${file.name}" loaded into preview. Click Save Changes to apply.` });
        } catch (err) {
            const msg = err.message || 'Could not read logo image.';
            setBrandingErrors((prev) => ({ ...prev, logo: msg }));
            setBrandingFeedback({ type: 'error', message: msg });
            toast.error(msg);
        }
    };

    const handleRemoveLogo = () => {
        setBrandingDraft((prev) => ({ ...prev, logoDataUrl: null }));
        setBrandingErrors((prev) => ({ ...prev, logo: undefined }));
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const validateBrandingDraft = () => {
        const errors = {};
        if (!brandingDraft.companyName.trim()) {
            errors.companyName = 'Company name is required.';
        } else if (brandingDraft.companyName.trim().length > 50) {
            errors.companyName = 'Company name must be 50 characters or fewer.';
        }

        if (!brandingDraft.appName.trim()) {
            errors.appName = 'Application display name is required.';
        } else if (brandingDraft.appName.trim().length > 40) {
            errors.appName = 'Application display name must be 40 characters or fewer.';
        }

        if (!isValidHexColor(brandingDraft.primaryColor)) {
            errors.primaryColor = 'Primary color must be a valid 6-digit hex (e.g. #8B5CF6).';
        }
        if (!isValidHexColor(brandingDraft.accentColor)) {
            errors.accentColor = 'Accent color must be a valid 6-digit hex (e.g. #10B981).';
        }

        setBrandingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveBranding = () => {
        setBrandingFeedback(null);
        if (!validateBrandingDraft()) {
            setBrandingFeedback({ type: 'error', message: 'Please fix the highlighted branding fields.' });
            toast.error('Invalid branding configuration.');
            return;
        }

        const sanitized = {
            ...brandingDraft,
            companyName: brandingDraft.companyName.trim(),
            appName: brandingDraft.appName.trim(),
        };
        setBranding(sanitized);
        setBrandingFeedback({ type: 'success', message: 'White-label branding saved and applied across the workspace.' });
        toast.success('Branding settings saved.');
    };

    const handleCancelBranding = () => {
        setBrandingDraft({ ...DEFAULT_BRANDING, ...(branding || {}) });
        setBrandingErrors({});
        setBrandingFeedback({ type: 'info', message: 'Unsaved branding changes discarded.' });
        if (logoInputRef.current) logoInputRef.current.value = '';
        toast.info('Unsaved branding changes discarded.');
    };

    const handleResetBranding = () => {
        resetBranding();
        setBrandingDraft({ ...DEFAULT_BRANDING });
        setBrandingErrors({});
        setBrandingFeedback({ type: 'success', message: 'Branding restored to application defaults.' });
        if (logoInputRef.current) logoInputRef.current.value = '';
        toast.success('Branding reset to default.');
    };

    const previewPrimary = isValidHexColor(brandingDraft.primaryColor)
        ? brandingDraft.primaryColor
        : DEFAULT_BRANDING.primaryColor;
    const previewAccent = isValidHexColor(brandingDraft.accentColor)
        ? brandingDraft.accentColor
        : DEFAULT_BRANDING.accentColor;
    const previewPrimaryFg = getContrastTextColor(previewPrimary);
    const previewAccentFg = getContrastTextColor(previewAccent);
    const primaryContrast = getContrastRatio(previewPrimary, previewPrimaryFg);

    const hasUnsavedBranding =
        brandingDraft.companyName !== branding?.companyName ||
        brandingDraft.appName !== branding?.appName ||
        brandingDraft.logoDataUrl !== branding?.logoDataUrl ||
        brandingDraft.primaryColor !== branding?.primaryColor ||
        brandingDraft.accentColor !== branding?.accentColor;

    return (
        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-[#111318] min-h-full pb-20 text-white">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-white tracking-tight mb-1">System Configuration</h1>
                <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">
                    Global Infrastructure & Preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Profile Section */}
                <motion.form
                    onSubmit={handleSaveProfile}
                    noValidate
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1C1F26] p-5 sm:p-6 rounded-3xl border border-[#2D333B] lg:col-span-2"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-white uppercase tracking-widest">My Profile</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Personal Account Settings
                            </p>
                        </div>
                    </div>

                    {profileFeedback && (
                        <div
                            role="alert"
                            className={`mb-5 p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold ${
                                profileFeedback.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                            }`}
                        >
                            {profileFeedback.type === 'success' ? (
                                <CheckCircle2 size={16} className="shrink-0" />
                            ) : (
                                <AlertCircle size={16} className="shrink-0" />
                            )}
                            <span>{profileFeedback.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                            <label htmlFor="profile-name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="profile-name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => {
                                        setProfileData({ ...profileData, name: e.target.value });
                                        setProfileErrors((prev) => ({ ...prev, name: undefined }));
                                    }}
                                    className="w-full min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all"
                                />
                            </div>
                            {profileErrors.name && (
                                <p className="text-xs text-rose-400 mt-2 font-medium">{profileErrors.name}</p>
                            )}
                        </div>

                        <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                            <label htmlFor="profile-email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="profile-email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => {
                                        setProfileData({ ...profileData, email: e.target.value });
                                        setProfileErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    className="w-full min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all"
                                />
                            </div>
                            {profileErrors.email && (
                                <p className="text-xs text-rose-400 mt-2 font-medium">{profileErrors.email}</p>
                            )}
                        </div>

                        <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B] md:col-span-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <h3 className="text-[14px] font-bold text-white">Account Password</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                    Change your login password (demo simulation)
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPasswordFeedback(null);
                                    setPasswordErrors({});
                                    setShowPasswordModal(true);
                                }}
                                className="flex items-center justify-center gap-2 min-h-[44px] bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-colors w-full sm:w-auto"
                            >
                                <Lock size={14} /> Update
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="w-full sm:w-auto min-h-[44px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        >
                            Save Changes
                        </button>
                    </div>
                </motion.form>

                {/* White-Label Branding Section (Super Admin Only) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-[#1C1F26] p-5 sm:p-6 rounded-3xl border border-[#2D333B] lg:col-span-2"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#10B981]/10 text-[#10B981] rounded-2xl flex items-center justify-center border border-[#10B981]/20 shrink-0">
                                <Palette size={24} />
                            </div>
                            <div>
                                <h2 className="text-[16px] font-black text-white uppercase tracking-widest">
                                    White-Label Branding
                                </h2>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    Customize Company Identity, Logo & Theme Colors (Demo Persistence)
                                </p>
                            </div>
                        </div>
                        {hasUnsavedBranding && (
                            <span className="self-start sm:self-center text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                                Unsaved Draft
                            </span>
                        )}
                    </div>

                    {brandingFeedback && (
                        <div
                            role="alert"
                            className={`mb-5 p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold ${
                                brandingFeedback.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                    : brandingFeedback.type === 'info'
                                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                            }`}
                        >
                            {brandingFeedback.type === 'error' ? (
                                <AlertCircle size={16} className="shrink-0" />
                            ) : (
                                <CheckCircle2 size={16} className="shrink-0" />
                            )}
                            <span>{brandingFeedback.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Left Column: Branding Inputs */}
                        <div className="xl:col-span-7 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                                    <label htmlFor="branding-company-name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="branding-company-name"
                                            type="text"
                                            value={brandingDraft.companyName}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, companyName: e.target.value });
                                                setBrandingErrors((prev) => ({ ...prev, companyName: undefined }));
                                            }}
                                            placeholder="WhatsApp CRM"
                                            className="w-full min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all"
                                        />
                                    </div>
                                    {brandingErrors.companyName && (
                                        <p className="text-xs text-rose-400 mt-2 font-medium">{brandingErrors.companyName}</p>
                                    )}
                                </div>

                                <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                                    <label htmlFor="branding-app-name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                        Application Display Name
                                    </label>
                                    <div className="relative">
                                        <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="branding-app-name"
                                            type="text"
                                            value={brandingDraft.appName}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, appName: e.target.value });
                                                setBrandingErrors((prev) => ({ ...prev, appName: undefined }));
                                            }}
                                            placeholder="WhatsApp CRM"
                                            className="w-full min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all"
                                        />
                                    </div>
                                    {brandingErrors.appName && (
                                        <p className="text-xs text-rose-400 mt-2 font-medium">{brandingErrors.appName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B] space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label htmlFor="branding-logo-upload" className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Company Logo (PNG, JPG, WEBP, SVG • Max 1 MB)
                                    </label>
                                    {brandingDraft.logoDataUrl && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
                                        >
                                            <X size={14} /> Remove Logo
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#16181D] border border-[#2D333B] flex items-center justify-center overflow-hidden shrink-0">
                                        {brandingDraft.logoDataUrl ? (
                                            <img
                                                src={brandingDraft.logoDataUrl}
                                                alt="Brand logo preview"
                                                className="w-full h-full object-contain p-1.5"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-500">Default</span>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={logoInputRef}
                                            id="branding-logo-upload"
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                                            onChange={handleLogoSelect}
                                            className="sr-only"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => logoInputRef.current?.click()}
                                            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors w-full sm:w-auto"
                                        >
                                            <Upload size={15} /> Select Logo Image
                                        </button>
                                        <p className="text-xs text-slate-500">
                                            Stored locally in browser storage for demo preview only.
                                        </p>
                                    </div>
                                </div>

                                {brandingErrors.logo && (
                                    <p className="text-xs text-rose-400 font-medium">{brandingErrors.logo}</p>
                                )}
                            </div>

                            {/* Colors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                                    <label htmlFor="branding-primary-color" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                        Primary Brand Color
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            aria-label="Primary color picker"
                                            type="color"
                                            value={previewPrimary}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, primaryColor: e.target.value.toUpperCase() });
                                                setBrandingErrors((prev) => ({ ...prev, primaryColor: undefined }));
                                            }}
                                            className="h-11 w-12 rounded-xl bg-transparent border border-[#2D333B] cursor-pointer shrink-0 p-1"
                                        />
                                        <input
                                            id="branding-primary-color"
                                            type="text"
                                            value={brandingDraft.primaryColor}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, primaryColor: e.target.value });
                                                setBrandingErrors((prev) => ({ ...prev, primaryColor: undefined }));
                                            }}
                                            placeholder="#8B5CF6"
                                            className="flex-1 min-w-0 min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2">
                                        Auto text contrast: <span className="text-slate-300 font-semibold">{primaryContrast}:1</span> ({previewPrimaryFg})
                                    </p>
                                    {brandingErrors.primaryColor && (
                                        <p className="text-xs text-rose-400 mt-1.5 font-medium">{brandingErrors.primaryColor}</p>
                                    )}
                                </div>

                                <div className="p-4 sm:p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                                    <label htmlFor="branding-accent-color" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                                        Accent Color
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            aria-label="Accent color picker"
                                            type="color"
                                            value={previewAccent}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, accentColor: e.target.value.toUpperCase() });
                                                setBrandingErrors((prev) => ({ ...prev, accentColor: undefined }));
                                            }}
                                            className="h-11 w-12 rounded-xl bg-transparent border border-[#2D333B] cursor-pointer shrink-0 p-1"
                                        />
                                        <input
                                            id="branding-accent-color"
                                            type="text"
                                            value={brandingDraft.accentColor}
                                            onChange={(e) => {
                                                setBrandingDraft({ ...brandingDraft, accentColor: e.target.value });
                                                setBrandingErrors((prev) => ({ ...prev, accentColor: undefined }));
                                            }}
                                            placeholder="#10B981"
                                            className="flex-1 min-w-0 min-h-[44px] bg-[#16181D] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2">
                                        Used for active status highlights and badges.
                                    </p>
                                    {brandingErrors.accentColor && (
                                        <p className="text-xs text-rose-400 mt-1.5 font-medium">{brandingErrors.accentColor}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Branding Preview */}
                        <div className="xl:col-span-5 bg-[#111318] border border-[#2D333B] rounded-2xl p-5 flex flex-col justify-between gap-5">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                    Live Branding Preview
                                </p>
                                <div className="rounded-2xl border border-[#2D333B] bg-[#16181D] overflow-hidden">
                                    {/* Mini Topbar Preview */}
                                    <div className="px-4 py-3 bg-[#111318] border-b border-[#2D333B] flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {brandingDraft.logoDataUrl ? (
                                                <img
                                                    src={brandingDraft.logoDataUrl}
                                                    alt="Preview logo"
                                                    className="h-7 w-7 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                                                />
                                            ) : (
                                                <div
                                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                                                    style={{ backgroundColor: previewPrimary, color: previewPrimaryFg }}
                                                >
                                                    {(brandingDraft.appName || 'W').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white truncate">
                                                    {brandingDraft.appName || 'WhatsApp CRM'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate">
                                                    {brandingDraft.companyName || 'WhatsApp CRM'}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
                                            style={{ backgroundColor: previewAccent, color: previewAccentFg }}
                                        >
                                            Online
                                        </span>
                                    </div>

                                    {/* Mini Sidebar / Action Preview */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="px-3 py-2 rounded-xl text-xs font-bold flex-1 text-center"
                                                style={{ backgroundColor: previewPrimary, color: previewPrimaryFg }}
                                            >
                                                Primary Action
                                            </div>
                                            <div
                                                className="px-3 py-2 rounded-xl text-xs font-bold border"
                                                style={{ borderColor: previewAccent, color: previewAccent }}
                                            >
                                                Accent Tag
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Preview updates Sidebar, Topbar, and Login Gateway branding when saved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#2D333B]">
                                <button
                                    type="button"
                                    onClick={handleResetBranding}
                                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#2D333B] bg-[#16181D] hover:border-slate-500 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors flex-1 sm:flex-none"
                                >
                                    <RotateCcw size={14} /> Reset to Default
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelBranding}
                                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl border border-[#2D333B] bg-transparent hover:bg-[#1C1F26] text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors flex-1 sm:flex-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveBranding}
                                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg w-full sm:w-auto"
                                    style={{ backgroundColor: previewPrimary, color: previewPrimaryFg }}
                                >
                                    Save Branding
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Simulated Password Update Modal */}
            {showPasswordModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowPasswordModal(false)}
                >
                    <div
                        className="w-full max-w-md bg-[#1C1F26] border border-[#2D333B] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90dvh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black text-white uppercase tracking-wider">
                                    Update Password
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Frontend simulation only — passwords are never saved.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(false)}
                                aria-label="Close password dialog"
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111318]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {passwordFeedback && (
                            <div
                                role="alert"
                                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300 font-semibold"
                            >
                                {passwordFeedback.message}
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} noValidate className="space-y-4">
                            {[
                                {
                                    key: 'currentPassword',
                                    visKey: 'current',
                                    label: 'Current Password',
                                    placeholder: 'Enter current password',
                                },
                                {
                                    key: 'newPassword',
                                    visKey: 'next',
                                    label: 'New Password',
                                    placeholder: 'Minimum 6 characters',
                                },
                                {
                                    key: 'confirmPassword',
                                    visKey: 'confirm',
                                    label: 'Confirm New Password',
                                    placeholder: 'Re-enter new password',
                                },
                            ].map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPwFields[field.visKey] ? 'text' : 'password'}
                                            value={passwordForm[field.key]}
                                            onChange={(e) => {
                                                setPasswordForm({ ...passwordForm, [field.key]: e.target.value });
                                                setPasswordErrors((prev) => ({ ...prev, [field.key]: undefined }));
                                            }}
                                            placeholder={field.placeholder}
                                            className="w-full min-h-[44px] bg-[#111318] border border-[#2D333B] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPwFields((prev) => ({
                                                    ...prev,
                                                    [field.visKey]: !prev[field.visKey],
                                                }))
                                            }
                                            aria-label={`Toggle ${field.label} visibility`}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white"
                                        >
                                            {showPwFields[field.visKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {passwordErrors[field.key] && (
                                        <p className="text-xs text-rose-400 font-medium">{passwordErrors[field.key]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 min-h-[44px] rounded-xl border border-[#2D333B] text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#111318]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 min-h-[44px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-wider"
                                >
                                    Simulate Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
