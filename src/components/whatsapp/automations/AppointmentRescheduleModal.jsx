import React, { useState } from 'react';
import { CalendarSync, X, Clock, Calendar, AlertTriangle, Eye, Send } from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const AppointmentRescheduleModal = () => {
    const { 
        isRescheduleModalOpen, 
        appointmentToReschedule, 
        closeRescheduleModal, 
        rescheduleAppointment 
    } = useWhatsAppAutomationStore();

    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('11:00');
    const [reason, setReason] = useState('Applicant requested alternate counseling slot due to exam schedule.');

    if (!isRescheduleModalOpen || !appointmentToReschedule) return null;

    const {
        id,
        customerName,
        phone,
        appointmentType,
        counselorName,
        scheduledDate,
        scheduledTime,
        source
    } = appointmentToReschedule;

    const handleConfirm = () => {
        if (!newDate) return;
        rescheduleAppointment(id, newDate, newTime, reason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto text-white">
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                            <CalendarSync className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Reschedule Appointment</h3>
                            <p className="text-xs text-slate-400 font-mono">{id} &bull; {customerName}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeRescheduleModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    {/* Current Appointment Banner */}
                    <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Currently Scheduled:</span>
                            <p className="font-semibold text-slate-300 mt-0.5">
                                {scheduledDate} at {scheduledTime} &bull; Counselor: {counselorName}
                            </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1F26] text-slate-400 border border-[#2D333B]">
                            {source}
                        </span>
                    </div>

                    {/* New Date and Time inputs */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 font-semibold mb-1">New Appointment Date <span className="text-rose-400">*</span></label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#8B5CF6]"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-semibold mb-1">New Appointment Time <span className="text-rose-400">*</span></label>
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#8B5CF6]"
                            />
                        </div>
                    </div>

                    {/* Reschedule Reason */}
                    <div>
                        <label className="block text-slate-400 font-semibold mb-1">Reschedule Reason / Internal Notes</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for changing meeting time..."
                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#8B5CF6]"
                        />
                    </div>

                    {/* WhatsApp Notification Preview */}
                    <div className="space-y-2">
                        <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            Automated WhatsApp Reschedule Alert Preview:
                        </span>
                        <WhatsAppTemplatePreview
                            template={{
                                header: 'Counseling Session Rescheduled',
                                body: `Hello ${customerName}, your counseling session originally set for ${scheduledDate} has been rescheduled to ${newDate || '[New Date]'} at ${newTime}. Please confirm if this works.`,
                                footer: 'Global Study Academic Services',
                                buttons: [{ type: 'QUICK_REPLY', text: 'Confirm New Time' }]
                            }}
                            showHeader={false}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeRescheduleModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white text-xs font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!newDate}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                            !newDate 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[#8B5CF6]/20'
                        }`}
                    >
                        <CalendarSync className="w-3.5 h-3.5" />
                        Confirm Reschedule &amp; Dispatch Alert
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentRescheduleModal;
