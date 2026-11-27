import React, { useMemo, useState } from 'react';
import {
    Building2,
    Search,
    Plus,
    Eye,
    Edit3,
    Package,
    CheckCircle2,
    Ban,
    Power,
    X,
    ChevronLeft,
    ChevronRight,
    Wallet,
    MessageSquare,
    Users,
    AlertCircle,
    Mail,
    Phone,
    Calendar,
} from 'lucide-react';
import useAppStore, { normalizeRoleKey } from '../store/useStore';
import { mockSoftwareProducts } from '../mock/mockData';
import { toast } from '../components/ui/Toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_BADGES = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Inactive: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    Suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const Customers = () => {
    const {
        role,
        customers,
        addCustomer,
        updateCustomer,
        setCustomerStatus,
        updateCustomerReselling,
    } = useAppStore();

    const canView = normalizeRoleKey(role) === 'SUPER_ADMIN';

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [softwareFilter, setSoftwareFilter] = useState('All');
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        country: 'USA',
        industry: 'B2B SaaS',
        assignedSoftware: mockSoftwareProducts[0].name,
        planTier: mockSoftwareProducts[0].defaultPlan,
        monthlyQuotaCount: String(mockSoftwareProducts[0].defaultQuota),
        walletBalance: '500',
        status: 'Active',
    });
    const [formErrors, setFormErrors] = useState({});

    const [viewingCustomerId, setViewingCustomerId] = useState(null);
    const [detailTab, setDetailTab] = useState('overview'); // 'overview' | 'reselling'
    const [resellForm, setResellForm] = useState({
        product: '',
        plan: '',
        monthlyPrice: '',
        activationDate: '',
        billingCycle: 'Monthly',
        status: 'Active',
    });
    const [resellErrors, setResellErrors] = useState({});

    const [confirmAction, setConfirmAction] = useState(null); // { customer, nextStatus }

    const viewingCustomer = useMemo(
        () => customers.find((c) => c.id === viewingCustomerId) || null,
        [customers, viewingCustomerId]
    );

    const softwareOptions = useMemo(
        () => ['All', ...new Set([...mockSoftwareProducts.map((p) => p.name), ...customers.map((c) => c.assignedSoftware).filter(Boolean)])],
        [customers]
    );

    const filteredCustomers = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return customers.filter((c) => {
            if (statusFilter !== 'All' && c.status !== statusFilter) return false;
            if (softwareFilter !== 'All' && c.assignedSoftware !== softwareFilter) return false;
            if (q) {
                return (
                    (c.companyName || '').toLowerCase().includes(q) ||
                    (c.workspaceCode || '').toLowerCase().includes(q) ||
                    (c.contactPerson || '').toLowerCase().includes(q) ||
                    (c.email || '').toLowerCase().includes(q) ||
                    (c.phone || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [customers, searchTerm, statusFilter, softwareFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / perPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedCustomers = filteredCustomers.slice(
        (safePage - 1) * perPage,
        safePage * perPage
    );

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400">
                        Customer management is restricted to Super Admin accounts.
                    </p>
                </div>
            </div>
        );
    }

    const openAddModal = () => {
        setEditingCustomer(null);
        setFormErrors({});
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            country: 'USA',
            industry: 'B2B SaaS',
            assignedSoftware: mockSoftwareProducts[0].name,
            planTier: mockSoftwareProducts[0].defaultPlan,
            monthlyQuotaCount: String(mockSoftwareProducts[0].defaultQuota),
            walletBalance: '500',
            status: 'Active',
        });
        setIsFormOpen(true);
    };

    const openEditModal = (cust) => {
        setEditingCustomer(cust);
        setFormErrors({});
        setFormData({
            companyName: cust.companyName || '',
            contactPerson: cust.contactPerson || '',
            email: cust.email || '',
            phone: cust.phone || '',
            country: cust.country || 'USA',
            industry: cust.industry || 'General Business',
            assignedSoftware: cust.assignedSoftware || mockSoftwareProducts[0].name,
            planTier: cust.planTier || 'Pro',
            monthlyQuotaCount: String(cust.monthlyQuotaCount || 50000),
            walletBalance: String(cust.walletBalance ?? 0),
            status: cust.status || 'Active',
        });
        setIsFormOpen(true);
    };

    const handleSoftwarePresetChange = (softwareName) => {
        const preset = mockSoftwareProducts.find((p) => p.name === softwareName);
        setFormData((prev) => ({
            ...prev,
            assignedSoftware: softwareName,
            planTier: preset ? preset.defaultPlan : prev.planTier,
            monthlyQuotaCount: preset ? String(preset.defaultQuota) : prev.monthlyQuotaCount,
        }));
    };

    const validateCustomerForm = () => {
        const errors = {};
        if (!formData.companyName.trim() || formData.companyName.trim().length < 2) {
            errors.companyName = 'Company name must be at least 2 characters.';
        }
        if (!formData.contactPerson.trim() || formData.contactPerson.trim().length < 2) {
            errors.contactPerson = 'Contact person name is required.';
        }
        if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email.trim())) {
            errors.email = 'Please enter a valid email address.';
        } else {
            const duplicate = customers.find(
                (c) =>
                    c.email?.toLowerCase() === formData.email.trim().toLowerCase() &&
                    c.id !== editingCustomer?.id
            );
            if (duplicate) {
                errors.email = `Email is already used by ${duplicate.companyName}.`;
            }
        }
        if (!formData.phone.trim() || formData.phone.trim().length < 7) {
            errors.phone = 'Valid phone number is required.';
        }
        if (Number(formData.monthlyQuotaCount) < 1000 || Number.isNaN(Number(formData.monthlyQuotaCount))) {
            errors.monthlyQuotaCount = 'Quota must be at least 1,000 messages.';
        }
        if (Number(formData.walletBalance) < 0 || Number.isNaN(Number(formData.walletBalance))) {
            errors.walletBalance = 'Wallet balance cannot be negative.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!validateCustomerForm()) {
            toast.error('Please fix the highlighted customer form fields.');
            return;
        }

        const payload = {
            companyName: formData.companyName.trim(),
            contactPerson: formData.contactPerson.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            country: formData.country.trim() || 'Global',
            industry: formData.industry.trim() || 'General Business',
            assignedSoftware: formData.assignedSoftware,
            planTier: formData.planTier,
            monthlyQuotaCount: Number(formData.monthlyQuotaCount),
            walletBalance: Number(formData.walletBalance),
            status: formData.status,
        };

        if (editingCustomer) {
            updateCustomer(editingCustomer.id, payload);
            toast.success(`Updated customer "${payload.companyName}".`);
        } else {
            const preset = mockSoftwareProducts.find((p) => p.name === payload.assignedSoftware);
            addCustomer({
                ...payload,
                monthlyPrice: preset?.defaultPrice || 199,
            });
            toast.success(`Added customer "${payload.companyName}".`);
        }
        setIsFormOpen(false);
    };

    const openDetailsModal = (cust, initialTab = 'overview') => {
        setViewingCustomerId(cust.id);
        setDetailTab(initialTab);
        setResellErrors({});
        setResellForm({
            product: cust.reselling?.product || cust.assignedSoftware || mockSoftwareProducts[0].name,
            plan: cust.reselling?.plan || cust.planTier || 'Pro',
            monthlyPrice: String(cust.reselling?.monthlyPrice ?? 199),
            activationDate: cust.reselling?.activationDate || new Date().toISOString().split('T')[0],
            billingCycle: cust.reselling?.billingCycle || 'Monthly',
            status: cust.reselling?.status || cust.status || 'Active',
        });
    };

    const handleSaveReselling = (e) => {
        e.preventDefault();
        if (!viewingCustomer) return;

        const errors = {};
        if (!resellForm.product) errors.product = 'Assigned product is required.';
        if (!resellForm.plan.trim()) errors.plan = 'Plan name is required.';
        if (Number(resellForm.monthlyPrice) <= 0 || Number.isNaN(Number(resellForm.monthlyPrice))) {
            errors.monthlyPrice = 'Price must be greater than $0.';
        }
        if (!resellForm.activationDate) errors.activationDate = 'Activation date is required.';

        setResellErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the highlighted reselling fields.');
            return;
        }

        updateCustomerReselling(viewingCustomer.id, {
            product: resellForm.product,
            plan: resellForm.plan.trim(),
            monthlyPrice: Number(resellForm.monthlyPrice),
            activationDate: resellForm.activationDate,
            billingCycle: resellForm.billingCycle,
            status: resellForm.status,
        });
        toast.success(`Software reselling updated for ${viewingCustomer.companyName}.`);
    };

    const handleConfirmStatusChange = () => {
        if (!confirmAction) return;
        const { customer, nextStatus } = confirmAction;
        setCustomerStatus(customer.id, nextStatus);
        toast.success(`${customer.companyName} status updated to ${nextStatus}.`);
        setConfirmAction(null);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight mb-1">
                        Customer Management
                    </h1>
                    <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-widest text-slate-400">
                        Manage Software Accounts, Statuses & Reselling Subscriptions
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg w-full sm:w-auto shrink-0"
                >
                    <Plus size={16} /> Add Customer
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative flex-1 min-w-0">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search company, code, contact, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <select
                        aria-label="Filter customers by status"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                    </select>

                    <select
                        aria-label="Filter customers by assigned software"
                        value={softwareFilter}
                        onChange={(e) => {
                            setSoftwareFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer max-w-[210px]"
                    >
                        {softwareOptions.map((sw) => (
                            <option key={sw} value={sw}>
                                {sw === 'All' ? 'All Software' : sw}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Rows per page"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                    >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[960px]">
                        <thead className="bg-[#111318]">
                            <tr>
                                {['Company', 'Contact Person', 'Assigned Software', 'Usage / Wallet', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="py-4 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                                        No customers found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((cust) => (
                                    <tr key={cust.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                                                    {(cust.companyName || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{cust.companyName}</p>
                                                    <p className="text-xs text-slate-400">{cust.workspaceCode} • {cust.country}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-sm font-semibold text-slate-200">{cust.contactPerson}</p>
                                            <p className="text-xs text-slate-400">{cust.email}</p>
                                            <p className="text-xs font-mono text-slate-500">{cust.phone}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-sm font-semibold text-white">{cust.assignedSoftware}</p>
                                            <p className="text-xs text-indigo-300">
                                                {cust.reselling?.plan || cust.planTier} • ${cust.reselling?.monthlyPrice ?? 199}/mo
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-slate-300">
                                                {(cust.messagesSent || 0).toLocaleString()} / {(cust.monthlyQuotaCount || 0).toLocaleString()} msgs
                                            </p>
                                            <p className="text-xs font-bold text-amber-300 mt-0.5">
                                                Wallet: ${(Number(cust.walletBalance) || 0).toFixed(2)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${STATUS_BADGES[cust.status] || STATUS_BADGES.Active}`}>
                                                {cust.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailsModal(cust, 'overview')}
                                                    title="View Details"
                                                    className="px-3 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5"
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailsModal(cust, 'reselling')}
                                                    title="Manage Software Reselling"
                                                    className="px-3 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-semibold text-indigo-300 inline-flex items-center gap-1.5"
                                                >
                                                    <Package size={13} /> Resell
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(cust)}
                                                    title="Edit Customer"
                                                    className="p-2 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-slate-500 text-slate-300 hover:text-white"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                {cust.status !== 'Active' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ customer: cust, nextStatus: 'Active' })}
                                                        title="Activate Customer"
                                                        className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                                    >
                                                        <Power size={14} />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmAction({ customer: cust, nextStatus: 'Inactive' })}
                                                            title="Deactivate Customer"
                                                            className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/30 text-slate-300 hover:bg-slate-500/20"
                                                        >
                                                            <Power size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmAction({ customer: cust, nextStatus: 'Suspended' })}
                                                            title="Suspend Customer"
                                                            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                                                        >
                                                            <Ban size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-[#2D333B] bg-[#111318]">
                    <span className="text-xs text-slate-400">
                        Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300">Page {safePage} / {totalPages}</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                aria-label="Previous customer page"
                                className="p-2 rounded-lg border border-[#2D333B] bg-[#1C1F26] text-slate-300 hover:text-white disabled:opacity-40"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                aria-label="Next customer page"
                                className="p-2 rounded-lg border border-[#2D333B] bg-[#1C1F26] text-slate-300 hover:text-white disabled:opacity-40"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add / Edit Customer Modal */}
            {isFormOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setIsFormOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl bg-[#1C1F26] border border-[#2D333B] rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                                    {editingCustomer ? 'Edit Customer Account' : 'Add New Customer'}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {editingCustomer ? `Updating ${editingCustomer.workspaceCode}` : 'Provision a new fictional customer workspace'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                aria-label="Close customer form"
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111318]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} noValidate className="p-5 sm:p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cust-company" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Company Name *
                                    </label>
                                    <input
                                        id="cust-company"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, companyName: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, companyName: undefined }));
                                        }}
                                        placeholder="e.g. Summit Retail Ltd"
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.companyName && <p className="text-xs text-rose-400 mt-1">{formErrors.companyName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cust-contact" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Contact Person *
                                    </label>
                                    <input
                                        id="cust-contact"
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => {
                                            setFormData({ ...formData, contactPerson: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, contactPerson: undefined }));
                                        }}
                                        placeholder="Full name"
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.contactPerson && <p className="text-xs text-rose-400 mt-1">{formErrors.contactPerson}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cust-email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Email Address *
                                    </label>
                                    <input
                                        id="cust-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, email: undefined }));
                                        }}
                                        placeholder="admin@company.com"
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.email && <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cust-phone" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Phone / WhatsApp *
                                    </label>
                                    <input
                                        id="cust-phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, phone: undefined }));
                                        }}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.phone && <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cust-software" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Assigned Software
                                    </label>
                                    <select
                                        id="cust-software"
                                        value={formData.assignedSoftware}
                                        onChange={(e) => handleSoftwarePresetChange(e.target.value)}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    >
                                        {mockSoftwareProducts.map((p) => (
                                            <option key={p.id} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="cust-status" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Account Status
                                    </label>
                                    <select
                                        id="cust-status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="cust-quota" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Monthly Message Quota
                                    </label>
                                    <input
                                        id="cust-quota"
                                        type="number"
                                        min="1000"
                                        value={formData.monthlyQuotaCount}
                                        onChange={(e) => {
                                            setFormData({ ...formData, monthlyQuotaCount: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, monthlyQuotaCount: undefined }));
                                        }}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.monthlyQuotaCount && <p className="text-xs text-rose-400 mt-1">{formErrors.monthlyQuotaCount}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cust-wallet" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                        Wallet Balance (USD • Display Only)
                                    </label>
                                    <input
                                        id="cust-wallet"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.walletBalance}
                                        onChange={(e) => {
                                            setFormData({ ...formData, walletBalance: e.target.value });
                                            setFormErrors((prev) => ({ ...prev, walletBalance: undefined }));
                                        }}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                    />
                                    {formErrors.walletBalance && <p className="text-xs text-rose-400 mt-1">{formErrors.walletBalance}</p>}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#2D333B]">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="min-h-[42px] px-5 rounded-xl border border-[#2D333B] text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#111318]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="min-h-[42px] px-6 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-wider"
                                >
                                    {editingCustomer ? 'Save Customer' : 'Create Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Customer Details & Software Reselling Modal */}
            {viewingCustomer && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setViewingCustomerId(null)}
                >
                    <div
                        className="w-full max-w-3xl bg-[#1C1F26] border border-[#2D333B] rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black shrink-0">
                                    <Building2 size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-black text-white truncate">{viewingCustomer.companyName}</h2>
                                    <p className="text-xs text-slate-400 truncate">
                                        {viewingCustomer.workspaceCode} • {viewingCustomer.industry} • {viewingCustomer.country}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${STATUS_BADGES[viewingCustomer.status] || STATUS_BADGES.Active}`}>
                                    {viewingCustomer.status}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setViewingCustomerId(null)}
                                    aria-label="Close customer details"
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111318]"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-5 sm:px-6 pt-3 border-b border-[#2D333B] bg-[#16181D] flex gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setDetailTab('overview')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                                    detailTab === 'overview'
                                        ? 'border-[#8B5CF6] text-white'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                Account & Wallet Overview
                            </button>
                            <button
                                type="button"
                                onClick={() => setDetailTab('reselling')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                                    detailTab === 'reselling'
                                        ? 'border-[#8B5CF6] text-white'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                Software Reselling
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                            {detailTab === 'overview' ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><Users size={14} /> Contacts</div>
                                            <p className="text-xl font-black text-white">{(viewingCustomer.contactsCount || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><CheckCircle2 size={14} /> Conversions</div>
                                            <p className="text-xl font-black text-emerald-400">{(viewingCustomer.conversionsCount || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><MessageSquare size={14} /> Messages</div>
                                            <p className="text-xl font-black text-indigo-300">{(viewingCustomer.messagesSent || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><Wallet size={14} /> Wallet (Display)</div>
                                            <p className="text-xl font-black text-amber-300">${(Number(viewingCustomer.walletBalance) || 0).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#111318] border border-[#2D333B]">
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Primary Contact</p>
                                            <p className="text-sm font-bold text-white">{viewingCustomer.contactPerson}</p>
                                            <p className="text-xs text-slate-300 flex items-center gap-2"><Mail size={13} /> {viewingCustomer.email}</p>
                                            <p className="text-xs text-slate-300 flex items-center gap-2"><Phone size={13} /> {viewingCustomer.phone}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Assigned Software</p>
                                            <p className="text-sm font-bold text-white">{viewingCustomer.assignedSoftware}</p>
                                            <p className="text-xs text-indigo-300">
                                                Plan: {viewingCustomer.reselling?.plan || viewingCustomer.planTier} (${viewingCustomer.reselling?.monthlyPrice ?? 199}/mo)
                                            </p>
                                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                                <Calendar size={13} /> Activated: {viewingCustomer.reselling?.activationDate || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSaveReselling} noValidate className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="resell-product" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                Assigned Product
                                            </label>
                                            <select
                                                id="resell-product"
                                                value={resellForm.product}
                                                onChange={(e) => {
                                                    const prod = mockSoftwareProducts.find((p) => p.name === e.target.value);
                                                    setResellForm((prev) => ({
                                                        ...prev,
                                                        product: e.target.value,
                                                        plan: prod ? prod.defaultPlan : prev.plan,
                                                        monthlyPrice: prod ? String(prod.defaultPrice) : prev.monthlyPrice,
                                                    }));
                                                    setResellErrors((prev) => ({ ...prev, product: undefined }));
                                                }}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            >
                                                {mockSoftwareProducts.map((p) => (
                                                    <option key={p.id} value={p.name}>{p.name}</option>
                                                ))}
                                            </select>
                                            {resellErrors.product && <p className="text-xs text-rose-400 mt-1">{resellErrors.product}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="resell-plan" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                Reselling Plan
                                            </label>
                                            <input
                                                id="resell-plan"
                                                type="text"
                                                value={resellForm.plan}
                                                onChange={(e) => {
                                                    setResellForm({ ...resellForm, plan: e.target.value });
                                                    setResellErrors((prev) => ({ ...prev, plan: undefined }));
                                                }}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            />
                                            {resellErrors.plan && <p className="text-xs text-rose-400 mt-1">{resellErrors.plan}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="resell-price" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                Monthly Pricing (USD)
                                            </label>
                                            <input
                                                id="resell-price"
                                                type="number"
                                                min="1"
                                                value={resellForm.monthlyPrice}
                                                onChange={(e) => {
                                                    setResellForm({ ...resellForm, monthlyPrice: e.target.value });
                                                    setResellErrors((prev) => ({ ...prev, monthlyPrice: undefined }));
                                                }}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            />
                                            {resellErrors.monthlyPrice && <p className="text-xs text-rose-400 mt-1">{resellErrors.monthlyPrice}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="resell-date" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                Activation Date
                                            </label>
                                            <input
                                                id="resell-date"
                                                type="date"
                                                value={resellForm.activationDate}
                                                onChange={(e) => {
                                                    setResellForm({ ...resellForm, activationDate: e.target.value });
                                                    setResellErrors((prev) => ({ ...prev, activationDate: undefined }));
                                                }}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            />
                                            {resellErrors.activationDate && <p className="text-xs text-rose-400 mt-1">{resellErrors.activationDate}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="resell-cycle" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                Billing Cycle
                                            </label>
                                            <select
                                                id="resell-cycle"
                                                value={resellForm.billingCycle}
                                                onChange={(e) => setResellForm({ ...resellForm, billingCycle: e.target.value })}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            >
                                                <option value="Monthly">Monthly</option>
                                                <option value="Annual">Annual</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="resell-status" className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                                                License Status
                                            </label>
                                            <select
                                                id="resell-status"
                                                value={resellForm.status}
                                                onChange={(e) => setResellForm({ ...resellForm, status: e.target.value })}
                                                className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Trial">Trial</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-[#2D333B]">
                                        <button
                                            type="button"
                                            onClick={() => setViewingCustomerId(null)}
                                            className="min-h-[42px] px-5 rounded-xl border border-[#2D333B] text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#111318]"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="min-h-[42px] px-6 rounded-xl bg-[#10B981] hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider"
                                        >
                                            Save Reselling Config
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Confirmation Modal */}
            {confirmAction && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setConfirmAction(null)}
                >
                    <div
                        className="w-full max-w-md bg-[#1C1F26] border border-[#2D333B] rounded-3xl p-6 shadow-2xl space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white uppercase tracking-tight">
                                    Confirm Status Change
                                </h3>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    Are you sure you want to change <span className="font-bold text-white">{confirmAction.customer.companyName}</span> to{' '}
                                    <span className="font-bold text-indigo-300">{confirmAction.nextStatus}</span>?
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmAction(null)}
                                className="min-h-[40px] px-4 rounded-xl border border-[#2D333B] text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#111318]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmStatusChange}
                                className="min-h-[40px] px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-wider"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
