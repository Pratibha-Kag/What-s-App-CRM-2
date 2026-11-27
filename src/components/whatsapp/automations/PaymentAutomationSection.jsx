import React, { useState, useMemo } from 'react';
import { 
    DollarSign, Search, Filter, RefreshCw, Sliders, 
    Send, CreditCard, CheckCircle2, AlertTriangle, Clock, 
    Eye, Database, ArrowUpRight, RotateCcw, ChevronLeft, 
    ChevronRight, Calendar, Sparkles, Check, CheckCircle, FileText,
    BookOpen, FileSpreadsheet
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import PaymentReminderConfigModal from './PaymentReminderConfigModal';
import PaymentPartialModal from './PaymentPartialModal';
import PaymentDetailModal from './PaymentDetailModal';

const PaymentAutomationSection = () => {
    const {
        payments,
        paymentSources,
        paymentRules,
        paymentSearchQuery,
        paymentStatusFilter,
        paymentDateFilter,
        paymentSourceFilter,
        paymentPage,
        paymentPageSize,
        setPaymentSearchQuery,
        setPaymentStatusFilter,
        setPaymentDateFilter,
        setPaymentSourceFilter,
        setPaymentPage,
        openPaymentReminderConfigModal,
        openPaymentPartialModal,
        openPaymentDetailModal,
        simulatePaymentDataSync,
        simulateFullPayment,
        sendPaymentReminder,
        getPaymentStats,
        resetPaymentDemoData
    } = useWhatsAppAutomationStore();

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncFeedback, setSyncFeedback] = useState(null);
    const [actionFeedback, setActionFeedback] = useState(null);

    const stats = getPaymentStats();

    // Calculate days difference relative to today (2026-11-27)
    const getDueDateBadge = (dueDate, status) => {
        if (status === 'Paid') {
            return (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Settled
                </span>
            );
        }

        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    +{Math.abs(diffDays)}d overdue
                </span>
            );
        } else if (diffDays === 0) {
            return (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Due Today
                </span>
            );
        } else if (diffDays === 1) {
            return (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Due Tomorrow
                </span>
            );
        } else {
            return (
                <span className="text-[11px] text-slate-400">
                    In {diffDays} days
                </span>
            );
        }
    };

    // Filter payments
    const filteredPayments = useMemo(() => {
        return (payments || []).filter(p => {
            // Search query
            if (paymentSearchQuery.trim()) {
                const q = paymentSearchQuery.toLowerCase();
                const matchName = (p.customerName || '').toLowerCase().includes(q);
                const matchPhone = (p.phone || '').includes(q);
                const matchInv = (p.invoiceNumber || '').toLowerCase().includes(q);
                if (!matchName && !matchPhone && !matchInv) return false;
            }

            // Status filter
            if (paymentStatusFilter !== 'all') {
                if (p.status !== paymentStatusFilter) return false;
            }

            // Source filter
            if (paymentSourceFilter !== 'all') {
                if (p.sourceId !== paymentSourceFilter && p.source !== paymentSourceFilter) return false;
            }

            // Date filter
            if (paymentDateFilter !== 'all') {
                const todayStr = new Date().toISOString().split('T')[0];
                if (paymentDateFilter === 'today' && p.dueDate !== todayStr) return false;
                if (paymentDateFilter === 'overdue' && (p.status !== 'Overdue' || p.dueDate >= todayStr)) return false;
                if (paymentDateFilter === 'upcoming' && p.dueDate <= todayStr) return false;
                if (paymentDateFilter === 'paid' && p.status !== 'Paid') return false;
            }

            return true;
        });
    }, [payments, paymentSearchQuery, paymentStatusFilter, paymentDateFilter, paymentSourceFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / paymentPageSize) || 1;
    const paginatedPayments = filteredPayments.slice(
        (paymentPage - 1) * paymentPageSize,
        paymentPage * paymentPageSize
    );

    // Handlers
    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            const res = simulatePaymentDataSync();
            setIsSyncing(false);
            setSyncFeedback(`Successfully synchronized ${res.syncedCount} new outstanding invoice(s) from external accounting gateways!`);
            setTimeout(() => setSyncFeedback(null), 4000);
        }, 800);
    };

    const handleSendReminderRow = (payment) => {
        const res = sendPaymentReminder(payment.id, 'MANUAL_DISPATCH');
        if (res?.status === 'Skipped') {
            setActionFeedback({ type: 'warning', text: res.reason });
        } else {
            setActionFeedback({ type: 'success', text: `Automated WhatsApp payment reminder dispatched for ${payment.invoiceNumber}!` });
        }
        setTimeout(() => setActionFeedback(null), 4000);
    };

    const handleFullSettleRow = (payment) => {
        const res = simulateFullPayment(payment.id, 'Bank Transfer (Settlement)', 'Full invoice clearance');
        if (res.status === 'success') {
            setActionFeedback({ type: 'success', text: `Invoice #${payment.invoiceNumber} fully settled! Future automated reminders halted.` });
        } else {
            setActionFeedback({ type: 'error', text: res.message || 'Settlement failed.' });
        }
        setTimeout(() => setActionFeedback(null), 4000);
    };

    const handleReset = () => {
        if (window.confirm('Reset payment reminder data and connected sources to defaults?')) {
            resetPaymentDemoData();
            setActionFeedback({ type: 'success', text: 'Payment reminder demo data reset to initial clean state.' });
            setTimeout(() => setActionFeedback(null), 3000);
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Top Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16181D] p-5 rounded-2xl border border-[#2D333B]">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Payment Reminder Automation
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Collections &amp; Recovery
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Automate WhatsApp fee collections, pre-due alerts, and recurring overdue escalations synchronized with your billing software.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        type="button"
                        onClick={openPaymentReminderConfigModal}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        Configure Reminder Rules
                    </button>

                    <button
                        type="button"
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#1C1F26] border border-[#2D333B] hover:border-emerald-500/40 transition-all flex items-center gap-1.5"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Simulate Data Sync'}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        title="Reset Demo Data"
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#1C1F26] border border-[#2D333B] transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Notification & Sync Feedback Banners */}
            {syncFeedback && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{syncFeedback}</span>
                </div>
            )}

            {actionFeedback && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
                    actionFeedback.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : actionFeedback.type === 'warning'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{actionFeedback.text}</span>
                </div>
            )}

            {/* 7 KPI Dynamic Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Total Outstanding
                    </span>
                    <p className="text-xl font-black text-amber-400 mt-1">
                        ₹{stats.totalOutstanding?.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-slate-500">Unsettled receivables</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-blue-400 uppercase font-semibold">Pending</span>
                    <p className="text-xl font-bold text-blue-400 mt-1">{stats.pendingCount}</p>
                    <span className="text-[10px] text-slate-500">Awaiting payment</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Overdue
                    </span>
                    <p className="text-xl font-bold text-rose-400 mt-1">{stats.overdueCount}</p>
                    <span className="text-[10px] text-slate-500">Past due date</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid Invoices
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{stats.paidCount}</p>
                    <span className="text-[10px] text-slate-500">Reminders halted</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold flex items-center gap-1">
                        <Sliders className="w-3 h-3" /> Active Rules
                    </span>
                    <p className="text-xl font-bold text-purple-400 mt-1">{stats.activeRules} / 4</p>
                    <span className="text-[10px] text-slate-500">Auto trigger rules</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold flex items-center gap-1">
                        <Send className="w-3 h-3" /> Reminders Sent
                    </span>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{stats.remindersSent}</p>
                    <span className="text-[10px] text-slate-500">Dispatched logs</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-indigo-400 uppercase font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Upcoming
                    </span>
                    <p className="text-xl font-bold text-indigo-400 mt-1">{stats.upcomingReminders}</p>
                    <span className="text-[10px] text-slate-500">Scheduled queues</span>
                </div>
            </div>

            {/* Connected Software Payment Data Cards */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-slate-500" />
                        Connected Billing &amp; ERP Platforms
                    </span>
                    <span className="text-[11px] text-slate-500">Isolated simulated external data interface</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(paymentSources || []).map(source => (
                        <div 
                            key={source.id}
                            className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B] flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-[#111318] border border-[#2D333B] text-slate-300">
                                        {source.id === 'quickbooks' && <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                                        {source.id === 'zoho' && <BookOpen className="w-4 h-4 text-rose-400" />}
                                        {source.id === 'tally' && <Database className="w-4 h-4 text-amber-400" />}
                                        {source.id === 'razorpay' && <CreditCard className="w-4 h-4 text-blue-400" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{source.name}</p>
                                        <span className="text-[10px] text-slate-400 block truncate">{source.type}</span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                                    Connected
                                </span>
                            </div>

                            <div className="pt-2 border-t border-[#2D333B]/60 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Records: <strong className="text-white">{source.recordsCount}</strong></span>
                                <span>Synced: {new Date(source.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoices List Table Section */}
            <div className="space-y-4">
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={paymentSearchQuery}
                            onChange={(e) => setPaymentSearchQuery(e.target.value)}
                            placeholder="Search by invoice #, customer name, or phone..."
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Filters Strip */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Filter Pills */}
                        <div className="flex items-center bg-[#111318] p-1 rounded-xl border border-[#2D333B] overflow-x-auto">
                            {[
                                { key: 'all', label: 'All Statuses' },
                                { key: 'Overdue', label: 'Overdue' },
                                { key: 'Partially Paid', label: 'Partially Paid' },
                                { key: 'Pending', label: 'Pending' },
                                { key: 'Paid', label: 'Paid' }
                            ].map(pill => (
                                <button
                                    key={pill.key}
                                    type="button"
                                    onClick={() => setPaymentStatusFilter(pill.key)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                                        paymentStatusFilter === pill.key
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>

                        {/* Date Filter */}
                        <select
                            value={paymentDateFilter}
                            onChange={(e) => setPaymentDateFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="all">All Due Dates</option>
                            <option value="today">Due Today</option>
                            <option value="overdue">Overdue Only</option>
                            <option value="upcoming">Upcoming Due</option>
                            <option value="paid">Fully Settled</option>
                        </select>

                        {/* Source Filter */}
                        <select
                            value={paymentSourceFilter}
                            onChange={(e) => setPaymentSourceFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                            <option value="all">All Sources</option>
                            <option value="quickbooks">QuickBooks Online</option>
                            <option value="zoho">Zoho Books</option>
                            <option value="tally">Tally Prime ERP</option>
                            <option value="razorpay">Razorpay Invoices</option>
                        </select>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#16181D] rounded-2xl border border-[#2D333B] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-[10px] uppercase text-slate-400 border-b border-[#2D333B] tracking-wider font-bold">
                                <tr>
                                    <th className="py-3 px-4">Invoice #</th>
                                    <th className="py-3 px-4">Customer</th>
                                    <th className="py-3 px-3 text-right">Total Bill</th>
                                    <th className="py-3 px-3 text-right">Paid</th>
                                    <th className="py-3 px-3 text-right">Outstanding</th>
                                    <th className="py-3 px-4">Due Date</th>
                                    <th className="py-3 px-3">Gateway Source</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">Reminder State</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B] text-slate-300">
                                {paginatedPayments.length > 0 ? (
                                    paginatedPayments.map(p => {
                                        const isPaid = p.status === 'Paid';
                                        const isOverdue = p.status === 'Overdue';
                                        const isPartiallyPaid = p.status === 'Partially Paid';

                                        return (
                                            <tr key={p.id} className="hover:bg-[#1C1F26]/60 transition-colors">
                                                {/* Invoice ID */}
                                                <td className="py-3 px-4 font-mono font-semibold text-white">
                                                    {p.invoiceNumber}
                                                </td>

                                                {/* Customer */}
                                                <td className="py-3 px-4">
                                                    <p className="font-semibold text-white">{p.customerName}</p>
                                                    <span className="text-[11px] text-slate-400">{p.phone}</span>
                                                </td>

                                                {/* Total Bill */}
                                                <td className="py-3 px-3 text-right font-medium text-slate-300">
                                                    ₹{p.totalAmount?.toLocaleString('en-IN')}
                                                </td>

                                                {/* Paid */}
                                                <td className="py-3 px-3 text-right font-medium text-emerald-400">
                                                    ₹{p.paidAmount?.toLocaleString('en-IN')}
                                                </td>

                                                {/* Outstanding */}
                                                <td className="py-3 px-3 text-right font-bold text-amber-400">
                                                    ₹{p.outstandingAmount?.toLocaleString('en-IN')}
                                                </td>

                                                {/* Due Date */}
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <span className="text-white block font-medium">{p.dueDate}</span>
                                                        <div className="mt-0.5">
                                                            {getDueDateBadge(p.dueDate, p.status)}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Gateway Source */}
                                                <td className="py-3 px-3">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#111318] text-slate-300 border border-[#2D333B]">
                                                        {p.source}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        isPaid 
                                                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                            : isOverdue 
                                                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                                                : isPartiallyPaid 
                                                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                                    : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                {/* Reminder State */}
                                                <td className="py-3 px-3">
                                                    <span className="text-[11px] text-slate-400">
                                                        {p.reminderStatus || 'Not Scheduled'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* View Details */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openPaymentDetailModal(p)}
                                                            title="View Invoice & Reminders"
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* Send Reminder (disabled if Paid) */}
                                                        {!isPaid && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSendReminderRow(p)}
                                                                    title="Send WhatsApp Reminder Now"
                                                                    className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openPaymentPartialModal(p)}
                                                                    title="Record Partial Payment"
                                                                    className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                                                                >
                                                                    <CreditCard className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleFullSettleRow(p)}
                                                                    title="Settle in Full"
                                                                    className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <DollarSign className="w-8 h-8 text-slate-600" />
                                                <p className="text-sm font-semibold text-slate-400">No payment records found</p>
                                                <p className="text-xs text-slate-500">Try adjusting your search criteria or filters.</p>
                                                {(paymentSearchQuery || paymentStatusFilter !== 'all' || paymentDateFilter !== 'all' || paymentSourceFilter !== 'all') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPaymentSearchQuery('');
                                                            setPaymentStatusFilter('all');
                                                            setPaymentDateFilter('all');
                                                            setPaymentSourceFilter('all');
                                                        }}
                                                        className="mt-2 text-xs text-emerald-400 hover:underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {filteredPayments.length > 0 && (
                        <div className="p-4 border-t border-[#2D333B] flex items-center justify-between text-xs text-slate-400">
                            <span>
                                Showing {((paymentPage - 1) * paymentPageSize) + 1} to {Math.min(filteredPayments.length, paymentPage * paymentPageSize)} of {filteredPayments.length} invoices
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPaymentPage(Math.max(1, paymentPage - 1))}
                                    disabled={paymentPage === 1}
                                    className={`p-1.5 rounded-lg border border-[#2D333B] ${
                                        paymentPage === 1 ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26] hover:text-white'
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-white font-semibold px-2">Page {paymentPage} of {totalPages}</span>
                                <button
                                    type="button"
                                    onClick={() => setPaymentPage(Math.min(totalPages, paymentPage + 1))}
                                    disabled={paymentPage === totalPages}
                                    className={`p-1.5 rounded-lg border border-[#2D333B] ${
                                        paymentPage === totalPages ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26] hover:text-white'
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Mount Child Modals */}
            <PaymentReminderConfigModal />
            <PaymentPartialModal />
            <PaymentDetailModal />

        </div>
    );
};

export default PaymentAutomationSection;
