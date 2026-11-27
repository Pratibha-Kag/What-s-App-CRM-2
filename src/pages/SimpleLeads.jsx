import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    UserPlus,
    FileEdit,
    X,
    Download,
    Phone,
    Mail,
    GraduationCap,
    Calendar,
    ChevronDown,
    Bot,
    Globe,
    Table2,
    Building2,
    AlertCircle,
} from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaGoogle } from 'react-icons/fa';
import { mockUsers } from '../mock/mockData';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import { exportRowsToCsv, resolveScopedCustomerId } from '../lib/crmUtils';
import { toast } from '../components/ui/Toast';
import DuplicateReviewModal from '../components/crm/DuplicateReviewModal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEAD_SOURCE_OPTIONS = [
    'WhatsApp',
    'Meta Ads',
    'Google Ads',
    'Google Sheets',
    'Website',
    'Facebook',
    'AI_CHAT',
    'Manual',
];

const renderSourceBadge = (source) => {
    const key = String(source || '').toUpperCase();
    if (key === 'WHATSAPP') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-400 rounded-md uppercase tracking-widest border border-emerald-500/20">
                <FaWhatsapp size={11} /> WHATSAPP
            </span>
        );
    }
    if (key === 'META ADS' || key === 'FACEBOOK') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-blue-500/10 text-blue-400 rounded-md uppercase tracking-widest border border-blue-500/20">
                <FaFacebook size={10} /> {source}
            </span>
        );
    }
    if (key === 'GOOGLE ADS') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-amber-500/10 text-amber-300 rounded-md uppercase tracking-widest border border-amber-500/20">
                <FaGoogle size={10} /> GOOGLE ADS
            </span>
        );
    }
    if (key === 'GOOGLE SHEETS') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-300 rounded-md uppercase tracking-widest border border-emerald-500/20">
                <Table2 size={10} /> GOOGLE SHEETS
            </span>
        );
    }
    if (key === 'AI_CHAT') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-purple-500/10 text-purple-300 rounded-md uppercase tracking-widest border border-purple-500/20">
                <Bot size={10} /> AI CHAT
            </span>
        );
    }
    if (key === 'WEBSITE') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-indigo-500/10 text-indigo-300 rounded-md uppercase tracking-widest border border-indigo-500/20">
                <Globe size={10} /> WEBSITE
            </span>
        );
    }
    return (
        <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-slate-500/10 text-slate-300 rounded-md uppercase tracking-widest border border-slate-500/20">
            {source || 'MANUAL'}
        </span>
    );
};

