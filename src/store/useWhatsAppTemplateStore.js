import { create } from 'zustand';
import { initialWhatsAppTemplates } from '../mock/whatsapp/mockWhatsAppTemplates';

const TEMPLATES_STORAGE_KEY = 'whatsapp_crm_templates_dev1_v1';

const loadPersistedTemplates = () => {
    try {
        const item = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('[WhatsApp Templates Store] Failed to load localStorage:', err);
    }
    return initialWhatsAppTemplates;
};

const persistTemplates = (templates) => {
    try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (err) {
        console.warn('[WhatsApp Templates Store] Failed to persist templates:', err);
    }
};

const useWhatsAppTemplateStore = create((set, get) => ({
    templates: loadPersistedTemplates(),
    selectedTemplate: null,
    searchQuery: '',
    categoryFilter: 'All', // 'All' | 'Marketing' | 'Utility' | 'Authentication'
    statusFilter: 'All',     // 'All' | 'Approved' | 'Pending' | 'Draft' | 'Rejected'
    isCreateModalOpen: false,
    isPreviewModalOpen: false,
    isDeleteModalOpen: false,
    templateToDelete: null,
    editingTemplate: null,

    // Filter & Search Actions
    setSearchQuery: (query) => set({ searchQuery: query }),
    setCategoryFilter: (category) => set({ categoryFilter: category }),
    setStatusFilter: (status) => set({ statusFilter: status }),

    // Modal Control Actions
    openCreateModal: (templateToEdit = null) => set({ 
        editingTemplate: templateToEdit, 
        isCreateModalOpen: true 
    }),
    closeCreateModal: () => set({ 
        isCreateModalOpen: false, 
        editingTemplate: null 
    }),

    openPreviewModal: (template) => set({ 
        selectedTemplate: template, 
        isPreviewModalOpen: true 
    }),
    closePreviewModal: () => set({ 
        isPreviewModalOpen: false, 
        selectedTemplate: null 
    }),

    openDeleteModal: (template) => set({ 
        templateToDelete: template, 
        isDeleteModalOpen: true 
    }),
    closeDeleteModal: () => set({ 
        isDeleteModalOpen: false, 
        templateToDelete: null 
    }),

    // CRUD Actions
    addTemplate: (formData, submitForApproval = false) => {
        const newTemplate = {
            id: 'tmpl-' + Date.now(),
            name: (formData.name || 'new_template').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
            title: formData.title || formData.name || 'Untitled Template',
            category: formData.category || 'Utility',
            language: formData.language || 'English (US)',
            status: submitForApproval ? 'Pending' : 'Draft',
            header: formData.header?.text ? { type: 'TEXT', text: formData.header.text } : null,
            body: formData.body || '',
            footer: formData.footer || '',
            variables: formData.variables || [],
            buttons: formData.buttons || [],
            rejectionReason: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        set((state) => {
            const nextTemplates = [newTemplate, ...state.templates];
            persistTemplates(nextTemplates);
            return { 
                templates: nextTemplates,
                isCreateModalOpen: false,
                editingTemplate: null
            };
        });

        return newTemplate;
    },

    updateTemplate: (templateId, formData, submitForApproval = false) => {
        set((state) => {
            const nextTemplates = state.templates.map((tpl) => {
                if (tpl.id === templateId) {
                    // Rule: Editing an approved template returns the edited version to Draft (or Pending if submitted)
                    let nextStatus = tpl.status;
                    if (tpl.status === 'Approved') {
                        nextStatus = submitForApproval ? 'Pending' : 'Draft';
                    } else if (submitForApproval) {
                        nextStatus = 'Pending';
                    }

                    return {
                        ...tpl,
                        name: (formData.name || tpl.name).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
                        title: formData.title || tpl.title,
                        category: formData.category || tpl.category,
                        language: formData.language || tpl.language,
                        status: nextStatus,
                        header: formData.header?.text ? { type: 'TEXT', text: formData.header.text } : null,
                        body: formData.body || tpl.body,
                        footer: formData.footer !== undefined ? formData.footer : tpl.footer,
                        variables: formData.variables || tpl.variables,
                        buttons: formData.buttons || tpl.buttons,
                        rejectionReason: nextStatus === 'Pending' ? null : tpl.rejectionReason,
                        updatedAt: new Date().toISOString()
                    };
                }
                return tpl;
            });

            persistTemplates(nextTemplates);
            return { 
                templates: nextTemplates,
                isCreateModalOpen: false,
                editingTemplate: null
            };
        });
    },

    deleteTemplate: (templateId) => {
        set((state) => {
            const nextTemplates = state.templates.filter((tpl) => tpl.id !== templateId);
            persistTemplates(nextTemplates);
            return { 
                templates: nextTemplates,
                isDeleteModalOpen: false,
                templateToDelete: null
            };
        });
    },

    duplicateTemplate: (templateId) => {
        const state = get();
        const original = state.templates.find((tpl) => tpl.id === templateId);
        if (!original) return;

        const copyName = `${original.name}_copy_${Math.floor(Math.random() * 900 + 100)}`;
        const duplicated = {
            ...original,
            id: 'tmpl-' + Date.now(),
            name: copyName,
            title: `[Copy] ${original.title || original.name}`,
            status: 'Draft',
            rejectionReason: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        set((state) => {
            const nextTemplates = [duplicated, ...state.templates];
            persistTemplates(nextTemplates);
            return { templates: nextTemplates };
        });

        return duplicated;
    },

    submitForApproval: (templateId) => {
        set((state) => {
            const nextTemplates = state.templates.map((tpl) => {
                if (tpl.id === templateId) {
                    return {
                        ...tpl,
                        status: 'Pending',
                        rejectionReason: null,
                        updatedAt: new Date().toISOString()
                    };
                }
                return tpl;
            });
            persistTemplates(nextTemplates);
            return { templates: nextTemplates };
        });
    },

    // Demo Controls: Simulate Meta Approval / Rejection
    simulateApproval: (templateId) => {
        set((state) => {
            const nextTemplates = state.templates.map((tpl) => {
                if (tpl.id === templateId) {
                    return {
                        ...tpl,
                        status: 'Approved',
                        rejectionReason: null,
                        updatedAt: new Date().toISOString()
                    };
                }
                return tpl;
            });
            persistTemplates(nextTemplates);
            return { templates: nextTemplates };
        });
    },

    simulateRejection: (templateId, customReason = null) => {
        const defaultReason = 'Template violates WhatsApp Commerce Policy regarding variable formatting and unverified promotional claims. Please specify clear sample values and re-submit.';
        const reason = customReason || defaultReason;

        set((state) => {
            const nextTemplates = state.templates.map((tpl) => {
                if (tpl.id === templateId) {
                    return {
                        ...tpl,
                        status: 'Rejected',
                        rejectionReason: reason,
                        updatedAt: new Date().toISOString()
                    };
                }
                return tpl;
            });
            persistTemplates(nextTemplates);
            return { templates: nextTemplates };
        });
    },

    // Reset templates to default mock data
    resetToDefaults: () => {
        localStorage.removeItem(TEMPLATES_STORAGE_KEY);
        set({
            templates: initialWhatsAppTemplates,
            searchQuery: '',
            categoryFilter: 'All',
            statusFilter: 'All',
            selectedTemplate: null,
            editingTemplate: null
        });
    },

    // Dynamic Statistics Calculation
    getStats: () => {
        const templates = get().templates;
        const total = templates.length;
        const approved = templates.filter((t) => t.status === 'Approved').length;
        const pending = templates.filter((t) => t.status === 'Pending').length;
        const rejected = templates.filter((t) => t.status === 'Rejected').length;
        const draft = templates.filter((t) => t.status === 'Draft').length;

        return {
            total,
            approved,
            pending,
            rejected,
            draft
        };
    }
}));

export default useWhatsAppTemplateStore;
