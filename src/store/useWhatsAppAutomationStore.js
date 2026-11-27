import { create } from 'zustand';
import { initialWhatsAppAutomations, initialExecutionHistory, automationPresets } from '../mock/whatsapp/mockWhatsAppAutomations';
import { initialWhatsAppFestivals, prebuiltFestivalPresets } from '../mock/whatsapp/mockWhatsAppFestivals';
import { initialWhatsAppAppointments, initialConnectedSources, simulatedSyncIncomingPool } from '../mock/whatsapp/mockWhatsAppAppointments';
import { initialWhatsAppPayments, initialConnectedPaymentSources, initialPaymentReminderRules, simulatedPaymentSyncIncomingPool } from '../mock/whatsapp/mockWhatsAppPayments';
import useWhatsAppTemplateStore from './useWhatsAppTemplateStore';
import useWhatsAppAudienceStore from './useWhatsAppAudienceStore';
import { calculateUpcomingBirthdayInfo } from '../utils/birthdayUtils';

const AUTOMATIONS_STORAGE_KEY = 'whatsapp_crm_automations_dev1_v1';
const HISTORY_STORAGE_KEY = 'whatsapp_crm_automation_history_dev1_v1';
const FESTIVALS_STORAGE_KEY = 'whatsapp_crm_festivals_dev1_v1';
const APPOINTMENTS_STORAGE_KEY = 'whatsapp_crm_appointments_dev1_v1';
const SOURCES_STORAGE_KEY = 'whatsapp_crm_connected_sources_dev1_v1';
const PAYMENTS_STORAGE_KEY = 'whatsapp_crm_payments_dev1_v1';
const PAYMENT_SOURCES_STORAGE_KEY = 'whatsapp_crm_payment_sources_dev1_v1';
const PAYMENT_RULES_STORAGE_KEY = 'whatsapp_crm_payment_rules_dev1_v1';

const loadPersistedAutomations = () => {
    try {
        const item = localStorage.getItem(AUTOMATIONS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load automations:', err);
    }
    return initialWhatsAppAutomations;
};

const persistAutomations = (automations) => {
    try {
        localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(automations));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist automations:', err);
    }
};

const loadPersistedHistory = () => {
    try {
        const item = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load history:', err);
    }
    return initialExecutionHistory;
};

const persistHistory = (history) => {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist history:', err);
    }
};

