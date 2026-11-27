import React, { useEffect, useState } from 'react';
import {
    Megaphone,
    Globe,
    Table2,
    CheckCircle2,
    AlertCircle,
    Settings2,
    Zap,
    Send,
    Loader2,
    ArrowUpRight,
    Bot,
    RefreshCw,
    Save,
    CopyCheck,
} from 'lucide-react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAppStore, { getRolePath, normalizeRoleKey } from '../../store/useStore';
import { mockUsers } from '../../mock/mockData';
import { toast } from '../ui/Toast';
import DuplicateReviewModal from './DuplicateReviewModal';

const CRM_TARGET_FIELDS = [
    { value: 'name', label: 'Full Name (name)' },
    { value: 'phone', label: 'Phone / WhatsApp (phone)' },
    { value: 'email', label: 'Email Address (email)' },
    { value: 'country', label: 'Target Country (country)' },
    { value: 'qualification', label: 'Qualification / Note (qualification)' },
];

const SOURCE_VISUALS = {
    meta_ads: {
        icon: FaFacebook,
        iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    },
    google_ads: {
        icon: FaGoogle,
        iconBg: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    },
    google_sheets: {
        icon: Table2,
        iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    },
    website_forms: {
        icon: Globe,
        iconBg: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    },
};

const CONFIG_LABELS = {
    businessManagerId: 'Business Manager ID',
    adAccountId: 'Ad Account ID',
    pageName: 'Connected Page Name',
    formName: 'Instant Form Name',
    customerCid: 'Google Ads Customer CID',
    campaignName: 'Campaign Name',
    webhookKey: 'Webhook Verification Key',
    formId: 'Form Extension ID',
    spreadsheetId: 'Spreadsheet ID',
    sheetName: 'Worksheet Tab Name',
    syncInterval: 'Polling Interval (Demo)',
    headerRow: 'Header Row Index',
    domain: 'Website / Landing Domain',
    endpointUrl: 'Demo Webhook Endpoint',
    secretHeader: 'Verification Header',
};

