import React, { useState } from 'react';
import { 
    X, Check, Sliders, Clock, Bell, AlertTriangle, 
    CheckCircle2, DollarSign, Calendar, Send, ShieldCheck, Sparkles 
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import useWhatsAppTemplateStore from '../../../store/useWhatsAppTemplateStore';
import WhatsAppTemplateSelector from '../templates/WhatsAppTemplateSelector';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const PaymentReminderConfigModal = () => {
    const { 
        isPaymentReminderConfigModalOpen, 
        closePaymentReminderConfigModal, 
        paymentRules, 
        updatePaymentRules,
        executeAutomation
    } = useWhatsAppAutomationStore();

    const { templates } = useWhatsAppTemplateStore();

    const [formRules, setFormRules] = useState(paymentRules || {});
    const [activeRuleTab, setActiveRuleTab] = useState('beforeDue');
    const [testResult, setTestResult] = useState(null);
    const [saveFeedback, setSaveFeedback] = useState(false);

    if (!isPaymentReminderConfigModalOpen) return null;

    const handleToggleRule = (ruleKey) => {
        setFormRules(prev => ({
            ...prev,
            [ruleKey]: {
                ...prev[ruleKey],
                enabled: !prev[ruleKey]?.enabled
            }
        }));
    };

    const handleUpdateRuleField = (ruleKey, field, value) => {
        setFormRules(prev => ({
            ...prev,
            [ruleKey]: {
                ...prev[ruleKey],
                [field]: value
            }
        }));
    };

    const handleSelectTemplate = (ruleKey, template) => {
        setFormRules(prev => ({
            ...prev,
            [ruleKey]: {
                ...prev[ruleKey],
                templateId: template.id,
                templateName: template.name,
                templateSnapshot: template
            }
        }));
    };

    const currentRule = formRules[activeRuleTab] || {};
    const selectedTemplate = templates.find(t => t.id === currentRule.templateId) || templates[0];

    // Build sample template variables for preview
    const sampleVariableValues = {
        '1': 'Aarav Patel',
        '2': '₹45,000',
        '3': 'INV-2026-8801',
        '4': 'November 30, 2026',
        '5': 'https://pay.crm.io/inv-8801'
    };

    const handleSave = (e) => {
        e.preventDefault();
        updatePaymentRules(formRules);
        setSaveFeedback(true);
        setTimeout(() => {
            setSaveFeedback(false);
            closePaymentReminderConfigModal();
        }, 1200);
    };

    const handleTestRun = () => {
        const result = executeAutomation('auto-004', {
            isTest: true,
            targetRecipient: { name: 'Aarav Patel (Demo Test)', phone: '+91 98765 43210' },
            occurrenceKey: `test-${Date.now()}`,
            customPayload: {
                invoiceNumber: 'INV-DEMO-TEST',
                reminderType: activeRuleTab.toUpperCase(),
                customerName: 'Aarav Patel',
                outstandingAmount: 45000,
                dueDate: '2026-11-30',
                demoPaymentLink: 'https://pay.crm.io/test-inv'
            }
        });

        setTestResult(result?.[0] || { status: 'Success', reason: 'Test message simulation dispatched.' });
        setTimeout(() => setTestResult(null), 5000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
                
                {/* Header */}
                <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#1C1F26]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                Payment Reminder Rules Configuration
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Auto-Cadence
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Configure pre-due, due-date, and overdue automated reminder cadences and settlement receipts.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closePaymentReminderConfigModal}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub-Tabs for the 4 Rules */}
                <div className="flex border-b border-[#2D333B] bg-[#111318] px-4 overflow-x-auto">
                    {[
                        { key: 'beforeDue', label: '1. Before Due Date', icon: Clock, enabled: formRules.beforeDue?.enabled },
                        { key: 'onDue', label: '2. On Due Date', icon: Bell, enabled: formRules.onDue?.enabled },
                        { key: 'overdue', label: '3. Overdue Cadence', icon: AlertTriangle, enabled: formRules.overdue?.enabled },
                        { key: 'paymentReceived', label: '4. Payment Received Receipt', icon: CheckCircle2, enabled: formRules.paymentReceived?.enabled }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeRuleTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveRuleTab(tab.key)}
                                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                                    isActive 
                                        ? 'border-emerald-500 text-white bg-[#16181D]/60' 
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                                {tab.label}
                                <span className={`w-2 h-2 rounded-full ${tab.enabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#16181D]">
                    {saveFeedback && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            Payment reminder configuration saved successfully to active store &amp; localStorage!
                        </div>
                    )}

                    {testResult && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                                <span><strong>Test Simulation:</strong> {testResult.reason || 'Delivered to WhatsApp sandbox.'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Status: {testResult.status}</span>
                        </div>
                    )}

                    {/* Enable / Disable Toggle Bar */}
                    <div className="flex items-center justify-between p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B]">
                        <div>
                            <p className="text-sm font-bold text-white">
                                {activeRuleTab === 'beforeDue' && 'Pre-Due Reminder Notification'}
                                {activeRuleTab === 'onDue' && 'Due Date WhatsApp Reminder'}
                                {activeRuleTab === 'overdue' && 'Recurring Overdue Escalation'}
                                {activeRuleTab === 'paymentReceived' && 'Instant Payment Receipt Confirmation'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {currentRule.enabled ? 'Rule is currently active and will trigger automatically.' : 'Rule is currently disabled.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggleRule(activeRuleTab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                currentRule.enabled 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentRule.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                            {currentRule.enabled ? 'Active / Enabled' : 'Disabled'}
                        </button>
                    </div>

                    {/* Rule-specific controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Offset controls */}
                        {activeRuleTab === 'beforeDue' && (
                            <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2">
                                <label className="text-xs font-medium text-slate-300">Days Before Due Date</label>
                                <div className="flex items-center gap-3">
                                    {[1, 2, 3, 5, 7].map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => handleUpdateRuleField('beforeDue', 'daysOffset', d)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                currentRule.daysOffset === d 
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                    : 'bg-[#111318] text-slate-400 border-[#2D333B] hover:text-white'
                                            }`}
                                        >
                                            {d} {d === 1 ? 'day' : 'days'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeRuleTab === 'overdue' && (
                            <>
                                <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2">
                                    <label className="text-xs font-medium text-slate-300">First Overdue Trigger (Days Past Due)</label>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 5].map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => handleUpdateRuleField('overdue', 'daysOffset', d)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                    currentRule.daysOffset === d 
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                        : 'bg-[#111318] text-slate-400 border-[#2D333B] hover:text-white'
                                                }`}
                                            >
                                                +{d} {d === 1 ? 'day' : 'days'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Recurrence Frequency</label>
                                    <select
                                        value={currentRule.frequency || 'every_3_days'}
                                        onChange={(e) => handleUpdateRuleField('overdue', 'frequency', e.target.value)}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="daily">Daily Cadence</option>
                                        <option value="every_3_days">Every 3 Days (Recommended)</option>
                                        <option value="weekly">Weekly Cadence</option>
                                        <option value="monthly">Monthly Cadence</option>
                                    </select>
                                </div>

                                <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2">
                                    <label className="text-xs font-medium text-slate-300">Maximum Reminder Attempts</label>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 4, 5].map(max => (
                                            <button
                                                key={max}
                                                type="button"
                                                onClick={() => handleUpdateRuleField('overdue', 'maxAttempts', max)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                    currentRule.maxAttempts === max 
                                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                                        : 'bg-[#111318] text-slate-400 border-[#2D333B] hover:text-white'
                                                }`}
                                            >
                                                {max} Max
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeRuleTab !== 'paymentReceived' && (
                            <div className="p-4 bg-[#1C1F26] rounded-xl border border-[#2D333B] space-y-2">
                                <label className="text-xs font-medium text-slate-300">Dispatch Time &amp; Timezone</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="time"
                                        value={currentRule.executionTime || '10:00'}
                                        onChange={(e) => handleUpdateRuleField(activeRuleTab, 'executionTime', e.target.value)}
                                        className="bg-[#111318] border border-[#2D333B] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        disabled
                                        value={currentRule.timezone || 'GMT+5:30 (IST)'}
                                        className="bg-[#111318] border border-[#2D333B] rounded-lg px-3 py-1.5 text-xs text-slate-400"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Template Selection & Preview Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                        {/* Left: Template Selector */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                                <span>Approved WhatsApp Template</span>
                                <span className="text-[10px] text-emerald-400">Cloud API Verified</span>
                            </label>
                            <WhatsAppTemplateSelector
                                selectedTemplateId={currentRule.templateId}
                                onSelectTemplate={(tmpl) => handleSelectTemplate(activeRuleTab, tmpl)}
                                filterCategory="Utility"
                            />
                        </div>

                        {/* Right: Template Preview */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                                <span>Personalized Message Preview</span>
                                <span className="text-[10px] text-slate-400">Simulated Recipient View</span>
                            </label>
                            <div className="bg-[#111318] p-4 rounded-xl border border-[#2D333B]">
                                {selectedTemplate ? (
                                    <WhatsAppTemplatePreview
                                        template={selectedTemplate}
                                        variableValues={sampleVariableValues}
                                    />
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-8">Select a template to preview.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-[#2D333B] bg-[#1C1F26] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleTestRun}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center gap-2"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Simulate Test Run
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={closePaymentReminderConfigModal}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[#111318] border border-[#2D333B] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Save Configuration
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentReminderConfigModal;
