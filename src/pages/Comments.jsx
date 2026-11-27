import React, { useState } from 'react';
import { Link2Off, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Comments = () => {
    const [activeTab, setActiveTab] = useState('FB');
    const navigate = useNavigate();

    return (
        <div className="h-full bg-[#111318] text-white p-6">
            <div className="max-w-[1400px] mx-auto h-full flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Feed Automation</h1>
                    <button className="bg-[#A855F7] hover:bg-[#9333EA] px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                        Automate All Posts
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#1C1F26] border border-[#2D333B] rounded-2xl flex flex-col relative overflow-hidden">
                    
                    {/* Tabs */}
                    <div className="p-4 border-b border-[#2D333B]">
                        <div className="inline-flex bg-[#111318] rounded-xl p-1 border border-[#2D333B]">
                            <button 
                                onClick={() => setActiveTab('FB')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'FB' ? 'bg-[#A855F7] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                WhatsApp CRM - FB
                            </button>
                            <button 
                                onClick={() => setActiveTab('Instagram')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Instagram' ? 'bg-[#A855F7] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Instagram
                            </button>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#111318] flex items-center justify-center mb-4 border border-[#2D333B]">
                            <Link2Off size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-[16px] font-bold text-white mb-2">
                            Your {activeTab === 'FB' ? 'Facebook' : 'Instagram'} account is not connected yet.
                        </h3>
                        <p className="text-[13px] text-slate-400 mb-6 max-w-[400px] leading-relaxed">
                            Connect your {activeTab === 'FB' ? 'Facebook page' : 'Instagram account'} to automate comments, track mentions, and auto-reply to post engagements.
                        </p>
                        <button 
                            onClick={() => navigate('../integrations')}
                            className="bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2"
                        >
                            Go to Integrations
                            <span className="text-xs text-slate-400 ml-1">↗</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Comments;
