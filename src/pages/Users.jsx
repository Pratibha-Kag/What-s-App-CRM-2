import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Mail, ShieldCheck, AlertCircle, Plus, X } from 'lucide-react';
import { mockUsers } from '../mock/mockData';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import { toast } from '../components/ui/Toast';

const Users = () => {
    const { role } = useAppStore();
    const canView = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER_ADMIN'].includes(normalizeRoleKey(role));

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'COUNSELOR' });
    const [users, setUsers] = useState(mockUsers);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newUser = {
            id: 'usr-' + String(users.length + 1).padStart(3, '0'),
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            status: 'Active',
            country: 'Global'
        };
        setUsers(prev => [...prev, newUser]);
        toast.success("User added successfully!");
        setIsSubmitting(false);
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'COUNSELOR' });
    };

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400">You do not have the required permissions to view system users.</p>
                </div>
            </div>
        );
    }

    const usersArray = users;

    return (
        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-[#111318] min-h-full text-white pb-20">
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Global User Management</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">System Identities and Access Control</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 min-h-[44px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg w-full sm:w-auto"
                    >
                        <Plus size={16} /> Add User
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1C1F26] rounded-3xl border border-[#2D333B] overflow-hidden"
                >
                    <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex justify-between items-center">
                        <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <UserCog size={16} className="text-[#8B5CF6]" /> Active System Users
                        </h2>
                        <span className="text-xs text-slate-400 font-semibold">{usersArray.length} users</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[640px]">
                            <thead>
                                <tr className="bg-[#111318] border-b border-[#2D333B]">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Protocol</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">System Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/60">
                                {usersArray.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-slate-400">
                                            <p className="text-xs font-black uppercase tracking-widest">No users found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    usersArray.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#111318]/80 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center font-black text-sm border border-indigo-500/20 shrink-0">
                                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{user?.name}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">ID: {user?.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                    user?.role === 'SUPER_ADMIN' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                                                    user?.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                                                    'bg-slate-500/10 text-slate-300 border-slate-500/20'
                                                }`}>
                                                    {user?.role === 'SUPER_ADMIN' && <ShieldCheck size={11} />}
                                                    {(user?.role || '').replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                                    <Mail size={13} className="text-slate-500" /> {user?.email}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                    user?.status === 'Active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                    {user?.status || 'Unknown'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsAddModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-[#2D333B] flex justify-between items-center bg-[#16181D]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Add New User</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    aria-label="Close add user modal"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#8B5CF6] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#8B5CF6] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#8B5CF6] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#8B5CF6] outline-none transition-all cursor-pointer"
                                    >
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="TEAM_LEADER">Team Leader</option>
                                        <option value="CUSTOMER_SUPPORT">Customer Support</option>
                                        <option value="COUNSELOR">Counselor</option>
                                    </select>
                                </div>
                                <div className="pt-4 mt-4 border-t border-[#2D333B]">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full min-h-[44px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

class UsersErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-rose-300 bg-rose-500/10 m-8 rounded-xl font-mono text-sm border border-rose-500/30">
                    <h2 className="font-bold text-lg mb-2">Users Component Crashed:</h2>
                    <p>{this.state.error?.toString()}</p>
                </div>
            );
        }
        return <Users />;
    }
}

export default UsersErrorBoundary;
