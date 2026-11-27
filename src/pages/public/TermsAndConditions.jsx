import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Scale, ShieldAlert, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import useAppStore from '../../store/useStore';

const TermsAndConditions = () => {
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
                <span className="text-indigo-400">Terms & Conditions</span>
            </div>

            {/* Header */}
            <div className="border-b border-white/10 pb-8 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <Scale className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Master Service Agreement</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    Terms and Conditions of Service
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
                    These Terms of Service govern your organization’s access to and usage of the WhatsApp CRM SaaS platform, integrations, and automated messaging infrastructure.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span>Effective Date: <strong>{info.lastUpdated || 'November 27, 2026'}</strong></span>
                    <span>•</span>
                    <span>Version: <strong>3.1 (Draft)</strong></span>
                </div>
            </div>

            {/* DRAFT NOTICE BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                        Draft Legal Notice — Client Approval Required
                    </strong>
                    {info.draftNotice || 'These terms of service are draft terms prepared for partner technical onboarding and platform demonstration. Formal client and legal counsel validation is required before production commercial enforcement.'}
                </div>
            </div>

            {/* Clauses */}
            <div className="space-y-8 text-sm leading-relaxed">
                {/* 1. Acceptance of Terms */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                        Acceptance of Terms & Eligibility
                    </h2>
                    <p className="mb-3">
                        By registering an account, accessing the CRM dashboard, connecting a WhatsApp Business Account (WABA), or consuming platform APIs, customer organizations agree to be bound by these Terms and Conditions.
                    </p>
                    <p className="text-slate-400">
                        If you represent a business entity or educational agency, you affirm that you have full legal authority to bind that entity to this master service agreement.
                    </p>
                </section>

                {/* 2. User Roles & Workspace Responsibilities */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                        Role-Based Access & Workspace Responsibilities
                    </h2>
                    <p className="mb-3">
                        The platform enforces granular Role-Based Access Control (RBAC):
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>
                            <strong className="text-slate-200">Super Admin:</strong> Manages global system tenants, customer wallet balances, software pricing tiers, and platform-wide security settings.
                        </li>
                        <li>
                            <strong className="text-slate-200">Customer Admin:</strong> Responsible for tenant team members, counselor lead assignments, prepaid recharge funding, and compliance with messaging regulations within their workspace.
                        </li>
                        <li>
                            <strong className="text-slate-200">Counselors & Agents:</strong> Must maintain confidentiality of assigned student lead files and communicate respectfully through authorized channels.
                        </li>
                    </ul>
                </section>

                {/* 3. WhatsApp Messaging Policy & Anti-Spam Compliance */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                        WhatsApp Business Policy & Strict Anti-Spam Terms
                    </h2>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-4 text-xs text-rose-200">
                        <strong className="text-rose-300 block mb-1">Zero Tolerance Anti-Spam Policy:</strong>
                        Sending unsolicited messages, purchasing scraped phone lists, or broadcasting non-consented bulk promotions via WhatsApp is strictly prohibited. Violations will result in immediate tenant account termination without refund.
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Customers must obtain verifiable prior opt-in consent before dispatching template messages.</li>
                        <li>Message templates must be submitted to and approved by Meta prior to broadcast.</li>
                        <li>Customers must promptly honor user opt-out requests (e.g., STOP or UNSUBSCRIBE).</li>
                    </ul>
                </section>

                {/* 4. White-Label Branding & Intellectual Property */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">4</span>
                        Intellectual Property & White-Label Rights
                    </h2>
                    <p className="text-slate-400 mb-3">
                        {info.companyName} retains all proprietary rights, copyright, and source code ownership in the underlying WhatsApp CRM architecture. 
                    </p>
                    <p className="text-slate-400">
                        Customer tenants subscribing to Enterprise White-Label tiers receive a non-exclusive license to apply custom brand names, logos, color tokens, and domain mapping, provided underlying system copyright notices are respected.
                    </p>
                </section>

                {/* 5. Service Availability & SLA */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">5</span>
                        Service Availability & Uptime Commitments
                    </h2>
                    <p className="text-slate-400 mb-3">
                        We target a 99.9% service uptime for our CRM application and Cloud API webhook listeners, excluding scheduled maintenance windows announced with 48 hours prior notice.
                    </p>
                    <p className="text-slate-400">
                        We are not liable for upstream telecom carrier outages, Meta Business Platform global API downtime, or local ISP interruptions outside our direct control.
                    </p>
                </section>

                {/* 6. Limitation of Liability */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">6</span>
                        Limitation of Liability
                    </h2>
                    <p className="text-slate-400">
                        In no event shall {info.companyName}, its directors, or affiliates be liable for indirect, incidental, or consequential damages, lost profits, or business interruption arising out of the use or inability to use the CRM services. Total aggregate liability is limited to the fees paid by the customer in the preceding three (3) months.
                    </p>
                </section>

                {/* 7. Legal Contact */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">7</span>
                        Legal Department Contact
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#050812] border border-white/10 rounded-xl p-4">
                        <div>
                            <span className="text-slate-500 block mb-0.5">Legal & Compliance</span>
                            <a href={`mailto:${info.legalEmail || 'legal@whatsappcrm.com'}`} className="text-indigo-400 font-semibold hover:underline">
                                {info.legalEmail || 'legal@whatsappcrm.com'}
                            </a>
                            <span className="text-slate-400 block text-[11px] mt-0.5">Corporate Phone: {info.phone}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-0.5">Jurisdiction</span>
                            <span className="text-white font-medium block">Mumbai, Maharashtra, India</span>
                            <span className="text-slate-400 text-[11px]">Subject to Indian Commercial Law & Courts</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditions;
