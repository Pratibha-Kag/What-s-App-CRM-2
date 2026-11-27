import React, { useState } from 'react';
import { 
    Keyboard, Image as ImageIcon, BrainCircuit, Languages, 
    ChevronRight, Sparkles, Send, RefreshCcw, Paperclip 
} from 'lucide-react';

const SalesAgent = () => {
    const [agentEnabled, setAgentEnabled] = useState(true);
    const [automationEnabled, setAutomationEnabled] = useState(true);
    const [previewMessage, setPreviewMessage] = useState('');

    const sections = [
        { icon: Keyboard, label: 'Message Format & Instructions' },
        { icon: ImageIcon, label: 'Image Recognition' },
        { icon: BrainCircuit, label: 'Business Information' },
        { icon: Languages, label: 'Language to Use' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#111318] text-white">
            <div className="w-full flex flex-col h-full p-6 pt-2">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-6 border-b border-[#1E232B] pb-4">
                    <h1 className="text-[22px] font-bold">Sales Agent</h1>
                    <span className="text-[13px] text-slate-400">Edit below, then save</span>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex gap-6 overflow-hidden">
                    
                    {/* Left Panel: Configuration */}
                    <div className="w-[55%] flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2D333B] [&::-webkit-scrollbar-thumb]:rounded-full pr-2 pb-10">
                        
                        {/* Toggles */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-[15px] mb-1.5 text-white">Sales Agent</h3>
                                        <p className="text-[13px] text-slate-400 leading-relaxed">Configure and test the automation using Preview Agent</p>
                                    </div>
                                    <button 
                                        onClick={() => setAgentEnabled(!agentEnabled)}
                                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${agentEnabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'}`}
                                    >
                                        <div className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${agentEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-[15px] mb-1.5 text-white">Message Automation</h3>
                                        <p className="text-[13px] text-slate-400 leading-relaxed">AI will reply to your customers on connected channels</p>
                                    </div>
                                    <button 
                                        onClick={() => setAutomationEnabled(!automationEnabled)}
                                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${automationEnabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'}`}
                                    >
                                        <div className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${automationEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Config Sections */}
                        <div className="space-y-3 mt-1">
                            {sections.map((section, idx) => (
                                <button key={idx} className="w-full bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] transition-colors rounded-2xl p-5 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <section.icon size={20} className="text-white" strokeWidth={2} />
                                        <span className="font-bold text-[14px] text-white">{section.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-300" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Preview Agent */}
                    <div className="w-[45%] bg-[#1C1F26] border border-[#2D333B] rounded-2xl flex flex-col h-[calc(100vh-140px)] overflow-hidden">
                        
                        {/* Preview Header */}
                        <div className="p-5 border-b border-[#2D333B] flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-[15px] text-white">Preview Agent</h3>
                            <button className="flex items-center gap-2 text-[13px] font-bold text-white hover:text-slate-300 transition-colors">
                                <RefreshCcw size={14} /> Reset
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#111318]">
                            <p className="text-slate-400 text-[14px] max-w-[320px] mb-10 leading-relaxed">
                                Use this Agent to see exactly how your AI would reply to customers in real conversations.
                            </p>
                            <div className="flex gap-3">
                                <button className="bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-slate-300 px-5 py-2.5 rounded-full text-[13px] transition-colors">
                                    Hello 👋
                                </button>
                                <button className="bg-[#1C1F26] border border-[#2D333B] hover:border-[#4B5563] text-slate-300 px-5 py-2.5 rounded-full text-[13px] transition-colors">
                                    What do you sell? 🤔
                                </button>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-5 border-t border-[#2D333B] bg-[#1C1F26] shrink-0">
                            <div className="flex items-center gap-3 bg-[#111318] border border-[#2D333B] rounded-[24px] p-1.5 pl-4 focus-within:border-[#8B5CF6] transition-colors">
                                <button className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                                    <Paperclip size={18} />
                                </button>
                                <input
                                    type="text"
                                    value={previewMessage}
                                    onChange={(e) => setPreviewMessage(e.target.value)}
                                    placeholder="Message the assistant..."
                                    className="flex-1 bg-transparent border-none text-[14px] text-white placeholder:text-slate-500 focus:outline-none min-w-0"
                                />
                                <button 
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${previewMessage.trim() ? 'text-white bg-[#8B5CF6] hover:bg-[#7C3AED]' : 'text-slate-400 bg-[#2D333B]'}`}
                                >
                                    <Send size={14} className={previewMessage.trim() ? 'ml-0.5' : ''} />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SalesAgent;
