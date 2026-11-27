import React, { useState, useMemo } from 'react';
import {
    Award,
    Shield,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Upload,
    Building2,
    Eye,
    Trash2,
    RefreshCw,
    ExternalLink,
    Check,
    Info,
    Layers,
    FileCheck,
    Send,
    RotateCcw,
    Lock,
    Globe,
    Phone,
    Mail,
    Hash,
    ChevronRight,
    HelpCircle,
    AlertCircle,
    Plus,
} from 'lucide-react';
import useAppStore from '../store/useStore';
import { mockAlternativeWhatsAppProviders } from '../mock/mockData';
import { toast } from '../components/ui/Toast';

const STATUS_CONFIG = {
    Draft: {
        label: 'Draft',
        color: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
        badge: 'bg-gray-500',
    },
    Pending: {
        label: 'Pending Submission',
        color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        badge: 'bg-blue-500',
    },
    'Under Review': {
        label: 'Under Review',
        color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        badge: 'bg-indigo-500 animate-pulse',
    },
    Approved: {
        label: 'Approved (Meta Verified Partner)',
        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        badge: 'bg-emerald-500',
    },
    Rejected: {
        label: 'Rejected (Action Required)',
        color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        badge: 'bg-rose-500',
    },
};

const MetaTechPartnerOnboarding = () => {
    const {
        role,
        metaTechPartnerOnboarding,
        updateMetaBusinessInfo,
        updateMetaVerificationChecklist,
        uploadMetaDocument,
        deleteMetaDocument,
        toggleMetaPermission,
        saveMetaOnboardingDraft,
        simulateMetaSubmission,
        simulateMetaApproval,
        simulateMetaRejection,
        resubmitMetaApplication,
    } = useAppStore();

    const onboarding = metaTechPartnerOnboarding || {};
    const businessInfo = onboarding.businessInfo || {};
    const status = onboarding.status || 'Under Review';
    const currentStatusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['Under Review'];

    // Tab state: 'overview' | 'businessInfo' | 'documents' | 'permissions' | 'history' | 'providers'
    const [activeTab, setActiveTab] = useState('overview');

    // Business Info Form state
    const [formData, setFormData] = useState({
        legalName: businessInfo.legalName || '',
        tradeName: businessInfo.tradeName || '',
        cin: businessInfo.cin || '',
        address: businessInfo.address || '',
        website: businessInfo.website || '',
        contactEmail: businessInfo.contactEmail || '',
        contactPhone: businessInfo.contactPhone || '',
        metaAppId: businessInfo.metaAppId || '',
        bmId: businessInfo.bmId || '',
        dunsNumber: businessInfo.dunsNumber || '',
        partnerTrack: businessInfo.partnerTrack || 'Solution Partner (Messaging & CRM)',
    });

    // Document Preview Modal State
    const [previewDoc, setPreviewDoc] = useState(null);

    // Simulated local file upload state
    const [selectedDummyDocType, setSelectedDummyDocType] = useState('Certificate of Incorporation');
    const [dummyUploadName, setDummyUploadName] = useState('incorporation_cert_updated.pdf');

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveBusinessInfo = (e) => {
        e.preventDefault();
        updateMetaBusinessInfo(formData);
        toast.success('Business information updated and saved locally.');
    };

    const handleSaveDraft = () => {
        saveMetaOnboardingDraft(formData);
        toast.info('Application draft saved locally.');
    };

    const handleSimulateSubmit = () => {
        simulateMetaSubmission();
        toast.success('Application submitted for simulated Meta compliance review!');
    };

    const handleSimulateApproval = () => {
        simulateMetaApproval();
        toast.success('Simulated approval granted! Partner status updated to Approved.');
    };

    const handleSimulateRejection = () => {
        simulateMetaRejection('Address verification document blurry or mismatched with corporate registry.');
        toast.error('Simulated rejection triggered: Address verification issue flagged.');
    };

    const handleResubmit = () => {
        resubmitMetaApplication();
        toast.success('Application resubmitted with updated address documentation!');
    };

    const handleAddSimulatedDocument = () => {
        uploadMetaDocument({
            title: selectedDummyDocType,
            filename: dummyUploadName,
            size: `${(Math.random() * 1.5 + 0.8).toFixed(1)} MB`,
            mimeType: 'application/pdf',
            status: 'Verified',
        });
        toast.success(`Uploaded simulated document: ${selectedDummyDocType}`);
    };

    return (
        <div className="space-y-6 text-white pb-16">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B] pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span>Settings</span>
                        <span>/</span>
                        <span className="text-blue-400 font-medium">Meta Tech Partner</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                Meta Tech Partner Onboarding
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    D2-08
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400">
                                Super Admin interface for Meta Business Solution Provider verification, KYC documents, and Cloud API compliance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        Super Admin Access Only
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Interactive Lifecycle Demo
                    </span>
                </div>
            </div>

            {/* MANDATORY SIMULATED DISCLAIMER BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                        Simulated Partner Onboarding Notice — Demonstration Only
                    </strong>
                    All verification checklists, KYC documents, API permissions, and approval lifecycles shown in this interface are <strong>simulated demonstrations</strong> using local state. This module does not perform real network requests to Meta Business Manager, submit actual legal documents, or constitute official Meta Partner accreditation.
                </div>
            </div>

            {/* SECTION 1: Status & Application Progress Header Card */}
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2D333B]/60 pb-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-mono text-gray-400">
                                App ID: <strong className="text-white">{onboarding.applicationId || 'META-TP-2026-9812'}</strong>
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentStatusConfig.color}`}>
                                <span className={`w-2 h-2 rounded-full ${currentStatusConfig.badge}`} />
                                {currentStatusConfig.label}
                            </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                            {businessInfo.legalName || 'WhatsApp CRM Technologies Private Limited'}
                        </h2>
                        <span className="text-xs text-indigo-400 font-medium">
                            Track: {onboarding.track || 'Technology Provider / Solution Partner'}
                        </span>
                    </div>

                    {/* Simulation Controls Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleSaveDraft}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 transition"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={handleSimulateSubmit}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition"
                        >
                            Simulate Submit
                        </button>
                        <button
                            onClick={handleSimulateApproval}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition"
                        >
                            Simulate Approval
                        </button>
                        <button
                            onClick={handleSimulateRejection}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 transition"
                        >
                            Simulate Rejection
                        </button>
                    </div>
                </div>

                {/* Rejection Notice & Resubmission Box */}
                {status === 'Rejected' && (
                    <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-4 text-xs space-y-3">
                        <div className="flex items-start gap-2.5">
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-rose-200 block font-bold text-sm">
                                    Simulated Application Rejection
                                </strong>
                                <p className="text-rose-300/90 mt-0.5">
                                    <strong>Flagged Reason:</strong> {onboarding.rejectionReason || 'Address verification document blurry or mismatched with corporate registry.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 flex-wrap gap-2">
                            <span className="text-gray-300">
                                Remedy: Upload a clear municipal utility bill or commercial lease matching registered CIN address.
                            </span>
                            <button
                                onClick={handleResubmit}
                                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow"
                            >
                                Resubmit Application
                            </button>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Onboarding Completion Progress</span>
                        <span className="font-mono font-bold text-white">{onboarding.progressPercentage || 75}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#111318] overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${onboarding.progressPercentage || 75}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#2D333B] pb-3 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'overview'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    Overview & Checklist
                </button>
                <button
                    onClick={() => setActiveTab('businessInfo')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'businessInfo'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    Business Information Form
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'documents'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    KYC & Verification Docs ({onboarding.documents?.length || 4})
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'permissions'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    API Permissions Checklist ({onboarding.permissions?.filter((p) => p.approved).length || 3}/4)
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'history'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    Activity Log ({onboarding.activityHistory?.length || 4})
                </button>
                <button
                    onClick={() => setActiveTab('providers')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === 'providers'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                    }`}
                >
                    Alternative Providers ({mockAlternativeWhatsAppProviders.length})
                </button>
            </div>

            {/* TAB 1: Overview & Verification Checklist */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Verification Checklist */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-[#2D333B]/60 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-emerald-400" />
                                        Meta Business Verification Checklist
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Mandatory corporate documents required to pass automated Meta Business Manager verification.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {onboarding.verificationChecklist?.map((item) => {
                                    const isVerified = item.status === 'Verified';
                                    const isPending = item.status === 'Pending Review';
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-between gap-3 text-xs"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isVerified ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                ) : isPending ? (
                                                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                                )}
                                                <div>
                                                    <span className="font-semibold text-white block">{item.label}</span>
                                                    <span className="text-[11px] text-gray-400">
                                                        {item.mandatory ? 'Mandatory Requirement' : 'Optional Documentation'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                                                        isVerified
                                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                            : isPending
                                                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateMetaVerificationChecklist(
                                                            item.id,
                                                            isVerified ? 'Pending Review' : 'Verified'
                                                        )
                                                    }
                                                    className="px-2 py-1 rounded bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 text-[10px] transition"
                                                >
                                                    Toggle
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Program Requirements & Benefits */}
                        <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-3 text-xs">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Award className="w-4 h-4 text-indigo-400" />
                                Meta Tech Partner Tier Benefits
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                                <div className="p-3 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <strong className="text-white block mb-1">Direct Cloud API Throughput</strong>
                                    <p className="text-gray-400 text-[11px]">Enables 250+ messages/sec high concurrency for automated student admissions broadcast.</p>
                                </div>
                                <div className="p-3 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <strong className="text-white block mb-1">Embedded Signup Automation</strong>
                                    <p className="text-gray-400 text-[11px]">Allows new customer organizations to onboard WABAs in under 2 minutes within the CRM.</p>
                                </div>
                                <div className="p-3 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <strong className="text-white block mb-1">Pass-Through Meta Billing</strong>
                                    <p className="text-gray-400 text-[11px]">Direct currency settlement with Meta without compulsory intermediary markup fees.</p>
                                </div>
                                <div className="p-3 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <strong className="text-white block mb-1">Verified Partner Directory Listing</strong>
                                    <p className="text-gray-400 text-[11px]">Official listing in Meta Partner directory under Education & CRM Solutions.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Metadata Overview */}
                    <div className="space-y-5">
                        <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-3.5 text-xs">
                            <h3 className="font-bold text-white text-sm">Key Onboarding Identifiers</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Corporate Legal Name</span>
                                    <strong className="text-white block">{businessInfo.legalName}</strong>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">CIN / Incorporation ID</span>
                                    <code className="text-indigo-400 font-mono text-[11px] block">{businessInfo.cin}</code>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">D-U-N-S® Number</span>
                                    <code className="text-blue-400 font-mono text-[11px] block">{businessInfo.dunsNumber}</code>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Meta App ID</span>
                                    <code className="text-gray-200 font-mono text-[11px] block">{businessInfo.metaAppId}</code>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Business Manager ID</span>
                                    <code className="text-gray-200 font-mono text-[11px] block">{businessInfo.bmId}</code>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Partner Operations Email</span>
                                    <a href={`mailto:${businessInfo.contactEmail}`} className="text-indigo-400 hover:underline">
                                        {businessInfo.contactEmail}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-200 space-y-2">
                            <span className="font-bold text-blue-300 block">Fast-Track Resubmission</span>
                            <p className="text-[11px] text-blue-200/80 leading-relaxed">
                                Need to test a specific compliance scenario? Use the quick simulation controls at the top to toggle between Approved, Rejected, and Under Review states.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Business Information Form */}
            {activeTab === 'businessInfo' && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-5">
                    <div className="border-b border-[#2D333B]/60 pb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white">Business Information Form</h3>
                            <p className="text-xs text-gray-400">
                                Corporate details matching official registry records submitted to Meta for verification.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveBusinessInfo}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow"
                        >
                            Save Changes
                        </button>
                    </div>

                    <form onSubmit={handleSaveBusinessInfo} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Legal Business Name</label>
                            <input
                                type="text"
                                name="legalName"
                                value={formData.legalName}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Trade Name / DBA</label>
                            <input
                                type="text"
                                name="tradeName"
                                value={formData.tradeName}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Corporate Registration / CIN</label>
                            <input
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">D-U-N-S® Number</label>
                            <input
                                type="text"
                                name="dunsNumber"
                                value={formData.dunsNumber}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 font-medium mb-1">Official Registered Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Official Website URL</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Primary Partner Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Support Phone Hotline</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Meta App ID</label>
                            <input
                                type="text"
                                name="metaAppId"
                                value={formData.metaAppId}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Meta Business Manager ID</label>
                            <input
                                type="text"
                                name="bmId"
                                value={formData.bmId}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Partner Track</label>
                            <select
                                name="partnerTrack"
                                value={formData.partnerTrack}
                                onChange={handleFormChange}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="Solution Partner (Messaging & CRM)">Solution Partner (Messaging & CRM)</option>
                                <option value="Tech Provider (Cloud API)">Tech Provider (Cloud API)</option>
                                <option value="Agency Partner">Agency Partner</option>
                            </select>
                        </div>
                    </form>
                </div>
            )}

            {/* TAB 3: KYC & Verification Documents */}
            {activeTab === 'documents' && (
                <div className="space-y-6">
                    {/* Simulated Document Upload Dropzone */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-[#2D333B]/60 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-blue-400" />
                                    Simulate Local Document Upload
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Upload supporting PDF verification documents into the local simulation storage.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <label className="block text-gray-400 font-medium mb-1">Document Category</label>
                                <select
                                    value={selectedDummyDocType}
                                    onChange={(e) => {
                                        setSelectedDummyDocType(e.target.value);
                                        setDummyUploadName(`${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')}_2026.pdf`);
                                    }}
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                                    <option value="Address Verification Document (Utility / Lease)">Address Verification (Utility / Lease)</option>
                                    <option value="Board Resolution for Meta Authorization">Board Resolution</option>
                                    <option value="Director / Representative Government ID">Director / Representative ID</option>
                                    <option value="Tax Registration Certificate (GSTIN)">Tax Registration (GSTIN / EIN)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 font-medium mb-1">Simulated File Name</label>
                                <input
                                    type="text"
                                    value={dummyUploadName}
                                    onChange={(e) => setDummyUploadName(e.target.value)}
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleAddSimulatedDocument}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Upload Simulated PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Document List Table */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white">Uploaded Verification Documents</h3>
                            <span className="text-xs text-gray-400">Total: {onboarding.documents?.length || 0} Files</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#111318] text-gray-400 border-b border-[#2D333B] uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="p-3 font-semibold">Document Title & Filename</th>
                                        <th className="p-3 font-semibold">Size & Type</th>
                                        <th className="p-3 font-semibold">Verification Hash</th>
                                        <th className="p-3 font-semibold">Uploaded</th>
                                        <th className="p-3 font-semibold">Status</th>
                                        <th className="p-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D333B]/60 text-gray-300">
                                    {onboarding.documents?.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-[#252933] transition">
                                            <td className="p-3">
                                                <div className="font-semibold text-white">{doc.title}</div>
                                                <span className="text-[11px] text-gray-400 font-mono">{doc.filename}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-gray-300">{doc.size}</span>
                                                <span className="text-[10px] text-gray-500 block">{doc.mimeType}</span>
                                            </td>
                                            <td className="p-3 font-mono text-[11px] text-gray-400 max-w-[140px] truncate">
                                                {doc.hash}
                                            </td>
                                            <td className="p-3 text-gray-400">{doc.uploadedAt}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        doc.status === 'Verified'
                                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                    }`}
                                                >
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="p-1.5 rounded-lg bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 hover:text-white transition"
                                                        title="Preview Document"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMetaDocument(doc.id)}
                                                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: API Permissions Checklist */}
            {activeTab === 'permissions' && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="border-b border-[#2D333B]/60 pb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white">Meta Cloud API Scopes & Permissions</h3>
                            <p className="text-xs text-gray-400">
                                Required Graph API scopes requested during Tech Partner app review.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {onboarding.permissions?.map((perm) => (
                            <div
                                key={perm.id}
                                className="p-4 rounded-xl bg-[#111318] border border-[#2D333B] flex items-start justify-between gap-4 text-xs"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <code className="text-indigo-400 font-mono font-bold text-xs bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                            {perm.scope}
                                        </code>
                                        {perm.approved ? (
                                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                                Approved Scope
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-semibold text-gray-400 bg-gray-500/15 border border-gray-500/30 px-2 py-0.5 rounded-full">
                                                Review Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-xs leading-relaxed">{perm.description}</p>
                                </div>

                                <button
                                    onClick={() => toggleMetaPermission(perm.id)}
                                    className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                                        perm.approved
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                            : 'bg-[#2D333B] text-gray-400 border border-gray-600 hover:text-white'
                                    }`}
                                >
                                    {perm.approved ? 'Approved ✓' : 'Approve'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 5: Activity Log */}
            {activeTab === 'history' && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">Application Activity & Audit Trail</h3>
                        <span className="text-xs text-gray-400">{onboarding.activityHistory?.length || 0} Events Logged</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-gray-400 border-b border-[#2D333B] uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="p-3 font-semibold">Action / Event</th>
                                    <th className="p-3 font-semibold">Event Details</th>
                                    <th className="p-3 font-semibold">Performed By</th>
                                    <th className="p-3 font-semibold">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/60 text-gray-300">
                                {onboarding.activityHistory?.map((act) => (
                                    <tr key={act.id} className="hover:bg-[#252933] transition">
                                        <td className="p-3 font-semibold text-white">{act.action}</td>
                                        <td className="p-3 text-gray-300">{act.details}</td>
                                        <td className="p-3 text-indigo-400">{act.performedBy}</td>
                                        <td className="p-3 text-gray-400">{act.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 6: Alternative WhatsApp BSP Providers (Informational) */}
            {activeTab === 'providers' && (
                <div className="space-y-4">
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-2">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            Alternative WhatsApp Business Solution Providers (BSPs)
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Informational catalog of market-leading alternative WhatsApp Business Solution Providers, presented for client commercial evaluation as alternative or fallback routing infrastructure.
                        </p>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-200">
                            <strong>Note:</strong> Informational directory only. No live external API connections, network calls, or software integrations are active for these third-party providers.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockAlternativeWhatsAppProviders.map((bsp) => (
                            <div
                                key={bsp.id}
                                className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 text-xs"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-white">{bsp.name}</span>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                            {bsp.tier}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed text-[11px]">{bsp.description}</p>
                                    <div>
                                        <span className="text-gray-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                                            Core Capabilities
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {bsp.capabilities.map((cap) => (
                                                <span
                                                    key={cap}
                                                    className="px-2 py-0.5 rounded-md bg-[#111318] border border-[#2D333B] text-[10px] text-slate-300"
                                                >
                                                    {cap}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#2D333B]/60 space-y-2">
                                    <div className="text-[11px] text-indigo-300">
                                        <strong>Best for:</strong> {bsp.recommendedFor}
                                    </div>
                                    <a
                                        href={bsp.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#2D333B] hover:bg-[#383F4A] text-white font-semibold transition"
                                    >
                                        <span>View Provider Documentation</span>
                                        <ExternalLink className="w-3 h-3 text-blue-400" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL: Document Preview Modal */}
            {previewDoc && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Document Preview Modal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-white">
                        <div className="p-5 border-b border-[#2D333B] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                <div>
                                    <h3 className="font-bold text-sm text-white">{previewDoc.title}</h3>
                                    <span className="text-[11px] font-mono text-gray-400">{previewDoc.filename}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="text-gray-400 hover:text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-5 space-y-4 text-xs">
                            <div className="grid grid-cols-3 gap-2 text-[11px]">
                                <div className="p-2.5 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <span className="text-gray-400 block mb-0.5">File Size</span>
                                    <strong className="text-white">{previewDoc.size}</strong>
                                </div>
                                <div className="p-2.5 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <span className="text-gray-400 block mb-0.5">MIME Type</span>
                                    <strong className="text-white">{previewDoc.mimeType}</strong>
                                </div>
                                <div className="p-2.5 bg-[#111318] border border-[#2D333B] rounded-xl">
                                    <span className="text-gray-400 block mb-0.5">Verification</span>
                                    <span className="text-emerald-400 font-semibold">{previewDoc.status}</span>
                                </div>
                            </div>

                            {/* Simulated PDF Document Viewer Window */}
                            <div className="p-8 rounded-xl bg-[#0a0f1c] border border-white/10 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden min-h-[220px]">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <strong className="text-white text-sm block">{previewDoc.title}</strong>
                                    <span className="text-gray-400 text-[11px] block mt-0.5">
                                        Simulated PDF Document Stream (Verified Digital Signature)
                                    </span>
                                </div>
                                <div className="bg-[#111318] px-3 py-1.5 rounded-lg border border-[#2D333B] font-mono text-[10px] text-gray-400">
                                    SHA-256: {previewDoc.hash}
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Compliant with Meta KYC Requirements
                                </span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#2D333B] flex items-center justify-end bg-[#111318]">
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-white transition"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetaTechPartnerOnboarding;
