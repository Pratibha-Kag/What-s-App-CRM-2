import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Lock, Eye, FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import useAppStore from '../../store/useStore';

const PrivacyPolicy = () => {
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
                <span className="text-indigo-400">Privacy Policy</span>
            </div>

            {/* Header */}
            <div className="border-b border-white/10 pb-8 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Data Protection & Privacy Standards</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    Privacy Policy
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
                    This Privacy Policy outlines how {info.companyName || 'WhatsApp CRM Technologies Private Limited'} collects, processes, stores, and protects customer, lead, and student information.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span>Effective Date: <strong>{info.lastUpdated || 'November 27, 2026'}</strong></span>
                    <span>•</span>
                    <span>Version: <strong>2.4 (Draft)</strong></span>
                </div>
            </div>

            {/* DRAFT NOTICE BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                        Draft Content — Client Approval Required
                    </strong>
                    {info.draftNotice || 'This document is a demonstration draft prepared for platform testing and Meta Tech Partner compliance review. It requires formal legal review and explicit client sign-off before production commercial deployment.'}
                </div>
            </div>

            {/* Policy Sections */}
            <div className="space-y-8 text-sm leading-relaxed">
                {/* 1. Introduction & Scope */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                        Introduction & Scope
                    </h2>
                    <p className="mb-3">
                        {info.companyName || 'WhatsApp CRM Technologies Private Limited'} ("Company", "we", "us", or "our") operates the WhatsApp CRM multi-tenant software application and associated website platforms located at {info.officialWebsite || 'https://whatsappcrm.kiaansoftwaredemo.shop'}.
                    </p>
                    <p>
                        This policy governs privacy practices for software users, tenant organizations (Customer Admins, Counselors, Support Agents), website visitors, and prospective students/leads whose contact details are managed through the CRM software.
                    </p>
                </section>

                {/* 2. Information We Collect */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                        Information We Collect
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <strong className="text-white block mb-1">A. Tenant & Account Information</strong>
                            <p className="text-slate-400">
                                When a customer organization subscribes, we collect corporate business names, workspace identifiers, authorized administrator names, official email addresses, billing addresses, and payment transaction metadata.
                            </p>
                        </div>
                        <div>
                            <strong className="text-white block mb-1">B. Lead & Contact Data</strong>
                            <p className="text-slate-400">
                                Our CRM processes prospective leads uploaded by tenant administrators or received via authorized integrations (Meta Ads, Google Business, Website Forms). Data elements include full name, telephone number, email, target educational country, academic qualification, and consultation notes.
                            </p>
                        </div>
                        <div>
                            <strong className="text-white block mb-1">C. Technical & Diagnostic Logs</strong>
                            <p className="text-slate-400">
                                IP addresses, browser agent metadata, timestamped session tokens, and API latency telemetry required for system security, role-based auditing, and fraud prevention.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. WhatsApp Business API & Meta Data Handling */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                        WhatsApp Business API & Meta Data Compliance
                    </h2>
                    <p className="mb-3">
                        As a Technology Provider operating on the Meta Business Platform, we strictly adhere to the <strong>WhatsApp Business Solution Terms</strong> and <strong>Meta Platform Terms</strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>
                            <strong className="text-slate-200">Opt-In Consent:</strong> Customer organizations must ensure that all messaging recipients have provided explicit opt-in consent prior to receiving marketing, utility, or authentication messages.
                        </li>
                        <li>
                            <strong className="text-slate-200">No Selling or Scraping of Meta Data:</strong> We never sell, rent, monetize, or transfer WhatsApp conversational message contents or user telephone numbers to third-party ad networks or data brokers.
                        </li>
                        <li>
                            <strong className="text-slate-200">Encrypted Transmission:</strong> All messages dispatched through the WhatsApp Cloud API are transmitted across HTTPS/TLS 1.3 channels conforming to Meta security standards.
                        </li>
                    </ul>
                </section>

                {/* 4. Purpose of Processing */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">4</span>
                        How We Use Your Information
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>To provide, operate, and maintain the multi-tenant WhatsApp CRM platform.</li>
                        <li>To process admissions leads, schedule student counseling calls, and route automated WhatsApp template notifications.</li>
                        <li>To manage prepaid customer wallets, calculate message unit deductions, and generate accurate billing invoices.</li>
                        <li>To monitor platform health, detect unauthorized logins, and enforce tenant workspace isolation.</li>
                    </ul>
                </section>

                {/* 5. Data Security & Storage */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">5</span>
                        Data Security & Storage
                    </h2>
                    <p className="text-slate-400 mb-3">
                        We implement industry-standard technical and organizational security measures, including AES-256 database encryption at rest, secure role-based access control (RBAC), automatic session expiration, and isolated tenant databases preventing cross-workspace data access.
                    </p>
                    <p className="text-slate-400">
                        All application servers and cloud databases are hosted in ISO 27001-certified data centers with 24/7 automated vulnerability monitoring.
                    </p>
                </section>

                {/* 6. User Rights & Data Subject Access */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">6</span>
                        Your Privacy Rights
                    </h2>
                    <p className="text-slate-400 mb-3">
                        Depending on your jurisdiction (including GDPR, Indian Digital Personal Data Protection Act, and CCPA), you hold the right to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                        <li>Request access to the personal data we store regarding your account or lead profile.</li>
                        <li>Request rectification of incomplete or inaccurate contact records.</li>
                        <li>Request complete erasure ("right to be forgotten") of your data from active CRM databases.</li>
                        <li>Opt-out of automated marketing broadcast campaigns at any time by replying "STOP" on WhatsApp.</li>
                    </ul>
                </section>

                {/* 7. Corporate Contact Information */}
                <section className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">7</span>
                        Data Protection Officer & Contact
                    </h2>
                    <p className="text-slate-400 mb-4">
                        For questions, privacy inquiries, or data deletion requests, contact our designated Data Protection Officer:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#050812] border border-white/10 rounded-xl p-4">
                        <div>
                            <span className="text-slate-500 block mb-0.5">Corporate Entity</span>
                            <strong className="text-white">{info.companyName}</strong>
                            <span className="text-slate-400 block font-mono text-[11px] mt-0.5">CIN: {info.cin}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-0.5">Privacy Inquiries</span>
                            <a href={`mailto:${info.privacyEmail || 'privacy@whatsappcrm.com'}`} className="text-indigo-400 hover:underline">
                                {info.privacyEmail || 'privacy@whatsappcrm.com'}
                            </a>
                            <span className="text-slate-400 block text-[11px] mt-0.5">{info.phone}</span>
                        </div>
                        <div className="col-span-1 sm:col-span-2 pt-2 border-t border-white/5">
                            <span className="text-slate-500 block mb-0.5">Registered Office Address</span>
                            <span className="text-slate-300">{info.address}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
