import React, { useState } from 'react';
import { 
    X, Bell, Clock, Calendar, CheckCircle2, ShieldCheck, 
    Sparkles, Eye, Check, Sliders 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import WhatsAppTemplateSelector from '../templates/WhatsAppTemplateSelector';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const AppointmentReminderConfigModal = () => {
    const { 
        isReminderConfigModalOpen, 
        closeReminderConfigModal, 
        automations, 
        updateAutomation 
    } = useWhatsAppAutomationStore();

    const { templates } = useWhatsAppTemplateStore();

    // Default reminder rule (auto-102)
    const rule = automations.find(a => a.type === 'appointment_reminder') || {
        id: 'auto-102',
        name: 'Admissions Counseling 24-Hour Reminder',
        status: 'Active',
        templateId: 'tpl-102',
        templateName: 'appointment_reminder'
    };

    const [offsetValue, setOffsetValue] = useState(24);
    const [offsetUnit, setOffsetUnit] = useState('hours');
    const [offsetDirection, setOffsetDirection] = useState('before');
    const [sameDayEnabled, setSameDayEnabled] = useState(true);
    const [sameDayHours, setSameDayHours] = useState(2);
    const [selectedTemplateId, setSelectedTemplateId] = useState(rule.templateId || 'tpl-102');
    const [savedNotice, setSavedNotice] = useState(false);

    const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

    if (!isReminderConfigModalOpen) return null;

    const handleSave = () => {
        updateAutomation(rule.id, {
            conditions: {
                ...rule.conditions,
                offsetValue,
                offsetUnit,
                offsetDirection,
                sameDayEnabled,
                sameDayHours
            },
            templateId: selectedTemplateId,
            templateName: activeTemplate?.name || 'appointment_reminder'
        });

        setSavedNotice(true);
        setTimeout(() => {
            setSavedNotice(false);
            closeReminderConfigModal();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto text-white">
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                            <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Configure Appointment Reminder Rules</h3>
                            <p className="text-xs text-slate-400">Set timing offsets for automated pre-appointment WhatsApp broadcasts.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeReminderConfigModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] text-xs">
                    {/* Primary Reminder Offset */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                            1. Primary Pre-Appointment Reminder
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-1">Offset Amount</label>
                                <input
                                    type="number"
                                    value={offsetValue}
                                    onChange={(e) => setOffsetValue(Number(e.target.value))}
                                    min="1"
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Unit</label>
                                <select
                                    value={offsetUnit}
                                    onChange={(e) => setOffsetUnit(e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                >
                                    <option value="hours">Hours Before</option>
                                    <option value="days">Days Before</option>
                                    <option value="minutes">Minutes Before</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-1">Timing Trigger</label>
                                <input
                                    type="text"
                                    disabled
                                    value="Before Scheduled Time"
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-slate-400 outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Same-Day Second Reminder */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                                2. Same-Day Urgent Reminder (Follow-up)
                            </span>
                            <button
                                type="button"
                                onClick={() => setSameDayEnabled(!sameDayEnabled)}
                                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                    sameDayEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                {sameDayEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                        {sameDayEnabled && (
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-slate-400 mb-1">Same-Day Offset (Hours Before)</label>
                                    <input
                                        type="number"
                                        value={sameDayHours}
                                        onChange={(e) => setSameDayHours(Number(e.target.value))}
                                        min="1"
                                        max="6"
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                    />
                                </div>
                                <div className="text-slate-400 text-[11px] flex items-center">
                                    Dispatched {sameDayHours} hours prior to interview slot with quick confirmation buttons.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Template Selection */}
                    <div className="space-y-3">
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                            3. Select WhatsApp Reminder Template
                        </span>
                        <WhatsAppTemplateSelector
                            selectedTemplateId={selectedTemplateId}
                            onSelectTemplate={(tpl) => setSelectedTemplateId(tpl.id)}
                            allowedCategories={['Utility']}
                            approvedOnly={true}
                        />

                        {activeTemplate && (
                            <div className="pt-2">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                                    Live Reminder Bubble Preview:
                                </span>
                                <WhatsAppTemplatePreview
                                    template={activeTemplate}
                                    customVariables={[
                                        { key: '1', sample: 'Aarav Patel' },
                                        { key: '2', sample: 'Tomorrow' },
                                        { key: '3', sample: '04:00 PM' },
                                        { key: '4', sample: 'Dr. Alistair Finch' }
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeReminderConfigModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white text-xs font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20"
                    >
                        {savedNotice ? (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Configuration Saved!
                            </>
                        ) : (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Save Reminder Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentReminderConfigModal;
