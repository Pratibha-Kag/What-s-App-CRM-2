import { create } from 'zustand'

// Maps backend role enum → frontend role string used throughout app
export const ROLE_MAP = {
    'SUPER_ADMIN': 'Super Admin',
    'ADMIN': 'Admin',
    'MANAGER': 'Manager',
    'TEAM_LEADER': 'Team Leader',
    'COUNSELOR': 'Counselor',
    'SUPPORT': 'Customer Support',
}

const useAppStore = create((set) => {
    // Attempt to recover session from localStorage
    const savedUser = localStorage.getItem('user');
    let parsedUser = null;
    try {
        parsedUser = savedUser ? JSON.parse(savedUser) : null;
    } catch {
        parsedUser = null;
    }
    
    // Determine initial role
    const initialRole = parsedUser 
        ? (ROLE_MAP[parsedUser.role] || parsedUser.role) 
        : (localStorage.getItem('role') || 'Super Admin');

    return {
        role: initialRole,
        isAuthenticated: !!parsedUser,
        user: parsedUser,
        country: parsedUser?.country || 'Global',
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
            localStorage.setItem('role', role);
            set({ role });
        },

        login: (backendRole, userData) => {
            // Map backend enum to display name
            const displayRole = ROLE_MAP[backendRole] || backendRole;
            
            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', displayRole);
            localStorage.setItem('token', 'mock-session-token');
            
            set({
                role: displayRole,
                isAuthenticated: true,
                user: userData,
                userId: userData.id,
                country: userData.country || 'Global'
            });
        },

        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('refreshToken');
            set({ 
                isAuthenticated: false, 
                user: null, 
                role: 'Super Admin',
                userId: null
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


