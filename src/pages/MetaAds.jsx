import React from 'react';
import { Megaphone, Activity } from 'lucide-react';

const MetaAds = () => {
    return (
        <div className="h-full bg-[#111318] text-white p-6">
            <div className="max-w-[1400px] mx-auto h-full flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Meta Ads Manager</h1>
                    <button className="bg-[#1C1F26] border border-slate-800 hover:border-slate-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                        Connect Ad Account
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#1C1F26] border border-slate-800 rounded-2xl flex flex-col relative overflow-hidden items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                        <Megaphone size={40} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sync Leads from Meta Ads</h3>
                    <p className="text-sm text-slate-400 mb-8 max-w-lg leading-relaxed">
                        Connect your Facebook Ads Manager to automatically sync leads from Lead Generation forms directly into your CRM. Map custom fields and trigger instant automated messages to new leads.
                    </p>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                        <Activity size={18} />
                        Get Started
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MetaAds;
