import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../../store/useStore';
import { 
    LayoutDashboard, Users, MessageSquare, LogOut, 
    ChevronLeft, ChevronRight, Activity, ShieldCheck, 
    UserCog, FileText, Settings, Link2, Bot,
    UserSquare, MessageCircle, Megaphone, Sparkles
} from 'lucide-react';

const Sidebar = () => {
    const { logout, role, sidebarCollapsed, setSidebarCollapsed } = useAppStore();

    // Base menu structure with Role-Based Access Control (RBAC)
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
            path: '/settings', 
            label: 'Settings', 
            icon: Settings,
            roles: ['SUPER_ADMIN']
        }
    ];

    // Filter menu items based on the user's role
    // Normalize role to uppercase to match the standard enum
    const normalizedRole = (role || '').toUpperCase().replace(' ', '_');
    const menuItems = allMenuItems.filter(item => item.roles.includes(normalizedRole));

    const getRolePath = (r) => {
        if (!r) return 'user';
        const roleStr = r.toUpperCase().replace(' ', '_');
        const roleMap = {
            'SUPER_ADMIN': 'super-admin',
            'ADMIN': 'admin',
            'MANAGER': 'manager',
            'TEAM_LEADER': 'team-leader',
            'CUSTOMER_SUPPORT': 'support',
            'COUNSELOR': 'counselor'
        };
        return roleMap[roleStr] || 'user';
    };
    
    const rolePath = getRolePath(role);

    return (
        <motion.aside 
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 288 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#111318] border-r border-slate-800 shadow-2xl text-white"
        >
            {/* Header / Logo */}
            <div className="flex items-center justify-between h-[72px] px-5 border-b border-slate-800/50 relative overflow-hidden shrink-0">
                
                <div className={`flex items-center overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'} transition-all duration-300 h-full`}>
                    <span className="text-[18px] font-black text-white tracking-tight whitespace-nowrap">WhatsApp CRM</span>
                </div>

                <button 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 ${sidebarCollapsed ? 'mx-auto' : ''}`}
                >
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={`/${rolePath}${item.path}`}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-[#1C1F26] text-white shadow-sm' 
                                    : 'text-slate-400 hover:bg-[#1C1F26]/50 hover:text-slate-200'
                            }`
                        }
                        title={sidebarCollapsed ? item.label : undefined}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`flex items-center justify-center transition-transform duration-200 ${sidebarCollapsed ? 'mx-auto' : ''} ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    <item.icon size={20} />
                                </div>
                                {!sidebarCollapsed && (
                                    <span className="ml-4 text-[13px] font-medium whitespace-nowrap">{item.label}</span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={logout}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 w-full group overflow-hidden relative ${
                        sidebarCollapsed ? 'justify-center' : ''
                    } text-slate-400 hover:bg-rose-500/10 hover:text-rose-400`}
                    title={sidebarCollapsed ? "Terminate Session" : undefined}
                >
                    <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        <LogOut size={20} />
                    </div>
                    {!sidebarCollapsed && (
                        <span className="ml-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap">Terminate Session</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;