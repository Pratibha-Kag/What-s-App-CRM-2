import React, { useState, useMemo } from 'react';
import { 
    Zap, Plus, Search, Filter, Clock, CheckCircle2, 
    AlertTriangle, Play, Pause, Copy, Trash2, Eye, 
    Sparkles, ChevronLeft, ChevronRight, History, 
    ShieldCheck, Calendar, Sliders, X, Radio, ArrowUpRight,
    Cake, Flame, CalendarClock
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../store/useWhatsAppAutomationStore';
import AutomationRuleBuilderModal from '../../components/whatsapp/automations/AutomationRuleBuilderModal';
import AutomationTestRunModal from '../../components/whatsapp/automations/AutomationTestRunModal';
import AutomationDetailsModal from '../../components/whatsapp/automations/AutomationDetailsModal';
import AutomationDeleteModal from '../../components/whatsapp/automations/AutomationDeleteModal';
import ExecutionHistoryDetailModal from '../../components/whatsapp/automations/ExecutionHistoryDetailModal';
import ExecutionHistoryTable from '../../components/whatsapp/automations/ExecutionHistoryTable';
import BirthdayAutomationSection from '../../components/whatsapp/automations/BirthdayAutomationSection';
import FestivalAutomationSection from '../../components/whatsapp/automations/FestivalAutomationSection';
import AppointmentAutomationSection from '../../components/whatsapp/automations/AppointmentAutomationSection';

const AutomationsPage = () => {
    const {
        automations,
        activeTab,
        setActiveTab,
        searchQuery,
        statusFilter,
        typeFilter,
        currentPage,
        pageSize,
        setSearchQuery,
        setStatusFilter,
        setTypeFilter,
        setCurrentPage,
        openBuilder,
        openDetailsModal,
        openDeleteModal,
        openTestModal,
        toggleStatus,
        duplicateAutomation,
        triggerEvent,
        getOverallStats,
        presets
    } = useWhatsAppAutomationStore();

    const [isTriggerMenuOpen, setIsTriggerMenuOpen] = useState(false);
    const [simulatedFeedback, setSimulatedFeedback] = useState(null);

    const stats = getOverallStats();

    // Filter automations
    const filteredAutomations = useMemo(() => {
        return automations.filter(a => {
            if (statusFilter !== 'All' && a.status !== statusFilter) return false;
            if (typeFilter !== 'All' && a.type !== typeFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = (a.name || '').toLowerCase().includes(q);
                const matchesDesc = (a.description || '').toLowerCase().includes(q);
                const matchesTpl = (a.templateName || '').toLowerCase().includes(q);
                const matchesType = (a.type || '').toLowerCase().includes(q);
                if (!matchesName && !matchesDesc && !matchesTpl && !matchesType) return false;
            }
            return true;
        });
    }, [automations, statusFilter, typeFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredAutomations.length / pageSize));
    const paginated = filteredAutomations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Quick Trigger Demo Simulation
    const handleSimulateExternalTrigger = (eventCode, label) => {
        setIsTriggerMenuOpen(false);
        const results = triggerEvent(eventCode, {
            eventId: `evt-${Date.now()}`,
            timestamp: new Date().toISOString()
        });

        setSimulatedFeedback({
            label,
            eventCode,
            count: results.length
        });

        setTimeout(() => setSimulatedFeedback(null), 4000);
    };

    return (
        <div className="min-h-screen bg-[#111318] text-white p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Core Engine
                        </span>
                        <span className="text-xs text-slate-500 font-mono">Developer 1 Module &bull; Phases 4–7 Ready</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <Zap className="w-6 h-6 text-[#8B5CF6]" />
                        Common Automation &amp; Trigger Engine
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        Universal event-driven and recurring trigger engine for WhatsApp CRM. Powers automated birthday wishes, festival greetings, appointment alerts, and tuition payment milestones.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Simulated Webhook Trigger Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsTriggerMenuOpen(!isTriggerMenuOpen)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
                        >
                            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                            Simulate External Trigger
                        </button>

                        {isTriggerMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-[#16181D] border border-[#2D333B] rounded-xl shadow-2xl p-2 z-30 text-xs space-y-1">
                                <p className="px-2.5 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                    Simulate Webhook Event:
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleSimulateExternalTrigger('crm.appointment_rescheduled', 'Counseling Rescheduled')}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#1C1F26] text-slate-300 hover:text-white transition-colors"
                                >
                                    Appointment Rescheduled
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSimulateExternalTrigger('crm.appointment_cancelled', 'Counseling Cancelled')}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#1C1F26] text-slate-300 hover:text-white transition-colors"
                                >
                                    Appointment Cancelled
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSimulateExternalTrigger('crm.payment_received', 'Payment Received')}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#1C1F26] text-slate-300 hover:text-white transition-colors"
                                >
                                    Tuition Payment Received
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Create Automation CTA */}
                    <button
                        type="button"
                        onClick={() => openBuilder()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Create Automation
                    </button>
                </div>
            </div>

            {/* Simulated Trigger Feedback Toast */}
            {simulatedFeedback && (
                <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>
                            Simulated trigger <strong>{simulatedFeedback.label}</strong> executed! Generated <strong>{simulatedFeedback.count}</strong> execution telemetry logs.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className="text-xs underline font-semibold text-blue-200 hover:text-white ml-3"
                    >
                        View in Execution History &rarr;
                    </button>
                </div>
            )}

            {/* Aggregated Metric Cards (6 Primary Telemetry Counters) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Automations</span>
                    <p className="text-xl font-bold text-white mt-1">{stats.totalAutomations}</p>
                    <span className="text-[10px] text-slate-500">Configured rules</span>
                </div>
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{stats.activeAutomations}</p>
                    <span className="text-[10px] text-slate-500">Listening to events</span>
                </div>
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">Paused</span>
                    <p className="text-xl font-bold text-amber-400 mt-1">{stats.pausedAutomations}</p>
                    <span className="text-[10px] text-slate-500">Inactive</span>
                </div>
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled
                    </span>
                    <p className="text-xl font-bold text-purple-400 mt-1">{stats.scheduledExecutions}</p>
                    <span className="text-[10px] text-slate-500">Recurring queues</span>
                </div>
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-[#25D366] uppercase font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Successful Runs
                    </span>
                    <p className="text-xl font-bold text-[#25D366] mt-1">{stats.successfulExecutions}</p>
                    <span className="text-[10px] text-slate-500">Dispatched logs</span>
                </div>
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold">Failed Runs</span>
                    <p className="text-xl font-bold text-rose-400 mt-1">{stats.failedExecutions}</p>
                    <span className="text-[10px] text-slate-500">Flagged errors</span>
                </div>
            </div>

            {/* Tab Navigation: Rules vs Birthday vs Festival vs Execution History */}
            <div className="flex border-b border-[#2D333B] overflow-x-auto">
                <button
                    type="button"
                    onClick={() => setActiveTab('rules')}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'rules' || activeTab === 'automations'
                            ? 'border-[#8B5CF6] text-white bg-[#16181D]/40'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Zap className="w-4 h-4 text-[#8B5CF6]" />
                    Automation Rules ({automations.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('birthday')}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'birthday'
                            ? 'border-[#EC4899] text-white bg-[#16181D]/40'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Cake className="w-4 h-4 text-[#EC4899]" />
                    Birthday Automation
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30">
                        Phase 5
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('festival')}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'festival'
                            ? 'border-[#F59E0B] text-white bg-[#16181D]/40'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Flame className="w-4 h-4 text-[#F59E0B]" />
                    Festival Automation
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                        Diwali &amp; Dussehra
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('appointments')}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'appointments'
                            ? 'border-indigo-400 text-white bg-[#16181D]/40'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <CalendarClock className="w-4 h-4 text-indigo-400" />
                    Appointment Automation
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        Phase 6
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'history'
                            ? 'border-cyan-400 text-white bg-[#16181D]/40'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <History className="w-4 h-4 text-cyan-400" />
                    Execution History &amp; Duplicate Logs
                </button>
            </div>

            {/* TAB 1: COMMON AUTOMATION RULES */}
            {(activeTab === 'rules' || activeTab === 'automations') && (
                <div className="space-y-4">
                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search automations by name, template, or category..."
                                className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400">Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Disabled">Disabled</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400">Preset:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6] max-w-[150px] truncate"
                                >
                                    <option value="All">All Presets</option>
                                    <option value="birthday">Birthday Wishes</option>
                                    <option value="festival">Festival Greetings</option>
                                    <option value="appointment_reminder">Appointment Reminder</option>
                                    <option value="appointment_reschedule">Appointment Rescheduled</option>
                                    <option value="payment_reminder">Payment Reminder</option>
                                    <option value="custom">Custom Engine</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Automations Table */}
                    <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                                    <tr>
                                        <th className="py-3.5 px-4 font-semibold">Automation Rule</th>
                                        <th className="py-3.5 px-4 font-semibold">Trigger Configuration</th>
                                        <th className="py-3.5 px-4 font-semibold">Selected Template</th>
                                        <th className="py-3.5 px-4 font-semibold">Schedule &amp; Next Run</th>
                                        <th className="py-3.5 px-4 font-semibold">Status</th>
                                        <th className="py-3.5 px-4 font-semibold">Telemetry Runs</th>
                                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D333B]/50">
                                    {paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-14 text-center text-slate-500">
                                                <div className="max-w-sm mx-auto space-y-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center mx-auto text-slate-500">
                                                        <Zap className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-white">No automation rules found</p>
                                                    <p className="text-xs text-slate-400">
                                                        No trigger rules match your filter criteria. Clear filters or pick a prebuilt automation preset.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchQuery('');
                                                            setStatusFilter('All');
                                                            setTypeFilter('All');
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-xs font-semibold text-white"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginated.map(auto => {
                                            const {
                                                id,
                                                name,
                                                description,
                                                type,
                                                triggerType,
                                                templateName,
                                                templateCategory,
                                                schedule = {},
                                                status,
                                                stats = { totalRuns: 0, success: 0, failed: 0, skipped: 0 }
                                            } = auto;

                                            return (
                                                <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                                    <td className="py-3.5 px-4 max-w-xs">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span 
                                                                    onClick={() => openDetailsModal(auto)}
                                                                    className="font-bold text-white text-xs hover:text-[#8B5CF6] transition-colors cursor-pointer"
                                                                >
                                                                    {name}
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                                                    {type}
                                                                </span>
                                                            </div>
                                                            {description && (
                                                                <p className="text-[11px] text-slate-400 line-clamp-1">{description}</p>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <div className="space-y-0.5">
                                                            <span className="font-medium text-slate-200 block text-xs">
                                                                {triggerType}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-mono">
                                                                {auto.audienceConfig?.group || 'All Contacts'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <div className="space-y-0.5">
                                                            <span className="font-medium text-white block text-xs">{templateName}</span>
                                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{templateCategory}</span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                        <div className="space-y-0.5">
                                                            <span className="text-purple-300 font-medium flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {schedule.frequency || 'Event-driven'}
                                                            </span>
                                                            <span className="text-slate-500 font-mono text-[10px] block">
                                                                Next: {schedule.nextExecutionAt || 'On Trigger'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                            status === 'Active'
                                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                                : status === 'Paused'
                                                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                                                    : status === 'Draft'
                                                                        ? 'bg-slate-700 text-slate-300 border-slate-600'
                                                                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                                        }`}>
                                                            {status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                                                            {status}
                                                        </span>
                                                    </td>

                                                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                        <div className="space-y-0.5">
                                                            <span className="font-semibold text-white block">
                                                                {stats.success} sent &bull; {stats.failed} failed
                                                            </span>
                                                            {stats.skipped > 0 && (
                                                                <span className="text-amber-400 text-[10px]">
                                                                    {stats.skipped} duplicates skipped
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-1.5">
                                                            {/* Run Test */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openTestModal(auto)}
                                                                title="Run Test Simulation"
                                                                className="p-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 transition-colors"
                                                            >
                                                                <Play className="w-3.5 h-3.5" />
                                                            </button>

                                                            {/* View Details */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openDetailsModal(auto)}
                                                                title="View Rule Details"
                                                                className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>

                                                            {/* Pause / Resume */}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleStatus(id)}
                                                                title={status === 'Active' ? 'Pause Automation' : 'Resume Automation'}
                                                                className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                            >
                                                                {status === 'Active' ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                                                            </button>

                                                            {/* Duplicate */}
                                                            <button
                                                                type="button"
                                                                onClick={() => duplicateAutomation(id)}
                                                                title="Duplicate Automation"
                                                                className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteModal(auto)}
                                                                title="Delete Automation"
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

                        {/* Pagination */}
                        {filteredAutomations.length > 0 && (
                            <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between text-xs text-slate-400">
                                <div>
                                    Showing <strong>{Math.min(filteredAutomations.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
                                    <strong>{Math.min(filteredAutomations.length, currentPage * pageSize)}</strong> of{' '}
                                    <strong>{filteredAutomations.length}</strong> rules
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`p-1.5 rounded-lg border border-[#2D333B] ${currentPage === 1 ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="font-semibold text-white px-2">Page {currentPage} of {totalPages}</span>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`p-1.5 rounded-lg border border-[#2D333B] ${currentPage === totalPages ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: BIRTHDAY AUTOMATION */}
            {activeTab === 'birthday' && (
                <BirthdayAutomationSection />
            )}

            {/* TAB 3: FESTIVAL AUTOMATION */}
            {activeTab === 'festival' && (
                <FestivalAutomationSection />
            )}

            {/* TAB 4: APPOINTMENT AUTOMATION */}
            {activeTab === 'appointments' && (
                <AppointmentAutomationSection />
            )}

            {/* TAB 5: EXECUTION HISTORY */}
            {activeTab === 'history' && (
                <ExecutionHistoryTable />
            )}

            {/* Modals Mount */}
            <AutomationRuleBuilderModal />
            <AutomationTestRunModal />
            <AutomationDetailsModal />
            <AutomationDeleteModal />
            <ExecutionHistoryDetailModal />
        </div>
    );
};

export default AutomationsPage;
