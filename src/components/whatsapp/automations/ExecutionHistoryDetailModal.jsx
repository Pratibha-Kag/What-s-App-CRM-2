import React from 'react';
import { 
    X, CheckCircle2, AlertTriangle, ShieldCheck, 
    Calendar, User, FileText, Phone, Zap 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const ExecutionHistoryDetailModal = () => {
    const { 
        isHistoryDetailModalOpen, 
        selectedHistoryRecord, 
        closeHistoryDetailModal 
    } = useWhatsAppAutomationStore();

    if (!isHistoryDetailModalOpen || !selectedHistoryRecord) return null;

    const {
        id,
        automationName,
        triggerType,
        recipientName,
        recipientPhone,
        templateName,
        templateSnapshot,
        status,
        reason,
        executedAt,
        isTest,
        duplicateKey
    } = selectedHistoryRecord;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto text-white">
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            Execution Record Details
                            {isTest && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    Test Run
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{id}</p>
                    </div>
                    <button
                        type="button"
                        onClick={closeHistoryDetailModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    {/* Status badge banner */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        status === 'Success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : status === 'Skipped'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}>
                        <div className="flex items-center gap-2">
                            {status === 'Success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {status === 'Skipped' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                            {status === 'Failed' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                            <span className="font-bold text-sm">{status}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(executedAt).toLocaleTimeString()}
                        </span>
                    </div>

                    <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B] text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Execution Telemetry Note:</span>
                        <p className="text-xs">{reason}</p>
                    </div>

                    <div className="divide-y divide-[#2D333B]/50 bg-[#111318] p-4 rounded-xl border border-[#2D333B] space-y-2">
                        <div className="py-1 flex justify-between">
                            <span className="text-slate-400">Automation Rule:</span>
                            <span className="font-semibold text-white">{automationName}</span>
                        </div>
                        <div className="py-1 flex justify-between">
                            <span className="text-slate-400">Recipient Name:</span>
                            <span className="font-semibold text-white">{recipientName}</span>
                        </div>
                        <div className="py-1 flex justify-between">
                            <span className="text-slate-400">WhatsApp Phone:</span>
                            <span className="font-mono text-slate-300">{recipientPhone}</span>
                        </div>
                        <div className="py-1 flex justify-between">
                            <span className="text-slate-400">Trigger Type:</span>
                            <span className="font-semibold text-white">{triggerType}</span>
                        </div>
                        <div className="py-1 flex justify-between">
                            <span className="text-slate-400">Idempotency Key:</span>
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]" title={duplicateKey}>
                                {duplicateKey}
                            </span>
                        </div>
                    </div>

                    {/* Snapshot */}
                    {templateSnapshot && (
                        <div className="space-y-2">
                            <span className="text-slate-400 font-semibold text-[11px] uppercase">Message Snapshot Dispatched:</span>
                            <div className="p-3 rounded-xl bg-[#0B141A] border border-[#202C33] text-slate-200 text-xs">
                                {templateSnapshot.body}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-[#2D333B] bg-[#111318] flex justify-end">
                    <button
                        type="button"
                        onClick={closeHistoryDetailModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExecutionHistoryDetailModal;
