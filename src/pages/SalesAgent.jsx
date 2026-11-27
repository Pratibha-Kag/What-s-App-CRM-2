import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
    Keyboard, Image as ImageIcon, BrainCircuit, Languages, 
    ChevronRight, Sparkles, Send, RefreshCcw, Paperclip, 
    Check, Cpu, Sliders, History, AlertTriangle, CheckCircle2, 
    Clock, Zap, Eye, Search, Filter, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import useWhatsAppSalesAgentStore from '../store/useWhatsAppSalesAgentStore';
import ProviderConfigModal from '../components/whatsapp/sales-agent/ProviderConfigModal';
import AgentSettingsModal from '../components/whatsapp/sales-agent/AgentSettingsModal';
import ActivityDetailModal from '../components/whatsapp/sales-agent/ActivityDetailModal';

const SalesAgent = () => {
    const {
        config,
        providers,
        chatMessages,
        activityHistory,
        isTyping,
        activitySearchQuery,
        activityFilter,
        connectionTesting,
        connectionTestResult,
        toggleAgent,
        toggleAutomation,
        selectProvider,
        sendUserMessage,
        resetConversation,
        openConfigModal,
        setSelectedActivityForDetail,
        setActivitySearchQuery,
        setActivityFilter,
        simulateConnectionTest,
        getDashboardStats
    } = useWhatsAppSalesAgentStore();

    const [userInput, setUserInput] = useState('');
    const [actionNotice, setActionNotice] = useState(null);
    const chatEndRef = useRef(null);

    const stats = getDashboardStats();
    const activeProvider = providers[config.selectedProvider] || providers.chatgpt;

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        const trimmed = userInput.trim();
        if (!trimmed) return;
        sendUserMessage(trimmed);
        setUserInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickPrompt = (promptText) => {
        sendUserMessage(promptText);
    };

    const handleTestConnection = async (pId) => {
        const res = await simulateConnectionTest(pId);
        if (res) {
            setActionNotice({ type: 'success', text: res.message });
            setTimeout(() => setActionNotice(null), 4000);
        }
    };

    const handleAttachImageNotice = () => {
        setActionNotice({
            type: 'info',
            text: 'Visual image attachment is running in sandbox mode. Multimodal vision processing requires dedicated cloud GPU vision quota.'
        });
        setTimeout(() => setActionNotice(null), 5000);
    };

    // Filtered activity history
    const filteredActivities = useMemo(() => {
        return (activityHistory || []).filter(act => {
            if (activitySearchQuery.trim()) {
                const q = activitySearchQuery.toLowerCase();
                const matchName = (act.conversationName || '').toLowerCase().includes(q);
                const matchDetails = (act.details || '').toLowerCase().includes(q);
                const matchId = (act.id || '').toLowerCase().includes(q);
                if (!matchName && !matchDetails && !matchId) return false;
            }

            if (activityFilter !== 'all') {
                if (act.activityType !== activityFilter) return false;
            }

            return true;
        });
    }, [activityHistory, activitySearchQuery, activityFilter]);

    return (
        <div className="flex flex-col min-h-screen bg-[#111318] text-white p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E232B] pb-4">
                <div>
                    <h1 className="text-[22px] font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                        Sales Agent
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                            AI Powered · 24/7
                        </span>
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-0.5">
                        Configure your 24/7 autonomous sales assistant powered by OpenAI ChatGPT or Moonshot Kimi.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => openConfigModal('provider')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/20 flex items-center gap-1.5"
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        Configure AI Engine
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTestConnection(config.selectedProvider)}
                        disabled={connectionTesting}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6]/40 transition-all flex items-center gap-1.5"
                    >
                        <Zap className={`w-3.5 h-3.5 ${connectionTesting ? 'animate-spin text-purple-400' : 'text-purple-400'}`} />
                        {connectionTesting ? 'Testing...' : 'Test Connection'}
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {actionNotice && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
                    actionNotice.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{actionNotice.text}</span>
                </div>
            )}

            {/* Dynamic Dashboard KPI Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Agent Status</span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${config.agentEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <p className={`text-base font-bold ${config.agentEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {config.agentEnabled ? 'Active' : 'Disabled'}
                        </p>
                    </div>
                    <span className="text-[10px] text-slate-500">{config.automationEnabled ? 'Auto-reply ON' : 'Auto-reply PAUSED'}</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold">Active AI Engine</span>
                    <p className="text-base font-bold text-white mt-1 truncate">
                        {activeProvider.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono truncate block">{activeProvider.selectedModel}</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">Gateway Status</span>
                    <p className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                    </p>
                    <span className="text-[10px] text-slate-500">Ping: {activeProvider.latencyMs}ms (Sandbox)</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-blue-400 uppercase font-semibold">Conversations</span>
                    <p className="text-base font-bold text-white mt-1">{stats.conversationsHandled}</p>
                    <span className="text-[10px] text-slate-500">Handled in demo session</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">AI Generated Replies</span>
                    <p className="text-base font-bold text-white mt-1">{stats.repliesGenerated}</p>
                    <span className="text-[10px] text-slate-500">Autonomous responses</span>
                </div>

                <div className="p-3.5 bg-[#16181D] rounded-xl border border-[#2D333B]">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold">Persona Name</span>
                    <p className="text-base font-bold text-white mt-1 truncate">
                        {config.agentDisplayName?.split(' - ')[0] || 'Aria'}
                    </p>
                    <span className="text-[10px] text-slate-500 truncate block">{config.responseTone?.split(' ')[0]}</span>
                </div>
            </div>

            {/* Main Dual-Panel Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Panel: Configuration & Provider Selection (7 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    
                    {/* Master Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <h3 className="font-bold text-[14px] text-white">Sales Agent Master</h3>
                                    <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5">
                                        Enable AI agent to interact with leads and answer inquiries.
                                    </p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => toggleAgent(!config.agentEnabled)}
                                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${config.agentEnabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'}`}
                                >
                                    <div className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${config.agentEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <h3 className="font-bold text-[14px] text-white">Message Automation</h3>
                                    <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5">
                                        Automatically dispatch simulated replies on customer inquiries.
                                    </p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => toggleAutomation(!config.automationEnabled)}
                                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${config.automationEnabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'}`}
                                >
                                    <div className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${config.automationEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Provider Selection Cards (ChatGPT & Kimi) */}
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[14px] text-white flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-purple-400" />
                                AI Provider Engine Selection
                            </h3>
                            <span className="text-[11px] text-slate-400">Click card to switch active reasoning model</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            {/* Provider Card 1: ChatGPT */}
                            <div 
                                onClick={() => selectProvider('chatgpt')}
                                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                    config.selectedProvider === 'chatgpt'
                                        ? 'bg-[#111318] border-[#10A37F] shadow-lg shadow-[#10A37F]/10'
                                        : 'bg-[#16181D] border-[#2D333B] hover:border-slate-600'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-[#10A37F]/10 text-[#10A37F]">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white">OpenAI ChatGPT</h4>
                                                <span className="text-[10px] text-slate-400">OpenAI Inc.</span>
                                            </div>
                                        </div>
                                        {config.selectedProvider === 'chatgpt' ? (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#10A37F]/20 text-[#10A37F] border border-[#10A37F]/30 flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" /> Active
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-500">Click to Select</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                                        {providers.chatgpt.description}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-[#2D333B] flex items-center justify-between text-[11px]">
                                    <span className="font-mono text-xs text-[#10A37F]">{providers.chatgpt.selectedModel}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTestConnection('chatgpt');
                                        }}
                                        className="text-[10px] text-slate-300 hover:text-white underline"
                                    >
                                        Test Ping
                                    </button>
                                </div>
                            </div>

                            {/* Provider Card 2: Kimi */}
                            <div 
                                onClick={() => selectProvider('kimi')}
                                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                    config.selectedProvider === 'kimi'
                                        ? 'bg-[#111318] border-[#6366F1] shadow-lg shadow-[#6366F1]/10'
                                        : 'bg-[#16181D] border-[#2D333B] hover:border-slate-600'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                                                <BrainCircuit className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white">Moonshot Kimi</h4>
                                                <span className="text-[10px] text-slate-400">Moonshot AI</span>
                                            </div>
                                        </div>
                                        {config.selectedProvider === 'kimi' ? (
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30 flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" /> Active
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-500">Click to Select</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                                        {providers.kimi.description}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-[#2D333B] flex items-center justify-between text-[11px]">
                                    <span className="font-mono text-xs text-[#6366F1]">{providers.kimi.selectedModel}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTestConnection('kimi');
                                        }}
                                        className="text-[10px] text-slate-300 hover:text-white underline"
                                    >
                                        Test Ping
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 4 Interactive Configuration Sections */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Agent Personality &amp; Rules
                            </span>
                            <span className="text-[11px] text-slate-500">Click any card to edit parameters</span>
                        </div>

                        {/* 1. Message Format & Instructions */}
                        <button 
                            type="button"
                            onClick={() => openConfigModal('messageFormat')}
                            className="w-full bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] transition-colors rounded-2xl p-4 flex items-center justify-between group text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-[#111318] border border-[#2D333B] text-white">
                                    <Keyboard size={18} />
                                </div>
                                <div>
                                    <span className="font-bold text-[14px] text-white block">Message Format &amp; Instructions</span>
                                    <span className="text-xs text-slate-400">
                                        Length: {config.messageFormat?.maxLength || 'detailed'} • Emojis: {config.messageFormat?.includeEmoji ? 'Yes' : 'No'} • Demo Link: {config.messageFormat?.includeDemoLink ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-300" />
                        </button>

                        {/* 2. Image Recognition (Simulated Capability) */}
                        <button 
                            type="button"
                            onClick={() => openConfigModal('imageRecognition')}
                            className="w-full bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] transition-colors rounded-2xl p-4 flex items-center justify-between group text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-[#111318] border border-[#2D333B] text-amber-400">
                                    <ImageIcon size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[14px] text-white">Image Recognition</span>
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                            Simulated / Sandbox
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        Visual document OCR &amp; screenshot reasoning (Requires client cloud quota)
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-300" />
                        </button>

                        {/* 3. Business Information */}
                        <button 
                            type="button"
                            onClick={() => openConfigModal('businessInfo')}
                            className="w-full bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] transition-colors rounded-2xl p-4 flex items-center justify-between group text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-[#111318] border border-[#2D333B] text-blue-400">
                                    <BrainCircuit size={18} />
                                </div>
                                <div>
                                    <span className="font-bold text-[14px] text-white block">Business Information &amp; Hours</span>
                                    <span className="text-xs text-slate-400">
                                        {config.businessInfo?.workingHours} • {config.businessInfo?.supportEmail}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-300" />
                        </button>

                        {/* 4. Language to Use */}
                        <button 
                            type="button"
                            onClick={() => openConfigModal('language')}
                            className="w-full bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] transition-colors rounded-2xl p-4 flex items-center justify-between group text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-[#111318] border border-[#2D333B] text-emerald-400">
                                    <Languages size={18} />
                                </div>
                                <div>
                                    <span className="font-bold text-[14px] text-white block">Language to Use</span>
                                    <span className="text-xs text-slate-400">
                                        Primary: {config.responseLanguage} • Auto-Detect: {config.autoDetectLanguage ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-300" />
                        </button>
                    </div>

                </div>

                {/* Right Panel: Preview Agent Simulator (6 Cols) */}
                <div className="lg:col-span-6 bg-[#1C1F26] border border-[#2D333B] rounded-2xl flex flex-col h-[700px] overflow-hidden shadow-xl">
                    
                    {/* Simulator Header */}
                    <div className="p-4 border-b border-[#2D333B] flex justify-between items-center bg-[#1C1F26] shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[14px] text-white flex items-center gap-2">
                                    {config.agentDisplayName || 'AI Sales Agent'}
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </h3>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    {activeProvider.name} • {activeProvider.selectedModel}
                                </span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={resetConversation}
                            title="Reset chat to initial state"
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#111318] px-3 py-1.5 rounded-lg border border-[#2D333B] transition-colors"
                        >
                            <RefreshCcw size={12} /> Reset
                        </button>
                    </div>

                    {/* Disabled Agent Warning Banner */}
                    {!config.agentEnabled && (
                        <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs flex items-center justify-between px-4">
                            <span className="flex items-center gap-1.5 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                AI Agent is currently disabled. Enable agent to resume automated simulated responses.
                            </span>
                            <button
                                type="button"
                                onClick={() => toggleAgent(true)}
                                className="underline font-bold hover:text-white text-[11px]"
                            >
                                Enable Now
                            </button>
                        </div>
                    )}

                    {/* Chat Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#111318]">
                        {chatMessages.map(msg => {
                            const isUser = msg.sender === 'user';
                            const isSystem = msg.sender === 'system';

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs">
                                        {msg.text}
                                    </div>
                                );
                            }

                            return (
                                <div 
                                    key={msg.id}
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-center gap-1.5 mb-1 px-1">
                                        <span className="text-[10px] font-semibold text-slate-400">
                                            {isUser ? 'You' : msg.senderName}
                                        </span>
                                        {!isUser && msg.provider && (
                                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1C1F26] text-purple-400 border border-[#2D333B]">
                                                {msg.provider}
                                            </span>
                                        )}
                                        <span className="text-[9px] text-slate-500">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                                        isUser 
                                            ? 'bg-[#8B5CF6] text-white rounded-tr-none' 
                                            : 'bg-[#1C1F26] text-slate-200 border border-[#2D333B] rounded-tl-none whitespace-pre-wrap'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Animated Typing Indicator */}
                        {isTyping && (
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-slate-500 mb-1 px-1">
                                    {config.agentDisplayName?.split(' - ')[0] || 'Aria'} is thinking...
                                </span>
                                <div className="p-3 rounded-2xl rounded-tl-none bg-[#1C1F26] border border-[#2D333B] flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Preset Prompts Bar */}
                    <div className="p-2.5 bg-[#16181D] border-t border-[#2D333B] flex gap-2 overflow-x-auto shrink-0">
                        {[
                            { label: 'Pricing Plans 💳', text: 'What are your software pricing plans?' },
                            { label: 'Services 🚀', text: 'What services and WhatsApp features do you provide?' },
                            { label: 'Book Demo 📅', text: 'Can I book a live product demonstration?' },
                            { label: 'Hours & SLA ⏰', text: 'What are your business operating hours and support SLA?' },
                            { label: 'Bulk Campaigns 📢', text: 'Tell me more about CRM bulk campaigns and templates.' }
                        ].map((prompt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleQuickPrompt(prompt.text)}
                                className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#111318] text-slate-300 border border-[#2D333B] hover:border-[#8B5CF6]/50 hover:text-white transition-colors whitespace-nowrap shrink-0"
                            >
                                {prompt.label}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-[#2D333B] bg-[#1C1F26] shrink-0">
                        <div className="flex items-center gap-2 bg-[#111318] border border-[#2D333B] rounded-2xl p-1.5 pl-3 focus-within:border-[#8B5CF6] transition-colors">
                            <button 
                                type="button"
                                onClick={handleAttachImageNotice}
                                title="Attach Image (Sandbox)"
                                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-1"
                            >
                                <Paperclip size={16} />
                            </button>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={config.agentEnabled ? "Type an inquiry or prompt the sales agent..." : "Agent disabled. Type message to test..."}
                                className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-slate-500 focus:outline-none min-w-0"
                            />
                            <button 
                                type="submit"
                                disabled={!userInput.trim()}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                                    userInput.trim() 
                                        ? 'text-white bg-[#8B5CF6] hover:bg-[#7C3AED]' 
                                        : 'text-slate-500 bg-[#2D333B]/50'
                                }`}
                            >
                                <Send size={13} className={userInput.trim() ? 'ml-0.5' : ''} />
                            </button>
                        </div>
                    </form>

                </div>

            </div>

            {/* Agent Activity & Audit History Table */}
            <div className="bg-[#16181D] rounded-2xl border border-[#2D333B] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <History className="w-4 h-4 text-purple-400" />
                            AI Agent Activity &amp; Audit Trail
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Real-time log of customer inquiries, provider switches, latency tests, and state updates.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={activitySearchQuery}
                                onChange={(e) => setActivitySearchQuery(e.target.value)}
                                placeholder="Search activity logs..."
                                className="bg-[#111318] border border-[#2D333B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                            />
                        </div>

                        {/* Activity Filter Dropdown */}
                        <select
                            value={activityFilter}
                            onChange={(e) => setActivityFilter(e.target.value)}
                            className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#8B5CF6]"
                        >
                            <option value="all">All Activities</option>
                            <option value="Simulated Reply">Simulated Replies</option>
                            <option value="Provider Switch">Provider Switches</option>
                            <option value="Config Update">Config Updates</option>
                            <option value="Connection Test">Connection Tests</option>
                            <option value="Agent Toggled">Agent Toggles</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#111318] text-[10px] uppercase text-slate-400 border-b border-[#2D333B] font-bold">
                            <tr>
                                <th className="py-2.5 px-3">Log ID</th>
                                <th className="py-2.5 px-3">Context / Customer</th>
                                <th className="py-2.5 px-3">AI Engine</th>
                                <th className="py-2.5 px-3">Activity Type</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3">Timestamp</th>
                                <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2D333B] text-slate-300">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map(act => (
                                    <tr key={act.id} className="hover:bg-[#1C1F26]/60 transition-colors">
                                        <td className="py-2.5 px-3 font-mono font-semibold text-purple-400">
                                            {act.id}
                                        </td>
                                        <td className="py-2.5 px-3 font-medium text-white truncate max-w-xs">
                                            {act.conversationName}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className="font-mono text-[11px] text-slate-300">
                                                {act.provider}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111318] text-slate-300 border border-[#2D333B]">
                                                {act.activityType}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                {act.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-2.5 px-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedActivityForDetail(act)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-500">
                                        No activity records found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mount Modals */}
            <ProviderConfigModal />
            <AgentSettingsModal />
            <ActivityDetailModal />

        </div>
    );
};

export default SalesAgent;
