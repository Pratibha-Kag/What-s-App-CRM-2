import { create } from 'zustand';
import { initialWhatsAppAutomations, initialExecutionHistory, automationPresets } from '../mock/whatsapp/mockWhatsAppAutomations';
import useWhatsAppTemplateStore from './useWhatsAppTemplateStore';
import useWhatsAppAudienceStore from './useWhatsAppAudienceStore';

const AUTOMATIONS_STORAGE_KEY = 'whatsapp_crm_automations_dev1_v1';
const HISTORY_STORAGE_KEY = 'whatsapp_crm_automation_history_dev1_v1';

const loadPersistedAutomations = () => {
    try {
        const item = localStorage.getItem(AUTOMATIONS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load automations from localStorage:', err);
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
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('[WhatsApp Automations Store] Failed to load history from localStorage:', err);
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

const useWhatsAppAutomationStore = create((set, get) => ({
    automations: loadPersistedAutomations(),
    executionHistory: loadPersistedHistory(),
    presets: automationPresets,

    // Active Dashboard View Tab
    activeTab: 'automations', // 'automations' | 'history'
    setActiveTab: (tab) => set({ activeTab: tab }),

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
    /**
     * Checks if a message for this automation, recipient, and occurrence has already been delivered.
     * Prevents sending duplicate messages for the same annual birthday, event milestone, or schedule.
     */
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
    /**
     * Reusable simulation method:
     * - Validates automation status and template approval
     * - Evaluates recipient eligibility
     * - Checks duplicate prevention
     * - Simulates delivery and records telemetry
     */
    executeAutomation: (automationId, options = {}) => {
        const {
            isTest = false,
            targetRecipient = null,
            occurrenceKey = new Date().toISOString().split('T')[0], // Default occurrence: today's date YYYY-MM-DD
            customPayload = null
        } = options;

        const automation = get().automations.find(a => a.id === automationId);
        if (!automation) return [];

        // Paused or Disabled automations cannot run live triggers
        if (!isTest && (automation.status === 'Paused' || automation.status === 'Disabled')) {
            console.warn(`[Automation Engine] Automation ${automationId} is ${automation.status}. Skipping execution.`);
            return [];
        }

        // Validate template approval from template store
        const templateStore = useWhatsAppTemplateStore.getState();
        const activeTemplate = templateStore.templates.find(t => t.id === automation.templateId);
        const isTemplateValid = activeTemplate && activeTemplate.status === 'Approved';

        // Determine target recipient list
        let recipientsToProcess = [];
        if (targetRecipient) {
            recipientsToProcess = [targetRecipient];
        } else {
            // Retrieve from shared audience store
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

            // Check Duplicate Prevention
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

        // Update automation telemetry stats (only for non-test live runs)
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

        // Prepend new records to execution history
        const updatedHistory = [...newRecords, ...get().executionHistory];
        persistHistory(updatedHistory);
        set({ executionHistory: updatedHistory });

        return newRecords;
    },

    // =========================================================================
    // REUSABLE EXTERNAL TRIGGER HANDLER FOR PHASES 5, 6, 7
    // =========================================================================
    /**
     * Call this from Birthday, Festival, Appointment, or Invoicing events
     * e.g. triggerEvent('crm.appointment_rescheduled', { appointment_id: 'appt-123', recipient: contact })
     */
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
                occurrenceKey: payload.eventId || `event-${Date.now()}`,
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
