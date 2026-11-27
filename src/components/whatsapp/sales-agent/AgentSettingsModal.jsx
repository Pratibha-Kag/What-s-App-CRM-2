import React, { useState, useEffect } from 'react';
import { 
    X, Keyboard, Image as ImageIcon, BrainCircuit, 
    Languages, Check, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import useWhatsAppSalesAgentStore from '../../../store/useWhatsAppSalesAgentStore';

const AgentSettingsModal = () => {
    const { 
        activeConfigModal, 
        closeConfigModal, 
        config, 
        updateConfig 
    } = useWhatsAppSalesAgentStore();

    // Map modal types to tabs
    const validModals = ['messageFormat', 'imageRecognition', 'businessInfo', 'language'];
    const isOpen = validModals.includes(activeConfigModal);

    const [activeTab, setActiveTab] = useState('messageFormat');
    const [formData, setFormData] = useState({ ...config });
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(activeConfigModal);
            setFormData({ ...config });
        }
    }, [activeConfigModal, isOpen, config]);

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        updateConfig(formData);
        setFeedback({ type: 'success', text: 'Agent settings updated successfully!' });
        setTimeout(() => {
            setFeedback(null);
            closeConfigModal();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
                
                {/* Header */}
                <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#1C1F26]">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            Sales Agent Preferences
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                Interactive
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Configure message styles, business info, language, and sandbox image settings.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeConfigModal}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub-Tabs */}
                <div className="flex border-b border-[#2D333B] bg-[#111318] px-4 overflow-x-auto">
                    {[
                        { key: 'messageFormat', label: 'Message Format', icon: Keyboard },
                        { key: 'businessInfo', label: 'Business Info', icon: BrainCircuit },
                        { key: 'language', label: 'Language', icon: Languages },
                        { key: 'imageRecognition', label: 'Image Recognition', icon: ImageIcon }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                                    isActive 
                                        ? 'border-[#8B5CF6] text-white bg-[#16181D]/60' 
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8B5CF6]' : 'text-slate-500'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 bg-[#16181D] flex-1">
                    {feedback && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {feedback.text}
                        </div>
                    )}

                    {/* TAB 1: MESSAGE FORMAT */}
                    {activeTab === 'messageFormat' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">Response Length Preference</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            messageFormat: { ...formData.messageFormat, maxLength: 'concise' }
                                        })}
                                        className={`p-3 rounded-xl border text-left ${
                                            formData.messageFormat?.maxLength === 'concise'
                                                ? 'bg-[#1C1F26] border-[#8B5CF6] text-white'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <p className="text-xs font-bold">Concise &amp; Crisp</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">1 to 2 direct bullet points.</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            messageFormat: { ...formData.messageFormat, maxLength: 'detailed' }
                                        })}
                                        className={`p-3 rounded-xl border text-left ${
                                            formData.messageFormat?.maxLength === 'detailed'
                                                ? 'bg-[#1C1F26] border-[#8B5CF6] text-white'
                                                : 'bg-[#111318] border-[#2D333B] text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <p className="text-xs font-bold">Detailed &amp; Consultative</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">3 to 4 points with call-to-actions.</p>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-white">Include Friendly Emojis</p>
                                        <p className="text-[11px] text-slate-400">Adds warmth and conversational tone to WhatsApp replies.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            messageFormat: { ...formData.messageFormat, includeEmoji: !formData.messageFormat?.includeEmoji }
                                        })}
                                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                                            formData.messageFormat?.includeEmoji ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                        }`}
                                    >
                                        <div className={`absolute top-[2px] h-4 w-4 bg-white rounded-full transition-all shadow-sm ${
                                            formData.messageFormat?.includeEmoji ? 'left-[22px]' : 'left-[2px]'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-[#2D333B]">
                                    <div>
                                        <p className="text-xs font-bold text-white">Auto-Attach Demo Booking Link</p>
                                        <p className="text-[11px] text-slate-400">Inserts calendar booking link when user asks for walkthrough.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            messageFormat: { ...formData.messageFormat, includeDemoLink: !formData.messageFormat?.includeDemoLink }
                                        })}
                                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                                            formData.messageFormat?.includeDemoLink ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                        }`}
                                    >
                                        <div className={`absolute top-[2px] h-4 w-4 bg-white rounded-full transition-all shadow-sm ${
                                            formData.messageFormat?.includeDemoLink ? 'left-[22px]' : 'left-[2px]'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BUSINESS INFORMATION */}
                    {activeTab === 'businessInfo' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Industry / Vertical</label>
                                    <input
                                        type="text"
                                        value={formData.businessInfo?.industry || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            businessInfo: { ...formData.businessInfo, industry: e.target.value }
                                        })}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Support Email</label>
                                    <input
                                        type="email"
                                        value={formData.businessInfo?.supportEmail || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            businessInfo: { ...formData.businessInfo, supportEmail: e.target.value }
                                        })}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Support Phone</label>
                                    <input
                                        type="text"
                                        value={formData.businessInfo?.supportPhone || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            businessInfo: { ...formData.businessInfo, supportPhone: e.target.value }
                                        })}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Operating Hours</label>
                                    <input
                                        type="text"
                                        value={formData.businessInfo?.workingHours || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            businessInfo: { ...formData.businessInfo, workingHours: e.target.value }
                                        })}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Pricing Summary for AI</label>
                                <textarea
                                    rows={2}
                                    value={formData.businessInfo?.pricingSummary || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        businessInfo: { ...formData.businessInfo, pricingSummary: e.target.value }
                                    })}
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 3: LANGUAGE TO USE */}
                    {activeTab === 'language' && (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Primary Conversation Language</label>
                                <select
                                    value={formData.responseLanguage || 'English (Global)'}
                                    onChange={(e) => setFormData({ ...formData, responseLanguage: e.target.value })}
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                >
                                    <option value="English (Global)">English (Global)</option>
                                    <option value="Hindi">Hindi (Official)</option>
                                    <option value="Hinglish">Hinglish (Colloquial Conversational)</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="Arabic">Arabic</option>
                                </select>
                            </div>

                            <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white">Auto-Detect Inbound Language</p>
                                    <p className="text-[11px] text-slate-400">If client messages in Hindi or Hinglish, agent automatically matches language.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        autoDetectLanguage: !formData.autoDetectLanguage
                                    })}
                                    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                                        formData.autoDetectLanguage ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                    }`}
                                >
                                    <div className={`absolute top-[2px] h-4 w-4 bg-white rounded-full transition-all shadow-sm ${
                                        formData.autoDetectLanguage ? 'left-[22px]' : 'left-[2px]'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: IMAGE RECOGNITION (SIMULATED CAPABILITY) */}
                    {activeTab === 'imageRecognition' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span>Simulated Capability — Requires Client Confirmation</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                    Visual image recognition (e.g. analyzing screenshots, payment receipts, prescription slips sent by customers) is currently running in a simulated sandbox. Live visual model processing requires dedicated cloud GPU vision quota and client confirmation before production activation.
                                </p>
                            </div>

                            <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white">Sandbox Image Processing (Demo)</p>
                                    <p className="text-[11px] text-slate-400">Allows customer to attach sample demo images in the conversation preview.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        imageRecognition: { ...formData.imageRecognition, enabled: !formData.imageRecognition?.enabled }
                                    })}
                                    className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                                        formData.imageRecognition?.enabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                    }`}
                                >
                                    <div className={`absolute top-[2px] h-4 w-4 bg-white rounded-full transition-all shadow-sm ${
                                        formData.imageRecognition?.enabled ? 'left-[22px]' : 'left-[2px]'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#2D333B]">
                        <button
                            type="button"
                            onClick={closeConfigModal}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#111318] border border-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/20 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Save Settings
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AgentSettingsModal;
