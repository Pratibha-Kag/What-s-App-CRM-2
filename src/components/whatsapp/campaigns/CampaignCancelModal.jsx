import React from 'react';
import { AlertCircle, Ban, X } from 'lucide-react';
import useWhatsAppCampaignStore from '../../../store/useWhatsAppCampaignStore';

const CampaignCancelModal = () => {
    const { 
        isCancelModalOpen, 
        campaignToCancel, 
        closeCancelModal, 
        cancelCampaign 
    } = useWhatsAppCampaignStore();

    if (!isCancelModalOpen || !campaignToCancel) return null;

    const handleCancel = () => {
        cancelCampaign(campaignToCancel.id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Ban className="w-5 h-5" />
                        </div>
                        <button
                            type="button"
                            onClick={closeCancelModal}
                            className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-white">Cancel Broadcast Campaign</h3>
                        <p className="text-xs text-slate-400">
                            Are you sure you want to cancel <strong className="text-white font-medium">"{campaignToCancel.name}"</strong>?
                        </p>
                    </div>

                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 space-y-1">
                        <p className="font-semibold flex items-center gap-1.5 text-amber-200">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            Stop Dispatch Queue
                        </p>
                        <p className="text-[11px] text-amber-300/80">
                            Any pending messages in the queue will be halted immediately. Messages already delivered to recipients cannot be recalled.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeCancelModal}
                            className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                            Keep Active
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-all shadow-lg shadow-amber-600/20"
                        >
                            Confirm Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCancelModal;
