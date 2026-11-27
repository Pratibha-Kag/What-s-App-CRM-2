import React from 'react';
import { 
    X, Zap, Clock, Users, FileText, CheckCircle2, 
    Play, Pause, Trash2, Edit3, ArrowRight, ShieldCheck 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const AutomationDetailsModal = () => {
    const { 
        isDetailsModalOpen, 
        selectedAutomation, 
        closeDetailsModal, 
        openBuilder, 
        openTestModal, 
        toggleStatus 
    } = useWhatsAppAutomationStore();

    if (!isDetailsModalOpen || !selectedAutomation) return null;

    const {
        id,
        name,
        description,
        type,
        triggerType,
        conditions = {},
        audienceConfig = {},
        templateName,
        templateCategory,
        templateSnapshot,
        schedule = {},
        status,
        stats = { totalRuns: 0, success: 0, failed: 0, skipped: 0 },
        createdAt
    } = selectedAutomation;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-white">{name}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                    status === 'Active'
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : status === 'Paused'
                                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                            : status === 'Draft'
                                                ? 'bg-slate-700 text-slate-300 border-slate-600'
                                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}>
                                    {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1C1F26] text-slate-400 border border-[#2D333B]">
                                    {type}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{description || 'Automated customer trigger workflow.'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                closeDetailsModal();
                                openTestModal(selectedAutomation);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white transition-all shadow-sm"
                        >
                            <Play className="w-3.5 h-3.5" />
                            Run Test
                        </button>

                        <button
                            type="button"
                            onClick={() => toggleStatus(id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                                status === 'Active'
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            }`}
                        >
                            {status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {status === 'Active' ? 'Pause' : 'Resume'}
                        </button>

                        <button
                            type="button"
                            onClick={closeDetailsModal}
                            className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Telemetry row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Runs</span>
                            <p className="text-xl font-bold text-white mt-0.5">{stats.totalRuns}</p>
                            <span className="text-[10px] text-slate-500">Evaluations</span>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Successful
                            </span>
                            <p className="text-xl font-bold text-emerald-400 mt-0.5">{stats.success}</p>
                            <span className="text-[10px] text-slate-400">Delivered</span>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <span className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Skipped (Duplicates)
                            </span>
                            <p className="text-xl font-bold text-amber-400 mt-0.5">{stats.skipped}</p>
                            <span className="text-[10px] text-slate-400">Prevented</span>
                        </div>
                        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <span className="text-[10px] text-rose-400 uppercase font-semibold">Failed</span>
                            <p className="text-xl font-bold text-rose-400 mt-0.5">{stats.failed}</p>
                            <span className="text-[10px] text-slate-400">Errors flagged</span>
                        </div>
                    </div>

                    {/* Rule Overview & Template Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                Trigger &amp; Schedule Details
                            </h4>
                            <div className="divide-y divide-[#2D333B]/50 space-y-1">
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Trigger Type:</span>
                                    <span className="font-semibold text-white">{triggerType}</span>
                                </div>
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Target Group:</span>
                                    <span className="font-semibold text-white">{audienceConfig.group || 'All Contacts'}</span>
                                </div>
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Schedule Frequency:</span>
                                    <span className="font-semibold text-white">{schedule.frequency || 'Event-driven'}</span>
                                </div>
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Timezone:</span>
                                    <span className="font-semibold text-white">{schedule.timezone || 'GMT+5:30 (IST)'}</span>
                                </div>
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Next Occurrence:</span>
                                    <span className="font-semibold text-[#8B5CF6] font-mono">{schedule.nextExecutionAt || 'On Trigger'}</span>
                                </div>
                                <div className="py-1.5 flex justify-between">
                                    <span className="text-slate-400">Template Used:</span>
                                    <span className="font-semibold text-[#25D366]">{templateName} ({templateCategory})</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[#25D366]" />
                                Message Template Preview
                            </h4>
                            <WhatsAppTemplatePreview
                                template={templateSnapshot || {
                                    header: 'Automated Notice',
                                    body: 'Standard automated trigger message.'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between text-xs text-slate-500">
                    <span>ID: <strong className="font-mono text-slate-400">{id}</strong> &bull; Created {new Date(createdAt).toLocaleDateString()}</span>
                    <button
                        type="button"
                        onClick={closeDetailsModal}
                        className="px-4 py-1.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutomationDetailsModal;
