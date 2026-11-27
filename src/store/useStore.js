import { create } from 'zustand'
import { mockCustomerAccounts } from '../mock/mockData'
import { DEFAULT_BRANDING, applyBrandingCssVars } from '../lib/brandingUtils'

// Maps backend/mock role enum → frontend display role string used throughout app
export const ROLE_MAP = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin',
    'CUSTOMER_ADMIN': 'Admin',
    'MANAGER': 'Manager',
    'TEAM_LEADER': 'Team Leader',
    'COUNSELOR': 'Counselor',
    'CUSTOMER_SUPPORT': 'Customer Support',
    'SUPPORT': 'Customer Support',
}

export const ROLE_PATH_MAP = {
    'SUPER_ADMIN': 'super-admin',
    'ADMIN': 'admin',
    'CUSTOMER_ADMIN': 'admin',
    'MANAGER': 'manager',
    'TEAM_LEADER': 'team-leader',
    'CUSTOMER_SUPPORT': 'support',
    'SUPPORT': 'support',
    'COUNSELOR': 'counselor',
}

export const normalizeRoleKey = (roleValue) => {
    if (!roleValue) return '';
    return String(roleValue).trim().toUpperCase().replace(/\s+/g, '_');
}

export const getRolePath = (roleValue) => {
    const key = normalizeRoleKey(roleValue);
    return ROLE_PATH_MAP[key] || 'user';
}

export const PLATFORM_ACCOUNT = {
    id: 'platform',
    companyName: 'WhatsApp CRM Platform',
    workspaceCode: 'SUPER-GLOBAL',
    planTier: 'Platform Owner',
    status: 'Active',
    industry: 'Multi-Tenant Control',
    country: 'Global',
};

const safeParseJson = (raw) => {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const useAppStore = create((set) => {
    // Attempt to recover demo session from localStorage
    const parsedUser = safeParseJson(localStorage.getItem('user'));
    const parsedAccount = safeParseJson(localStorage.getItem('demo_customer_account'));
    const parsedBranding = safeParseJson(localStorage.getItem('demo_branding'));
    const initialBranding = { ...DEFAULT_BRANDING, ...(parsedBranding || {}) };
    applyBrandingCssVars(initialBranding);

    // Determine initial role cleanly
    const rawRole = parsedUser?.role || localStorage.getItem('role') || 'Super Admin';
    const initialRole = ROLE_MAP[normalizeRoleKey(rawRole)] || rawRole;

    const initialAccount = parsedAccount || (
        parsedUser
            ? (normalizeRoleKey(parsedUser.role) === 'SUPER_ADMIN' ? PLATFORM_ACCOUNT : mockCustomerAccounts[0])
            : null
    );

    return {
        role: initialRole,
        isAuthenticated: !!parsedUser,
        user: parsedUser,
        selectedAccount: initialAccount,
        branding: initialBranding,
        country: parsedUser?.country || initialAccount?.country || 'Global',
        statusFilter: 'All Stages',
        dateRange: { label: 'Last 30 Days', from: null, to: null },
        userId: parsedUser?.id || 'usr-001',
        searchTerm: '',
        sidebarCollapsed: false,
        mobileMenuOpen: false,
        teamMember: 'All Operators',
        selectedLeadId: null,
        counselorId: parsedUser?.id || 'usr-005',

        setRole: (role) => {
            const displayRole = ROLE_MAP[normalizeRoleKey(role)] || role;
            localStorage.setItem('role', displayRole);
            set({ role: displayRole });
        },

        setSelectedAccount: (account) => {
            if (account) {
                localStorage.setItem('demo_customer_account', JSON.stringify(account));
            } else {
                localStorage.removeItem('demo_customer_account');
            }
            set({
                selectedAccount: account,
                country: account?.country || 'Global',
            });
        },

        setBranding: (nextBranding) => {
            const merged = { ...DEFAULT_BRANDING, ...(nextBranding || {}) };
            localStorage.setItem('demo_branding', JSON.stringify(merged));
            applyBrandingCssVars(merged);
            set({ branding: merged });
        },

        resetBranding: () => {
            localStorage.removeItem('demo_branding');
            applyBrandingCssVars(DEFAULT_BRANDING);
            set({ branding: { ...DEFAULT_BRANDING } });
        },

        updateUserProfile: (updates) => {
            set((state) => {
                if (!state.user) return {};
                const nextUser = { ...state.user, ...updates };
                localStorage.setItem('user', JSON.stringify(nextUser));
                return { user: nextUser };
            });
        },

        login: (backendRole, userData, customerAccount = null) => {
            const displayRole = ROLE_MAP[normalizeRoleKey(backendRole)] || backendRole;
            const resolvedAccount = customerAccount || (
                normalizeRoleKey(backendRole) === 'SUPER_ADMIN'
                    ? PLATFORM_ACCOUNT
                    : mockCustomerAccounts[0]
            );

            // Persist frontend demo session state only (no tokens or credentials)
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', displayRole);
            localStorage.setItem('demo_customer_account', JSON.stringify(resolvedAccount));

            set({
                role: displayRole,
                isAuthenticated: true,
                user: userData,
                selectedAccount: resolvedAccount,
                userId: userData.id,
                country: userData.country || resolvedAccount?.country || 'Global'
            });
        },

        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('demo_customer_account');
            set({
                isAuthenticated: false,
                user: null,
                selectedAccount: null,
                role: 'Super Admin',
                userId: null,
                searchTerm: '',
            });
            window.location.href = '/login';
        },

        setCountry: (country) => set({ country }),
        setDateRange: (range) => set({ dateRange: range }),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
        setStatusFilter: (status) => set({ statusFilter: status }),
        setTeamMember: (member) => set({ teamMember: member }),
        setSearchTerm: (term) => set({ searchTerm: term }),
        setSelectedLeadId: (id) => set({ selectedLeadId: id }),
    };
})

export default useAppStore


