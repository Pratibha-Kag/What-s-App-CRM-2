/**
 * UI-Only Mock Service Layer.
 * ZERO backend, ZERO Axios, ZERO Socket.io connections, ZERO network requests.
 */
import { mockLeads, mockUsers, mockConversations, mockDailyReports } from '../mock/mockData';

const api = {
    get: async (url) => {
        if (typeof url === 'string') {
            if (url.startsWith('/leads')) return { success: true, data: mockLeads };
            if (url.startsWith('/users')) return { success: true, data: mockUsers };
            if (url.startsWith('/messages/conversations')) return { success: true, data: mockConversations };
            if (url.startsWith('/reports/daily')) return { success: true, data: { data: mockDailyReports } };
        }
        return { success: true, data: [] };
    },
    post: async (url, data) => ({ success: true, data: data || {} }),
    put: async (url, data) => ({ success: true, data: data || {} }),
    patch: async (url, data) => ({ success: true, data: data || {} }),
    delete: async () => ({ success: true, data: {} }),
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
    }
};

export const socket = {
    connected: false,
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {}
};

export const connectSocket = () => {};
export const disconnectSocket = () => {};
export const subscribeToRoom = () => {};
export const unsubscribeFromRoom = () => {};

export default api;


