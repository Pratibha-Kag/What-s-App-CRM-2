import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Clock, Copy, Edit, Send, Sparkles, Globe, Tag } from 'lucide-react';
import WhatsAppTemplatePreview from './WhatsAppTemplatePreview';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import { toast } from '../../ui/Toast';

const WhatsAppTemplatePreviewModal = () => {
    const { 
        selectedTemplate, 
        isPreviewModalOpen, 
        closePreviewModal, 
        openCreateModal, 
        duplicateTemplate,
        submitForApproval,
        simulateApproval,
        simulateRejection
    } = useWhatsAppTemplateStore();

    if (!isPreviewModalOpen || !selectedTemplate) return null;

    const tpl = selectedTemplate;

    const handleDuplicate = () => {
        duplicateTemplate(tpl.id);
        toast.success(`Duplicated "${tpl.title || tpl.name}" as new Draft.`);
        closePreviewModal();
    };

    const handleSubmit = () => {
        submitForApproval(tpl.id);
        toast.info(`Submitted "${tpl.title || tpl.name}" for Meta review.`);
        closePreviewModal();
    };

    const handleApprove = () => {
        simulateApproval(tpl.id);
        toast.success(`Simulated approval: "${tpl.title || tpl.name}" is now Approved.`);
        closePreviewModal();
    };

    const handleReject = () => {
        simulateRejection(tpl.id);
        toast.warning(`Simulated rejection: "${tpl.title || tpl.name}" rejected.`);
        closePreviewModal();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><CheckCircle2 size={13} /> Approved</span>;
            case 'Pending':
                return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Clock size={13} className="animate-spin" /> In Review (Pending)</span>;
            case 'Rejected':
                return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><AlertCircle size={13} /> Rejected</span>;
            default:
                return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">Draft</span>;
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#16181D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center font-bold">
                                WA
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">{tpl.title || tpl.name}</h2>
                                <p className="text-xs text-slate-400 font-mono">{tpl.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {getStatusBadge(tpl.status)}
                            <button
                                onClick={closePreviewModal}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Rejection Alert Banner */}
                    {tpl.status === 'Rejected' && tpl.rejectionReason && (
                        <div className="bg-rose-500/10 border-b border-rose-500/20 p-4 text-xs text-rose-300 flex items-start gap-3">
                            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bold text-white">Rejection Reason from WhatsApp Review:</p>
                                <p className="leading-relaxed text-rose-200">{tpl.rejectionReason}</p>
                            </div>
                        </div>
                    )}

                    {/* Modal Body: Split Details & WhatsApp Preview */}
                    <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111318]">
                        {/* Left: Template Attributes & Variables */}
                        <div className="space-y-4">
                            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-xl p-4 space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Tag size={13} className="text-[#8B5CF6]" /> Template Attributes
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center py-1 border-b border-[#2D333B]/50">
                                        <span className="text-slate-400">Category:</span>
                                        <span className="font-bold text-white bg-[#111318] px-2 py-0.5 rounded border border-[#2D333B]">{tpl.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-[#2D333B]/50">
                                        <span className="text-slate-400">Language:</span>
                                        <span className="font-bold text-white flex items-center gap-1"><Globe size={12} className="text-slate-400" /> {tpl.language}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-[#2D333B]/50">
                                        <span className="text-slate-400">Buttons:</span>
                                        <span className="font-bold text-white">{tpl.buttons?.length || 0} Action Button(s)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-slate-400">Updated:</span>
                                        <span className="font-mono text-slate-300">{new Date(tpl.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Configured Sample Variables */}
                            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-xl p-4 space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Configured Variables ({tpl.variables?.length || 0})
                                </h3>
                                {tpl.variables && tpl.variables.length > 0 ? (
                                    <div className="space-y-2">
                                        {tpl.variables.map((v) => (
                                            <div key={v.key} className="bg-[#111318] border border-[#2D333B] p-2 rounded-lg text-xs flex justify-between items-center">
                                                <span className="font-mono text-[#8B5CF6] font-bold">{`{{${v.key}}}`} <span className="text-slate-400 font-sans font-normal ml-1">({v.name})</span></span>
                                                <span className="font-medium text-slate-200 bg-[#1C1F26] px-2 py-0.5 rounded border border-[#2D333B]">{v.sample}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500">No dynamic placeholders in this template.</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Realistic WhatsApp Chat Preview */}
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live WhatsApp Recipient View</span>
                            <WhatsAppTemplatePreview template={tpl} />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[#2D333B] bg-[#16181D] flex flex-wrap items-center justify-between gap-3">
                        {/* Demo Approval Controls for In Review Templates */}
                        {tpl.status === 'Pending' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-400" /> Demo Reviewer:
                                </span>
                                <button
                                    onClick={handleApprove}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                                >
                                    <CheckCircle2 size={13} /> Simulate Approve
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                                >
                                    <AlertCircle size={13} /> Simulate Reject
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {tpl.status !== 'Approved' && (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/20 active:scale-95 flex items-center gap-1.5"
                                    >
                                        <Send size={13} /> Submit for Approval
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Standard Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDuplicate}
                                className="px-3 py-2 rounded-xl border border-[#2D333B] text-slate-300 hover:text-white hover:bg-[#2D333B] text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                                <Copy size={13} /> Duplicate
                            </button>

                            <button
                                onClick={() => {
                                    closePreviewModal();
                                    openCreateModal(tpl);
                                }}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                                <Edit size={13} /> Edit Template
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WhatsAppTemplatePreviewModal;
