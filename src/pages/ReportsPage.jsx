import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
    BarChart3, 
    Calendar, 
    Clock, 
    MessageSquare, 
    TrendingUp, 
    Users, 
    Lock, 
    RefreshCcw,
    Activity,
    ShieldAlert,
    Send,
    Download
} from 'lucide-react'
import api from '../services/api'
import useAppStore from '../store/useStore'
import { cn } from '../lib/utils'

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="crm-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all duration-300">
        <div className="flex items-center gap-4">
            <div className={cn("p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-sm", color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{title}</p>
                <h3 className="text-2xl font-black text-[#111827] tracking-tight">{value}</h3>
            </div>
        </div>
    </div>
)

const ReportsPage = () => {
    const { role } = useAppStore()
    const roleName = typeof role === 'object' ? (role?.name || '') : (role || '')

    // Check if Support role (denied access)
    const isSupport = roleName === 'Customer Support' || roleName === 'SUPPORT'

    const [period, setPeriod] = React.useState('all')
    const [exportFormat, setExportFormat] = React.useState('csv')

    const { data: reportResp, isLoading, refetch, isFetching, error } = useQuery({
        queryKey: ['reports-summary', period],
        queryFn: () => api.get(`/reports/summary?period=${period}`).then(res => res.data),
        enabled: !isSupport
    })

    const reportData = reportResp?.data || {}
    const summary = reportData.summary || {}
    const counselors = reportData.counselors || []

    const handleExportReport = async () => {
        try {
            const response = await api.get(`/reports/export?period=${period}&format=${exportFormat}`, { responseType: 'blob' });
            
            // Note: Axios interceptor might directly return response or response.data.
            // If it returns response.data as blob, we wrap it. Let's make it robust:
            const blobData = response.data || response;
            const blob = new Blob([blobData], { 
                type: exportFormat === 'xlsx' 
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                    : 'text/csv' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `performance-report-${period}-${new Date().toISOString().split('T')[0]}.${exportFormat}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    if (isSupport) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-center text-rose-500 mb-6 shadow-xl shadow-rose-500/5 animate-pulse">
                    <ShieldAlert size={36} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Security Lockout</h1>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mt-1.5">Module Restricted Access</p>
                <p className="text-sm font-medium text-slate-400 max-w-sm mt-4 leading-relaxed">
                    Access Denied: The Customer Support role is not authorized to access global performance scorecards or daily conversion matrices.
                </p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-indigo-600">
                <RefreshCcw className="animate-spin" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Querying Metrics...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 md:space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#111827] uppercase tracking-tighter flex items-center gap-3">
                        <BarChart3 className="text-indigo-600 shrink-0" size={28} />
                        Performance <span className="text-indigo-600">Reporting</span>
                    </h1>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                        Operational Metrics, Agent Scorecards, and Follow-up Adherence Matrices
                    </p>
                </div>
                
                {/* Control Panel */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Period Selector */}
                    <div className="relative min-w-[150px]">
                        <select 
                            value={period} 
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-[#111827] pl-4 pr-10 py-3.5 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-indigo-200 focus:outline-none focus:border-indigo-500 transition-all shadow-sm cursor-pointer appearance-none"
                        >
                            <option value="all">All Time</option>
                            <option value="daily">Today</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                        </select>
                        <Calendar size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Export Selector and Action */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="bg-transparent text-[#111827] pl-3 pr-8 py-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest focus:outline-none cursor-pointer appearance-none relative"
                            style={{ 
                                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, 
                                backgroundPosition: 'right 4px center', 
                                backgroundRepeat: 'no-repeat', 
                                backgroundSize: '12px' 
                            }}
                        >
                            <option value="csv">CSV Format</option>
                            <option value="xlsx">Excel (XLSX)</option>
                        </select>
                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                        <button 
                            onClick={handleExportReport}
                            className="bg-[#111827] text-white hover:bg-black px-4 py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5"
                        >
                            <Download size={12} className="shrink-0" /> Export
                        </button>
                    </div>

                    {/* Refresh Button */}
                    <button 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="bg-white border border-slate-200 text-[#111827] px-6 py-3.5 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-indigo-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={12} className={isFetching ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCard 
                    title="Leads Assigned" 
                    value={summary.leadsAssigned || 0} 
                    icon={Users} 
                    color="bg-indigo-50 text-indigo-600"
                />
                <MetricCard 
                    title="Leads Converted" 
                    value={summary.leadsConverted || 0} 
                    icon={TrendingUp} 
                    color="bg-emerald-50 text-emerald-600"
                />
                <MetricCard 
                    title="Conversion Rate" 
                    value={summary.conversionRate || '0%'} 
                    icon={Activity} 
                    color="bg-indigo-950 text-white"
                />
                <MetricCard 
                    title="Follow-ups Completed" 
                    value={summary.followupsCompleted || 0} 
                    icon={Calendar} 
                    color="bg-blue-50 text-blue-600"
                />
                <MetricCard 
                    title="Follow-ups Missed" 
                    value={summary.followupsMissed || 0} 
                    icon={Clock} 
                    color="bg-amber-50 text-amber-600"
                />
                <MetricCard 
                    title="Follow-ups Overdue" 
                    value={summary.followupsOverdue || 0} 
                    icon={ShieldAlert} 
                    color="bg-rose-50 text-rose-600"
                />
                <MetricCard 
                    title="Messages Sent" 
                    value={summary.messagesSent || 0} 
                    icon={Send} 
                    color="bg-slate-100 text-slate-800"
                />
                <MetricCard 
                    title="Messages Received" 
                    value={summary.messagesReceived || 0} 
                    icon={MessageSquare} 
                    color="bg-slate-100 text-slate-800"
                />
            </div>

            {/* Counselor Performance Section */}
            {counselors.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                            <h3 className="font-black text-[#111827] uppercase tracking-widest text-[10px] sm:text-xs">Counselor Performance Scores</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80">
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Counselor</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Team</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Leads Assigned</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Converted</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Conversion Rate</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Follow-ups Completed</th>
                                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Completion Adherence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {counselors.map((c, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-slate-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs border border-slate-200">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.team || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-semibold text-slate-700">{c.leadsAssigned}</td>
                                        <td className="px-6 py-4 text-center text-xs font-semibold text-slate-700">{c.leadsConverted}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black">{c.conversionRate}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-semibold text-slate-700">{c.followupsCompleted}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[10px] font-black",
                                                parseInt(c.followupCompletionRate) > 80 ? 'bg-emerald-50 text-emerald-700' :
                                                parseInt(c.followupCompletionRate) > 50 ? 'bg-amber-50 text-amber-700' :
                                                'bg-rose-50 text-rose-700'
                                            )}>
                                                {c.followupCompletionRate}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportsPage
