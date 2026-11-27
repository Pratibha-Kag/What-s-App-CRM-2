import React, { useState } from 'react';
import { 
    BarChart3, Check, CheckCheck, AlertCircle, ArrowDownLeft, 
    ArrowUpRight, MessageSquare, ChevronDown, ChevronUp, Layers, RefreshCw
} from 'lucide-react';
import useWhatsAppStore from '../../store/useWhatsAppStore';

const WhatsAppStatsBar = () => {
    const { getStats, isStatsOpen, setIsStatsOpen, selectedConvId } = useWhatsAppStore();
    const [scope, setScope] = useState('all'); // 'all' | 'current'

    const stats = getStats(scope === 'current');

    if (!isStatsOpen) {
        return (
            <div className="bg-[#16181D] border-b border-[#1E232B] px-4 py-1.5 flex items-center justify-between shrink-0 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-white flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-[#8B5CF6]" />
                        Message Tracking Telemetry
                    </span>
                    <span className="text-[11px] bg-[#1C1F26] px-2 py-0.5 rounded border border-[#2D333B] text-slate-300">
                        Total: <strong className="text-white">{stats.total}</strong>
                    </span>
                    <span className="text-[11px] text-emerald-400">
                        Read: <strong>{stats.read}</strong>
                    </span>
                    {stats.failed > 0 && (
                        <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                            <AlertCircle size={12} /> {stats.failed} Failed
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsStatsOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#8B5CF6] hover:text-[#A855F7] transition-colors"
                >
                    Expand Metrics <ChevronDown size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#16181D] border-b border-[#1E232B] px-4 py-2 shrink-0 transition-all duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left Title & Scope Switcher */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                        <BarChart3 size={15} className="text-[#8B5CF6]" />
                        <span className="text-xs font-bold text-white tracking-wide">Delivery Telemetry</span>
                    </div>

                    <div className="flex items-center bg-[#111318] p-0.5 rounded-lg border border-[#2D333B]">
                        <button
                            onClick={() => setScope('all')}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                                scope === 'all'
                                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            All Chats
                        </button>
                        <button
                            onClick={() => setScope('current')}
                            disabled={!selectedConvId}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                                scope === 'current'
                                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white disabled:opacity-40'
                            }`}
                        >
                            Active Chat
                        </button>
                    </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Total */}
                    <div className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg">
                        <MessageSquare size={13} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-xs font-black text-white ml-0.5">{stats.total}</span>
                    </div>

                    {/* Incoming */}
                    <div className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg">
                        <ArrowDownLeft size={13} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In</span>
                        <span className="text-xs font-black text-emerald-400 ml-0.5">{stats.incoming}</span>
                    </div>

                    {/* Outgoing */}
                    <div className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg">
                        <ArrowUpRight size={13} className="text-purple-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out</span>
                        <span className="text-xs font-black text-purple-400 ml-0.5">{stats.outgoing}</span>
                    </div>

                    {/* Sent (Single Tick) */}
                    <div 
                        className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg"
                        title="Sent to WhatsApp Server (Single Tick)"
                    >
                        <Check size={13} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sent</span>
                        <span className="text-xs font-black text-slate-200 ml-0.5">{stats.sent}</span>
                    </div>

                    {/* Delivered (Double Tick) */}
                    <div 
                        className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg"
                        title="Delivered to Recipient Device (Double Tick)"
                    >
                        <CheckCheck size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivered</span>
                        <span className="text-xs font-black text-slate-200 ml-0.5">{stats.delivered}</span>
                    </div>

                    {/* Read (Colored Double Tick) */}
                    <div 
                        className="flex items-center gap-1.5 bg-[#1C1F26] border border-[#2D333B] px-2.5 py-1 rounded-lg"
                        title="Read by Recipient (Colored Double Tick)"
                    >
                        <CheckCheck size={14} className="text-cyan-400" />
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Read</span>
                        <span className="text-xs font-black text-cyan-400 ml-0.5">{stats.read}</span>
                    </div>

                    {/* Failed */}
                    <div 
                        className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-lg transition-colors ${
                            stats.failed > 0
                                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                                : 'bg-[#1C1F26] border-[#2D333B] text-slate-500'
                        }`}
                        title="Failed to deliver (Clickable retry available)"
                    >
                        <AlertCircle size={13} className={stats.failed > 0 ? 'text-rose-400' : 'text-slate-500'} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Failed</span>
                        <span className="text-xs font-black ml-0.5">{stats.failed}</span>
                    </div>
                </div>

                {/* Right: Collapse toggle */}
                <button
                    onClick={() => setIsStatsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1C1F26] transition-colors"
                    title="Collapse metrics bar"
                >
                    <ChevronUp size={14} />
                </button>
            </div>
        </div>
    );
};

export default WhatsAppStatsBar;
