import React from 'react';
import { 
    Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, 
    Eye, RefreshCw, X, ChevronLeft, ChevronRight, Clock 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';

const ExecutionHistoryTable = () => {
    const {
        executionHistory,
        automations,
        historySearchQuery,
        historyStatusFilter,
        historyAutomationFilter,
        historyPage,
        historyPageSize,
        setHistorySearchQuery,
        setHistoryStatusFilter,
        setHistoryAutomationFilter,
        setHistoryPage,
        openHistoryDetailModal,
        clearExecutionHistory
    } = useWhatsAppAutomationStore();

    // Filter execution history
    const filteredHistory = executionHistory.filter(h => {
        if (historyStatusFilter !== 'All') {
            if (historyStatusFilter === 'Test' && !h.isTest) return false;
            if (historyStatusFilter !== 'Test' && (h.status !== historyStatusFilter || h.isTest)) return false;
        }
        if (historyAutomationFilter !== 'All' && h.automationId !== historyAutomationFilter) {
            return false;
        }
        if (historySearchQuery.trim()) {
            const q = historySearchQuery.toLowerCase();
            const matchesName = (h.recipientName || '').toLowerCase().includes(q);
            const matchesPhone = (h.recipientPhone || '').toLowerCase().includes(q);
            const matchesAuto = (h.automationName || '').toLowerCase().includes(q);
            const matchesId = (h.id || '').toLowerCase().includes(q);
            if (!matchesName && !matchesPhone && !matchesAuto && !matchesId) return false;
        }
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPageSize));
    const paginated = filteredHistory.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                        placeholder="Search by recipient, phone, or execution ID..."
                        className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    {historySearchQuery && (
                        <button
                            type="button"
                            onClick={() => setHistorySearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                            value={historyStatusFilter}
                            onChange={(e) => setHistoryStatusFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]"
                        >
                            <option value="All">All Events ({executionHistory.length})</option>
                            <option value="Success">Success</option>
                            <option value="Skipped">Skipped (Duplicate Prevention)</option>
                            <option value="Failed">Failed</option>
                            <option value="Test">Test Runs</option>
                        </select>
                    </div>

                    {/* Automation Filter */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Rule:</span>
                        <select
                            value={historyAutomationFilter}
                            onChange={(e) => setHistoryAutomationFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6] max-w-[160px] truncate"
                        >
                            <option value="All">All Automations</option>
                            {automations.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-3.5 px-4 font-semibold">Execution ID &amp; Type</th>
                                <th className="py-3.5 px-4 font-semibold">Automation Rule</th>
                                <th className="py-3.5 px-4 font-semibold">Recipient</th>
                                <th className="py-3.5 px-4 font-semibold">Template</th>
                                <th className="py-3.5 px-4 font-semibold">Delivery Outcome</th>
                                <th className="py-3.5 px-4 font-semibold">Timestamp / Note</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        No execution logs match the selected filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(record => {
                                    const {
                                        id,
                                        automationName,
                                        triggerType,
                                        recipientName,
                                        recipientPhone,
                                        templateName,
                                        status,
                                        reason,
                                        executedAt,
                                        isTest
                                    } = record;

                                    return (
                                        <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span className="font-mono text-slate-300 font-medium block">
                                                        {id.split('-').slice(0, 2).join('-')}
                                                    </span>
                                                    {isTest ? (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                            Test Run
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-500 font-mono">
                                                            {triggerType}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                                                {automationName}
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span className="font-medium text-slate-200 block">{recipientName}</span>
                                                    <span className="text-slate-500 font-mono text-[11px]">{recipientPhone}</span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                                                {templateName}
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {status === 'Success' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        <CheckCircle2 className="w-3 h-3" /> Success
                                                    </span>
                                                )}
                                                {status === 'Skipped' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                        <ShieldCheck className="w-3 h-3" /> Skipped (Duplicate)
                                                    </span>
                                                )}
                                                {status === 'Failed' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                                        <AlertTriangle className="w-3 h-3" /> Failed
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 max-w-xs">
                                                <div className="space-y-0.5">
                                                    <span className="text-slate-400 text-[11px] block">
                                                        {new Date(executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(executedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-slate-500 text-[10px] line-clamp-1" title={reason}>
                                                        {reason}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openHistoryDetailModal(record)}
                                                    className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                    title="View Execution Details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredHistory.length > 0 && (
                    <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between text-xs text-slate-400">
                        <div>
                            Showing <strong>{Math.min(filteredHistory.length, (historyPage - 1) * historyPageSize + 1)}</strong> to{' '}
                            <strong>{Math.min(filteredHistory.length, historyPage * historyPageSize)}</strong> of{' '}
                            <strong>{filteredHistory.length}</strong> records
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setHistoryPage(Math.max(1, historyPage - 1))}
                                disabled={historyPage === 1}
                                className={`p-1.5 rounded-lg border border-[#2D333B] ${historyPage === 1 ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-white px-2">Page {historyPage} of {totalPages}</span>
                            <button
                                type="button"
                                onClick={() => setHistoryPage(Math.min(totalPages, historyPage + 1))}
                                disabled={historyPage === totalPages}
                                className={`p-1.5 rounded-lg border border-[#2D333B] ${historyPage === totalPages ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExecutionHistoryTable;
