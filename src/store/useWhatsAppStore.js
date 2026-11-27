import { create } from 'zustand';
import { 
    initialWhatsAppAccount, 
    initialWhatsAppConversations, 
    initialWhatsAppMessages 
} from '../mock/whatsapp/mockWhatsAppConversations';

const STORAGE_KEY = 'whatsapp_crm_dev1_store_v1';

// Helper to load persisted state from localStorage safely
const loadPersistedState = () => {
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            return {
                account: parsed.account || initialWhatsAppAccount,
                conversations: parsed.conversations || initialWhatsAppConversations,
                messagesStore: parsed.messagesStore || initialWhatsAppMessages,
                selectedConvId: parsed.selectedConvId || initialWhatsAppConversations[0]?.id || null,
            };
        }
    } catch (err) {
        console.warn('[WhatsApp Store] Failed to load localStorage state:', err);
    }
    return {
        account: initialWhatsAppAccount,
        conversations: initialWhatsAppConversations,
        messagesStore: initialWhatsAppMessages,
        selectedConvId: initialWhatsAppConversations[0]?.id || null,
    };
};

// Helper to save to localStorage
const persistState = (state) => {
    try {
        const payload = {
            account: state.account,
            conversations: state.conversations,
            messagesStore: state.messagesStore,
            selectedConvId: state.selectedConvId,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.warn('[WhatsApp Store] Failed to persist state:', err);
    }
};

const initialData = loadPersistedState();

const useWhatsAppStore = create((set, get) => ({
    account: initialData.account,
    conversations: initialData.conversations,
    messagesStore: initialData.messagesStore,
    selectedConvId: initialData.selectedConvId,
    searchTerm: '',
    filterTab: 'all', // 'all' | 'unread' | 'read'
    categoryTab: 'All Contacts', // 'All Contacts' | 'Order Request' | 'Unreplied' | 'Tickets'
    isStatsOpen: true,
    isConnectModalOpen: false,
    isDisconnectModalOpen: false,
    mobileView: 'list', // 'list' | 'chat'

    // Navigation & UI state
    setSelectedConvId: (id) => {
        set((state) => {
            const nextConversations = state.conversations.map((c) =>
                c.id === id ? { ...c, unread_count: 0 } : c
            );
            const nextState = {
                ...state,
                selectedConvId: id,
                conversations: nextConversations,
                mobileView: 'chat',
            };
            persistState(nextState);
            return nextState;
        });
    },

    setMobileView: (view) => set({ mobileView: view }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setFilterTab: (tab) => set({ filterTab: tab }),
    setCategoryTab: (tab) => set({ categoryTab: tab }),
    setIsStatsOpen: (open) => set({ isStatsOpen: open }),
    setIsConnectModalOpen: (open) => set({ isConnectModalOpen: open }),
    setIsDisconnectModalOpen: (open) => set({ isDisconnectModalOpen: open }),

    // Account Actions
    connectAccount: (customData = {}) => {
        set((state) => {
            const nextAccount = {
                ...state.account,
                connected: true,
                status: 'connected',
                businessName: customData.businessName || state.account.businessName || 'WhatsApp CRM Official',
                phone: customData.phone || state.account.phone || '+1 (555) 019-2834',
                lastSynced: 'Just now',
                qualityRating: 'High (Green)',
            };
            const nextState = {
                ...state,
                account: nextAccount,
                isConnectModalOpen: false,
            };
            persistState(nextState);
            return nextState;
        });
    },

    setAccountStatus: (status) => {
        set((state) => {
            const nextAccount = { ...state.account, status };
            const nextState = { ...state, account: nextAccount };
            persistState(nextState);
            return nextState;
        });
    },

    disconnectAccount: () => {
        set((state) => {
            const nextAccount = {
                ...state.account,
                connected: false,
                status: 'disconnected',
                lastSynced: 'Disconnected',
            };
            const nextState = {
                ...state,
                account: nextAccount,
                isDisconnectModalOpen: false,
            };
            persistState(nextState);
            return nextState;
        });
    },

    reconnectAccount: () => {
        set((state) => {
            const nextAccount = {
                ...state.account,
                connected: true,
                status: 'connected',
                lastSynced: 'Just now',
            };
            const nextState = { ...state, account: nextAccount };
            persistState(nextState);
            return nextState;
        });
    },

    // Send Outgoing Message with Predictable Status Progression
    sendMessage: (convId, text, forceStatus = null) => {
        if (!text || !text.trim() || !convId) return;

        const messageId = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const timestamp = new Date().toISOString();
        const initialStatus = forceStatus || 'sent';

        const newMsg = {
            id: messageId,
            conversation_id: convId,
            sender_type: 'Agent',
            message: text.trim(),
            created_at: timestamp,
            status: initialStatus,
            error_reason: initialStatus === 'failed' ? 'Simulated delivery failure' : null,
        };

        set((state) => {
            const convMessages = state.messagesStore[convId] || [];
            const nextMessagesStore = {
                ...state.messagesStore,
                [convId]: [...convMessages, newMsg],
            };

            const nextConversations = state.conversations.map((c) =>
                c.id === convId
                    ? {
                          ...c,
                          last_message: text.trim(),
                          last_message_time: timestamp,
                          last_message_status: initialStatus,
                      }
                    : c
            );

            const nextState = {
                ...state,
                messagesStore: nextMessagesStore,
                conversations: nextConversations,
            };
            persistState(nextState);
            return nextState;
        });

        // Predictable status transitions: sent -> delivered -> read (unless forced failed/sent)
        if (!forceStatus) {
            // Stage 1: Transition to 'delivered' after 1.4s
            setTimeout(() => {
                const currentStatus = get().messagesStore[convId]?.find((m) => m.id === messageId)?.status;
                if (currentStatus === 'sent') {
                    get().updateMessageStatus(convId, messageId, 'delivered');
                }
            }, 1400);

            // Stage 2: Transition to 'read' after 2.8s
            setTimeout(() => {
                const currentStatus = get().messagesStore[convId]?.find((m) => m.id === messageId)?.status;
                if (currentStatus === 'delivered') {
                    get().updateMessageStatus(convId, messageId, 'read');
                }
            }, 2800);
        }

        return messageId;
    },

    // Update Message Status (e.g. from sent -> delivered -> read)
    updateMessageStatus: (convId, messageId, newStatus) => {
        set((state) => {
            const convMessages = state.messagesStore[convId] || [];
            let hasUpdated = false;

            const nextConvMessages = convMessages.map((msg) => {
                if (msg.id === messageId) {
                    hasUpdated = true;
                    return {
                        ...msg,
                        status: newStatus,
                        error_reason: newStatus === 'failed' ? (msg.error_reason || 'Simulated delivery failure') : null,
                    };
                }
                return msg;
            });

            if (!hasUpdated) return state;

            const nextMessagesStore = {
                ...state.messagesStore,
                [convId]: nextConvMessages,
            };

            // Update conversation last_message_status if this was the last message
            const lastMsg = nextConvMessages[nextConvMessages.length - 1];
            const nextConversations = state.conversations.map((c) =>
                c.id === convId && lastMsg?.id === messageId
                    ? { ...c, last_message_status: newStatus }
                    : c
            );

            const nextState = {
                ...state,
                messagesStore: nextMessagesStore,
                conversations: nextConversations,
            };
            persistState(nextState);
            return nextState;
        });
    },

    // Retry a Failed Message (Updates existing message in place without creating a duplicate!)
    retryMessage: (convId, messageId) => {
        const state = get();
        const convMessages = state.messagesStore[convId] || [];
        const targetMsg = convMessages.find((m) => m.id === messageId);
        if (!targetMsg || targetMsg.status !== 'failed') return;

        // Transition from 'failed' to 'sent'
        get().updateMessageStatus(convId, messageId, 'sent');

        // Predictable follow-through: sent -> delivered -> read
        setTimeout(() => {
            get().updateMessageStatus(convId, messageId, 'delivered');
        }, 1200);

        setTimeout(() => {
            get().updateMessageStatus(convId, messageId, 'read');
        }, 2400);
    },

    // Simulate Customer Incoming Reply
    simulateCustomerReply: (convId, customText = null) => {
        const targetConvId = convId || get().selectedConvId;
        if (!targetConvId) return;

        const repliesPool = [
            'Thank you for confirming! I will check and get back to you shortly.',
            'Could you please share more information regarding the scholarship requirements?',
            'Sounds great. I am ready to schedule the consultation call.',
            'Yes, that works perfectly for my schedule. Thanks for the quick update!',
            'Got it! What are the primary documents needed for submission?'
        ];

        const text = customText || repliesPool[Math.floor(Math.random() * repliesPool.length)];
        const messageId = 'msg-reply-' + Date.now();
        const timestamp = new Date().toISOString();

        const incomingMsg = {
            id: messageId,
            conversation_id: targetConvId,
            sender_type: 'Customer',
            message: text,
            created_at: timestamp,
            status: null, // Incoming messages do not have outgoing delivery ticks
        };

        set((state) => {
            const isCurrentlySelected = state.selectedConvId === targetConvId;
            const convMessages = state.messagesStore[targetConvId] || [];

            const nextMessagesStore = {
                ...state.messagesStore,
                [targetConvId]: [...convMessages, incomingMsg],
            };

            const nextConversations = state.conversations.map((c) =>
                c.id === targetConvId
                    ? {
                          ...c,
                          last_message: text,
                          last_message_time: timestamp,
                          last_message_status: null,
                          unread_count: isCurrentlySelected ? 0 : (c.unread_count || 0) + 1,
                      }
                    : c
            );

            const nextState = {
                ...state,
                messagesStore: nextMessagesStore,
                conversations: nextConversations,
            };
            persistState(nextState);
            return nextState;
        });
    },

    // Demo Helper: Cycle Status on Message Click (for easy interactive reviewer testing)
    cycleMessageStatus: (convId, messageId) => {
        const msg = get().messagesStore[convId]?.find((m) => m.id === messageId);
        if (!msg || msg.sender_type !== 'Agent') return;

        const order = ['sent', 'delivered', 'read', 'failed'];
        const currentIndex = order.indexOf(msg.status || 'sent');
        const nextStatus = order[(currentIndex + 1) % order.length];

        get().updateMessageStatus(convId, messageId, nextStatus);
    },

    // Reset Store to initial mock dataset
    resetToDefaultData: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({
            account: initialWhatsAppAccount,
            conversations: initialWhatsAppConversations,
            messagesStore: initialWhatsAppMessages,
            selectedConvId: initialWhatsAppConversations[0]?.id || null,
            searchTerm: '',
            filterTab: 'all',
            mobileView: 'list',
        });
    },

    // Dynamic Statistics Calculation
    getStats: (forSelectedConvOnly = false) => {
        const state = get();
        let targetMessages = [];

        if (forSelectedConvOnly && state.selectedConvId) {
            targetMessages = state.messagesStore[state.selectedConvId] || [];
        } else {
            Object.values(state.messagesStore).forEach((list) => {
                if (Array.isArray(list)) {
                    targetMessages.push(...list);
                }
            });
        }

        const total = targetMessages.length;
        const incoming = targetMessages.filter((m) => m.sender_type === 'Customer').length;
        const outgoing = targetMessages.filter((m) => m.sender_type === 'Agent');
        const outgoingCount = outgoing.length;

        const sent = outgoing.filter((m) => m.status === 'sent').length;
        const delivered = outgoing.filter((m) => m.status === 'delivered').length;
        const read = outgoing.filter((m) => m.status === 'read').length;
        const failed = outgoing.filter((m) => m.status === 'failed').length;

        return {
            total,
            incoming,
            outgoing: outgoingCount,
            sent,
            delivered,
            read,
            failed,
        };
    },
}));

export default useWhatsAppStore;
