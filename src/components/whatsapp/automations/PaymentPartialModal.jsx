import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';

const PaymentPartialModal = () => {
    const { 
        isPaymentPartialModalOpen, 
        closePaymentPartialModal, 
        selectedPaymentForAction, 
        simulatePartialPayment 
    } = useWhatsAppAutomationStore();

    const payment = selectedPaymentForAction;

    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
    const [referenceNote, setReferenceNote] = useState('');
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(null);

    if (!isPaymentPartialModalOpen || !payment) return null;

    const outstanding = payment.outstandingAmount || 0;
    const numAmount = parseFloat(amount) || 0;
    const newOutstanding = Math.max(0, outstanding - numAmount);
    const willSettleInFull = numAmount >= outstanding;

    const handleSetPercentage = (pct) => {
        const calculated = Math.round((outstanding * pct) / 100);
        setAmount(calculated.toString());
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (numAmount <= 0) {
            setError('Please enter a valid payment amount greater than 0.');
            return;
        }

        if (numAmount > outstanding) {
            setError(`Entered amount (₹${numAmount.toLocaleString('en-IN')}) exceeds current outstanding balance (₹${outstanding.toLocaleString('en-IN')}).`);
            return;
        }

        const res = simulatePartialPayment(payment.id, numAmount, paymentMethod, referenceNote);
        if (res.status === 'success') {
            setFeedback({
                message: willSettleInFull 
                    ? `Payment of ₹${numAmount.toLocaleString('en-IN')} received. Invoice is now fully settled and all future reminders are halted!`
                    : `Partial payment of ₹${numAmount.toLocaleString('en-IN')} recorded. New balance: ₹${newOutstanding.toLocaleString('en-IN')}.`
            });
            setTimeout(() => {
                setFeedback(null);
                setAmount('');
                setReferenceNote('');
            }, 1500);
        } else {
            setError(res.message || 'Payment simulation failed.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
                
                {/* Header */}
                <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#1C1F26]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                Record Partial Payment
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    Simulate
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Invoice #{payment.invoiceNumber} • {payment.customerName}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closePaymentPartialModal}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#16181D]">
                    {feedback && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {feedback.message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Balance Snapshot Card */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] grid grid-cols-3 gap-3 text-center">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Bill</span>
                            <p className="text-sm font-bold text-white mt-0.5">
                                ₹{payment.totalAmount?.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] text-emerald-500 uppercase font-bold">Already Paid</span>
                            <p className="text-sm font-bold text-emerald-400 mt-0.5">
                                ₹{payment.paidAmount?.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] text-amber-500 uppercase font-bold">Outstanding</span>
                            <p className="text-sm font-bold text-amber-400 mt-0.5">
                                ₹{outstanding.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    {/* Amount Input & Quick Chips */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                            <span>Payment Amount (₹)</span>
                            <span className="text-[11px] text-slate-500">Max: ₹{outstanding.toLocaleString('en-IN')}</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <input
                                type="number"
                                step="100"
                                min="1"
                                max={outstanding}
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter partial payment amount"
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold"
                            />
                        </div>

                        {/* Quick Percentages */}
                        <div className="flex items-center gap-2 pt-1">
                            {[
                                { label: '25%', val: 25 },
                                { label: '50%', val: 50 },
                                { label: '75%', val: 75 },
                                { label: '100% (Full)', val: 100 }
                            ].map(chip => (
                                <button
                                    key={chip.val}
                                    type="button"
                                    onClick={() => handleSetPercentage(chip.val)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1C1F26] text-slate-300 border border-[#2D333B] hover:text-white hover:border-amber-500/50 transition-colors"
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Payment Channel / Instrument</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                            <option value="UPI / GPay">UPI (Google Pay / PhonePe / Paytm)</option>
                            <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT / RTGS / IMPS)</option>
                            <option value="Credit / Debit Card">Credit / Debit Card (Razorpay Gateway)</option>
                            <option value="Cheque Clearance">Bank Cheque Clearance</option>
                            <option value="Cash Deposit">Direct Cash Deposit</option>
                        </select>
                    </div>

                    {/* Reference / Note */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Transaction Reference / Internal Note</label>
                        <input
                            type="text"
                            value={referenceNote}
                            onChange={(e) => setReferenceNote(e.target.value)}
                            placeholder="e.g. UPI Ref #4099120 or Advance Token Part-2"
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Dynamic Balance Impact Preview */}
                    {numAmount > 0 && (
                        <div className="p-3.5 bg-[#1C1F26] rounded-xl border border-[#2D333B] flex items-center justify-between text-xs">
                            <span className="text-slate-400">Revised Outstanding:</span>
                            <div className="flex items-center gap-2">
                                <span className="line-through text-slate-500">₹{outstanding.toLocaleString('en-IN')}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                                <span className={`font-bold ${willSettleInFull ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    ₹{newOutstanding.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    )}

                    {willSettleInFull && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            This payment settles the invoice in full. All future automated WhatsApp reminders will halt automatically.
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={closePaymentPartialModal}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#111318] border border-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-lg shadow-amber-600/20"
                        >
                            Confirm Payment (₹{numAmount > 0 ? numAmount.toLocaleString('en-IN') : '0'})
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default PaymentPartialModal;
