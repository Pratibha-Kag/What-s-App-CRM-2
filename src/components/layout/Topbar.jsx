import React, { useState } from 'react';
import { ChevronDown, Bell, Search, Command, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../../store/useStore';

const Topbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { logout, user, role, searchTerm, setSearchTerm } = useAppStore();

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

    return (
        <div className="h-[60px] flex items-center justify-between px-6 shrink-0 bg-[#111318] border-b border-[#1E232B] relative z-40">
            {/* Left: Brand/Name */}
            <div className="flex items-center min-w-[200px]">
                <button className="flex items-center gap-2 text-[15px] font-bold text-white hover:text-slate-300 transition-colors">
                    WhatsApp CRM
                </button>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-[400px] items-center gap-3 bg-[#16181D] border border-[#2D333B] hover:border-[#4B5563] focus-within:border-[#8B5CF6] transition-colors rounded-[12px] px-3 py-1.5 mx-4 group cursor-text">
                <Search size={16} className="text-slate-500 group-hover:text-slate-400 group-focus-within:text-[#8B5CF6] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Anything" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none text-[13px] text-white placeholder:text-slate-500 font-medium focus:outline-none"
                />
                {searchTerm ? (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="text-[12px] font-semibold text-slate-300 hover:text-white bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] px-2.5 py-1 rounded-md transition-colors"
                    >
                        Clear
                    </button>
                ) : (
                    <div className="flex items-center gap-1 bg-[#111318] border border-[#2D333B] px-1.5 py-0.5 rounded-md">
                        <Command size={12} className="text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-500">K</span>
                    </div>
                )}
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center justify-end min-w-[200px] gap-4">
                <button className="bg-transparent border border-[#2D333B] hover:border-[#4B5563] rounded-full px-3 py-1.5 flex items-center gap-2 text-[12px] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[#10B981] font-bold tracking-wide">Online</span>
                    <ChevronDown size={14} className="text-[#10B981]" />
                </button>
                {/* Bell Icon -> Notifications Page */}
                <Link 
                    to={`/${getRolePath(role)}/notifications`}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-transparent hover:bg-[#1C1F26] transition-colors"
                >
                    <Bell size={18} className="text-slate-400 hover:text-white transition-colors" />
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="h-9 w-9 rounded-full bg-[#312E81] flex items-center justify-center text-[13px] font-bold text-white cursor-pointer relative hover:brightness-110 transition-all border border-[#4F46E5]/30"
                    >
                        {(user?.name || 'M').charAt(0).toUpperCase()}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-[#111318] rounded-full"></div>
                    </button>

                    {showProfileMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-[#1C1F26] rounded-xl border border-[#2D333B] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link 
                                    to={`/${getRolePath(role)}/settings`} 
                                    onClick={() => setShowProfileMenu(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-300 hover:bg-[#111318] hover:text-white transition-colors"
                                >
                                    <User size={16} className="text-slate-400" />
                                    Profile Settings
                                </Link>
                                <div className="h-px bg-[#2D333B] my-1 mx-2" />
                                <button 
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