const AdvancedLeadModal = ({
    lead,
    customers = [],
    isSuperAdmin = false,
    defaultCustomerId = 'cust-001',
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        name: lead?.name || '',
        phone: lead?.phone || '',
        email: lead?.email || '',
        country: lead?.country || lead?.interested_country || '',
        qualification: lead?.qualification || lead?.academic_background || '',
        ielts_score: lead?.ielts_score || '',
        source: lead?.source || 'WhatsApp',
        customerId: lead?.customerId || defaultCustomerId,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Full name is required.';
        if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
        if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
            errs.email = 'Enter a valid email address.';
        }
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave(formData);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={lead?.id ? 'Edit Lead Profile' : 'Create New Lead'}
                    className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col text-white"
                >
                    <div className="flex justify-between items-center p-6 bg-[#16181D] border-b border-[#2D333B]">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-black text-xl border border-[#8B5CF6]/25">
                                {(lead?.name || 'N').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">
                                    {lead?.id ? lead.name : 'New Lead'}
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Profile Editor & Duplicate Check
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close lead modal"
                            className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#2D333B] hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#111318]">
                        <form id="lead-form" onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4 bg-[#1C1F26] p-6 rounded-3xl border border-[#2D333B]">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">
                                    <UserPlus size={14} /> Basic Details
                                </div>

                                {[
                                    { label: 'Full Name', name: 'name', type: 'text', icon: <UserPlus size={14} /> },
                                    { label: 'Phone', name: 'phone', type: 'text', icon: <Phone size={14} /> },
                                    { label: 'Email', name: 'email', type: 'email', icon: <Mail size={14} /> },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label htmlFor={`lead-${field.name}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                {field.icon}
                                            </div>
                                            <input
                                                id={`lead-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#8B5CF6] transition-all"
                                            />
                                        </div>
                                        {errors[field.name] && (
                                            <p className="text-xs text-rose-400 mt-1 ml-1">{errors[field.name]}</p>
                                        )}
                                    </div>
                                ))}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div>
                                        <label htmlFor="lead-source-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Lead Source
                                        </label>
                                        <select
                                            id="lead-source-select"
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                                        >
                                            {LEAD_SOURCE_OPTIONS.map((src) => (
                                                <option key={src} value={src}>
                                                    {src}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {isSuperAdmin && (
                                        <div>
                                            <label htmlFor="lead-customer-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                                Customer Account
                                            </label>
                                            <select
                                                id="lead-customer-select"
                                                name="customerId"
                                                value={formData.customerId}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                                            >
                                                {customers.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.companyName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Academics & Country */}
                            <div className="space-y-4 bg-[#1C1F26] p-6 rounded-3xl border border-[#2D333B]">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                                    <GraduationCap size={14} /> Academic Profile
                                </div>
                                {[
                                    { label: 'Interested Country', name: 'country', type: 'text', icon: <Globe size={14} /> },
                                    { label: 'Qualification', name: 'qualification', type: 'text', icon: <GraduationCap size={14} /> },
                                    { label: 'IELTS Score', name: 'ielts_score', type: 'text', icon: <FileEdit size={14} /> },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label htmlFor={`lead-${field.name}`} className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                {field.icon}
                                            </div>
                                            <input
                                                id={`lead-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-[#2D333B] bg-[#16181D] flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            form="lead-form"
                            type="submit"
                            className="px-8 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-colors"
                        >
                            Save Profile
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const SimpleLeads = () => {
    const {
        role,
        selectedAccount,
        customers,
        leads,
        addCrmLead,
        updateCrmLead,
        assignCrmLead,
        mergeDuplicateLead,
    } = useAppStore();

    const isSuperAdmin = normalizeRoleKey(role) === 'SUPER_ADMIN';
    const isCustomerAdmin = ['ADMIN', 'CUSTOMER_ADMIN'].includes(normalizeRoleKey(role));
    const defaultCustomerId =
        selectedAccount?.id && selectedAccount.id !== 'platform'
            ? selectedAccount.id
            : customers[0]?.id || 'cust-001';

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [filterAssigned, setFilterAssigned] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterCustomer, setFilterCustomer] = useState('All');

    const [editingLead, setEditingLead] = useState(null);
    const [duplicateReview, setDuplicateReview] = useState(null); // { match, incomingLead }

    const counselors = mockUsers.filter((u) =>
        ['COUNSELOR', 'Counselor', 'MANAGER', 'TEAM_LEADER'].includes(u.role)
    );

    const activeCustomerScope = resolveScopedCustomerId(role, selectedAccount, filterCustomer);

    const filteredLeads = useMemo(() => {
        return leads.filter((l) => {
            if (activeCustomerScope !== 'All' && l.customerId !== activeCustomerScope) return false;
            if (filterStage && l.stage !== filterStage) return false;
            if (filterAssigned && l.assigned_to !== filterAssigned) return false;
            if (filterSource && String(l.source || '').toLowerCase() !== filterSource.toLowerCase()) return false;
            if (searchTerm) {
                const query = searchTerm.toLowerCase();
                return (
                    (l.name || '').toLowerCase().includes(query) ||
                    (l.phone || '').toLowerCase().includes(query) ||
                    (l.email || '').toLowerCase().includes(query) ||
                    (l.companyName || '').toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [leads, activeCustomerScope, filterStage, filterAssigned, filterSource, searchTerm]);

    const handleStageChange = (id, newStage) => {
        updateCrmLead(id, { stage: newStage });
        toast.success(`Lead stage updated to ${newStage}`);
    };

    const handleAssignmentChange = (id, counselorId) => {
        assignCrmLead(id, counselorId);
        toast.success('Lead assigned successfully!');
    };

    const handleSaveProfile = (formData) => {
        if (editingLead?.id) {
            updateCrmLead(editingLead.id, formData);
            toast.success('Lead updated successfully!');
            setEditingLead(null);
            return;
        }

        const res = addCrmLead({
            ...formData,
            customerId: isSuperAdmin ? formData.customerId : defaultCustomerId,
        });

        if (res.duplicate) {
            setDuplicateReview({
                match: res.duplicate,
                incomingLead: {
                    ...formData,
                    customerId: isSuperAdmin ? formData.customerId : defaultCustomerId,
                },
            });
            return;
        }

        if (res.ok) {
            toast.success('Lead created successfully!');
            setEditingLead(null);
        }
    };

    const exportToCSV = () => {
        if (filteredLeads.length === 0) {
            toast.error('No leads match current filters to export');
            return;
        }

        exportRowsToCsv(
            [
                'ID',
                'Customer',
                'Name',
                'Phone',
                'Email',
                'Country',
                'Source',
                'Stage',
                'Assigned To',
                'Qualification',
                'IELTS Score',
                'Received At',
            ],
            filteredLeads.map((lead) => [
                lead.id,
                lead.companyName || '-',
                lead.name,
                lead.phone,
                lead.email,
                lead.country || lead.interested_country || '',
                lead.source,
                lead.stage,
                lead.assigned_name || lead.assigned_to || 'System Handled',
                lead.qualification || lead.academic_background || '',
                lead.ielts_score || '',
                lead.created_at ? new Date(lead.created_at).toLocaleString() : '',
            ]),
            `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`
        );
        toast.success(`Exported ${filteredLeads.length} lead(s) to CSV`);
    };

    const canAssign = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER_ADMIN', 'MANAGER', 'TEAM_LEADER', 'CUSTOMER_SUPPORT'].includes(
        normalizeRoleKey(role)
    );

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {editingLead && (
                <AdvancedLeadModal
                    lead={editingLead}
                    customers={customers}
                    isSuperAdmin={isSuperAdmin}
                    defaultCustomerId={defaultCustomerId}
                    onClose={() => setEditingLead(null)}
                    onSave={handleSaveProfile}
                />
            )}

            <DuplicateReviewModal
                isOpen={Boolean(duplicateReview)}
                duplicateMatch={duplicateReview?.match}
                incomingLead={duplicateReview?.incomingLead}
                onMerge={() => {
                    if (duplicateReview?.match?.existingLead) {
                        mergeDuplicateLead({
                            existingLeadId: duplicateReview.match.existingLead.id,
                            existingContactId: duplicateReview.match.existingContact?.id || null,
                            incomingLead: duplicateReview.incomingLead,
                        });
                        toast.success('Merged incoming details into existing lead.');
                    }
                    setDuplicateReview(null);
                    setEditingLead(null);
                }}
                onSkip={() => {
                    toast.warning('Skipped duplicate lead creation.');
                    setDuplicateReview(null);
                    setEditingLead(null);
                }}
                onCreateAnyway={() => {
                    if (duplicateReview?.incomingLead) {
                        addCrmLead(duplicateReview.incomingLead, { forceCreate: true });
                        toast.success('Created new lead record despite duplicate match.');
                    }
                    setDuplicateReview(null);
                    setEditingLead(null);
                }}
                onClose={() => setDuplicateReview(null)}
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[24px] sm:text-[28px] font-black text-white tracking-tight mb-1">
                        Global Directory
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {isCustomerAdmin && selectedAccount?.companyName
                            ? `${selectedAccount.companyName} — Incoming Leads, Routing & Conversions`
                            : 'Manage and route incoming lead intelligence across workspaces'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setEditingLead({ customerId: defaultCustomerId })}
                        className="h-11 px-5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Add Lead
                    </button>
                    <button
                        type="button"
                        onClick={exportToCSV}
                        className="h-11 px-5 bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        <Download size={16} /> Export Intel
                    </button>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-[#1C1F26] p-3 rounded-2xl border border-[#2D333B] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center justify-center h-10 w-10 bg-[#111318] border border-[#2D333B] rounded-xl text-slate-400 shrink-0">
                        <Filter size={17} />
                    </div>

                    {isSuperAdmin && (
                        <div className="relative">
                            <select
                                aria-label="Filter leads by customer"
                                value={filterCustomer}
                                onChange={(e) => setFilterCustomer(e.target.value)}
                                className="appearance-none pl-3.5 pr-9 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white outline-none focus:border-[#8B5CF6] cursor-pointer"
                            >
                                <option value="All">All Customers</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.companyName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    )}

                    <div className="relative">
                        <select
                            aria-label="Filter leads by stage"
                            value={filterStage}
                            onChange={(e) => setFilterStage(e.target.value)}
                            className="appearance-none pl-3.5 pr-9 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white outline-none focus:border-[#8B5CF6] cursor-pointer"
                        >
                            <option value="">All Stages</option>
                            {['New', 'Follow-up', 'Qualified', 'Converted', 'Lost'].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            aria-label="Filter leads by source"
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="appearance-none pl-3.5 pr-9 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white outline-none focus:border-[#8B5CF6] cursor-pointer"
                        >
                            <option value="">All Sources</option>
                            {LEAD_SOURCE_OPTIONS.map((src) => (
                                <option key={src} value={src}>
                                    {src}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            aria-label="Filter leads by agent"
                            value={filterAssigned}
                            onChange={(e) => setFilterAssigned(e.target.value)}
                            className="appearance-none pl-3.5 pr-9 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-bold text-white outline-none focus:border-[#8B5CF6] cursor-pointer"
                        >
                            <option value="">All Agents</option>
                            {counselors.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="relative w-full xl:w-72 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        aria-label="Search leads"
                        placeholder="Search name, phone, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#111318] border border-[#2D333B] rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] transition-all"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[920px]">
                        <thead className="bg-[#16181D] border-b border-[#2D333B]">
                            <tr>
                                {['Lead / Source / Received', 'Contact Info', 'Customer & Academic', 'Current Stage', 'Assigned To', ''].map((head, i) => (
                                    <th key={i} className="py-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="border-b border-[#2D333B]/60 hover:bg-[#111318] transition-colors"
                                >
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-[#111318] border border-[#2D333B] flex flex-col items-center justify-center shrink-0">
                                                <span className="text-[8px] font-bold text-slate-500">#{lead.id}</span>
                                                <span className="font-black text-[#8B5CF6] text-xs">
                                                    {(lead.name || 'U').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{lead.name || 'Unknown'}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    {renderSourceBadge(lead.source)}
                                                    {lead.created_at && (
                                                        <span className="text-[11px] text-slate-500">
                                                            {new Date(lead.created_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                                            <Phone size={12} className="text-slate-500" /> {lead.phone || 'Not provided'}
                                        </div>
                                        {lead.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail size={12} className="text-slate-500" /> {lead.email}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-4 px-5">
                                        <div className="text-xs text-slate-300 space-y-1">
                                            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                                                <Building2 size={12} />
                                                <span>{lead.companyName || 'Apex Digital Solutions'}</span>
                                            </div>
                                            <div className="text-slate-400">
                                                {lead.qualification || lead.academic_background || '-'} • {lead.country || lead.interested_country || '-'}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5">
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="relative">
                                                <select
                                                    aria-label={`Stage for ${lead.name}`}
                                                    value={lead.stage || 'New'}
                                                    onChange={(e) => handleStageChange(lead.id, e.target.value)}
                                                    className={`appearance-none text-[10px] font-black uppercase tracking-widest border rounded-lg py-1.5 pl-3 pr-8 outline-none cursor-pointer transition-all ${
                                                        lead.stage === 'Converted'
                                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                                                            : lead.stage === 'New'
                                                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                                                            : lead.stage === 'Lost'
                                                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/25'
                                                            : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                                                    }`}
                                                >
                                                    <option value="New" className="bg-[#111318] text-white">NEW</option>
                                                    <option value="Follow-up" className="bg-[#111318] text-white">FOLLOW-UP</option>
                                                    <option value="Qualified" className="bg-[#111318] text-white">QUALIFIED</option>
                                                    <option value="Converted" className="bg-[#111318] text-white">CONVERTED</option>
                                                    <option value="Lost" className="bg-[#111318] text-white">LOST</option>
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />
                                            </div>
                                            {lead.next_followup_date && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 mt-1">
                                                    <Calendar size={10} /> {new Date(lead.next_followup_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-5">
                                        {canAssign ? (
                                            <div className="relative max-w-[175px]">
                                                <select
                                                    aria-label={`Assign ${lead.name}`}
                                                    value={lead.assigned_to || ''}
                                                    onChange={(e) => handleAssignmentChange(lead.id, e.target.value)}
                                                    className="appearance-none w-full text-xs font-bold text-white bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] rounded-lg py-2 pl-3 pr-8 outline-none cursor-pointer truncate"
                                                >
                                                    <option value="">System Handled</option>
                                                    {counselors.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        ) : (
                                            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                {lead.assigned_name || 'System Handled'}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-4 px-5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setEditingLead(lead)}
                                            aria-label={`Edit ${lead.name}`}
                                            className="h-9 w-9 inline-flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#111318] border border-transparent hover:border-[#2D333B] rounded-xl transition-all"
                                            title="Edit Lead"
                                        >
                                            <FileEdit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="w-12 h-12 bg-[#111318] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#2D333B]">
                                            <AlertCircle size={20} className="text-slate-500" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                            No Leads Found
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SimpleLeads;
