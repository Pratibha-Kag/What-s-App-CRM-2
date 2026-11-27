import React, { useMemo, useState } from 'react';
import {
    Wallet,
    PlusCircle,
    ArrowDownLeft,
    ArrowUpRight,
    MessageSquare,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Building2,
    FileText,
    Calculator,
    Loader2,
    X,
    Send,
} from 'lucide-react';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import {
    mockMessagePricing,
    mockPaymentMethods,
    mockWalletConfig,
} from '../mock/mockData';
import {
    formatCurrency,
    formatUnitPrice,
    getCustomerWalletSummary,
    getWalletHealth,
} from '../lib/walletUtils';
import { toast } from '../components/ui/Toast';
import WalletTransactionsPanel from '../components/wallet/WalletTransactionsPanel';
import BillingStatementModal from '../components/wallet/BillingStatementModal';
import SuperAdminBilling from './SuperAdminBilling';

const RECHARGE_PRESETS = [50, 100, 250, 500, 1000];

const CATEGORY_COLORS = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const CustomerWallet = () => {
    const {
        role,
        customers,
        selectedAccount,
        walletTransactions,
        messagePricing,
        rechargeCustomerWallet,
        simulateMessageDeduction,
    } = useAppStore();

    const roleKey = normalizeRoleKey(role);

    if (roleKey === 'SUPER_ADMIN') {
        return <SuperAdminBilling />;
    }

    const canView = roleKey === 'ADMIN' || roleKey === 'CUSTOMER_ADMIN';

    const customer = useMemo(() => {
        if (!customers || customers.length === 0) return null;
        if (selectedAccount?.id && selectedAccount.id !== 'platform') {
            return customers.find((c) => c.id === selectedAccount.id) || customers[0];
        }
        return customers[0];
    }, [customers, selectedAccount]);

    const summary = useMemo(
        () =>
            customer
                ? getCustomerWalletSummary(customer.id, walletTransactions, messagePricing)
                : null,
        [customer, walletTransactions, messagePricing]
    );

    // Recharge Modal State
    const [rechargeAmount, setRechargeAmount] = useState('250');
    const [paymentMethod, setPaymentMethod] = useState(mockPaymentMethods[0].shortLabel);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [simulateOutcome, setSimulateOutcome] = useState('success'); // 'success' | 'failure'
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [amountError, setAmountError] = useState('');

    // Simulated Message Deduction State
    const [simCategory, setSimCategory] = useState('Marketing');
    const [simQuantity, setSimQuantity] = useState('500');
    const [simNote, setSimNote] = useState('');
    const [simFeedback, setSimFeedback] = useState(null);

    // Statement / Invoice Modal State
    const [statementModal, setStatementModal] = useState({ open: false, transaction: null });

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400">
                        Customer wallet and recharge controls are restricted to Customer Admin accounts.
                    </p>
                </div>
            </div>
        );
    }

    if (!customer || !summary) {
        return <div className="p-6 text-white">No customer workspace assigned.</div>;
    }

    const balanceHealth = getWalletHealth(customer.walletBalance);
    const parsedRecharge = Number(rechargeAmount);
    const activeUnitPrice = Number(
        messagePricing?.[simCategory]?.unitPrice ?? mockMessagePricing[simCategory].unitPrice
    );
    const parsedSimQty = Math.max(0, Math.floor(Number(simQuantity) || 0));
    const estimatedDeduction = Number((parsedSimQty * activeUnitPrice).toFixed(2));
    const isInsufficientForSimulation = estimatedDeduction > (Number(customer.walletBalance) || 0);

    const openPaymentModal = () => {
        setPaymentResult(null);
        if (!Number.isFinite(parsedRecharge) || parsedRecharge <= 0 || parsedRecharge > 50000) {
            setAmountError('Enter a valid amount between $1.00 and $50,000.00.');
            return;
        }
        setAmountError('');
        setIsPaymentModalOpen(true);
    };

    const handleSimulatedPayment = async () => {
        setIsProcessingPayment(true);
        setPaymentResult(null);

        await new Promise((resolve) => setTimeout(resolve, 450));

        const res = rechargeCustomerWallet({
            customerId: customer.id,
            amount: parsedRecharge,
            paymentMethod,
            simulateFailure: simulateOutcome === 'failure',
        });

        setIsProcessingPayment(false);

        if (res.ok) {
            setPaymentResult({
                ok: true,
                title: 'Simulated Recharge Successful',
                message: `Added ${formatCurrency(parsedRecharge)} via ${paymentMethod}. New balance: ${formatCurrency(res.newBalance)}.`,
                invoiceNumber: res.transaction?.invoiceNumber,
            });
            toast.success(`Wallet recharged +${formatCurrency(parsedRecharge)}`);
        } else {
            setPaymentResult({
                ok: false,
                title: 'Simulated Payment Failed',
                message: res.error || 'Payment declined in demo simulation. Wallet balance was not changed.',
            });
            toast.error('Simulated recharge failed');
        }
    };

    const handleSimulateDeduction = (e) => {
        e.preventDefault();
        setSimFeedback(null);

        const res = simulateMessageDeduction({
            customerId: customer.id,
            category: simCategory,
            quantity: simQuantity,
            note: simNote,
        });

        if (res.ok) {
            setSimFeedback({
                type: 'success',
                message: `Deducted ${formatCurrency(res.transaction.amount)} for ${res.transaction.quantity.toLocaleString()} ${simCategory} messages. Remaining balance: ${formatCurrency(res.newBalance)}.`,
            });
            setSimNote('');
            toast.success(`Usage simulated (-${formatCurrency(res.transaction.amount)})`);
        } else {
            setSimFeedback({
                type: 'error',
                message: res.error,
            });
            toast.error('Insufficient balance or invalid quantity');
        }
    };

    const kpiCards = [
        {
            title: 'Available Wallet Balance',
            value: formatCurrency(customer.walletBalance),
            subtitle: balanceHealth.label,
            icon: Wallet,
            bgLight:
                balanceHealth.key === 'Insufficient'
                    ? 'bg-rose-500/10'
                    : balanceHealth.key === 'Low'
                    ? 'bg-amber-500/10'
                    : 'bg-emerald-500/10',
            textLight: balanceHealth.textClass,
        },
        {
            title: 'Total Recharged',
            value: formatCurrency(summary.totalRecharged),
            subtitle: `${summary.transactions.filter((t) => t.type === 'Recharge' && t.status === 'Success').length} completed top-ups`,
            icon: ArrowDownLeft,
            bgLight: 'bg-indigo-500/10',
            textLight: 'text-indigo-400',
        },
        {
            title: 'Total Deductions',
            value: formatCurrency(summary.totalDeductions),
            subtitle: `${summary.billedMessages.toLocaleString()} billed demo messages`,
            icon: ArrowUpRight,
            bgLight: 'bg-amber-500/10',
            textLight: 'text-amber-400',
        },
        {
            title: 'WhatsApp Message Usage',
            value: (customer.messagesSent || 0).toLocaleString(),
            subtitle: `of ${(customer.monthlyQuotaCount || 0).toLocaleString()} monthly quota`,
            icon: MessageSquare,
            bgLight: 'bg-purple-500/10',
            textLight: 'text-purple-400',
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1F26] border border-[#2D333B] text-xs font-bold text-indigo-300">
                            <Building2 size={13} />
                            {customer.workspaceCode}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${balanceHealth.badgeClass}`}>
                            {balanceHealth.key !== 'Healthy' && <AlertTriangle size={12} />}
                            {balanceHealth.label}
                        </span>
                    </div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight truncate">
                        Customer Wallet & Billing
                    </h1>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        {customer.companyName} • {customer.assignedSoftware}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => setStatementModal({ open: true, transaction: null })}
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-xs font-bold uppercase tracking-widest text-slate-200 transition-colors"
                    >
                        <FileText size={15} />
                        <span>Billing Statement</span>
                    </button>
                    <button
                        type="button"
                        onClick={openPaymentModal}
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white transition-colors"
                    >
                        <PlusCircle size={15} />
                        <span>Recharge Wallet</span>
                    </button>
                </div>
            </div>

            {/* Low / Insufficient Balance Alert Banner */}
            {balanceHealth.key !== 'Healthy' && (
                <div
                    role="alert"
                    className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        balanceHealth.key === 'Insufficient'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold">{balanceHealth.label} Warning</p>
                            <p className="text-xs opacity-90">{balanceHealth.hint}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setRechargeAmount('250');
                            setAmountError('');
                            setPaymentResult(null);
                            setIsPaymentModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shrink-0"
                    >
                        Top Up Now
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {kpiCards.map((card, idx) => (
                    <div
                        key={idx}
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

            {/* Recharge Panel + Category Usage & Deduction Simulator */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Quick Recharge Selection */}
                <div className="xl:col-span-5 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 space-y-5 min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <CreditCard size={18} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-bold text-white">Wallet Recharge (Simulated)</h2>
                            <p className="text-xs text-slate-400">Select a preset or enter custom top-up amount</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                            Quick Select Amount ({mockWalletConfig.currencyCode})
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {RECHARGE_PRESETS.map((preset) => {
                                const isActive = Number(rechargeAmount) === preset;
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => {
                                            setRechargeAmount(String(preset));
                                            setAmountError('');
                                        }}
                                        className={`py-2.5 px-2 rounded-xl text-xs font-black border transition-colors ${
                                            isActive
                                                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-300 hover:border-[#8B5CF6]'
                                        }`}
                                    >
                                        {mockWalletConfig.currencySymbol}{preset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="custom-recharge-amount" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                Custom Amount ({mockWalletConfig.currencyCode})
                            </label>
                            <input
                                id="custom-recharge-amount"
                                type="number"
                                min="1"
                                max="50000"
                                step="0.01"
                                value={rechargeAmount}
                                onChange={(e) => {
                                    setRechargeAmount(e.target.value);
                                    setAmountError('');
                                }}
                                placeholder="Enter amount"
                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="wallet-payment-method" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                Dummy Payment Method
                            </label>
                            <select
                                id="wallet-payment-method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                            >
                                {mockPaymentMethods.map((pm) => (
                                    <option key={pm.id} value={pm.shortLabel}>
                                        {pm.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {amountError && (
                        <p className="text-xs font-semibold text-rose-400">{amountError}</p>
                    )}

                    <button
                        type="button"
                        onClick={openPaymentModal}
                        className="w-full min-h-[44px] py-2.5 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                        <PlusCircle size={16} />
                        <span>Proceed to Simulated Payment</span>
                    </button>

                    <p className="text-[11px] text-slate-400 bg-[#111318] border border-[#2D333B] rounded-xl p-3">
                        {mockWalletConfig.pricingDisclaimer} No real card charge or payment gateway call occurs.
                    </p>
                </div>

                {/* Category Pricing & Message Usage Breakdown */}
                <div className="xl:col-span-7 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] p-5 sm:p-6 space-y-5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-[16px] font-bold text-white">Message Pricing & Usage Breakdown</h2>
                            <p className="text-xs text-slate-400">
                                Configurable category rates and {customer.companyName} usage deductions
                            </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#111318] border border-[#2D333B] text-slate-300">
                            {mockWalletConfig.currencyCode} Rates
                        </span>
                    </div>

                    {/* 4 Category Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {summary.categoryBreakdown.map((cat) => (
                            <div
                                key={cat.category}
                                className="p-4 rounded-xl bg-[#111318] border border-[#2D333B] flex flex-col justify-between gap-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[cat.badgeColor] || CATEGORY_COLORS.purple}`}>
                                            {cat.category}
                                        </span>
                                        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                                            {cat.description}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-white">{formatUnitPrice(cat.unitPrice)}</p>
                                        <p className="text-[10px] text-slate-500">per msg</p>
                                    </div>
                                </div>
                                <div className="pt-2.5 border-t border-[#2D333B]/60 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Sent: <strong className="text-white">{cat.quantity.toLocaleString()}</strong>
                                    </span>
                                    <span className="text-slate-400">
                                        Deducted: <strong className="text-amber-300">{formatCurrency(cat.totalCost)}</strong>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simulate Message Deduction Calculator */}
                    <form
                        onSubmit={handleSimulateDeduction}
                        className="p-4 rounded-xl bg-[#16181D] border border-[#2D333B] space-y-3"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Calculator size={16} className="text-[#8B5CF6]" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                                    Simulate Usage Deduction (Frontend Demo)
                                </h3>
                            </div>
                            <span className={`text-xs font-black ${isInsufficientForSimulation ? 'text-rose-400' : 'text-emerald-400'}`}>
                                Est. Deduction: {formatCurrency(estimatedDeduction)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <select
                                aria-label="Message category"
                                value={simCategory}
                                onChange={(e) => {
                                    setSimCategory(e.target.value);
                                    setSimFeedback(null);
                                }}
                                className="sm:col-span-4 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                            >
                                {Object.keys(mockMessagePricing).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat} ({formatUnitPrice(messagePricing?.[cat]?.unitPrice ?? mockMessagePricing[cat].unitPrice)})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                aria-label="Message quantity"
                                min="1"
                                value={simQuantity}
                                onChange={(e) => {
                                    setSimQuantity(e.target.value);
                                    setSimFeedback(null);
                                }}
                                placeholder="Quantity"
                                className="sm:col-span-3 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                            />
                            <input
                                type="text"
                                aria-label="Deduction campaign note"
                                value={simNote}
                                onChange={(e) => setSimNote(e.target.value)}
                                placeholder="Campaign note (optional)"
                                className="sm:col-span-5 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                            />
                        </div>

                        {isInsufficientForSimulation && parsedSimQty > 0 && (
                            <p className="text-xs font-semibold text-rose-400">
                                Insufficient wallet balance: estimated deduction ({formatCurrency(estimatedDeduction)}) exceeds available balance ({formatCurrency(customer.walletBalance)}).
                            </p>
                        )}

                        {simFeedback && (
                            <div
                                role="status"
                                className={`p-3 rounded-xl text-xs font-semibold border ${
                                    simFeedback.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                }`}
                            >
                                {simFeedback.message}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-[11px] text-slate-400">
                                {parsedSimQty.toLocaleString()} msgs × {formatUnitPrice(activeUnitPrice)} = {formatCurrency(estimatedDeduction)}
                            </span>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 min-h-[38px] px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-white transition-colors"
                            >
                                <Send size={13} />
                                <span>Simulate Deduction</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Transaction History Table */}
            <WalletTransactionsPanel
                transactions={summary.transactions}
                customers={customers}
                showCustomerColumn={false}
                title={`${customer.companyName} — Transaction History`}
                subtitle="Search or filter recharges, simulated message usage deductions, and billing credits"
                onSelectInvoice={(txn) => setStatementModal({ open: true, transaction: txn })}
            />

            {/* Simulated Payment Modal */}
            {isPaymentModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Simulated Wallet Payment"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
                        <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Simulated Payment Gateway</h3>
                                <p className="text-xs text-slate-400">Frontend demo checkout for {customer.companyName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPaymentModalOpen(false)}
                                aria-label="Close payment modal"
                                className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B] space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Recharge Amount</span>
                                    <span className="font-black text-lg text-white">{formatCurrency(parsedRecharge)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Payment Method</span>
                                    <span className="font-semibold text-slate-200">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Current Balance</span>
                                    <span className="font-semibold text-slate-200">{formatCurrency(customer.walletBalance)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                                    Simulation Outcome
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSimulateOutcome('success')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                                            simulateOutcome === 'success'
                                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Simulate Success
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSimulateOutcome('failure')}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                                            simulateOutcome === 'failure'
                                                ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Simulate Failure
                                    </button>
                                </div>
                            </div>

                            {paymentResult && (
                                <div
                                    role="status"
                                    className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                                        paymentResult.ok
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 font-bold">
                                        {paymentResult.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                                        <span>{paymentResult.title}</span>
                                    </div>
                                    <p className="opacity-90">{paymentResult.message}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="flex-1 min-h-[42px] py-2.5 rounded-xl bg-[#111318] border border-[#2D333B] text-xs font-bold text-slate-300 hover:text-white"
                                >
                                    {paymentResult?.ok ? 'Done' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isProcessingPayment}
                                    onClick={handleSimulatedPayment}
                                    className="flex-[2] min-h-[42px] py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Confirm Simulated Pay</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Statement & Invoice Preview Modal */}
            <BillingStatementModal
                isOpen={statementModal.open}
                onClose={() => setStatementModal({ open: false, transaction: null })}
                customer={customer}
                transaction={statementModal.transaction}
                summary={summary}
            />
        </div>
    );
};

export default CustomerWallet;
