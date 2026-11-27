import React from 'react';
import { X, History, Sparkles, BrainCircuit, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import useWhatsAppSalesAgentStore from '../../../store/useWhatsAppSalesAgentStore';

const ActivityDetailModal = () => {
    const { selectedActivityForDetail, setSelectedActivityForDetail } = useWhatsAppSalesAgentStore();

    if (!selectedActivityForDetail) return null;

    const act = selectedActivityForDetail;
    const isKimi = act.provider?.includes('Kimi');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
                
                {/* Header */}
                <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#1C1F26]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                Activity Record #{act.id}
                            </h2>
                            <p className="text-xs text-slate-400">{new Date(act.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedActivityForDetail(null)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 bg-[#16181D]">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Activity Type</span>
                            <p className="text-white font-semibold mt-0.5">{act.activityType}</p>
                        </div>
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Status</span>
                            <p className="text-emerald-400 font-semibold mt-0.5">{act.status}</p>
                        </div>
                    </div>

                    <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">AI Provider Engine</span>
                        <div className="flex items-center gap-2 font-bold text-white pt-0.5">
                            {isKimi ? (
                                <BrainCircuit className="w-4 h-4 text-[#6366F1]" />
                            ) : (
                                <Sparkles className="w-4 h-4 text-[#10A37F]" />
                            )}
                            {act.provider}
                        </div>
                    </div>

                    <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Conversation / Context</span>
                        <p className="text-white font-semibold">{act.conversationName}</p>
                    </div>

                    <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Activity Log Details</span>
                        <p className="text-slate-300 leading-relaxed pt-0.5">{act.details}</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setSelectedActivityForDetail(null)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#1C1F26] border border-[#2D333B]"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActivityDetailModal;
