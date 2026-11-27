import React, { useMemo, useState } from 'react';
import {
    Users,
    Target,
    CheckCircle2,
    MessageSquare,
    Wallet,
    Activity,
    Building2,
    ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import useAppStore from '../store/useStore';
import {
    formatCurrency,
    getCustomerWalletSummary,
    getWalletHealth,
} from '../lib/walletUtils';

const CustomerAdminDashboard = () => {
    const { customers, selectedAccount, walletTransactions, messagePricing } = useAppStore();
    const [chartMode, setChartMode] = useState('conversions'); // 'conversions' | 'messages'

    // Resolve live customer record from Zustand store matching selectedAccount
    const customer = useMemo(() => {
        if (!customers || customers.length === 0) return null;
        if (selectedAccount?.id && selectedAccount.id !== 'platform') {
            return customers.find((c) => c.id === selectedAccount.id) || customers[0];
        }
        return customers[0];
    }, [customers, selectedAccount]);

    if (!customer) {
        return (
            <div className="p-6 text-white">No customer workspace selected.</div>
        );
    }

    const conversionRate = customer.leadsCount
        ? Math.round(((customer.conversionsCount || 0) / customer.leadsCount) * 100)
        : 0;
    const usagePercent = customer.monthlyQuotaCount
        ? Math.min(100, Math.round(((customer.messagesSent || 0) / customer.monthlyQuotaCount) * 100))
        : 0;
    const balanceHealth = getWalletHealth(customer.walletBalance);
    const walletSummary = getCustomerWalletSummary(customer.id, walletTransactions, messagePricing);

    const kpiCards = [
        {
            title: 'Total Contacts',
            value: (customer.contactsCount || 0).toLocaleString(),
            subtitle: `${customer.activeSeats || 0} active team seats`,
            icon: Users,
            bgLight: 'bg-blue-500/10',
            textLight: 'text-blue-400',
        },
        {
            title: 'Total Leads',
            value: (customer.leadsCount || 0).toLocaleString(),
            subtitle: `Captured across ${customer.companyName}`,
            icon: Target,
            bgLight: 'bg-indigo-500/10',
            textLight: 'text-indigo-400',
        },
        {
            title: 'Successful Conversions',
            value: (customer.conversionsCount || 0).toLocaleString(),
            subtitle: `${conversionRate}% lead conversion rate`,
            icon: CheckCircle2,
            bgLight: 'bg-emerald-500/10',
            textLight: 'text-emerald-400',
        },
        {
            title: 'WhatsApp Message Usage',
            value: `${((customer.messagesSent || 0) / 1000).toFixed(1)}k`,
            subtitle: `${usagePercent}% of ${customer.monthlyQuota || 'monthly quota'}`,
            icon: MessageSquare,
            bgLight: 'bg-purple-500/10',
            textLight: 'text-purple-400',
        },
        {
            title: 'Wallet Balance',
            value: formatCurrency(customer.walletBalance),
            subtitle: `${balanceHealth.label} • Recharged ${formatCurrency(walletSummary.totalRecharged)}`,
            icon: Wallet,
            bgLight: balanceHealth.key === 'Healthy' ? 'bg-amber-500/10' : 'bg-rose-500/10',
            textLight: balanceHealth.key === 'Healthy' ? 'text-amber-400' : balanceHealth.textClass,
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {/* Customer Workspace Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1F26] border border-[#2D333B] text-xs font-bold text-indigo-300">
                            <Building2 size={13} />
                            {customer.workspaceCode}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black uppercase tracking-widest text-emerald-400">
                            {customer.status} • {customer.planTier}
                        </span>
                    </div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight truncate">
                        {customer.companyName} Dashboard
                    </h1>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        {customer.assignedSoftware} • {customer.whatsappNumber}
                    </p>
                </div>

                <Link
                    to="/admin/contacts"
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-white text-xs font-bold uppercase tracking-widest transition-colors w-full md:w-auto shrink-0"
                >
                    <span>View Contacts</span>
                    <ChevronRight size={15} />
                </Link>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {kpiCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-[#1C1F26] rounded-[20px] p-5 border border-[#2D333B] hover:border-[#4B5563] transition-colors min-w-0"
                    >
                        <div className={`h-10 w-10 rounded-xl ${card.bgLight} ${card.textLight} flex items-center justify-center border border-white/5 mb-4`}>
                            <card.icon size={20} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {card.title}
                        </h3>
                        <div className="text-[26px] font-black text-white tracking-tighter mb-1">
                            {card.value}
                        </div>
                        <p className="text-xs font-medium text-slate-400 truncate">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Performance Chart & Usage Quota */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-[16px] font-bold text-white">
                                Lead Conversion & Messaging Performance
                            </h2>
                            <p className="text-xs text-slate-400">
                                6-month trend for {customer.companyName}
                            </p>
                        </div>
                        <div className="inline-flex bg-[#111318] p-1 rounded-xl border border-[#2D333B]">
                            <button
                                type="button"
                                onClick={() => setChartMode('conversions')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    chartMode === 'conversions'
                                        ? 'bg-[#8B5CF6] text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Leads & Conversions
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartMode('messages')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    chartMode === 'messages'
                                        ? 'bg-[#8B5CF6] text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Messages
                            </button>
                        </div>
                    </div>

                    <div className="h-[260px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                            <AreaChart
                                data={customer.monthlyPerformance || []}
                                margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D333B" vertical={false} />
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111318',
                                        borderColor: '#2D333B',
                                        borderRadius: '12px',
                                        color: '#FFFFFF',
                                    }}
                                />
                                {chartMode === 'conversions' ? (
                                    <>
                                        <Area
                                            type="monotone"
                                            dataKey="leads"
                                            name="Leads"
                                            stroke="#8B5CF6"
                                            fill="#8B5CF6"
                                            fillOpacity={0.2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="conversions"
                                            name="Conversions"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.25}
                                        />
                                    </>
                                ) : (
                                    <Area
                                        type="monotone"
                                        dataKey="messages"
                                        name="WhatsApp Messages"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.22}
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quota & Display-Only Wallet Summary */}
                <div className="xl:col-span-4 bg-[#16181D] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 flex flex-col justify-between gap-5 min-w-0">
                    <div>
                        <h2 className="text-[16px] font-bold text-white mb-1">Workspace Health & Wallet</h2>
                        <p className="text-xs text-slate-400">Account summary for {customer.contactPerson}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[#1C1F26] border border-[#2D333B] space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-300">WhatsApp Quota Used</span>
                                <span className="text-white">{usagePercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-[#111318] rounded-full overflow-hidden border border-[#2D333B]">
                                <div
                                    className="h-full bg-[#8B5CF6] rounded-full"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-slate-400">
                                {(customer.messagesSent || 0).toLocaleString()} / {(customer.monthlyQuotaCount || 0).toLocaleString()} messages
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#1C1F26] border border-[#2D333B] space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${balanceHealth.badgeClass}`}>
                                    {balanceHealth.label}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-white">
                                {formatCurrency(customer.walletBalance)}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>Recharged: <strong className="text-emerald-400">+{formatCurrency(walletSummary.totalRecharged)}</strong></span>
                                <span>Deducted: <strong className="text-amber-300">-{formatCurrency(walletSummary.totalDeductions)}</strong></span>
                            </div>
                            <Link
                                to="/admin/wallet"
                                className="mt-1 inline-flex items-center justify-center gap-1.5 w-full min-h-[38px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                <span>Manage Wallet & Recharge</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Contacts & Lead Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden min-w-0">
                    <div className="p-5 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between">
                        <h2 className="text-[16px] font-bold text-white">Recent Contacts & Leads</h2>
                        <Link to="/admin/leads" className="text-xs font-bold text-[#8B5CF6] hover:text-[#A78BFA] inline-flex items-center gap-1">
                            View Leads <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[540px]">
                            <thead className="bg-[#111318]">
                                <tr>
                                    {['Contact', 'Phone', 'Stage', 'Source', 'Updated'].map((h) => (
                                        <th key={h} className="py-3.5 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(customer.recentLeads || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                                            No recent lead records for this workspace yet.
                                        </td>
                                    </tr>
                                ) : (
                                    customer.recentLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                            <td className="py-3.5 px-5 text-sm font-bold text-white">{lead.name}</td>
                                            <td className="py-3.5 px-5 text-xs font-mono text-slate-300">{lead.phone}</td>
                                            <td className="py-3.5 px-5">
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                    lead.stage === 'Converted'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : lead.stage === 'New'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {lead.stage}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-xs text-slate-300">{lead.source}</td>
                                            <td className="py-3.5 px-5 text-xs text-slate-400">{lead.updatedAt}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="xl:col-span-5 bg-[#16181D] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                            <Activity size={16} />
                        </div>
                        <h2 className="text-[16px] font-bold text-white">Recent Lead & Workspace Activity</h2>
                    </div>

                    <div className="space-y-3">
                        {(customer.recentActivity || []).length === 0 ? (
                            <p className="text-sm text-slate-400">No recent activity logged.</p>
                        ) : (
                            customer.recentActivity.map((act) => (
                                <div key={act.id} className="p-3.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] space-y-1">
                                    <p className="text-xs font-semibold text-white">{act.action}</p>
                                    <p className="text-[11px] text-slate-400">{act.actor} • {act.time}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAdminDashboard;
