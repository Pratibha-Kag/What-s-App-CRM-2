import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Plus, Trash2, Send, Save, AlertCircle, Sparkles, 
    FileText, Link2, MessageSquare, Phone, ChevronRight, Layers, Globe
} from 'lucide-react';
import WhatsAppTemplatePreview from './WhatsAppTemplatePreview';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import { toast } from '../../ui/Toast';

const WhatsAppTemplateEditorModal = () => {
    const { 
        isCreateModalOpen, 
        closeCreateModal, 
        editingTemplate, 
        addTemplate, 
        updateTemplate 
    } = useWhatsAppTemplateStore();

    const isEditing = !!editingTemplate;

    // Form State
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Utility');
    const [language, setLanguage] = useState('English (US)');
    const [headerText, setHeaderText] = useState('');
    const [body, setBody] = useState('');
    const [footer, setFooter] = useState('');
    const [variables, setVariables] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [errors, setErrors] = useState({});

    // Populate on open / editingTemplate change
    useEffect(() => {
        if (editingTemplate) {
            setName(editingTemplate.name || '');
            setTitle(editingTemplate.title || '');
            setCategory(editingTemplate.category || 'Utility');
            setLanguage(editingTemplate.language || 'English (US)');
            setHeaderText(editingTemplate.header?.text || '');
            setBody(editingTemplate.body || '');
            setFooter(editingTemplate.footer || '');
            setVariables(editingTemplate.variables ? JSON.parse(JSON.stringify(editingTemplate.variables)) : []);
            setButtons(editingTemplate.buttons ? JSON.parse(JSON.stringify(editingTemplate.buttons)) : []);
        } else {
            // New template default state
            setName('');
            setTitle('');
            setCategory('Utility');
            setLanguage('English (US)');
            setHeaderText('');
            setBody('Hello {{1}}, this is an update regarding {{2}}.');
            setFooter('EduCorp Admissions Support');
            setVariables([
                { key: '1', name: 'Student Name', sample: 'Aarav Patel' },
                { key: '2', name: 'Subject / Service', sample: 'Document Verification' }
            ]);
            setButtons([
                { type: 'QUICK_REPLY', text: 'Confirm Received' }
            ]);
        }
        setErrors({});
    }, [editingTemplate, isCreateModalOpen]);

    // Automatically detect {{1}}, {{2}} in body and synchronize variables array
    useEffect(() => {
        const matches = [...body.matchAll(/\{\{(\d+)\}\}/g)].map(m => m[1]);
        const uniqueKeys = [...new Set(matches)].sort((a, b) => Number(a) - Number(b));

        setVariables(prev => {
            const currentMap = {};
            prev.forEach(v => { currentMap[v.key] = v; });

            return uniqueKeys.map(key => {
                if (currentMap[key]) {
                    return currentMap[key];
                }
                const defaultNames = {
                    '1': 'Customer Name',
                    '2': 'Date / Time',
                    '3': 'Reference / Amount',
                    '4': 'Details'
                };
                return {
                    key,
                    name: defaultNames[key] || `Field ${key}`,
                    sample: `Sample ${key}`
                };
            });
        });
    }, [body]);

    if (!isCreateModalOpen) return null;

    // Quick Insert Variable Helper
    const handleInsertVariable = (customVarName = null) => {
        const currentCount = variables.length + 1;
        const newTag = `{{${currentCount}}}`;
        setBody(prev => `${prev} ${newTag}`);
    };

    // Update variable sample
    const handleVariableSampleChange = (key, field, val) => {
        setVariables(prev => prev.map(v => v.key === key ? { ...v, [field]: val } : v));
    };

    // Add Action Button
    const handleAddButton = (type) => {
        if (buttons.length >= 3) {
            toast.warning('WhatsApp allows a maximum of 3 action buttons per template.');
            return;
        }
        if (type === 'QUICK_REPLY') {
            setButtons(prev => [...prev, { type: 'QUICK_REPLY', text: 'Quick Response' }]);
        } else {
            setButtons(prev => [...prev, { type: 'URL', text: 'Visit Website', url: 'https://admissions.educorp.org' }]);
        }
    };

    const handleRemoveButton = (idx) => {
        setButtons(prev => prev.filter((_, i) => i !== idx));
    };

    // Form Validation
    const validateForm = () => {
        const errs = {};
        if (!name.trim()) errs.name = 'Template identifier is required.';
        if (!body.trim()) errs.body = 'Template body text cannot be empty.';

        // Check if all detected variables have non-empty samples
        const missingSamples = variables.filter(v => !v.sample || !v.sample.trim());
        if (missingSamples.length > 0) {
            errs.variables = `Please provide sample values for all dynamic variables (Missing: ${missingSamples.map(m => `{{${m.key}}}`).join(', ')}).`;
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = (submitForApproval = false) => {
        if (!validateForm()) {
            toast.error('Please complete all required fields and variable samples.');
            return;
        }

        const formData = {
            name,
            title: title || name.replace(/_/g, ' '),
            category,
            language,
            header: headerText.trim() ? { text: headerText.trim() } : null,
            body,
            footer: footer.trim(),
            variables,
            buttons
        };

        if (isEditing) {
            updateTemplate(editingTemplate.id, formData, submitForApproval);
            if (editingTemplate.status === 'Approved' && !submitForApproval) {
                toast.info('Approved template modified. Returned to Draft state for review.');
            } else if (submitForApproval) {
                toast.success('Template updated and submitted for approval.');
            } else {
                toast.success('Template updated successfully.');
            }
        } else {
            addTemplate(formData, submitForApproval);
            if (submitForApproval) {
                toast.success('Template created and submitted for simulated approval.');
            } else {
                toast.success('Template saved as Draft.');
            }
        }
    };

    // Constructed preview object
    const previewTemplate = {
        name,
        header: headerText.trim() ? { text: headerText.trim() } : null,
        body,
        footer: footer.trim(),
        buttons,
        variables
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[92vh]"
                >
                    {/* Modal Header */}
                    <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#16181D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">
                                    {isEditing ? `Edit Template: ${editingTemplate.title || editingTemplate.name}` : 'Create WhatsApp Message Template'}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {isEditing && editingTemplate.status === 'Approved' ? (
                                        <span className="text-amber-400 font-bold">Notice: Content edits will return this approved template to Draft</span>
                                    ) : (
                                        'Configure template content, dynamic variables, and buttons'
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={closeCreateModal}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Modal Body: Split Layout (Left: Form | Right: Live Preview) */}
                    <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#111318]">
                        {/* LEFT COLUMN: Configuration Form */}
                        <div className="lg:col-span-7 p-6 space-y-5 border-r border-[#2D333B] overflow-y-auto max-h-[calc(92vh-140px)] custom-scrollbar">
                            {/* General Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                        Template Technical Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. appointment_reminder_v1"
                                        value={name}
                                        onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                                        className={`w-full bg-[#1C1F26] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors font-mono ${
                                            errors.name ? 'border-rose-500' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                        }`}
                                    />
                                    {errors.name && <p className="text-[10px] text-rose-400 mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                        Display Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Counseling Session Reminder"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                                    >
                                        <option value="Marketing">Marketing (Offers, Greetings, Announcements)</option>
                                        <option value="Utility">Utility (Reminders, Confirmations, Updates)</option>
                                        <option value="Authentication">Authentication (One-Time Passwords, Login OTP)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                        Language *
                                    </label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                                    >
                                        <option value="English (US)">English (US)</option>
                                        <option value="English (UK)">English (UK)</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                    </select>
                                </div>
                            </div>

                            {/* Optional Header */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Header Text (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Counseling Session Reminder 📅"
                                    value={headerText}
                                    onChange={(e) => setHeaderText(e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Message Body with Variable Chips */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5 ml-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        Message Body *
                                    </label>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {body.length} / 1024 characters
                                    </span>
                                </div>

                                <textarea
                                    rows={4}
                                    placeholder="Enter your WhatsApp message text here. Use {{1}}, {{2}} for dynamic variables..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className={`w-full bg-[#1C1F26] border rounded-xl p-3.5 text-xs text-white focus:outline-none transition-colors resize-y leading-relaxed ${
                                        errors.body ? 'border-rose-500' : 'border-[#2D333B] focus:border-[#8B5CF6]'
                                    }`}
                                />
                                {errors.body && <p className="text-[10px] text-rose-400 mt-1 ml-1">{errors.body}</p>}

                                {/* Quick Variable Insertion Chips */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Insert:</span>
                                    <button
                                        type="button"
                                        onClick={() => handleInsertVariable('Customer Name')}
                                        className="px-2.5 py-1 bg-[#1C1F26] hover:bg-[#8B5CF6]/20 border border-[#2D333B] hover:border-[#8B5CF6] text-[11px] text-[#A855F7] font-bold rounded-lg transition-colors"
                                    >
                                        + Dynamic Variable ({`{{${variables.length + 1}}}`})
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Variable Configuration Section */}
                            {variables.length > 0 && (
                                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                            <Sparkles size={13} className="text-[#8B5CF6]" />
                                            Detected Variables ({variables.length})
                                        </h3>
                                        <span className="text-[10px] text-slate-400">Sample values required for Meta review</span>
                                    </div>

                                    {errors.variables && (
                                        <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/30">
                                            {errors.variables}
                                        </p>
                                    )}

                                    <div className="space-y-2.5">
                                        {variables.map((v) => (
                                            <div key={v.key} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#111318] p-2.5 rounded-lg border border-[#2D333B]">
                                                <div className="sm:col-span-2 flex items-center">
                                                    <span className="font-mono text-xs font-black text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-1 rounded border border-[#8B5CF6]/30">
                                                        {`{{${v.key}}}`}
                                                    </span>
                                                </div>
                                                <div className="sm:col-span-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Description (e.g. Student Name)"
                                                        value={v.name}
                                                        onChange={(e) => handleVariableSampleChange(v.key, 'name', e.target.value)}
                                                        className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                                    />
                                                </div>
                                                <div className="sm:col-span-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Sample Value (e.g. Aarav Patel)"
                                                        value={v.sample}
                                                        onChange={(e) => handleVariableSampleChange(v.key, 'sample', e.target.value)}
                                                        className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Optional Footer */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Footer Text (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Reply STOP to unsubscribe • EduCorp Official"
                                    value={footer}
                                    onChange={(e) => setFooter(e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Interactive Action Buttons Builder */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        Interactive Buttons ({buttons.length}/3)
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddButton('QUICK_REPLY')}
                                            disabled={buttons.length >= 3}
                                            className="px-2.5 py-1 bg-[#1C1F26] hover:bg-[#2D333B] border border-[#2D333B] text-[10px] text-slate-300 font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
                                        >
                                            <MessageSquare size={11} /> + Quick Reply
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddButton('URL')}
                                            disabled={buttons.length >= 3}
                                            className="px-2.5 py-1 bg-[#1C1F26] hover:bg-[#2D333B] border border-[#2D333B] text-[10px] text-slate-300 font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
                                        >
                                            <Link2 size={11} /> + Call to Action URL
                                        </button>
                                    </div>
                                </div>

                                {buttons.map((btn, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#1C1F26] p-2.5 rounded-xl border border-[#2D333B]">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-[#111318] rounded border border-[#2D333B]">
                                            {btn.type === 'URL' ? 'URL CTA' : 'Quick Reply'}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Button text"
                                            value={btn.text}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setButtons(prev => prev.map((b, i) => i === idx ? { ...b, text: val } : b));
                                            }}
                                            className="flex-1 bg-[#111318] border border-[#2D333B] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                        {btn.type === 'URL' && (
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={btn.url || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setButtons(prev => prev.map((b, i) => i === idx ? { ...b, url: val } : b));
                                                }}
                                                className="w-40 bg-[#111318] border border-[#2D333B] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveButton(idx)}
                                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live WhatsApp Preview */}
                        <div className="lg:col-span-5 p-6 bg-[#16181D] flex flex-col items-center justify-center border-t lg:border-t-0 border-[#2D333B]">
                            <div className="w-full max-w-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-[#8B5CF6]" /> Real-time WhatsApp Preview
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        Instant Sync
                                    </span>
                                </div>

                                <WhatsAppTemplatePreview 
                                    template={previewTemplate} 
                                    customVariables={variables}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-[#2D333B] bg-[#16181D] flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => handleSave(false)}
                                className="px-5 py-2.5 rounded-xl border border-[#2D333B] hover:border-slate-500 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                            >
                                <Save size={14} /> Save as Draft
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSave(true)}
                                className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/20 flex items-center gap-1.5 active:scale-95"
                            >
                                <Send size={14} /> Submit for Approval
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WhatsAppTemplateEditorModal;
