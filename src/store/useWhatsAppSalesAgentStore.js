import { create } from 'zustand';
import { 
    initialSalesAgentProviders, 
    initialSalesAgentConfig, 
    initialDemoConversation, 
    initialSalesAgentActivities,
    generateSimulatedAIResponse 
} from '../mock/whatsapp/mockWhatsAppSalesAgent';

const CONFIG_STORAGE_KEY = 'whatsapp_crm_sales_agent_dev1_v1';
const ACTIVITY_STORAGE_KEY = 'whatsapp_crm_sales_agent_activity_dev1_v1';
const CHAT_STORAGE_KEY = 'whatsapp_crm_sales_agent_chat_dev1_v1';

const loadPersistedConfig = () => {
    try {
        const item = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to load config:', err);
    }
    return initialSalesAgentConfig;
};

const persistConfig = (config) => {
    try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to persist config:', err);
    }
};

const loadPersistedActivities = () => {
    try {
        const item = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to load activities:', err);
    }
    return initialSalesAgentActivities;
};

const persistActivities = (activities) => {
    try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to persist activities:', err);
    }
};

const loadPersistedChat = () => {
    try {
        const item = localStorage.getItem(CHAT_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to load chat:', err);
    }
    return initialDemoConversation;
};

const persistChat = (chat) => {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chat));
    } catch (err) {
        console.warn('[SalesAgentStore] Failed to persist chat:', err);
    }
};

let pendingResponseTimeout = null;

