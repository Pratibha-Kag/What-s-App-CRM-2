import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, AlertTriangle, ShieldCheck, FileCheck, ArrowLeft, Globe, Mail, Phone, MapPin, Hash, Award } from 'lucide-react';
import useAppStore from '../../store/useStore';

const BusinessInfo = () => {
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
                <span className="text-indigo-400">Business Information</span>
            </div>

            {/* Header */}
            <div className="border-b border-white/10 pb-8 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Corporate Transparency & Verification</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    Corporate & Business Information
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-3xl">
                    Official business identification, corporate registration records, and Meta Tech Partner compliance verification details for {info.companyName || 'WhatsApp CRM Technologies Private Limited'}.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span>Last Updated: <strong>{info.lastUpdated || 'November 27, 2026'}</strong></span>
                    <span>•</span>
                    <span>Status: <strong className="text-emerald-400">Active Corporation</strong></span>
                </div>
            </div>

            {/* DRAFT NOTICE BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                        Draft Notice — For Partner Onboarding Review
                    </strong>
                    {info.draftNotice || 'This corporate identification metadata is prepared for Meta Tech Partner compliance verification and demonstration. Official corporate legal documents govern all client contracts.'}
                </div>
            </div>

            {/* Business Information Cards */}
            <div className="space-y-6 text-sm">
                {/* 1. Legal Entity Identification */}
                <div className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-indigo-400" />
                        Legal Entity Identification
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Legal Business Name</span>
                            <strong className="text-white text-sm block">{info.companyName}</strong>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Operating / Trade Name (DBA)</span>
                            <strong className="text-white text-sm block">{info.tradeName}</strong>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Corporate Identification Number (CIN)</span>
                            <strong className="text-indigo-400 font-mono text-sm block">{info.cin}</strong>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Date of Incorporation</span>
                            <span className="text-slate-200 font-medium">{info.incorporationDate}</span>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Business Structure</span>
                            <span className="text-slate-200 font-medium">Private Limited Company</span>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Primary Business Activity</span>
                            <span className="text-slate-200 font-medium">Enterprise Software & CRM Development</span>
                        </div>
                    </div>
                </div>

                {/* 2. Registered & Operational Locations */}
                <div className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        Official Addresses & Locations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                                Registered Corporate Office
                            </span>
                            <p className="text-slate-200 leading-relaxed">{info.address}</p>
                            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1 mt-2">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified with MCA & Commercial Registry
                            </span>
                        </div>
                        <div className="p-4 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                                Operational & Technology Headquarters
                            </span>
                            <p className="text-slate-200 leading-relaxed">{info.operationalHq}</p>
                            <span className="text-indigo-400 text-[11px] font-medium flex items-center gap-1 mt-2">
                                <Building2 className="w-3.5 h-3.5" />
                                Engineering & Customer Success Center
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Tax & Regulatory Verification */}
                <div className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-amber-400" />
                        Tax & Verification Identifiers
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">GSTIN / Tax ID</span>
                            <strong className="text-amber-400 font-mono text-sm block">{info.gstin}</strong>
                            <span className="text-slate-500 text-[10px] block mt-0.5">Government Tax Registration</span>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">D-U-N-S® Number</span>
                            <strong className="text-blue-400 font-mono text-sm block">{info.dunsNumber}</strong>
                            <span className="text-slate-500 text-[10px] block mt-0.5">Dun & Bradstreet Verification ID</span>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Meta Business Manager ID</span>
                            <strong className="text-indigo-400 font-mono text-sm block">{info.metaBusinessManagerId}</strong>
                            <span className="text-slate-500 text-[10px] block mt-0.5">Verified Partner Asset Container</span>
                        </div>
                    </div>
                </div>

                {/* 4. Meta Tech Partner Onboarding Track */}
                <div className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        Meta Tech Partner Track Details
                    </h2>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 text-xs text-emerald-200">
                        <strong className="text-emerald-300 block mb-1">Technology Provider Onboarding Track:</strong>
                        WhatsApp CRM is registered on the Meta for Developers platform to deliver conversational CRM software, WABA registration automation, and Cloud API webhook integrations for commercial clients.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Meta App ID</span>
                            <strong className="text-white font-mono text-sm">{info.metaAppId}</strong>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Partner Track</span>
                            <strong className="text-white text-sm">Solution Partner (Messaging & CRM)</strong>
                        </div>
                    </div>
                </div>

                {/* 5. Corporate Contact & Inquiries */}
                <div className="bg-[#0a0f1c]/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-400" />
                        Official Contact & Compliance Inquiries
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Corporate Inquiries</span>
                            <a href={`mailto:${info.corporateEmail}`} className="text-indigo-400 font-semibold hover:underline block truncate">
                                {info.corporateEmail}
                            </a>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Support Hotline</span>
                            <span className="text-white font-semibold block">{info.phone}</span>
                            <span className="text-slate-400 text-[11px] block">{info.intlPhone}</span>
                        </div>
                        <div className="p-3.5 bg-[#050812] border border-white/10 rounded-xl">
                            <span className="text-slate-500 block mb-1">Official Website</span>
                            <a href={info.officialWebsite} target="_blank" rel="noreferrer" className="text-indigo-400 font-semibold hover:underline block truncate">
                                {info.officialWebsite}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessInfo;
