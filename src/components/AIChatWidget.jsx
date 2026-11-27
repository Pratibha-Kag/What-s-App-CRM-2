import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { mockAIReplies } from '../mock/mockData';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', content: "Hi! I'm your WhatsApp CRM AI assistant. How can I help you with your study abroad plans today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        
        // Optimistic UI update
        const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            const lower = userMsg.toLowerCase();
            let botReply = mockAIReplies.default;
            if (lower.includes('uk') || lower.includes('london')) {
                botReply = mockAIReplies.uk;
            } else if (lower.includes('ielts') || lower.includes('toefl') || lower.includes('score')) {
                botReply = mockAIReplies.ielts;
            } else if (lower.includes('canada') || lower.includes('visa') || lower.includes('pr')) {
                botReply = mockAIReplies.canada;
            }
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: botReply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'assistant', 
                content: "I'm sorry, I'm having trouble right now. Please try again or use the contact form." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] max-h-[80vh] mb-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-indigo-600 p-4 flex items-center justify-between shadow-md relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 text-white">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-sm tracking-tight">WhatsApp CRM Assistant</h3>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            msg.role === 'user' 
                                                ? 'bg-slate-200 text-slate-600' 
                                                : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`px-4 py-3 text-sm font-medium shadow-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Bot size={14} />
                                        </div>
                                        <div className="px-4 py-3 bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                            <Loader2 size={14} className="animate-spin" /> Thinking...
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 relative z-10">
                            <div className="relative flex items-center">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    disabled={isLoading}
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} className={inputValue.trim() ? "translate-x-0.5" : ""} />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Powered by AI Intelligence</span>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button & Tooltip */}
            <div className="relative">
                {!isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                        className="absolute bottom-20 right-0 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-2xl rounded-br-sm shadow-[0_10px_25px_rgba(79,70,229,0.4)] border border-indigo-500/50 font-black text-sm whitespace-nowrap cursor-pointer hover:scale-105"
                        onClick={() => setIsOpen(true)}
                    >
                        Connect with us 👋
                    </motion.div>
                )}
                
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    animate={!isOpen ? { y: [0, -8, 0] } : {}}
                    transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[20px] shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center relative overflow-hidden group border border-indigo-400/50 hover:shadow-[0_0_40px_rgba(79,70,229,0.8)]"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10 group-hover:scale-110 transition-transform" />}
                    
                    {/* Notification Badge */}
                    {!isOpen && (
                        <span className="absolute top-3 right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-indigo-600"></span>
                        </span>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default AIChatWidget;
