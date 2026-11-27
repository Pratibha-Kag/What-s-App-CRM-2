import React, { useMemo, useState } from 'react';
import { Bell, Search, Trash2, ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft, RotateCcw } from 'lucide-react';
import { toast } from '../components/ui/Toast';

const INITIAL_NOTIFICATIONS = [
    { id: 1, text: 'Agent jubi max is assigned for Ashiqur Rahman Apu', type: 'agent_assignment', time: '1h ago' },
    { id: 2, text: 'Agent Shohel Rana is assigned for Ahanaf Uchiha', type: 'agent_assignment', time: '1h ago' },
    { id: 3, text: 'Agent jubi max is assigned for Md Shahiduzzaman Sujon', type: 'agent_assignment', time: '1h ago' },
    { id: 4, text: 'Agent Shohel Rana is assigned for Apu Roy Rahul', type: 'agent_assignment', time: '1h ago' },
    { id: 5, text: 'Agent jubi max is assigned for Abu Tayab', type: 'agent_assignment', time: '1h ago' },
    { id: 6, text: 'Agent Shohel Rana is assigned for Tauhid Hasan Shawon', type: 'agent_assignment', time: '1h ago' },
];

const Notifications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsList, setNotificationsList] = useState(INITIAL_NOTIFICATIONS);

    const filteredNotifications = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return notificationsList;
        return notificationsList.filter(
            (n) =>
                n.text.toLowerCase().includes(query) ||
                n.type.toLowerCase().includes(query) ||
                String(n.id).includes(query)
        );
    }, [notificationsList, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / perPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedNotifications = filteredNotifications.slice(
        (safePage - 1) * perPage,
        safePage * perPage
    );

    const handleDelete = (id) => {
        setNotificationsList((prev) => prev.filter((item) => item.id !== id));
        toast.info('Notification removed from demo feed.');
    };

    const handleRestore = () => {
        setNotificationsList(INITIAL_NOTIFICATIONS);
        setSearchTerm('');
        setCurrentPage(1);
        toast.success('Demo notifications restored.');
    };

    return (
        <div className="flex-1 p-4 sm:p-6 md:p-8 bg-[#111318] min-h-full pb-20 text-white font-sans">
            <div className="max-w-[1200px] mx-auto bg-[#16181D] border border-[#2D333B] rounded-xl overflow-hidden shadow-xl">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#2D333B]">
                    <div className="flex items-center gap-3">
                        <Bell size={20} className="text-slate-200 shrink-0" />
                        <h2 className="text-[17px] font-semibold text-white">Notifications</h2>
                    </div>
                    {notificationsList.length < INITIAL_NOTIFICATIONS.length && (
                        <button
                            type="button"
                            onClick={handleRestore}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            <RotateCcw size={13} /> Restore Demo Feed
                        </button>
                    )}
                </div>

                {/* Toolbar (Search & Per Page) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#2D333B]">
                    <div className="relative w-full sm:max-w-[300px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-lg pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B5563] transition-colors"
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <select
                            aria-label="Notifications per page"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#4B5563] cursor-pointer min-w-[80px]"
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-[#2D333B]">
                                <th className="px-4 sm:px-6 py-4 text-[13px] font-semibold text-white w-16">#</th>
                                <th className="px-4 sm:px-6 py-4 text-[13px] font-semibold text-white">Notification</th>
                                <th className="px-4 sm:px-6 py-4 text-[13px] font-semibold text-white w-44 text-center">Type</th>
                                <th className="px-4 sm:px-6 py-4 text-[13px] font-semibold text-white w-32 text-center">Time</th>
                                <th className="px-4 sm:px-6 py-4 text-[13px] font-semibold text-white w-24 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                                        No notifications match your current filter.
                                    </td>
                                </tr>
                            ) : (
                                paginatedNotifications.map((notif) => (
                                    <tr key={notif.id} className="border-b border-[#2D333B]/50 hover:bg-[#1C1F26] transition-colors group">
                                        <td className="px-4 sm:px-6 py-4 text-[13px] text-slate-400">{notif.id}</td>
                                        <td className="px-4 sm:px-6 py-4 text-[13px] text-slate-200">{notif.text}</td>
                                        <td className="px-4 sm:px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#111318] text-slate-400 border border-[#2D333B]">
                                                {notif.type}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-[13px] text-slate-400 text-center">
                                            <div className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                                                <div className="w-2.5 h-2.5 rounded-full border border-slate-500 flex items-center justify-center shrink-0">
                                                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                                                </div>
                                                {notif.time}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(notif.id)}
                                                aria-label={`Delete notification ${notif.id}`}
                                                className="p-2 rounded-lg bg-[#111318] border border-[#2D333B] text-slate-400 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/10 transition-all mx-auto inline-flex items-center justify-center"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[#2D333B] bg-[#111318]">
                    <span className="text-[13px] text-slate-400">
                        {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
                    </span>

                    <div className="flex items-center gap-4">
                        <span className="text-[13px] text-slate-400">{safePage}/{totalPages}</span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage(1)}
                                aria-label="First page"
                                className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors disabled:opacity-30"
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                aria-label="Previous page"
                                className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                aria-label="Next page"
                                className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                aria-label="Last page"
                                className="p-1.5 rounded-md text-slate-500 hover:bg-[#1C1F26] hover:text-white transition-colors disabled:opacity-30"
                            >
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
