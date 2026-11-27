import React, { useEffect, useState } from 'react';
import {
    X,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Shield,
} from 'lucide-react';

const ExternalConfigModal = ({
    isOpen,
    integration,
    customerName,
    onClose,
    onSave,
    onTestConnection,
}) => {
    const [activeTab, setActiveTab] = useState('connection'); // 'connection' | 'mapping' | 'preferences'
    const [showKey, setShowKey] = useState(false);
    const [simulateFailTest, setSimulateFailTest] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testFeedback, setTestFeedback] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState(null);

    useEffect(() => {
        if (integration) {
            setForm({
                softwareName: integration.softwareName || '',
                apiEndpoint: integration.apiEndpoint || '',
                apiKey: integration.apiKey || '',
                authType: integration.authType || 'API Key',
                customerMapping: { ...(integration.customerMapping || {}) },
                appointmentMapping: { ...(integration.appointmentMapping || {}) },
                paymentMapping: { ...(integration.paymentMapping || {}) },
                syncPreferences: { ...(integration.syncPreferences || {}) },
            });
            setActiveTab('connection');
            setTestFeedback(null);
            setErrors({});
            setShowKey(false);
            setSimulateFailTest(false);
        }
    }, [integration]);

    if (!isOpen || !integration || !form) return null;

    const validate = () => {
        const errs = {};
        if (!form.softwareName.trim()) errs.softwareName = 'Software display name is required.';
        if (!form.apiEndpoint.trim() || !/^https?:\/\//i.test(form.apiEndpoint.trim())) {
            errs.apiEndpoint = 'Enter a valid demo URL starting with https:// or http://.';
        }
        if (!form.apiKey.trim()) errs.apiKey = 'Dummy API key is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleTestClick = async () => {
        if (!validate()) {
            setActiveTab('connection');
            return;
        }
        setIsTesting(true);
        setTestFeedback(null);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const res = onTestConnection(integration.id, simulateFailTest);
        setIsTesting(false);
        setTestFeedback(
            res?.ok
                ? { ok: true, message: `Connection succeeded for ${form.softwareName} (Demo 200 OK).` }
                : { ok: false, message: 'Simulated connection failed: invalid demo token or timeout (401).' }
        );
    };

    const handleSaveSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            setActiveTab('connection');
            return;
        }
        onSave(integration.id, {
            softwareName: form.softwareName.trim(),
            apiEndpoint: form.apiEndpoint.trim(),
            apiKey: form.apiKey.trim(),
            authType: form.authType,
            customerMapping: form.customerMapping,
            appointmentMapping: form.appointmentMapping,
            paymentMapping: form.paymentMapping,
            syncPreferences: form.syncPreferences,
        });
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="External Software Configuration"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between gap-3 shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                            Configure {integration.softwareName}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                            Workspace: {customerName} • Demo Settings & Field Mapping
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close external config modal"
                        className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Inner Tabs */}
                <div className="px-5 sm:px-6 pt-4 shrink-0">
                    <div className="inline-flex flex-wrap bg-[#111318] p-1 rounded-xl border border-[#2D333B] gap-1 w-full sm:w-auto">
                        {[
                            { id: 'connection', label: 'Connection & Auth' },
                            { id: 'mapping', label: 'Data Mapping' },
                            { id: 'preferences', label: 'Sync Preferences' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-[#8B5CF6] text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form id="external-config-form" onSubmit={handleSaveSubmit} noValidate className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {activeTab === 'connection' && (
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-2">
                                <Shield size={15} className="shrink-0 text-indigo-400" />
                                <span>Frontend demo configuration only — enter dummy values, never real production keys.</span>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="ext-software-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                    Software Display Name
                                </label>
                                <input
                                    id="ext-software-name"
                                    type="text"
                                    value={form.softwareName}
                                    onChange={(e) => {
                                        setForm((prev) => ({ ...prev, softwareName: e.target.value }));
                                        setErrors((prev) => ({ ...prev, softwareName: undefined }));
                                    }}
                                    className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#8B5CF6]"
                                />
                                {errors.softwareName && <p className="text-xs text-rose-400">{errors.softwareName}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="ext-api-endpoint" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                    Dummy API Endpoint
                                </label>
                                <input
                                    id="ext-api-endpoint"
                                    type="url"
                                    value={form.apiEndpoint}
                                    onChange={(e) => {
                                        setForm((prev) => ({ ...prev, apiEndpoint: e.target.value }));
                                        setErrors((prev) => ({ ...prev, apiEndpoint: undefined }));
                                    }}
                                    className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#8B5CF6]"
                                />
                                {errors.apiEndpoint && <p className="text-xs text-rose-400">{errors.apiEndpoint}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="ext-auth-type" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        Authentication Type
                                    </label>
                                    <select
                                        id="ext-auth-type"
                                        value={form.authType}
                                        onChange={(e) => setForm((prev) => ({ ...prev, authType: e.target.value }))}
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                    >
                                        <option value="API Key">API Key</option>
                                        <option value="Bearer Token (Demo)">Bearer Token (Demo)</option>
                                        <option value="Custom Header (Demo)">Custom Header (Demo)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="ext-api-key" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        Dummy API Key / Token
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="ext-api-key"
                                            type={showKey ? 'text' : 'password'}
                                            value={form.apiKey}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, apiKey: e.target.value }));
                                                setErrors((prev) => ({ ...prev, apiKey: undefined }));
                                            }}
                                            className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl pl-3.5 pr-10 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKey((p) => !p)}
                                            aria-label={showKey ? 'Hide dummy key' : 'Show dummy key'}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {errors.apiKey && <p className="text-xs text-rose-400">{errors.apiKey}</p>}
                                </div>
                            </div>

                            {/* Test Simulation Outcome Toggle */}
                            <div className="p-3.5 rounded-xl bg-[#111318] border border-[#2D333B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-xs font-semibold text-slate-300">
                                    Connection Test Behavior (Demo):
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSimulateFailTest(false)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                            !simulateFailTest
                                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                                : 'bg-[#16181D] border-[#2D333B] text-slate-400'
                                        }`}
                                    >
                                        Simulate Success
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSimulateFailTest(true)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                            simulateFailTest
                                                ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                                                : 'bg-[#16181D] border-[#2D333B] text-slate-400'
                                        }`}
                                    >
                                        Simulate Failure
                                    </button>
                                </div>
                            </div>

                            {testFeedback && (
                                <div
                                    role="status"
                                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                                        testFeedback.ok
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                    }`}
                                >
                                    {testFeedback.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{testFeedback.message}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'mapping' && (
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Customer Data Mapping',
                                    stateKey: 'customerMapping',
                                    fields: [
                                        { k: 'externalId', label: 'External Customer ID' },
                                        { k: 'name', label: 'Customer Name Field' },
                                        { k: 'phone', label: 'Mobile / WhatsApp Field' },
                                        { k: 'email', label: 'Email Field' },
                                    ],
                                },
                                {
                                    title: 'Appointment Data Mapping',
                                    stateKey: 'appointmentMapping',
                                    fields: [
                                        { k: 'appointmentId', label: 'Appointment ID Field' },
                                        { k: 'scheduledAt', label: 'Date / Time Field' },
                                        { k: 'assignedStaff', label: 'Doctor / Staff Field' },
                                        { k: 'status', label: 'Appointment Status Field' },
                                    ],
                                },
                                {
                                    title: 'Payment Data Mapping',
                                    stateKey: 'paymentMapping',
                                    fields: [
                                        { k: 'invoiceId', label: 'Invoice Ref Field' },
                                        { k: 'amount', label: 'Amount Field' },
                                        { k: 'paymentMethod', label: 'Payment Method Field' },
                                        { k: 'status', label: 'Settlement Status Field' },
                                    ],
                                },
                            ].map((group) => (
                                <div key={group.stateKey} className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B] space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">
                                        {group.title}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {group.fields.map((f) => (
                                            <div key={f.k}>
                                                <label className="text-[11px] text-slate-400 block mb-1">{f.label}</label>
                                                <input
                                                    type="text"
                                                    value={form[group.stateKey]?.[f.k] || ''}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            [group.stateKey]: {
                                                                ...prev[group.stateKey],
                                                                [f.k]: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="w-full min-h-[38px] bg-[#16181D] border border-[#2D333B] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        Synchronization Direction
                                    </label>
                                    <select
                                        value={form.syncPreferences.direction || 'Bi-directional'}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                syncPreferences: { ...prev.syncPreferences, direction: e.target.value },
                                            }))
                                        }
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                    >
                                        <option value="Bi-directional">Bi-directional</option>
                                        <option value="Inbound to CRM">Inbound to CRM Only</option>
                                        <option value="Outbound Only">Outbound from CRM Only</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        Sync Frequency
                                    </label>
                                    <select
                                        value={form.syncPreferences.frequency || 'Hourly'}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                syncPreferences: { ...prev.syncPreferences, frequency: e.target.value },
                                            }))
                                        }
                                        className="w-full min-h-[42px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                    >
                                        <option value="Manual">Manual Only</option>
                                        <option value="Every 15 mins">Every 15 mins</option>
                                        <option value="Hourly">Hourly</option>
                                        <option value="Daily">Daily</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#111318] border border-[#2D333B] space-y-2.5">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                                    Entities Included in Sync
                                </p>
                                {[
                                    { key: 'syncCustomers', label: 'Synchronize Customer Records' },
                                    { key: 'syncAppointments', label: 'Synchronize Appointment Schedules' },
                                    { key: 'syncPayments', label: 'Synchronize Payment & Invoice Receipts' },
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer py-1">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(form.syncPreferences[item.key])}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    syncPreferences: {
                                                        ...prev.syncPreferences,
                                                        [item.key]: e.target.checked,
                                                    },
                                                }))
                                            }
                                            className="accent-[#8B5CF6]"
                                        />
                                        <span>{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                {/* Modal Footer */}
                <div className="p-5 sm:p-6 border-t border-[#2D333B] bg-[#16181D] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0">
                    <button
                        type="button"
                        disabled={isTesting}
                        onClick={handleTestClick}
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-emerald-500 text-xs font-bold text-emerald-300 transition-colors disabled:opacity-60"
                    >
                        {isTesting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        <span>Test Connection</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none min-h-[42px] px-5 py-2 rounded-xl bg-[#111318] border border-[#2D333B] text-xs font-bold text-slate-300 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="external-config-form"
                            className="flex-1 sm:flex-none min-h-[42px] px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white inline-flex items-center justify-center gap-2"
                        >
                            <Save size={14} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalConfigModal;
