import React, { useState, useMemo } from 'react';
import { 
    Sparkles, Calendar, Clock, Plus, Play, Pause, 
    Copy, Trash2, Edit3, Eye, Search, CheckCircle2, 
    AlertTriangle, Send, X, ArrowUpRight, Flame, Layers
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import FestivalCampaignModal from './FestivalCampaignModal';

const FestivalAutomationSection = () => {
    const { 
        festivals, 
        festivalPresets, 
        executionHistory, 
        openFestivalModal, 
        deleteFestivalCampaign, 
        duplicateFestivalCampaign, 
        sendFestivalNow, 
        updateFestivalDate 
    } = useWhatsAppAutomationStore();

    const [selectedYear, setSelectedYear] = useState('2026');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPresetDate, setEditingPresetDate] = useState(null); // { presetId, year, date }
    const [tempDate, setTempDate] = useState('');

    // Telemetry calculations
    const totalFestivals = festivals.length;
    const scheduledCount = festivals.filter(f => f.status === 'Scheduled').length;
    const completedCount = festivals.filter(f => f.status === 'Completed').length;

    let totalRecipientsReached = 0;
    let totalMessagesDelivered = 0;
    festivals.forEach(f => {
        if (f.status === 'Completed') {
            totalRecipientsReached += (f.totalRecipients || 0);
            totalMessagesDelivered += (f.stats?.delivered || 0);
        }
    });

    // Filter festivals
    const filteredFestivals = useMemo(() => {
        return festivals.filter(f => {
            if (selectedYear !== 'All' && f.year !== selectedYear) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = (f.name || '').toLowerCase().includes(q);
                const matchesFest = (f.festivalName || '').toLowerCase().includes(q);
                const matchesAud = (f.audienceGroup || '').toLowerCase().includes(q);
                if (!matchesName && !matchesFest && !matchesAud) return false;
            }
            return true;
        });
    }, [festivals, selectedYear, searchQuery]);

    // Festival execution history
    const festivalHistory = useMemo(() => {
        return executionHistory.filter(h => 
            h.automationName?.toLowerCase().includes('festival') || 
            h.automationName?.toLowerCase().includes('diwali') || 
            h.automationName?.toLowerCase().includes('dussehra') || 
            h.automationName?.toLowerCase().includes('new year') ||
            h.automationName?.toLowerCase().includes('holi') ||
            h.triggerType === 'SCHEDULE_ONCE'
        );
    }, [executionHistory]);

    const handleSaveCustomPresetDate = () => {
        if (!editingPresetDate || !tempDate) return;
        updateFestivalDate(editingPresetDate.presetId, editingPresetDate.year, tempDate);
        setEditingPresetDate(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16181D] p-5 rounded-2xl border border-[#2D333B]">
                <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#F59E0B]/30 border border-[#8B5CF6]/40 text-[#F59E0B] flex items-center justify-center shrink-0">
                        <Flame className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">Festival Broadcast Engine</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                Diwali &amp; Dussehra Enabled
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Multi-Year Calendar
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            Broadcast seasonal greetings to applicants on festival dates. Because lunar celebration dates change each calendar year, dates are fully configurable per year.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => openFestivalModal()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Create Festival Campaign
                    </button>
                </div>
            </div>

            {/* Metric Cards (5 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Festival Campaigns</span>
                    <p className="text-xl font-bold text-white mt-1">{totalFestivals}</p>
                    <span className="text-[10px] text-slate-500">All calendar years</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled
                    </span>
                    <p className="text-xl font-bold text-purple-400 mt-1">{scheduledCount}</p>
                    <span className="text-[10px] text-slate-500">Upcoming festivals</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{completedCount}</p>
                    <span className="text-[10px] text-slate-500">Delivered campaigns</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold">Recipients Reached</span>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{totalRecipientsReached}</p>
                    <span className="text-[10px] text-slate-500">Contacts targeted</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-[#25D366] uppercase font-semibold">Messages Delivered</span>
                    <p className="text-xl font-bold text-[#25D366] mt-1">{totalMessagesDelivered}</p>
                    <span className="text-[10px] text-slate-500">WhatsApp receipts</span>
                </div>
            </div>

            {/* Prebuilt Festival Presets with Multi-Year Date Editor */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D333B] pb-3">
                    <div>
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                            Prebuilt Festivals &amp; Configurable Annual Dates
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Active calendar year: <strong className="text-white">{selectedYear}</strong>. Dates adapt to annual lunar calendars. Click "Edit Date" to adjust any festival's celebration date.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">View Year:</span>
                        {['2026', '2027', '2028'].map(year => (
                            <button
                                key={year}
                                type="button"
                                onClick={() => setSelectedYear(year)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    selectedYear === year
                                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                                        : 'bg-[#1C1F26] text-slate-400 hover:text-white border border-[#2D333B]'
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Festival Preset Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {festivalPresets.map(preset => {
                        const dateForYear = preset.yearlyDates[selectedYear] || `${selectedYear}-10-15`;
                        const isEditingThis = editingPresetDate?.presetId === preset.id && editingPresetDate?.year === selectedYear;

                        return (
                            <div key={preset.id} className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">{preset.name}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1F26] text-[#F59E0B] font-semibold border border-[#2D333B]">
                                        {preset.category}
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-400 line-clamp-2">
                                    {preset.description}
                                </p>

                                <div className="pt-2 border-t border-[#2D333B]/50 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                                            {selectedYear} Date:
                                        </span>
                                        {isEditingThis ? (
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <input
                                                    type="date"
                                                    value={tempDate}
                                                    onChange={(e) => setTempDate(e.target.value)}
                                                    className="bg-[#1C1F26] border border-[#8B5CF6] rounded px-1.5 py-0.5 text-white text-[11px] outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleSaveCustomPresetDate}
                                                    className="px-2 py-0.5 rounded bg-[#8B5CF6] text-white text-[10px] font-bold"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingPresetDate(null)}
                                                    className="p-0.5 text-slate-400 hover:text-white"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-semibold text-purple-300 font-mono">
                                                {new Date(dateForYear).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        )}
                                    </div>

                                    {!isEditingThis && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingPresetDate({ presetId: preset.id, year: selectedYear, date: dateForYear });
                                                    setTempDate(dateForYear);
                                                }}
                                                className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2"
                                            >
                                                Edit Date
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openFestivalModal({
                                                    festivalId: preset.id,
                                                    name: `${preset.name.split(' ')[0]} ${selectedYear} Broadcast`,
                                                    year: selectedYear,
                                                    celebrationDate: dateForYear,
                                                    audienceGroup: 'All Contacts',
                                                    variableMappings: [{ key: '1', customValue: `${preset.name.split(' ')[0]} ${selectedYear}` }]
                                                })}
                                                className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] font-semibold text-[11px] transition-colors"
                                            >
                                                Launch
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Festival Campaigns Listing Table */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search festival campaigns by name or audience..."
                            className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Filter Year:</span>
                        {['All', '2026', '2027', '2028'].map(year => (
                            <button
                                key={year}
                                type="button"
                                onClick={() => setSelectedYear(year)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    selectedYear === year
                                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                                        : 'bg-[#1C1F26] text-slate-400 hover:text-white border border-[#2D333B]'
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                                <tr>
                                    <th className="py-3.5 px-4 font-semibold">Festival Campaign</th>
                                    <th className="py-3.5 px-4 font-semibold">Celebration Date &amp; Year</th>
                                    <th className="py-3.5 px-4 font-semibold">Target Audience</th>
                                    <th className="py-3.5 px-4 font-semibold">WhatsApp Template</th>
                                    <th className="py-3.5 px-4 font-semibold">Status</th>
                                    <th className="py-3.5 px-4 font-semibold">Delivery Telemetry</th>
                                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/50">
                                {filteredFestivals.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500">
                                            No festival campaigns found for the selected criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFestivals.map(fest => {
                                        const {
                                            id,
                                            name,
                                            festivalName,
                                            year,
                                            celebrationDate,
                                            audienceGroup,
                                            totalRecipients,
                                            templateName,
                                            status,
                                            stats = { sent: 0, delivered: 0, read: 0, failed: 0 }
                                        } = fest;

                                        return (
                                            <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold text-white block">{name}</span>
                                                        <span className="text-[10px] text-[#F59E0B] font-semibold">{festivalName}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                    <div className="space-y-0.5">
                                                        <span className="text-purple-300 font-semibold flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-purple-400" />
                                                            {new Date(celebrationDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-slate-500 text-[10px]">Year {year}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="font-medium text-white">{audienceGroup}</span>
                                                    <span className="text-slate-500 text-[11px] block">({totalRecipients} contacts)</span>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                                                    {templateName}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                                                        status === 'Completed'
                                                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                            : status === 'Scheduled'
                                                                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                                                : 'bg-slate-800 text-slate-400 border-slate-700'
                                                    }`}>
                                                        {status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                                        {status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                                        {status}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 min-w-[140px]">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-slate-400">
                                                            <span>{stats.delivered} / {totalRecipients} delivered</span>
                                                            <span className="text-[#25D366]">{stats.read} read</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-[#1C1F26] rounded-full overflow-hidden flex">
                                                            <div 
                                                                style={{ width: `${totalRecipients > 0 ? (stats.delivered / totalRecipients) * 100 : 0}%` }} 
                                                                className="h-full bg-[#25D366]" 
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {status !== 'Completed' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => sendFestivalNow(id)}
                                                                title="Execute / Send Broadcast Now"
                                                                className="p-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 transition-colors"
                                                            >
                                                                <Play className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => openFestivalModal(fest)}
                                                            title="Edit Campaign"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => duplicateFestivalCampaign(id)}
                                                            title="Duplicate Campaign"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteFestivalCampaign(id)}
                                                            title="Delete Campaign"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
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

            {/* Festival Execution History Sub-table */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Recent Festival Automated Telemetry Logs
                    </h3>
                    <span className="text-[11px] text-slate-500">{festivalHistory.length} logs</span>
                </div>

                <div className="overflow-x-auto border border-[#2D333B] rounded-xl bg-[#111318]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#1C1F26] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-2.5 px-3 font-semibold">Festival Broadcast</th>
                                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                                <th className="py-2.5 px-3 font-semibold">Status</th>
                                <th className="py-2.5 px-3 font-semibold">Execution Timestamp</th>
                                <th className="py-2.5 px-3 font-semibold">Delivery Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {festivalHistory.slice(0, 5).map(h => (
                                <tr key={h.id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                    <td className="py-2.5 px-3 font-medium text-white">{h.automationName}</td>
                                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                                        {h.recipientName} ({h.recipientPhone})
                                    </td>
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                            h.status === 'Success' 
                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                        }`}>
                                            {h.status}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                        {new Date(h.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(h.executedAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">{h.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <FestivalCampaignModal />
        </div>
    );
};

export default FestivalAutomationSection;
