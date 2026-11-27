import React, { useState, useEffect } from 'react';
import { 
    X, Check, ChevronRight, ChevronLeft, Sparkles, Clock, 
    Calendar, Users, FileText, CheckCircle2, AlertCircle, 
    Sliders, Zap, Bell, ShieldCheck, ArrowRight, Eye, Info
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import useWhatsAppAudienceStore from '../../../store/useWhatsAppAudienceStore';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import WhatsAppTemplateSelector from '../templates/WhatsAppTemplateSelector';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const TIMEZONE_OPTIONS = [
    'GMT+5:30 (IST - India)',
    'GMT+0:00 (UTC / London)',
    'GMT+4:00 (GST - Dubai)',
    'GMT-5:00 (EST - New York)',
    'GMT+8:00 (SGT / HKT)',
    'GMT+1:00 (CET - Berlin/Paris)'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AutomationRuleBuilderModal = () => {
    const { 
        isBuilderOpen, 
        editingAutomation, 
        selectedPreset, 
        closeBuilder, 
        createAutomation, 
        updateAutomation,
        presets 
    } = useWhatsAppAutomationStore();

    const { audiences, groups } = useWhatsAppAudienceStore();
    const { templates } = useWhatsAppTemplateStore();

    // 6-Step Stepper:
    // 1: Details & Preset, 2: Trigger & Conditions, 3: Audience, 4: Template & Mapping, 5: Schedule, 6: Review
    const [currentStep, setCurrentStep] = useState(1);

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('custom');

    // Step 2: Trigger & Conditions
    const [triggerType, setTriggerType] = useState('SCHEDULE_RECURRING'); 
    // 'SCHEDULE_ANNUAL' | 'SCHEDULE_ONCE' | 'SCHEDULE_RECURRING' | 'EVENT_RELATIVE' | 'EXTERNAL_EVENT'
    const [offsetValue, setOffsetValue] = useState(24);
    const [offsetUnit, setOffsetUnit] = useState('hours'); // 'minutes' | 'hours' | 'days'
    const [offsetDirection, setOffsetDirection] = useState('before'); // 'before' | 'after' | 'on'
    const [relativeEvent, setRelativeEvent] = useState('appointment.datetime');
    const [externalEventCode, setExternalEventCode] = useState('crm.appointment_rescheduled');

    // Step 3: Audience
    const [selectedGroup, setSelectedGroup] = useState('All Contacts');

    // Step 4: Template & Variable Mapping
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [variableMappings, setVariableMappings] = useState({});

    // Step 5: Schedule & Frequency
    const [scheduleTime, setScheduleTime] = useState('09:00');
    const [timezone, setTimezone] = useState('GMT+5:30 (IST - India)');
    const [recurringFreq, setRecurringFreq] = useState('Daily'); // 'Daily' | 'Weekly' | 'Monthly' | 'Annual' | 'Once'
    const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const [monthlyDay, setMonthlyDay] = useState('1');
    const [onceDate, setOnceDate] = useState('');
    const [hasEndDate, setHasEndDate] = useState(false);
    const [endDate, setEndDate] = useState('');

    // Errors
    const [errors, setErrors] = useState({});

    // Initialize or populate from editing record / preset
    useEffect(() => {
        if (editingAutomation) {
            setName(editingAutomation.name || '');
            setDescription(editingAutomation.description || '');
            setSelectedType(editingAutomation.type || 'custom');
            setTriggerType(editingAutomation.triggerType || 'SCHEDULE_RECURRING');

            // Conditions
            const cond = editingAutomation.conditions || {};
            setOffsetValue(cond.offsetValue || 24);
            setOffsetUnit(cond.offsetUnit || 'hours');
            setOffsetDirection(cond.offsetDirection || 'before');
            setRelativeEvent(cond.event || 'appointment.datetime');
            setExternalEventCode(cond.eventCode || 'crm.appointment_rescheduled');

            // Audience
            setSelectedGroup(editingAutomation.audienceConfig?.group || 'All Contacts');

            // Template
            setSelectedTemplateId(editingAutomation.templateId || null);
            const mapObj = {};
            (editingAutomation.variableMappings || []).forEach(m => {
                mapObj[m.key] = {
                    source: m.source || 'name',
                    customValue: m.customValue || '',
                    fallback: m.fallback || ''
                };
            });
            setVariableMappings(mapObj);

            // Schedule
            const sched = editingAutomation.schedule || {};
            setScheduleTime(sched.time || '09:00');
            setTimezone(sched.timezone || 'GMT+5:30 (IST - India)');
            setRecurringFreq(sched.frequency || 'Daily');
            setCurrentStep(1);
            setErrors({});
        } else if (selectedPreset) {
            // Preload preset configuration
            setName(selectedPreset.name);
            setDescription(selectedPreset.description);
            setSelectedType(selectedPreset.id);
            setTriggerType(selectedPreset.defaultTrigger);
            if (selectedPreset.defaultTime) setScheduleTime(selectedPreset.defaultTime);

            if (selectedPreset.defaultOffset) {
                setOffsetValue(selectedPreset.defaultOffset.value);
                setOffsetUnit(selectedPreset.defaultOffset.unit);
                setOffsetDirection(selectedPreset.defaultOffset.direction);
            }

            if (selectedPreset.eventField) {
                if (selectedPreset.defaultTrigger === 'EXTERNAL_EVENT') {
                    setExternalEventCode(selectedPreset.eventField);
                } else {
                    setRelativeEvent(selectedPreset.eventField);
                }
            }

            // Auto-match template from presets
            const matchedTpl = templates.find(t => 
                t.status === 'Approved' && 
                (t.name === selectedPreset.suggestedTemplateName || t.category === selectedPreset.suggestedTemplateCategory)
            );
            if (matchedTpl) {
                setSelectedTemplateId(matchedTpl.id);
            }

            setCurrentStep(1);
            setErrors({});
        } else {
            // Defaults for new rule
            setName('');
            setDescription('');
            setSelectedType('custom');
            setTriggerType('SCHEDULE_RECURRING');
            setOffsetValue(24);
            setOffsetUnit('hours');
            setOffsetDirection('before');
            setRelativeEvent('appointment.datetime');
            setExternalEventCode('crm.appointment_rescheduled');
            setSelectedGroup('All Contacts');
            setSelectedTemplateId(null);
            setVariableMappings({});
            setScheduleTime('09:00');
            setTimezone('GMT+5:30 (IST - India)');
            setRecurringFreq('Daily');
            setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setOnceDate(tomorrow.toISOString().split('T')[0]);

            setCurrentStep(1);
            setErrors({});
        }
    }, [editingAutomation, selectedPreset, isBuilderOpen, templates]);

    const activeTemplate = templates.find(t => t.id === selectedTemplateId);

    // Extract dynamic variables {{1}}, {{2}} from active template body
    const templateVariableKeys = activeTemplate
        ? Array.from(new Set(
            ((activeTemplate.body || '').match(/\{\{(\d+)\}\}/g) || []).map(m => m.replace(/\D/g, ''))
          )).sort((a, b) => Number(a) - Number(b))
        : [];

    useEffect(() => {
        if (templateVariableKeys.length > 0) {
            setVariableMappings(prev => {
                const next = { ...prev };
                templateVariableKeys.forEach(k => {
                    if (!next[k]) {
                        next[k] = {
                            source: k === '1' ? 'name' : 'custom',
                            customValue: '',
                            fallback: k === '1' ? 'Student' : ''
                        };
                    }
                });
                return next;
            });
        }
    }, [selectedTemplateId]);

    if (!isBuilderOpen) return null;

    // Audience calculation
    const matchedAudience = selectedGroup === 'All Contacts'
        ? audiences
        : audiences.filter(a => a.group === selectedGroup);

    // Validation per step
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!name.trim()) newErrors.name = 'Automation name is required.';
        } else if (step === 2) {
            if (triggerType === 'EVENT_RELATIVE' && (!offsetValue || offsetValue <= 0)) {
                newErrors.offsetValue = 'Please enter a valid offset value greater than 0.';
            }
        } else if (step === 4) {
            if (!selectedTemplateId) {
                newErrors.template = 'Please select an approved WhatsApp template.';
            } else {
                templateVariableKeys.forEach(k => {
                    const m = variableMappings[k];
                    if (m?.source === 'custom' && !m.customValue?.trim()) {
                        newErrors[`var_${k}`] = `Please configure value for {{${k}}}.`;
                    }
                });
            }
        } else if (step === 5) {
            if (triggerType === 'SCHEDULE_ONCE' && !onceDate) {
                newErrors.onceDate = 'Please select scheduled execution date.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const handleBack = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handlePresetSelect = (preset) => {
        setSelectedType(preset.id);
        setName(preset.name);
        setDescription(preset.description);
        setTriggerType(preset.defaultTrigger);
        if (preset.defaultTime) setScheduleTime(preset.defaultTime);

        if (preset.defaultOffset) {
            setOffsetValue(preset.defaultOffset.value);
            setOffsetUnit(preset.defaultOffset.unit);
            setOffsetDirection(preset.defaultOffset.direction);
        }

        const matchedTpl = templates.find(t => 
            t.status === 'Approved' && 
            (t.name === preset.suggestedTemplateName || t.category === preset.suggestedTemplateCategory)
        );
        if (matchedTpl) {
            setSelectedTemplateId(matchedTpl.id);
        }
    };

    // Calculate next execution timestamp preview
    const calculateNextExecution = () => {
        const [hh, mm] = scheduleTime.split(':');
        const next = new Date();
        next.setHours(parseInt(hh || '9', 10), parseInt(mm || '0', 10), 0, 0);

        if (triggerType === 'SCHEDULE_ONCE' && onceDate) {
            return `${onceDate} at ${scheduleTime} (${timezone.split(' ')[0]})`;
        }
        if (triggerType === 'SCHEDULE_ANNUAL') {
            return `Daily DOB scan at ${scheduleTime} (${timezone.split(' ')[0]})`;
        }
        if (triggerType === 'EVENT_RELATIVE') {
            return `${offsetValue} ${offsetUnit} ${offsetDirection} trigger event`;
        }
        if (triggerType === 'EXTERNAL_EVENT') {
            return `Instant upon '${externalEventCode}'`;
        }

        // Daily / Weekly recurring
        if (next < new Date()) {
            next.setDate(next.getDate() + 1);
        }
        return `${next.toLocaleDateString()} at ${scheduleTime} (${timezone.split(' ')[0]})`;
    };

    // Build sample mapped variables for live preview
    const sampleRecipient = matchedAudience[0] || { name: 'Aarav Patel', phone: '+91 98765 43210' };
    const renderedCustomVariables = templateVariableKeys.map(k => {
        const m = variableMappings[k] || {};
        let val = '';
        if (m.source === 'name') val = sampleRecipient.name || m.fallback || 'Applicant';
        else if (m.source === 'phone') val = sampleRecipient.phone || m.fallback || '';
        else if (m.source === 'email') val = sampleRecipient.email || m.fallback || '';
        else if (m.source === 'city') val = sampleRecipient.city || m.fallback || '';
        else if (m.source === 'dob') val = sampleRecipient.dob || m.fallback || '';
        else val = m.customValue || m.fallback || `[Value {{${k}}}]`;

        return { key: k, sample: val };
    });

    const handleSave = (statusToSave = 'Active') => {
        if (statusToSave === 'Active' && !validateStep(currentStep)) return;

        const mappingsArray = templateVariableKeys.map(k => ({
            key: k,
            source: variableMappings[k]?.source || 'custom',
            customValue: variableMappings[k]?.customValue || '',
            fallback: variableMappings[k]?.fallback || ''
        }));

        const rulePayload = {
            name: name.trim() || 'Untitled Automation',
            description: description.trim(),
            type: selectedType,
            triggerType,
            conditions: {
                offsetValue,
                offsetUnit,
                offsetDirection,
                event: relativeEvent,
                eventCode: externalEventCode,
                timezone,
                selectedDays,
                monthlyDay,
                onceDate
            },
            audienceConfig: {
                source: 'CRM_AUDIENCE',
                group: selectedGroup,
                targetCount: matchedAudience.length
            },
            templateId: selectedTemplateId,
            templateName: activeTemplate?.name || 'WhatsApp Template',
            templateCategory: activeTemplate?.category || 'Marketing',
            templateSnapshot: activeTemplate ? {
                header: activeTemplate.header,
                body: activeTemplate.body,
                footer: activeTemplate.footer,
                buttons: activeTemplate.buttons
            } : null,
            variableMappings: mappingsArray,
            schedule: {
                time: scheduleTime,
                timezone,
                frequency: triggerType === 'SCHEDULE_ANNUAL' ? 'Annual' : recurringFreq,
                nextExecutionAt: calculateNextExecution()
            },
            status: statusToSave
        };

        if (editingAutomation) {
            updateAutomation(editingAutomation.id, rulePayload);
        } else {
            createAutomation(rulePayload);
        }

        closeBuilder();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#8B5CF6]" />
                            {editingAutomation ? 'Edit Automation Trigger Rule' : 'Create Automation Rule'}
                        </h2>
                        <p className="text-xs text-slate-400">
                            Configure automated WhatsApp broadcasts triggered by schedules, customer dates, or milestone events.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeBuilder}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Stepper Navigation */}
                <div className="px-6 py-3 bg-[#16181D] border-b border-[#2D333B] overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[620px]">
                        {[
                            { num: 1, label: 'Details & Preset' },
                            { num: 2, label: 'Trigger & Conditions' },
                            { num: 3, label: 'Audience' },
                            { num: 4, label: 'Template & Mapping' },
                            { num: 5, label: 'Schedule' },
                            { num: 6, label: 'Review & Activate' }
                        ].map((step, idx) => {
                            const isDone = currentStep > step.num;
                            const isActive = currentStep === step.num;
                            return (
                                <React.Fragment key={step.num}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (step.num < currentStep) setCurrentStep(step.num);
                                        }}
                                        disabled={step.num > currentStep}
                                        className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                                            isActive
                                                ? 'text-[#8B5CF6] font-bold'
                                                : isDone
                                                    ? 'text-emerald-400 cursor-pointer'
                                                    : 'text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                                            isActive
                                                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                                                : isDone
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                    : 'bg-[#1C1F26] text-slate-500 border-[#2D333B]'
                                        }`}>
                                            {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                                        </div>
                                        <span>{step.label}</span>
                                    </button>
                                    {idx < 5 && (
                                        <div className={`h-[2px] flex-1 mx-2.5 ${
                                            currentStep > idx + 1 ? 'bg-emerald-500/40' : 'bg-[#2D333B]'
                                        }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* STEP 1: Details & Presets */}
                    {currentStep === 1 && (
                        <div className="space-y-6 max-w-3xl mx-auto py-1">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 1: Basic Details &amp; Automation Preset</h3>
                                <p className="text-xs text-slate-400">Choose a prebuilt automation workflow or build custom logic from scratch.</p>
                            </div>

                            {/* Preset Selection Grid */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    Prebuilt Automation Presets
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {presets.map(p => {
                                        const isSelected = selectedType === p.id;
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => handlePresetSelect(p)}
                                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                                        : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs font-bold text-white">{p.name}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111318] text-[#8B5CF6] font-semibold border border-[#2D333B]">
                                                        {p.badge}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 line-clamp-2">
                                                    {p.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Automation Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Automation Rule Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                                    }}
                                    placeholder="e.g. Automated Birthday Wishes Engine"
                                    className={`w-full bg-[#1C1F26] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                                        errors.name ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Internal Description / Rule Notes <span className="text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    placeholder="Specify rule intent, targeting criteria, or business context..."
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Trigger & Conditions */}
                    {currentStep === 2 && (
                        <div className="space-y-6 max-w-3xl mx-auto py-1">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 2: Trigger Type &amp; Conditions</h3>
                                <p className="text-xs text-slate-400">Select what event or schedule activates this automation.</p>
                            </div>

                            {/* Trigger Type Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: 'SCHEDULE_ANNUAL', title: 'Annual Customer Date', desc: 'Evaluates customer DOB or anniversary dates annually' },
                                    { id: 'EVENT_RELATIVE', title: 'Before / After Event Offset', desc: 'Triggers X hours or days before/after appointment or payment' },
                                    { id: 'EXTERNAL_EVENT', title: 'External System Event', desc: 'Instant dispatch on webhook/CRM status change' },
                                    { id: 'SCHEDULE_RECURRING', title: 'Recurring Daily / Weekly', desc: 'Standard recurring schedule on fixed days or time' },
                                    { id: 'SCHEDULE_ONCE', title: 'Specific Date & Time', desc: 'Single fixed-date holiday or one-time festival broadcast' }
                                ].map(t => {
                                    const isSelected = triggerType === t.id;
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => setTriggerType(t.id)}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                                    : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-white">{t.title}</span>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                                            </div>
                                            <p className="text-[11px] text-slate-400">{t.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Specific Condition Configuration */}
                            <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B] space-y-4">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-[#8B5CF6]" />
                                    Trigger Condition Settings
                                </h4>

                                {triggerType === 'EVENT_RELATIVE' && (
                                    <div className="space-y-4 text-xs">
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
                                                    <option value="minutes">Minutes</option>
                                                    <option value="hours">Hours</option>
                                                    <option value="days">Days</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 mb-1">Direction</label>
                                                <select
                                                    value={offsetDirection}
                                                    onChange={(e) => setOffsetDirection(e.target.value)}
                                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                                >
                                                    <option value="before">Before Event</option>
                                                    <option value="after">After Event</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-slate-400 mb-1">Target Milestone Event</label>
                                            <select
                                                value={relativeEvent}
                                                onChange={(e) => setRelativeEvent(e.target.value)}
                                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                            >
                                                <option value="appointment.datetime">Counseling / Interview Appointment Slot</option>
                                                <option value="payment.due_date">Tuition Fee Invoice Due Date</option>
                                                <option value="visa.submission_deadline">Visa Application Submission Deadline</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {triggerType === 'EXTERNAL_EVENT' && (
                                    <div className="space-y-3 text-xs">
                                        <label className="block text-slate-400">Simulated Webhook / External Event Code</label>
                                        <select
                                            value={externalEventCode}
                                            onChange={(e) => setExternalEventCode(e.target.value)}
                                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none font-mono"
                                        >
                                            <option value="crm.appointment_rescheduled">crm.appointment_rescheduled</option>
                                            <option value="crm.appointment_cancelled">crm.appointment_cancelled</option>
                                            <option value="crm.appointment_status_missed">crm.appointment_status_missed</option>
                                            <option value="crm.payment_received">crm.payment_received</option>
                                            <option value="crm.lead_created">crm.lead_created</option>
                                        </select>
                                        <p className="text-[11px] text-slate-500">
                                            This event code can be triggered from external CRM webhooks or simulated directly from the demo action bar.
                                        </p>
                                    </div>
                                )}

                                {triggerType === 'SCHEDULE_ANNUAL' && (
                                    <div className="text-xs text-slate-400 space-y-2">
                                        <p>Evaluates customer records against their <strong className="text-white">Date of Birth (DOB)</strong> attribute.</p>
                                        <p className="text-[11px] text-slate-500">
                                            The engine checks daily whether today matches month and day of DOB, enforcing duplicate protection for each annual occurrence.
                                        </p>
                                    </div>
                                )}

                                {triggerType === 'SCHEDULE_ONCE' && (
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <label className="block text-slate-400 mb-1">Execution Date</label>
                                            <input
                                                type="date"
                                                value={onceDate}
                                                onChange={(e) => setOnceDate(e.target.value)}
                                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 mb-1">Execution Time</label>
                                            <input
                                                type="time"
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {triggerType === 'SCHEDULE_RECURRING' && (
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <label className="block text-slate-400 mb-1">Recurrence Frequency</label>
                                            <select
                                                value={recurringFreq}
                                                onChange={(e) => setRecurringFreq(e.target.value)}
                                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-3 py-1.5 text-white outline-none"
                                            >
                                                <option value="Daily">Daily</option>
                                                <option value="Weekly">Weekly (Specific Days)</option>
                                                <option value="Monthly">Monthly</option>
                                            </select>
                                        </div>

                                        {recurringFreq === 'Weekly' && (
                                            <div>
                                                <label className="block text-slate-400 mb-1">Active Days of Week</label>
                                                <div className="flex gap-2">
                                                    {WEEKDAYS.map(day => {
                                                        const active = selectedDays.includes(day);
                                                        return (
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedDays(prev => 
                                                                        active ? prev.filter(d => d !== day) : [...prev, day]
                                                                    );
                                                                }}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                                    active 
                                                                        ? 'bg-[#8B5CF6] text-white' 
                                                                        : 'bg-[#1C1F26] text-slate-400 border border-[#2D333B]'
                                                                }`}
                                                            >
                                                                {day}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Audience Configuration */}
                    {currentStep === 3 && (
                        <div className="space-y-6 max-w-3xl mx-auto py-1">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 3: Audience Eligibility</h3>
                                <p className="text-xs text-slate-400">Select which customer contact group this trigger rule monitors.</p>
                            </div>

                            <div className="bg-[#111318] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                                <label className="block text-xs font-semibold text-slate-300">
                                    Target Customer Group
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {groups.map(group => {
                                        const count = group === 'All Contacts' 
                                            ? audiences.length 
                                            : audiences.filter(a => a.group === group).length;
                                        const isSelected = selectedGroup === group;
                                        return (
                                            <div
                                                key={group}
                                                onClick={() => setSelectedGroup(group)}
                                                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                                                        : 'bg-[#1C1F26] border-[#2D333B] text-slate-300 hover:border-slate-500'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold">{group}</span>
                                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#111318] text-slate-400 border border-[#2D333B]">
                                                        {count}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="p-3.5 bg-[#1C1F26] rounded-xl border border-[#2D333B] text-xs text-slate-300 flex items-center justify-between">
                                    <span>Selected Contacts: <strong className="text-white">{matchedAudience.length}</strong></span>
                                    <span className="text-slate-500 text-[11px]">Enforces duplicate checks per contact per occurrence</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Template & Variable Mapping */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 4: Select Template &amp; Variable Mapping</h3>
                                <p className="text-xs text-slate-400">
                                    Select an approved WhatsApp template and map dynamic variables to customer fields or fallback strings.
                                </p>
                            </div>

                            <WhatsAppTemplateSelector
                                selectedTemplateId={selectedTemplateId}
                                onSelectTemplate={(tpl) => {
                                    setSelectedTemplateId(tpl.id);
                                    if (errors.template) setErrors(prev => ({ ...prev, template: null }));
                                }}
                                approvedOnly={true}
                            />

                            {errors.template && (
                                <p className="text-rose-400 text-xs flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.template}
                                </p>
                            )}

                            {activeTemplate && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#2D333B]">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                            Dynamic Variables ({templateVariableKeys.length})
                                        </h4>

                                        {templateVariableKeys.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                                                This template has no variable placeholders. Message will be dispatched as standard text.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {templateVariableKeys.map(k => {
                                                    const cur = variableMappings[k] || { source: 'custom', customValue: '', fallback: '' };
                                                    const hasErr = errors[`var_${k}`];
                                                    return (
                                                        <div key={k} className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] space-y-2 text-xs">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-mono font-bold text-[#8B5CF6]">Placeholder: {`{{${k}}}`}</span>
                                                                <div className="flex gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setVariableMappings(prev => ({ ...prev, [k]: { ...prev[k], source: 'name' } }))}
                                                                        className={`px-2 py-0.5 rounded text-[11px] ${cur.source !== 'custom' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1C1F26] text-slate-400'}`}
                                                                    >
                                                                        Customer Field
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setVariableMappings(prev => ({ ...prev, [k]: { ...prev[k], source: 'custom' } }))}
                                                                        className={`px-2 py-0.5 rounded text-[11px] ${cur.source === 'custom' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1C1F26] text-slate-400'}`}
                                                                    >
                                                                        Static / Custom
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {cur.source !== 'custom' ? (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="text-[10px] text-slate-400 block mb-1">Field</label>
                                                                        <select
                                                                            value={cur.source}
                                                                            onChange={(e) => setVariableMappings(prev => ({ ...prev, [k]: { ...prev[k], source: e.target.value } }))}
                                                                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1 text-white outline-none"
                                                                        >
                                                                            <option value="name">Customer Name</option>
                                                                            <option value="phone">Phone Number</option>
                                                                            <option value="city">City</option>
                                                                            <option value="dob">Date of Birth</option>
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[10px] text-slate-400 block mb-1">Fallback Value</label>
                                                                        <input
                                                                            type="text"
                                                                            value={cur.fallback || ''}
                                                                            onChange={(e) => setVariableMappings(prev => ({ ...prev, [k]: { ...prev[k], fallback: e.target.value } }))}
                                                                            placeholder="e.g. Applicant"
                                                                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1 text-white outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <label className="text-[10px] text-slate-400 block mb-1">Custom Text</label>
                                                                    <input
                                                                        type="text"
                                                                        value={cur.customValue || ''}
                                                                        onChange={(e) => {
                                                                            setVariableMappings(prev => ({ ...prev, [k]: { ...prev[k], customValue: e.target.value } }));
                                                                            if (hasErr) setErrors(prev => ({ ...prev, [`var_${k}`]: null }));
                                                                        }}
                                                                        placeholder="e.g. 25% discount, BDAY2026, or Tomorrow at 10:00 AM"
                                                                        className={`w-full bg-[#1C1F26] border rounded-lg px-2.5 py-1 text-white outline-none ${hasErr ? 'border-rose-500' : 'border-[#2D333B]'}`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-[#25D366]" />
                                            Sample Message Preview
                                        </h4>
                                        <WhatsAppTemplatePreview
                                            template={activeTemplate}
                                            customVariables={renderedCustomVariables}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: Schedule Configuration */}
                    {currentStep === 5 && (
                        <div className="space-y-6 max-w-3xl mx-auto py-1">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 5: Schedule &amp; Execution Timing</h3>
                                <p className="text-xs text-slate-400">Configure delivery time, timezone, and execution frequency.</p>
                            </div>

                            <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B] space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <label className="block text-slate-300 font-semibold mb-1.5">Daily Execution Time</label>
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-3 py-2 text-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-300 font-semibold mb-1.5">Timezone</label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-3 py-2 text-white outline-none"
                                        >
                                            {TIMEZONE_OPTIONS.map(tz => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Next Execution Preview */}
                                <div className="p-3.5 bg-[#1C1F26] rounded-xl border border-[#2D333B] text-xs flex items-center justify-between">
                                    <span className="text-slate-400">Calculated Next Trigger:</span>
                                    <span className="font-bold text-[#8B5CF6] font-mono">{calculateNextExecution()}</span>
                                </div>

                                {/* Simulation Disclaimer */}
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-200">Frontend Simulation Notice</p>
                                        <p className="text-blue-300/80 text-[11px]">
                                            Automation scheduling and trigger evaluations are executed client-side. The engine triggers simulated dispatches during active browser sessions and supports one-click demo triggers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: Review & Activate */}
                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 6: Review &amp; Activation</h3>
                                <p className="text-xs text-slate-400">Review complete trigger parameters before activating the automation engine.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-[#111318] p-5 rounded-2xl border border-[#2D333B] space-y-3 text-xs">
                                        <h4 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#8B5CF6]" />
                                            Rule Configuration Summary
                                        </h4>
                                        <div className="divide-y divide-[#2D333B]/50">
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Rule Name:</span>
                                                <span className="font-semibold text-white">{name}</span>
                                            </div>
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Automation Type:</span>
                                                <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-semibold text-[11px]">
                                                    {selectedType}
                                                </span>
                                            </div>
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Trigger Type:</span>
                                                <span className="font-semibold text-white">{triggerType}</span>
                                            </div>
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Target Audience:</span>
                                                <span className="font-semibold text-white">{selectedGroup} ({matchedAudience.length} contacts)</span>
                                            </div>
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Approved Template:</span>
                                                <span className="font-semibold text-[#25D366]">{activeTemplate?.name}</span>
                                            </div>
                                            <div className="py-2 flex justify-between">
                                                <span className="text-slate-400">Next Occurrence:</span>
                                                <span className="font-semibold text-white font-mono">{calculateNextExecution()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 space-y-1.5">
                                        <p className="font-bold flex items-center gap-1.5 text-emerald-200">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            Idempotency &amp; Duplicate Protection Active
                                        </p>
                                        <p className="text-[11px] text-emerald-300/80">
                                            The engine automatically suppresses duplicate broadcasts to the same contact for the same calendar date or event milestone.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-[#25D366]" />
                                        Sample Outgoing Message Preview
                                    </h4>
                                    <WhatsAppTemplatePreview
                                        template={activeTemplate}
                                        customVariables={renderedCustomVariables}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleSave('Draft')}
                            className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                            Save as Draft
                        </button>

                        {currentStep < 6 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white transition-all shadow-lg shadow-[#8B5CF6]/20"
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleSave('Active')}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-xs font-bold text-white transition-all shadow-lg shadow-[#25D366]/20"
                            >
                                <Zap className="w-4 h-4" />
                                Activate Automation Rule
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationRuleBuilderModal;
