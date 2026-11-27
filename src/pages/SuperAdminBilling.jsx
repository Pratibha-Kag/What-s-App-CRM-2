import React, { useMemo, useState } from 'react';
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    AlertTriangle,
    AlertCircle,
    Search,
    Eye,
    Sliders,
    FileText,
    RotateCcw,
    Save,
    X,
    CheckCircle2,
    Building2,
} from 'lucide-react';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import { mockMessagePricing, mockWalletConfig } from '../mock/mockData';
import {
    formatCurrency,
    formatUnitPrice,
    getCustomerWalletSummary,
    getWalletHealth,
} from '../lib/walletUtils';
import { toast } from '../components/ui/Toast';
import WalletTransactionsPanel from '../components/wallet/WalletTransactionsPanel';
import BillingStatementModal from '../components/wallet/BillingStatementModal';

const SuperAdminBilling = () => {
    const {
        role,
        customers,
        walletTransactions,
        messagePricing,
        adjustCustomerWallet,
        updateMessagePricing,
        resetMessagePricing,
    } = useAppStore();

    const canView = normalizeRoleKey(role) === 'SUPER_ADMIN';

    const [activeTab, setActiveTab] = useState('wallets'); // 'wallets' | 'pricing' | 'transactions'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [healthFilter, setHealthFilter] = useState('All');

    // Individual Wallet Detail Modal
    const [inspectCustomerId, setInspectCustomerId] = useState(null);

    // Manual Credit/Debit Adjustment + Confirmation Modals
    const [adjustCustomer, setAdjustCustomer] = useState(null);
    const [adjustForm, setAdjustForm] = useState({ type: 'Credit', amount: '', reason: '' });
    const [adjustErrors, setAdjustErrors] = useState({});
    const [confirmAdjust, setConfirmAdjust] = useState(null);

    // Statement & Invoice Preview
    const [statementModal, setStatementModal] = useState({
        open: false,
        customer: null,
        transaction: null,
    });

    // Editable Pricing State
    const [pricingDraft, setPricingDraft] = useState(() => {
        const init = {};
        Object.keys(mockMessagePricing).forEach((cat) => {
            init[cat] = String(messagePricing?.[cat]?.unitPrice ?? mockMessagePricing[cat].unitPrice);
        });
        return init;
    });
    const [pricingError, setPricingError] = useState('');

    // Platform Metrics
    const platformTotals = useMemo(() => {
        const totalBalance = customers.reduce((sum, c) => sum + (Number(c.walletBalance) || 0), 0);
        const totalRecharged = walletTransactions
            .filter((t) => (t.type === 'Recharge' || t.type === 'Credit') && t.status === 'Success')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalDeductions = walletTransactions
            .filter((t) => (t.type === 'Deduction' || t.type === 'Debit') && t.status === 'Success')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const lowOrInsufficient = customers.filter(
            (c) => (Number(c.walletBalance) || 0) <= mockWalletConfig.lowBalanceThreshold
        ).length;
        const failedPayments = walletTransactions.filter((t) => t.status === 'Failed').length;

        return {
            totalBalance,
            totalRecharged,
            totalDeductions,
            lowOrInsufficient,
            failedPayments,
        };
    }, [customers, walletTransactions]);

    const enrichedCustomers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return customers
            .map((cust) => {
                const summary = getCustomerWalletSummary(cust.id, walletTransactions, messagePricing);
                const health = getWalletHealth(cust.walletBalance);
                return { cust, summary, health };
            })
            .filter(({ cust, health }) => {
                if (statusFilter !== 'All' && cust.status !== statusFilter) return false;
                if (healthFilter !== 'All' && health.key !== healthFilter) return false;
                if (q) {
                    return (
                        (cust.companyName || '').toLowerCase().includes(q) ||
                        (cust.workspaceCode || '').toLowerCase().includes(q) ||
                        (cust.contactPerson || '').toLowerCase().includes(q) ||
                        (cust.assignedSoftware || '').toLowerCase().includes(q)
                    );
                }
                return true;
            });
    }, [customers, walletTransactions, messagePricing, searchQuery, statusFilter, healthFilter]);

    const inspectedRecord = useMemo(() => {
        if (!inspectCustomerId) return null;
        const cust = customers.find((c) => c.id === inspectCustomerId);
        if (!cust) return null;
        return {
            cust,
            summary: getCustomerWalletSummary(cust.id, walletTransactions, messagePricing),
            health: getWalletHealth(cust.walletBalance),
        };
    }, [inspectCustomerId, customers, walletTransactions, messagePricing]);

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400">
                        Global wallet & billing management is restricted to Super Admin accounts.
                    </p>
                </div>
            </div>
        );
    }

    const openAdjustModal = (cust, initialType = 'Credit') => {
        setAdjustCustomer(cust);
        setAdjustForm({ type: initialType, amount: '', reason: '' });
        setAdjustErrors({});
    };

    const handleAdjustReview = (e) => {
        e.preventDefault();
        const errs = {};
        const numericAmount = Number(adjustForm.amount);
        const currentBal = Number(adjustCustomer?.walletBalance) || 0;

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            errs.amount = 'Enter an amount greater than $0.00.';
        } else if (adjustForm.type === 'Debit' && numericAmount > currentBal) {
            errs.amount = `Cannot debit more than current balance (${formatCurrency(currentBal)}).`;
        }

        if (!adjustForm.reason.trim()) {
            errs.reason = 'Reason / billing note is required.';
        }

        setAdjustErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setConfirmAdjust({
            customer: adjustCustomer,
            type: adjustForm.type,
            amount: Number(numericAmount.toFixed(2)),
            reason: adjustForm.reason.trim(),
            resultingBalance:
                adjustForm.type === 'Credit'
                    ? Number((currentBal + numericAmount).toFixed(2))
                    : Number((currentBal - numericAmount).toFixed(2)),
        });
    };

    const handleConfirmAdjustment = () => {
        if (!confirmAdjust) return;
        const res = adjustCustomerWallet({
            customerId: confirmAdjust.customer.id,
            type: confirmAdjust.type,
            amount: confirmAdjust.amount,
            reason: confirmAdjust.reason,
        });

        if (res.ok) {
            toast.success(
                `${confirmAdjust.type} of ${formatCurrency(confirmAdjust.amount)} applied to ${confirmAdjust.customer.companyName}`
            );
            setConfirmAdjust(null);
            setAdjustCustomer(null);
        } else {
            toast.error(res.error);
            setConfirmAdjust(null);
        }
    };

    const handleSavePricing = (e) => {
        e.preventDefault();
        const payload = {};
        for (const cat of Object.keys(mockMessagePricing)) {
            const val = Number(pricingDraft[cat]);
            if (!Number.isFinite(val) || val <= 0 || val > 5) {
                setPricingError(`Invalid rate for ${cat}. Enter a value between $0.001 and $5.000.`);
                return;
            }
            payload[cat] = { unitPrice: val };
        }
        setPricingError('');
        updateMessagePricing(payload);
        toast.success('Category message pricing configuration saved.');
    };

    const handleResetPricing = () => {
        resetMessagePricing();
        const defaults = {};
        Object.keys(mockMessagePricing).forEach((cat) => {
            defaults[cat] = String(mockMessagePricing[cat].unitPrice);
        });
        setPricingDraft(defaults);
        setPricingError('');
        toast.success('Message category pricing reset to defaults.');
    };

    const kpis = [
        {
            title: 'Total Wallet Balances',
            value: formatCurrency(platformTotals.totalBalance),
            subtitle: `Across ${customers.length} customer workspaces`,
            icon: Wallet,
            bgLight: 'bg-indigo-500/10',
            textLight: 'text-indigo-400',
        },
        {
            title: 'Total Customer Recharges',
            value: formatCurrency(platformTotals.totalRecharged),
            subtitle: `${platformTotals.failedPayments} failed recharge/deduction attempts logged`,
            icon: ArrowDownLeft,
            bgLight: 'bg-emerald-500/10',
            textLight: 'text-emerald-400',
        },
        {
            title: 'Total Usage Deductions',
            value: formatCurrency(platformTotals.totalDeductions),
            subtitle: 'Simulated message charges & manual debits',
            icon: ArrowUpRight,
            bgLight: 'bg-amber-500/10',
            textLight: 'text-amber-400',
        },
        {
            title: 'Low / Insufficient Wallets',
            value: platformTotals.lowOrInsufficient,
            subtitle: `Threshold <= ${formatCurrency(mockWalletConfig.lowBalanceThreshold)}`,
            icon: AlertTriangle,
            bgLight: 'bg-rose-500/10',
            textLight: 'text-rose-400',
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {/* Header & Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight mb-1">
                        Super Admin Wallet & Billing
                    </h1>
                    <p className="text-[12px] sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        Global Customer Balances, Adjustments, Message Pricing & Statements
                    </p>
                </div>

                <div className="inline-flex flex-wrap sm:flex-nowrap shrink-0 bg-[#1C1F26] p-1 rounded-xl border border-[#2D333B] gap-1">
                    {[
                        { id: 'wallets', label: 'Customer Wallets' },
                        { id: 'pricing', label: 'Pricing Configuration' },
                        { id: 'transactions', label: 'Recharge & Ledger' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-[#8B5CF6] text-white'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {kpis.map((card, i) => (
                    <div
                        key={i}
                        className="bg-[#1C1F26] rounded-[20px] p-5 sm:p-6 border border-[#2D333B] hover:border-[#4B5563] transition-colors min-w-0"
                    >
                        <div className={`h-11 w-11 rounded-2xl ${card.bgLight} ${card.textLight} flex items-center justify-center border border-white/5 mb-4`}>
                            <card.icon size={22} />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {card.title}
                        </h3>
                        <div className="text-[28px] font-black text-white tracking-tighter mb-1">
                            {card.value}
                        </div>
                        <p className="text-xs font-medium text-slate-400 truncate">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* TAB 1: Customer Wallets Management */}
            {activeTab === 'wallets' && (
                <div className="bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden min-w-0">
                    <div className="p-4 sm:p-6 border-b border-[#2D333B] bg-[#16181D] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[16px] font-bold text-white">Customer-Wise Wallet Directory</h2>
                                <p className="text-xs text-slate-400">
                                    Inspect customer wallets, issue manual credits/debits, or preview billing statements
                                </p>
                            </div>
                            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                                {enrichedCustomers.length} Wallets
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 min-w-0">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    aria-label="Search customer wallets"
                                    placeholder="Search company, code, contact, or software..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                                />
                            </div>
                            <select
                                aria-label="Filter by account status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                            >
                                <option value="All">All Account Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            <select
                                aria-label="Filter by wallet health"
                                value={healthFilter}
                                onChange={(e) => setHealthFilter(e.target.value)}
                                className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                            >
                                <option value="All">All Balance Health</option>
                                <option value="Healthy">Healthy</option>
                                <option value="Low">Low Balance</option>
                                <option value="Insufficient">Insufficient Balance</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-[#111318]">
                                <tr>
                                    <th className="py-3 px-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Customer</th>
                                    <th className="py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Status & Health</th>
                                    <th className="py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Balance</th>
                                    <th className="py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Recharged</th>
                                    <th className="py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Deducted</th>
                                    <th className="py-3 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Msgs</th>
                                    <th className="py-3 px-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrichedCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                                            No customer wallets match the current search or filters.
                                        </td>
                                    </tr>
                                ) : (
                                    enrichedCustomers.map(({ cust, summary, health }) => (
                                        <tr key={cust.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                            <td className="py-3 px-3.5">
                                                <p className="text-sm font-bold text-white">{cust.companyName}</p>
                                                <p className="text-xs text-slate-400">
                                                    {cust.workspaceCode} • {cust.contactPerson}
                                                </p>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                                        {cust.status}
                                                    </span>
                                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${health.badgeClass}`}>
                                                        {health.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`py-3 px-3 text-sm font-black text-right ${health.textClass}`}>
                                                {formatCurrency(cust.walletBalance)}
                                            </td>
                                            <td className="py-3 px-3 text-xs font-bold text-emerald-400 text-right">
                                                +{formatCurrency(summary.totalRecharged)}
                                            </td>
                                            <td className="py-3 px-3 text-xs font-bold text-amber-300 text-right">
                                                -{formatCurrency(summary.totalDeductions)}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-slate-300 text-right">
                                                {(cust.messagesSent || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3.5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setInspectCustomerId(cust.id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-slate-200 transition-colors"
                                                    >
                                                        <Eye size={13} />
                                                        <span>Details</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAdjustModal(cust, 'Credit')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6] text-xs font-bold text-indigo-200 hover:text-white transition-colors"
                                                    >
                                                        <Sliders size={13} />
                                                        <span>Adjust</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStatementModal({ open: true, customer: cust, transaction: null })}
                                                        aria-label={`Statement for ${cust.companyName}`}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-emerald-500 text-xs font-bold text-emerald-300 transition-colors"
                                                    >
                                                        <FileText size={13} />
                                                        <span>Invoice</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: Message Category Pricing Configuration */}
            {activeTab === 'pricing' && (
                <form
                    onSubmit={handleSavePricing}
                    className="bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 space-y-6"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2D333B] pb-4">
                        <div>
                            <h2 className="text-[16px] font-bold text-white">Message Category Pricing Configuration</h2>
                            <p className="text-xs text-slate-400">
                                Configure unit message rates ({mockWalletConfig.currencyCode}) used across all customer wallets and deduction simulations
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleResetPricing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] text-xs font-bold text-slate-300 transition-colors"
                        >
                            <RotateCcw size={14} />
                            <span>Reset Defaults</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(mockMessagePricing).map((cat) => {
                            const info = mockMessagePricing[cat];
                            return (
                                <div key={cat} className="p-4 rounded-xl bg-[#111318] border border-[#2D333B] space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{cat} Messages</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">{info.description}</p>
                                        </div>
                                        <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg shrink-0">
                                            Active: {formatUnitPrice(messagePricing?.[cat]?.unitPrice ?? info.unitPrice)}
                                        </span>
                                    </div>
                                    <div>
                                        <label htmlFor={`price-${cat}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                            Unit Price ({mockWalletConfig.currencyCode} per message)
                                        </label>
                                        <input
                                            id={`price-${cat}`}
                                            type="number"
                                            step="0.001"
                                            min="0.001"
                                            max="5"
                                            value={pricingDraft[cat]}
                                            onChange={(e) => {
                                                setPricingDraft((prev) => ({ ...prev, [cat]: e.target.value }));
                                                setPricingError('');
                                            }}
                                            className="w-full min-h-[42px] bg-[#16181D] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {pricingError && (
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300">
                            {pricingError}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#2D333B]">
                        <p className="text-xs text-slate-400">{mockWalletConfig.pricingDisclaimer}</p>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white transition-colors shrink-0"
                        >
                            <Save size={15} />
                            <span>Save Pricing Rules</span>
                        </button>
                    </div>
                </form>
            )}

            {/* TAB 3: Platform Transactions & Recharges Ledger */}
            {activeTab === 'transactions' && (
                <WalletTransactionsPanel
                    transactions={walletTransactions}
                    customers={customers}
                    showCustomerColumn
                    title="Platform Recharge, Deduction & Billing Ledger"
                    subtitle="Search and filter all customer recharges, payment statuses, usage deductions, and manual credits/debits"
                    onSelectInvoice={(txn) => {
                        const cust = customers.find((c) => c.id === txn.customerId) || customers[0];
                        setStatementModal({ open: true, customer: cust, transaction: txn });
                    }}
                />
            )}

            {/* Customer Wallet Detail Modal */}
            {inspectedRecord && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Customer Wallet Details"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-white">
                        <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between gap-3 sticky top-0 z-10">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <Building2 size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        {inspectedRecord.cust.companyName} — Wallet Details
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {inspectedRecord.cust.workspaceCode} • {inspectedRecord.cust.contactPerson}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInspectCustomerId(null)}
                                aria-label="Close wallet details"
                                className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-4 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available</p>
                                    <p className={`text-xl font-black mt-1 ${inspectedRecord.health.textClass}`}>
                                        {formatCurrency(inspectedRecord.cust.walletBalance)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Recharged</p>
                                    <p className="text-xl font-black text-emerald-400 mt-1">
                                        +{formatCurrency(inspectedRecord.summary.totalRecharged)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deductions</p>
                                    <p className="text-xl font-black text-amber-300 mt-1">
                                        -{formatCurrency(inspectedRecord.summary.totalDeductions)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Actions</p>
                                    <button
                                        type="button"
                                        onClick={() => openAdjustModal(inspectedRecord.cust, 'Credit')}
                                        className="mt-1.5 w-full py-1.5 px-3 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white"
                                    >
                                        Credit / Debit
                                    </button>
                                </div>
                            </div>

                            <WalletTransactionsPanel
                                transactions={inspectedRecord.summary.transactions}
                                customers={customers}
                                showCustomerColumn={false}
                                pageSize={5}
                                title="Customer Transaction History"
                                subtitle={`Recent wallet events for ${inspectedRecord.cust.companyName}`}
                                onSelectInvoice={(txn) =>
                                    setStatementModal({
                                        open: true,
                                        customer: inspectedRecord.cust,
                                        transaction: txn,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Credit / Debit Form Modal */}
            {adjustCustomer && !confirmAdjust && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Manual Wallet Adjustment"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <form
                        onSubmit={handleAdjustReview}
                        className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white"
                    >
                        <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Manual Credit / Debit</h3>
                                <p className="text-xs text-slate-400">
                                    {adjustCustomer.companyName} • Current: {formatCurrency(adjustCustomer.walletBalance)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAdjustCustomer(null)}
                                aria-label="Close adjustment modal"
                                className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                {['Credit', 'Debit'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                            setAdjustForm((prev) => ({ ...prev, type: t }));
                                            setAdjustErrors({});
                                        }}
                                        className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors ${
                                            adjustForm.type === t
                                                ? t === 'Credit'
                                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                                    : 'bg-rose-500/15 border-rose-500 text-rose-300'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {t === 'Credit' ? '+ Credit Wallet' : '- Debit Wallet'}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="adjust-amount" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                    Amount ({mockWalletConfig.currencyCode})
                                </label>
                                <input
                                    id="adjust-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={adjustForm.amount}
                                    onChange={(e) => {
                                        setAdjustForm((prev) => ({ ...prev, amount: e.target.value }));
                                        setAdjustErrors((prev) => ({ ...prev, amount: undefined }));
                                    }}
                                    placeholder="0.00"
                                    className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                                />
                                {adjustErrors.amount && (
                                    <p className="text-xs text-rose-400">{adjustErrors.amount}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="adjust-reason" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                    Adjustment Reason
                                </label>
                                <textarea
                                    id="adjust-reason"
                                    rows={3}
                                    value={adjustForm.reason}
                                    onChange={(e) => {
                                        setAdjustForm((prev) => ({ ...prev, reason: e.target.value }));
                                        setAdjustErrors((prev) => ({ ...prev, reason: undefined }));
                                    }}
                                    placeholder="e.g., Promotional onboarding credit or invoice correction"
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                                />
                                {adjustErrors.reason && (
                                    <p className="text-xs text-rose-400">{adjustErrors.reason}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAdjustCustomer(null)}
                                    className="flex-1 min-h-[42px] rounded-xl bg-[#111318] border border-[#2D333B] text-xs font-bold text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] min-h-[42px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white"
                                >
                                    Review Adjustment
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Confirmation Modal for Manual Credit / Debit */}
            {confirmAdjust && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Confirm Manual Wallet Adjustment"
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center shrink-0">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Confirm Wallet {confirmAdjust.type}</h3>
                                <p className="text-xs text-slate-400">{confirmAdjust.customer.companyName}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B] space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Current Balance</span>
                                <span className="font-bold text-white">{formatCurrency(confirmAdjust.customer.walletBalance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Adjustment ({confirmAdjust.type})</span>
                                <span className={`font-black ${confirmAdjust.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {confirmAdjust.type === 'Credit' ? '+' : '-'}{formatCurrency(confirmAdjust.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-[#2D333B]">
                                <span className="text-slate-300 font-bold">New Balance</span>
                                <span className="font-black text-white">{formatCurrency(confirmAdjust.resultingBalance)}</span>
                            </div>
                            <p className="text-slate-400 pt-1">
                                Reason: <span className="text-slate-200">{confirmAdjust.reason}</span>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmAdjust(null)}
                                className="flex-1 min-h-[42px] rounded-xl bg-[#111318] border border-[#2D333B] text-xs font-bold text-slate-300"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAdjustment}
                                className="flex-[2] min-h-[42px] rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white"
                            >
                                Confirm {confirmAdjust.type}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Statement / Invoice Preview Modal */}
            <BillingStatementModal
                isOpen={statementModal.open}
                onClose={() => setStatementModal({ open: false, customer: null, transaction: null })}
                customer={statementModal.customer}
                transaction={statementModal.transaction}
                summary={
                    statementModal.customer
                        ? getCustomerWalletSummary(
                              statementModal.customer.id,
                              walletTransactions,
                              messagePricing
                          )
                        : null
                }
            />
        </div>
    );
};

export default SuperAdminBilling;
