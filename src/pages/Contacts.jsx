import React, { useState } from 'react';
import { 
    Search, Filter, Columns, Eye, MessageCircle, X, 
    MessageSquare, Phone, Mail, Tag, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
    const navigate = useNavigate();
    // Dummy data to match the screenshot
    const [contacts] = useState([
        { id: 1, name: 'Rasel', phone: '8801718369004', channel: 'wa', label: 'Not available', lastContacted: '1 month ago' },
        { id: 2, name: 'Amit Halder', phone: '8801948724309', channel: 'wa', label: 'Not available', lastContacted: '1 month ago' },
        { id: 3, name: 'Sohel Rana', phone: '8801749616154', channel: 'wa', label: 'Not available', lastContacted: '1 month ago' },
        { id: 4, name: 'S T ujjol', phone: '8801761653596', channel: 'wa', label: 'Not available', lastContacted: '1 month ago' },
        { id: 5, name: 'Ashiqur Rahman Apu', phone: '8801854561906', channel: 'wa', label: 'Not available', lastContacted: '2 months ago' },
    ]);

    const [selectedContact, setSelectedContact] = useState(null);
    const [activeTab, setActiveTab] = useState('Profile');

    return (
        <div className="h-full bg-[#111318] text-white p-6 relative">
            <div className="max-w-[1400px] mx-auto h-full flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <button className="bg-[#1C1F26] border border-slate-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                        Export Contact
                        <span className="text-xs ml-2">▼</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-[#1C1F26] border border-slate-800 rounded-t-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search contacts....." 
                                className="bg-[#111318] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-[240px]"
                            />
                        </div>
                        <button className="bg-[#111318] border border-slate-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-300">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="bg-[#111318] border border-slate-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-300">
                            <Columns size={16} /> Columns
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <select className="bg-[#111318] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-slate-300 appearance-none pr-8 relative">
                            <option>100</option>
                            <option>50</option>
                            <option>20</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#1C1F26] border-x border-slate-800 flex-1 overflow-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#1C1F26] text-slate-400 font-medium border-b border-slate-800 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4 text-center">Channels</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4">Label</th>
                                <th className="px-6 py-4">Last Contacted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {contacts.map((contact, index) => (
                                <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 overflow-hidden">
                                            {contact.name === 'Ashiqur Rahman Apu' ? (
                                                <img src={`https://i.pravatar.cc/150?u=${contact.id}`} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                contact.name.charAt(0)
                                            )}
                                        </div>
                                        {contact.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1877F2] text-white font-bold text-xs">
                                            f
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-300">{contact.phone}</div>
                                        <div className="text-xs text-slate-500">Not available</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{contact.label}</td>
                                    <td className="px-6 py-4 text-slate-500">{contact.lastContacted}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedContact(contact)}
                                            className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ml-auto"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-[#1C1F26] border border-slate-800 rounded-b-xl p-4 flex justify-between items-center text-sm text-slate-500">
                    <div>1350 contacts</div>
                    <div className="flex items-center gap-4">
                        <span>1/14</span>
                        <div className="flex gap-1">
                            <button className="p-1 hover:text-white">&laquo;</button>
                            <button className="p-1 hover:text-white">&lsaquo;</button>
                            <button className="p-1 hover:text-white">&rsaquo;</button>
                            <button className="p-1 hover:text-white">&raquo;</button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal Overlay */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    {/* Modal Content */}
                    <div className="w-[420px] bg-[#111318] border border-[#2D333B] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                        
                        {/* Header */}
                        <div className="relative p-6 pb-4">
                            <button 
                                onClick={() => setSelectedContact(null)}
                                className="absolute top-4 right-4 p-1.5 bg-[#1C1F26] border border-[#2D333B] text-slate-400 hover:text-white rounded-md transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex items-center gap-4">
                                <img 
                                    src={`https://i.pravatar.cc/150?u=${selectedContact.id}`} 
                                    alt="avatar" 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#1C1F26]"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-0.5">{selectedContact.name}</h2>
                                    <p className="text-sm text-slate-400">Customer since 24 Jun 2026</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 mb-2">
                            <div className="bg-[#1C1F26] p-1.5 rounded-xl flex items-center gap-1">
                                {['Profile', 'Orders', 'Activity'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === tab 
                                                ? 'bg-[#2D333B] text-white shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="px-6 py-2 flex-1 max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div className="space-y-0">
                                {/* Item 1 */}
                                <div className="flex items-start gap-4 py-4 border-b border-[#1E232B]">
                                    <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                        <MessageSquare size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-400 mb-1">Channel</p>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                                            <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px]">f</div>
                                            Messenger
                                        </div>
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex items-start gap-4 py-4 border-b border-[#1E232B]">
                                    <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                        <Phone size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-400 mb-1">Phone</p>
                                        <p className="text-sm font-bold text-slate-400">Not available</p>
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="flex items-start gap-4 py-4 border-b border-[#1E232B]">
                                    <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                        <Mail size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-400 mb-1">Email</p>
                                        <p className="text-sm font-bold text-slate-400">Not available</p>
                                    </div>
                                </div>
                                {/* Item 4 */}
                                <div className="flex items-start gap-4 py-4 border-b border-[#1E232B]">
                                    <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                        <Tag size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-400 mb-1">Labels</p>
                                        <p className="text-sm font-bold text-slate-400">Not available</p>
                                    </div>
                                </div>
                                {/* Item 5 */}
                                <div className="flex items-start gap-4 py-4">
                                    <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                        <Calendar size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-slate-400 mb-1">Last Contacted</p>
                                        <p className="text-sm font-bold text-white">2 months ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-4 flex items-center gap-3 border-t border-[#1E232B] bg-[#111318] rounded-b-2xl mt-2">
                            <button 
                                onClick={() => setSelectedContact(null)}
                                className="flex-1 py-3 px-4 bg-[#1C1F26] hover:bg-[#2D333B] border border-[#2D333B] text-white font-bold rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => navigate('/inbox')}
                                className="flex-1 py-3 px-4 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-900/20"
                            >
                                View Inbox
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
