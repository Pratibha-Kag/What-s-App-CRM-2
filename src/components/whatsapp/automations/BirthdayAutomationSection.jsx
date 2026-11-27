import React, { useState, useMemo } from 'react';
import { 
    Cake, Search, Sparkles, CheckCircle2, AlertTriangle, 
    Play, Clock, Users, ShieldCheck, Send, Calendar, 
    RefreshCw, Filter, Eye, AlertCircle, Check, X, ArrowUpRight
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import useWhatsAppAudienceStore from '../../../store/useWhatsAppAudienceStore';
import { filterCustomersByBirthday } from '../../../utils/birthdayUtils';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const BirthdayAutomationSection = () => {
    const { 
        automations, 
        executionHistory, 
        openBuilder, 
        openTestModal, 
        toggleStatus, 
        executeTodayBirthdayBroadcast, 
        executeAutomation 
    } = useWhatsAppAutomationStore();

    const { audiences } = useWhatsAppAudienceStore();

    const [activeFilter, setActiveFilter] = useState('upcoming'); // 'upcoming' | 'today' | 'week' | 'month' | 'missing_invalid' | 'all'
    const [searchQuery, setSearchQuery] = useState('');
    const [simulatingBatch, setSimulatingBatch] = useState(false);
    const [batchResult, setBatchResult] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    // Active birthday automation rule
    const birthdayRule = automations.find(a => a.type === 'birthday') || {
        id: 'auto-101',
        name: 'Applicant Birthday Greeting Engine',
        status: 'Active',
        templateName: 'birthday_wishes',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Birthday!',
            body: 'Happy Birthday {{1}}! 🎂 Wishing you a wonderful year ahead. Enjoy 25% discount off your university application fees with code BDAY2026!',
            footer: 'Global Study Admissions Team'
        },
        schedule: {
            time: '09:00',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Annual'
        }
    };

    // Calculate birthdays for all audience members
    const filteredCustomers = useMemo(() => {
        let list = filterCustomersByBirthday(audiences, activeFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(c => 
                (c.name || '').toLowerCase().includes(q) ||
                (c.phone || '').toLowerCase().includes(q) ||
                (c.group || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [audiences, activeFilter, searchQuery]);

    // Dynamic telemetry calculations
    const allProcessed = useMemo(() => filterCustomersByBirthday(audiences, 'all'), [audiences]);
    const totalCustomers = audiences.length;
    const birthdaysTodayCount = allProcessed.filter(c => c.bdayInfo.isValid && c.bdayInfo.isToday).length;
    const birthdaysThisMonthCount = allProcessed.filter(c => c.bdayInfo.isValid && c.bdayInfo.isThisMonth).length;
    const missingDOBCount = allProcessed.filter(c => !c.bdayInfo.isValid).length;

    // Filter birthday execution logs from common history
    const birthdayHistory = useMemo(() => {
        return executionHistory.filter(h => 
            h.automationName?.toLowerCase().includes('birthday') || 
            h.triggerType === 'SCHEDULE_ANNUAL'
        );
    }, [executionHistory]);

    const messagesSentCount = birthdayHistory.filter(h => h.status === 'Success').length;

    // Simulate batch execution for today's birthdays
    const handleSimulateTodayBroadcast = () => {
        setSimulatingBatch(true);
        setBatchResult(null);

        setTimeout(() => {
            const result = executeTodayBirthdayBroadcast();
            setSimulatingBatch(false);
            setBatchResult(result);
            setTimeout(() => setBatchResult(null), 6000);
        }, 900);
    };

    // Trigger single birthday wish
    const handleSendSingleWish = (customer) => {
        const todayKey = new Date().toISOString().split('T')[0];
        executeAutomation(birthdayRule.id, {
            isTest: false,
            targetRecipient: customer,
            occurrenceKey: todayKey,
            customPayload: { event: 'birthday', birthDate: customer.dob }
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Overview & Action Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16181D] p-5 rounded-2xl border border-[#2D333B]">
                <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#EC4899]/30 border border-[#8B5CF6]/40 text-[#EC4899] flex items-center justify-center shrink-0">
                        <Cake className="w-6 h-6 text-[#EC4899]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-white">Automated Birthday Engine</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Daily Auto-Scan Active
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                Idempotency Active
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            Evaluates customer Date of Birth daily at {birthdayRule.schedule?.time || '09:00 AM'}. Automatically delivers personalized birthday greetings and anniversary fee waivers with zero duplicate sends.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Simulate Broadcast Button */}
                    <button
                        type="button"
                        onClick={handleSimulateTodayBroadcast}
                        disabled={simulatingBatch}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                    >
                        {simulatingBatch ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Processing Broadcast...
                            </>
                        ) : (
                            <>
                                <Cake className="w-3.5 h-3.5" />
                                Simulate Today's Birthday Broadcast ({birthdaysTodayCount})
                            </>
                        )}
                    </button>

                    {/* Configure Rule Button */}
                    <button
                        type="button"
                        onClick={() => openBuilder(birthdayRule)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                    >
                        Configure Rule
                    </button>
                </div>
            </div>

            {/* Batch Simulator Feedback Alert */}
            {batchResult && (
                <div className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
                    batchResult.success > 0 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                        : batchResult.skipped > 0 
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
                            : 'bg-[#1C1F26] border-[#2D333B] text-slate-300'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <div>
                            <p className="font-bold">
                                Birthday Broadcast Evaluation Completed
                            </p>
                            <p className="text-[11px] opacity-90 mt-0.5">
                                Processed: <strong>{batchResult.processed}</strong> contacts &bull; 
                                Delivered: <strong className="text-emerald-400">{batchResult.success}</strong> &bull; 
                                Skipped (Duplicates Prevented): <strong className="text-amber-400">{batchResult.skipped}</strong> &bull; 
                                Failed: <strong className="text-rose-400">{batchResult.failed}</strong>
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">ID: auto-101-batch</span>
                </div>
            )}

            {/* Dynamic Metric Cards (5 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Customers</span>
                    <p className="text-xl font-bold text-white mt-1">{totalCustomers}</p>
                    <span className="text-[10px] text-slate-500">In CRM Audience</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-[#25D366] uppercase font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> Birthdays Today
                    </span>
                    <p className="text-xl font-bold text-[#25D366] mt-1">{birthdaysTodayCount}</p>
                    <span className="text-[10px] text-[#25D366] font-medium">Eligible right now</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold">Upcoming (30 Days)</span>
                    <p className="text-xl font-bold text-purple-400 mt-1">{birthdaysThisMonthCount}</p>
                    <span className="text-[10px] text-slate-500">Scheduled queues</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold">Messages Sent</span>
                    <p className="text-xl font-bold text-cyan-400 mt-1">{messagesSentCount}</p>
                    <span className="text-[10px] text-slate-500">Lifetime delivered</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" /> Missing / Invalid DOB
                    </span>
                    <p className="text-xl font-bold text-rose-400 mt-1">{missingDOBCount}</p>
                    <span className="text-[10px] text-rose-400">Needs update</span>
                </div>
            </div>

            {/* Active Birthday Automation Configuration Card */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D333B] pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                Active Birthday Automation Configuration
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                birthdayRule.status === 'Active'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}>
                                {birthdayRule.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Rule: <strong className="text-white">{birthdayRule.name}</strong> &bull; Template: <strong className="text-[#25D366]">{birthdayRule.templateName}</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(!previewOpen)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-medium text-slate-300 hover:text-white transition-all"
                        >
                            <Eye className="w-3.5 h-3.5 text-[#25D366]" />
                            {previewOpen ? 'Hide Message Preview' : 'Show Message Preview'}
                        </button>

                        <button
                            type="button"
                            onClick={() => toggleStatus(birthdayRule.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                birthdayRule.status === 'Active'
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            }`}
                        >
                            {birthdayRule.status === 'Active' ? 'Pause Automation' : 'Resume Automation'}
                        </button>
                    </div>
                </div>

                {previewOpen && (
                    <div className="pt-2">
                        <WhatsAppTemplatePreview
                            template={birthdayRule.templateSnapshot}
                            customVariables={[
                                { key: '1', sample: 'Tariq Mahmoud' },
                                { key: '2', sample: '25% discount' },
                                { key: '3', sample: 'BDAY2026' }
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* Upcoming Birthdays Table & Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by customer name, phone, or group..."
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

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { id: 'upcoming', label: 'All Upcoming' },
                            { id: 'today', label: `Today (${birthdaysTodayCount})` },
                            { id: 'week', label: 'This Week' },
                            { id: 'month', label: 'This Month' },
                            { id: 'missing_invalid', label: `Missing DOB (${missingDOBCount})` }
                        ].map(f => {
                            const isCurrent = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        isCurrent
                                            ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                                            : 'bg-[#1C1F26] text-slate-400 hover:text-white border border-[#2D333B]'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                                <tr>
                                    <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                                    <th className="py-3.5 px-4 font-semibold">WhatsApp Number</th>
                                    <th className="py-3.5 px-4 font-semibold">Date of Birth (DOB)</th>
                                    <th className="py-3.5 px-4 font-semibold">Next Upcoming Birthday</th>
                                    <th className="py-3.5 px-4 font-semibold">Countdown / Days Remaining</th>
                                    <th className="py-3.5 px-4 font-semibold">Automation Status</th>
                                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/50">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500">
                                            No customers match the selected birthday filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => {
                                        const { id, name, phone, group, bdayInfo } = customer;

                                        // Check if already sent in today's execution history
                                        const alreadySentToday = executionHistory.some(h => 
                                            h.recipientPhone === phone && 
                                            h.status === 'Success' &&
                                            h.executedAt?.startsWith(new Date().toISOString().split('T')[0])
                                        );

                                        return (
                                            <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold text-white block">{name}</span>
                                                        <span className="text-[10px] text-slate-500">{group}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-300">
                                                    {phone}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                    {bdayInfo.isValid ? (
                                                        <span className="text-slate-300">{bdayInfo.formattedDOB}</span>
                                                    ) : (
                                                        <span className="text-rose-400 font-medium flex items-center gap-1">
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            {bdayInfo.errorReason}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                    {bdayInfo.isValid ? (
                                                        <span className="font-semibold text-purple-300 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-purple-400" />
                                                            {bdayInfo.formattedNextBirthday}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600">—</span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {!bdayInfo.isValid ? (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                                            Needs DOB
                                                        </span>
                                                    ) : bdayInfo.isToday ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 animate-pulse">
                                                            <Cake className="w-3.5 h-3.5" /> Today! (Turning {bdayInfo.upcomingAge})
                                                        </span>
                                                    ) : bdayInfo.isThisWeek ? (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                                            In {bdayInfo.daysRemaining} days (Turning {bdayInfo.upcomingAge})
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#1C1F26] text-slate-400 border border-[#2D333B]">
                                                            In {bdayInfo.daysRemaining} days
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {!bdayInfo.isValid ? (
                                                        <span className="text-slate-500 text-[11px] italic">Ineligible</span>
                                                    ) : alreadySentToday ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                            <CheckCircle2 className="w-3 h-3" /> Sent Today
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                            <ShieldCheck className="w-3 h-3" /> Queued (Annual)
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    {bdayInfo.isValid ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSendSingleWish(customer)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] border border-[#8B5CF6]/30 text-xs font-semibold transition-all"
                                                        >
                                                            <Send className="w-3 h-3" />
                                                            Send Wish Now
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-600 text-xs">—</span>
                                                    )}
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

            {/* Birthday Message History Table */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Recent Birthday Automated Deliveries &amp; Duplicate Logs
                    </h3>
                    <span className="text-[11px] text-slate-500">{birthdayHistory.length} records</span>
                </div>

                <div className="overflow-x-auto border border-[#2D333B] rounded-xl bg-[#111318]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#1C1F26] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                                <th className="py-2.5 px-3 font-semibold">WhatsApp Number</th>
                                <th className="py-2.5 px-3 font-semibold">Outcome</th>
                                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                                <th className="py-2.5 px-3 font-semibold">Telemetry Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {birthdayHistory.slice(0, 5).map(h => (
                                <tr key={h.id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                    <td className="py-2.5 px-3 font-medium text-white">{h.recipientName}</td>
                                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{h.recipientPhone}</td>
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                        {h.status === 'Success' && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                Success
                                            </span>
                                        )}
                                        {h.status === 'Skipped' && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                Skipped (Duplicate)
                                            </span>
                                        )}
                                        {h.status === 'Failed' && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                                Failed
                                            </span>
                                        )}
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
        </div>
    );
};

export default BirthdayAutomationSection;
