import React, { useState } from 'react';
import { 
    X, Play, Sparkles, CheckCircle2, AlertTriangle, 
    Send, ShieldCheck, UserCheck, Eye, RefreshCw
} from 'lucide-react';
import useWhatsAppAutomationStore from '../../../store/useWhatsAppAutomationStore';
import useWhatsAppAudienceStore from '../../../store/useWhatsAppAudienceStore';
import WhatsAppTemplatePreview from '../templates/WhatsAppTemplatePreview';

const AutomationTestRunModal = () => {
    const { 
        isTestModalOpen, 
        automationForTest, 
        closeTestModal, 
        executeAutomation 
    } = useWhatsAppAutomationStore();

    const { audiences } = useWhatsAppAudienceStore();

    const [selectedRecipientId, setSelectedRecipientId] = useState(audiences[0]?.id || '');
    const [customPhone, setCustomPhone] = useState('');
    const [useCustomPhone, setUseCustomPhone] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [testResult, setTestResult] = useState(null);

    if (!isTestModalOpen || !automationForTest) return null;

    const chosenContact = audiences.find(a => a.id === selectedRecipientId) || audiences[0] || {
        name: 'Aarav Patel',
        phone: '+91 98765 43210'
    };

    const targetRecipient = useCustomPhone ? {
        id: 'aud-custom-test',
        name: 'Custom Test Contact',
        phone: customPhone || '+91 98765 43210'
    } : chosenContact;

    const handleRunTest = () => {
        setIsRunning(true);
        setTestResult(null);

        setTimeout(() => {
            const records = executeAutomation(automationForTest.id, {
                isTest: true,
                targetRecipient,
                occurrenceKey: `test-${Date.now()}`
            });

            setIsRunning(false);
            if (records && records.length > 0) {
                setTestResult(records[0]);
            }
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#16181D] border border-[#2D333B] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto text-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold">
                            <Play className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                Test Automation Run
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    Simulated Sandbox
                                </span>
                            </h3>
                            <p className="text-xs text-slate-400">{automationForTest.name}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeTestModal}
                        className="w-8 h-8 rounded-lg bg-[#1C1F26] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5 text-xs">
                    {/* Notice */}
                    <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B] text-slate-400 text-xs">
                        <p>
                            Testing evaluates recipient variable mapping, template approval, and simulated message delivery for 1 recipient without updating recurring counters or live telemetry.
                        </p>
                    </div>

                    {/* Recipient Selection */}
                    <div className="space-y-3">
                        <label className="block font-semibold text-slate-300">Choose Test Recipient</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setUseCustomPhone(false)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    !useCustomPhone 
                                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white' 
                                        : 'bg-[#1C1F26] border-[#2D333B] text-slate-400'
                                }`}
                            >
                                <p className="font-bold">From Shared Audience</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Pick registered CRM contact</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setUseCustomPhone(true)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    useCustomPhone 
                                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white' 
                                        : 'bg-[#1C1F26] border-[#2D333B] text-slate-400'
                                }`}
                            >
                                <p className="font-bold">Custom Phone Number</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Type specific WhatsApp number</p>
                            </button>
                        </div>

                        {!useCustomPhone ? (
                            <div>
                                <select
                                    value={selectedRecipientId}
                                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none"
                                >
                                    {audiences.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} — {a.phone} ({a.group})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={customPhone}
                                    onChange={(e) => setCustomPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] rounded-xl px-3 py-2 text-white outline-none font-mono"
                                />
                            </div>
                        )}
                    </div>

                    {/* Result Banner if already run */}
                    {testResult && (
                        <div className={`p-4 rounded-xl border space-y-2 ${
                            testResult.status === 'Success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1.5">
                                    {testResult.status === 'Success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                                    Test Run Outcome: {testResult.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{testResult.id}</span>
                            </div>
                            <p className="text-[11px]">{testResult.reason}</p>
                            <p className="text-[11px] text-slate-400">
                                Logged in Execution History with <strong className="text-blue-300">[Test Run]</strong> tag.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-[#2D333B] bg-[#111318] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={closeTestModal}
                        className="px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleRunTest}
                        disabled={isRunning}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white transition-all shadow-lg shadow-[#8B5CF6]/20"
                    >
                        {isRunning ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Evaluating Trigger...
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5" />
                                Execute Test Run
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutomationTestRunModal;
