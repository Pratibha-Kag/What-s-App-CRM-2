import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Phone, CheckCircle2, Loader2, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import useWhatsAppStore from '../../store/useWhatsAppStore';
import { toast } from '../ui/Toast';

const WhatsAppConnectModal = () => {
    const { isConnectModalOpen, setIsConnectModalOpen, connectAccount, setAccountStatus } = useWhatsAppStore();
    const [connectMethod, setConnectMethod] = useState('qr'); // 'qr' | 'phone'
    const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
    const [businessName, setBusinessName] = useState('WhatsApp CRM Official');
    const [isConnecting, setIsConnecting] = useState(false);
    const [step, setStep] = useState('idle'); // 'idle' | 'verifying' | 'connected'

    if (!isConnectModalOpen) return null;

    const handleConnect = () => {
        setIsConnecting(true);
        setStep('verifying');
        setAccountStatus('connecting');

        setTimeout(() => {
            setIsConnecting(false);
            setStep('connected');

            setTimeout(() => {
                connectAccount({ businessName, phone: phoneNumber });
                toast.success('WhatsApp Business Account connected successfully!');
                setStep('idle');
            }, 800);
        }, 1600);
    };

    const handleClose = () => {
        if (isConnecting) return;
        setIsConnectModalOpen(false);
        setStep('idle');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-white flex flex-col"
                >
                    {/* Modal Header */}
                    <div className="p-5 border-b border-[#2D333B] flex items-center justify-between bg-[#16181D]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    <path d="M15.4 13.1c-.2-.1-.8-.4-1-.5-.2-.1-.3-.1-.4.1-.1.2-.4.5-.5.6-.1.1-.3.2-.5.1-.2-.1-.6-.2-1.1-.7-.4-.4-.7-.9-.8-1.1-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.8s.8 2.1.9 2.3c.1.1 1.5 2.3 3.7 3.2.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Connect WhatsApp Account</h2>
                                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                    Simulated Integration Sandbox
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isConnecting}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2D333B] transition-colors disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Method Switcher Tabs */}
                    <div className="flex border-b border-[#2D333B] bg-[#111318] px-5 pt-3">
                        <button
                            onClick={() => setConnectMethod('qr')}
                            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                                connectMethod === 'qr'
                                    ? 'border-[#8B5CF6] text-white'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <QrCode size={16} /> QR Code Pair
                        </button>
                        <button
                            onClick={() => setConnectMethod('phone')}
                            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                                connectMethod === 'phone'
                                    ? 'border-[#8B5CF6] text-white'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Phone size={16} /> Phone Number Verification
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-5">
                        {step === 'verifying' ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-[#8B5CF6]/30 border-t-[#8B5CF6] animate-spin flex items-center justify-center"></div>
                                    <Loader2 size={24} className="text-[#8B5CF6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <h3 className="text-base font-bold text-white">Verifying Simulated Handshake...</h3>
                                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                                    Validating Cloud API webhook credentials and registering simulated business phone number.
                                </p>
                            </div>
                        ) : step === 'connected' ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-in zoom-in-75 duration-300">
                                    <CheckCircle2 size={36} />
                                </div>
                                <h3 className="text-base font-bold text-white">Connection Verified!</h3>
                                <p className="text-xs text-emerald-400 font-medium">Ready to send and receive real-time messages.</p>
                            </div>
                        ) : connectMethod === 'qr' ? (
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-slate-700/50 relative group">
                                    {/* Mock QR Code Pattern */}
                                    <div className="w-48 h-48 bg-slate-900 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
                                        <div className="flex justify-between">
                                            <div className="w-12 h-12 bg-white p-1 rounded"><div className="w-full h-full bg-slate-900 rounded-sm"></div></div>
                                            <div className="w-12 h-12 bg-white p-1 rounded"><div className="w-full h-full bg-slate-900 rounded-sm"></div></div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="w-12 h-12 bg-white p-1 rounded"><div className="w-full h-full bg-slate-900 rounded-sm"></div></div>
                                            <div className="flex gap-1">
                                                <div className="w-3 h-3 bg-white rounded-sm"></div>
                                                <div className="w-3 h-3 bg-white rounded-sm"></div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 h-1 bg-[#8B5CF6]/80 blur-xs animate-[bounce_2s_infinite]"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-300 font-semibold">1. Open WhatsApp on your mobile device</p>
                                    <p className="text-xs text-slate-400">2. Tap <span className="text-white font-medium">Linked Devices</span> &gt; <span className="text-white font-medium">Link a Device</span></p>
                                    <p className="text-xs text-slate-400">3. Point your camera at this QR code to connect</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Business Account Name</label>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="e.g. EduCorp WhatsApp Official"
                                        className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">WhatsApp Business Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-[#111318] border border-[#2D333B] focus:border-[#8B5CF6] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                                    />
                                </div>
                                <div className="p-3 bg-[#111318] border border-[#2D333B] rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                                    <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Demo environment: Simulated pairing token will be generated automatically upon connecting.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-5 border-t border-[#2D333B] bg-[#16181D] flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#8B5CF6]" />
                            Demo Sandbox Mode
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClose}
                                disabled={isConnecting}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-[#2D333B] transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConnect}
                                disabled={isConnecting || step === 'connected'}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" /> Connecting...
                                    </>
                                ) : (
                                    'Simulate Connection'
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WhatsAppConnectModal;
