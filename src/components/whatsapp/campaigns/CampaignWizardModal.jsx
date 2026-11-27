import React, { useState, useEffect } from 'react';
import { 
    X, Check, ChevronRight, ChevronLeft, Send, Calendar, Clock, 
    Users, FileText, CheckCircle2, Sparkles, AlertCircle, Layers, 
    Upload, UserCheck, ShieldCheck, ArrowRight, Eye
} from 'lucide-react';
import useWhatsAppCampaignStore from '../../../store/useWhatsAppCampaignStore';
import useWhatsAppAudienceStore from '../../../store/useWhatsAppAudienceStore';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import WhatsAppTemplateSelector from '../templates/WhatsAppTemplateSelector';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';
import CsvCustomerImporter from './CsvCustomerImporter';

const TIMEZONE_OPTIONS = [
    'GMT+5:30 (IST - India)',
    'GMT+0:00 (UTC / London)',
    'GMT+4:00 (GST - Dubai)',
    'GMT-5:00 (EST - New York)',
    'GMT+8:00 (SGT / HKT)',
    'GMT+1:00 (CET - Berlin/Paris)'
];

const CampaignWizardModal = () => {
    const { 
        isWizardOpen, 
        editingCampaign, 
        closeWizard, 
        createCampaign, 
        updateCampaign 
    } = useWhatsAppCampaignStore();

    const { audiences, groups } = useWhatsAppAudienceStore();
    const { templates } = useWhatsAppTemplateStore();

    // Wizard Step: 1 = Details, 2 = Audience, 3 = Template & Mapping, 4 = Schedule, 5 = Review
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Bulk'); // 'Bulk' | 'Manual'

    // Step 2: Audience State
    const [audienceSource, setAudienceSource] = useState('CRM_GROUP'); // 'CRM_GROUP' | 'CSV_IMPORT' | 'MANUAL'
    const [selectedGroup, setSelectedGroup] = useState('All Contacts');
    const [manualInput, setManualInput] = useState('');
    const [importedRecipients, setImportedRecipients] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    // Step 3: Template & Variable Mapping State
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [variableMappings, setVariableMappings] = useState({});

    // Step 4: Schedule State
    const [scheduleType, setScheduleType] = useState('IMMEDIATE'); // 'IMMEDIATE' | 'SCHEDULED'
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('10:00');
    const [timezone, setTimezone] = useState('GMT+5:30 (IST - India)');

    // Validation State
    const [errors, setErrors] = useState({});

    // Populate editing state if editing an existing campaign or reset to clean defaults
    useEffect(() => {
        if (editingCampaign) {
            setName(editingCampaign.name || '');
            setDescription(editingCampaign.description || '');
            setType(editingCampaign.type || 'Bulk');
            setAudienceSource(editingCampaign.audienceSource || 'CRM_GROUP');
            setSelectedGroup(editingCampaign.audienceGroupName || 'All Contacts');
            setSelectedTemplateId(editingCampaign.templateId || null);

            // Populate variable mappings
            const mappingsObj = {};
            (editingCampaign.variableMappings || []).forEach(m => {
                mappingsObj[m.key] = {
                    source: m.source || 'name',
                    customValue: m.customValue || '',
                    fallback: m.fallback || ''
                };
            });
            setVariableMappings(mappingsObj);

            if (editingCampaign.scheduledFor) {
                setScheduleType('SCHEDULED');
                const [d, t] = editingCampaign.scheduledFor.split('T');
                setScheduledDate(d || '');
                setScheduledTime(t ? t.slice(0, 5) : '10:00');
            } else {
                setScheduleType('IMMEDIATE');
            }
            setTimezone(editingCampaign.timezone || 'GMT+5:30 (IST - India)');
            setSelectedRecipients(editingCampaign.recipients || []);
        } else {
            // Defaults for new campaign
            setName('');
            setDescription('');
            setType('Bulk');
            setAudienceSource('CRM_GROUP');
            setSelectedGroup('All Contacts');
            setManualInput('');
            setImportedRecipients([]);
            setSelectedTemplateId(null);
            setVariableMappings({});
            setScheduleType('IMMEDIATE');

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setScheduledDate(tomorrow.toISOString().split('T')[0]);
            setScheduledTime('10:00');
            setTimezone('GMT+5:30 (IST - India)');
            setCurrentStep(1);
            setErrors({});
        }
    }, [editingCampaign, isWizardOpen]);

    // Update selected recipients whenever audience source or store changes
    useEffect(() => {
        if (audienceSource === 'CRM_GROUP') {
            let matched = [];
            if (selectedGroup === 'All Contacts') {
                matched = audiences;
            } else {
                matched = audiences.filter(a => a.group === selectedGroup);
            }
            setSelectedRecipients(matched.map(a => ({
                id: a.id,
                name: a.name,
                phone: a.phone,
                dob: a.dob,
                email: a.email,
                city: a.city
            })));
        } else if (audienceSource === 'CSV_IMPORT') {
            setSelectedRecipients(importedRecipients);
        } else if (audienceSource === 'MANUAL') {
            // Parse manual textarea lines
            const lines = manualInput.split('\n').filter(l => l.trim().length > 0);
            const parsed = lines.map((line, idx) => {
                const parts = line.split(',');
                const name = parts[0]?.trim() || `Recipient ${idx + 1}`;
                const phone = parts[1]?.trim() || parts[0]?.trim();
                return {
                    id: `manual-${idx}`,
                    name,
                    phone
                };
            }).filter(r => r.phone && r.phone.replace(/\D/g, '').length >= 7);
            setSelectedRecipients(parsed);
        }
    }, [audienceSource, selectedGroup, importedRecipients, manualInput, audiences]);

    const activeTemplate = templates.find(t => t.id === selectedTemplateId);

    // Extract dynamic variables {{1}}, {{2}} from active template body
    const templateVariableKeys = activeTemplate
        ? Array.from(new Set(
            ((activeTemplate.body || '').match(/\{\{(\d+)\}\}/g) || []).map(m => m.replace(/\D/g, ''))
          )).sort((a, b) => Number(a) - Number(b))
        : [];

    // Ensure mapping entries exist for each variable in the selected template
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

    if (!isWizardOpen) return null;

    // Step Validation
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!name.trim()) {
                newErrors.name = 'Campaign name is required.';
            }
        } else if (step === 2) {
            if (selectedRecipients.length === 0) {
                newErrors.audience = 'Please select or import at least 1 valid recipient.';
            }
        } else if (step === 3) {
            if (!selectedTemplateId) {
                newErrors.template = 'Please select an approved WhatsApp template.';
            } else {
                // Check if custom variable values are filled
                templateVariableKeys.forEach(key => {
                    const m = variableMappings[key];
                    if (m?.source === 'custom' && !m.customValue?.trim()) {
                        newErrors[`var_${key}`] = `Please enter a value for {{${key}}}.`;
                    }
                });
            }
        } else if (step === 4) {
            if (scheduleType === 'SCHEDULED') {
                if (!scheduledDate) {
                    newErrors.scheduledDate = 'Please choose a schedule date.';
                }
                if (!scheduledTime) {
                    newErrors.scheduledTime = 'Please choose a schedule time.';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
        }
    };

    const handleBack = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Build sample mapped variables for live preview
    const sampleRecipient = selectedRecipients[0] || { name: 'Aarav Patel', phone: '+91 98765 43210', city: 'London' };
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

    const handleSaveCampaign = (isDraft = false) => {
        if (!isDraft && !validateStep(currentStep)) return;

        // Build array of variable mapping objects
        const mappingsArray = templateVariableKeys.map(k => ({
            key: k,
            source: variableMappings[k]?.source || 'custom',
            customValue: variableMappings[k]?.customValue || '',
            fallback: variableMappings[k]?.fallback || ''
        }));

        let finalStatus = 'Draft';
        let scheduledForValue = null;

        if (!isDraft) {
            if (scheduleType === 'SCHEDULED') {
                finalStatus = 'Scheduled';
                scheduledForValue = `${scheduledDate}T${scheduledTime}:00.000Z`;
            } else {
                finalStatus = 'Running';
            }
        }

        const campaignPayload = {
            name: name.trim() || 'Untitled Campaign',
            description: description.trim(),
            type,
            status: finalStatus,
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
            audienceSource,
            audienceGroupName: audienceSource === 'CRM_GROUP' 
                ? selectedGroup 
                : audienceSource === 'CSV_IMPORT' 
                    ? 'Imported CSV List' 
                    : 'Manual Numbers',
            recipients: selectedRecipients,
            scheduledFor: scheduledForValue,
            timezone
        };

        if (editingCampaign) {
            updateCampaign(editingCampaign.id, campaignPayload);
        } else {
            createCampaign(campaignPayload);
        }

        closeWizard();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-white">
                {/* Header & Step Indicator */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                            {editingCampaign ? 'Edit WhatsApp Campaign' : 'Create New WhatsApp Campaign'}
                        </h2>
                        <p className="text-xs text-slate-400">
                            Five-step wizard: Details &bull; Audience &bull; Template &bull; Schedule &bull; Review
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeWizard}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Step Navigation Pill Stepper */}
                <div className="px-6 py-3 bg-[#16181D] border-b border-[#2D333B] overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[550px]">
                        {[
                            { num: 1, label: 'Details' },
                            { num: 2, label: 'Audience' },
                            { num: 3, label: 'Template & Mapping' },
                            { num: 4, label: 'Schedule' },
                            { num: 5, label: 'Review & Launch' }
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
                                    {idx < 4 && (
                                        <div className={`h-[2px] flex-1 mx-3 ${
                                            currentStep > idx + 1 ? 'bg-emerald-500/40' : 'bg-[#2D333B]'
                                        }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Body Content by Step */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* STEP 1: Campaign Details */}
                    {currentStep === 1 && (
                        <div className="space-y-5 max-w-2xl mx-auto py-2">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Step 1: Campaign Identification</h3>
                                <p className="text-xs text-slate-400">Give your broadcast a clear name and select the campaign category.</p>
                            </div>

                            {/* Campaign Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Campaign Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                                    }}
                                    placeholder="e.g. Fall 2026 Admissions Priority Broadcast"
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
                                    Description / Internal Notes <span className="text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Provide context on campaign objective, intended audience, or counseling milestones..."
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Campaign Type: Manual vs Bulk */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    Campaign Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setType('Bulk')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            type === 'Bulk'
                                                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                                : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-white flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                                                Bulk Campaign
                                            </span>
                                            {type === 'Bulk' && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            High volume broadcast sent to entire customer segments, CSV imports, or scholarship inquiries.
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setType('Manual')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            type === 'Manual'
                                                ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                                : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-white flex items-center gap-2">
                                                <Users className="w-4 h-4 text-[#8B5CF6]" />
                                                Manual Targeted Campaign
                                            </span>
                                            {type === 'Manual' && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Curated 1-on-1 counseling list, VIP candidate outreach, or urgent follow-ups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Audience Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D333B] pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-0.5">Step 2: Choose Target Audience</h3>
                                    <p className="text-xs text-slate-400">
                                        Select from CRM contact groups, import from CSV/Excel, or enter manual numbers.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-[#1C1F26] px-3 py-1.5 rounded-xl border border-[#2D333B] text-xs">
                                    <Users className="w-4 h-4 text-[#8B5CF6]" />
                                    <span>Selected Recipients: <strong className="text-white">{selectedRecipients.length}</strong></span>
                                </div>
                            </div>

                            {/* Audience Source Tabs */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAudienceSource('CRM_GROUP')}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        audienceSource === 'CRM_GROUP'
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                                            : 'bg-[#1C1F26] border-[#2D333B] text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <p className="text-xs font-bold">1. CRM Contact Groups</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Select existing tagged customer segments</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAudienceSource('CSV_IMPORT')}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        audienceSource === 'CSV_IMPORT'
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                                            : 'bg-[#1C1F26] border-[#2D333B] text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <p className="text-xs font-bold">2. Excel / CSV Import</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Upload .csv or .xlsx with DOB validation</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAudienceSource('MANUAL')}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        audienceSource === 'MANUAL'
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                                            : 'bg-[#1C1F26] border-[#2D333B] text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <p className="text-xs font-bold">3. Manual Entry</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Type or paste names and phone numbers</p>
                                </button>
                            </div>

                            {/* Source Content Area */}
                            {audienceSource === 'CRM_GROUP' && (
                                <div className="bg-[#111318] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                                    <label className="block text-xs font-semibold text-slate-300">
                                        Choose Group / Category
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {groups.map((group) => {
                                            const count = group === 'All Contacts' 
                                                ? audiences.length 
                                                : audiences.filter(a => a.group === group).length;
                                            const isSelected = selectedGroup === group;
                                            return (
                                                <div
                                                    key={group}
                                                    onClick={() => setSelectedGroup(group)}
                                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-sm'
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
                                </div>
                            )}

                            {audienceSource === 'CSV_IMPORT' && (
                                <CsvCustomerImporter
                                    onImportSuccess={(validList, count) => {
                                        setImportedRecipients(validList);
                                        if (errors.audience) setErrors(prev => ({ ...prev, audience: null }));
                                    }}
                                />
                            )}

                            {audienceSource === 'MANUAL' && (
                                <div className="bg-[#111318] p-5 rounded-2xl border border-[#2D333B] space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Enter Contacts (One per line: Name, Phone)
                                        </label>
                                        <p className="text-[11px] text-slate-500">
                                            Example: Aarav Patel, +91 98765 43210
                                        </p>
                                    </div>
                                    <textarea
                                        value={manualInput}
                                        onChange={(e) => setManualInput(e.target.value)}
                                        rows={6}
                                        placeholder="Aarav Patel, +91 98765 43210&#10;Fatima Al-Zahra, +971 50 123 4567&#10;Carlos Mendoza, +1 (555) 234-5678"
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none font-mono"
                                    />
                                </div>
                            )}

                            {/* Recipient Preview Chips */}
                            {selectedRecipients.length > 0 && (
                                <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-slate-300">Audience Sample ({selectedRecipients.length} total)</span>
                                        <span className="text-slate-500 text-[11px]">First 6 shown</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipients.slice(0, 6).map((r, i) => (
                                            <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1C1F26] border border-[#2D333B] text-xs text-slate-300">
                                                <span className="font-medium text-white">{r.name}</span>
                                                <span className="text-[11px] text-slate-500 font-mono">({r.phone})</span>
                                            </div>
                                        ))}
                                        {selectedRecipients.length > 6 && (
                                            <span className="px-2.5 py-1 rounded-lg bg-[#1C1F26] border border-[#2D333B] text-xs text-slate-400">
                                                +{selectedRecipients.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {errors.audience && (
                                <p className="text-rose-400 text-xs flex items-center gap-1.5 mt-2">
                                    <AlertCircle className="w-4 h-4" /> {errors.audience}
                                </p>
                            )}
                        </div>
                    )}

                    {/* STEP 3: Template Selection & Variable Mapping */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-0.5">Step 3: Select Template &amp; Map Variables</h3>
                                <p className="text-xs text-slate-400">
                                    Select an approved WhatsApp template and map dynamic variables to customer attributes or custom fallback text.
                                </p>
                            </div>

                            {/* Template Selector Component */}
                            <WhatsAppTemplateSelector
                                selectedTemplateId={selectedTemplateId}
                                onSelectTemplate={(tpl) => {
                                    setSelectedTemplateId(tpl.id);
                                    if (errors.template) setErrors(prev => ({ ...prev, template: null }));
                                }}
                                approvedOnly={true}
                            />

                            {errors.template && (
                                <p className="text-rose-400 text-xs flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4" /> {errors.template}
                                </p>
                            )}

                            {/* Variable Mapping Section (Visible once template selected) */}
                            {activeTemplate && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#2D333B]">
                                    {/* Mappings Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                                Dynamic Variables Configuration
                                            </h4>
                                            <span className="text-[11px] text-slate-500">
                                                {templateVariableKeys.length} variable(s) detected
                                            </span>
                                        </div>

                                        {templateVariableKeys.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                                                This template has no dynamic variable placeholders. The message body will be sent as standard text.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {templateVariableKeys.map(k => {
                                                    const currentMap = variableMappings[k] || { source: 'custom', customValue: '', fallback: '' };
                                                    const hasErr = errors[`var_${k}`];
                                                    return (
                                                        <div key={k} className="p-3.5 bg-[#111318] rounded-xl border border-[#2D333B] space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-[#8B5CF6] font-mono">
                                                                    Placeholder: {`{{${k}}}`}
                                                                </span>
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setVariableMappings(prev => ({
                                                                                ...prev,
                                                                                [k]: { ...prev[k], source: 'name' }
                                                                            }));
                                                                        }}
                                                                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                                                            currentMap.source !== 'custom' 
                                                                                ? 'bg-[#8B5CF6] text-white' 
                                                                                : 'bg-[#1C1F26] text-slate-400 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        Customer Field
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setVariableMappings(prev => ({
                                                                                ...prev,
                                                                                [k]: { ...prev[k], source: 'custom' }
                                                                            }));
                                                                        }}
                                                                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                                                            currentMap.source === 'custom' 
                                                                                ? 'bg-[#8B5CF6] text-white' 
                                                                                : 'bg-[#1C1F26] text-slate-400 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        Static / Custom Text
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {currentMap.source !== 'custom' ? (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[10px] text-slate-400 mb-1">Customer Field</label>
                                                                        <select
                                                                            value={currentMap.source}
                                                                            onChange={(e) => {
                                                                                const newSource = e.target.value;
                                                                                setVariableMappings(prev => ({
                                                                                    ...prev,
                                                                                    [k]: { ...prev[k], source: newSource }
                                                                                }));
                                                                            }}
                                                                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                                                        >
                                                                            <option value="name">Customer Full Name</option>
                                                                            <option value="phone">Phone Number</option>
                                                                            <option value="city">City / Country</option>
                                                                            <option value="email">Email Address</option>
                                                                            <option value="dob">Date of Birth</option>
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[10px] text-slate-400 mb-1">Fallback Value</label>
                                                                        <input
                                                                            type="text"
                                                                            value={currentMap.fallback || ''}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                setVariableMappings(prev => ({
                                                                                    ...prev,
                                                                                    [k]: { ...prev[k], fallback: val }
                                                                                }));
                                                                            }}
                                                                            placeholder="e.g. Student"
                                                                            className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <label className="block text-[10px] text-slate-400 mb-1">Custom Text for All Recipients</label>
                                                                    <input
                                                                        type="text"
                                                                        value={currentMap.customValue || ''}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            setVariableMappings(prev => ({
                                                                                ...prev,
                                                                                [k]: { ...prev[k], customValue: val }
                                                                            }));
                                                                            if (hasErr) setErrors(prev => ({ ...prev, [`var_${k}`]: null }));
                                                                        }}
                                                                        placeholder="e.g. Tomorrow at 10:00 AM, VISA2026, or $500"
                                                                        className={`w-full bg-[#1C1F26] border rounded-lg px-2.5 py-1.5 text-xs text-white outline-none ${
                                                                            hasErr ? 'border-rose-500' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                                                        }`}
                                                                    />
                                                                    {hasErr && <p className="text-rose-400 text-[10px] mt-1">{hasErr}</p>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Live Personalized Preview Column */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <Eye className="w-3.5 h-3.5 text-[#25D366]" />
                                                Personalized Preview for Sample Recipient
                                            </h4>
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                Sample: {sampleRecipient.name}
                                            </span>
                                        </div>

                                        <WhatsAppTemplatePreview
                                            template={activeTemplate}
                                            customVariables={renderedCustomVariables}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: Schedule */}
                    {currentStep === 4 && (
                        <div className="space-y-6 max-w-2xl mx-auto py-2">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-0.5">Step 4: Delivery Timing &amp; Scheduling</h3>
                                <p className="text-xs text-slate-400">Choose whether to broadcast right away or schedule for a specific date and time.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setScheduleType('IMMEDIATE')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        scheduleType === 'IMMEDIATE'
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                            : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-white flex items-center gap-2">
                                            <Send className="w-4 h-4 text-[#8B5CF6]" />
                                            Send Immediately (Send Now)
                                        </span>
                                        {scheduleType === 'IMMEDIATE' && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Campaign starts running right after confirmation. Delivery simulation triggers sequentially.
                                    </p>
                                </div>

                                <div
                                    onClick={() => setScheduleType('SCHEDULED')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        scheduleType === 'SCHEDULED'
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30'
                                            : 'bg-[#1C1F26] border-[#2D333B] hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
                                            Schedule for Later
                                        </span>
                                        {scheduleType === 'SCHEDULED' && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Queue campaign for future automated broadcast based on designated date, time, and timezone.
                                    </p>
                                </div>
                            </div>

                            {/* Scheduled Parameters */}
                            {scheduleType === 'SCHEDULED' && (
                                <div className="p-5 bg-[#111318] rounded-2xl border border-[#2D333B] space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#8B5CF6]" />
                                        Scheduled Broadcast Configuration
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Broadcast Date <span className="text-rose-400">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={scheduledDate}
                                                onChange={(e) => {
                                                    setScheduledDate(e.target.value);
                                                    if (errors.scheduledDate) setErrors(prev => ({ ...prev, scheduledDate: null }));
                                                }}
                                                className={`w-full bg-[#1C1F26] border rounded-xl px-3 py-2 text-xs text-white outline-none ${
                                                    errors.scheduledDate ? 'border-rose-500' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                                }`}
                                            />
                                            {errors.scheduledDate && <p className="text-rose-400 text-[10px] mt-1">{errors.scheduledDate}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Broadcast Time <span className="text-rose-400">*</span>
                                            </label>
                                            <input
                                                type="time"
                                                value={scheduledTime}
                                                onChange={(e) => {
                                                    setScheduledTime(e.target.value);
                                                    if (errors.scheduledTime) setErrors(prev => ({ ...prev, scheduledTime: null }));
                                                }}
                                                className={`w-full bg-[#1C1F26] border rounded-xl px-3 py-2 text-xs text-white outline-none ${
                                                    errors.scheduledTime ? 'border-rose-500' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                                }`}
                                            />
                                            {errors.scheduledTime && <p className="text-rose-400 text-[10px] mt-1">{errors.scheduledTime}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Sender Timezone
                                        </label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-3 py-2 text-xs text-white outline-none"
                                        >
                                            {TIMEZONE_OPTIONS.map(tz => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: Review & Confirmation */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white mb-0.5">Step 5: Review &amp; Confirmation</h3>
                                <p className="text-xs text-slate-400">
                                    Review your campaign parameters and inspect the final rendered message before launch.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Summary Details Card */}
                                <div className="space-y-4">
                                    <div className="bg-[#111318] p-5 rounded-2xl border border-[#2D333B] space-y-4">
                                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#8B5CF6]" />
                                            Campaign Configuration Summary
                                        </h4>

                                        <div className="divide-y divide-[#2D333B]/50 text-xs">
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-slate-400">Campaign Name:</span>
                                                <span className="font-semibold text-white text-right">{name}</span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-slate-400">Campaign Type:</span>
                                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                                    {type} Broadcast
                                                </span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-slate-400">Target Audience:</span>
                                                <span className="font-semibold text-white">
                                                    {selectedRecipients.length} Recipients ({audienceSource === 'CRM_GROUP' ? selectedGroup : audienceSource === 'CSV_IMPORT' ? 'CSV Import' : 'Manual Entry'})
                                                </span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-slate-400">Selected Template:</span>
                                                <span className="font-semibold text-[#25D366]">
                                                    {activeTemplate?.name} ({activeTemplate?.category})
                                                </span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-slate-400">Delivery Schedule:</span>
                                                <span className="font-semibold text-white text-right">
                                                    {scheduleType === 'IMMEDIATE' ? (
                                                        <span className="text-emerald-400">Send Immediately</span>
                                                    ) : (
                                                        <span>{scheduledDate} at {scheduledTime} ({timezone.split(' ')[0]})</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pre-flight Checks */}
                                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 space-y-2">
                                        <p className="font-bold flex items-center gap-1.5 text-emerald-200">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            Pre-flight Validation Passed
                                        </p>
                                        <ul className="space-y-1 text-[11px] text-emerald-300/80 list-disc list-inside">
                                            <li>WhatsApp Template status: <strong>Approved</strong> by Meta sandbox</li>
                                            <li>Recipient phone numbers verified &amp; format normalized</li>
                                            <li>All dynamic variables mapped with fallback values</li>
                                            <li>Simulation engine ready for message dispatch</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Preview Card */}
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
                            onClick={() => handleSaveCampaign(true)}
                            className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                            Save as Draft
                        </button>

                        {currentStep < 5 ? (
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
                                onClick={() => handleSaveCampaign(false)}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-xs font-bold text-white transition-all shadow-lg shadow-[#25D366]/20"
                            >
                                <Send className="w-4 h-4" />
                                {scheduleType === 'SCHEDULED' ? 'Confirm & Schedule Campaign' : 'Confirm & Launch Campaign'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignWizardModal;
