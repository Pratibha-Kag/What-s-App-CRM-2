import React from 'react';
import { CheckCheck, ExternalLink, MessageSquare, Phone } from 'lucide-react';

/**
 * Renders a realistic WhatsApp-style chat message bubble matching the CRM dark theme.
 * Replaces {{1}}, {{2}} with provided sample variable values.
 */
const WhatsAppTemplatePreview = ({ 
    template, 
    customVariables = null,
    showHeader = true,
    className = '' 
}) => {
    if (!template) {
        return (
            <div className="p-8 text-center text-slate-500 text-xs">
                No template selected for preview.
            </div>
        );
    }

    const {
        header,
        body = '',
        footer,
        buttons = [],
        variables = []
    } = template;

    // Build replacement map from customVariables or template.variables
    const varMap = {};
    const effectiveVars = customVariables || variables || [];
    effectiveVars.forEach((v) => {
        if (v && v.key) {
            varMap[v.key] = v.sample || `{{${v.key}}}`;
        }
    });

    // Replace {{1}}, {{2}} with sample values
    const renderedBody = (body || '').replace(/\{\{(\d+)\}\}/g, (match, key) => {
        const val = varMap[key];
        return val ? val : match;
    });

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`w-full max-w-sm mx-auto bg-[#0B141A] rounded-2xl p-4 shadow-xl border border-[#2D333B] relative overflow-hidden ${className}`}>
            {/* Top WhatsApp Chat bar simulation */}
            {showHeader && (
                <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[#202C33] text-xs">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center font-bold">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-white leading-tight text-xs">WhatsApp Business</p>
                        <p className="text-[10px] text-[#25D366]">Official Business Account</p>
                    </div>
                </div>
            )}

            {/* WhatsApp Incoming / Template Message Bubble */}
            <div className="relative bg-[#202C33] text-white rounded-2xl rounded-tl-sm p-3.5 shadow-md border border-[#2A3942] space-y-2">
                {/* Optional Header */}
                {header && header.text && (
                    <div className="font-black text-xs text-slate-100 tracking-tight pb-1 border-b border-[#2A3942]/60">
                        {header.text}
                    </div>
                )}

                {/* Message Body */}
                <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-words font-normal">
                    {renderedBody || <span className="text-slate-500 italic">Enter template body text...</span>}
                </div>

                {/* Optional Footer */}
                {footer && (
                    <div className="text-[10px] text-slate-400 font-medium pt-1">
                        {footer}
                    </div>
                )}

                {/* Timestamp & Double Tick */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                    <span>{currentTime}</span>
                    <CheckCheck size={13} className="text-cyan-400" />
                </div>
            </div>

            {/* Action Buttons (Stacked below bubble) */}
            {buttons && buttons.length > 0 && (
                <div className="mt-1.5 space-y-1">
                    {buttons.map((btn, idx) => (
                        <div
                            key={idx}
                            className="w-full bg-[#202C33] hover:bg-[#2A3942] transition-colors border border-[#2A3942] text-[#00A884] py-2 px-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer select-none"
                        >
                            {btn.type === 'URL' && <ExternalLink size={13} />}
                            {btn.type === 'PHONE_NUMBER' && <Phone size={13} />}
                            {btn.type === 'QUICK_REPLY' && <MessageSquare size={13} />}
                            <span>{btn.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WhatsAppTemplatePreview;
