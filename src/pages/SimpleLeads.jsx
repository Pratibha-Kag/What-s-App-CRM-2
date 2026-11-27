import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, UserPlus, FileEdit, X, Download, 
    MoreVertical, Phone, Mail, MapPin, GraduationCap, 
    Calendar, CheckCircle2, ChevronDown, Loader2,
    Bot, Globe
} from 'lucide-react';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { mockLeads, mockUsers } from '../mock/mockData';
import useAppStore from '../store/useStore';
import { toast } from '../components/ui/Toast';

const AdvancedLeadModal = ({ lead, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: lead?.name || '', 
        phone: lead?.phone || '', 
        email: lead?.email || '',
        country: lead?.country || lead?.interested_country || '',
        qualification: lead?.qualification || lead?.academic_background || '',
        ielts_score: lead?.ielts_score || ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
                >
                    <div className="flex justify-between items-center p-6 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl shadow-inner border border-indigo-50">
                                {(lead?.name || 'U').charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">{lead?.name || 'New Lead'}</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Profile Editor</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30">
                        <form id="lead-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Basic Info */}
                            <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
                                    <UserPlus size={14} /> Basic Details
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Full Name', name: 'name', type: 'text', icon: <UserPlus size={14}/> },
                                        { label: 'Phone', name: 'phone', type: 'text', icon: <Phone size={14}/> },
                                        { label: 'Email', name: 'email', type: 'email', icon: <Mail size={14}/> },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{field.label}</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</div>
                                                <input 
                                                    required={field.name === 'name' || field.name === 'phone'} 
                                                    type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} 
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Academics & Country */}
                            <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">
                                    <GraduationCap size={14} /> Academic Profile
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Interested Country', name: 'country', type: 'text', icon: <Globe size={14}/> },
                                        { label: 'Qualification', name: 'qualification', type: 'text', icon: <GraduationCap size={14}/> },
                                        { label: 'IELTS Score', name: 'ielts_score', type: 'number', step: '0.5', icon: <FileEdit size={14}/> },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{field.label}</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</div>
                                                <input 
                                                    type={field.type} name={field.name} step={field.step} value={formData[field.name]} onChange={handleChange} 
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button form="lead-form" type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">
                            Save Profile
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const SimpleLeads = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [filterAssigned, setFilterAssigned] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    
    const [editingLead, setEditingLead] = useState(null);
    const { role } = useAppStore();
    const [leads, setLeads] = useState(mockLeads);
    const users = mockUsers;
    const isLoading = false;

    const counselors = users.filter(u => ['COUNSELOR', 'Counselor', 'MANAGER', 'Super Admin'].includes(u.role));

    const filteredLeads = leads.filter(l => {
        if (filterStage && l.stage !== filterStage) return false;
        if (filterAssigned && l.assigned_to !== filterAssigned) return false;
        if (filterSource && l.source !== filterSource) return false;
        if (filterCountry && (l.country || l.interested_country) !== filterCountry) return false;
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            return (l.name || '').toLowerCase().includes(query) || (l.phone || '').includes(query);
        }
        return true;
    });

    const handleStageChange = (id, newStage) => {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, stage: newStage } : lead));
        toast.success("Lead updated successfully!");
    };

    const handleAssignmentChange = (id, counselorId) => {
        const assignedCounselor = users.find(u => u.id === counselorId);
        setLeads(prev => prev.map(lead => lead.id === id ? { 
            ...lead, 
            assigned_to: counselorId || null,
            assigned_name: assignedCounselor ? assignedCounselor.name : null
        } : lead));
        toast.success("Lead assigned successfully!");
    };

    const handleSaveProfile = (formData) => {
        if (editingLead?.id) {
            setLeads(prev => prev.map(lead => lead.id === editingLead.id ? { ...lead, ...formData } : lead));
            toast.success("Lead updated successfully!");
        } else {
            const newLead = {
                id: Math.max(...leads.map(l => Number(l.id) || 0), 100) + 1,
                ...formData,
                stage: 'New',
                source: 'WhatsApp',
                created_at: new Date().toISOString()
            };
            setLeads(prev => [newLead, ...prev]);
            toast.success("Lead created successfully!");
        }
        setEditingLead(null);
    };

    const exportToCSV = () => {
        if (filteredLeads.length === 0) {
            toast.error("No leads to export");
            return;
        }

        const headers = [
            "ID", "Name", "Phone", "Email", "Country", "Source", "Stage", "Assigned To", "Qualification", "IELTS Score", "Last Conversation", "Next Follow-up", "Created At"
        ];

        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead => [
                `"${lead.id || ''}"`, `"${lead.name || ''}"`, `"${lead.phone || ''}"`, `"${lead.email || ''}"`, `"${lead.country || lead.interested_country || ''}"`,
                `"${lead.source || ''}"`, `"${lead.stage || ''}"`, `"${lead.assigned_name || lead.assigned_to || ''}"`, `"${lead.qualification || lead.academic_background || ''}"`, `"${lead.ielts_score || ''}"`,
                `"${lead.last_conversation_date ? new Date(lead.last_conversation_date).toLocaleString() : ''}"`, `"${lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleString() : ''}"`, `"${lead.created_at ? new Date(lead.created_at).toLocaleString() : ''}"`
            ].join(','))
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Export initiated");
    };

    const canAssign = ['Super Admin', 'Admin', 'Team Leader', 'Customer Support', 'Manager', 'SUPER_ADMIN'].includes(role);

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20">
            {editingLead && (
                <AdvancedLeadModal 
                    lead={editingLead} 
                    onClose={() => setEditingLead(null)} 
                    onSave={handleSaveProfile} 
                />
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Global Directory</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manage and route incoming intelligence nodes</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setEditingLead({})}
                        className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Add Lead
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
                    >
                        <Download size={16} /> Export Intel
                    </button>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto p-2">
                    <div className="flex items-center justify-center h-10 w-10 bg-slate-100 rounded-xl text-slate-400 shrink-0">
                        <Filter size={18} />
                    </div>
                    
                    {[
                        { val: filterStage, set: setFilterStage, default: "All Stages", options: ["New", "Follow-up", "Qualified", "Converted", "Lost"] },
                        { val: filterSource, set: setFilterSource, default: "All Sources", options: ["WhatsApp", "Facebook", "Website", "Manual", "AI_CHAT"] }
                    ].map((f, i) => (
                        <div key={i} className="relative shrink-0">
                            <select 
                                value={f.val} onChange={(e) => f.set(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <option value="">{f.default}</option>
                                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    ))}

                    <div className="relative shrink-0">
                        <select 
                            value={filterAssigned} onChange={(e) => setFilterAssigned(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                            <option value="">All Agents</option>
                            {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="relative w-full lg:w-80 shrink-0 p-2 lg:p-0 pr-2">
                    <Search className="absolute left-5 lg:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search identity..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Compiling Database...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    {['Lead ID / Name', 'Contact Info', 'Academic Profile', 'Current Stage', 'Assigned To', ''].map((head, i) => (
                                        <th key={i} className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredLeads.map(lead => (
                                        <motion.tr 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            key={lead.id} 
                                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex flex-col items-center justify-center shadow-sm shrink-0">
                                                        <span className="text-[8px] font-bold text-slate-400">#{lead.id}</span>
                                                        <span className="font-black text-indigo-600 text-xs">{(lead.name || 'U').charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800">{lead.name || 'Unknown'}</p>
                                                        <div className="flex items-center mt-1">
                                                            {lead.source?.toUpperCase() === 'WHATSAPP' ? (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-black bg-emerald-50 text-emerald-600 rounded-md uppercase tracking-widest border border-emerald-100"><FaWhatsapp size={11} /> WHATSAPP</span>
                                                            ) : lead.source?.toUpperCase() === 'AI_CHAT' ? (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-black bg-purple-50 text-purple-600 rounded-md uppercase tracking-widest border border-purple-100"><Bot size={10} /> AI CHAT</span>
                                                            ) : lead.source?.toUpperCase() === 'FACEBOOK' ? (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-black bg-blue-50 text-blue-600 rounded-md uppercase tracking-widest border border-blue-100"><FaFacebook size={10} /> FACEBOOK</span>
                                                            ) : lead.source?.toUpperCase() === 'WEBSITE' ? (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-black bg-amber-50 text-amber-600 rounded-md uppercase tracking-widest border border-amber-100"><Globe size={10} /> WEBSITE</span>
                                                            ) : (
                                                                <span className="inline-block px-2 py-0.5 text-[9px] font-black bg-slate-100 text-slate-600 rounded-md uppercase tracking-widest border border-slate-200">{lead.source || 'SYS'}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                                                    <Phone size={12} className="text-slate-400" /> {lead.phone}
                                                </div>
                                                {lead.email && (
                                                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                                                        <Mail size={12} className="text-slate-400" /> {lead.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1">
                                                    <div className="flex items-center gap-1"><span className="text-slate-400 font-bold uppercase w-12">QUAL:</span> {lead.qualification || lead.academic_background || '-'}</div>
                                                    <div className="flex items-center gap-1"><span className="text-slate-400 font-bold uppercase w-12">IELTS:</span> {lead.ielts_score || '-'}</div>
                                                    <div className="flex items-center gap-1"><span className="text-slate-400 font-bold uppercase w-12">DEST:</span> {lead.country || lead.interested_country || '-'}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col items-start gap-1">
                                                    <div className="relative">
                                                        <select 
                                                            value={lead.stage || 'New'}
                                                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                                                            className={`appearance-none text-[10px] font-black uppercase tracking-widest border-0 rounded-lg py-1.5 pl-3 pr-8 outline-none cursor-pointer transition-all ${
                                                                lead.stage === 'Converted' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                                                                lead.stage === 'New' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                                                lead.stage === 'Lost' ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' :
                                                                'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                            }`}
                                                            disabled={updateLead.isPending}
                                                        >
                                                            <option value="New">NEW</option>
                                                            <option value="Follow-up">FOLLOW-UP</option>
                                                            <option value="Qualified">QUALIFIED</option>
                                                            <option value="Converted">CONVERTED</option>
                                                            <option value="Lost">LOST</option>
                                                        </select>
                                                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                                                    </div>
                                                    {lead.next_followup_date && (
                                                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600 mt-1 bg-amber-50 px-2 py-0.5 rounded-md">
                                                            <Calendar size={10} /> {new Date(lead.next_followup_date).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {canAssign ? (
                                                    <div className="relative max-w-[160px]">
                                                        <select
                                                            value={lead.assigned_to || ''}
                                                            onChange={(e) => handleAssignmentChange(lead.id, e.target.value)}
                                                            className="appearance-none w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg py-2 pl-3 pr-8 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer truncate"
                                                        >
                                                            <option value="">System Handled</option>
                                                            {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                ) : (
                                                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        {lead.assigned_name || 'System Handled'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button 
                                                    onClick={() => setEditingLead(lead)}
                                                    className="h-9 w-9 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Open Dossier"
                                                >
                                                    <FileEdit size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Search size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No Intelligence Found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleLeads;
