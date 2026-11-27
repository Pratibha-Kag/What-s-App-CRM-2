import React, { useState } from 'react';
import { 
    X, Sparkles, BrainCircuit, Check, CheckCircle2, 
    Zap, AlertTriangle, ShieldCheck, RefreshCw, Cpu 
} from 'lucide-react';
import useWhatsAppSalesAgentStore from '../../../store/useWhatsAppSalesAgentStore';

const ProviderConfigModal = () => {
    const { 
        activeConfigModal, 
        closeConfigModal, 
        config, 
        providers, 
        updateConfig, 
        updateProviderModel,
        simulateConnectionTest,
        connectionTesting,
        connectionTestResult
    } = useWhatsAppSalesAgentStore();

    const [formConfig, setFormConfig] = useState({ ...config });
    const [selectedProviderId, setSelectedProviderId] = useState(config.selectedProvider || 'chatgpt');
    const [feedback, setFeedback] = useState(null);

    if (activeConfigModal !== 'provider') return null;

    const currentProvider = providers[selectedProviderId] || providers.chatgpt;

    const handleModelChange = (modelId) => {
        updateProviderModel(selectedProviderId, modelId);
    };

    const handleTestPing = async () => {
        const res = await simulateConnectionTest(selectedProviderId);
        if (res) {
            setFeedback({ type: 'success', text: res.message });
            setTimeout(() => setFeedback(null), 4000);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateConfig({
            ...formConfig,
            selectedProvider: selectedProviderId
        });
        setFeedback({ type: 'success', text: 'AI Provider configuration updated & saved successfully!' });
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
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                AI Provider Configuration
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                    Simulated Sandbox
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Configure OpenAI ChatGPT or Moonshot Kimi AI reasoning models.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeConfigModal}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 bg-[#16181D] flex-1">
                    {feedback && (
                        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            feedback.type === 'success' 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}>
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {feedback.text}
                        </div>
                    )}

                    {/* Provider Select Cards */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Select AI Provider</label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* ChatGPT Option */}
                            <button
                                type="button"
                                onClick={() => setSelectedProviderId('chatgpt')}
                                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                                    selectedProviderId === 'chatgpt'
                                        ? 'bg-[#1C1F26] border-[#10A37F] shadow-lg shadow-[#10A37F]/10'
                                        : 'bg-[#111318] border-[#2D333B] hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#10A37F]" />
                                        <span className="text-xs font-bold text-white">OpenAI ChatGPT</span>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full ${selectedProviderId === 'chatgpt' ? 'bg-[#10A37F]' : 'bg-slate-700'}`} />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    High-accuracy reasoning with GPT-4o. Best for consultative sales.
                                </p>
                            </button>

                            {/* Kimi Option */}
                            <button
                                type="button"
                                onClick={() => setSelectedProviderId('kimi')}
                                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                                    selectedProviderId === 'kimi'
                                        ? 'bg-[#1C1F26] border-[#6366F1] shadow-lg shadow-[#6366F1]/10'
                                        : 'bg-[#111318] border-[#2D333B] hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-[#6366F1]" />
                                        <span className="text-xs font-bold text-white">Moonshot Kimi</span>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full ${selectedProviderId === 'kimi' ? 'bg-[#6366F1]' : 'bg-slate-700'}`} />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Long-context bilingual reasoning with Kimi k1.5. Ideal for complex documents.
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Model Selection Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">
                            Simulated Model Engine ({currentProvider.name})
                        </label>
                        <select
                            value={currentProvider.selectedModel}
                            onChange={(e) => handleModelChange(e.target.value)}
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                        >
                            {(currentProvider.models || []).map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} — {m.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Agent Display Name & Business Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Agent Display Name</label>
                            <input
                                type="text"
                                value={formConfig.agentDisplayName || ''}
                                onChange={(e) => setFormConfig({ ...formConfig, agentDisplayName: e.target.value })}
                                placeholder="e.g. Aria - AI Sales Specialist"
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Business Name</label>
                            <input
                                type="text"
                                value={formConfig.businessName || ''}
                                onChange={(e) => setFormConfig({ ...formConfig, businessName: e.target.value })}
                                placeholder="e.g. WhatsApp CRM Enterprise"
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    {/* Response Tone & Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Response Tone</label>
                            <select
                                value={formConfig.responseTone || 'Consultative & Solution-focused'}
                                onChange={(e) => setFormConfig({ ...formConfig, responseTone: e.target.value })}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="Consultative & Solution-focused">Consultative &amp; Solution-focused</option>
                                <option value="Professional & Courteous">Professional &amp; Courteous</option>
                                <option value="Friendly & Conversational">Friendly &amp; Conversational</option>
                                <option value="Urgent & Promotional">Urgent &amp; Promotional</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Preferred Language</label>
                            <select
                                value={formConfig.responseLanguage || 'English (Global)'}
                                onChange={(e) => setFormConfig({ ...formConfig, responseLanguage: e.target.value })}
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="English (Global)">English (Global)</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Hinglish">Hinglish (Colloquial)</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Arabic">Arabic</option>
                            </select>
                        </div>
                    </div>

                    {/* System Instructions / Prompt Guidelines */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                            <span>Business Instructions &amp; System Prompt</span>
                            <span className="text-[10px] text-slate-500">Guides AI sales answers</span>
                        </label>
                        <textarea
                            rows={3}
                            value={formConfig.systemInstructions || ''}
                            onChange={(e) => setFormConfig({ ...formConfig, systemInstructions: e.target.value })}
                            placeholder="Enter behavioral guidelines for the AI assistant..."
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Simulated Connection Diagnostic Box */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">API Gateway Sandbox</span>
                            <p className="text-xs text-slate-300 truncate font-mono mt-0.5">
                                {currentProvider.endpoint}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleTestPing}
                            disabled={connectionTesting}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C1F26] text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 flex items-center gap-1.5 shrink-0"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${connectionTesting ? 'animate-spin' : ''}`} />
                            {connectionTesting ? 'Testing...' : 'Test Connection'}
                        </button>
                    </div>

                    {/* Actions */}
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
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Save Provider Settings
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ProviderConfigModal;
