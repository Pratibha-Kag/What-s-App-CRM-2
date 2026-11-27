import React, { useMemo, useState } from 'react';
import {
    Search,
    ArrowDownLeft,
    ArrowUpRight,
    FileText,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { filterWalletTransactions, formatCurrency, formatUnitPrice } from '../../lib/walletUtils';

const TYPE_STYLES = {
    Recharge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Credit: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    Deduction: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    Debit: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const STATUS_STYLES = {
    Success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const WalletTransactionsPanel = ({
    transactions = [],
    customers = [],
    showCustomerColumn = false,
    title = 'Recharge & Transaction History',
    subtitle = 'Search, filter by date range, type, or payment status',
    onSelectInvoice = null,
    pageSize = 6,
}) => {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [customerFilter, setCustomerFilter] = useState('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(
        () =>
            filterWalletTransactions(transactions, {
                search,
                type: typeFilter,
                status: statusFilter,
                category: categoryFilter,
                customerId: showCustomerColumn ? customerFilter : 'All',
                dateFrom,
                dateTo,
            }),
        [transactions, search, typeFilter, statusFilter, categoryFilter, showCustomerColumn, customerFilter, dateFrom, dateTo]
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pagedRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const hasActiveFilters =
        Boolean(search) ||
        typeFilter !== 'All' ||
        statusFilter !== 'All' ||
        categoryFilter !== 'All' ||
        (showCustomerColumn && customerFilter !== 'All') ||
        Boolean(dateFrom) ||
        Boolean(dateTo);

    const resetFilters = () => {
        setSearch('');
        setTypeFilter('All');
        setStatusFilter('All');
        setCategoryFilter('All');
        setCustomerFilter('All');
        setDateFrom('');
        setDateTo('');
        setPage(1);
    };

    return (
        <div className="bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden flex flex-col min-w-0">
            <div className="p-4 sm:p-6 border-b border-[#2D333B] bg-[#16181D] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-[16px] font-bold text-white">{title}</h2>
                        <p className="text-xs text-slate-400">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-300 bg-[#111318] border border-[#2D333B] px-3 py-1.5 rounded-xl">
                            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
                        </span>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-[#4B5563] text-xs font-bold text-slate-300 transition-colors"
                            >
                                <RotateCcw size={13} />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                    <div className={`relative ${showCustomerColumn ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            aria-label="Search transactions"
                            placeholder="Search ID, note, method, invoice..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                        />
                    </div>

                    {showCustomerColumn && (
                        <select
                            aria-label="Filter by customer"
                            value={customerFilter}
                            onChange={(e) => {
                                setCustomerFilter(e.target.value);
                                setPage(1);
                            }}
                            className="lg:col-span-2 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                        >
                            <option value="All">All Customers</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.companyName}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        aria-label="Filter by transaction type"
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setPage(1);
                        }}
                        className="lg:col-span-2 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                    >
                        <option value="All">All Types</option>
                        <option value="Recharge">Recharge</option>
                        <option value="Deduction">Deduction</option>
                        <option value="Credit">Manual Credit</option>
                        <option value="Debit">Manual Debit</option>
                    </select>

                    <select
                        aria-label="Filter by transaction status"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="lg:col-span-2 min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                    </select>

                    <select
                        aria-label="Filter by message category"
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPage(1);
                        }}
                        className={`${showCustomerColumn ? 'lg:col-span-1' : 'lg:col-span-2'} min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer`}
                    >
                        <option value="All">Category</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Utility">Utility</option>
                        <option value="Authentication">Authentication</option>
                        <option value="Service">Service</option>
                    </select>

                    <div className="sm:col-span-2 lg:col-span-2 flex items-center gap-2">
                        <input
                            type="date"
                            aria-label="From date"
                            value={dateFrom}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                setPage(1);
                            }}
                            className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <input
                            type="date"
                            aria-label="To date"
                            value={dateTo}
                            onChange={(e) => {
                                setDateTo(e.target.value);
                                setPage(1);
                            }}
                            className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[820px]">
                    <thead className="bg-[#111318]">
                        <tr>
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Transaction</th>
                            {showCustomerColumn && (
                                <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Customer</th>
                            )}
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Type</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Details & Usage</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Amount</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Balance After</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B]">Status</th>
                            {onSelectInvoice && (
                                <th className="py-3.5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#2D333B] text-right">Invoice</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {pagedRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={showCustomerColumn ? (onSelectInvoice ? 8 : 7) : (onSelectInvoice ? 7 : 6)}
                                    className="py-10 text-center text-sm text-slate-400"
                                >
                                    No wallet transactions match the selected filters.
                                </td>
                            </tr>
                        ) : (
                            pagedRows.map((txn) => {
                                const isCredit = txn.type === 'Recharge' || txn.type === 'Credit';
                                const isSuccess = txn.status === 'Success';
                                return (
                                    <tr key={txn.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                        <td className="py-3.5 px-4">
                                            <p className="text-xs font-mono font-bold text-white">{txn.id}</p>
                                            <p className="text-[11px] text-slate-400">{txn.timestamp || txn.date}</p>
                                        </td>
                                        {showCustomerColumn && (
                                            <td className="py-3.5 px-4">
                                                <p className="text-xs font-bold text-white">{txn.customerName}</p>
                                                <p className="text-[11px] text-slate-400">{txn.actor}</p>
                                            </td>
                                        )}
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${TYPE_STYLES[txn.type] || TYPE_STYLES.Recharge}`}>
                                                {isCredit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 max-w-[280px] whitespace-normal">
                                            <p className="text-xs font-medium text-slate-200 leading-snug">
                                                {txn.note}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {txn.category
                                                    ? `${txn.category} • ${Number(txn.quantity || 0).toLocaleString()} msgs × ${formatUnitPrice(txn.unitPrice)}`
                                                    : txn.paymentMethod}
                                            </p>
                                        </td>
                                        <td className={`py-3.5 px-4 text-sm font-black text-right ${
                                            !isSuccess
                                                ? 'text-slate-400 line-through'
                                                : isCredit
                                                ? 'text-emerald-400'
                                                : 'text-amber-300'
                                        }`}>
                                            {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs font-mono text-slate-200 text-right">
                                            {formatCurrency(txn.balanceAfter)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[txn.status] || STATUS_STYLES.Success}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        {onSelectInvoice && (
                                            <td className="py-3.5 px-4 text-right">
                                                {txn.invoiceNumber && txn.status === 'Success' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onSelectInvoice(txn)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-indigo-300 transition-colors"
                                                    >
                                                        <FileText size={13} />
                                                        <span>{txn.invoiceNumber}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-[#2D333B] bg-[#16181D] flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                        Page {safePage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            aria-label="Previous transaction page"
                            className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-300 hover:border-[#8B5CF6] disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            aria-label="Next transaction page"
                            className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-300 hover:border-[#8B5CF6] disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletTransactionsPanel;
