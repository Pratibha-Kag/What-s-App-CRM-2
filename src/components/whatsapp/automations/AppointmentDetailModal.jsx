import React from 'react';
import { 
    X, Calendar, Clock, User, Phone, CheckCircle2, 
    AlertTriangle, ShieldCheck, RefreshCw, Send, ArrowRight 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';

const AppointmentDetailModal = () => {
    const { 
        isAppointmentDetailModalOpen, 
        selectedAppointment, 
        closeAppointmentDetailModal,
        openRescheduleModal,
        openAppointmentCancelModal,
        confirmAppointment,
        completeAppointment,
        markAppointmentMissed,
        sendAppointmentReminder
    } = useWhatsAppAutomationStore();

    if (!isAppointmentDetailModalOpen || !selectedAppointment) return null;

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
        reminderStatus,
        remindersSent = [],
        notes,
        previousDate,
        previousTime,
        cancellationReason
    } = selectedAppointment;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto text-white">
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{customerName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                                status === 'Completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                                status === 'Missed' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                                status === 'Cancelled' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                                status === 'Rescheduled' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                                'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                                {status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{id} &bull; Source: {source}</p>
                    </div>
                    <button
                        type="button"
                        onClick={closeAppointmentDetailModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    {/* Primary Grid */}
                    <div className="grid grid-cols-2 gap-3 bg-[#111318] p-4 rounded-xl border border-[#2D333B]">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Service Type:</span>
                            <p className="font-semibold text-white mt-0.5">{appointmentType}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Counselor:</span>
                            <p className="font-semibold text-white mt-0.5">{counselorName}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Appointment Date &amp; Time:</span>
                            <p className="font-semibold text-purple-300 font-mono mt-0.5">{scheduledDate} at {scheduledTime}</p>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">WhatsApp Number:</span>
                            <p className="font-mono text-slate-300 mt-0.5">{phone}</p>
                        </div>
                    </div>

                    {previousDate && (
                        <div className="p-3 bg-[#1C1F26] rounded-xl border border-[#2D333B] text-slate-400">
                            <span className="text-purple-400 font-semibold block text-[11px]">Rescheduled History:</span>
                            <p className="text-xs mt-0.5">Moved from {previousDate} at {previousTime} to {scheduledDate} at {scheduledTime}.</p>
                        </div>
                    )}

                    {cancellationReason && (
                        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300">
                            <span className="font-semibold block text-[11px]">Cancellation Reason:</span>
                            <p className="text-xs mt-0.5">{cancellationReason}</p>
                        </div>
                    )}

                    {/* Reminders Dispatched History */}
                    <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            WhatsApp Reminders Logged for this Appointment ({remindersSent.length}):
                        </span>
                        {remindersSent.length === 0 ? (
                            <p className="p-3 bg-[#111318] rounded-xl border border-[#2D333B] text-slate-500 italic">
                                No reminders dispatched yet. Status: {reminderStatus}.
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                {remindersSent.map((r, i) => (
                                    <div key={i} className="p-2.5 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between">
                                        <span className="font-semibold text-slate-200">{r.type.replace(/_/g, ' ')}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {new Date(r.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(r.sentAt).toLocaleDateString()}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                {r.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Demonstration Actions */}
                    <div className="pt-2 border-t border-[#2D333B] flex flex-wrap gap-2">
                        {status === 'Scheduled' && (
                            <button
                                type="button"
                                onClick={() => confirmAppointment(id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold"
                            >
                                Confirm Appointment
                            </button>
                        )}
                        {['Scheduled', 'Confirmed', 'Rescheduled'].includes(status) && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => completeAppointment(id)}
                                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold"
                                >
                                    Mark as Completed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => markAppointmentMissed(id)}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold"
                                >
                                    Mark as Missed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeAppointmentDetailModal();
                                        openRescheduleModal(selectedAppointment);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 font-semibold"
                                >
                                    Reschedule
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeAppointmentDetailModal();
                                        openAppointmentCancelModal(selectedAppointment);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="px-6 py-3 border-t border-[#2D333B] bg-[#111318] flex justify-end">
                    <button
                        type="button"
                        onClick={closeAppointmentDetailModal}
                        className="px-4 py-1.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailModal;