const loadPersistedFestivals = () => {
    try {
        const item = localStorage.getItem(FESTIVALS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load festivals:', err);
    }
    return initialWhatsAppFestivals;
};

const persistFestivals = (festivals) => {
    try {
        localStorage.setItem(FESTIVALS_STORAGE_KEY, JSON.stringify(festivals));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist festivals:', err);
    }
};

const loadPersistedAppointments = () => {
    try {
        const item = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load appointments:', err);
    }
    return initialWhatsAppAppointments;
};

const persistAppointments = (appointments) => {
    try {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist appointments:', err);
    }
};

const loadPersistedSources = () => {
    try {
        const item = localStorage.getItem(SOURCES_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load sources:', err);
    }
    return initialConnectedSources;
};

const persistSources = (sources) => {
    try {
        localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist sources:', err);
    }
};

const loadPersistedPayments = () => {
    try {
        const item = localStorage.getItem(PAYMENTS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load payments:', err);
    }
    return initialWhatsAppPayments;
};

const persistPayments = (payments) => {
    try {
        localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist payments:', err);
    }
};

const loadPersistedPaymentSources = () => {
    try {
        const item = localStorage.getItem(PAYMENT_SOURCES_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load payment sources:', err);
    }
    return initialConnectedPaymentSources;
};

const persistPaymentSources = (sources) => {
    try {
        localStorage.setItem(PAYMENT_SOURCES_STORAGE_KEY, JSON.stringify(sources));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist payment sources:', err);
    }
};

const loadPersistedPaymentRules = () => {
    try {
        const item = localStorage.getItem(PAYMENT_RULES_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load payment rules:', err);
    }
    return initialPaymentReminderRules;
};

const persistPaymentRules = (rules) => {
    try {
        localStorage.setItem(PAYMENT_RULES_STORAGE_KEY, JSON.stringify(rules));
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to persist payment rules:', err);
    }
};

const useWhatsAppAutomationStore = create((set, get) => ({
    automations: loadPersistedAutomations(),
    executionHistory: loadPersistedHistory(),
    festivals: loadPersistedFestivals(),
    appointments: loadPersistedAppointments(),
    connectedSources: loadPersistedSources(),
    payments: loadPersistedPayments(),
    paymentSources: loadPersistedPaymentSources(),
    paymentRules: loadPersistedPaymentRules(),
    presets: automationPresets,
    festivalPresets: prebuiltFestivalPresets,

    // Active Dashboard View Tab
    activeTab: 'rules', // 'rules' | 'birthday' | 'festival' | 'appointments' | 'payments' | 'history'
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Payment Filter & UI States
    isPaymentReminderConfigModalOpen: false,
    isPaymentPartialModalOpen: false,
    isPaymentDetailModalOpen: false,
    selectedPaymentForAction: null,
    selectedPaymentForDetail: null,
    paymentSearchQuery: '',
    paymentStatusFilter: 'all', // all | Pending | Partially Paid | Overdue | Paid
    paymentDateFilter: 'all',   // all | today | this_week | overdue | upcoming | paid
    paymentSourceFilter: 'all',
    paymentPage: 1,
    paymentPageSize: 8,

    // Filters for Automations Tab
    searchQuery: '',
    statusFilter: 'All', // 'All' | 'Active' | 'Paused' | 'Draft' | 'Disabled'
    typeFilter: 'All',   // 'All' | 'birthday' | 'festival' | 'appointment_reminder' | etc.
    currentPage: 1,
    pageSize: 6,

    // Filters for Execution History Tab
    historySearchQuery: '',
    historyStatusFilter: 'All', // 'All' | 'Success' | 'Failed' | 'Skipped' | 'Test'
    historyAutomationFilter: 'All',
    historyPage: 1,
    historyPageSize: 8,

    // Festival View State
    festivalYearFilter: '2026',
    setFestivalYearFilter: (year) => set({ festivalYearFilter: year }),
    isFestivalModalOpen: false,
    editingFestival: null,

    // Appointment View State & Filters
    appointmentFilterStatus: 'All', // 'All' | 'Scheduled' | 'Confirmed' | 'Completed' | 'Missed' | 'Rescheduled' | 'Cancelled'
    appointmentFilterSource: 'All',
    appointmentSearchQuery: '',
    appointmentPage: 1,
    appointmentPageSize: 6,

    isRescheduleModalOpen: false,
    appointmentToReschedule: null,

    isAppointmentCancelModalOpen: false,
    appointmentToCancel: null,

    isAppointmentDetailModalOpen: false,
    selectedAppointment: null,

    isReminderConfigModalOpen: false,
    activeReminderRule: null,

    // Appointment Modal Controls
    openRescheduleModal: (appt) => set({ appointmentToReschedule: appt, isRescheduleModalOpen: true }),
    closeRescheduleModal: () => set({ appointmentToReschedule: null, isRescheduleModalOpen: false }),

    openAppointmentCancelModal: (appt) => set({ appointmentToCancel: appt, isAppointmentCancelModalOpen: true }),
    closeAppointmentCancelModal: () => set({ appointmentToCancel: null, isAppointmentCancelModalOpen: false }),

    openAppointmentDetailModal: (appt) => set({ selectedAppointment: appt, isAppointmentDetailModalOpen: true }),
    closeAppointmentDetailModal: () => set({ selectedAppointment: null, isAppointmentDetailModalOpen: false }),

    openReminderConfigModal: (rule = null) => set({ activeReminderRule: rule, isReminderConfigModalOpen: true }),
    closeReminderConfigModal: () => set({ activeReminderRule: null, isReminderConfigModalOpen: false }),

    setAppointmentFilterStatus: (status) => set({ appointmentFilterStatus: status, appointmentPage: 1 }),
    setAppointmentFilterSource: (source) => set({ appointmentFilterSource: source, appointmentPage: 1 }),
    setAppointmentSearchQuery: (query) => set({ appointmentSearchQuery: query, appointmentPage: 1 }),
    setAppointmentPage: (page) => set({ appointmentPage: page }),

    openFestivalModal: (festToEdit = null) => set({
        editingFestival: festToEdit,
        isFestivalModalOpen: true
    }),
    closeFestivalModal: () => set({
        editingFestival: null,
        isFestivalModalOpen: false
    }),

    // Filter Actions
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
    setTypeFilter: (type) => set({ typeFilter: type, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),

    setHistorySearchQuery: (query) => set({ historySearchQuery: query, historyPage: 1 }),
    setHistoryStatusFilter: (status) => set({ historyStatusFilter: status, historyPage: 1 }),
    setHistoryAutomationFilter: (autoId) => set({ historyAutomationFilter: autoId, historyPage: 1 }),
    setHistoryPage: (page) => set({ historyPage: page }),

    // Modal Control States
    isBuilderOpen: false,
    editingAutomation: null,
    selectedPreset: null,

    isDetailsModalOpen: false,
    selectedAutomation: null,

    isDeleteModalOpen: false,
    automationToDelete: null,

    isTestModalOpen: false,
    automationForTest: null,

    isHistoryDetailModalOpen: false,
    selectedHistoryRecord: null,

    // Builder Controls
    openBuilder: (automationToEdit = null, preset = null) => set({
        editingAutomation: automationToEdit,
        selectedPreset: preset,
        isBuilderOpen: true
    }),
    closeBuilder: () => set({
        editingAutomation: null,
        selectedPreset: null,
        isBuilderOpen: false
    }),

    // Details Controls
    openDetailsModal: (automation) => set({
        selectedAutomation: automation,
        isDetailsModalOpen: true
    }),
    closeDetailsModal: () => set({
        selectedAutomation: null,
        isDetailsModalOpen: false
    }),

    // Delete Controls
    openDeleteModal: (automation) => set({
        automationToDelete: automation,
        isDeleteModalOpen: true
    }),
    closeDeleteModal: () => set({
        automationToDelete: null,
        isDeleteModalOpen: false
    }),

    // Test Run Controls
    openTestModal: (automation) => set({
        automationForTest: automation,
        isTestModalOpen: true
    }),
    closeTestModal: () => set({
        automationForTest: null,
        isTestModalOpen: false
    }),

    // History Record Detail Controls
    openHistoryDetailModal: (record) => set({
        selectedHistoryRecord: record,
        isHistoryDetailModalOpen: true
    }),
    closeHistoryDetailModal: () => set({
        selectedHistoryRecord: null,
        isHistoryDetailModalOpen: false
    }),

    // Automation CRUD
    createAutomation: (data) => {
        const newAutomation = {
            id: `auto-${Date.now()}`,
            name: data.name || 'Untitled Automation',
            description: data.description || '',
            type: data.type || 'custom',
            triggerType: data.triggerType || 'SCHEDULE_RECURRING',
            conditions: data.conditions || {},
            audienceConfig: data.audienceConfig || { source: 'CRM_AUDIENCE', group: 'All Contacts' },
            templateId: data.templateId,
            templateName: data.templateName || 'WhatsApp Template',
            templateCategory: data.templateCategory || 'Marketing',
            templateSnapshot: data.templateSnapshot || null,
            variableMappings: data.variableMappings || [],
            schedule: data.schedule || {
                time: '10:00',
                timezone: 'GMT+5:30 (IST)',
                frequency: 'Daily',
                nextExecutionAt: new Date(Date.now() + 86400000).toISOString()
            },
            status: data.status || 'Active',
            stats: {
                totalRuns: 0,
                success: 0,
                failed: 0,
                skipped: 0
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updated = [newAutomation, ...get().automations];
        persistAutomations(updated);
        set({ automations: updated });
        return newAutomation;
    },

    updateAutomation: (id, updates) => {
        const updated = get().automations.map(a => {
            if (a.id === id) {
                return { ...a, ...updates, updatedAt: new Date().toISOString() };
            }
            return a;
        });
        persistAutomations(updated);
        set({ automations: updated });

        if (get().selectedAutomation?.id === id) {
            set({ selectedAutomation: updated.find(a => a.id === id) });
        }
    },

    deleteAutomation: (id) => {
        const updated = get().automations.filter(a => a.id !== id);
        persistAutomations(updated);
        set({ 
            automations: updated,
            isDeleteModalOpen: false,
            automationToDelete: null
        });
    },

    duplicateAutomation: (id) => {
        const target = get().automations.find(a => a.id === id);
        if (!target) return null;

        const clone = {
            ...target,
            id: `auto-${Date.now()}`,
            name: `${target.name} (Copy)`,
            status: 'Draft',
            stats: { totalRuns: 0, success: 0, failed: 0, skipped: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updated = [clone, ...get().automations];
        persistAutomations(updated);
        set({ automations: updated });
        return clone;
    },

    // Lifecycle Status Controls
    enableAutomation: (id) => {
        get().updateAutomation(id, { status: 'Active' });
    },

    disableAutomation: (id) => {
        get().updateAutomation(id, { status: 'Disabled' });
    },

    pauseAutomation: (id) => {
        get().updateAutomation(id, { status: 'Paused' });
    },

    resumeAutomation: (id) => {
        get().updateAutomation(id, { status: 'Active' });
    },

    toggleStatus: (id) => {
        const target = get().automations.find(a => a.id === id);
        if (!target) return;
        const newStatus = target.status === 'Active' ? 'Paused' : 'Active';
        get().updateAutomation(id, { status: newStatus });
    },

    // =========================================================================
    // DUPLICATE MESSAGE PREVENTION MECHANISM (Reusable for Phases 4, 5, 6, 7)
    // =========================================================================
    checkDuplicate: (automationId, recipientPhone, occurrenceKey) => {
        const cleanPhone = (recipientPhone || '').replace(/\D/g, '');
        const duplicateKey = `${automationId}:${cleanPhone}:${occurrenceKey}`;

        const existingRecord = get().executionHistory.find(h => 
            h.duplicateKey === duplicateKey && h.status === 'Success' && !h.isTest
        );

        if (existingRecord) {
            return {
                isDuplicate: true,
                duplicateKey,
                reason: `Duplicate message prevented: already delivered for this occurrence (${occurrenceKey}) at ${new Date(existingRecord.executedAt).toLocaleTimeString()}`
            };
        }

        return {
            isDuplicate: false,
            duplicateKey
        };
    },

    // =========================================================================
    // COMMON EXECUTION SIMULATOR ENGINE (Reusable for Phases 4, 5, 6, 7)
    // =========================================================================
    executeAutomation: (automationId, options = {}) => {
        const {
            isTest = false,
            targetRecipient = null,
            occurrenceKey = new Date().toISOString().split('T')[0],
            customPayload = null
        } = options;

        const automation = get().automations.find(a => a.id === automationId);
        if (!automation) return [];

        if (!isTest && (automation.status === 'Paused' || automation.status === 'Disabled')) {
            console.warn(`[Automation Engine] Automation ${automationId} is ${automation.status}. Skipping execution.`);
            return [];
        }

        const templateStore = useWhatsAppTemplateStore.getState();
        const activeTemplate = templateStore.templates.find(t => t.id === automation.templateId);
        const isTemplateValid = activeTemplate && activeTemplate.status === 'Approved';

        let recipientsToProcess = [];
        if (targetRecipient) {
            recipientsToProcess = [targetRecipient];
        } else {
            const audienceStore = useWhatsAppAudienceStore.getState();
            const groupName = automation.audienceConfig?.group || 'All Contacts';
            if (groupName === 'All Contacts') {
                recipientsToProcess = audienceStore.audiences;
            } else {
                recipientsToProcess = audienceStore.audiences.filter(a => a.group === groupName);
            }
        }

        if (recipientsToProcess.length === 0) {
            recipientsToProcess = [{
                id: 'aud-fallback',
                name: 'Sample Applicant',
                phone: '+91 98765 43210'
            }];
        }

        const newRecords = [];
        let successCount = 0;
        let failedCount = 0;
        let skippedCount = 0;

        recipientsToProcess.forEach((recipient, idx) => {
            const recipientPhone = recipient.phone || '';
            const recipientName = recipient.name || `Applicant ${idx + 1}`;

            const duplicateCheck = get().checkDuplicate(automation.id, recipientPhone, occurrenceKey);

            let status = 'Success';
            let reason = isTest ? 'Simulated Test Execution completed successfully' : 'Delivered to recipient via WhatsApp sandbox';

            if (!isTemplateValid) {
                status = 'Failed';
                reason = 'Automation template is unapproved, modified, or not found in template registry';
                failedCount++;
            } else if (!isTest && duplicateCheck.isDuplicate) {
                status = 'Skipped';
                reason = duplicateCheck.reason;
                skippedCount++;
            } else if (recipientPhone.includes('000') || recipientPhone.replace(/\D/g, '').length < 7) {
                status = 'Failed';
                reason = 'WhatsApp phone number format is invalid or unreachable';
                failedCount++;
            } else {
                successCount++;
            }

            const record = {
                id: `exec-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
                automationId: automation.id,
                automationName: automation.name,
                triggerType: automation.triggerType,
                recipientName,
                recipientPhone,
                templateName: automation.templateName,
                templateSnapshot: automation.templateSnapshot || { body: 'Standard automated message template.' },
                status,
                reason,
                executedAt: new Date().toISOString(),
                isTest: Boolean(isTest),
                duplicateKey: isTest ? `test:${automation.id}:${recipientPhone}:${Date.now()}` : duplicateCheck.duplicateKey,
                payload: customPayload || null
            };

            newRecords.push(record);
        });

        if (!isTest) {
            const currentStats = automation.stats || { totalRuns: 0, success: 0, failed: 0, skipped: 0 };
            get().updateAutomation(automation.id, {
                stats: {
                    totalRuns: currentStats.totalRuns + newRecords.length,
                    success: currentStats.success + successCount,
                    failed: currentStats.failed + failedCount,
                    skipped: currentStats.skipped + skippedCount
                }
            });
        }

        const updatedHistory = [...newRecords, ...get().executionHistory];
        persistHistory(updatedHistory);
        set({ executionHistory: updatedHistory });

        return newRecords;
    },

    // =========================================================================
    // DEDICATED PHASE 5 BIRTHDAY AUTOMATION BATCH SIMULATOR
    // =========================================================================
    executeTodayBirthdayBroadcast: (refDate = new Date()) => {
        const audienceStore = useWhatsAppAudienceStore.getState();
        const birthdayRule = get().automations.find(a => a.type === 'birthday') || get().automations[0];
        if (!birthdayRule) return { processed: 0, success: 0, skipped: 0, failed: 0 };

        const todayKey = refDate.toISOString().split('T')[0];

        const eligibleContacts = audienceStore.audiences.filter(c => {
            const info = calculateUpcomingBirthdayInfo(c.dob, refDate);
            return info.isValid && info.isToday;
        });

        if (eligibleContacts.length === 0) {
            return { processed: 0, success: 0, skipped: 0, failed: 0, message: 'No contacts celebrate a birthday today.' };
        }

        let successCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        const generatedRecords = [];

        eligibleContacts.forEach(contact => {
            const results = get().executeAutomation(birthdayRule.id, {
                isTest: false,
                targetRecipient: contact,
                occurrenceKey: todayKey,
                customPayload: { event: 'birthday', birthDate: contact.dob }
            });

            if (results && results.length > 0) {
                generatedRecords.push(results[0]);
                if (results[0].status === 'Success') successCount++;
                else if (results[0].status === 'Skipped') skippedCount++;
                else failedCount++;
            }
        });

        return {
            processed: eligibleContacts.length,
            success: successCount,
            skipped: skippedCount,
            failed: failedCount,
            records: generatedRecords
        };
    },

    // =========================================================================
    // DEDICATED PHASE 5 FESTIVAL CAMPAIGN ENGINE
    // =========================================================================
    createFestivalCampaign: (data) => {
        const newFestival = {
            id: `fest-${Date.now()}`,
            name: data.name || 'Untitled Festival Broadcast',
            festivalId: data.festivalId || 'custom',
            festivalName: data.festivalName || 'Seasonal Festival',
            year: data.year || '2026',
            celebrationDate: data.celebrationDate || '2026-11-08',
            audienceGroup: data.audienceGroup || 'All Contacts',
            totalRecipients: data.totalRecipients || 16,
            templateId: data.templateId || 'tpl-108',
            templateName: data.templateName || 'festival_greetings',
            templateCategory: 'Marketing',
            templateSnapshot: data.templateSnapshot || null,
            variableMappings: data.variableMappings || [],
            scheduledTime: data.scheduledTime || '09:00',
            timezone: data.timezone || 'GMT+5:30 (IST)',
            status: data.status || 'Scheduled',
            stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
            sentAt: null,
            createdAt: new Date().toISOString()
        };

        const updated = [newFestival, ...get().festivals];
        persistFestivals(updated);
        set({ festivals: updated, isFestivalModalOpen: false, editingFestival: null });
        return newFestival;
    },

    updateFestivalCampaign: (id, updates) => {
        const updated = get().festivals.map(f => {
            if (f.id === id) {
                return { ...f, ...updates, updatedAt: new Date().toISOString() };
            }
            return f;
        });
        persistFestivals(updated);
        set({ festivals: updated, isFestivalModalOpen: false, editingFestival: null });
    },

    deleteFestivalCampaign: (id) => {
        const updated = get().festivals.filter(f => f.id !== id);
        persistFestivals(updated);
        set({ festivals: updated });
    },

    duplicateFestivalCampaign: (id) => {
        const target = get().festivals.find(f => f.id === id);
        if (!target) return null;

        const clone = {
            ...target,
            id: `fest-${Date.now()}`,
            name: `${target.name} (Copy)`,
            status: 'Draft',
            sentAt: null,
            stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
            createdAt: new Date().toISOString()
        };

        const updated = [clone, ...get().festivals];
        persistFestivals(updated);
        set({ festivals: updated });
        return clone;
    },

    sendFestivalNow: (id) => {
        const target = get().festivals.find(f => f.id === id);
        if (!target) return;

        const audienceStore = useWhatsAppAudienceStore.getState();
        const group = target.audienceGroup || 'All Contacts';
        const recipients = group === 'All Contacts'
            ? audienceStore.audiences
            : audienceStore.audiences.filter(a => a.group === group);

        const total = recipients.length || 12;
        const occurrenceKey = `${target.id}:${target.year}:${target.celebrationDate}`;

        const records = [];
        let success = 0;
        let failed = 0;

        recipients.forEach((r, idx) => {
            const isInvalid = r.phone?.includes('000') || (r.phone?.replace(/\D/g, '').length < 7);
            const status = isInvalid ? 'Failed' : 'Success';
            const reason = isInvalid ? 'Invalid phone number format' : 'Delivered via festival broadcast sandbox';

            if (status === 'Success') success++;
            else failed++;

            records.push({
                id: `exec-fest-${Date.now()}-${idx}`,
                automationId: target.id,
                automationName: target.name,
                triggerType: 'SCHEDULE_ONCE',
                recipientName: r.name,
                recipientPhone: r.phone,
                templateName: target.templateName,
                templateSnapshot: target.templateSnapshot || { body: `Happy ${target.festivalName}!` },
                status,
                reason,
                executedAt: new Date().toISOString(),
                isTest: false,
                duplicateKey: `${target.id}:${r.phone}:${occurrenceKey}`
            });
        });

        get().updateFestivalCampaign(id, {
            status: 'Completed',
            sentAt: new Date().toISOString(),
            totalRecipients: total,
            stats: {
                sent: total,
                delivered: success,
                read: Math.max(0, Math.round(success * 0.85)),
                failed
            }
        });

        const updatedHistory = [...records, ...get().executionHistory];
        persistHistory(updatedHistory);
        set({ executionHistory: updatedHistory });
    },

    updateFestivalDate: (presetId, year, newDate) => {
        const updatedPresets = get().festivalPresets.map(p => {
            if (p.id === presetId) {
                return {
                    ...p,
                    yearlyDates: { ...p.yearlyDates, [year]: newDate }
                };
            }
            return p;
        });
        set({ festivalPresets: updatedPresets });
    },

    // =========================================================================
    // DEDICATED PHASE 6 APPOINTMENT AUTOMATION & WORKFLOW ENGINE
    // =========================================================================
    confirmAppointment: (id) => {
        const updated = get().appointments.map(a => {
            if (a.id === id) {
                return { ...a, status: 'Confirmed', updatedAt: new Date().toISOString() };
            }
            return a;
        });
        persistAppointments(updated);
        set({ appointments: updated });
    },

    completeAppointment: (id) => {
        const updated = get().appointments.map(a => {
            if (a.id === id) {
                return { 
                    ...a, 
                    status: 'Completed', 
                    reminderStatus: 'Completed (Reminders Stopped)',
                    updatedAt: new Date().toISOString() 
                };
            }
            return a;
        });
        persistAppointments(updated);
        set({ appointments: updated });
    },

    markAppointmentMissed: (id) => {
        const target = get().appointments.find(a => a.id === id);
        if (!target) return;

        const updated = get().appointments.map(a => {
            if (a.id === id) {
                return { 
                    ...a, 
                    status: 'Missed', 
                    reminderStatus: 'Follow-up Dispatched',
                    updatedAt: new Date().toISOString() 
                };
            }
            return a;
        });
        persistAppointments(updated);
        set({ appointments: updated });

        // Trigger crm.appointment_status_missed event
        get().triggerEvent('crm.appointment_status_missed', {
            appointmentId: id,
            recipient: { name: target.customerName, phone: target.phone },
            appointmentType: target.appointmentType,
            counselorName: target.counselorName,
            scheduledDate: target.scheduledDate
        });
    },

    rescheduleAppointment: (id, newDate, newTime, reason = '') => {
        const target = get().appointments.find(a => a.id === id);
        if (!target) return;

        const previousDate = target.scheduledDate;
        const previousTime = target.scheduledTime;

        const updated = get().appointments.map(a => {
            if (a.id === id) {
                return { 
                    ...a, 
                    status: 'Rescheduled', 
                    previousDate,
                    previousTime,
                    scheduledDate: newDate,
                    scheduledTime: newTime,
                    reminderStatus: 'Reschedule Notice Sent',
                    rescheduleReason: reason,
                    updatedAt: new Date().toISOString() 
                };
            }
            return a;
        });
        persistAppointments(updated);
        set({ 
            appointments: updated,
            isRescheduleModalOpen: false,
            appointmentToReschedule: null
        });

        // Trigger crm.appointment_rescheduled event
        get().triggerEvent('crm.appointment_rescheduled', {
            appointmentId: id,
            recipient: { name: target.customerName, phone: target.phone },
            appointmentType: target.appointmentType,
            counselorName: target.counselorName,
            previousDate,
            previousTime,
            newDate,
            newTime,
            reason
        });
    },

    cancelAppointment: (id, reason = '') => {
        const target = get().appointments.find(a => a.id === id);
        if (!target) return;

        const updated = get().appointments.map(a => {
            if (a.id === id) {
                return { 
                    ...a, 
                    status: 'Cancelled', 
                    reminderStatus: 'Cancellation Dispatched',
                    cancellationReason: reason,
                    updatedAt: new Date().toISOString() 
                };
            }
            return a;
        });
        persistAppointments(updated);
        set({ 
            appointments: updated,
            isAppointmentCancelModalOpen: false,
            appointmentToCancel: null
        });

        // Trigger crm.appointment_cancelled event
        get().triggerEvent('crm.appointment_cancelled', {
            appointmentId: id,
            recipient: { name: target.customerName, phone: target.phone },
            appointmentType: target.appointmentType,
            counselorName: target.counselorName,
            cancellationReason: reason,
            scheduledDate: target.scheduledDate
        });
    },

    sendAppointmentReminder: (appointmentId, reminderType = '1_DAY_BEFORE') => {
        const appt = get().appointments.find(a => a.id === appointmentId);
        if (!appt) return null;

        // Disallow reminders for Completed or Cancelled appointments
        if (appt.status === 'Completed' || appt.status === 'Cancelled') {
            return { status: 'Skipped', reason: 'Appointment is already completed or cancelled; reminder obsolete.' };
        }

        const rule = get().automations.find(a => a.type === 'appointment_reminder') || get().automations[0];
        const occurrenceKey = `${appt.id}_${reminderType}`;

        const records = get().executeAutomation(rule.id, {
            isTest: false,
            targetRecipient: { name: appt.customerName, phone: appt.phone },
            occurrenceKey,
            customPayload: {
                appointmentId: appt.id,
                reminderType,
                scheduledDate: appt.scheduledDate,
                scheduledTime: appt.scheduledTime,
                appointmentType: appt.appointmentType,
                counselorName: appt.counselorName
            }
        });

        const statusLabel = reminderType === '1_DAY_BEFORE' ? '1-Day Sent' : 'Same-Day Sent';
        const updated = get().appointments.map(a => {
            if (a.id === appointmentId) {
                return {
                    ...a,
                    reminderStatus: statusLabel,
                    remindersSent: [
                        ...a.remindersSent,
                        { type: reminderType, sentAt: new Date().toISOString(), status: 'Success' }
                    ],
                    updatedAt: new Date().toISOString()
                };
            }
            return a;
        });
        persistAppointments(updated);
        set({ appointments: updated });

        return records?.[0] || null;
    },

    simulateDataSync: () => {
        const currentAppointments = get().appointments;
        const existingIds = new Set(currentAppointments.map(a => a.id));

        const incoming = simulatedSyncIncomingPool.filter(a => !existingIds.has(a.id));
        const updatedAppointments = [...incoming, ...currentAppointments];
        persistAppointments(updatedAppointments);

        const now = new Date().toISOString();
        const updatedSources = get().connectedSources.map(s => ({
            ...s,
            lastSyncedAt: now,
            recordsCount: s.recordsCount + (s.id === 'calendly' ? 1 : s.id === 'hubspot' ? 1 : 0)
        }));
        persistSources(updatedSources);

        set({
            appointments: updatedAppointments,
            connectedSources: updatedSources
        });

        return {
            syncedCount: incoming.length,
            sourcesUpdated: updatedSources.length
        };
    },

    getAppointmentStats: () => {
        const appointments = get().appointments;
        const total = appointments.length;

        const todayDate = new Date().toISOString().split('T')[0];
        const today = appointments.filter(a => a.scheduledDate === todayDate).length;
        const upcoming = appointments.filter(a => a.scheduledDate >= todayDate && ['Scheduled', 'Confirmed', 'Rescheduled'].includes(a.status)).length;
        const completed = appointments.filter(a => a.status === 'Completed').length;
        const missed = appointments.filter(a => a.status === 'Missed').length;
        const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

        let remindersSent = 0;
        appointments.forEach(a => {
            remindersSent += (a.remindersSent?.length || 0);
        });

        return {
            total,
            today,
            upcoming,
            completed,
            missed,
            cancelled,
            remindersSent
        };
    },

    // =========================================================================
    // DEDICATED PHASE 7 PAYMENT REMINDER AUTOMATION WORKFLOWS
    // =========================================================================
    setPaymentSearchQuery: (query) => set({ paymentSearchQuery: query, paymentPage: 1 }),
    setPaymentStatusFilter: (status) => set({ paymentStatusFilter: status, paymentPage: 1 }),
    setPaymentDateFilter: (filter) => set({ paymentDateFilter: filter, paymentPage: 1 }),
    setPaymentSourceFilter: (source) => set({ paymentSourceFilter: source, paymentPage: 1 }),
    setPaymentPage: (page) => set({ paymentPage: page }),

    openPaymentReminderConfigModal: () => set({ isPaymentReminderConfigModalOpen: true }),
    closePaymentReminderConfigModal: () => set({ isPaymentReminderConfigModalOpen: false }),
    openPaymentPartialModal: (payment) => set({ isPaymentPartialModalOpen: true, selectedPaymentForAction: payment }),
    closePaymentPartialModal: () => set({ isPaymentPartialModalOpen: false, selectedPaymentForAction: null }),
    openPaymentDetailModal: (payment) => set({ isPaymentDetailModalOpen: true, selectedPaymentForDetail: payment }),
    closePaymentDetailModal: () => set({ isPaymentDetailModalOpen: false, selectedPaymentForDetail: null }),

    updatePaymentRules: (rules) => {
        persistPaymentRules(rules);
        set({ paymentRules: rules, isPaymentReminderConfigModalOpen: false });
    },

    simulatePaymentDataSync: () => {
        const currentPayments = get().payments;
        const existingInvoiceNumbers = new Set(currentPayments.map(p => p.invoiceNumber));

        const incoming = simulatedPaymentSyncIncomingPool.filter(p => !existingInvoiceNumbers.has(p.invoiceNumber));
        const updatedPayments = [...incoming, ...currentPayments];
        persistPayments(updatedPayments);

        const now = new Date().toISOString();
        const updatedSources = get().paymentSources.map(s => ({
            ...s,
            lastSyncedAt: now,
            recordsCount: s.recordsCount + (s.id === 'quickbooks' ? 1 : s.id === 'zoho' ? 1 : s.id === 'razorpay' ? 1 : 0)
        }));
        persistPaymentSources(updatedSources);

        set({
            payments: updatedPayments,
            paymentSources: updatedSources
        });

        return {
            syncedCount: incoming.length,
            sourcesUpdated: updatedSources.length
        };
    },

    simulatePartialPayment: (invoiceId, amount, paymentMethod = 'UPI / GPay', referenceNote = '') => {
        const target = get().payments.find(p => p.id === invoiceId);
        if (!target) return { status: 'error', message: 'Invoice not found' };

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return { status: 'error', message: 'Invalid payment amount' };
        }

        if (numAmount > target.outstandingAmount) {
            return { 
                status: 'error', 
                message: `Payment amount (₹${numAmount.toLocaleString('en-IN')}) exceeds current outstanding balance (₹${target.outstandingAmount.toLocaleString('en-IN')})` 
            };
        }

        const newPaidAmount = Math.min(target.totalAmount, (target.paidAmount || 0) + numAmount);
        const newOutstanding = Math.max(0, target.totalAmount - newPaidAmount);
        const isNowPaid = newOutstanding === 0;
        const newStatus = isNowPaid ? 'Paid' : 'Partially Paid';
        const newReminderStatus = isNowPaid ? 'Completed (All Halted)' : target.reminderStatus;

        const newPaymentRecord = {
            id: `tx-${Date.now()}`,
            amount: numAmount,
            paymentMethod,
            referenceNote: referenceNote || 'Partial payment received',
            paidAt: new Date().toISOString()
        };

        const updated = get().payments.map(p => {
            if (p.id === invoiceId) {
                return {
                    ...p,
                    paidAmount: newPaidAmount,
                    outstandingAmount: newOutstanding,
                    status: newStatus,
                    reminderStatus: newReminderStatus,
                    nextReminderAt: isNowPaid ? null : p.nextReminderAt,
                    paymentsHistory: [newPaymentRecord, ...(p.paymentsHistory || [])],
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        });

        persistPayments(updated);
        set({
            payments: updated,
            isPaymentPartialModalOpen: false,
            selectedPaymentForAction: null
        });

        if (isNowPaid && get().paymentRules?.paymentReceived?.enabled) {
            get().triggerEvent('crm.payment_received', {
                invoiceId: target.invoiceNumber,
                recipient: { name: target.customerName, phone: target.phone },
                customerName: target.customerName,
                totalAmount: target.totalAmount,
                amountPaid: numAmount,
                referenceId: newPaymentRecord.id
            });
        }

        return {
            status: 'success',
            invoice: updated.find(p => p.id === invoiceId)
        };
    },

    simulateFullPayment: (invoiceId, paymentMethod = 'Bank Transfer (NEFT)', referenceNote = 'Settled in full') => {
        const target = get().payments.find(p => p.id === invoiceId);
        if (!target) return { status: 'error', message: 'Invoice not found' };

        const remainingBalance = target.outstandingAmount;
        if (remainingBalance <= 0 || target.status === 'Paid') {
            return { status: 'error', message: 'Invoice is already fully settled' };
        }

        const newPaymentRecord = {
            id: `tx-${Date.now()}`,
            amount: remainingBalance,
            paymentMethod,
            referenceNote: referenceNote || 'Full settlement',
            paidAt: new Date().toISOString()
        };

        const updated = get().payments.map(p => {
            if (p.id === invoiceId) {
                return {
                    ...p,
                    paidAmount: p.totalAmount,
                    outstandingAmount: 0,
                    status: 'Paid',
                    reminderStatus: 'Completed (All Halted)',
                    nextReminderAt: null,
                    paymentsHistory: [newPaymentRecord, ...(p.paymentsHistory || [])],
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        });

        persistPayments(updated);
        set({
            payments: updated,
            isPaymentPartialModalOpen: false,
            selectedPaymentForAction: null
        });

        if (get().paymentRules?.paymentReceived?.enabled) {
            get().triggerEvent('crm.payment_received', {
                invoiceId: target.invoiceNumber,
                recipient: { name: target.customerName, phone: target.phone },
                customerName: target.customerName,
                totalAmount: target.totalAmount,
                amountPaid: remainingBalance,
                referenceId: newPaymentRecord.id
            });
        }

        return {
            status: 'success',
            invoice: updated.find(p => p.id === invoiceId)
        };
    },

    sendPaymentReminder: (invoiceId, reminderType = 'MANUAL') => {
        const inv = get().payments.find(p => p.id === invoiceId);
        if (!inv) return null;

        if (inv.status === 'Paid' || inv.outstandingAmount <= 0) {
            return {
                status: 'Skipped',
                reason: 'Invoice is already settled in full. All future reminders are halted.'
            };
        }

        const nextCount = (inv.reminderCount || 0) + 1;
        const occurrenceKey = `${inv.invoiceNumber}_${reminderType}_occ${nextCount}`;

        const rule = get().automations.find(a => a.type === 'payment_reminder') || get().automations[0];

        const records = get().executeAutomation(rule.id, {
            isTest: false,
            targetRecipient: { name: inv.customerName, phone: inv.phone },
            occurrenceKey,
            customPayload: {
                invoiceNumber: inv.invoiceNumber,
                reminderType,
                occurrenceCount: nextCount,
                customerName: inv.customerName,
                totalAmount: inv.totalAmount,
                paidAmount: inv.paidAmount,
                outstandingAmount: inv.outstandingAmount,
                currency: inv.currencySymbol || '₹',
                dueDate: inv.dueDate,
                demoPaymentLink: inv.demoPaymentLink
            }
        });

        const statusLabel = `Sent (${nextCount})`;
        const updated = get().payments.map(p => {
            if (p.id === invoiceId) {
                return {
                    ...p,
                    reminderStatus: statusLabel,
                    reminderCount: nextCount,
                    lastReminderAt: new Date().toISOString(),
                    remindersSent: [
                        {
                            id: `rem-${Date.now()}`,
                            type: reminderType,
                            sentAt: new Date().toISOString(),
                            status: 'Success',
                            amountSnap: inv.outstandingAmount
                        },
                        ...(p.remindersSent || [])
                    ],
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        });

        persistPayments(updated);
        set({ payments: updated });

        return records?.[0] || null;
    },

    getPaymentStats: () => {
        const payments = get().payments || [];
        const totalOutstanding = payments.reduce((acc, p) => p.status !== 'Paid' ? acc + (p.outstandingAmount || 0) : acc, 0);
        const pendingCount = payments.filter(p => p.status === 'Pending').length;
        const overdueCount = payments.filter(p => p.status === 'Overdue').length;
        const partiallyPaidCount = payments.filter(p => p.status === 'Partially Paid').length;
        const paidCount = payments.filter(p => p.status === 'Paid').length;

        const rules = get().paymentRules || {};
        let activeRules = 0;
        if (rules.beforeDue?.enabled) activeRules++;
        if (rules.onDue?.enabled) activeRules++;
        if (rules.overdue?.enabled) activeRules++;
        if (rules.paymentReceived?.enabled) activeRules++;

        let remindersSent = 0;
        payments.forEach(p => {
            remindersSent += (p.remindersSent?.length || 0);
        });

        const upcomingReminders = payments.filter(p => p.status !== 'Paid' && p.nextReminderAt).length;

        return {
            totalOutstanding,
            pendingCount,
            overdueCount,
            partiallyPaidCount,
            paidCount,
            activeRules,
            remindersSent,
            upcomingReminders
        };
    },

    resetPaymentDemoData: () => {
        persistPayments(initialWhatsAppPayments);
        persistPaymentSources(initialConnectedPaymentSources);
        persistPaymentRules(initialPaymentReminderRules);
        set({
            payments: initialWhatsAppPayments,
            paymentSources: initialConnectedPaymentSources,
            paymentRules: initialPaymentReminderRules,
            paymentPage: 1
        });
    },

    // =========================================================================
    // REUSABLE EXTERNAL TRIGGER HANDLER FOR PHASES 5, 6, 7
    // =========================================================================
    triggerEvent: (eventCode, payload = {}) => {
        const matchingAutomations = get().automations.filter(a => 
            a.status === 'Active' && 
            a.triggerType === 'EXTERNAL_EVENT' && 
            a.conditions?.eventCode === eventCode
        );

        let totalGenerated = [];
        matchingAutomations.forEach(auto => {
            const records = get().executeAutomation(auto.id, {
                isTest: false,
                targetRecipient: payload.recipient || null,
                occurrenceKey: payload.invoiceId ? `${payload.invoiceId}:${eventCode}` : payload.appointmentId ? `${payload.appointmentId}:${eventCode}` : `event-${Date.now()}`,
                customPayload: payload
            });
            totalGenerated = [...totalGenerated, ...records];
        });

        return totalGenerated;
    },

    getAutomationsByType: (type) => {
        return get().automations.filter(a => a.type === type);
    },

    clearExecutionHistory: () => {
        persistHistory([]);
        set({ executionHistory: [], historyPage: 1 });
    },

    // Aggregated Metrics for Automation Dashboard
    getOverallStats: () => {
        const automations = get().automations;
        const history = get().executionHistory;

        const totalAutomations = automations.length;
        const activeAutomations = automations.filter(a => a.status === 'Active').length;
        const pausedAutomations = automations.filter(a => a.status === 'Paused').length;
        const scheduledExecutions = automations.filter(a => ['Active', 'Draft'].includes(a.status) && a.schedule?.nextExecutionAt).length;

        const successfulExecutions = history.filter(h => h.status === 'Success' && !h.isTest).length;
        const failedExecutions = history.filter(h => h.status === 'Failed').length;
        const skippedExecutions = history.filter(h => h.status === 'Skipped').length;
        const testExecutions = history.filter(h => h.isTest).length;

        return {
            totalAutomations,
            activeAutomations,
            pausedAutomations,
            scheduledExecutions,
            successfulExecutions,
            failedExecutions,
            skippedExecutions,
            testExecutions
        };
    }
}));

export default useWhatsAppAutomationStore;
