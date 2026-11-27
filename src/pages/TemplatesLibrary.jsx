import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Plus, Trash2, Edit3, MessageSquareQuote, CheckSquare, 
    X, RefreshCcw, CheckCircle2, Clock, AlertCircle, Copy, Eye, 
    Send, Sparkles, Filter, Layers, FileText, Globe, Tag, ChevronRight,
    HelpCircle, Check, RotateCcw
} from 'lucide-react';
import useWhatsAppTemplateStore from '../store/useWhatsAppTemplateStore';
import WhatsAppTemplatePreviewModal from '../components/whatsapp/templates/WhatsAppTemplatePreviewModal';
import WhatsAppTemplateEditorModal from '../components/whatsapp/templates/WhatsAppTemplateEditorModal';
import WhatsAppTemplateDeleteModal from '../components/whatsapp/templates/WhatsAppTemplateDeleteModal';
import { toast } from '../components/ui/Toast';

const TemplatesLibrary = () => {
    const {
        templates,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        openCreateModal,
        openPreviewModal,
        openDeleteModal,
        duplicateTemplate,
        submitForApproval,
        simulateApproval,
        simulateRejection,
        resetToDefaults,
        getStats
    } = useWhatsAppTemplateStore();

    const [languageFilter, setLanguageFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const stats = getStats();

    // Filter Logic
    const filteredTemplates = templates.filter((tpl) => {
        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesName = (tpl.name || '').toLowerCase().includes(query);
            const matchesTitle = (tpl.title || '').toLowerCase().includes(query);
            const matchesBody = (tpl.body || '').toLowerCase().includes(query);
            if (!matchesName && !matchesTitle && !matchesBody) return false;
        }

        // Category Filter
        if (categoryFilter !== 'All' && tpl.category !== categoryFilter) return false;

        // Status Filter
        if (statusFilter !== 'All' && tpl.status !== statusFilter) return false;

        // Language Filter
        if (languageFilter !== 'All' && tpl.language !== languageFilter) return false;

        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
    const paginatedTemplates = filteredTemplates.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Quick duplicate action
    const handleDuplicate = (tpl) => {
        duplicateTemplate(tpl.id);
        toast.success(`Duplicated "${tpl.title || tpl.name}" as new Draft.`);
    };

    // Quick submit action
    const handleSubmit = (tpl) => {
        submitForApproval(tpl.id);
        toast.info(`Submitted "${tpl.title || tpl.name}" for Meta approval review.`);
    };

    // Quick simulate approval
    const handleApprove = (tpl) => {
        simulateApproval(tpl.id);
        toast.success(`Simulated approval: "${tpl.title || tpl.name}" is now Approved.`);
    };

    // Quick simulate rejection
    const handleReject = (tpl) => {
        simulateRejection(tpl.id);
        toast.warning(`Simulated rejection: "${tpl.title || tpl.name}" rejected.`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Approved
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={12} className="animate-spin" /> In Review
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle size={12} /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        Draft
                    </span>
                );
        }
    };

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'Marketing':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Utility':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Authentication':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const categoriesList = ['All', 'Marketing', 'Utility', 'Authentication'];
    const statusesList = ['All', 'Approved', 'Pending', 'Draft', 'Rejected'];
    const languagesList = ['All', 'English (US)', 'English (UK)', 'Spanish', 'Hindi', 'Arabic'];

    return (
        <div className="flex-1 p-4 md:p-8 bg-[#111318] min-h-screen text-white font-sans pb-24 overflow-x-hidden">
            <div className="max-w-[1500px] mx-auto space-y-6">
                {/* 1. HEADER & ACTION BAR */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E232B] pb-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    <path d="M15.4 13.1c-.2-.1-.8-.4-1-.5-.2-.1-.3-.1-.4.1-.1.2-.4.5-.5.6-.1.1-.3.2-.5.1-.2-.1-.6-.2-1.1-.7-.4-.4-.7-.9-.8-1.1-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.8 2.1.9 2.3c.1.1 1.5 2.3 3.7 3.2.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                WhatsApp Template Management
                            </h1>
                        </div>
                        <p className="text-xs text-slate-400">
                            Create, test, and manage Meta-approved WhatsApp HSM message templates across Marketing, Utility, and Authentication.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={resetToDefaults}
                            className="bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Reset demo template records"
                        >
                            <RotateCcw size={14} /> Reset Demo Data
                        </button>

                        <button
                            onClick={() => openCreateModal()}
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/20 flex items-center gap-2 active:scale-95"
                        >
                            <Plus size={16} /> Create Template
                        </button>
                    </div>
                </div>

                {/* 2. DYNAMIC METRIC CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {/* Total Templates */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Templates</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                            <Layers size={18} />
                        </div>
                    </div>

                    {/* Approved Templates */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Approved</p>
                            <p className="text-2xl font-black text-emerald-400 tracking-tight">{stats.approved}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>

                    {/* Pending Review */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Pending Review</p>
                            <p className="text-2xl font-black text-amber-400 tracking-tight">{stats.pending}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                            <Clock size={18} />
                        </div>
                    </div>

                    {/* Rejected */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] p-4 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Rejected</p>
                            <p className="text-2xl font-black text-rose-400 tracking-tight">{stats.rejected}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                            <AlertCircle size={18} />
                        </div>
                    </div>

                    {/* Drafts */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] p-4 rounded-2xl flex items-center justify-between col-span-2 lg:col-span-1">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drafts</p>
                            <p className="text-2xl font-black text-slate-300 tracking-tight">{stats.draft}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center font-bold">
                            <FileText size={18} />
                        </div>
                    </div>
                </div>

                {/* 3. SEARCH & ADVANCED FILTER TOOLBAR */}
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-4 space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search templates by name, title, or message..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors placeholder:text-slate-500"
                            />
                        </div>

                        {/* Filter Selectors */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
                            >
                                {categoriesList.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat === 'All' ? 'All Categories' : `${cat} Category`}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
                            >
                                {statusesList.map((st) => (
                                    <option key={st} value={st}>
                                        {st === 'All' ? 'All Statuses' : `${st} Status`}
                                    </option>
                                ))}
                            </select>

                            {/* Language Filter */}
                            <select
                                value={languageFilter}
                                onChange={(e) => {
                                    setLanguageFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
                            >
                                {languagesList.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Category Tab Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2D333B]/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">Quick Filter:</span>
                        {categoriesList.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setCategoryFilter(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                    categoryFilter === cat
                                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                                        : 'bg-[#111318] text-slate-400 hover:text-white border border-[#2D333B]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. TEMPLATE LISTING TABLE */}
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-[#16181D] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#2D333B]">
                                <tr>
                                    <th className="px-6 py-4">Template Title & Identifier</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Language</th>
                                    <th className="px-6 py-4">Message Snippet</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Updated</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/50">
                                {paginatedTemplates.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-slate-500">
                                            <FileText size={36} className="mx-auto mb-2 text-slate-600" />
                                            <p className="text-sm font-bold text-slate-300">No message templates found</p>
                                            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or create a new template.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTemplates.map((tpl) => (
                                        <tr key={tpl.id} className="hover:bg-[#111318]/50 transition-colors group">
                                            {/* Name & Title */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold text-xs shrink-0">
                                                        {tpl.category.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-xs hover:text-[#8B5CF6] transition-colors cursor-pointer" onClick={() => openPreviewModal(tpl)}>
                                                            {tpl.title || tpl.name}
                                                        </p>
                                                        <p className="font-mono text-[10px] text-slate-400">{tpl.name}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadge(tpl.category)}`}>
                                                    {tpl.category}
                                                </span>
                                            </td>

                                            {/* Language */}
                                            <td className="px-6 py-4 font-medium text-slate-300">
                                                {tpl.language}
                                            </td>

                                            {/* Message Snippet with Variable highlight */}
                                            <td className="px-6 py-4 max-w-xs truncate text-slate-300 font-sans">
                                                {tpl.body}
                                            </td>

                                            {/* Approval Status */}
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(tpl.status)}
                                            </td>

                                            {/* Last Updated */}
                                            <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                                                {new Date(tpl.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>

                                            {/* Interactive Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Quick Demo Controls for In Review status */}
                                                    {tpl.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(tpl)}
                                                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-colors"
                                                                title="Simulate Meta Approval"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(tpl)}
                                                                className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-colors"
                                                                title="Simulate Meta Rejection"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Submit button for Draft or Rejected */}
                                                    {(tpl.status === 'Draft' || tpl.status === 'Rejected') && (
                                                        <button
                                                            onClick={() => handleSubmit(tpl)}
                                                            className="p-1.5 text-slate-400 hover:text-[#8B5CF6] hover:bg-[#111318] rounded-lg transition-colors"
                                                            title="Submit for Approval"
                                                        >
                                                            <Send size={14} />
                                                        </button>
                                                    )}

                                                    {/* View / Preview */}
                                                    <button
                                                        onClick={() => openPreviewModal(tpl)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#111318] rounded-lg transition-colors"
                                                        title="Preview Template"
                                                    >
                                                        <Eye size={14} />
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openCreateModal(tpl)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#111318] rounded-lg transition-colors"
                                                        title="Edit Template"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>

                                                    {/* Duplicate */}
                                                    <button
                                                        onClick={() => handleDuplicate(tpl)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#111318] rounded-lg transition-colors"
                                                        title="Duplicate Template"
                                                    >
                                                        <Copy size={14} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => openDeleteModal(tpl)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#111318] rounded-lg transition-colors"
                                                        title="Delete Template"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-[#2D333B] bg-[#16181D] flex items-center justify-between text-xs text-slate-400">
                            <span>
                                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTemplates.length)} of {filteredTemplates.length} templates
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-[#111318] border border-[#2D333B] rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                                >
                                    Previous
                                </button>
                                <span className="px-2 font-mono text-white font-bold">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-[#111318] border border-[#2D333B] rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <WhatsAppTemplateEditorModal />
            <WhatsAppTemplatePreviewModal />
            <WhatsAppTemplateDeleteModal />
        </div>
    );
};

export default TemplatesLibrary;