const LeadSourceHub = ({
    initialSourceId = 'meta_ads',
    pageTitle = 'Lead Source Integrations',
    pageSubtitle = 'Connect ad networks, spreadsheets & web forms into customer CRM pipelines (Frontend Demo)',
}) => {
    const {
        role,
        selectedAccount,
        customers,
        leadSources,
        leadAutomationConfig,
        updateLeadSource,
        testLeadSourceConnection,
        toggleLeadSource,
        recordLeadSourceSync,
        addCrmLead,
        mergeDuplicateLead,
        updateLeadAutomationConfig,
    } = useAppStore();

    const isSuperAdmin = normalizeRoleKey(role) === 'SUPER_ADMIN';
    const rolePath = getRolePath(role);
    const defaultCustomerId =
        selectedAccount?.id && selectedAccount.id !== 'platform'
            ? selectedAccount.id
            : customers[0]?.id || 'cust-001';

    const [activeSourceId, setActiveSourceId] = useState(initialSourceId);
    const activeSource = leadSources.find((s) => s.id === activeSourceId) || leadSources[0];

    const [configDraft, setConfigDraft] = useState(activeSource?.config || {});
    const [mappingDraft, setMappingDraft] = useState(activeSource?.fieldMapping || {});
    const [testingId, setTestingId] = useState(null);

    // Simulated Incoming Lead Form
    const [targetCustomerId, setTargetCustomerId] = useState(defaultCustomerId);
    const [incomingForm, setIncomingForm] = useState({
        name: 'Maya Lin',
        phone: '+1 (555) 318-9022',
        email: 'maya.lin@example.com',
        country: 'USA',
        qualification: 'BSc Computer Science',
    });
    const [lastCapturedBanner, setLastCapturedBanner] = useState(null);
    const [duplicateReview, setDuplicateReview] = useState(null);

    useEffect(() => {
        if (activeSource) {
            setConfigDraft(activeSource.config || {});
            setMappingDraft(activeSource.fieldMapping || {});
        }
    }, [activeSourceId, activeSource]);

    const handleSaveConfig = (e) => {
        e.preventDefault();
        if (!activeSource) return;
        updateLeadSource(activeSource.id, {
            config: configDraft,
            fieldMapping: mappingDraft,
        });
        toast.success(`${activeSource.name} configuration & field mapping saved.`);
    };

    const handleTestConnection = async () => {
        if (!activeSource) return;
        setTestingId(activeSource.id);
        await new Promise((resolve) => setTimeout(resolve, 400));
        testLeadSourceConnection(activeSource.id);
        setTestingId(null);
        toast.success(`${activeSource.name} simulated connection verified.`);
    };

    const handleSimulateIncoming = (e) => {
        e.preventDefault();
        if (!activeSource) return;
        if (!incomingForm.name.trim() || !incomingForm.phone.trim()) {
            toast.error('Enter both name and phone for simulated incoming lead.');
            return;
        }

        const assignedCustomerId = isSuperAdmin ? targetCustomerId : defaultCustomerId;
        const assigneeId = leadAutomationConfig?.enabled
            ? leadAutomationConfig.defaultAssigneeId || null
            : null;

        const incomingPayload = {
            name: incomingForm.name.trim(),
            phone: incomingForm.phone.trim(),
            email: incomingForm.email.trim(),
            country: incomingForm.country.trim() || 'Global',
            qualification: incomingForm.qualification.trim() || 'Direct Lead Form',
            source: activeSource.sourceLabel,
            stage: 'New',
            customerId: assignedCustomerId,
            assigned_to: assigneeId,
        };

        const res = addCrmLead(incomingPayload);
        if (res.duplicate) {
            setDuplicateReview({
                match: res.duplicate,
                incomingLead: incomingPayload,
            });
            return;
        }

        if (res.ok) {
            recordLeadSourceSync(activeSource.id);
            setLastCapturedBanner({
                leadName: res.lead.name,
                source: activeSource.name,
                customerName: res.lead.companyName,
                automationNote: leadAutomationConfig?.enabled
                    ? `Triggered ${leadAutomationConfig.triggerEvent} -> ${leadAutomationConfig.channel}`
                    : 'Automation paused',
            });
            toast.success(`Incoming ${activeSource.name} lead synced: ${res.lead.name}`);
        }
    };

    const totalReceived = leadSources.reduce((sum, s) => sum + (Number(s.receivedCount) || 0), 0);
    const connectedCount = leadSources.filter((s) => s.connected && s.enabled).length;
    const assignees = mockUsers.filter((u) => ['COUNSELOR', 'MANAGER', 'TEAM_LEADER'].includes(u.role));

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-20 text-white min-w-0">
            <DuplicateReviewModal
                isOpen={Boolean(duplicateReview)}
                duplicateMatch={duplicateReview?.match}
                incomingLead={duplicateReview?.incomingLead}
                onMerge={() => {
                    if (duplicateReview?.match?.existingLead) {
                        mergeDuplicateLead({
                            existingLeadId: duplicateReview.match.existingLead.id,
                            existingContactId: duplicateReview.match.existingContact?.id || null,
                            incomingLead: duplicateReview.incomingLead,
                        });
                        recordLeadSourceSync(activeSource.id);
                        toast.success(`Merged incoming ${activeSource.name} duplicate into existing lead.`);
                    }
                    setDuplicateReview(null);
                }}
                onSkip={() => {
                    toast.warning('Skipped duplicate incoming lead.');
                    setDuplicateReview(null);
                }}
                onCreateAnyway={() => {
                    if (duplicateReview?.incomingLead) {
                        const res = addCrmLead(duplicateReview.incomingLead, { forceCreate: true });
                        if (res.ok) {
                            recordLeadSourceSync(activeSource.id);
                            setLastCapturedBanner({
                                leadName: res.lead.name,
                                source: activeSource.name,
                                customerName: res.lead.companyName,
                                automationNote: 'Created separately via Duplicate Review',
                            });
                            toast.success(`Created ${res.lead.name} from ${activeSource.name}.`);
                        }
                    }
                    setDuplicateReview(null);
                }}
                onClose={() => setDuplicateReview(null)}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight mb-1">
                        {pageTitle}
                    </h1>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        {pageSubtitle}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to={`/${rolePath}/leads`}
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-white transition-colors"
                    >
                        <span>View CRM Leads</span>
                        <ArrowUpRight size={15} />
                    </Link>
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={testingId === activeSource?.id}
                        className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white transition-colors disabled:opacity-60"
                    >
                        {testingId === activeSource?.id ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <RefreshCw size={15} />
                        )}
                        <span>Test Active Connection</span>
                    </button>
                </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Sources</p>
                    <p className="text-2xl font-black text-white mt-1">
                        {connectedCount} / {leadSources.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Meta Ads, Google Ads, Sheets & Website</p>
                </div>
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Leads Received</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">{totalReceived.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Synced into CRM workspace leads</p>
                </div>
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">New-Lead Automation Link</p>
                    <p className="text-lg font-black text-indigo-300 mt-1">
                        {leadAutomationConfig?.enabled ? 'Active' : 'Paused'} • {leadAutomationConfig?.channel}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{leadAutomationConfig?.triggerEvent}</p>
                </div>
            </div>

            {/* 4 Source Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {leadSources.map((src) => {
                    const visual = SOURCE_VISUALS[src.id] || {
                        icon: Megaphone,
                        iconBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
                    };
                    const IconComp = visual.icon;
                    const isSelected = activeSource?.id === src.id;

                    return (
                        <div
                            key={src.id}
                            className={`bg-[#1C1F26] rounded-[20px] p-5 border transition-colors flex flex-col justify-between gap-4 ${
                                isSelected
                                    ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]/40'
                                    : 'border-[#2D333B] hover:border-[#4B5563]'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${visual.iconBg}`}>
                                        <IconComp size={20} />
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={src.enabled}
                                        aria-label={`Toggle ${src.name}`}
                                        onClick={() => {
                                            toggleLeadSource(src.id);
                                            toast.info(`${src.name} ${src.enabled ? 'disabled' : 'enabled'}.`);
                                        }}
                                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                                            src.enabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${
                                                src.enabled ? 'left-[22px]' : 'left-[2px]'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base font-bold text-white">{src.name}</h3>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                src.connected
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}
                                        >
                                            {src.connected ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5 leading-snug">
                                        {src.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#2D333B]/70 space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Leads: <strong className="text-white">{src.receivedCount}</strong>
                                    </span>
                                    <span className="text-[11px] text-slate-500">Sync: {src.lastSync}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveSourceId(src.id)}
                                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                                        isSelected
                                            ? 'bg-[#8B5CF6] text-white'
                                            : 'bg-[#111318] border border-[#2D333B] text-slate-300 hover:text-white hover:border-[#8B5CF6]'
                                    }`}
                                >
                                    {isSelected ? 'Configuring Source' : `Configure ${src.name}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Configuration + Simulator + Automation Link */}
            {activeSource && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left: Dummy Config Fields & Lead Field Mapping */}
                    <form
                        onSubmit={handleSaveConfig}
                        className="xl:col-span-7 bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-5 sm:p-6 space-y-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2D333B] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/25 flex items-center justify-center shrink-0">
                                    <Settings2 size={18} />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-white">
                                        {activeSource.name} Configuration & Field Mapping
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Status: {activeSource.lastTestStatus} • Last sync {activeSource.lastSync}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleTestConnection}
                                disabled={testingId === activeSource.id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-emerald-500 text-xs font-bold text-emerald-300 transition-colors"
                            >
                                {testingId === activeSource.id ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <CheckCircle2 size={13} />
                                )}
                                <span>Test Connection</span>
                            </button>
                        </div>

                        {/* Dummy Config Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(configDraft).map(([key, val]) => (
                                <div key={key} className="space-y-1.5">
                                    <label htmlFor={`cfg-${key}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                        {CONFIG_LABELS[key] || key}
                                    </label>
                                    <input
                                        id={`cfg-${key}`}
                                        type="text"
                                        value={val || ''}
                                        onChange={(e) =>
                                            setConfigDraft((prev) => ({ ...prev, [key]: e.target.value }))
                                        }
                                        className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Field Mapping */}
                        <div className="space-y-3 pt-2 border-t border-[#2D333B]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                                    Lead Field Mapping
                                </h3>
                                <span className="text-[11px] text-slate-400">Source Payload Key → CRM Field</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(mappingDraft).map(([sourceField, crmField]) => (
                                    <div
                                        key={sourceField}
                                        className="p-3 rounded-xl bg-[#111318] border border-[#2D333B] space-y-1.5"
                                    >
                                        <p className="text-[11px] font-mono text-indigo-300">{sourceField}</p>
                                        <select
                                            aria-label={`Map ${sourceField}`}
                                            value={crmField}
                                            onChange={(e) =>
                                                setMappingDraft((prev) => ({
                                                    ...prev,
                                                    [sourceField]: e.target.value,
                                                }))
                                            }
                                            className="w-full bg-[#16181D] border border-[#2D333B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                                        >
                                            {CRM_TARGET_FIELDS.map((tf) => (
                                                <option key={tf.value} value={tf.value}>
                                                    {tf.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-black uppercase tracking-widest text-white transition-colors"
                            >
                                <Save size={15} />
                                <span>Save {activeSource.name} Config</span>
                            </button>
                        </div>
                    </form>

                    {/* Right Column: Simulated Incoming Lead + Automation Handoff Link */}
                    <div className="xl:col-span-5 space-y-6">
                        {/* Simulate Incoming Lead Demo */}
                        <form
                            onSubmit={handleSimulateIncoming}
                            className="bg-[#1C1F26] border border-[#2D333B] rounded-[20px] p-5 sm:p-6 space-y-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="text-[16px] font-bold text-white">
                                        Simulate Incoming {activeSource.name} Lead
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Demonstrates field mapping, duplicate review & CRM sync
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIncomingForm({
                                            name: 'Aarav Patel',
                                            phone: '+91 98765 43210',
                                            email: 'aarav.patel@gmail.com',
                                            country: 'UK',
                                            qualification: 'MSc AI (Duplicate Test)',
                                        })
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 shrink-0"
                                >
                                    <CopyCheck size={13} />
                                    <span>Fill Duplicate Sample</span>
                                </button>
                            </div>

                            {isSuperAdmin && (
                                <div>
                                    <label htmlFor="sim-target-customer" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                        Destination Customer Account
                                    </label>
                                    <select
                                        id="sim-target-customer"
                                        value={targetCustomerId}
                                        onChange={(e) => setTargetCustomerId(e.target.value)}
                                        className="w-full min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                    >
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    aria-label="Simulated lead name"
                                    value={incomingForm.name}
                                    onChange={(e) => setIncomingForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Lead Name"
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                    type="text"
                                    aria-label="Simulated lead phone"
                                    value={incomingForm.phone}
                                    onChange={(e) => setIncomingForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Phone Number"
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                    type="email"
                                    aria-label="Simulated lead email"
                                    value={incomingForm.email}
                                    onChange={(e) => setIncomingForm((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="Email Address"
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                    type="text"
                                    aria-label="Simulated lead country"
                                    value={incomingForm.country}
                                    onChange={(e) => setIncomingForm((prev) => ({ ...prev, country: e.target.value }))}
                                    placeholder="Target Country"
                                    className="min-h-[40px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full min-h-[42px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-colors"
                            >
                                <Send size={14} />
                                <span>Simulate Incoming Lead</span>
                            </button>

                            {lastCapturedBanner && (
                                <div role="status" className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs space-y-1">
                                    <p className="font-bold text-emerald-300">
                                        Synced "{lastCapturedBanner.leadName}" via {lastCapturedBanner.source}
                                    </p>
                                    <p className="text-slate-300">
                                        Workspace: {lastCapturedBanner.customerName} • {lastCapturedBanner.automationNote}
                                    </p>
                                    <Link
                                        to={`/${rolePath}/leads`}
                                        className="inline-flex items-center gap-1 text-indigo-300 hover:underline font-bold pt-0.5"
                                    >
                                        <span>Inspect in Global Directory</span>
                                        <ArrowUpRight size={12} />
                                    </Link>
                                </div>
                            )}
                        </form>

                        {/* New-Lead Automation Handoff Configuration (Linked to Developer 1 Sales Agent UI) */}
                        <div className="bg-[#16181D] border border-[#2D333B] rounded-[20px] p-5 sm:p-6 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 flex items-center justify-center shrink-0">
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">New-Lead Automation Handoff</h3>
                                        <p className="text-[11px] text-slate-400">
                                            Linked to Developer 1's Sales Agent automation interface
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={Boolean(leadAutomationConfig?.enabled)}
                                    aria-label="Toggle new-lead automation trigger"
                                    onClick={() => {
                                        updateLeadAutomationConfig({ enabled: !leadAutomationConfig?.enabled });
                                        toast.success('New-lead automation handoff setting updated.');
                                    }}
                                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                                        leadAutomationConfig?.enabled ? 'bg-[#8B5CF6]' : 'bg-[#2D333B]'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-[2px] h-5 w-5 bg-white rounded-full transition-all shadow-sm ${
                                            leadAutomationConfig?.enabled ? 'left-[22px]' : 'left-[2px]'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                        Trigger Rule
                                    </label>
                                    <select
                                        aria-label="Automation trigger rule"
                                        value={leadAutomationConfig?.triggerEvent || 'On New Lead Arrival'}
                                        onChange={(e) => updateLeadAutomationConfig({ triggerEvent: e.target.value })}
                                        className="w-full min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-white"
                                    >
                                        <option value="On New Lead Arrival">On New Lead Arrival</option>
                                        <option value="Qualified Leads Only">Qualified Leads Only</option>
                                        <option value="Ad Sources Only">Meta & Google Ads Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                        Default Auto-Assignee
                                    </label>
                                    <select
                                        aria-label="Automation default assignee"
                                        value={leadAutomationConfig?.defaultAssigneeId || ''}
                                        onChange={(e) => updateLeadAutomationConfig({ defaultAssigneeId: e.target.value })}
                                        className="w-full min-h-[38px] bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-1.5 text-xs text-white"
                                    >
                                        <option value="">Unassigned Queue</option>
                                        {assignees.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#2D333B]">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <Zap size={12} className="text-amber-400" />
                                    Handoff contract: <code className="text-slate-300">demo_lead_automation</code>
                                </span>
                                <Link
                                    to={`/${rolePath}/sales-agent`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-bold text-indigo-300 transition-colors"
                                >
                                    <span>Open Sales Agent UI</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadSourceHub;
