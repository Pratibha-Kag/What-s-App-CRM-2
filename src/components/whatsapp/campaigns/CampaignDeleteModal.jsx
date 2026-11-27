import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import useWhatsAppCampaignStore from '../../../store/useWhatsAppCampaignStore';

const CampaignDeleteModal = () => {
    const { 
        isDeleteModalOpen, 
        campaignToDelete, 
        closeDeleteModal, 
        deleteCampaign 
    } = useWhatsAppCampaignStore();

    if (!isDeleteModalOpen || !campaignToDelete) return null;

    const handleDelete = () => {
        deleteCampaign(campaignToDelete.id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-white">Delete Campaign Record</h3>
                        <p className="text-xs text-slate-400">
                            Are you sure you want to permanently delete <strong className="text-white font-medium">"{campaignToDelete.name}"</strong>?
                        </p>
                    </div>

                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 space-y-1">
                        <p className="font-semibold flex items-center gap-1.5 text-rose-200">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            Permanent Action Notice
                        </p>
                        <p className="text-[11px] text-rose-300/80">
                            This will remove all delivery stats, recipient tracking records ({campaignToDelete.totalRecipients || 0} contacts), and campaign history from this device.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-all shadow-lg shadow-rose-600/20"
                        >
                            Delete Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDeleteModal;
