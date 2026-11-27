import React, { useState, useMemo } from 'react';
import { 
    CalendarClock, Search, Filter, Clock, CheckCircle2, 
    AlertTriangle, Play, Pause, RefreshCw, Eye, Calendar, 
    Check, X, Link2, Sliders, UserX, CalendarSync, CalendarX, 
    Send, Sparkles, ArrowRight, ShieldCheck, UserCheck 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import AppointmentRescheduleModal from './AppointmentRescheduleModal';
import AppointmentCancelModal from './AppointmentCancelModal';
import AppointmentDetailModal from './AppointmentDetailModal';
import AppointmentReminderConfigModal from './AppointmentReminderConfigModal';

const AppointmentAutomationSection = () => {
    const {
        appointments,
        connectedSources,
        executionHistory,
        appointmentFilterStatus,
        appointmentFilterSource,
        appointmentSearchQuery,
        appointmentPage,
        appointmentPageSize,
        setAppointmentFilterStatus,
        setAppointmentFilterSource,
        setAppointmentSearchQuery,
        setAppointmentPage,
        openRescheduleModal,
        openAppointmentCancelModal,
        openAppointmentDetailModal,
        openReminderConfigModal,
        confirmAppointment,
        completeAppointment,
        markAppointmentMissed,
        sendAppointmentReminder,
        simulateDataSync,
        getAppointmentStats
    } = useWhatsAppAutomationStore();

    const [dateTab, setDateTab] = useState('all'); // 'all' | 'today' | 'upcoming'
    const [syncFeedback, setSyncFeedback] = useState(null);
    const [reminderFeedback, setReminderFeedback] = useState(null);

    const stats = getAppointmentStats();
    const todayDate = new Date().toISOString().split('T')[0];

    // Filter appointments
    const filteredAppointments = useMemo(() => {
        return appointments.filter(a => {
            if (appointmentFilterStatus !== 'All' && a.status !== appointmentFilterStatus) return false;
            if (appointmentFilterSource !== 'All' && a.source !== appointmentFilterSource) return false;

            if (dateTab === 'today' && a.scheduledDate !== todayDate) return false;
            if (dateTab === 'upcoming' && (a.scheduledDate < todayDate || ['Completed', 'Cancelled'].includes(a.status))) return false;

            if (appointmentSearchQuery.trim()) {
                const q = appointmentSearchQuery.toLowerCase();
                const matchesName = (a.customerName || '').toLowerCase().includes(q);
                const matchesPhone = (a.phone || '').toLowerCase().includes(q);
                const matchesType = (a.appointmentType || '').toLowerCase().includes(q);
                const matchesCounselor = (a.counselorName || '').toLowerCase().includes(q);
                const matchesId = (a.id || '').toLowerCase().includes(q);
                if (!matchesName && !matchesPhone && !matchesType && !matchesCounselor && !matchesId) return false;
            }
            return true;
        });
    }, [appointments, appointmentFilterStatus, appointmentFilterSource, dateTab, appointmentSearchQuery, todayDate]);

    const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / appointmentPageSize));
    const paginated = filteredAppointments.slice((appointmentPage - 1) * appointmentPageSize, appointmentPage * appointmentPageSize);

    // Filter appointment execution logs from common history
    const appointmentHistory = useMemo(() => {
        return executionHistory.filter(h => 
            h.automationName?.toLowerCase().includes('appointment') || 
            h.automationName?.toLowerCase().includes('counseling') ||
            h.triggerType === 'EVENT_RELATIVE' ||
            h.duplicateKey?.includes('appt-')
        );
    }, [executionHistory]);

    // Handle Simulate Sync
    const handleSimulateSync = () => {
        const result = simulateDataSync();
        setSyncFeedback(result);
        setTimeout(() => setSyncFeedback(null), 5000);
    };

    // Handle Send Reminder Now
    const handleSendReminder = (appointmentId, type) => {
        const record = sendAppointmentReminder(appointmentId, type);
        if (record) {
            setReminderFeedback({
                id: appointmentId,
                status: record.status,
                reason: record.reason
            });
            setTimeout(() => setReminderFeedback(null), 4000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Overview & Connected Sources Bar */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B] pb-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center shrink-0">
                            <CalendarClock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-white">Appointment Reminders &amp; Status Workflows</h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Sync Active
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                    Phase 6 Engine
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                Automated 24-hour and same-day pre-appointment WhatsApp reminders, instant reschedule notifications, and missed appointment follow-ups.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleSimulateSync}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                            Simulate Data Sync
                        </button>

                        <button
                            type="button"
                            onClick={() => openReminderConfigModal()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                        >
                            <Sliders className="w-3.5 h-3.5" />
                            Configure Reminder Rules
                        </button>
                    </div>
                </div>

                {/* Connected Software Sources Status Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Connected Booking Software:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {connectedSources.map(s => (
                            <div key={s.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#111318] border border-[#2D333B] text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span className="font-semibold text-slate-300">{s.name}</span>
                                <span className="text-slate-500 font-mono">({s.recordsCount})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sync Feedback Toast */}
            {syncFeedback && (
                <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>
                            Simulated data sync completed! Successfully processed {syncFeedback.syncedCount} new appointments across {syncFeedback.sourcesUpdated} connected sources.
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Sync: OK</span>
                </div>
            )}

            {/* Reminder Feedback Toast */}
            {reminderFeedback && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
                    reminderFeedback.status === 'Success' 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                        : reminderFeedback.status === 'Skipped'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}>
                    <div className="flex items-center gap-2">
                        {reminderFeedback.status === 'Success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {reminderFeedback.status === 'Skipped' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                        {reminderFeedback.status === 'Failed' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        <span>{reminderFeedback.reason}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{reminderFeedback.id}</span>
                </div>
            )}

            {/* Dynamic Metric Cards (7 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Appointments</span>
                    <p className="text-xl font-bold text-white mt-0.5">{stats.total}</p>
                    <span className="text-[10px] text-slate-500">All synced slots</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-[#25D366] uppercase font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span> Today's Slots
                    </span>
                    <p className="text-xl font-bold text-[#25D366] mt-0.5">{stats.today}</p>
                    <span className="text-[10px] text-slate-500">Scheduled today</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold">Upcoming</span>
                    <p className="text-xl font-bold text-purple-400 mt-0.5">{stats.upcoming}</p>
                    <span className="text-[10px] text-slate-500">Future dates</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-blue-400 uppercase font-semibold">Completed</span>
                    <p className="text-xl font-bold text-blue-400 mt-0.5">{stats.completed}</p>
                    <span className="text-[10px] text-slate-500">Concluded</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">Missed</span>
                    <p className="text-xl font-bold text-amber-400 mt-0.5">{stats.missed}</p>
                    <span className="text-[10px] text-slate-500">Follow-up sent</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-rose-400 uppercase font-semibold">Cancelled</span>
                    <p className="text-xl font-bold text-rose-400 mt-0.5">{stats.cancelled}</p>
                    <span className="text-[10px] text-slate-500">Reminders stopped</span>
                </div>

                <div className="p-3 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold">Reminders Sent</span>
                    <p className="text-xl font-bold text-cyan-400 mt-0.5">{stats.remindersSent}</p>
                    <span className="text-[10px] text-slate-500">Dispatched logs</span>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-4 rounded-2xl border border-[#2D333B]">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={appointmentSearchQuery}
                        onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                        placeholder="Search by customer name, phone, type, or counselor..."
                        className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    {appointmentSearchQuery && (
                        <button
                            type="button"
                            onClick={() => setAppointmentSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Date Tabs */}
                    <div className="flex items-center gap-1 bg-[#111318] p-1 rounded-xl border border-[#2D333B] text-xs">
                        {[
                            { id: 'all', label: 'All Dates' },
                            { id: 'today', label: `Today (${stats.today})` },
                            { id: 'upcoming', label: 'Upcoming' }
                        ].map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setDateTab(t.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                    dateTab === t.id
                                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <select
                        value={appointmentFilterStatus}
                        onChange={(e) => setAppointmentFilterStatus(e.target.value)}
                        className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Missed">Missed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Source Filter */}
                    <select
                        value={appointmentFilterSource}
                        onChange={(e) => setAppointmentFilterSource(e.target.value)}
                        className="bg-[#111318] border border-[#2D333B] text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6] max-w-[150px] truncate"
                    >
                        <option value="All">All Sources</option>
                        <option value="Calendly Sync">Calendly Sync</option>
                        <option value="HubSpot Meeting">HubSpot Meeting</option>
                        <option value="Clinic Pro CRM">Clinic Pro CRM</option>
                        <option value="Internal Admissions CRM">Internal CRM</option>
                    </select>
                </div>
            </div>

            {/* Interactive Appointments Table */}
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#111318] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-3.5 px-4 font-semibold">Appointment &amp; Source</th>
                                <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                                <th className="py-3.5 px-4 font-semibold">Service Type &amp; Counselor</th>
                                <th className="py-3.5 px-4 font-semibold">Scheduled Date &amp; Time</th>
                                <th className="py-3.5 px-4 font-semibold">Appointment Status</th>
                                <th className="py-3.5 px-4 font-semibold">WhatsApp Reminder Status</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        No appointments match the selected filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(appt => {
                                    const {
                                        id,
                                        customerName,
                                        phone,
                                        appointmentType,
                                        counselorName,
                                        scheduledDate,
                                        scheduledTime,
                                        status,
                                        source,
                                        reminderStatus
                                    } = appt;

                                    const isToday = scheduledDate === todayDate;

                                    return (
                                        <tr key={id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span 
                                                        onClick={() => openAppointmentDetailModal(appt)}
                                                        className="font-bold text-white block hover:text-[#8B5CF6] transition-colors cursor-pointer font-mono"
                                                    >
                                                        {id}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111318] text-slate-400 border border-[#2D333B]">
                                                        {source}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-slate-200 block">{customerName}</span>
                                                    <span className="text-slate-400 font-mono text-[11px]">{phone}</span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <span className="font-medium text-white block">{appointmentType}</span>
                                                    <span className="text-[10px] text-slate-400">Counselor: {counselorName}</span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                                                <div className="space-y-0.5">
                                                    <span className="font-semibold text-purple-300 font-mono flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-purple-400" />
                                                        {scheduledDate} at {scheduledTime}
                                                    </span>
                                                    {isToday && (
                                                        <span className="text-[10px] font-bold text-[#25D366] block">
                                                            Happening Today
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                                                    status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                                                    status === 'Completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                                                    status === 'Missed' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                                                    status === 'Cancelled' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                                                    status === 'Rescheduled' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                                                    'bg-slate-800 text-slate-300 border-slate-700'
                                                }`}>
                                                    {status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                                                    {status === 'Completed' && <Check className="w-3 h-3" />}
                                                    {status === 'Missed' && <UserX className="w-3 h-3" />}
                                                    {status === 'Rescheduled' && <CalendarSync className="w-3 h-3" />}
                                                    {status === 'Cancelled' && <CalendarX className="w-3 h-3" />}
                                                    {status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                                    reminderStatus.includes('Sent')
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : reminderStatus.includes('Pending')
                                                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                                            : 'bg-[#111318] text-slate-400 border border-[#2D333B]'
                                                }`}>
                                                    <Clock className="w-3 h-3" />
                                                    {reminderStatus}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {/* View Details */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openAppointmentDetailModal(appt)}
                                                        title="View Appointment Details"
                                                        className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Quick 1-Day Reminder Simulation */}
                                                    {['Scheduled', 'Confirmed', 'Rescheduled'].includes(status) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSendReminder(id, '1_DAY_BEFORE')}
                                                            title="Simulate 1-Day Pre-Appointment Reminder"
                                                            className="p-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 transition-colors"
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Quick Reschedule */}
                                                    {['Scheduled', 'Confirmed'].includes(status) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openRescheduleModal(appt)}
                                                            title="Reschedule Appointment"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-purple-500/50 text-purple-300 hover:text-white transition-colors"
                                                        >
                                                            <CalendarSync className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Quick Cancel */}
                                                    {['Scheduled', 'Confirmed', 'Rescheduled'].includes(status) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openAppointmentCancelModal(appt)}
                                                            title="Cancel Appointment"
                                                            className="p-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
                                                        >
                                                            <CalendarX className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
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
                {filteredAppointments.length > 0 && (
                    <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between text-xs text-slate-400">
                        <div>
                            Showing <strong>{Math.min(filteredAppointments.length, (appointmentPage - 1) * appointmentPageSize + 1)}</strong> to{' '}
                            <strong>{Math.min(filteredAppointments.length, appointmentPage * appointmentPageSize)}</strong> of{' '}
                            <strong>{filteredAppointments.length}</strong> appointments
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setAppointmentPage(Math.max(1, appointmentPage - 1))}
                                disabled={appointmentPage === 1}
                                className={`p-1.5 rounded-lg border border-[#2D333B] ${appointmentPage === 1 ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                            >
                                Previous
                            </button>
                            <span className="font-semibold text-white px-2">Page {appointmentPage} of {totalPages}</span>
                            <button
                                type="button"
                                onClick={() => setAppointmentPage(Math.min(totalPages, appointmentPage + 1))}
                                disabled={appointmentPage === totalPages}
                                className={`p-1.5 rounded-lg border border-[#2D333B] ${appointmentPage === totalPages ? 'text-slate-600 bg-[#16181D]' : 'text-slate-300 bg-[#1C1F26]'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Appointment Automation History Sub-table */}
            <div className="bg-[#16181D] p-5 rounded-2xl border border-[#2D333B] space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Recent Appointment WhatsApp Reminder &amp; Event Logs
                    </h3>
                    <span className="text-[11px] text-slate-500">{appointmentHistory.length} logs</span>
                </div>

                <div className="overflow-x-auto border border-[#2D333B] rounded-xl bg-[#111318]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#1C1F26] text-slate-400 border-b border-[#2D333B] text-[11px]">
                            <tr>
                                <th className="py-2.5 px-3 font-semibold">Reminder / Event</th>
                                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                                <th className="py-2.5 px-3 font-semibold">Status</th>
                                <th className="py-2.5 px-3 font-semibold">Execution Timestamp</th>
                                <th className="py-2.5 px-3 font-semibold">Telemetry Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B]/50">
                            {appointmentHistory.slice(0, 5).map(h => (
                                <tr key={h.id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                    <td className="py-2.5 px-3 font-medium text-white">{h.automationName}</td>
                                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                                        {h.recipientName} ({h.recipientPhone})
                                    </td>
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                            h.status === 'Success' 
                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                                                : h.status === 'Skipped'
                                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
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

            {/* Modals */}
            <AppointmentRescheduleModal />
            <AppointmentCancelModal />
            <AppointmentDetailModal />
            <AppointmentReminderConfigModal />
        </div>
    );
};

export default AppointmentAutomationSection;
