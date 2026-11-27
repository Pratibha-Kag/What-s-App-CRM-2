import { create } from 'zustand';
import { initialWhatsAppAudiences, initialAudienceGroups } from '../mock/whatsapp/mockWhatsAppAudiences';

const AUDIENCES_STORAGE_KEY = 'whatsapp_crm_audiences_dev1_v1';

const loadPersistedAudiences = () => {
    try {
        const item = localStorage.getItem(AUDIENCES_STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('[WhatsApp Audience Store] Failed to load from localStorage:', err);
    }
    return initialWhatsAppAudiences;
};

const persistAudiences = (audiences) => {
    try {
        localStorage.setItem(AUDIENCES_STORAGE_KEY, JSON.stringify(audiences));
    } catch (err) {
        console.warn('[WhatsApp Audience Store] Failed to persist audiences:', err);
    }
};

const useWhatsAppAudienceStore = create((set, get) => ({
    audiences: loadPersistedAudiences(),
    groups: initialAudienceGroups,
    selectedGroup: 'All Contacts',
    searchQuery: '',

    setSelectedGroup: (group) => set({ selectedGroup: group }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    addCustomer: (customer) => {
        const newCustomer = {
            id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: customer.name || 'Unknown Contact',
            phone: customer.phone,
            dob: customer.dob || '',
            email: customer.email || '',
            group: customer.group || 'Admissions Inquiries',
            city: customer.city || '',
            importSource: customer.importSource || 'MANUAL',
            createdAt: new Date().toISOString()
        };

        const updated = [newCustomer, ...get().audiences];
        persistAudiences(updated);
        set({ audiences: updated });
        return newCustomer;
    },

    addBulkCustomers: (customerList, importSource = 'CSV_IMPORT') => {
        const currentAudiences = get().audiences;
        const existingPhones = new Set(currentAudiences.map(c => c.phone.replace(/\D/g, '')));

        const newRecords = [];
        customerList.forEach((c, idx) => {
            const cleanPhone = (c.phone || '').replace(/\D/g, '');
            // Prevent exact duplicates during bulk import
            if (cleanPhone && !existingPhones.has(cleanPhone)) {
                existingPhones.add(cleanPhone);
                newRecords.push({
                    id: `aud-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
                    name: c.name || `Contact ${idx + 1}`,
                    phone: c.phone,
                    dob: c.dob || '',
                    email: c.email || '',
                    group: c.group || 'Imported Audience',
                    city: c.city || '',
                    importSource,
                    createdAt: new Date().toISOString()
                });
            }
        });

        const updated = [...newRecords, ...currentAudiences];
        persistAudiences(updated);

        // Update groups list if new group was introduced
        const newGroupsSet = new Set(get().groups);
        newRecords.forEach(r => {
            if (r.group) newGroupsSet.add(r.group);
        });

        set({ 
            audiences: updated,
            groups: Array.from(newGroupsSet)
        });

        return newRecords.length;
    },

    deleteCustomer: (id) => {
        const updated = get().audiences.filter(c => c.id !== id);
        persistAudiences(updated);
        set({ audiences: updated });
    },

    resetToDefaults: () => {
        persistAudiences(initialWhatsAppAudiences);
        set({ 
            audiences: initialWhatsAppAudiences, 
            groups: initialAudienceGroups,
            selectedGroup: 'All Contacts',
            searchQuery: '' 
        });
    }
}));

export default useWhatsAppAudienceStore;
