import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useAppStore, { getRolePath, normalizeRoleKey } from '../../store/useStore';
import { DEFAULT_BRANDING, getContrastTextColor, isValidHexColor } from '../../lib/brandingUtils';
import {
    LayoutDashboard, MessageSquare, LogOut,
    ChevronLeft, ChevronRight, Link2, Bot,
    UserSquare, MessageCircle, Megaphone, Settings, X, Building2, Users as UsersIcon, Wallet
} from 'lucide-react';

const Sidebar = () => {
    const {
        logout,
        role,
        branding,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
    } = useAppStore();

    // Base menu structure with Role-Based Access Control (RBAC) — preserved intact
    const allMenuItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TEAM_LEADER', 'CUSTOMER_SUPPORT', 'COUNSELOR']
        },
        {
            path: '/contacts',
            label: 'Contacts',
            icon: UserSquare,
            roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TEAM_LEADER', 'CUSTOMER_SUPPORT', 'COUNSELOR']
        },
        {
            path: '/inbox',
            label: 'Inbox / Connect',
            icon: MessageSquare,
            roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'CUSTOMER_SUPPORT', 'COUNSELOR']
        },
        {
            path: '/integrations',
            label: 'Integrations',
            icon: Link2,
            roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR']
        },
        {
            path: '/sales-agent',
            label: 'Sales Agent',
            icon: Bot,
            roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
            path: '/comments',
            label: 'Comments',
            icon: MessageCircle,
            roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER']
        },
        {
            path: '/meta-ads',
            label: 'Meta Ads',
            icon: Megaphone,
            roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
            path: '/customers',
            label: 'Customers',
            icon: Building2,
            roles: ['SUPER_ADMIN']
        },
        {
            path: '/billing',
            label: 'Wallet & Billing',
            icon: Wallet,
            roles: ['SUPER_ADMIN']
        },
        {
            path: '/wallet',
            label: 'Wallet & Billing',
            icon: Wallet,
            roles: ['ADMIN', 'CUSTOMER_ADMIN']
        },
        {
            path: '/users',
            label: 'Users',
            icon: UsersIcon,
            roles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
            path: '/settings',
            label: 'Settings',
            icon: Settings,
            roles: ['SUPER_ADMIN']
        }
    ];

    const normalizedRole = normalizeRoleKey(role);
    const menuItems = allMenuItems.filter((item) => item.roles.includes(normalizedRole));
    const rolePath = getRolePath(role);

    const activeBranding = { ...DEFAULT_BRANDING, ...(branding || {}) };
    const brandPrimary = isValidHexColor(activeBranding.primaryColor)
        ? activeBranding.primaryColor
        : DEFAULT_BRANDING.primaryColor;
    const isCustomPrimary = brandPrimary.toUpperCase() !== DEFAULT_BRANDING.primaryColor.toUpperCase();
    const primaryFg = getContrastTextColor(brandPrimary);

    // Close mobile/tablet drawer on Escape key & lock background scroll while open
    useEffect(() => {
        if (!mobileMenuOpen) return undefined;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen, setMobileMenuOpen]);

    return (
        <>
            {/* Mobile & Tablet Drawer Backdrop */}
            {mobileMenuOpen && (
                <div
                    role="presentation"
                    aria-hidden="true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                aria-label="Primary navigation"
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#111318] border-r border-slate-800 shadow-2xl text-white transition-all duration-300 w-72 ${
                    sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
                } ${
                    mobileMenuOpen
                        ? 'translate-x-0 pointer-events-auto'
                        : '-translate-x-full pointer-events-none lg:translate-x-0 lg:pointer-events-auto'
                }`}
            >
                {/* Header / Logo */}
                <div className="flex items-center justify-between h-[72px] px-4 lg:px-5 border-b border-slate-800/50 relative overflow-hidden shrink-0 gap-2">
                    <div
                        className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 h-full min-w-0 ${
                            sidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-full'
                        }`}
                    >
                        {activeBranding.logoDataUrl && (
                            <img
                                src={activeBranding.logoDataUrl}
                                alt={`${activeBranding.appName} logo`}
                                className="h-8 w-8 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                            />
                        )}
                        <div className="min-w-0 flex flex-col">
                            <span className="text-[18px] font-black text-white tracking-tight whitespace-nowrap truncate">
                                {activeBranding.appName || 'WhatsApp CRM'}
                            </span>
                            {activeBranding.companyName &&
                                activeBranding.companyName !== activeBranding.appName && (
                                    <span className="text-[11px] font-semibold text-slate-400 truncate">
                                        {activeBranding.companyName}
                                    </span>
                                )}
                        </div>
                    </div>

                    {/* Desktop Collapse Button */}
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`hidden lg:flex h-8 w-8 rounded-lg items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 shrink-0 ${
                            sidebarCollapsed ? 'mx-auto' : ''
                        }`}
                    >
                        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    {/* Mobile & Tablet Close Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close navigation menu"
                        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={`/${rolePath}${item.path}`}
                            onClick={() => setMobileMenuOpen(false)}
                            style={({ isActive }) =>
                                isActive && isCustomPrimary
                                    ? {
                                          backgroundColor: brandPrimary,
                                          color: primaryFg,
                                      }
                                    : undefined
                            }
                            className={({ isActive }) =>
                                `flex items-center min-h-[44px] px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                    isActive
                                        ? 'bg-[#1C1F26] text-white shadow-sm'
                                        : 'text-slate-400 hover:bg-[#1C1F26]/50 hover:text-slate-200'
                                }`
                            }
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={`flex items-center justify-center transition-transform duration-200 shrink-0 ${
                                            sidebarCollapsed ? 'lg:mx-auto' : ''
                                        } ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                    >
                                        <item.icon size={20} />
                                    </div>
                                    <span
                                        className={`ml-4 text-[13px] font-medium whitespace-nowrap ${
                                            sidebarCollapsed ? 'lg:hidden' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800/50 pb-safe shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            logout();
                        }}
                        className={`flex items-center min-h-[44px] px-4 py-3.5 rounded-xl transition-all duration-200 w-full group overflow-hidden relative ${
                            sidebarCollapsed ? 'lg:justify-center' : ''
                        } text-slate-400 hover:bg-rose-500/10 hover:text-rose-400`}
                        title={sidebarCollapsed ? 'Terminate Session' : undefined}
                    >
                        <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0">
                            <LogOut size={20} />
                        </div>
                        <span
                            className={`ml-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                                sidebarCollapsed ? 'lg:hidden' : ''
                            }`}
                        >
                            Terminate Session
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
