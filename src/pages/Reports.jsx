import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar as CalendarIcon, TrendingUp, Users, MessageSquare, Target, Loader2, AlertCircle } from 'lucide-react';
import { mockDailyReports } from '../mock/mockData';
import useAppStore from '../store/useStore';

const Reports = () => {
    const { role } = useAppStore();
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // Allow all roles to view reports
    const normalizedRole = (role || '').toUpperCase().replace(' ', '_');
    const canView = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TEAM_LEADER', 'CUSTOMER_SUPPORT', 'COUNSELOR'].includes(normalizedRole);

    const reportData = mockDailyReports;
    const isLoading = false;
    const isError = false;
    const error = null;

    const exportToCSV = () => {
        if (!reportData || reportData.length === 0) return;
        
        const headers = ['Agent Name', 'Role', 'Assigned Leads', 'Messages Sent', 'Follow-ups Completed', 'Conversions'];
        const rows = reportData.map(r => [
            `"${r.agentName}"`,
            `"${r.role}"`,
            r.assignedLeads,
            r.replyCount,
            r.followupsCompleted,
            r.conversions
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Daily_Activity_Report_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Totals
    const totals = useMemo(() => {
        if (!reportData) return { leads: 0, messages: 0, followups: 0, conversions: 0 };
        return reportData.reduce((acc, curr) => ({
            leads: acc.leads + curr.assignedLeads,
            messages: acc.messages + curr.replyCount,
            followups: acc.followups + curr.followupsCompleted,
            conversions: acc.conversions + curr.conversions
        }), { leads: 0, messages: 0, followups: 0, conversions: 0 });
    }, [reportData]);

    if (!canView) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center bg-slate-50 min-h-screen">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">You do not have the required permissions to view system reports.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-slate-50 min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Performance Reports</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Daily Agent Activity & Metrics</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={todayStr}
                            className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                        />
                    </div>
                    
                    <button 
                        onClick={exportToCSV}
                        disabled={!reportData || reportData.length === 0}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Assigned Leads", value: totals.leads, icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-100" },
                    { label: "Messages Sent", value: totals.messages, icon: <MessageSquare size={20} />, color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-100" },
                    { label: "Follow-ups Done", value: totals.followups, icon: <TrendingUp size={20} />, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
                    { label: "Conversions", value: totals.conversions, icon: <Target size={20} />, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-100" }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center ring-4 ${stat.ring}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 relative z-10">{isLoading ? '-' : stat.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 relative z-10">{stat.label}</p>
                        
                        {/* Decorative Background Glow */}
                        <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    </motion.div>
                ))}
            </div>

            {/* Main Report Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Agent Performance Board</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Agent Details</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Assigned Leads</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Messages Sent</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Follow-ups</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Conversions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compiling Report Data...</p>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-rose-500">
                                        <AlertCircle className="mx-auto mb-4" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Failed to load reports.</p>
                                    </td>
                                </tr>
                            ) : reportData?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        <CalendarIcon className="mx-auto mb-4 opacity-50" size={32} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded for this date.</p>
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((agent) => (
                                    <tr key={agent.agentId} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                                                    {(agent.agentName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{agent.agentName}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{agent.role.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                                                {agent.assignedLeads}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
                                                {agent.replyCount}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
                                                {agent.followupsCompleted}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 font-bold text-xs">
                                                {agent.conversions}
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
    );
};

export default Reports;
