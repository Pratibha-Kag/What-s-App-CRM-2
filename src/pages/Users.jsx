import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Mail, Phone, ShieldCheck, AlertCircle, Loader2, Plus, X } from 'lucide-react';
import { mockUsers } from '../mock/mockData';
import useAppStore from '../store/useStore';
import { toast } from '../components/ui/Toast';

const Users = () => {
    const { role } = useAppStore();
    const canView = ['SUPER_ADMIN', 'ADMIN'].includes((role || '').toUpperCase().replace(' ', '_'));

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'COUNSELOR' });
    const [users, setUsers] = useState(mockUsers);
    const isLoading = false;
    const isError = false;

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            id: 'usr-' + String(users.length + 1).padStart(3, '0'),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: 'Active',
            country: 'Global'
        };
        setUsers(prev => [...prev, newUser]);
        toast.success("User added successfully!");
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'COUNSELOR' });
    };

    if (!canView) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center bg-slate-50 min-h-screen">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">You do not have the required permissions to view system users.</p>
                </div>
            </div>
        );
    }

    const usersArray = users;

    return (
        <div className="flex-1 p-6 md:p-8 bg-slate-50 min-h-screen">
            {/* ... rest of your UI ... */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Global User Management</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">System Identities and Access Control</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-600/30"
                >
                    <Plus size={16} /> Add User
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <UserCog size={16} className="text-indigo-600" /> Active System Users
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Protocol</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">System Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Identities...</p>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-rose-500">
                                        <AlertCircle className="mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Failed to retrieve users.</p>
                                    </td>
                                </tr>
                            ) : usersArray?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400">
                                        <p className="text-[10px] font-black uppercase tracking-widest">No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                usersArray?.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100/50">
                                                    {(user?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">ID: {user?.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                user?.role === 'SUPER_ADMIN' ? 'bg-rose-100 text-rose-800' :
                                                user?.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>
                                                {user?.role === 'SUPER_ADMIN' && <ShieldCheck size={10} />}
                                                {(user?.role || '').replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Mail size={12} className="text-slate-400" /> {user?.email}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                user?.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
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

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Add New User</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Full Name</label>
                                    <input 
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Email Address</label>
                                    <input 
                                        type="email" required
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Password</label>
                                    <input 
                                        type="password" required minLength="6"
                                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">System Role</label>
                                    <select 
                                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="TEAM_LEADER">Team Leader</option>
                                        <option value="CUSTOMER_SUPPORT">Customer Support</option>
                                        <option value="COUNSELOR">Counselor</option>
                                    </select>
                                </div>
                                <div className="pt-4 mt-6 border-t border-slate-100">
                                    <button 
                                        type="submit" 
                                        disabled={addMutation.isPending}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {addMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : 'Create User'}
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
                <div className="p-8 text-rose-600 bg-rose-50 m-8 rounded-xl font-mono text-sm border border-rose-200 shadow-sm">
                    <h2 className="font-bold text-lg mb-2">Users Component Crashed:</h2>
                    <p>{this.state.error?.toString()}</p>
                </div>
            );
        }
        return <Users />;
    }
}

export default UsersErrorBoundary;