const useWhatsAppSalesAgentStore = create((set, get) => ({
    config: loadPersistedConfig(),
    providers: initialSalesAgentProviders,
    chatMessages: loadPersistedChat(),
    activityHistory: loadPersistedActivities(),

    // UI States
    isTyping: false,
    activeConfigModal: null, // null | 'provider' | 'messageFormat' | 'businessInfo' | 'language' | 'imageRecognition'
    selectedActivityForDetail: null,
    activitySearchQuery: '',
    activityFilter: 'all',
    connectionTesting: false,
    connectionTestResult: null,

    // Controls
    toggleAgent: (val) => {
        const current = get().config;
        const newStatus = typeof val === 'boolean' ? val : !current.agentEnabled;
        const updated = { ...current, agentEnabled: newStatus };
        persistConfig(updated);

        // Safely cancel any pending simulated response if agent is disabled
        if (!newStatus && pendingResponseTimeout) {
            clearTimeout(pendingResponseTimeout);
            pendingResponseTimeout = null;
            set({ isTyping: false });
        }

        get().logActivity({
            conversationName: 'Master Agent State',
            provider: get().providers[updated.selectedProvider]?.name || 'AI Provider',
            activityType: 'Agent Toggled',
            details: `Sales Agent ${newStatus ? 'Activated' : 'Disabled'} by user.`,
            status: 'Success'
        });

        set({ config: updated });
    },

    toggleAutomation: (val) => {
        const current = get().config;
        const newStatus = typeof val === 'boolean' ? val : !current.automationEnabled;
        const updated = { ...current, automationEnabled: newStatus };
        persistConfig(updated);

        get().logActivity({
            conversationName: 'Message Automation Engine',
            provider: get().providers[updated.selectedProvider]?.name || 'AI Provider',
            activityType: 'Agent Toggled',
            details: `Message Automation ${newStatus ? 'Enabled' : 'Paused'}.`,
            status: 'Success'
        });

        set({ config: updated });
    },

    selectProvider: (providerId) => {
        if (!get().providers[providerId]) return;
        const current = get().config;
        const updated = { ...current, selectedProvider: providerId };
        persistConfig(updated);

        const providerObj = get().providers[providerId];
        get().logActivity({
            conversationName: 'Provider Switch',
            provider: providerObj.name,
            activityType: 'Provider Switch',
            details: `Active AI provider switched to ${providerObj.name} (${providerObj.selectedModel}).`,
            status: 'Simulation Sandbox'
        });

        set({ config: updated });
    },

    updateProviderModel: (providerId, modelId) => {
        const currentProviders = get().providers;
        if (!currentProviders[providerId]) return;

        const updated = {
            ...currentProviders,
            [providerId]: {
                ...currentProviders[providerId],
                selectedModel: modelId
            }
        };
        set({ providers: updated });
    },

    updateConfig: (partial) => {
        const current = get().config;
        const updated = { ...current, ...partial };
        persistConfig(updated);

        get().logActivity({
            conversationName: 'Admin Configuration',
            provider: get().providers[updated.selectedProvider]?.name || 'AI Provider',
            activityType: 'Config Update',
            details: 'AI Sales Agent settings and business guidelines updated.',
            status: 'Success'
        });

        set({ config: updated, activeConfigModal: null });
    },

    simulateConnectionTest: async (providerId) => {
        const pId = providerId || get().config.selectedProvider;
        const provider = get().providers[pId];
        if (!provider) return null;

        set({ connectionTesting: true, connectionTestResult: null });

        // Simulate network roundtrip latency
        await new Promise(resolve => setTimeout(resolve, 600));

        const simulatedPing = Math.floor(Math.random() * 40) + 110; // 110-150ms
        const result = {
            providerId: pId,
            providerName: provider.name,
            model: provider.selectedModel,
            latencyMs: simulatedPing,
            status: 'Healthy',
            message: `Simulated Ping: ${simulatedPing}ms • ${provider.name} Sandbox Operational`
        };

        get().logActivity({
            conversationName: 'Provider Diagnostics',
            provider: provider.name,
            activityType: 'Connection Test',
            details: result.message,
            status: 'Success'
        });

        set({ connectionTesting: false, connectionTestResult: result });
        return result;
    },

    sendUserMessage: (userText) => {
        const clean = (userText || '').trim();
        if (!clean) return;

        const config = get().config;
        const provider = get().providers[config.selectedProvider] || get().providers.chatgpt;

        const userMsg = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            senderName: 'You (Visitor / Lead)',
            text: clean,
            timestamp: new Date().toISOString()
        };

        const updatedChat = [...get().chatMessages, userMsg];
        persistChat(updatedChat);
        set({ chatMessages: updatedChat });

        // If agent is disabled, handle accordingly
        if (!config.agentEnabled || !config.automationEnabled) {
            setTimeout(() => {
                const noticeMsg = {
                    id: `msg-notice-${Date.now()}`,
                    sender: 'system',
                    senderName: 'System Notice',
                    text: '⚠️ AI Sales Agent is currently disabled. Enable the agent above to resume simulated automated responses.',
                    timestamp: new Date().toISOString()
                };
                const withNotice = [...get().chatMessages, noticeMsg];
                persistChat(withNotice);
                set({ chatMessages: withNotice });
            }, 300);
            return;
        }

        // Trigger typing state
        set({ isTyping: true });

        // Simulate AI thinking and reply generation (600-800ms) with cancellable timeout
        if (pendingResponseTimeout) {
            clearTimeout(pendingResponseTimeout);
        }

        pendingResponseTimeout = setTimeout(() => {
            pendingResponseTimeout = null;
            const replyText = generateSimulatedAIResponse(clean, config, provider);
            const aiMsg = {
                id: `msg-ai-${Date.now()}`,
                sender: 'ai',
                senderName: `${config.agentDisplayName || 'AI Assistant'}`,
                provider: `${provider.name} · ${provider.selectedModel}`,
                text: replyText,
                timestamp: new Date().toISOString()
            };

            const finalizedChat = [...get().chatMessages, aiMsg];
            persistChat(finalizedChat);
            set({ chatMessages: finalizedChat, isTyping: false });

            // Log activity
            get().logActivity({
                conversationName: `Demo Lead Inquiry ("${clean.slice(0, 30)}...")`,
                provider: provider.name,
                activityType: 'Simulated Reply',
                details: `Dispatched AI response using model ${provider.selectedModel} (${config.responseTone}).`,
                status: 'Success'
            });
        }, 750);
    },

    resetConversation: () => {
        if (pendingResponseTimeout) {
            clearTimeout(pendingResponseTimeout);
            pendingResponseTimeout = null;
        }

        const config = get().config;
        const provider = get().providers[config.selectedProvider] || get().providers.chatgpt;

        const welcome = [
            {
                id: `msg-init-${Date.now()}`,
                sender: 'ai',
                senderName: `${config.agentDisplayName || 'Aria (AI Sales Agent)'}`,
                provider: `${provider.name} · ${provider.selectedModel}`,
                text: `Hello! 👋 Welcome to ${config.businessName || 'WhatsApp CRM Enterprise'}. I am ${config.agentDisplayName}, your AI Sales Specialist. How can I help you scale your customer outreach today?`,
                timestamp: new Date().toISOString()
            }
        ];
        persistChat(welcome);
        set({ chatMessages: welcome, isTyping: false });
    },

    logActivity: (activity) => {
        const newRecord = {
            id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
            conversationName: activity.conversationName || 'General Interaction',
            provider: activity.provider || 'OpenAI ChatGPT',
            activityType: activity.activityType || 'Simulated Reply',
            details: activity.details || '',
            status: activity.status || 'Success',
            timestamp: new Date().toISOString()
        };

        const updated = [newRecord, ...get().activityHistory];
        persistActivities(updated);
        set({ activityHistory: updated });
    },

    openConfigModal: (modalType) => set({ activeConfigModal: modalType }),
    closeConfigModal: () => set({ activeConfigModal: null, connectionTestResult: null }),
    setSelectedActivityForDetail: (act) => set({ selectedActivityForDetail: act }),
    setActivitySearchQuery: (q) => set({ activitySearchQuery: q }),
    setActivityFilter: (f) => set({ activityFilter: f }),

    getDashboardStats: () => {
        const config = get().config;
        const activities = get().activityHistory || [];
        const repliesCount = activities.filter(a => a.activityType === 'Simulated Reply').length;
        const testsCount = activities.filter(a => a.activityType === 'Connection Test').length;
        const activeProviderObj = get().providers[config.selectedProvider] || get().providers.chatgpt;

        let statusLabel = 'Active';
        if (!config.agentEnabled) {
            statusLabel = 'Disabled';
        }

        return {
            status: statusLabel,
            providerName: activeProviderObj.name,
            providerModel: activeProviderObj.selectedModel,
            isConfigured: activeProviderObj.isConfigured,
            conversationsHandled: 18 + repliesCount,
            repliesGenerated: 42 + repliesCount,
            testsRun: testsCount
        };
    }
}));

export default useWhatsAppSalesAgentStore;
