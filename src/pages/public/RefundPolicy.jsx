import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, AlertTriangle, CreditCard, Wallet, ShieldCheck, ArrowLeft, Mail, Clock } from 'lucide-react';
import useAppStore from '../../store/useStore';

const RefundPolicy = () => {
    const { legalCompanyInfo } = useAppStore();
    const info = legalCompanyInfo || {};

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
                <Link to="/" className="hover:text-white transition flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Home
                </Link>
                <span>/</span>
                <span className="text-indigo-400">Refund Policy</span>
            </div>

            {/* Header */}
            <div className="border-b border-white/10 pb-8 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Billing & Financial Terms</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    Refund & Cancellation Policy
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
                    Clear guidelines governing customer software licenses, prepaid messaging wallet recharges, and payment dispute resolution.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span>Effective Date: <strong>{info.lastUpdated || 'November 27, 2026'}</strong></span>
                    <span>•</span>
                    <span>Version: <strong>1.8 (Draft)</strong></span>
                </div>
            </div>

            {/* DRAFT NOTICE BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                        Draft Policy Notice — Client Legal Confirmation Pending
                    </strong>
                    {info.draftNotice || 'This refund policy is a demonstration draft prepared for partner onboarding and platform auditing. Explicit client approval is required before commercial enforcement.'}
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-sm leading-relaxed">
                {/* 1. Software Subscriptions */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                        Software Subscription Licenses & Trial Period
                    </h2>
                    <p className="mb-3">
                        WhatsApp CRM SaaS licenses (including Super Admin, Customer Admin, and Counselor seat allocations) are billed on recurring monthly or annual billing terms.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>
                            <strong className="text-slate-200">14-Day Evaluation Guarantee:</strong> New customer accounts may cancel their primary software subscription within 14 calendar days of initial account creation for a 100% full refund of the base software seat fee.
                        </li>
                        <li>
                            <strong className="text-slate-200">Subsequent Renewals:</strong> Monthly renewal charges are non-refundable once the billing cycle begins. Customers can cancel anytime to prevent future renewal charges.
                        </li>
                    </ul>
                </section>

                {/* 2. Customer Prepaid Wallet & Messaging Deductions */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                        Prepaid Customer Wallet Balances
                    </h2>
                    <p className="mb-3">
                        WhatsApp messaging usage is deducted in real-time from the customer's prepaid balance according to category-wise message rates (Marketing, Utility, Authentication, Service):
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>
                            <strong className="text-slate-200">Consumed Message Credits:</strong> Credits consumed by successfully delivered WhatsApp conversations are non-refundable, as Meta and telecom infrastructure costs are immediately incurred upon message dispatch.
                        </li>
                        <li>
                            <strong className="text-slate-200">Unspent Wallet Funds:</strong> Customers in good standing who voluntarily terminate their platform account may request a refund for any unspent, unallocated wallet balance exceeding $25.00 (or local currency equivalent), subject to standard payment gateway processing fees (typically 2.5%).
                        </li>
                    </ul>
                </section>

                {/* 3. Failed Transactions & Disputed Recharges */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                        Disputed Transactions & Failed Recharges
                    </h2>
                    <p className="text-slate-400 mb-3">
                        If a customer wallet recharge encounters a gateway timeout, double charge, or banking failure where funds are debited from the customer's bank but not credited to the CRM wallet:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Our automated ledger reconciliation will automatically verify and credit the missing balance within 24 hours.</li>
                        <li>If the payment gateway issues a refund reversal, the corresponding balance will be safely adjusted in the customer transaction ledger.</li>
                    </ul>
                </section>

                {/* 4. Refund Request Procedure */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">4</span>
                        Refund Request Submission & Timelines
                    </h2>
                    <p className="text-slate-400 mb-4">
                        To initiate a refund request, customer account administrators must follow these steps:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-indigo-400 font-bold block mb-1">Step 1: Written Notice</span>
                            <p className="text-slate-400">Email billing@whatsappcrm.com with your Customer ID, transaction reference number, and reason for refund.</p>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-indigo-400 font-bold block mb-1">Step 2: Audit Review</span>
                            <p className="text-slate-400">Our finance team verifies transaction logs and message consumption ledgers within 48 business hours.</p>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-indigo-400 font-bold block mb-1">Step 3: Payout Execution</span>
                            <p className="text-slate-400">Approved refunds are credited back to the original payment source within 5 to 7 business banking days.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Contact & Support */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">5</span>
                        Billing Support & Contact
                    </h2>
                    <p className="text-slate-400 mb-4">
                        For any billing inquiries, invoice clarifications, or wallet balance audits:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#050812] border border-white/10 rounded-xl p-4">
                        <div>
                            <span className="text-slate-500 block mb-0.5">Billing Department</span>
                            <a href={`mailto:${info.billingEmail || 'billing@whatsappcrm.com'}`} className="text-indigo-400 font-semibold hover:underline">
                                {info.billingEmail || 'billing@whatsappcrm.com'}
                            </a>
                            <span className="text-slate-400 block text-[11px] mt-0.5">Phone: {info.phone}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-0.5">Turnaround Time</span>
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                24 to 48 business hours response
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicy;
