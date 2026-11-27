import React from 'react';
import { AlertTriangle, GitMerge, SkipForward, UserPlus, X } from 'lucide-react';

const DuplicateReviewModal = ({
    isOpen,
    duplicateMatch,
    incomingLead,
    onMerge,
    onSkip,
    onCreateAnyway,
    onClose,
}) => {
    if (!isOpen || !duplicateMatch || !incomingLead) return null;

    const existing = duplicateMatch.existingLead || duplicateMatch.existingContact;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Duplicate Lead Review"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
                <div className="p-5 sm:p-6 border-b border-[#2D333B] bg-[#16181D] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                Duplicate Lead Detected
                            </h3>
                            <p className="text-xs text-amber-300">
                                Matched existing CRM record by {duplicateMatch.matchedBy}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose || onSkip}
                        aria-label="Close duplicate review"
                        className="h-9 w-9 rounded-xl bg-[#111318] border border-[#2D333B] flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#111318] border border-[#8B5CF6]/30 space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#8B5CF6]/15 text-indigo-300 border border-[#8B5CF6]/25">
                                Incoming Lead ({incomingLead.source || 'Manual'})
                            </span>
                            <p className="text-sm font-bold text-white">{incomingLead.name || 'Unnamed'}</p>
                            <p className="text-xs text-slate-300">Phone: {incomingLead.phone || '—'}</p>
                            <p className="text-xs text-slate-300">Email: {incomingLead.email || '—'}</p>
                            <p className="text-xs text-slate-400">
                                Country: {incomingLead.country || incomingLead.interested_country || '—'}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#111318] border border-amber-500/25 space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                Existing CRM Match ({duplicateMatch.existingLead ? `#${duplicateMatch.existingLead.id}` : 'Contact'})
                            </span>
                            <p className="text-sm font-bold text-white">{existing?.name || 'Existing Record'}</p>
                            <p className="text-xs text-slate-300">Phone: {existing?.phone || '—'}</p>
                            <p className="text-xs text-slate-300">Email: {existing?.email || '—'}</p>
                            <p className="text-xs text-slate-400">
                                Stage / Label: {existing?.stage || existing?.label || 'Active'}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400">
                        Choose how to handle this duplicate: merge updates into the existing record, skip importing this submission, or create a separate lead record anyway.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                        {duplicateMatch.existingLead && (
                            <button
                                type="button"
                                onClick={onMerge}
                                className="flex-1 min-h-[42px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                            >
                                <GitMerge size={15} />
                                <span>Merge</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onSkip}
                            className="flex-1 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#111318] border border-[#2D333B] hover:border-slate-500 text-slate-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                        >
                            <SkipForward size={15} />
                            <span>Skip</span>
                        </button>
                        <button
                            type="button"
                            onClick={onCreateAnyway}
                            className="flex-1 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                        >
                            <UserPlus size={15} />
                            <span>Create Anyway</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuplicateReviewModal;
