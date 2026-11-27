import React, { useState } from 'react';
import { Search, CheckCircle2, ChevronDown, Check, Globe, Tag, Sparkles, Eye, FileText } from 'lucide-react';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import WhatsAppTemplatePreview from './WhatsAppTemplatePreview';

/**
 * Reusable Developer 1-owned Template Selector Component
 * Prepared for future integration into:
 * - Manual and Bulk Broadcast Campaigns
 * - Common Automation Engine
 * - Birthday & Festival Automations
 * - Appointment & Payment Reminder Workflows
 */
const WhatsAppTemplateSelector = ({
    onSelectTemplate,
    selectedTemplateId = null,
    allowedCategories = null, // e.g. ['Marketing'] or null for all
    approvedOnly = true,
    className = ''
}) => {
    const { templates, openPreviewModal } = useWhatsAppTemplateStore();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [language, setLanguage] = useState('All');
    const [previewTpl, setPreviewTpl] = useState(null);

    // Filter templates based on criteria
    const eligibleTemplates = templates.filter(tpl => {
        // Enforce approved templates only for automation / campaign integrity
        if (approvedOnly && tpl.status !== 'Approved') return false;

        // Category filter
        if (allowedCategories && Array.isArray(allowedCategories) && allowedCategories.length > 0) {
            if (!allowedCategories.includes(tpl.category)) return false;
        }

        if (category !== 'All' && tpl.category !== category) return false;
        if (language !== 'All' && tpl.language !== language) return false;

        if (search.trim()) {
            const query = search.toLowerCase();
            const matchesName = (tpl.name || '').toLowerCase().includes(query);
            const matchesTitle = (tpl.title || '').toLowerCase().includes(query);
            const matchesBody = (tpl.body || '').toLowerCase().includes(query);
            if (!matchesName && !matchesTitle && !matchesBody) return false;
        }

        return true;
    });

    const activeSelectedTemplate = templates.find(t => t.id === selectedTemplateId);

    const categoriesList = ['All', 'Marketing', 'Utility', 'Authentication'];
    const languagesList = ['All', 'English (US)', 'English (UK)', 'Spanish', 'Hindi', 'Arabic'];

    return (
        <div className={`bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 text-white space-y-4 ${className}`}>
            {/* Header & Category Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FileText size={18} className="text-[#8B5CF6]" />
                    <h3 className="text-sm font-bold text-white tracking-tight">Select WhatsApp Message Template</h3>
                </div>

                {approvedOnly && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 size={12} /> Approved Templates Only
                    </span>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search templates by title or message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors placeholder:text-slate-500"
                    />
                </div>

                <div className="sm:col-span-3">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
                    >
                        {categoriesList.map(cat => (
                            <option key={cat} value={cat}>{cat} Categories</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
                    >
                        {languagesList.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Template Card Selection Grid */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {eligibleTemplates.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                        No approved templates match the current filter criteria.
                    </div>
                ) : (
                    eligibleTemplates.map(tpl => {
                        const isSelected = selectedTemplateId === tpl.id;

                        return (
                            <div
                                key={tpl.id}
                                onClick={() => onSelectTemplate && onSelectTemplate(tpl)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                    isSelected
                                        ? 'bg-[#111318] border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/10'
                                        : 'bg-[#111318] border-[#2D333B] hover:border-slate-600'
                                }`}
                            >
                                <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold text-white truncate">{tpl.title || tpl.name}</h4>
                                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded-md ${
                                            tpl.category === 'Marketing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            tpl.category === 'Utility' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {tpl.category}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">({tpl.language})</span>
                                    </div>
                                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                                        {tpl.body}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 pt-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreviewModal(tpl);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#2D333B] rounded-lg transition-colors"
                                        title="Preview Template"
                                    >
                                        <Eye size={14} />
                                    </button>

                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                        isSelected 
                                            ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' 
                                            : 'border-slate-600 bg-transparent'
                                    }`}>
                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Selected Template Summary */}
            {activeSelectedTemplate && (
                <div className="pt-3 border-t border-[#2D333B] flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-[#8B5CF6]" />
                        Selected: <strong className="text-white">{activeSelectedTemplate.title || activeSelectedTemplate.name}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                        {activeSelectedTemplate.variables?.length || 0} Dynamic Variable(s)
                    </span>
                </div>
            )}
        </div>
    );
};

export default WhatsAppTemplateSelector;
