import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Send, MessageSquare, Loader2, CheckCircle2, 
    MoreVertical, Info, Star, MessageSquareOff, ChevronDown, Bell,
    UserSquare, ShoppingBag, MessageSquareX, Ticket
} from 'lucide-react';
import { mockConversations, mockMessagesByConversation } from '../mock/mockData';
import useAppStore from '../store/useStore';
import { toast } from '../components/ui/Toast';

const SimpleInbox = () => {
    const [conversations, setConversations] = useState(mockConversations);
    const [messagesStore, setMessagesStore] = useState(mockMessagesByConversation);
    const [selectedConvId, setSelectedConvId] = useState(mockConversations[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All Contacts');
    
    const messagesEndRef = useRef(null);
    const currentUser = useAppStore(state => state);

    const loadingConvs = false;
    const loadingMsgs = false;
    const selectedConv = conversations.find(c => c.id === selectedConvId);
    const messages = selectedConvId ? (messagesStore[selectedConvId] || []) : [];

    // Mark as read when selected
    useEffect(() => {
        if (!selectedConvId) return;
        setConversations(prev => prev.map(c => c.id === selectedConvId ? { ...c, unread_count: 0 } : c));
    }, [selectedConvId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvId) return;
        
        const messageText = newMessage.trim();
        const newMsgObj = {
            id: 'msg-' + Date.now(),
            conversation_id: selectedConvId,
            sender_type: 'Agent',
            message: messageText,
            created_at: new Date().toISOString()
        };

        setMessagesStore(prev => ({
            ...prev,
            [selectedConvId]: [...(prev[selectedConvId] || []), newMsgObj]
        }));

        setConversations(prev => prev.map(c => c.id === selectedConvId ? {
            ...c,
            last_message: messageText,
            last_message_time: new Date().toISOString()
        } : c));

        setNewMessage('');
    };

    const filteredConvs = conversations.filter(c => 
        (c.lead_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.lead_phone || '').includes(searchTerm)
    );

    const tabs = [
        { id: 'All Contacts', count: conversations.length, icon: UserSquare },
        { id: 'Order Request', count: 54, icon: ShoppingBag },
        { id: 'Unreplied', count: conversations.filter(c => c.unread_count > 0).length || 71, icon: MessageSquareX },
        { id: 'Tickets', count: 5, icon: Ticket },
    ];

    return (
        <div className="flex flex-col h-full bg-[#111318] text-white overflow-hidden">
            {/* INBOX TABS HEADER - Spanning Full Width */}
            <div className="flex items-center justify-between border-b border-[#1E232B] px-4 pt-2 pb-0 shrink-0 bg-[#111318]">
                <div className="flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer text-xs mb-2">&lt;</span>
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-3 mb-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                                activeTab === tab.id 
                                    ? 'text-[#A855F7] font-bold' 
                                    : 'border border-[#2D333B] rounded-lg text-slate-300 hover:bg-[#1C1F26] font-medium'
                            }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-[#A855F7]' : 'text-slate-400'} />
                            <span className="text-[13px]">{tab.id}</span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                                activeTab === tab.id ? 'bg-[#A855F7]/20 text-[#A855F7]' : 'bg-[#1C1F26] text-slate-400 border border-slate-800'
                            }`}>
                                {tab.count}
                            </span>
                            {activeTab === tab.id && (
                                <div className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-[#A855F7]" />
                            )}
                        </button>
                    ))}
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer pl-1 text-xs mb-2">&gt;</span>
                </div>
                <div className="flex items-center gap-2 pl-4 shrink-0 mb-2">
                    <button className="text-[12px] font-medium text-slate-300 flex items-center gap-1.5 hover:text-white transition-colors border border-[#2D333B] rounded-lg px-3 py-1.5 bg-transparent">
                        <UserSquare size={14} className="text-slate-400" /> All Channels <ChevronDown size={14} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden border-t border-[#1E232B]">
                {/* 1. LEFT PANEL: Conversations */}
                <div className="w-[360px] border-r border-[#1E232B] flex flex-col shrink-0 bg-[#111318]">

                    {/* Search & Filter */}
                    <div className="p-3 flex items-center gap-2 border-b border-[#1E232B] shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by nam..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-transparent border border-[#2D333B] rounded-lg text-sm text-white focus:outline-none focus:border-slate-600 transition-colors placeholder:text-slate-500"
                            />
                        </div>
                        <button className="px-3 py-2 bg-transparent border border-[#2D333B] rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1C1F26] transition-colors flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full px-2 pb-4 space-y-1">
                        {loadingConvs ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-500" /></div>
                        ) : filteredConvs.length === 0 ? (
                            <div className="text-center text-slate-500 py-10 text-sm">No chats found.</div>
                        ) : (
                            filteredConvs.map(conv => (
                                <div 
                                    key={conv.id}
                                    onClick={() => setSelectedConvId(conv.id)}
                                    className={`p-3 cursor-pointer transition-colors border-b border-slate-800 ${
                                        selectedConvId === conv.id 
                                            ? 'bg-[#1C1F26]' 
                                            : 'hover:bg-slate-800/30'
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative shrink-0">
                                            <img 
                                                src={`https://i.pravatar.cc/150?u=${conv.id || conv.lead_phone}`} 
                                                alt="avatar" 
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <div className="h-3.5 w-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold" style={{ fontSize: '10px' }}>
                                                    f
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <div className="truncate">
                                                    <h3 className="text-sm font-bold text-white truncate">
                                                        {conv.lead_name || 'Md Anamul'}
                                                    </h3>
                                                    <p className="text-[12px] text-[#1877F2] font-medium truncate">@{(conv.lead_name || 'Shohel Rana').replace(' ', '').toLowerCase()}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                                    <Star size={14} className="text-slate-600" />
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        {new Date(conv.last_message_time || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-[13px] text-slate-300 truncate mb-3">
                                                {conv.last_message || 'No message available'}
                                            </p>
                                            <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 border border-slate-600">
                                                WhatsApp CRM - FB
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. CENTER PANEL: Chat Window */}
                <div className="flex-1 flex flex-col relative bg-[#111318] pattern-dots pattern-slate-800 pattern-bg-transparent pattern-size-4">
                    {selectedConvId ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[72px] bg-[#1C1F26] border-b border-slate-800 px-6 flex items-center justify-between shrink-0 z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                                        {(selectedConv?.lead_name || selectedConv?.lead_phone || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-white">{selectedConv?.lead_phone}</h2>
                                        <p className="text-xs text-slate-400">{selectedConv?.lead_name || 'Unknown User'}</p>
                                    </div>
                                </div>
                                <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 transition-colors border border-slate-800">
                                    <MoreVertical size={16} />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar z-10">
                                {loadingMsgs ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-500" /></div>
                                ) : messages.map((msg, idx) => {
                                    const isMe = msg.sender_type !== 'Customer';
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl p-3 relative ${
                                                isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-[#1C1F26] border border-slate-800 text-slate-200 rounded-tl-sm'
                                            }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                <div className={`text-[10px] mt-1 text-right opacity-70`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-[#111318] border-t border-slate-800 shrink-0 z-10">
                                <form onSubmit={handleSend} className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full bg-[#1C1F26] border border-slate-800 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-slate-600 transition-colors"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim() || sendMessage.isPending}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                <div className="flex items-center gap-4 mt-3 px-2 text-[12px] font-bold text-slate-500">
                                    <button className="flex items-center gap-1.5 hover:text-slate-300"><MessageSquare size={14} /> Emoji</button>
                                    <button className="flex items-center gap-1.5 hover:text-slate-300"><ChevronDown size={14} /> Audio</button>
                                    <button className="flex items-center gap-1.5 hover:text-slate-300"><ChevronDown size={14} /> Attach</button>
                                    <button className="flex items-center gap-1.5 hover:text-slate-300"><ChevronDown size={14} /> Products</button>
                                    <button className="flex items-center gap-1.5 hover:text-slate-300"><ChevronDown size={14} /> Replies</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-slate-800/20 blur-2xl rounded-full" />
                                <MessageSquareOff size={64} className="text-slate-600 relative z-10" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No conversations selected yet.</h3>
                            <p className="text-sm">Select a contact to start or view a conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleInbox;
