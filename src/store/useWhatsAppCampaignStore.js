import { create } from 'zustand';
import { initialWhatsAppCampaigns } from '../mock/whatsapp/mockWhatsAppCampaigns';

const CAMPAIGNS_STORAGE_KEY = 'whatsapp_crm_campaigns_dev1_v1';

const loadPersistedCampaigns = () => {
    try {
        const item = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('[WhatsApp Campaign Store] Failed to load from localStorage:', err);
    }
    return initialWhatsAppCampaigns;
};

const persistCampaigns = (campaigns) => {
    try {
        localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
    } catch (err) {
        console.warn('[WhatsApp Campaign Store] Failed to persist campaigns:', err);
    }
};

const useWhatsAppCampaignStore = create((set, get) => ({
    campaigns: loadPersistedCampaigns(),
    selectedCampaign: null,
    searchQuery: '',
    statusFilter: 'All', // 'All' | 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed' | 'Cancelled'
    typeFilter: 'All',   // 'All' | 'Manual' | 'Bulk'
    currentPage: 1,
    pageSize: 6,

    // Modal Visibility
    isWizardOpen: false,
    editingCampaign: null,
    isDetailsModalOpen: false,
    isDeleteModalOpen: false,
    campaignToDelete: null,
    isCancelModalOpen: false,
    campaignToCancel: null,

    // Filters & Pagination Actions
    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
    setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
    setTypeFilter: (type) => set({ typeFilter: type, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),

    // Wizard Controls
    openWizard: (campaignToEdit = null) => set({
        editingCampaign: campaignToEdit,
        isWizardOpen: true
    }),
    closeWizard: () => set({
        editingCampaign: null,
        isWizardOpen: false
    }),

    // Details Modal Controls
    openDetailsModal: (campaign) => set({
        selectedCampaign: campaign,
        isDetailsModalOpen: true
    }),
    closeDetailsModal: () => set({
        selectedCampaign: null,
        isDetailsModalOpen: false
    }),

    // Delete Modal Controls
    openDeleteModal: (campaign) => set({
        campaignToDelete: campaign,
        isDeleteModalOpen: true
    }),
    closeDeleteModal: () => set({
        campaignToDelete: null,
        isDeleteModalOpen: false
    }),

    // Cancel Modal Controls
    openCancelModal: (campaign) => set({
        campaignToCancel: campaign,
        isCancelModalOpen: true
    }),
    closeCancelModal: () => set({
        campaignToCancel: null,
        isCancelModalOpen: false
    }),

    // Campaign CRUD & Execution
    createCampaign: (campaignData) => {
        const newCampaign = {
            id: `camp-${Date.now()}`,
            name: campaignData.name || 'Untitled Campaign',
            description: campaignData.description || '',
            type: campaignData.type || 'Bulk',
            status: campaignData.status || (campaignData.scheduledFor ? 'Scheduled' : 'Draft'),
            templateId: campaignData.templateId,
            templateName: campaignData.templateName || 'WhatsApp Template',
            templateCategory: campaignData.templateCategory || 'Marketing',
            templateSnapshot: campaignData.templateSnapshot || null,
            variableMappings: campaignData.variableMappings || [],
            audienceSource: campaignData.audienceSource || 'CRM_GROUP',
            audienceGroupName: campaignData.audienceGroupName || 'Target Audience',
            totalRecipients: campaignData.recipients ? campaignData.recipients.length : 0,
            stats: {
                sent: 0,
                delivered: 0,
                read: 0,
                failed: 0,
                pending: campaignData.recipients ? campaignData.recipients.length : 0
            },
            scheduledFor: campaignData.scheduledFor || null,
            timezone: campaignData.timezone || 'GMT+5:30 (IST)',
            createdAt: new Date().toISOString(),
            completedAt: null,
            recipients: (campaignData.recipients || []).map((r, idx) => ({
                id: `rec-${Date.now()}-${idx}`,
                name: r.name || `Recipient ${idx + 1}`,
                phone: r.phone,
                status: 'Pending',
                sentAt: null,
                deliveredAt: null,
                readAt: null,
                errorReason: null
            }))
        };

        const updated = [newCampaign, ...get().campaigns];
        persistCampaigns(updated);
        set({ campaigns: updated });

        // If launched immediately as Running, trigger simulation
        if (newCampaign.status === 'Running') {
            get().simulateCampaignDelivery(newCampaign.id);
        }

        return newCampaign;
    },

    updateCampaign: (id, updates) => {
        const updated = get().campaigns.map(c => {
            if (c.id === id) {
                return { ...c, ...updates, updatedAt: new Date().toISOString() };
            }
            return c;
        });
        persistCampaigns(updated);
        set({ campaigns: updated });

        if (get().selectedCampaign?.id === id) {
            set({ selectedCampaign: updated.find(c => c.id === id) });
        }
    },

    deleteCampaign: (id) => {
        const updated = get().campaigns.filter(c => c.id !== id);
        persistCampaigns(updated);
        set({
            campaigns: updated,
            isDeleteModalOpen: false,
            campaignToDelete: null
        });
    },

    duplicateCampaign: (id) => {
        const target = get().campaigns.find(c => c.id === id);
        if (!target) return null;

        const clone = {
            ...target,
            id: `camp-${Date.now()}`,
            name: `${target.name} (Copy)`,
            status: 'Draft',
            createdAt: new Date().toISOString(),
            completedAt: null,
            scheduledFor: null,
            stats: {
                sent: 0,
                delivered: 0,
                read: 0,
                failed: 0,
                pending: target.recipients.length
            },
            recipients: target.recipients.map((r, idx) => ({
                ...r,
                id: `rec-${Date.now()}-${idx}`,
                status: 'Pending',
                sentAt: null,
                deliveredAt: null,
                readAt: null,
                errorReason: null
            }))
        };

        const updated = [clone, ...get().campaigns];
        persistCampaigns(updated);
        set({ campaigns: updated });
        return clone;
    },

    // Execution Simulation Engine
    sendNow: (id) => {
        const campaign = get().campaigns.find(c => c.id === id);
        if (!campaign) return;
        if (campaign.status === 'Running' || campaign.status === 'Completed') return;

        // Transition to Running
        get().updateCampaign(id, {
            status: 'Running',
            scheduledFor: null
        });

        get().simulateCampaignDelivery(id);
    },

    executeScheduledCampaign: (id) => {
        get().sendNow(id);
    },

    pauseCampaign: (id) => {
        const campaign = get().campaigns.find(c => c.id === id);
        if (!campaign || campaign.status !== 'Running') return;

        get().updateCampaign(id, { status: 'Paused' });
    },

    resumeCampaign: (id) => {
        const campaign = get().campaigns.find(c => c.id === id);
        if (!campaign || campaign.status !== 'Paused') return;

        get().updateCampaign(id, { status: 'Running' });
        get().simulateCampaignDelivery(id);
    },

    cancelCampaign: (id) => {
        const campaign = get().campaigns.find(c => c.id === id);
        if (!campaign) return;

        get().updateCampaign(id, { 
            status: 'Cancelled',
            completedAt: new Date().toISOString()
        });
        set({ isCancelModalOpen: false, campaignToCancel: null });
    },

    // In-place retry of failed recipient without duplicate records
    retryFailedRecipient: (campaignId, recipientPhone) => {
        const campaigns = get().campaigns;
        const targetCamp = campaigns.find(c => c.id === campaignId);
        if (!targetCamp) return;

        const updatedRecipients = targetCamp.recipients.map(r => {
            if (r.phone === recipientPhone && r.status === 'Failed') {
                return {
                    ...r,
                    status: 'Sent',
                    sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    errorReason: null
                };
            }
            return r;
        });

        // Recalculate stats
        const stats = {
            sent: updatedRecipients.filter(r => ['Sent', 'Delivered', 'Read'].includes(r.status)).length,
            delivered: updatedRecipients.filter(r => ['Delivered', 'Read'].includes(r.status)).length,
            read: updatedRecipients.filter(r => r.status === 'Read').length,
            failed: updatedRecipients.filter(r => r.status === 'Failed').length,
            pending: updatedRecipients.filter(r => r.status === 'Pending').length
        };

        const updated = campaigns.map(c => {
            if (c.id === campaignId) {
                return { ...c, recipients: updatedRecipients, stats };
            }
            return c;
        });

        persistCampaigns(updated);
        set({ campaigns: updated });
        if (get().selectedCampaign?.id === campaignId) {
            set({ selectedCampaign: updated.find(c => c.id === campaignId) });
        }

        // Simulate delivery transition after 1 second
        setTimeout(() => {
            const currentCamp = get().campaigns.find(c => c.id === campaignId);
            if (!currentCamp) return;

            const deliveredRecipients = currentCamp.recipients.map(r => {
                if (r.phone === recipientPhone && r.status === 'Sent') {
                    return {
                        ...r,
                        status: 'Delivered',
                        deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
                return r;
            });

            const newStats = {
                sent: deliveredRecipients.filter(r => ['Sent', 'Delivered', 'Read'].includes(r.status)).length,
                delivered: deliveredRecipients.filter(r => ['Delivered', 'Read'].includes(r.status)).length,
                read: deliveredRecipients.filter(r => r.status === 'Read').length,
                failed: deliveredRecipients.filter(r => r.status === 'Failed').length,
                pending: deliveredRecipients.filter(r => r.status === 'Pending').length
            };

            const finalCampaigns = get().campaigns.map(c => {
                if (c.id === campaignId) {
                    return { ...c, recipients: deliveredRecipients, stats: newStats };
                }
                return c;
            });

            persistCampaigns(finalCampaigns);
            set({ campaigns: finalCampaigns });
            if (get().selectedCampaign?.id === campaignId) {
                set({ selectedCampaign: finalCampaigns.find(c => c.id === campaignId) });
            }
        }, 1200);
    },

    retryAllFailedRecipients: (campaignId) => {
        const campaign = get().campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        const failedRecipients = campaign.recipients.filter(r => r.status === 'Failed');
        failedRecipients.forEach(r => {
            get().retryFailedRecipient(campaignId, r.phone);
        });
    },

    // Step-by-step asynchronous simulation of campaign delivery
    simulateCampaignDelivery: (campaignId) => {
        const campaign = get().campaigns.find(c => c.id === campaignId);
        if (!campaign || campaign.recipients.length === 0) {
            get().updateCampaign(campaignId, { 
                status: 'Completed', 
                completedAt: new Date().toISOString() 
            });
            return;
        }

        // Phase 1: Mark all pending as Sent (Immediate)
        const sentRecipients = campaign.recipients.map(r => {
            if (r.status === 'Pending') {
                return {
                    ...r,
                    status: 'Sent',
                    sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            }
            return r;
        });

        get().updateCampaign(campaignId, {
            recipients: sentRecipients,
            stats: {
                sent: sentRecipients.filter(r => ['Sent', 'Delivered', 'Read'].includes(r.status)).length,
                delivered: sentRecipients.filter(r => ['Delivered', 'Read'].includes(r.status)).length,
                read: sentRecipients.filter(r => r.status === 'Read').length,
                failed: sentRecipients.filter(r => r.status === 'Failed').length,
                pending: 0
            }
        });

        // Phase 2: After 1.2s, transition sent to Delivered (with 1 simulated failure if phone has 000)
        setTimeout(() => {
            const current = get().campaigns.find(c => c.id === campaignId);
            if (!current || current.status !== 'Running') return;

            const deliveredRecipients = current.recipients.map(r => {
                if (r.status === 'Sent') {
                    if (r.phone.includes('000') || r.phone.length < 7) {
                        return {
                            ...r,
                            status: 'Failed',
                            errorReason: 'WhatsApp number is invalid or not registered'
                        };
                    }
                    return {
                        ...r,
                        status: 'Delivered',
                        deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
                return r;
            });

            get().updateCampaign(campaignId, {
                recipients: deliveredRecipients,
                stats: {
                    sent: deliveredRecipients.filter(r => ['Sent', 'Delivered', 'Read'].includes(r.status)).length,
                    delivered: deliveredRecipients.filter(r => ['Delivered', 'Read'].includes(r.status)).length,
                    read: deliveredRecipients.filter(r => r.status === 'Read').length,
                    failed: deliveredRecipients.filter(r => r.status === 'Failed').length,
                    pending: 0
                }
            });

            // Phase 3: After another 1.5s, transition majority of delivered to Read & mark Completed
            setTimeout(() => {
                const latest = get().campaigns.find(c => c.id === campaignId);
                if (!latest || latest.status !== 'Running') return;

                const readRecipients = latest.recipients.map((r, idx) => {
                    // Mark 80% as Read
                    if (r.status === 'Delivered' && idx % 4 !== 0) {
                        return {
                            ...r,
                            status: 'Read',
                            readAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    }
                    return r;
                });

                get().updateCampaign(campaignId, {
                    status: 'Completed',
                    completedAt: new Date().toISOString(),
                    recipients: readRecipients,
                    stats: {
                        sent: readRecipients.filter(r => ['Sent', 'Delivered', 'Read'].includes(r.status)).length,
                        delivered: readRecipients.filter(r => ['Delivered', 'Read'].includes(r.status)).length,
                        read: readRecipients.filter(r => r.status === 'Read').length,
                        failed: readRecipients.filter(r => r.status === 'Failed').length,
                        pending: 0
                    }
                });
            }, 1500);
        }, 1200);
    },

    // Aggregated Metrics Calculation
    getOverallStats: () => {
        const campaigns = get().campaigns;
        const total = campaigns.length;
        const active = campaigns.filter(c => c.status === 'Running').length;
        const scheduled = campaigns.filter(c => c.status === 'Scheduled').length;
        const completed = campaigns.filter(c => c.status === 'Completed').length;

        let totalRecipients = 0;
        let totalSent = 0;
        let totalDelivered = 0;
        let totalRead = 0;
        let totalFailed = 0;

        campaigns.forEach(c => {
            totalRecipients += (c.totalRecipients || 0);
            if (c.stats) {
                totalSent += (c.stats.sent || 0);
                totalDelivered += (c.stats.delivered || 0);
                totalRead += (c.stats.read || 0);
                totalFailed += (c.stats.failed || 0);
            }
        });

        const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
        const readRate = totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;

        return {
            total,
            active,
            scheduled,
            completed,
            totalRecipients,
            totalSent,
            totalDelivered,
            totalRead,
            totalFailed,
            deliveryRate,
            readRate
        };
    }
}));

export default useWhatsAppCampaignStore;
