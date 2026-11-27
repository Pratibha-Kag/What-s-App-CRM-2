import React, { useState, useMemo } from 'react';
import { 
    Send, Plus, Search, Filter, Layers, Users, Clock, 
    CheckCircle2, AlertTriangle, Play, Pause, Copy, Trash2, 
    Eye, RefreshCw, Sparkles, ChevronLeft, ChevronRight, 
    Calendar, CheckCheck, Ban, ArrowUpRight, Check, X
} from 'lucide-react';
import useWhatsAppCampaignStore from '../../store/useWhatsAppCampaignStore';
import useWhatsAppAudienceStore from '../../store/useWhatsAppAudienceStore';
import CampaignWizardModal from '../../components/whatsapp/campaigns/CampaignWizardModal';
import CampaignDetailsModal from '../../components/whatsapp/campaigns/CampaignDetailsModal';
import CampaignDeleteModal from '../../components/whatsapp/campaigns/CampaignDeleteModal';
import CampaignCancelModal from '../../components/whatsapp/campaigns/CampaignCancelModal';

const CampaignsPage = () => {
    const {
        campaigns,
        searchQuery,
        statusFilter,
        typeFilter,
        currentPage,
        pageSize,
        setSearchQuery,
        setStatusFilter,
        setTypeFilter,
        setCurrentPage,
        openWizard,
        openDetailsModal,
        openDeleteModal,
        openCancelModal,
        sendNow,
        pauseCampaign,
        resumeCampaign,
        duplicateCampaign,
        getOverallStats
    } = useWhatsAppCampaignStore();

    const { audiences } = useWhatsAppAudienceStore();

    const overallStats = getOverallStats();

    // Filter campaigns based on search, status, and type
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            if (statusFilter !== 'All' && c.status !== statusFilter) {
                return false;
            }
            if (typeFilter !== 'All' && c.type !== typeFilter) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = (c.name || '').toLowerCase().includes(q);
                const matchesDesc = (c.description || '').toLowerCase().includes(q);
                const matchesTpl = (c.templateName || '').toLowerCase().includes(q);
                const matchesAud = (c.audienceGroupName || '').toLowerCase().includes(q);
                if (!matchesName && !matchesDesc && !matchesTpl && !matchesAud) {
                    return false;
                }
            }
            return true;
        });
    }, [campaigns, searchQuery, statusFilter, typeFilter]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredCampaigns.slice(start, start + pageSize);
    }, [filteredCampaigns, currentPage, pageSize]);

    return (
        <div className="min-h-screen bg-[#111318] text-white p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            WhatsApp CRM Engine
                        </span>
                        <span className="text-xs text-slate-500 font-mono">Developer 1 Module</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <Send className="w-6 h-6 text-[#8B5CF6]" />
                        Manual &amp; Bulk Campaign Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        Schedule and broadcast personalized WhatsApp messages to students and leads. Track delivery telemetry (Sent, Delivered, Read, Failed) in real time.
                    </p>
                </div>

                {/* Primary CTA */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => openWizard()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Create Campaign
                    </button>
                </div>
            </div>

            {/* Dynamic Telemetry Metric Cards (8 Dynamic Metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* 1. Total Campaigns */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Campaigns</span>
                    <p className="text-xl font-bold text-white mt-1">{overallStats.total}</p>
                    <span className="text-[10px] text-slate-500">In database</span>
                </div>

                {/* 2. Active / Running */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-blue-400 uppercase font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Running
                    </span>
                    <p className="text-xl font-bold text-blue-400 mt-1">{overallStats.active}</p>
                    <span className="text-[10px] text-slate-500">Broadcasting</span>
                </div>

                {/* 3. Scheduled */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled
                    </span>
                    <p className="text-xl font-bold text-purple-400 mt-1">{overallStats.scheduled}</p>
                    <span className="text-[10px] text-slate-500">In queue</span>
                </div>

                {/* 4. Completed */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{overallStats.completed}</p>
                    <span className="text-[10px] text-slate-500">Delivered</span>
                </div>

                {/* 5. Total Recipients */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Recipients</span>
                    <p className="text-xl font-bold text-white mt-1">{overallStats.totalRecipients}</p>
                    <span className="text-[10px] text-slate-500">Target contacts</span>
                </div>

                {/* 6. Messages Sent */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-blue-400 uppercase font-semibold">Sent Messages</span>
                    <p className="text-xl font-bold text-blue-400 mt-1">{overallStats.totalSent}</p>
                    <span className="text-[10px] text-slate-500">Dispatched</span>
                </div>

                {/* 7. Delivery Rate */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold">Delivery Rate</span>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{overallStats.deliveryRate}%</p>
                    <span className="text-[10px] text-slate-500">{overallStats.totalDelivered} reached</span>
                </div>

                {/* 8. Read Rate */}
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-[#25D366] uppercase font-semibold">Read Rate</span>
                    <p className="text-xl font-bold text-[#25D366] mt-1">{overallStats.readRate}%</p>
                    <span className="text-[10px] text-slate-500">{overallStats.totalRead} opened</span>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search campaigns by name, template, or audience..."
                        className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Running">Running</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Paused">Paused</option>
                            <option value="Draft">Draft</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]"
                        >
                            <option value="All">All Types</option>
                            <option value="Bulk">Bulk Broadcast</option>
                            <option value="Manual">Manual Outreach</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaign Listing Table */}
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-3.5 px-4 font-semibold">Campaign Details</th>
                                <th className="py-3.5 px-4 font-semibold">Template &amp; Category</th>
                                <th className="py-3.5 px-4 font-semibold">Target Audience</th>
                                <th className="py-3.5 px-4 font-semibold">Status</th>
                                <th className="py-3.5 px-4 font-semibold">Delivery Telemetry</th>
                                <th className="py-3.5 px-4 font-semibold">Schedule / Date</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {paginatedCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-500">
                                        <div className="max-w-sm mx-auto space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center mx-auto text-slate-500">
                                                <Send className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">No campaigns found</p>
                                            <p className="text-xs text-slate-400">
                                                No broadcast campaigns match your active search or filters. Create a new campaign or clear filters.
                                            </p>
                                            <div className="pt-2 flex justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setStatusFilter('All');
                                                        setTypeFilter('All');
                                                    }}
                                                    className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-xs font-semibold text-slate-300 hover:text-white transition-all"
                                                >
                                                    Clear Filters
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openWizard()}
                                                    className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-xs font-semibold text-white hover:bg-[#7C3AED] transition-all"
                                                >
                                                    Create First Campaign
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedCampaigns.map((camp) => {
                                    const {
                                        id,
                                        name,
                                        description,
                                        type,
                                        status,
                                        templateName,
                                        templateCategory,
                                        audienceGroupName,
                                        totalRecipients = 0,
                                        stats = { sent: 0, delivered: 0, read: 0, failed: 0 },
                                        scheduledFor,
                                        createdAt
                                    } = camp;

                                    const deliveryPct = totalRecipients > 0 ? Math.round((stats.delivered / totalRecipients) * 100) : 0;

                                    return (
                                        <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                            {/* 1. Campaign Name & Type */}
                                            <td className="py-3.5 px-4 max-w-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white text-xs hover:text-[#8B5CF6] transition-colors cursor-pointer" onClick={() => openDetailsModal(camp)}>
                                                            {name}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                            type === 'Bulk'
                                                                ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30'
                                                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                            {type}
                                                        </span>
                                                    </div>
                                                    {description && (
                                                        <p className="text-[11px] text-slate-400 line-clamp-1">
                                                            {description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 2. Template & Category */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span className="font-medium text-slate-200 block text-xs">
                                                        {templateName}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                                        {templateCategory}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* 3. Target Audience */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="font-medium text-white">{audienceGroupName}</span>
                                                    <span className="text-[11px] text-slate-400">({totalRecipients})</span>
                                                </div>
                                            </td>

                                            {/* 4. Execution Status */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                    status === 'Completed'
                                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                        : status === 'Running'
                                                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                                            : status === 'Scheduled'
                                                                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                                                : status === 'Paused'
                                                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                                    : status === 'Cancelled'
                                                                        ? 'bg-slate-700/50 text-slate-400 border-slate-600'
                                                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                                }`}>
                                                    {status === 'Running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>}
                                                    {status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                                    {status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                                    {status === 'Paused' && <Pause className="w-3 h-3" />}
                                                    {status === 'Cancelled' && <Ban className="w-3 h-3" />}
                                                    {status}
                                                </span>
                                            </td>

                                            {/* 5. Delivery Telemetry */}
                                            <td className="py-3.5 px-4 min-w-[160px]">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-slate-400">
                                                            {stats.delivered} / {totalRecipients} ({deliveryPct}%)
                                                        </span>
                                                        <span className="text-[#25D366] font-medium flex items-center gap-0.5">
                                                            <CheckCheck className="w-3 h-3" /> {stats.read}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-[#1C1F26] rounded-full overflow-hidden flex">
                                                        <div 
                                                            style={{ width: `${totalRecipients > 0 ? (stats.read / totalRecipients) * 100 : 0}%` }} 
                                                            className="h-full bg-[#25D366]" 
                                                        />
                                                        <div 
                                                            style={{ width: `${totalRecipients > 0 ? ((stats.delivered - stats.read) / totalRecipients) * 100 : 0}%` }} 
                                                            className="h-full bg-cyan-400" 
                                                        />
                                                        <div 
                                                            style={{ width: `${totalRecipients > 0 ? (stats.failed / totalRecipients) * 100 : 0}%` }} 
                                                            className="h-full bg-rose-500" 
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 6. Schedule / Sent Date */}
                                            <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                                                {scheduledFor ? (
                                                    <span className="text-purple-300 flex items-center gap-1 font-medium">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(scheduledFor).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                                                )}
                                            </td>

                                            {/* 7. Interactive Actions */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {/* View Details */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openDetailsModal(camp)}
                                                        title="View Recipient Tracking & Details"
                                                        className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Send Now (For Draft or Scheduled) */}
                                                    {(status === 'Draft' || status === 'Scheduled') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => sendNow(id)}
                                                            title="Launch / Send Campaign Now"
                                                            className="p-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] transition-colors"
                                                        >
                                                            <Play className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Pause / Resume */}
                                                    {status === 'Running' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => pauseCampaign(id)}
                                                            title="Pause Broadcast"
                                                            className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors"
                                                        >
                                                            <Pause className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {status === 'Paused' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => resumeCampaign(id)}
                                                            title="Resume Broadcast"
                                                            className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-colors"
                                                        >
                                                            <Play className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Duplicate */}
                                                    <button
                                                        type="button"
                                                        onClick={() => duplicateCampaign(id)}
                                                        title="Duplicate Campaign"
                                                        className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Cancel (For Running / Scheduled) */}
                                                    {(status === 'Running' || status === 'Scheduled') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openCancelModal(camp)}
                                                            title="Cancel Campaign"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-colors"
                                                        >
                                                            <Ban className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(camp)}
                                                        title="Delete Campaign"
                                                        className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredCampaigns.length > 0 && (
                    <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <div>
                            Showing <strong className="text-white">{Math.min(filteredCampaigns.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
                            <strong className="text-white">{Math.min(filteredCampaigns.length, currentPage * pageSize)}</strong> of{' '}
                            <strong className="text-white">{filteredCampaigns.length}</strong> campaigns
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`p-1.5 rounded-lg border border-[#2D333B] transition-colors ${
                                    currentPage === 1 
                                        ? 'text-slate-600 cursor-not-allowed bg-[#16181D]' 
                                        : 'text-slate-300 hover:text-white bg-[#1C1F26] hover:border-slate-500'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                const isCurrent = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                            isCurrent
                                                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                                                : 'bg-[#1C1F26] text-slate-400 hover:text-white border border-[#2D333B] hover:border-slate-500'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-1.5 rounded-lg border border-[#2D333B] transition-colors ${
                                    currentPage === totalPages 
                                        ? 'text-slate-600 cursor-not-allowed bg-[#16181D]' 
                                        : 'text-slate-300 hover:text-white bg-[#1C1F26] hover:border-slate-500'
                                }`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals Mount */}
            <CampaignWizardModal />
            <CampaignDetailsModal />
            <CampaignDeleteModal />
            <CampaignCancelModal />
        </div>
    );
};

export default CampaignsPage;
