import React, { useMemo, useState } from 'react';
import {
    Stethoscope,
    Calculator,
    Package,
    CalendarClock,
    GraduationCap,
    Settings2,
    RefreshCw,
    Play,
    CheckCircle2,
    AlertCircle,
    Search,
    RotateCcw,
    Building2,
    Users,
    Calendar,
    CreditCard,
    Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore, { getRolePath, normalizeRoleKey } from '../store/useStore';
import { buildDefaultIntegrationsForCustomer } from '../mock/mockData';
import { toast } from '../components/ui/Toast';
import ExternalConfigModal from '../components/integrations/ExternalConfigModal';

const SOFTWARE_ICONS = {
    clinic: { icon: Stethoscope, style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    accounting: { icon: Calculator, style: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' },
    erp: { icon: Package, style: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
    booking: { icon: CalendarClock, style: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    lms: { icon: GraduationCap, style: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
};

const LOG_STATUS_STYLES = {
    Success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const ExternalSoftwareIntegrations = () => {
    const {
        role,
        selectedAccount,
        customers,
        externalIntegrationsByCustomer,
        externalSyncLogs,
        externalSyncPreview,
        updateExternalIntegration,
        toggleExternalIntegration,
        testExternalIntegrationConnection,
        runExternalSoftwareSync,
        retryFailedSyncLog,
    } = useAppStore();

    const roleKey = normalizeRoleKey(role);
    const isSuperAdmin = roleKey === 'SUPER_ADMIN';
    const isCustomerAdmin = roleKey === 'ADMIN' || roleKey === 'CUSTOMER_ADMIN';
    const canView = isSuperAdmin || isCustomerAdmin;
    const rolePath = getRolePath(role);

    const defaultCustomerId =
        selectedAccount?.id && selectedAccount.id !== 'platform'
            ? selectedAccount.id
            : customers[0]?.id || 'cust-001';

    const [selectedCustomerId, setSelectedCustomerId] = useState(defaultCustomerId);
    const activeCustomerId = isCustomerAdmin ? defaultCustomerId : selectedCustomerId;
    const activeCustomer =
        customers.find((c) => c.id === activeCustomerId) || customers[0];

    const [configModalTarget, setConfigModalTarget] = useState(null);
    const [syncingSoftwareId, setSyncingSoftwareId] = useState(null);
    const [syncProgress, setSyncProgress] = useState(0);
    const [simulateSyncError, setSimulateSyncError] = useState(false);
    const [lastSyncBanner, setLastSyncBanner] = useState(null);

    const [previewTab, setPreviewTab] = useState('customers'); // 'customers' | 'appointments' | 'payments'
    const [logSearch, setLogSearch] = useState('');
    const [logStatusFilter, setLogStatusFilter] = useState('All');
    const [logDateFrom, setLogDateFrom] = useState('');
    const [logDateTo, setLogDateTo] = useState('');

    const activeIntegrations = useMemo(() => {
        if (!activeCustomer) return [];
        return (
            externalIntegrationsByCustomer[activeCustomer.id] ||
            buildDefaultIntegrationsForCustomer(activeCustomer)
        );
    }, [externalIntegrationsByCustomer, activeCustomer]);

    const customerSummaryRows = useMemo(() => {
        if (!isSuperAdmin) return [];
        return customers.map((c) => {
            const list = externalIntegrationsByCustomer[c.id] || buildDefaultIntegrationsForCustomer(c);
            const connected = list.filter((i) => i.connected && i.enabled).length;
            const totalSuccess = list.reduce((s, i) => s + (Number(i.successCount) || 0), 0);
            const totalFailed = list.reduce((s, i) => s + (Number(i.failedCount) || 0), 0);
            return { customer: c, connected, total: list.length, totalSuccess, totalFailed };
        });
    }, [isSuperAdmin, customers, externalIntegrationsByCustomer]);

    const scopedPreviewRecords = useMemo(() => {
        const list = externalSyncPreview?.[previewTab] || [];
        return list.filter((r) => r.customerId === activeCustomerId);
    }, [externalSyncPreview, previewTab, activeCustomerId]);

    const filteredLogs = useMemo(() => {
        const q = logSearch.trim().toLowerCase();
        return externalSyncLogs.filter((log) => {
            if (isCustomerAdmin && log.customerId !== activeCustomerId) return false;
            if (isSuperAdmin && log.customerId !== activeCustomerId) return false;
            if (logStatusFilter !== 'All' && log.status !== logStatusFilter) return false;
            if (logDateFrom && log.date < logDateFrom) return false;
            if (logDateTo && log.date > logDateTo) return false;
            if (q) {
                return (
                    (log.id || '').toLowerCase().includes(q) ||
                    (log.softwareName || '').toLowerCase().includes(q) ||
                    (log.message || '').toLowerCase().includes(q) ||
                    (log.action || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [externalSyncLogs, isCustomerAdmin, isSuperAdmin, activeCustomerId, logStatusFilter, logDateFrom, logDateTo, logSearch]);

    if (!canView) {
        return (
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-[#111318] min-h-full text-white">
                <div className="text-center p-8 bg-[#1C1F26] rounded-3xl border border-[#2D333B] max-w-md w-full">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-400">
                        External software integrations are restricted to Super Admin and Customer Admin accounts.
                    </p>
                </div>
            </div>
        );
    }

    const handleTriggerSync = async (softwareId) => {
        setSyncingSoftwareId(softwareId);
        setSyncProgress(25);
        await new Promise((r) => setTimeout(r, 150));
        setSyncProgress(70);
        await new Promise((r) => setTimeout(r, 150));
        setSyncProgress(100);

        const res = runExternalSoftwareSync(activeCustomerId, softwareId, simulateSyncError);
        setSyncingSoftwareId(null);

        if (res?.ok) {
            setLastSyncBanner({
                softwareName: res.logEntry.softwareName,
                successRecords: res.batchSuccess,
                failedRecords: res.batchFailed,
                status: res.logEntry.status,
            });
            if (res.batchFailed > 0) {
                toast.warning(`Partial sync: ${res.batchSuccess} synced, ${res.batchFailed} failed`);
            } else {
                toast.success(`Synced ${res.batchSuccess} records from ${res.logEntry.softwareName}`);
            }
        }
    };

    const handleRetry = (logId) => {
        const retried = retryFailedSyncLog(logId);
        if (retried) {
            toast.success(`${retried.id} retry succeeded.`);
        }
    };

    const connectedCardsCount = activeIntegrations.filter((i) => i.connected && i.enabled).length;

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            <ExternalConfigModal
                isOpen={Boolean(configModalTarget)}
                integration={configModalTarget}
                customerName={activeCustomer?.companyName || 'Customer Workspace'}
                onClose={() => setConfigModalTarget(null)}
                onSave={(softwareId, updates) => {
                    updateExternalIntegration(activeCustomerId, softwareId, updates);
                    toast.success(`${updates.softwareName} configuration saved.`);
                    setConfigModalTarget(null);
                }}
                onTestConnection={(softwareId, simulateFail) => {
                    const res = testExternalIntegrationConnection(activeCustomerId, softwareId, simulateFail);
                    if (res.ok) toast.success('Simulated external connection succeeded.');
                    else toast.error('Simulated external connection failed.');
                    return res;
                }}
            />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1F26] border border-[#2D333B] text-xs font-bold text-indigo-300">
                            <Building2 size={13} />
                            {activeCustomer?.workspaceCode}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            {connectedCardsCount} / {activeIntegrations.length} Active Software Links
                        </span>
                    </div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight break-words sm:truncate">
                        External Software Integrations
                    </h1>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        Clinic, Accounting & Configurable Business Suites for {activeCustomer?.companyName} (Frontend Demo)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {isSuperAdmin && (
                        <select
                            aria-label="Select customer for external integrations"
                            value={activeCustomerId}
                            onChange={(e) => {
                                setSelectedCustomerId(e.target.value);
                                setLastSyncBanner(null);
                            }}
                            className="min-h-[42px] bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#8B5CF6]"
                        >
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.companyName} ({c.workspaceCode})
                                </option>
                            ))}
                        </select>
                    )}

                    <label className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-xs text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={simulateSyncError}
                            onChange={(e) => setSimulateSyncError(e.target.checked)}
                            className="accent-rose-500"
                        />
                        <span>Simulate Sync Error</span>
                    </label>
                </div>
            </div>

            {/* Related Existing Screens Note (Non-duplicating) */}
            <div className="p-3.5 rounded-2xl bg-[#16181D] border border-[#2D333B] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>
                    Note: WhatsApp / Social channels remain in <Link to={`/${rolePath}/integrations`} className="text-indigo-300 hover:underline font-semibold">Integrations</Link>, and Ad/Web lead forms remain in <Link to={`/${rolePath}/lead-sources`} className="text-indigo-300 hover:underline font-semibold">Lead Sources</Link>.
                </span>
                <span className="text-[11px] text-slate-500">Unconfirmed software names clearly labeled as Demo.</span>
            </div>

            {/* Super Admin Customer-Wise Overview Matrix */}
            {isSuperAdmin && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white">Customer-Wise External Integration Status</h2>
                        <span className="text-xs text-slate-400">Click any workspace to manage its integrations</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {customerSummaryRows.map((row) => (
                            <button
                                key={row.customer.id}
                                type="button"
                                onClick={() => setSelectedCustomerId(row.customer.id)}
                                className={`text-left p-3.5 rounded-xl border transition-colors ${
                                    row.customer.id === activeCustomerId
                                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]'
                                        : 'bg-[#111318] border-[#2D333B] hover:border-[#4B5563]'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-white truncate">{row.customer.companyName}</span>
                                    <span className="text-[10px] font-black uppercase text-emerald-400">
                                        {row.connected}/{row.total} Active
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Synced: <strong className="text-slate-200">{row.totalSuccess}</strong> • Failed:{' '}
                                    <strong className={row.totalFailed > 0 ? 'text-rose-400' : 'text-slate-300'}>
                                        {row.totalFailed}
                                    </strong>
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Live Sync Progress / Feedback Banner */}
            {(syncingSoftwareId || lastSyncBanner) && (
                <div
                    role="status"
                    className={`rounded-2xl border p-4 space-y-2 ${
                        syncingSoftwareId
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                            : lastSyncBanner.failedRecords > 0
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    }`}
                >
                    {syncingSoftwareId ? (
                        <>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Synchronizing external software records...
                                </span>
                                <span>{syncProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-[#111318] rounded-full overflow-hidden">
                                <div className="h-full bg-[#8B5CF6] transition-all duration-150" style={{ width: `${syncProgress}%` }} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                            <span>
                                Sync completed for <strong>{lastSyncBanner.softwareName}</strong> ({lastSyncBanner.status}):{' '}
                                <strong>{lastSyncBanner.successRecords}</strong> succeeded,{' '}
                                <strong>{lastSyncBanner.failedRecords}</strong> failed.
                            </span>
                            <button
                                type="button"
                                onClick={() => setLastSyncBanner(null)}
                                className="text-xs underline opacity-80 hover:opacity-100"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 5 External Software Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {activeIntegrations.map((sw) => {
                    const iconDef = SOFTWARE_ICONS[sw.iconKey] || SOFTWARE_ICONS.erp;
                    const IconComp = iconDef.icon;
                    const isBusy = syncingSoftwareId === sw.id;

                    return (
                        <div
                            key={sw.id}
                            className="bg-[#1C1F26] rounded-[20px] p-5 border border-[#2D333B] hover:border-[#4B5563] transition-colors flex flex-col justify-between gap-4 min-w-0"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${iconDef.style}`}>
                                        <IconComp size={20} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                sw.connected
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}
                                        >
                                            {sw.connected ? 'Connected' : 'Disconnected'}
                                        </span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={sw.enabled}
                                            aria-label={`Toggle ${sw.softwareName}`}
                                            onClick={() => {
                                                toggleExternalIntegration(activeCustomerId, sw.id);
                                                toast.info(`${sw.shortName} ${sw.enabled ? 'disabled' : 'enabled'}.`);
                                            }}
                                            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                                                sw.enabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${
                                                    sw.enabled ? 'left-[22px]' : 'left-[2px]'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                        {sw.category}
                                    </span>
                                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                                        {sw.softwareName}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1.5 leading-snug">
                                        {sw.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-[#2D333B]/70">
                                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#111318] p-2.5 rounded-xl border border-[#2D333B]">
                                    <div>
                                        <span className="text-slate-500 block">Last Sync</span>
                                        <span className="text-slate-200 font-semibold">{sw.lastSync}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-500 block">Sync Status</span>
                                        <span className={`font-bold ${
                                            sw.lastSyncStatus === 'Synced'
                                                ? 'text-emerald-400'
                                                : sw.lastSyncStatus === 'Partial Failed'
                                                ? 'text-amber-300'
                                                : 'text-slate-400'
                                        }`}>
                                            {sw.lastSyncStatus}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-between pt-1 border-t border-[#2D333B]/60 text-[11px]">
                                        <span className="text-slate-400">
                                            Success: <strong className="text-emerald-400">{sw.successCount}</strong>
                                        </span>
                                        <span className="text-slate-400">
                                            Failed: <strong className={sw.failedCount > 0 ? 'text-rose-400' : 'text-slate-300'}>{sw.failedCount}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setConfigModalTarget(sw)}
                                        className="py-2 px-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-white flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Settings2 size={13} />
                                        <span>Configure</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const res = testExternalIntegrationConnection(activeCustomerId, sw.id, false);
                                            if (res.ok) toast.success(`${sw.shortName} test succeeded.`);
                                        }}
                                        className="py-2 px-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-emerald-500 text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <RefreshCw size={13} />
                                        <span>Test</span>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleTriggerSync(sw.id)}
                                        className="py-2 px-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                    >
                                        <Play size={12} />
                                        <span>{isBusy ? 'Syncing' : 'Sync'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Data Sync Preview + Activity & Error Logs */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Dummy Data Sync Preview */}
                <div className="xl:col-span-5 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 sm:p-5 border-b border-[#2D333B] bg-[#16181D] space-y-3">
                        <div>
                            <h2 className="text-[16px] font-bold text-white">Synchronized Data Preview (Demo)</h2>
                            <p className="text-xs text-slate-400">
                                Sample customer, appointment & payment records for {activeCustomer?.companyName}
                            </p>
                        </div>
                        <div className="inline-flex bg-[#111318] p-1 rounded-xl border border-[#2D333B] gap-1 w-full">
                            {[
                                { id: 'customers', label: 'Customers', icon: Users },
                                { id: 'appointments', label: 'Appointments', icon: Calendar },
                                { id: 'payments', label: 'Payments', icon: CreditCard },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setPreviewTab(t.id)}
                                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors ${
                                        previewTab === t.id
                                            ? 'bg-[#8B5CF6] text-white'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <t.icon size={13} />
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[420px]">
                        {scopedPreviewRecords.length === 0 ? (
                            <div className="py-10 text-center text-xs text-slate-400">
                                No dummy {previewTab} records yet for {activeCustomer?.companyName}. Run a Sync above to preview incoming records.
                            </div>
                        ) : (
                            scopedPreviewRecords.map((rec) => {
                                const stateLabel = rec.syncStatus || rec.status;
                                return (
                                    <div
                                        key={rec.id}
                                        className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-mono text-indigo-300">{rec.id}</span>
                                                <span className="text-[11px] text-slate-500 truncate">{rec.softwareName}</span>
                                            </div>
                                            <p className="text-xs font-bold text-white truncate mt-0.5">
                                                {rec.name || rec.clientName}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                {previewTab === 'customers'
                                                    ? `${rec.phone} • ${rec.email}`
                                                    : previewTab === 'appointments'
                                                    ? `${rec.scheduledAt} • ${rec.staff}`
                                                    : `${rec.invoiceNo} • ${rec.amount} (${rec.method})`}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                stateLabel === 'Synced'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}
                                        >
                                            {stateLabel}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Activity & Error Logs with Retry */}
                <div className="xl:col-span-7 bg-[#1C1F26] rounded-[20px] border border-[#2D333B] overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 sm:p-5 border-b border-[#2D333B] bg-[#16181D] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[16px] font-bold text-white">Integration Activity & Error Logs</h2>
                                <p className="text-xs text-slate-400">
                                    Filter sync history or retry failed batches for {activeCustomer?.companyName}
                                </p>
                            </div>
                            <span className="text-xs font-bold text-slate-300 bg-[#111318] border border-[#2D333B] px-3 py-1 rounded-xl">
                                {filteredLogs.length} logs
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                            <div className="relative sm:col-span-5">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    aria-label="Search integration logs"
                                    value={logSearch}
                                    onChange={(e) => setLogSearch(e.target.value)}
                                    placeholder="Search log ID, software, note..."
                                    className="w-full min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                                />
                            </div>
                            <select
                                aria-label="Filter logs by status"
                                value={logStatusFilter}
                                onChange={(e) => setLogStatusFilter(e.target.value)}
                                className="sm:col-span-3 min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-white"
                            >
                                <option value="All">All Status</option>
                                <option value="Success">Success</option>
                                <option value="Failed">Failed</option>
                            </select>
                            <div className="sm:col-span-4 flex items-center gap-1.5">
                                <input
                                    type="date"
                                    aria-label="Logs from date"
                                    value={logDateFrom}
                                    onChange={(e) => setLogDateFrom(e.target.value)}
                                    className="w-full min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl px-2 py-1.5 text-xs text-white"
                                />
                                <input
                                    type="date"
                                    aria-label="Logs to date"
                                    value={logDateTo}
                                    onChange={(e) => setLogDateTo(e.target.value)}
                                    className="w-full min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl px-2 py-1.5 text-xs text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[640px]">
                            <thead className="bg-[#111318]">
                                <tr>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Log / Time</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Software & Details</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Records</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B]">Status</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[#2D333B] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                                            No integration logs match the current search or filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="border-b border-[#2D333B]/50 hover:bg-[#111318] transition-colors">
                                            <td className="py-3 px-4">
                                                <p className="text-xs font-mono font-bold text-white">{log.id}</p>
                                                <p className="text-[11px] text-slate-400">{log.timestamp}</p>
                                            </td>
                                            <td className="py-3 px-4 max-w-[260px] whitespace-normal">
                                                <p className="text-xs font-bold text-indigo-300 truncate">{log.softwareName}</p>
                                                <p className="text-[11px] text-slate-300 leading-snug">{log.message}</p>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-right">
                                                <span className="text-emerald-400 font-bold">{log.successRecords}</span>
                                                <span className="text-slate-500 mx-1">/</span>
                                                <span className={log.failedRecords > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                                                    {log.failedRecords} fail
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${LOG_STATUS_STYLES[log.status] || LOG_STATUS_STYLES.Success}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {log.status === 'Failed' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRetry(log.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500 text-xs font-bold text-rose-200 hover:text-white transition-colors"
                                                    >
                                                        <RotateCcw size={12} />
                                                        <span>Retry</span>
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                                        <CheckCircle2 size={12} /> OK
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalSoftwareIntegrations;
