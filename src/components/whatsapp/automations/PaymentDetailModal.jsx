import React, { useState } from 'react';
import { 
    X, FileText, CheckCircle2, Clock, AlertTriangle, 
    Send, CreditCard, Copy, ExternalLink, Calendar, 
    DollarSign, Building2, User, Phone, Mail, ArrowUpRight 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';

const PaymentDetailModal = () => {
    const { 
        isPaymentDetailModalOpen, 
        closePaymentDetailModal, 
        selectedPaymentForDetail, 
        sendPaymentReminder,
        simulateFullPayment,
        openPaymentPartialModal
    } = useWhatsAppAutomationStore();

    const [copied, setCopied] = useState(false);
    const [actionFeedback, setActionFeedback] = useState(null);

    const payment = selectedPaymentForDetail;
    if (!isPaymentDetailModalOpen || !payment) return null;

    const isOverdue = payment.status === 'Overdue';
    const isPaid = payment.status === 'Paid';
    const isPartiallyPaid = payment.status === 'Partially Paid';

    const handleCopyLink = () => {
        if (payment.demoPaymentLink) {
            navigator.clipboard?.writeText(payment.demoPaymentLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSendReminder = () => {
        const res = sendPaymentReminder(payment.id, 'MANUAL_DISPATCH');
        if (res?.status === 'Skipped') {
            setActionFeedback({ type: 'warning', text: res.reason });
        } else {
            setActionFeedback({ type: 'success', text: `Automated WhatsApp payment reminder dispatched to ${payment.phone}!` });
        }
        setTimeout(() => setActionFeedback(null), 4000);
    };

    const handleSettleFull = () => {
        const res = simulateFullPayment(payment.id, 'Bank Transfer (Settlement)', 'Full invoice clearance');
        if (res.status === 'success') {
            setActionFeedback({ type: 'success', text: 'Invoice settled in full! Future automated reminders halted.' });
        } else {
            setActionFeedback({ type: 'error', text: res.message || 'Settlement failed.' });
        }
        setTimeout(() => setActionFeedback(null), 4000);
    };

    const handleOpenPartial = () => {
        closePaymentDetailModal();
        openPaymentPartialModal(payment);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
                
                {/* Header */}
                <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#1C1F26]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-white">
                                    Invoice #{payment.invoiceNumber}
                                </h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    isPaid 
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : isOverdue 
                                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                            : isPartiallyPaid
                                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                }`}>
                                    {payment.status}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#111318] text-slate-400 border border-[#2D333B]">
                                    {payment.source}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Issued: {new Date(payment.createdAt).toLocaleDateString()} • Due: {payment.dueDate}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closePaymentDetailModal}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#16181D]">
                    {actionFeedback && (
                        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            actionFeedback.type === 'success' 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                                : actionFeedback.type === 'warning'
                                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}>
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {actionFeedback.text}
                        </div>
                    )}

                    {/* Customer & Billing Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer Info Card */}
                        <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Client / Debtor Profile
                            </span>
                            <div className="space-y-1.5 pt-1">
                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    {payment.customerName}
                                </p>
                                <p className="text-xs text-slate-300 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                    {payment.phone}
                                </p>
                                {payment.email && (
                                    <p className="text-xs text-slate-400 flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        {payment.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Financial Ledger Snapshot Card */}
                        <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Financial Ledger Status
                            </span>
                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="bg-[#111318] p-2 rounded-lg border border-[#2D333B]">
                                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Total</span>
                                    <p className="text-xs font-bold text-white mt-0.5">₹{payment.totalAmount?.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-[#111318] p-2 rounded-lg border border-[#2D333B]">
                                    <span className="text-[9px] text-emerald-400 uppercase font-semibold">Paid</span>
                                    <p className="text-xs font-bold text-emerald-400 mt-0.5">₹{payment.paidAmount?.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-[#111318] p-2 rounded-lg border border-[#2D333B]">
                                    <span className="text-[9px] text-amber-400 uppercase font-semibold">Balance</span>
                                    <p className="text-xs font-bold text-amber-400 mt-0.5">₹{payment.outstandingAmount?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                                <span>Due Date: <strong className="text-white">{payment.dueDate}</strong></span>
                                {isOverdue && (
                                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Line Items */}
                    <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Invoice Line Items &amp; Scope
                        </span>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="text-[10px] uppercase text-slate-500 bg-[#111318] border-b border-[#2D333B]">
                                    <tr>
                                        <th className="py-2 px-3">Item / Description</th>
                                        <th className="py-2 px-2 text-center">Qty</th>
                                        <th className="py-2 px-3 text-right">Rate</th>
                                        <th className="py-2 px-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D333B] text-slate-300">
                                    {(payment.items || []).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-[#111318]/50">
                                            <td className="py-2.5 px-3 font-medium text-white">{item.description}</td>
                                            <td className="py-2.5 px-2 text-center text-slate-400">{item.qty}</td>
                                            <td className="py-2.5 px-3 text-right">₹{item.rate?.toLocaleString('en-IN')}</td>
                                            <td className="py-2.5 px-3 text-right font-semibold text-white">₹{item.amount?.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Demo Payment Link Copy */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Simulated Client Payment Link</span>
                            <p className="text-xs font-mono text-emerald-400 truncate mt-0.5">
                                {payment.demoPaymentLink || 'https://pay.crm.io/inv'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1F26] text-slate-300 border border-[#2D333B] hover:text-white flex items-center gap-1.5 shrink-0"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    {/* Dual History Trail: Payments & WhatsApp Reminders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Payment Transactions Log */}
                        <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Payment Receipts ({payment.paymentsHistory?.length || 0})
                            </span>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {payment.paymentsHistory && payment.paymentsHistory.length > 0 ? (
                                    payment.paymentsHistory.map(tx => (
                                        <div key={tx.id} className="p-2.5 bg-[#111318] rounded-lg border border-[#2D333B] text-xs">
                                            <div className="flex items-center justify-between font-semibold text-white">
                                                <span className="text-emerald-400">+₹{tx.amount?.toLocaleString('en-IN')}</span>
                                                <span className="text-[10px] text-slate-400">{tx.paymentMethod}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{tx.referenceNote}</p>
                                            <span className="text-[9px] text-slate-500">{new Date(tx.paidAt).toLocaleString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 py-3 text-center">No payment transactions recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp Automated Reminders Log */}
                        <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                WhatsApp Reminders Sent ({payment.remindersSent?.length || 0})
                            </span>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {payment.remindersSent && payment.remindersSent.length > 0 ? (
                                    payment.remindersSent.map(rem => (
                                        <div key={rem.id} className="p-2.5 bg-[#111318] rounded-lg border border-[#2D333B] text-xs">
                                            <div className="flex items-center justify-between font-semibold text-white">
                                                <span className="text-blue-400">{rem.type}</span>
                                                <span className="text-[10px] text-emerald-400">{rem.status}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Snapshot balance: ₹{rem.amountSnap?.toLocaleString('en-IN')}</p>
                                            <span className="text-[9px] text-slate-500">{new Date(rem.sentAt).toLocaleString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 py-3 text-center">No reminders dispatched yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[#2D333B] bg-[#1C1F26] flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-400">
                        {isPaid 
                            ? 'Invoice settled in full. All future reminders are halted.'
                            : `Outstanding balance: ₹${payment.outstandingAmount?.toLocaleString('en-IN')}`}
                    </span>
                    
                    <div className="flex items-center gap-2">
                        {!isPaid && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleSendReminder}
                                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Send Reminder Now
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenPartial}
                                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors flex items-center gap-1.5"
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Partial Pay
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSettleFull}
                                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Settle in Full
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={closePaymentDetailModal}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#111318] border border-[#2D333B] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentDetailModal;
