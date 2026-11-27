import React, { useState } from 'react';
import { ChevronDown, Bell, Search, Command, User, LogOut, Building2, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore, { getRolePath } from '../../store/useStore';
import { DEFAULT_BRANDING, isValidHexColor } from '../../lib/brandingUtils';

const Topbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const {
        logout,
        user,
        role,
        selectedAccount,
        branding,
        searchTerm,
        setSearchTerm,
        mobileMenuOpen,
        setMobileMenuOpen,
    } = useAppStore();

    const rolePath = getRolePath(role);
    const activeBranding = { ...DEFAULT_BRANDING, ...(branding || {}) };
    const accentColor = isValidHexColor(activeBranding.accentColor)
        ? activeBranding.accentColor
        : DEFAULT_BRANDING.accentColor;

    const activeCompanyName =
        selectedAccount?.companyName ||
        user?.companyName ||
        activeBranding.companyName ||
        'WhatsApp CRM Platform';
    const activeWorkspaceCode = selectedAccount?.workspaceCode || 'DEMO';

    return (
        <div className="h-[60px] flex items-center justify-between px-3 sm:px-4 md:px-6 gap-2 sm:gap-3 shrink-0 bg-[#111318] border-b border-[#1E232B] relative z-30">
            {/* Left: Mobile Hamburger + Brand & Active Customer Account Identity */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Open navigation menu"
                    aria-expanded={mobileMenuOpen}
                    className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1C1F26] border border-[#2D333B] transition-colors shrink-0"
                >
                    <Menu size={19} />
                </button>

                <Link
                    to={`/${rolePath}/dashboard`}
                    className="flex items-center gap-2 text-[15px] font-bold text-white hover:text-slate-300 transition-colors min-w-0"
                >
                    {activeBranding.logoDataUrl && (
                        <img
                            src={activeBranding.logoDataUrl}
                            alt={`${activeBranding.appName} logo`}
                            className="h-7 w-7 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                        />
                    )}
                    <span className="truncate whitespace-nowrap">
                        {activeBranding.appName || 'WhatsApp CRM'}
                    </span>
                </Link>

                <div
                    className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#16181D] border border-[#2D333B] text-xs min-w-0 max-w-[220px]"
                    title={`${activeCompanyName} (${activeWorkspaceCode})`}
                >
                    <Building2 size={13} className="text-[#8B5CF6] shrink-0" />
                    <span className="font-semibold text-slate-200 truncate">{activeCompanyName}</span>
                </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-[380px] items-center gap-3 bg-[#16181D] border border-[#2D333B] hover:border-[#4B5563] focus-within:border-[#8B5CF6] transition-colors rounded-[12px] px-3 py-1.5 mx-2 lg:mx-4 group cursor-text">
                <Search size={16} className="text-slate-500 group-hover:text-slate-400 group-focus-within:text-[#8B5CF6] transition-colors shrink-0" />
                <input
                    type="text"
                    placeholder="Search Anything"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-none text-[13px] text-white placeholder:text-slate-500 font-medium focus:outline-none"
                />
                {searchTerm ? (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-[12px] font-semibold text-slate-300 hover:text-white bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] px-2.5 py-1 rounded-md transition-colors"
                    >
                        Clear
                    </button>
                ) : (
                    <div className="flex items-center gap-1 bg-[#111318] border border-[#2D333B] px-1.5 py-0.5 rounded-md shrink-0">
                        <Command size={12} className="text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-500">K</span>
                    </div>
                )}
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
                <button
                    type="button"
                    className="hidden sm:flex bg-transparent border border-[#2D333B] hover:border-[#4B5563] rounded-full px-3 py-1.5 items-center gap-2 text-[12px] transition-colors"
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 0 8px ${accentColor}80`,
                        }}
                    />
                    <span className="font-bold tracking-wide" style={{ color: accentColor }}>
                        Online
                    </span>
                    <ChevronDown size={14} style={{ color: accentColor }} />
                </button>

                {/* Bell Icon -> Notifications Page */}
                <Link
                    to={`/${rolePath}/notifications`}
                    aria-label="Open notifications"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-transparent hover:bg-[#1C1F26] transition-colors"
                >
                    <Bell size={18} className="text-slate-400 hover:text-white transition-colors" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        aria-label="Open session menu"
                        aria-expanded={showProfileMenu}
                        className="h-10 w-10 rounded-full bg-[#312E81] flex items-center justify-center text-[13px] font-bold text-white cursor-pointer relative hover:brightness-110 transition-all border border-[#4F46E5]/30"
                    >
                        {(user?.name || 'M').charAt(0).toUpperCase()}
                        <div
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-[#111318] rounded-full"
                            style={{ backgroundColor: accentColor }}
                        />
                    </button>

                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-[#1C1F26] rounded-xl border border-[#2D333B] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2.5 border-b border-[#2D333B] space-y-1">
                                    <p className="text-xs font-bold text-white truncate">{user?.name || 'Demo User'}</p>
                                    <p className="text-[11px] font-semibold text-[#8B5CF6] truncate">{role}</p>
                                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                                        <Building2 size={12} className="shrink-0 text-slate-400" />
                                        <span className="truncate">{activeCompanyName}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/${rolePath}/settings`}
                                    onClick={() => setShowProfileMenu(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#111318] hover:text-white transition-colors"
                                >
                                    <User size={16} className="text-slate-400" />
                                    Profile Settings
                                </Link>
                                <div className="h-px bg-[#2D333B] my-1 mx-2" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
