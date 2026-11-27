import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import { toast } from '../../ui/Toast';

const WhatsAppTemplateDeleteModal = () => {
    const { 
        isDeleteModalOpen, 
        closeDeleteModal, 
        templateToDelete, 
        deleteTemplate 
    } = useWhatsAppTemplateStore();

    if (!isDeleteModalOpen || !templateToDelete) return null;

    const handleConfirm = () => {
        deleteTemplate(templateToDelete.id);
        toast.info(`Template "${templateToDelete.title || templateToDelete.name}" deleted.`);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-[#1C1F26] border border-rose-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white flex flex-col"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#16181D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Delete Message Template?</h2>
                                <p className="text-xs text-rose-400 font-medium">Permanent Action</p>
                            </div>
                        </div>
                        <button
                            onClick={closeDeleteModal}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="p-3.5 bg-[#111318] border border-[#2D333B] rounded-xl flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold text-xs shrink-0">
                                {templateToDelete.category.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white truncate">{templateToDelete.title || templateToDelete.name}</p>
                                <p className="text-xs text-slate-400 font-mono truncate">{templateToDelete.name}</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            Are you sure you want to delete this WhatsApp message template? Future automated campaigns or scheduled reminders referencing this template ID will fail.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-[#2D333B] bg-[#16181D] flex items-center justify-end gap-2.5">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Trash2 size={14} /> Confirm Delete
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WhatsAppTemplateDeleteModal;
