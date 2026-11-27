import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, MessageCircle, TrendingUp,
    ChevronRight, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockLeads } from '../mock/mockData';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import SuperAdminDashboard from './SuperAdminDashboard';
import CustomerAdminDashboard from './CustomerAdminDashboard';

const SimpleDashboard = () => {
    const { role } = useAppStore();
    const roleKey = normalizeRoleKey(role);

    if (roleKey === 'SUPER_ADMIN') {
        return <SuperAdminDashboard />;
    }

    if (roleKey === 'ADMIN' || roleKey === 'CUSTOMER_ADMIN') {
        return <CustomerAdminDashboard />;
    }

    // Preserved dashboard for Manager, Team Leader, Customer Support, and Counselor
    const leads = mockLeads;
    const isLoading = false;
    const totalLeads = leads.length;
    const pendingLeads = leads.filter(l => l.stage === 'New' || l.stage === 'Follow-up').length;
    const convertedLeads = leads.filter(l => l.stage === 'Converted').length;
    const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    const CheckCircle2 = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );

    const cards = [
        {
            title: "Total Contacts",
            value: totalLeads,
            subtitle: "All synced WhatsApp contacts",
            icon: <Users size={24} />,
            color: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-500/10",
            textLight: "text-blue-500"
        },
        {
            title: "Active Conversations",
            value: pendingLeads,
            subtitle: "Unread & follow-ups needed",
            icon: <MessageCircle size={24} />,
            color: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-500/10",
            textLight: "text-amber-500"
        },
        {
            title: "Successful Conversions",
            value: convertedLeads,
            subtitle: "Closed deals / Converted leads",
            icon: <CheckCircle2 size={24} />,
            color: "from-emerald-400 to-teal-500",
            bgLight: "bg-emerald-500/10",
            textLight: "text-emerald-500"
        },
        {
            title: "Conversion Rate",
            value: `${conversionRate}%`,
            subtitle: "Overall success metric",
            icon: <TrendingUp size={24} />,
            color: "from-purple-500 to-fuchsia-500",
            bgLight: "bg-purple-500/10",
            textLight: "text-purple-500"
        }
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-20 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight mb-1">Dashboard Overview</h1>
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp CRM Performance & Metrics</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#1C1F26] rounded-[20px] p-6 border border-[#2D333B] relative overflow-hidden group hover:border-[#4B5563] transition-colors duration-300"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`h-12 w-12 rounded-2xl ${card.bgLight} ${card.textLight} flex items-center justify-center border border-white/5`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.title}</h3>
                            <div className="text-[32px] font-black text-white tracking-tighter mb-1">{card.value}</div>
                            <p className="text-[12px] font-medium text-slate-500">{card.subtitle}</p>
                        </div>
                        {/* Decorative Gradient Blob */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full blur-3xl opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500`} />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-[#2D333B] flex justify-between items-center bg-[#16181D]">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/20">
                                <MessageCircle size={16} />
                            </div>
                            <h2 className="text-[16px] font-bold text-white tracking-tight">Recent Contacts</h2>
                        </div>
                        <Link to="../contacts" className="text-[11px] font-black uppercase tracking-widest text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1 transition-colors">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-[#111318]">
                                <tr>
                                    {['Contact Name', 'WhatsApp Number', 'Status', 'Source'].map((head, i) => (
                                        <th key={i} className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-[#2D333B]">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="4" className="py-12 text-center text-[11px] font-black uppercase tracking-widest text-slate-500">Loading Contacts...</td></tr>
                                ) : leads.slice(0, 5).map(lead => (
                                    <tr key={lead.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-[#2A303C] border border-[#374151] flex items-center justify-center font-bold text-slate-300 text-[12px] shrink-0">
                                                    {(lead.name || 'U').charAt(0)}
                                                </div>
                                                <p className="text-[13px] font-bold text-white">{lead.name || 'Unknown User'}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-[13px] font-bold text-slate-400 font-mono">{lead.phone}</td>
                                        <td className="py-3 px-6">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                lead.stage === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                lead.stage === 'Converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {lead.stage || 'NEW'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500">{lead.source || 'WhatsApp'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-[#16181D] rounded-[20px] border border-[#2D333B] p-6 relative overflow-hidden flex flex-col"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[#25D366] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="h-8 w-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center border border-[#25D366]/20">
                            <Activity size={16} />
                        </div>
                        <h2 className="text-[16px] font-bold text-white tracking-tight">System Status</h2>
                    </div>

                    <div className="space-y-4 relative z-10 flex-1">
                        <div className="bg-[#1C1F26] rounded-xl p-4 border border-[#2D333B]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">WhatsApp Gateway</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                                </div>
                            </div>
                            <p className="text-[12px] font-medium text-slate-500">Connected to WhatsApp Web API</p>
                        </div>

                        <div className="bg-[#1C1F26] rounded-xl p-4 border border-[#2D333B]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">AI Auto-Reply</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                                </div>
                            </div>
                            <p className="text-[12px] font-medium text-slate-500">Sales agent is routing messages</p>
                        </div>

                        <div className="bg-[#1C1F26] rounded-xl p-4 border border-[#2D333B]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Message Sync</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Optimal
                                </div>
                            </div>
                            <p className="text-[12px] font-medium text-slate-500">Real-time DB synchronization</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SimpleDashboard;
