import React from 'react';
import { X, FileText, Building2, CheckCircle2, Printer, Download } from 'lucide-react';
import { formatCurrency, formatUnitPrice } from '../../lib/walletUtils';
import { mockWalletConfig } from '../../mock/mockData';
import { toast } from '../ui/Toast';

const BillingStatementModal = ({
    isOpen,
    onClose,
    customer,
    transaction = null,
    summary = null,
}) => {
    if (!isOpen || !customer) return null;

    const isSingleInvoice = Boolean(transaction);
    const statementNo = transaction?.invoiceNumber || `STMT-${customer.workspaceCode || customer.id}-202611`;
    const statementDate = transaction?.date || new Date().toISOString().split('T')[0];

    const handleDownloadPreview = () => {
        toast.success(`Demo statement ${statementNo} prepared for preview.`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Billing Statement and Invoice Preview"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-white">
                {/* Modal Top Bar */}
                <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between gap-3 sticky top-0 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white truncate">
                                {isSingleInvoice ? `Invoice ${statementNo}` : `Billing Statement — ${customer.companyName}`}
                            </h3>
                            <p className="text-xs text-slate-400">
                                Frontend dummy preview • Date: {statementDate}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close statement preview"
                        className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    {/* Header Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Billed To</p>
                            <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Building2 size={14} className="text-[#8B5CF6]" />
                                {customer.companyName}
                            </p>
                            <p className="text-xs text-slate-400">
                                {customer.contactPerson} • {customer.email || customer.adminEmail}
                            </p>
                            <p className="text-xs text-slate-400">
                                Workspace: {customer.workspaceCode} • {customer.country}
                            </p>
                        </div>
                        <div className="space-y-1 sm:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Reference</p>
                            <p className="text-sm font-mono font-bold text-white">{statementNo}</p>
                            <p className="text-xs text-slate-400">
                                Plan: {customer.assignedSoftware} ({customer.planTier})
                            </p>
                            <div className="pt-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 size={11} />
                                    {transaction?.status || 'Generated (Demo)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    {isSingleInvoice ? (
                        <div className="rounded-2xl border border-[#2D333B] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#111318]">
                                    <tr>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Description</th>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Method</th>
                                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-[#16181D]">
                                        <td className="py-4 px-4">
                                            <p className="text-sm font-bold text-white">{transaction.type} ({transaction.id})</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{transaction.note}</p>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-slate-300">{transaction.paymentMethod}</td>
                                        <td className="py-4 px-4 text-sm font-black text-emerald-400 text-right">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-[#111318] border-t border-[#2D333B] flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Resulting Wallet Balance
                                </span>
                                <span className="text-lg font-black text-white">
                                    {formatCurrency(transaction.balanceAfter)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available</p>
                                    <p className="text-base font-black text-white mt-1">{formatCurrency(customer.walletBalance)}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recharged</p>
                                    <p className="text-base font-black text-emerald-400 mt-1">+{formatCurrency(summary?.totalRecharged || 0)}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deductions</p>
                                    <p className="text-base font-black text-amber-400 mt-1">-{formatCurrency(summary?.totalDeductions || 0)}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subscription</p>
                                    <p className="text-base font-black text-indigo-300 mt-1">
                                        {formatCurrency(customer.reselling?.monthlyPrice || 0)}/mo
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#2D333B] overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[480px]">
                                    <thead className="bg-[#111318]">
                                        <tr>
                                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Message Category</th>
                                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Quantity</th>
                                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Unit Price</th>
                                            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Total Deducted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(summary?.categoryBreakdown || []).map((row) => (
                                            <tr key={row.category} className="border-b border-[#2D333B]/60 bg-[#16181D]">
                                                <td className="py-3 px-4 text-xs font-bold text-white">{row.category}</td>
                                                <td className="py-3 px-4 text-xs text-slate-300 text-right">{row.quantity.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-xs font-mono text-slate-300 text-right">{formatUnitPrice(row.unitPrice)}</td>
                                                <td className="py-3 px-4 text-xs font-bold text-white text-right">{formatCurrency(row.totalCost)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="text-[11px] text-slate-400 bg-[#111318] border border-[#2D333B] rounded-xl px-4 py-3">
                        {mockWalletConfig.pricingDisclaimer} No real tax invoice or payment settlement is executed in this demo.
                    </p>

                    {/* Footer Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] text-xs font-bold text-slate-200 transition-colors"
                        >
                            <Printer size={15} />
                            <span>Print Preview</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadPreview}
                            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-colors"
                        >
                            <Download size={15} />
                            <span>Save Statement Preview</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingStatementModal;
