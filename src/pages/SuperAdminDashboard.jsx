import React, { useMemo, useState } from 'react';
import {
    Building2,
    Users,
    CheckCircle2,
    MessageSquare,
    Wallet,
    Package,
    Activity,
    Search,
    ChevronRight,
    ArrowUpRight,
    Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import useAppStore from '../store/useStore';
import { mockCustomerActivityFeed, mockWalletConfig } from '../mock/mockData';
import { formatCurrency, getWalletHealth } from '../lib/walletUtils';

const STATUS_STYLES = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Inactive: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    Suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const SuperAdminDashboard = () => {
    const { customers, walletTransactions } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [softwareFilter, setSoftwareFilter] = useState('All');

    const metrics = useMemo(() => {
        const total = customers.length;
        const active = customers.filter((c) => c.status === 'Active').length;
        const inactive = customers.filter((c) => c.status === 'Inactive').length;
        const suspended = customers.filter((c) => c.status === 'Suspended').length;

        const totalContacts = customers.reduce((sum, c) => sum + (Number(c.contactsCount) || 0), 0);
        const totalConversions = customers.reduce((sum, c) => sum + (Number(c.conversionsCount) || 0), 0);
        const totalMessages = customers.reduce((sum, c) => sum + (Number(c.messagesSent) || 0), 0);
        const totalQuota = customers.reduce((sum, c) => sum + (Number(c.monthlyQuotaCount) || 0), 0);
        const totalWallet = customers.reduce((sum, c) => sum + (Number(c.walletBalance) || 0), 0);
        const lowWalletsCount = customers.filter(
            (c) => (Number(c.walletBalance) || 0) <= mockWalletConfig.lowBalanceThreshold
        ).length;
        const totalRecharged = (walletTransactions || [])
            .filter((t) => (t.type === 'Recharge' || t.type === 'Credit') && t.status === 'Success')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const activeResellMrr = customers
            .filter((c) => (c.reselling?.status || c.status) === 'Active')
            .reduce((sum, c) => sum + (Number(c.reselling?.monthlyPrice) || 0), 0);

        return {
            total,
            active,
            inactive,
            suspended,
            totalContacts,
            totalConversions,
            totalMessages,
            totalQuota,
            totalWallet,
            lowWalletsCount,
            totalRecharged,
            activeResellMrr,
        };
    }, [customers, walletTransactions]);

    const softwareOptions = useMemo(
        () => ['All', ...new Set(customers.map((c) => c.assignedSoftware).filter(Boolean))],
        [customers]
    );

    const filteredCustomers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return customers.filter((c) => {
            if (statusFilter !== 'All' && c.status !== statusFilter) return false;
            if (softwareFilter !== 'All' && c.assignedSoftware !== softwareFilter) return false;
            if (q) {
                return (
                    (c.companyName || '').toLowerCase().includes(q) ||
                    (c.workspaceCode || '').toLowerCase().includes(q) ||
                    (c.contactPerson || '').toLowerCase().includes(q) ||
                    (c.assignedSoftware || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [customers, searchQuery, statusFilter, softwareFilter]);

    const chartData = useMemo(
        () =>
            customers.map((c) => ({
                name: c.companyName.split(' ')[0],
                messagesK: Number(((c.messagesSent || 0) / 1000).toFixed(1)),
                conversions: c.conversionsCount || 0,
            })),
        [customers]
    );

    const resellingBreakdown = useMemo(() => {
        const map = {};
        customers.forEach((c) => {
            const prod = c.reselling?.product || c.assignedSoftware || 'Standard';
            if (!map[prod]) {
                map[prod] = { product: prod, count: 0, mrr: 0 };
            }
            map[prod].count += 1;
            if ((c.reselling?.status || c.status) === 'Active') {
                map[prod].mrr += Number(c.reselling?.monthlyPrice) || 0;
            }
        });
        return Object.values(map);
    }, [customers]);

    const cards = [
        {
            title: 'Customers Overview',
            value: metrics.total,
            subtitle: `${metrics.active} Active • ${metrics.inactive} Inactive • ${metrics.suspended} Suspended`,
            icon: Building2,
            bgLight: 'bg-indigo-500/10',
            textLight: 'text-indigo-400',
        },
        {
            title: 'Contacts & Conversions',
            value: metrics.totalContacts.toLocaleString(),
            subtitle: `${metrics.totalConversions.toLocaleString()} Successful Conversions`,
            icon: CheckCircle2,
            bgLight: 'bg-emerald-500/10',
            textLight: 'text-emerald-400',
        },
        {
            title: 'WhatsApp Message Usage',
            value: `${(metrics.totalMessages / 1000).toFixed(1)}k`,
            subtitle: `of ${(metrics.totalQuota / 1000).toFixed(0)}k monthly platform quota`,
            icon: MessageSquare,
            bgLight: 'bg-purple-500/10',
            textLight: 'text-purple-400',
        },
        {
            title: 'Platform Wallet Pool',
            value: formatCurrency(metrics.totalWallet),
            subtitle: `${metrics.lowWalletsCount} low/insufficient • +${formatCurrency(metrics.totalRecharged)} recharged`,
            icon: Wallet,
            bgLight: 'bg-amber-500/10',
            textLight: 'text-amber-400',
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight mb-1">
                        Super Admin Dashboard
                    </h1>
                    <p className="text-[12px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        Platform Customers, Usage, Reselling & Wallet Summary
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link
                        to="/super-admin/billing"
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-white text-xs font-black uppercase tracking-widest transition-colors w-full sm:w-auto shrink-0"
                    >
                        <Wallet size={15} />
                        <span>Wallet & Billing</span>
                    </Link>
                    <Link
                        to="/super-admin/customers"
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest transition-colors w-full sm:w-auto shrink-0"
                    >
                        <span>Manage Customers</span>
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-[#1C1F26] rounded-[20px] p-5 sm:p-6 border border-[#2D333B] hover:border-[#4B5563] transition-colors min-w-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-11 w-11 rounded-2xl ${card.bgLight} ${card.textLight} flex items-center justify-center border border-white/5 shrink-0`}>
                                <card.icon size={22} />
                            </div>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {card.title}
                        </h3>
                        <div className="text-[28px] sm:text-[32px] font-black text-white tracking-tighter mb-1">
                            {card.value}
                        </div>
                        <p className="text-xs font-medium text-slate-400 truncate">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Software Reselling Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Customer Usage Chart */}
                <div className="xl:col-span-7 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                        <div>
                            <h2 className="text-[16px] font-bold text-white">Customer Usage & Conversions</h2>
                            <p className="text-xs text-slate-400">WhatsApp messages (k) vs. conversions per account</p>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                            {customers.length} Accounts
                        </span>
                    </div>
                    <div className="h-[260px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                            <BarChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D333B" vertical={false} />
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111318',
                                        borderColor: '#2D333B',
                                        borderRadius: '12px',
                                        color: '#FFFFFF',
                                    }}
                                />
                                <Bar dataKey="messagesK" name="Messages (k)" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Software Reselling Overview */}
                <div className="xl:col-span-5 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 flex flex-col justify-between gap-4 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <Package size={20} />
                            </div>
                            <div>
                                <h2 className="text-[16px] font-bold text-white">Software Reselling Overview</h2>
                                <p className="text-xs text-slate-400">Active subscriptions & product mix</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active MRR</p>
                            <p className="text-lg font-black text-emerald-400">${metrics.activeResellMrr.toLocaleString()}/mo</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {resellingBreakdown.map((item) => (
                            <div
                                key={item.product}
                                className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{item.product}</p>
                                    <p className="text-xs text-slate-400">{item.count} assigned {item.count === 1 ? 'account' : 'accounts'}</p>
                                </div>
                                <span className="text-xs font-black text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg shrink-0">
                                    ${item.mrr}/mo
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Performance Table + Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Customer Performance & Wallet Table */}
                <div className="xl:col-span-8 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 sm:p-6 border-b border-[#2D333B] bg-[#16181D] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-white">Customer Performance & Wallet Overview</h2>
                                    <p className="text-xs text-slate-400">Live customer balances, message usage, and wallet health</p>
                                </div>
                            </div>
                            <Link
                                to="/super-admin/billing"
                                className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] hover:text-[#A78BFA] inline-flex items-center gap-1"
                            >
                                Wallet & Billing <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 min-w-0">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search company, code, contact, or software..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    aria-label="Filter by customer status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                                <select
                                    aria-label="Filter by software product"
                                    value={softwareFilter}
                                    onChange={(e) => setSoftwareFilter(e.target.value)}
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer max-w-[190px]"
                                >
                                    {softwareOptions.map((sw) => (
                                        <option key={sw} value={sw}>
                                            {sw === 'All' ? 'All Software' : sw}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[740px]">
                            <thead className="bg-[#111318]">
                                <tr>
                                    {['Customer', 'Status', 'Contacts / Conv.', 'WA Usage', 'Wallet Balance', 'Software'].map((h) => (
                                        <th key={h} className="py-3.5 px-4 sm:px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                                            No customers match the current search or filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((cust) => {
                                        const pct = cust.monthlyQuotaCount
                                            ? Math.min(100, Math.round(((cust.messagesSent || 0) / cust.monthlyQuotaCount) * 100))
                                            : 0;
                                        return (
                                            <tr key={cust.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                                <td className="py-3.5 px-4 sm:px-5">
                                                    <p className="text-sm font-bold text-white">{cust.companyName}</p>
                                                    <p className="text-xs text-slate-400">{cust.workspaceCode} • {cust.contactPerson}</p>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5">
                                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[cust.status] || STATUS_STYLES.Active}`}>
                                                        {cust.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5 text-xs text-slate-200">
                                                    <span className="font-bold">{(cust.contactsCount || 0).toLocaleString()}</span>
                                                    <span className="text-slate-500 mx-1">/</span>
                                                    <span className="text-emerald-400 font-bold">{(cust.conversionsCount || 0).toLocaleString()}</span>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5">
                                                    <div className="w-28 space-y-1">
                                                        <div className="flex justify-between text-[11px] text-slate-300">
                                                            <span>{((cust.messagesSent || 0) / 1000).toFixed(1)}k</span>
                                                            <span>{pct}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-[#111318] rounded-full overflow-hidden border border-[#2D333B]">
                                                            <div
                                                                className="h-full bg-[#8B5CF6] rounded-full"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5">
                                                    <span className={`text-sm font-bold block ${getWalletHealth(cust.walletBalance).textClass}`}>
                                                        {formatCurrency(cust.walletBalance)}
                                                    </span>
                                                    {getWalletHealth(cust.walletBalance).key !== 'Healthy' && (
                                                        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getWalletHealth(cust.walletBalance).badgeClass}`}>
                                                            {getWalletHealth(cust.walletBalance).label}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5 text-xs text-slate-300">
                                                    {cust.assignedSoftware}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Customer Activity */}
                <div className="xl:col-span-4 bg-[#16181D] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 flex flex-col min-w-0">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-8 w-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center border border-[#10B981]/20 shrink-0">
                            <Activity size={16} />
                        </div>
                        <h2 className="text-[16px] font-bold text-white">Recent Customer Activity</h2>
                    </div>

                    <div className="space-y-3 flex-1">
                        {mockCustomerActivityFeed.map((item) => (
                            <div
                                key={item.id}
                                className="p-3.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] space-y-1"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-white truncate">{item.customerName}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded shrink-0">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-snug">{item.event}</p>
                                <p className="text-[11px] text-slate-500">{item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
