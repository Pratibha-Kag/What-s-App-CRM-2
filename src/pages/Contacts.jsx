import React, { useMemo, useState } from 'react';
import {
    Search,
    Filter,
    Columns,
    Eye,
    X,
    MessageSquare,
    Phone,
    Mail,
    Tag,
    Calendar,
    Building2,
    ShoppingBag,
    Activity,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore, { getRolePath, normalizeRoleKey } from '../store/useStore';
import { exportRowsToCsv, resolveScopedCustomerId } from '../lib/crmUtils';
import { toast } from '../components/ui/Toast';

const CHANNEL_BADGES = {
    WhatsApp: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', short: 'WA' },
    Facebook: { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/25', short: 'f' },
    'Meta Ads': { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/25', short: 'M' },
    'Google Ads': { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/25', short: 'G' },
    'Google Sheets': { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', short: 'S' },
    Website: { bg: 'bg-purple-500/15 text-purple-300 border-purple-500/25', short: 'W' },
};

const Contacts = () => {
    const navigate = useNavigate();
    const { role, selectedAccount, contacts, customers } = useAppStore();

    const isSuperAdmin = normalizeRoleKey(role) === 'SUPER_ADMIN';
    const isCustomerAdmin = ['ADMIN', 'CUSTOMER_ADMIN'].includes(normalizeRoleKey(role));

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    const [customerFilter, setCustomerFilter] = useState('All');
    const [channelFilter, setChannelFilter] = useState('All');
    const [labelFilter, setLabelFilter] = useState('All');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [visibleCols, setVisibleCols] = useState({
        channels: true,
        contactDetails: true,
        label: true,
        lastContacted: true,
    });

    const [selectedContact, setSelectedContact] = useState(null);
    const [activeTab, setActiveTab] = useState('Profile');

    const scopedCustomerId = resolveScopedCustomerId(role, selectedAccount, customerFilter);

    const scopedBaseContacts = useMemo(() => {
        if (scopedCustomerId === 'All') return contacts;
        return contacts.filter((c) => c.customerId === scopedCustomerId);
    }, [contacts, scopedCustomerId]);

    const channelOptions = useMemo(
        () => ['All', ...new Set(scopedBaseContacts.map((c) => c.channel).filter(Boolean))],
        [scopedBaseContacts]
    );
    const labelOptions = useMemo(
        () => ['All', ...new Set(scopedBaseContacts.map((c) => c.label).filter(Boolean))],
        [scopedBaseContacts]
    );

    const filteredContacts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return scopedBaseContacts.filter((c) => {
            if (channelFilter !== 'All' && c.channel !== channelFilter) return false;
            if (labelFilter !== 'All' && c.label !== labelFilter) return false;
            if (q) {
                return (
                    (c.name || '').toLowerCase().includes(q) ||
                    (c.phone || '').toLowerCase().includes(q) ||
                    (c.email || '').toLowerCase().includes(q) ||
                    (c.label || '').toLowerCase().includes(q) ||
                    (c.companyName || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [scopedBaseContacts, channelFilter, labelFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedContacts = filteredContacts.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    const toggleColumn = (key) => {
        setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleExportContacts = () => {
        if (filteredContacts.length === 0) {
            toast.error('No contacts match the current filters to export.');
            return;
        }
        exportRowsToCsv(
            ['ID', 'Full Name', 'Phone', 'Email', 'Channel', 'Source', 'Label', 'Customer', 'Last Contacted'],
            filteredContacts.map((c) => [
                c.id,
                c.name,
                c.phone || 'Not available',
                c.email || 'Not available',
                c.channel,
                c.source || c.channel,
                c.label,
                c.companyName || '-',
                c.lastContacted,
            ]),
            `CRM_Contacts_${new Date().toISOString().split('T')[0]}.csv`
        );
        toast.success(`Exported ${filteredContacts.length} contact(s) to CSV.`);
    };

    const roleInboxPath = `/${getRolePath(role)}/inbox`;

    return (
        <div className="min-h-full bg-[#111318] text-white p-4 sm:p-6 relative">
            <div className="max-w-[1400px] mx-auto flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Contacts</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isCustomerAdmin && selectedAccount?.companyName
                                ? `${selectedAccount.companyName} customer contact directory`
                                : 'Unified multi-channel CRM contact directory'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleExportContacts}
                        className="bg-[#1C1F26] border border-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium hover:border-[#8B5CF6] hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Download size={15} />
                        <span>Export Contact</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-[#1C1F26] border border-slate-800 rounded-t-xl p-4 space-y-3">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="relative w-full sm:w-auto sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    aria-label="Search contacts"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search name, phone, email..."
                                    className="bg-[#111318] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6] w-full sm:w-[240px]"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFilters((prev) => !prev)}
                                className={`border px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                    showFilters
                                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                                        : 'bg-[#111318] border-slate-800 text-slate-300 hover:bg-slate-800'
                                }`}
                            >
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowColumnsMenu((prev) => !prev)}
                                    className={`border px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                        showColumnsMenu
                                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                                            : 'bg-[#111318] border-slate-800 text-slate-300 hover:bg-slate-800'
                                    }`}
                                >
                                    <Columns size={16} />
                                    <span>Columns</span>
                                </button>

                                {showColumnsMenu && (
                                    <div className="absolute left-0 mt-2 w-52 bg-[#16181D] border border-[#2D333B] rounded-xl shadow-2xl p-3 z-30 space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Visible Columns
                                        </p>
                                        {[
                                            { key: 'channels', label: 'Channels' },
                                            { key: 'contactDetails', label: 'Contact Details' },
                                            { key: 'label', label: 'Label' },
                                            { key: 'lastContacted', label: 'Last Contacted' },
                                        ].map((col) => (
                                            <label key={col.key} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer py-1">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleCols[col.key]}
                                                    onChange={() => toggleColumn(col.key)}
                                                    className="accent-[#8B5CF6]"
                                                />
                                                <span>{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-slate-400">Rows:</span>
                            <select
                                aria-label="Contacts per page"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-slate-300 cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>

                    {/* Expandable Filters Bar */}
                    {showFilters && (
                        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {isSuperAdmin && (
                                <select
                                    aria-label="Filter contacts by customer"
                                    value={customerFilter}
                                    onChange={(e) => {
                                        setCustomerFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="bg-[#111318] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                >
                                    <option value="All">All Customers</option>
                                    {customers.map((cust) => (
                                        <option key={cust.id} value={cust.id}>
                                            {cust.companyName}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <select
                                aria-label="Filter contacts by channel"
                                value={channelFilter}
                                onChange={(e) => {
                                    setChannelFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                            >
                                {channelOptions.map((ch) => (
                                    <option key={ch} value={ch}>
                                        {ch === 'All' ? 'All Channels' : ch}
                                    </option>
                                ))}
                            </select>

                            <select
                                aria-label="Filter contacts by label"
                                value={labelFilter}
                                onChange={(e) => {
                                    setLabelFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                            >
                                {labelOptions.map((lb) => (
                                    <option key={lb} value={lb}>
                                        {lb === 'All' ? 'All Labels' : lb}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-[#1C1F26] border-x border-slate-800 overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#1C1F26] text-slate-400 font-medium border-b border-slate-800 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">Full Name</th>
                                {visibleCols.channels && <th className="px-6 py-4 text-center">Channels</th>}
                                {visibleCols.contactDetails && <th className="px-6 py-4">Contact Details</th>}
                                {visibleCols.label && <th className="px-6 py-4">Label</th>}
                                {visibleCols.lastContacted && <th className="px-6 py-4">Last Contacted</th>}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {paginatedContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                                        No contacts match the current search or filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedContacts.map((contact, index) => {
                                    const badge = CHANNEL_BADGES[contact.channel] || {
                                        bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
                                        short: (contact.channel || 'C').charAt(0).toUpperCase(),
                                    };
                                    return (
                                        <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-slate-500">
                                                {(safePage - 1) * pageSize + index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                                                        {(contact.name || 'C').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold">{contact.name}</p>
                                                        {isSuperAdmin && contact.companyName && (
                                                            <p className="text-[11px] text-slate-400">{contact.companyName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {visibleCols.channels && (
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                                                        {contact.channel}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleCols.contactDetails && (
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-200">{contact.phone || 'Not available'}</div>
                                                    <div className="text-xs text-slate-400">{contact.email || 'Not available'}</div>
                                                </td>
                                            )}
                                            {visibleCols.label && (
                                                <td className="px-6 py-4 text-slate-300">
                                                    <span className="px-2.5 py-1 rounded-md text-xs bg-[#111318] border border-slate-800">
                                                        {contact.label || 'Not available'}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleCols.lastContacted && (
                                                <td className="px-6 py-4 text-slate-400">{contact.lastContacted}</td>
                                            )}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setActiveTab('Profile');
                                                    }}
                                                    className="bg-transparent border border-slate-700 hover:border-[#8B5CF6] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-2 ml-auto"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="bg-[#1C1F26] border border-slate-800 rounded-b-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-400">
                    <div>
                        {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
                    </div>
                    <div className="flex items-center gap-3">
                        <span>
                            {safePage} / {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage(1)}
                                aria-label="First page"
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-30"
                            >
                                <ChevronsLeft size={15} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                aria-label="Previous page"
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-30"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                aria-label="Next page"
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-30"
                            >
                                <ChevronRight size={15} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                aria-label="Last page"
                                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-30"
                            >
                                <ChevronsRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Contact Details"
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                >
                    <div className="w-full max-w-[440px] bg-[#111318] border border-[#2D333B] rounded-2xl shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="relative p-6 pb-4">
                            <button
                                type="button"
                                onClick={() => setSelectedContact(null)}
                                aria-label="Close contact details"
                                className="absolute top-4 right-4 p-1.5 bg-[#1C1F26] border border-[#2D333B] text-slate-400 hover:text-white rounded-md transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#1C1F26] border-2 border-[#2D333B] flex items-center justify-center text-xl font-black text-indigo-300 shrink-0">
                                    {(selectedContact.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-white mb-0.5 truncate">
                                        {selectedContact.name}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Customer since {selectedContact.customerSince || '24 Jun 2026'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 mb-2">
                            <div className="bg-[#1C1F26] p-1.5 rounded-xl flex items-center gap-1">
                                {['Profile', 'Orders', 'Activity'].map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
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

                        {/* Tab Content */}
                        <div className="px-6 py-2 flex-1 max-h-[360px] overflow-y-auto">
                            {activeTab === 'Profile' && (
                                <div className="space-y-0">
                                    <div className="flex items-start gap-4 py-3.5 border-b border-[#1E232B]">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <MessageSquare size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Channel / Source</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.channel} ({selectedContact.source || selectedContact.channel})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 py-3.5 border-b border-[#1E232B]">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <Phone size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Phone</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.phone || 'Not available'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 py-3.5 border-b border-[#1E232B]">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <Mail size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Email</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.email || 'Not available'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 py-3.5 border-b border-[#1E232B]">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <Tag size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Labels</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.label || 'Not available'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 py-3.5 border-b border-[#1E232B]">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <Building2 size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Customer Workspace</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.companyName || 'Apex Digital Solutions'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 py-3.5">
                                        <div className="bg-[#1C1F26] p-2 rounded-lg shrink-0 border border-[#2D333B]/50">
                                            <Calendar size={18} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-slate-400 mb-0.5">Last Contacted</p>
                                            <p className="text-sm font-bold text-white">
                                                {selectedContact.lastContacted || 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Orders' && (
                                <div className="py-3 space-y-3">
                                    {(selectedContact.orders || []).length === 0 ? (
                                        <div className="p-6 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-center space-y-2">
                                            <ShoppingBag size={24} className="text-slate-500 mx-auto" />
                                            <p className="text-xs font-semibold text-slate-400">
                                                No orders recorded for {selectedContact.name} yet.
                                            </p>
                                        </div>
                                    ) : (
                                        selectedContact.orders.map((ord) => (
                                            <div key={ord.id} className="p-4 rounded-xl bg-[#1C1F26] border border-[#2D333B] flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-mono text-indigo-300">{ord.id}</p>
                                                    <p className="text-sm font-bold text-white">{ord.item}</p>
                                                    <p className="text-xs text-slate-400">{ord.date}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-black text-emerald-400">{ord.amount}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {ord.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'Activity' && (
                                <div className="py-3 space-y-3">
                                    {(selectedContact.activities || []).length === 0 ? (
                                        <div className="p-6 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-center space-y-2">
                                            <Activity size={24} className="text-slate-500 mx-auto" />
                                            <p className="text-xs font-semibold text-slate-400">
                                                No recent timeline activity logged.
                                            </p>
                                        </div>
                                    ) : (
                                        selectedContact.activities.map((act) => (
                                            <div key={act.id} className="p-3.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-bold text-white">{act.title}</p>
                                                    <span className="text-[11px] text-slate-400 shrink-0">{act.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-300 leading-snug">{act.detail}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-4 flex items-center gap-3 border-t border-[#1E232B] bg-[#111318] rounded-b-2xl mt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedContact(null)}
                                className="flex-1 py-3 px-4 bg-[#1C1F26] hover:bg-[#2D333B] border border-[#2D333B] text-white font-bold rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedContact(null);
                                    navigate(roleInboxPath);
                                }}
                                className="flex-1 py-3 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold rounded-xl transition-colors shadow-lg"
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
