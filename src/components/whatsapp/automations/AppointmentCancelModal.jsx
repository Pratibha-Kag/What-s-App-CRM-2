import React, { useState } from 'react';
import { CalendarX, X, AlertTriangle, Send } from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const AppointmentCancelModal = () => {
    const { 
        isAppointmentCancelModalOpen, 
        appointmentToCancel, 
        closeAppointmentCancelModal, 
        cancelAppointment 
    } = useWhatsAppAutomationStore();

    const [reason, setReason] = useState('Candidate requested cancellation due to scheduling conflict.');

    if (!isAppointmentCancelModalOpen || !appointmentToCancel) return null;

    const {
        id,
        customerName,
        appointmentType,
        scheduledDate,
        scheduledTime,
        counselorName
    } = appointmentToCancel;

    const handleConfirm = () => {
        cancelAppointment(id, reason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto text-white">
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                            <CalendarX className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Cancel Appointment</h3>
                            <p className="text-xs text-slate-400 font-mono">{id} &bull; {customerName}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeAppointmentCancelModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 space-y-1">
                        <p className="font-semibold flex items-center gap-1.5 text-rose-200">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            Halts Pending Reminders
                        </p>
                        <p className="text-[11px] text-rose-300/80">
                            Cancelling this appointment automatically prevents and stops all pending 1-day and same-day WhatsApp reminders.
                        </p>
                    </div>

                    <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Appointment Details:</span>
                        <p className="font-semibold text-white">{appointmentType} with {counselorName}</p>
                        <p className="text-slate-400">{scheduledDate} at {scheduledTime}</p>
                    </div>

                    <div>
                        <label className="block text-slate-400 font-semibold mb-1">Cancellation Reason</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#8B5CF6]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            Automated Cancellation Notice Preview:
                        </span>
                        <WhatsAppTemplatePreview
                            template={{
                                header: 'Appointment Cancellation Notice',
                                body: `Hello ${customerName}, your appointment for ${appointmentType} scheduled on ${scheduledDate} has been cancelled as requested. Reason: ${reason}. Click below whenever you are ready to book a new slot.`,
                                footer: 'Global Study Academic Services',
                                buttons: [{ type: 'URL', text: 'Book New Slot', url: 'https://university.portal/booking' }]
                            }}
                            showHeader={false}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeAppointmentCancelModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white text-xs font-semibold"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-all shadow-lg shadow-rose-600/20"
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCancelModal;
