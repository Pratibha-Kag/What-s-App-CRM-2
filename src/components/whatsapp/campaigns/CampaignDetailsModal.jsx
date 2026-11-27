import React, { useState } from 'react';
import { 
    X, CheckCheck, Check, Clock, AlertTriangle, RefreshCw, 
    Search, Filter, Send, Pause, Play, Ban, FileText, 
    Users, Calendar, Sparkles, ArrowRight, ShieldCheck, PhoneCall
} from 'lucide-react';
import useWhatsAppCampaignStore from '../../../store/useWhatsAppCampaignStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const CampaignDetailsModal = () => {
    const { 
        isDetailsModalOpen, 
        selectedCampaign, 
        closeDetailsModal,
        sendNow,
        pauseCampaign,
        resumeCampaign,
        openCancelModal,
        retryFailedRecipient,
        retryAllFailedRecipients
    } = useWhatsAppCampaignStore();

    const [recipientSearch, setRecipientSearch] = useState('');
    const [recipientStatusFilter, setRecipientStatusFilter] = useState('All');
    const [retryingPhone, setRetryingPhone] = useState(null);

    if (!isDetailsModalOpen || !selectedCampaign) return null;

    const {
        id,
        name,
        description,
        type,
        status,
        templateName,
        templateCategory,
        templateSnapshot,
        variableMappings = [],
        audienceGroupName,
        totalRecipients = 0,
        stats = { sent: 0, delivered: 0, read: 0, failed: 0, pending: 0 },
        scheduledFor,
        timezone,
        createdAt,
        completedAt,
        recipients = []
    } = selectedCampaign;

    const deliveryRate = stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0;
    const readRate = stats.delivered > 0 ? Math.round((stats.read / stats.delivered) * 100) : 0;

    // Filter recipients
    const filteredRecipients = recipients.filter(r => {
        if (recipientStatusFilter !== 'All' && r.status !== recipientStatusFilter) {
            return false;
        }
        if (recipientSearch.trim()) {
            const q = recipientSearch.toLowerCase();
            const matchesName = (r.name || '').toLowerCase().includes(q);
            const matchesPhone = (r.phone || '').toLowerCase().includes(q);
            if (!matchesName && !matchesPhone) return false;
        }
        return true;
    });

    const failedCount = recipients.filter(r => r.status === 'Failed').length;

    const handleRetrySingle = (phone) => {
        setRetryingPhone(phone);
        retryFailedRecipient(id, phone);
        setTimeout(() => setRetryingPhone(null), 1500);
    };

    const handleRetryAll = () => {
        retryAllFailedRecipients(id);
    };

    // Build sample mapped variables for template preview
    const sampleRecipient = recipients[0] || { name: 'Aarav Patel', phone: '+91 98765 43210' };
    const renderedCustomVariables = (variableMappings || []).map(m => {
        let val = '';
        if (m.source === 'name') val = sampleRecipient.name || m.fallback || 'Applicant';
        else if (m.source === 'phone') val = sampleRecipient.phone || m.fallback || '';
        else if (m.source === 'email') val = sampleRecipient.email || m.fallback || '';
        else if (m.source === 'city') val = sampleRecipient.city || m.fallback || '';
        else if (m.source === 'dob') val = sampleRecipient.dob || m.fallback || '';
        else val = m.customValue || m.fallback || `[Value {{${m.key}}}]`;

        return { key: m.key, sample: val };
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                            <Send className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-white">{name}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                    status === 'Completed'
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : status === 'Running'
                                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 animate-pulse'
                                            : status === 'Scheduled'
                                                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                                : status === 'Paused'
                                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                    : status === 'Cancelled'
                                                        ? 'bg-slate-700/50 text-slate-400 border-slate-600'
                                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                    {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1C1F26] text-slate-400 border border-[#2D333B]">
                                    {type} Campaign
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {description || 'Direct WhatsApp marketing and counseling communication broadcast.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {status === 'Scheduled' && (
                            <button
                                type="button"
                                onClick={() => sendNow(id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white transition-all shadow-sm"
                            >
                                <Play className="w-3.5 h-3.5" />
                                Execute Scheduled Now
                            </button>
                        )}

                        {status === 'Running' && (
                            <button
                                type="button"
                                onClick={() => pauseCampaign(id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
                            >
                                <Pause className="w-3.5 h-3.5" />
                                Pause
                            </button>
                        )}

                        {status === 'Paused' && (
                            <button
                                type="button"
                                onClick={() => resumeCampaign(id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all"
                            >
                                <Play className="w-3.5 h-3.5" />
                                Resume
                            </button>
                        )}

                        {(status === 'Running' || status === 'Scheduled' || status === 'Paused') && (
                            <button
                                type="button"
                                onClick={() => openCancelModal(selectedCampaign)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                            >
                                <Ban className="w-3.5 h-3.5" />
                                Cancel
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={closeDetailsModal}
                            className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* Telemetry Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Audience</span>
                            <p className="text-xl font-bold text-white mt-0.5">{totalRecipients}</p>
                            <span className="text-[10px] text-slate-500">{audienceGroupName}</span>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-blue-400 uppercase font-semibold">Sent</span>
                            <p className="text-xl font-bold text-blue-400 mt-0.5">{stats.sent}</p>
                            <span className="text-[10px] text-slate-500">Dispatched</span>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-cyan-400 uppercase font-semibold">Delivered</span>
                            <p className="text-xl font-bold text-cyan-400 mt-0.5">{stats.delivered}</p>
                            <span className="text-[10px] text-cyan-400 font-semibold">{deliveryRate}% rate</span>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-[#25D366] uppercase font-semibold">Read / Opened</span>
                            <p className="text-xl font-bold text-[#25D366] mt-0.5">{stats.read}</p>
                            <span className="text-[10px] text-[#25D366] font-semibold">{readRate}% rate</span>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-rose-400 uppercase font-semibold">Failed</span>
                            <p className="text-xl font-bold text-rose-400 mt-0.5">{stats.failed}</p>
                            <span className="text-[10px] text-rose-400">Errors flagged</span>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending</span>
                            <p className="text-xl font-bold text-slate-300 mt-0.5">{stats.pending}</p>
                            <span className="text-[10px] text-slate-500">In queue</span>
                        </div>
                    </div>

                    {/* Visual Segment Progress Bar */}
                    <div className="space-y-1.5 bg-[#111318] p-4 rounded-xl border border-[#2D333B]">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span className="font-semibold text-white">Broadcast Delivery Telemetry</span>
                            <span>{stats.delivered} of {totalRecipients} successfully reached</span>
                        </div>
                        <div className="w-full h-3 bg-[#1C1F26] rounded-full overflow-hidden flex">
                            {totalRecipients > 0 && (
                                <>
                                    <div 
                                        style={{ width: `${(stats.read / totalRecipients) * 100}%` }} 
                                        className="h-full bg-[#25D366] transition-all duration-500" 
                                        title={`Read: ${stats.read}`}
                                    />
                                    <div 
                                        style={{ width: `${((stats.delivered - stats.read) / totalRecipients) * 100}%` }} 
                                        className="h-full bg-cyan-500 transition-all duration-500" 
                                        title={`Delivered (Unread): ${stats.delivered - stats.read}`}
                                    />
                                    <div 
                                        style={{ width: `${((stats.sent - stats.delivered) / totalRecipients) * 100}%` }} 
                                        className="h-full bg-blue-500 transition-all duration-500" 
                                        title={`In Transit: ${stats.sent - stats.delivered}`}
                                    />
                                    <div 
                                        style={{ width: `${(stats.failed / totalRecipients) * 100}%` }} 
                                        className="h-full bg-rose-500 transition-all duration-500" 
                                        title={`Failed: ${stats.failed}`}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#25D366]"></span> Read</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Delivered</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Sent</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Failed</span>
                            </div>
                            <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Two-Column: Template Snapshot + Recipient Tracking */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Template Snapshot (4 cols) */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                    Template Snapshot
                                </h4>
                                <div className="text-xs text-slate-400 space-y-1">
                                    <p><strong className="text-white">Template:</strong> {templateName}</p>
                                    <p><strong className="text-white">Category:</strong> {templateCategory}</p>
                                    {scheduledFor && (
                                        <p><strong className="text-white">Scheduled For:</strong> {new Date(scheduledFor).toLocaleString()} ({timezone})</p>
                                    )}
                                </div>
                            </div>

                            <WhatsAppTemplatePreview
                                template={templateSnapshot || {
                                    header: 'Broadcast Notice',
                                    body: 'Standard campaign broadcast template.',
                                    footer: 'Admissions Office'
                                }}
                                customVariables={renderedCustomVariables}
                                showHeader={true}
                            />
                        </div>

                        {/* Right Column: Recipient Tracking Table (8 cols) */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* Table Filters & Search */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111318] p-3 rounded-xl border border-[#2D333B]">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={recipientSearch}
                                        onChange={(e) => setRecipientSearch(e.target.value)}
                                        placeholder="Search recipients by name or phone..."
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={recipientStatusFilter}
                                        onChange={(e) => setRecipientStatusFilter(e.target.value)}
                                        className="bg-[#1C1F26] border border-[#2D333B] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#8B5CF6]"
                                    >
                                        <option value="All">All Statuses ({recipients.length})</option>
                                        <option value="Read">Read</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Sent">Sent</option>
                                        <option value="Failed">Failed ({failedCount})</option>
                                        <option value="Pending">Pending</option>
                                    </select>

                                    {failedCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleRetryAll}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all whitespace-nowrap"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            Retry All Failed ({failedCount})
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Recipient Tracking Table */}
                            <div className="border border-[#2D333B] rounded-xl overflow-hidden bg-[#111318]">
                                <div className="overflow-x-auto max-h-[380px]">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#1C1F26] text-slate-400 border-b border-[#2D333B] sticky top-0 z-10 text-[11px]">
                                            <tr>
                                                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                                                <th className="py-2.5 px-3 font-semibold">WhatsApp Number</th>
                                                <th className="py-2.5 px-3 font-semibold">Delivery Status</th>
                                                <th className="py-2.5 px-3 font-semibold">Timestamp / Telemetry</th>
                                                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2D333B]/40">
                                            {filteredRecipients.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                                                        No recipients match the selected criteria.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRecipients.map((r) => {
                                                    const isRetrying = retryingPhone === r.phone;
                                                    return (
                                                        <tr key={r.id || r.phone} className="hover:bg-[#1C1F26]/40 transition-colors">
                                                            <td className="py-2.5 px-3 font-medium text-white">
                                                                {r.name}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                                                                {r.phone}
                                                            </td>
                                                            <td className="py-2.5 px-3 whitespace-nowrap">
                                                                {r.status === 'Read' && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                                                                        <CheckCheck className="w-3.5 h-3.5" /> Read
                                                                    </span>
                                                                )}
                                                                {r.status === 'Delivered' && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                                                        <CheckCheck className="w-3.5 h-3.5" /> Delivered
                                                                    </span>
                                                                )}
                                                                {r.status === 'Sent' && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                                        <Check className="w-3.5 h-3.5" /> Sent
                                                                    </span>
                                                                )}
                                                                {r.status === 'Failed' && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                                                        <AlertTriangle className="w-3.5 h-3.5" /> Failed
                                                                    </span>
                                                                )}
                                                                {r.status === 'Pending' && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                                                        <Clock className="w-3.5 h-3.5" /> Pending
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-[11px]">
                                                                {r.status === 'Failed' ? (
                                                                    <span className="text-rose-400 font-medium">
                                                                        {r.errorReason || 'Undelivered (Number issue)'}
                                                                    </span>
                                                                ) : r.readAt ? (
                                                                    <span className="text-slate-400">Read at {r.readAt}</span>
                                                                ) : r.deliveredAt ? (
                                                                    <span className="text-slate-400">Delivered at {r.deliveredAt}</span>
                                                                ) : r.sentAt ? (
                                                                    <span className="text-slate-400">Sent at {r.sentAt}</span>
                                                                ) : (
                                                                    <span className="text-slate-500 italic">Waiting in queue</span>
                                                                )}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-right">
                                                                {r.status === 'Failed' && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRetrySingle(r.phone)}
                                                                        disabled={isRetrying}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[11px] font-medium transition-all"
                                                                    >
                                                                        <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                                                                        Retry
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Close */}
                <div className="px-6 py-3 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Campaign ID: <strong className="text-slate-400 font-mono">{id}</strong> &bull; Total Telemetry Records: {recipients.length}
                    </span>
                    <button
                        type="button"
                        onClick={closeDetailsModal}
                        className="px-5 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-white transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailsModal;
