import React, { useState } from 'react';
import { Facebook, MessageCircle, Instagram, Link2 } from 'lucide-react';

const Integrations = () => {
    const [waConnected, setWaConnected] = useState(false);

    return (
        <div className="space-y-6 pb-20 p-6 max-w-[1400px] mx-auto">
            <div>
                <h1 className="text-[32px] md:text-[40px] font-black text-white uppercase tracking-wider mb-2">Integrations</h1>
                <p className="text-[13px] text-slate-400">Connect your channels to receive and manage messages in the shared inbox.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Facebook Page Card */}
                <div className="bg-[#1C1F26] rounded-2xl p-6 border border-[#2D333B] text-white flex flex-col h-full shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-[#2A303C] p-2 rounded-2xl shrink-0">
                            <div className="bg-[#1877F2] w-11 h-11 rounded-xl flex items-center justify-center">
                                <Facebook size={26} className="text-white fill-white stroke-none mt-1" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg leading-tight mt-2">Facebook Page 1</h3>
                    </div>
                    <p className="text-slate-400 text-[13px] leading-relaxed mb-6 flex-1">
                        Sync posts, automate comments, and auto-reply to messages from your dashboard.
                    </p>
                    <div className="space-y-3 mt-auto">
                        <button 
                            onClick={() => window.open('https://www.facebook.com/login.php', '_blank')}
                            className="h-11 w-full bg-[#5D5FEF] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#4F51E5] transition-colors flex items-center justify-center gap-2"
                        >
                            <Link2 size={14} />
                            Connect with Page Access
                        </button>
                        <button 
                            onClick={() => window.open('https://www.facebook.com/login.php', '_blank')}
                            className="h-11 w-full bg-[#5D5FEF] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#4F51E5] transition-colors flex items-center justify-center gap-2"
                        >
                            <Link2 size={14} />
                            Connect using Business
                        </button>
                    </div>
                </div>

                {/* Instagram Card */}
                <div className="bg-[#1C1F26] rounded-2xl p-6 border border-[#2D333B] text-white flex flex-col h-full shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-[#2A303C] p-2 rounded-2xl shrink-0">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#FFCF00] via-[#F3006A] to-[#9B00E8]">
                                <Instagram size={26} className="text-white" strokeWidth={2} />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg leading-tight mt-2">Instagram</h3>
                    </div>
                    <p className="text-slate-400 text-[13px] leading-relaxed mb-6 flex-1">
                        Manage DMs, track story mentions, and automate responses to post comments.
                    </p>
                    <button 
                        onClick={() => window.open('https://www.instagram.com/accounts/login/', '_blank')}
                        className="h-11 w-full bg-[#5D5FEF] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#4F51E5] transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                        <Link2 size={14} />
                        Connect
                    </button>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-[#1C1F26] rounded-2xl p-6 border border-[#2D333B] text-white flex flex-col h-full shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#2A303C] p-2 rounded-2xl shrink-0">
                                <div className="bg-[#25D366] w-11 h-11 rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                        <path d="M15.4 13.1c-.2-.1-.8-.4-1-.5-.2-.1-.3-.1-.4.1-.1.2-.4.5-.5.6-.1.1-.3.2-.5.1-.2-.1-.6-.2-1.1-.7-.4-.4-.7-.9-.8-1.1-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.8 2.1.9 2.3c.1.1 1.5 2.3 3.7 3.2.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z" stroke="none" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg leading-tight w-24 mt-1">WhatsApp Business Account 1</h3>
                        </div>
                        {waConnected && (
                            <span className="shrink-0 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider h-fit mt-1">
                                Connected
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 text-[13px] leading-relaxed mb-6 flex-1">
                        Connect your business number to automate WhatsApp conversations.
                    </p>
                    
                    {waConnected ? (
                        <div className="space-y-4 mt-auto">
                            <div className="bg-[#111318] border border-[#2D333B] rounded-xl p-3 px-4">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Phone Number</span>
                                <span className="text-[13px] font-bold text-slate-200">+1 (555) 019-2834</span>
                            </div>
                            <button className="h-11 w-full bg-transparent text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#2D333B] transition-colors border border-[#2D333B] flex items-center justify-center gap-2">
                                <Link2 size={14} />
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => window.open('https://developers.facebook.com/', '_blank')}
                            className="h-11 w-full bg-[#5D5FEF] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#4F51E5] transition-colors flex items-center justify-center gap-2 mt-auto"
                        >
                            <Link2 size={14} />
                            Connect
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Integrations;
