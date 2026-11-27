import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Server, Shield, Bell, Zap, AlertCircle, User, Mail, Lock } from 'lucide-react';
import useAppStore from '../store/useStore';

const Settings = () => {
    const { role, user } = useAppStore();
    const canView = ['SUPER_ADMIN'].includes((role || '').toUpperCase().replace(' ', '_'));

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Super Admin',
        email: user?.email || 'superadmin@example.com'
    });

    if (!canView) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center bg-[#111318] min-h-screen text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400 mb-6">You do not have the required permissions to access system settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-[#111318] min-h-screen pb-20 text-white">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-white tracking-tight mb-1">System Configuration</h1>
                <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Global Infrastructure & Preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* My Profile Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1C1F26] p-6 rounded-3xl border border-[#2D333B] lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center border border-[#8B5CF6]/20">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-white uppercase tracking-widest">My Profile</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Personal Account Settings</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="text" 
                                    value={profileData.name} 
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all" 
                                />
                            </div>
                        </div>
                        
                        <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B]">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-3">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="email" 
                                    value={profileData.email} 
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full bg-[#16181D] border border-[#2D333B] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6] transition-all" 
                                />
                            </div>
                        </div>

                        <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B] md:col-span-2 flex justify-between items-center">
                            <div>
                                <h3 className="text-[14px] font-bold text-white">Account Password</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">Change your login password</p>
                            </div>
                            <button className="flex items-center gap-2 bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-colors">
                                <Lock size={14} /> Update
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            Save Changes
                        </button>
                    </div>
                </motion.div>


            </div>
        </div>
    );
};

export default Settings;
