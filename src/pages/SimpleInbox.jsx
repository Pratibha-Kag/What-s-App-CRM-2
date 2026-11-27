import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Send, MessageSquare, Loader2, Check, CheckCheck, 
    MoreVertical, Info, Star, MessageSquareOff, ChevronDown, Bell,
    UserSquare, ShoppingBag, MessageSquareX, Ticket, AlertCircle, 
    RefreshCw, RotateCcw, ArrowLeft, Bot, Sparkles, Smartphone,
    PowerOff, Power, Link2, ShieldCheck, CheckCircle2, Paperclip, Smile,
    FileText, Megaphone, Zap
} from 'lucide-react';
import useWhatsAppStore from '../store/useWhatsAppStore';
import WhatsAppConnectModal from '../components/whatsapp/WhatsAppConnectModal';
import WhatsAppDisconnectModal from '../components/whatsapp/WhatsAppDisconnectModal';
import WhatsAppStatsBar from '../components/whatsapp/WhatsAppStatsBar';
import TemplatesLibrary from './TemplatesLibrary';
import CampaignsPage from './campaigns/CampaignsPage';
import AutomationsPage from './automations/AutomationsPage';
import { toast } from '../components/ui/Toast';

const SimpleInbox = () => {
    const {
        account,
        conversations,
        messagesStore,
        selectedConvId,
        setSelectedConvId,
        searchTerm,
        setSearchTerm,
        filterTab,
        setFilterTab,
        categoryTab,
        setCategoryTab,
        isStatsOpen,
        setIsStatsOpen,
        setIsConnectModalOpen,
        setIsDisconnectModalOpen,
        reconnectAccount,
        mobileView,
        setMobileView,
        sendMessage,
        retryMessage,
        simulateCustomerReply,
        cycleMessageStatus
    } = useWhatsAppStore();

    const [newMessage, setNewMessage] = useState('');
    const [retryingMsgId, setRetryingMsgId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const tabParam = searchParams.get('tab') || searchParams.get('module') || 'inbox';
    const activeModule = (
        tabParam === 'templates' ? 'templates' :
        tabParam === 'campaigns' ? 'campaigns' :
        ['automations', 'birthday', 'festival', 'appointments', 'payments', 'rules', 'history'].includes(tabParam) ? 'automations' :
        'inbox'
    );

    const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
    const messages = selectedConv ? (messagesStore[selectedConv.id] || []) : [];

    // Scroll to bottom on message change or conversation select
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedConvId]);

    // Handle send with Enter (Shift+Enter for newline)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleSend = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        if (!account.connected) {
            toast.warning('WhatsApp account is disconnected. Please reconnect to send messages.');
            setIsConnectModalOpen(true);
            return;
        }

        const text = newMessage.trim();
        sendMessage(selectedConv.id, text);
        setNewMessage('');

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    // Retry a failed message
    const handleRetry = (msgId) => {
        if (!selectedConv) return;
        setRetryingMsgId(msgId);
        retryMessage(selectedConv.id, msgId);
        toast.info('Retrying message delivery...');
        setTimeout(() => setRetryingMsgId(null), 1200);
    };

    // Trigger demo failed message
    const handleSendTestFailed = () => {
        if (!selectedConv) return;
        sendMessage(selectedConv.id, 'Notice: Action required on your university fee invoice.', 'failed');
        toast.warning('Simulated failed message sent (Click retry on message to test recovery).');
    };

    // Filter conversations by category tab, status filter, and search text
    const filteredConvs = conversations.filter(conv => {
        const matchesSearch = 
            (conv.lead_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (conv.lead_phone || '').includes(searchTerm);

        if (!matchesSearch) return false;

        // Status Filter: all | unread | read
        if (filterTab === 'unread' && (!conv.unread_count || conv.unread_count === 0)) return false;
        if (filterTab === 'read' && conv.unread_count > 0) return false;

        // Category Tab Filter
        if (categoryTab === 'Unreplied' && (!conv.unread_count || conv.unread_count === 0)) return false;
        if (categoryTab === 'Order Request' && !conv.tag?.toLowerCase().includes('intake') && !conv.tag?.toLowerCase().includes('mba')) return false;
        if (categoryTab === 'Tickets' && !conv.tag?.toLowerCase().includes('germany') && !conv.tag?.toLowerCase().includes('canada')) return false;

        return true;
    });

    // Counts for Category Tabs
    const unrepliedCount = conversations.filter(c => c.unread_count > 0).length;
    const categoryTabs = [
        { id: 'All Contacts', count: conversations.length, icon: UserSquare },
        { id: 'Order Request', count: conversations.filter(c => c.tag?.toLowerCase().includes('intake') || c.tag?.toLowerCase().includes('mba')).length, icon: ShoppingBag },
        { id: 'Unreplied', count: unrepliedCount, icon: MessageSquareX },
        { id: 'Tickets', count: 2, icon: Ticket },
    ];

    return (
        <div className="flex flex-col h-full bg-[#111318] text-white overflow-hidden font-sans">
            {/* WHATSAPP CRM MODULE SWITCHER */}
            <div className="bg-[#14161C] border-b border-[#1E232B] px-4 py-2 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    <button
                        type="button"
                        id="tab-btn-inbox"
                        onClick={() => setSearchParams({ tab: 'inbox' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeModule === 'inbox'
                                ? 'bg-[#8B5CF6] text-white shadow-sm'
                                : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#252A34] border border-[#2D333B]'
                        }`}
                    >
                        <MessageSquare size={13} />
                        <span>Live Inbox &amp; Tracking</span>
                    </button>
                    <button
                        type="button"
                        id="tab-btn-templates"
                        onClick={() => setSearchParams({ tab: 'templates' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeModule === 'templates'
                                ? 'bg-[#8B5CF6] text-white shadow-sm'
                                : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#252A34] border border-[#2D333B]'
                        }`}
                    >
                        <FileText size={13} />
                        <span>Templates Library</span>
                    </button>
                    <button
                        type="button"
                        id="tab-btn-campaigns"
                        onClick={() => setSearchParams({ tab: 'campaigns' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeModule === 'campaigns'
                                ? 'bg-[#8B5CF6] text-white shadow-sm'
                                : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#252A34] border border-[#2D333B]'
                        }`}
                    >
                        <Megaphone size={13} />
                        <span>Campaigns &amp; Wizard</span>
                    </button>
                    <button
                        type="button"
                        id="tab-btn-automations"
                        onClick={() => setSearchParams({ tab: 'automations' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeModule === 'automations'
                                ? 'bg-[#8B5CF6] text-white shadow-sm'
                                : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#252A34] border border-[#2D333B]'
                        }`}
                    >
                        <Zap size={13} />
                        <span>Trigger Automations</span>
                    </button>
                </div>
            </div>

            {/* Sub-module Views */}
            {activeModule === 'templates' && (
                <div className="flex-1 overflow-y-auto">
                    <TemplatesLibrary />
                </div>
            )}

            {activeModule === 'campaigns' && (
                <div className="flex-1 overflow-y-auto">
                    <CampaignsPage />
                </div>
            )}

            {activeModule === 'automations' && (
                <div className="flex-1 overflow-y-auto">
                    <AutomationsPage />
                </div>
            )}

            {activeModule === 'inbox' && (
                <>
                    {/* 1. TOP ACCOUNT & CONNECTION BANNER */}
                    <div className="bg-[#16181D] border-b border-[#1E232B] px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Account Status Info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    <path d="M15.4 13.1c-.2-.1-.8-.4-1-.5-.2-.1-.3-.1-.4.1-.1.2-.4.5-.5.6-.1.1-.3.2-.5.1-.2-.1-.6-.2-1.1-.7-.4-.4-.7-.9-.8-1.1-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.8 2.1.9 2.3c.1.1 1.5 2.3 3.7 3.2.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#16181D] ${
                                account.connected ? 'bg-emerald-500' : account.status === 'connecting' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'
                            }`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white tracking-tight">{account.businessName}</span>
                                {account.connected && (
                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-md">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                                {account.phone} • <span className={account.connected ? 'text-emerald-400' : 'text-rose-400'}>{account.connected ? 'Live Sync Active' : 'Disconnected'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connection Controls & Sandbox Notice */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-400 bg-[#111318] border border-[#2D333B] px-2.5 py-1 rounded-lg">
                        Simulated Cloud API v20.0
                    </span>

                    {account.connected ? (
                        <button
                            onClick={() => setIsDisconnectModalOpen(true)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 active:scale-95"
                            title="Disconnect WhatsApp Business Account"
                        >
                            <PowerOff size={13} /> Disconnect
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={reconnectAccount}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors flex items-center gap-1.5 active:scale-95"
                            >
                                <RefreshCw size={13} /> Reconnect
                            </button>
                            <button
                                onClick={() => setIsConnectModalOpen(true)}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2D333B] hover:border-slate-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                            >
                                <Link2 size={13} /> Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. DYNAMIC MESSAGE DELIVERY TELEMETRY BAR */}
            <WhatsAppStatsBar />

            {/* 3. CATEGORY TABS & FILTER BAR */}
            <div className="flex items-center justify-between border-b border-[#1E232B] px-4 pt-2 shrink-0 bg-[#111318]">
                <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {categoryTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setCategoryTab(tab.id)}
                            className={`py-2 px-3 mb-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                                categoryTab === tab.id 
                                    ? 'text-[#A855F7] font-bold' 
                                    : 'border border-[#2D333B] rounded-lg text-slate-300 hover:bg-[#1C1F26] font-medium'
                            }`}
                        >
                            <tab.icon size={15} className={categoryTab === tab.id ? 'text-[#A855F7]' : 'text-slate-400'} />
                            <span className="text-[13px]">{tab.id}</span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                                categoryTab === tab.id ? 'bg-[#A855F7]/20 text-[#A855F7]' : 'bg-[#1C1F26] text-slate-400 border border-slate-800'
                            }`}>
                                {tab.count}
                            </span>
                            {categoryTab === tab.id && (
                                <div className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-[#A855F7]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Status Read/Unread Filters */}
                <div className="flex items-center gap-1.5 pl-2 shrink-0 mb-2">
                    <div className="flex items-center bg-[#16181D] p-0.5 rounded-lg border border-[#2D333B]">
                        {['all', 'unread', 'read'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setFilterTab(filter)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                                    filterTab === filter
                                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. MAIN INBOX CONTENT AREA */}
            <div className="flex flex-1 overflow-hidden border-t border-[#1E232B] relative">
                {/* 4A. LEFT PANEL: Conversations List */}
                <div className={`w-full lg:w-[360px] border-r border-[#1E232B] flex flex-col shrink-0 bg-[#111318] ${
                    mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
                }`}>
                    {/* Search & Status Indicator */}
                    <div className="p-3 flex items-center gap-2 border-b border-[#1E232B] shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#2D333B] rounded-lg text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Chat Conversation List */}
                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full px-2 py-2 space-y-1">
                        {filteredConvs.length === 0 ? (
                            <div className="text-center text-slate-500 py-12 px-4 space-y-2">
                                <MessageSquareOff size={32} className="mx-auto text-slate-600" />
                                <p className="text-sm font-bold text-slate-400">No chats found</p>
                                <p className="text-xs text-slate-500">Try adjusting your search terms or filter selection.</p>
                            </div>
                        ) : (
                            filteredConvs.map(conv => {
                                const isSelected = selectedConv?.id === conv.id;
                                return (
                                    <div 
                                        key={conv.id}
                                        onClick={() => {
                                            setSelectedConvId(conv.id);
                                            setMobileView('chat');
                                        }}
                                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                                            isSelected 
                                                ? 'bg-[#1C1F26] border-[#8B5CF6]/40 shadow-sm' 
                                                : 'border-transparent hover:bg-[#1C1F26]/50 hover:border-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Avatar with Channel Badge */}
                                            <div className="relative shrink-0">
                                                <img 
                                                    src={conv.avatar || `https://i.pravatar.cc/150?u=${conv.id}`} 
                                                    alt={conv.lead_name} 
                                                    className="h-10 w-10 rounded-full object-cover border border-slate-700"
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-[#25D366] text-white rounded-full p-0.5 shadow-sm">
                                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Conversation Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                                        {conv.lead_name || 'Contact'}
                                                    </h3>
                                                    <span className="text-[11px] text-slate-400 font-medium shrink-0 pl-1">
                                                        {conv.last_message_time ? new Date(conv.last_message_time).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-slate-400 font-mono truncate mb-1">
                                                    {conv.lead_phone}
                                                </p>

                                                {/* Last Message with Delivery Tick */}
                                                <div className="flex items-center justify-between gap-1">
                                                    <div className="flex items-center gap-1.5 truncate text-[12px] text-slate-300">
                                                        {conv.last_message_status === 'read' && (
                                                            <CheckCheck size={14} className="text-cyan-400 shrink-0" title="Read" />
                                                        )}
                                                        {conv.last_message_status === 'delivered' && (
                                                            <CheckCheck size={14} className="text-slate-400 shrink-0" title="Delivered" />
                                                        )}
                                                        {conv.last_message_status === 'sent' && (
                                                            <Check size={13} className="text-slate-400 shrink-0" title="Sent" />
                                                        )}
                                                        {conv.last_message_status === 'failed' && (
                                                            <AlertCircle size={13} className="text-rose-400 shrink-0" title="Failed" />
                                                        )}
                                                        <span className="truncate">{conv.last_message || 'No messages yet'}</span>
                                                    </div>

                                                    {/* Unread Counter Badge */}
                                                    {conv.unread_count > 0 && (
                                                        <span className="shrink-0 bg-[#8B5CF6] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                            {conv.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 4B. RIGHT PANEL: Active Chat Thread */}
                <div className={`flex-1 flex flex-col bg-[#111318] ${
                    mobileView === 'list' ? 'hidden lg:flex' : 'flex'
                }`}>
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[72px] bg-[#1C1F26] border-b border-[#1E232B] px-4 md:px-6 flex items-center justify-between shrink-0 z-10">
                                <div className="flex items-center gap-3">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setMobileView('list')}
                                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                        title="Back to conversation list"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>

                                    <div className="relative">
                                        <img 
                                            src={selectedConv.avatar || `https://i.pravatar.cc/150?u=${selectedConv.id}`}
                                            alt={selectedConv.lead_name}
                                            className="h-10 w-10 rounded-full object-cover border border-slate-700"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1C1F26]" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-bold text-white tracking-tight">{selectedConv.lead_name}</h2>
                                            <span className="text-[10px] font-bold bg-[#8B5CF6]/15 text-[#A855F7] px-2 py-0.5 rounded-md border border-[#8B5CF6]/30">
                                                {selectedConv.tag || 'Lead'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                                            <span>{selectedConv.lead_phone}</span>
                                            <span>•</span>
                                            <span className="text-emerald-400 font-medium">WhatsApp Online</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Header Demo Action Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            simulateCustomerReply(selectedConv.id);
                                            toast.success('Simulated customer reply received!');
                                        }}
                                        className="bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-slate-200 hover:text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                                        title="Simulate an incoming response from this customer"
                                    >
                                        <Bot size={14} className="text-[#8B5CF6]" />
                                        <span className="hidden sm:inline">Simulate Reply</span>
                                    </button>

                                    <button
                                        onClick={handleSendTestFailed}
                                        className="bg-[#111318] border border-[#2D333B] hover:border-rose-500/50 text-xs font-bold text-rose-300 px-3 py-1.5 rounded-xl transition-all hidden md:flex items-center gap-1.5 active:scale-95"
                                        title="Trigger an outgoing failed message to test retry"
                                    >
                                        <AlertCircle size={14} className="text-rose-400" />
                                        <span>Test Failed Msg</span>
                                    </button>
                                </div>
                            </div>

                            {/* Disconnected Notice Banner */}
                            {!account.connected && (
                                <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2 flex items-center justify-between text-xs text-rose-300">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={14} className="text-rose-400 shrink-0" />
                                        <span>WhatsApp Business is disconnected. Reconnect to send messages.</span>
                                    </div>
                                    <button
                                        onClick={() => setIsConnectModalOpen(true)}
                                        className="underline font-bold text-white hover:text-rose-200 ml-2"
                                    >
                                        Connect Now
                                    </button>
                                </div>
                            )}

                            {/* Messages Thread Container */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                                        <MessageSquare size={36} className="text-slate-600 mb-2" />
                                        <p className="text-sm font-bold text-slate-300">No message history</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Send a message below or click Simulate Reply to start the conversation.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isAgent = msg.sender_type === 'Agent';

                                        return (
                                            <div 
                                                key={msg.id} 
                                                className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 relative shadow-sm transition-all ${
                                                    isAgent 
                                                        ? 'bg-purple-600 text-white rounded-tr-sm' 
                                                        : 'bg-[#1C1F26] border border-[#2D333B] text-slate-200 rounded-tl-sm'
                                                }`}>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>

                                                    {/* Message Metadata & Delivery Tracking Ticks */}
                                                    <div className="flex items-center justify-end gap-1.5 mt-1.5 pt-1 border-t border-white/10 text-[10px] opacity-80">
                                                        <span>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>

                                                        {/* Delivery Status Indicator for Agent Messages */}
                                                        {isAgent && (
                                                            <div 
                                                                className="flex items-center gap-1 cursor-pointer select-none"
                                                                onClick={() => cycleMessageStatus(selectedConv.id, msg.id)}
                                                                title={`Delivery Status: ${msg.status || 'sent'}. Click to cycle status.`}
                                                            >
                                                                {msg.status === 'read' && (
                                                                    <div className="flex items-center text-cyan-300 font-bold" title="Read by customer">
                                                                        <CheckCheck size={14} className="stroke-[2.5]" />
                                                                    </div>
                                                                )}
                                                                {msg.status === 'delivered' && (
                                                                    <div className="flex items-center text-slate-200" title="Delivered to recipient">
                                                                        <CheckCheck size={14} className="stroke-[2]" />
                                                                    </div>
                                                                )}
                                                                {msg.status === 'sent' && (
                                                                    <div className="flex items-center text-slate-200" title="Sent to WhatsApp servers">
                                                                        <Check size={13} className="stroke-[2]" />
                                                                    </div>
                                                                )}
                                                                {msg.status === 'failed' && (
                                                                    <div className="flex items-center text-rose-300 font-bold gap-1" title={msg.error_reason || 'Delivery failed'}>
                                                                        <AlertCircle size={13} />
                                                                        <span>Failed</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Failed Delivery Inline Retry Banner */}
                                                    {isAgent && msg.status === 'failed' && (
                                                        <div className="mt-2 pt-2 border-t border-rose-400/30 flex items-center justify-between gap-2 text-xs text-rose-200">
                                                            <span className="text-[11px] truncate">{msg.error_reason || 'Message failed to deliver'}</span>
                                                            <button
                                                                onClick={() => handleRetry(msg.id)}
                                                                disabled={retryingMsgId === msg.id}
                                                                className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/40 text-white rounded font-bold text-[11px] transition-colors flex items-center gap-1 shrink-0 border border-rose-400/40"
                                                            >
                                                                <RotateCcw size={11} className={retryingMsgId === msg.id ? 'animate-spin' : ''} />
                                                                Retry
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Composer */}
                            <div className="p-3 md:p-4 bg-[#111318] border-t border-[#1E232B] shrink-0 z-10">
                                <form onSubmit={handleSend} className="relative">
                                    <textarea 
                                        ref={textareaRef}
                                        rows={1}
                                        placeholder={account.connected ? "Type a WhatsApp message (Enter to send, Shift+Enter for new line)..." : "WhatsApp disconnected. Reconnect above to send."}
                                        value={newMessage}
                                        disabled={!account.connected}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full bg-[#1C1F26] border border-[#2D333B] text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-[#8B5CF6] transition-colors text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ maxHeight: '120px' }}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim() || !account.connected}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#8B5CF6]/20 active:scale-95"
                                        title="Send message (Enter)"
                                    >
                                        <Send size={15} />
                                    </button>
                                </form>

                                {/* Action Shortcuts Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] font-bold text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-1 hover:text-white transition-colors"><Smile size={13} /> Emoji</button>
                                        <button className="flex items-center gap-1 hover:text-white transition-colors"><Paperclip size={13} /> Attach</button>
                                        <button 
                                            onClick={() => setNewMessage('Hello! Here is the updated information you requested.')}
                                            className="hidden sm:flex items-center gap-1 hover:text-white transition-colors text-[#8B5CF6]"
                                        >
                                            Quick Reply
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        Press Enter ↵ to Send
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <MessageSquareOff size={56} className="text-slate-600 mb-3" />
                            <h3 className="text-base font-bold text-white mb-1">No conversation selected</h3>
                            <p className="text-xs text-slate-500 max-w-xs">Select a contact from the list on the left to start viewing and sending WhatsApp messages.</p>
                        </div>
                    )}
                </div>
            </div>
            </>
            )}

            {/* Modals */}
            <WhatsAppConnectModal />
            <WhatsAppDisconnectModal />
        </div>
    );
};

export default SimpleInbox;
