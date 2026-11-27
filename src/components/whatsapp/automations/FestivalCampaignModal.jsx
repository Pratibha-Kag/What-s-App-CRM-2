import React, { useState, useEffect } from 'react';
import { 
    X, Sparkles, Calendar, Clock, Users, FileText, 
    CheckCircle2, AlertCircle, Eye, Send, ArrowRight 
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
    'GMT+8:00 (SGT / HKT)'
];

const FestivalCampaignModal = () => {
    const { 
        isFestivalModalOpen, 
        editingFestival, 
        closeFestivalModal, 
        createFestivalCampaign, 
        updateFestivalCampaign,
        festivalPresets 
    } = useWhatsAppAutomationStore();

    const { groups, audiences } = useWhatsAppAudienceStore();
    const { templates } = useWhatsAppTemplateStore();

    // Form state
    const [selectedPresetId, setSelectedPresetId] = useState('diwali');
    const [campaignName, setCampaignName] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [celebrationDate, setCelebrationDate] = useState('2026-11-08');
    const [audienceGroup, setAudienceGroup] = useState('All Contacts');
    const [scheduledTime, setScheduledTime] = useState('08:00');
    const [timezone, setTimezone] = useState('GMT+5:30 (IST - India)');
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [customGreeting, setCustomGreeting] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingFestival) {
            setSelectedPresetId(editingFestival.festivalId || 'custom');
            setCampaignName(editingFestival.name || '');
            setSelectedYear(editingFestival.year || '2026');
            setCelebrationDate(editingFestival.celebrationDate || '2026-11-08');
            setAudienceGroup(editingFestival.audienceGroup || 'All Contacts');
            setScheduledTime(editingFestival.scheduledTime || '08:00');
            setTimezone(editingFestival.timezone || 'GMT+5:30 (IST - India)');
            setSelectedTemplateId(editingFestival.templateId || null);
            setCustomGreeting(editingFestival.variableMappings?.[0]?.customValue || '');
            setErrors({});
        } else {
            // Default to Diwali 2026
            const diwaliPreset = festivalPresets.find(p => p.id === 'diwali') || festivalPresets[0];
            setSelectedPresetId(diwaliPreset.id);
            setSelectedYear('2026');
            const defaultDate = diwaliPreset.yearlyDates['2026'] || '2026-11-08';
            setCelebrationDate(defaultDate);
            setCampaignName(`Diwali 2026 Festival Broadcast`);
            setAudienceGroup('All Contacts');
            setScheduledTime('08:00');
            setTimezone('GMT+5:30 (IST - India)');
            setCustomGreeting('Diwali 2026');

            // Find festival template
            const festTpl = templates.find(t => t.status === 'Approved' && t.category === 'Marketing' && t.name.includes('festival'));
            if (festTpl) {
                setSelectedTemplateId(festTpl.id);
            }
            setErrors({});
        }
    }, [editingFestival, isFestivalModalOpen, festivalPresets, templates]);

    const activeTemplate = templates.find(t => t.id === selectedTemplateId);

    if (!isFestivalModalOpen) return null;

    const handlePresetChange = (presetId) => {
        setSelectedPresetId(presetId);
        const preset = festivalPresets.find(p => p.id === presetId);
        if (preset) {
            const dateForYear = preset.yearlyDates[selectedYear] || `${selectedYear}-10-20`;
            setCelebrationDate(dateForYear);
            setCampaignName(`${preset.name.split(' ')[0]} ${selectedYear} Broadcast`);
            setCustomGreeting(`${preset.name.split(' ')[0]} ${selectedYear}`);
        }
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        const preset = festivalPresets.find(p => p.id === selectedPresetId);
        if (preset && preset.yearlyDates[year]) {
            setCelebrationDate(preset.yearlyDates[year]);
            setCampaignName(`${preset.name.split(' ')[0]} ${year} Broadcast`);
            setCustomGreeting(`${preset.name.split(' ')[0]} ${year}`);
        }
    };

    const targetAudienceCount = audienceGroup === 'All Contacts' 
        ? audiences.length 
        : audiences.filter(a => a.group === audienceGroup).length;

    const handleSave = (status = 'Scheduled') => {
        const newErrors = {};
        if (!campaignName.trim()) newErrors.campaignName = 'Campaign name is required.';
        if (!celebrationDate) newErrors.celebrationDate = 'Celebration date is required.';
        if (!selectedTemplateId) newErrors.template = 'Please choose an approved WhatsApp template.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const preset = festivalPresets.find(p => p.id === selectedPresetId);
        const payload = {
            name: campaignName.trim(),
            festivalId: selectedPresetId,
            festivalName: preset ? preset.name : 'Seasonal Festival',
            year: selectedYear,
            celebrationDate,
            audienceGroup,
            totalRecipients: targetAudienceCount,
            templateId: selectedTemplateId,
            templateName: activeTemplate?.name || 'festival_greetings',
            templateCategory: 'Marketing',
            templateSnapshot: activeTemplate ? {
                header: activeTemplate.header || `Happy ${preset?.name || 'Holidays'}!`,
                body: activeTemplate.body,
                footer: activeTemplate.footer
            } : null,
            variableMappings: [
                { key: '1', source: 'custom', customValue: customGreeting || 'Festival Season' }
            ],
            scheduledTime,
            timezone,
            status
        };

        if (editingFestival) {
            updateFestivalCampaign(editingFestival.id, payload);
        } else {
            createFestivalCampaign(payload);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto text-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                            {editingFestival ? 'Edit Festival Campaign' : 'Configure Festival Campaign'}
                        </h2>
                        <p className="text-xs text-slate-400">
                            Pre-configured with Diwali and Dussehra. Celebration dates are fully configurable per calendar year.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeFestivalModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Preset Festival Cards */}
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 block">Select Festival Celebration</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                            {festivalPresets.map(p => {
                                const isSelected = selectedPresetId === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handlePresetChange(p.id)}
                                        className={`p-3 rounded-xl border text-left transition-all ${
                                            isSelected
                                                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-sm'
                                                : 'bg-[#1C1F26] border-[#2D333B] text-slate-400 hover:text-white hover:border-slate-500'
                                        }`}
                                    >
                                        <p className="font-bold text-xs truncate">{p.name.split(' ')[0]}</p>
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{p.category}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Campaign Details & Year/Date configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#111318] rounded-xl border border-[#2D333B]">
                        <div className="md:col-span-3">
                            <label className="block text-slate-300 font-semibold mb-1">
                                Campaign Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                placeholder="e.g. Diwali 2026 Festival of Lights Broadcast"
                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none focus:border-[#8B5CF6]"
                            />
                            {errors.campaignName && <p className="text-rose-400 text-[10px] mt-1">{errors.campaignName}</p>}
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Calendar Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none"
                            >
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">
                                Celebration Date (Configurable) <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={celebrationDate}
                                onChange={(e) => setCelebrationDate(e.target.value)}
                                className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none"
                            />
                            <span className="text-[10px] text-slate-500 block mt-1">Adjusts to annual lunar date</span>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Execution Time &amp; TZ</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="w-1/2 bg-[#1C1F26] border border-[#2D333B] rounded-xl px-2.5 py-2 text-white outline-none"
                                />
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-1/2 bg-[#1C1F26] border border-[#2D333B] rounded-xl px-2 py-2 text-white outline-none text-[11px]"
                                >
                                    {TIMEZONE_OPTIONS.map(tz => (
                                        <option key={tz} value={tz}>{tz.split(' ')[0]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Target Audience Group */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-slate-300">Select Target Customer Group</label>
                            <span className="text-slate-400">{targetAudienceCount} recipients eligible</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {groups.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setAudienceGroup(g)}
                                    className={`p-2.5 rounded-xl border text-left transition-all ${
                                        audienceGroup === g
                                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                                            : 'bg-[#1C1F26] border-[#2D333B] text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <span className="font-semibold block">{g}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Selection & Variable Mapping */}
                    <div className="space-y-4">
                        <label className="font-semibold text-slate-300 block">Select Approved WhatsApp Template</label>
                        <WhatsAppTemplateSelector
                            selectedTemplateId={selectedTemplateId}
                            onSelectTemplate={(tpl) => setSelectedTemplateId(tpl.id)}
                            approvedOnly={true}
                            allowedCategories={['Marketing']}
                        />
                        {errors.template && <p className="text-rose-400 text-xs">{errors.template}</p>}

                        {activeTemplate && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-[#111318] rounded-xl border border-[#2D333B]">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">
                                        Festival Name Variable Placeholder {`{{1}}`}
                                    </label>
                                    <input
                                        type="text"
                                        value={customGreeting}
                                        onChange={(e) => setCustomGreeting(e.target.value)}
                                        placeholder="e.g. Diwali 2026, Dussehra, or Happy Holidays"
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none"
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Substituted into message body for greeting recipients.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-2">Message Preview:</span>
                                    <WhatsAppTemplatePreview
                                        template={activeTemplate}
                                        customVariables={[{ key: '1', sample: customGreeting || 'Diwali 2026' }]}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeFestivalModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white transition-all text-xs font-semibold"
                    >
                        Cancel
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleSave('Draft')}
                            className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-slate-300 hover:text-white transition-all text-xs font-semibold"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave('Scheduled')}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            Schedule Festival Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FestivalCampaignModal;
