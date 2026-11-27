import React, { useState } from 'react';
import { Bell, Search, Trash2, ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Dummy data based on screenshot
    const notificationsList = [
        { id: 1, text: 'Agent jubi max is assigned for Ashiqur Rahman Apu', type: 'agent_assignment', time: '1h ago' },
        { id: 2, text: 'Agent Shohel Rana is assigned for Ahanaf Uchiha', type: 'agent_assignment', time: '1h ago' },
        { id: 3, text: 'Agent jubi max is assigned for Md Shahiduzzaman Sujon', type: 'agent_assignment', time: '1h ago' },
        { id: 4, text: 'Agent Shohel Rana is assigned for Apu Roy Rahul', type: 'agent_assignment', time: '1h ago' },
        { id: 5, text: 'Agent jubi max is assigned for Abu Tayab', type: 'agent_assignment', time: '1h ago' },
        { id: 6, text: 'Agent Shohel Rana is assigned for Tauhid Hasan Shawon', type: 'agent_assignment', time: '1h ago' },
    ];

    return (
        <div className="flex-1 p-6 md:p-8 bg-[#111318] min-h-screen pb-20 text-white font-sans">
            <div className="max-w-[1200px] mx-auto bg-[#16181D] border border-[#2D333B] rounded-xl overflow-hidden shadow-xl">
                
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#2D333B]">
                    <Bell size={20} className="text-slate-200" />
                    <h2 className="text-[17px] font-semibold text-white">Notifications</h2>
                </div>

                {/* Toolbar (Search & Per Page) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D333B]">
                    <div className="relative w-full max-w-[300px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search notifications..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-lg pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B5563] transition-colors"
                        />
                    </div>
                    <div>
                        <select className="bg-[#111318] border border-[#2D333B] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#4B5563] cursor-pointer appearance-none min-w-[70px]">
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#2D333B]">
                                <th className="px-6 py-4 text-[13px] font-semibold text-white w-16">#</th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-white">Notification</th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-white w-48 text-center">Type</th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-white w-32 text-center">Time</th>
                                <th className="px-6 py-4 text-[13px] font-semibold text-white w-24 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notificationsList.map((notif, idx) => (
                                <tr key={notif.id} className="border-b border-[#2D333B]/50 hover:bg-[#1C1F26] transition-colors group">
                                    <td className="px-6 py-4 text-[13px] text-slate-400">{notif.id}</td>
                                    <td className="px-6 py-4 text-[13px] text-slate-200">{notif.text}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#111318] text-slate-400 border border-[#2D333B]">
                                            {notif.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full border border-slate-500 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                                        </div>
                                        {notif.time}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 rounded-lg bg-[#111318] border border-[#2D333B] text-slate-400 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/10 transition-all mx-auto block">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D333B] bg-[#111318]">
                    <span className="text-[13px] text-slate-400">969 notifications</span>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-slate-400">1/39</span>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors">
                                <ChevronsLeft size={16} />
                            </button>
                            <button className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </button>
                            <button className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors">
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Notifications;
