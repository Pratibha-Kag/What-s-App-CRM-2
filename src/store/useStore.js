import { create } from 'zustand'
import {
    mockCustomerAccounts,
    mockMessagePricing,
    mockWalletTransactions,
} from '../mock/mockData'
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
    const parsedCustomers = safeParseJson(localStorage.getItem('demo_customers'));
    const parsedTransactions = safeParseJson(localStorage.getItem('demo_wallet_transactions'));
    const parsedPricing = safeParseJson(localStorage.getItem('demo_message_pricing'));
    const initialCustomers = Array.isArray(parsedCustomers) && parsedCustomers.length > 0
        ? parsedCustomers
        : mockCustomerAccounts;
    const initialTransactions = Array.isArray(parsedTransactions) && parsedTransactions.length > 0
        ? parsedTransactions
        : mockWalletTransactions;
    const initialPricing = parsedPricing && typeof parsedPricing === 'object'
        ? { ...mockMessagePricing, ...parsedPricing }
        : mockMessagePricing;
    const initialBranding = { ...DEFAULT_BRANDING, ...(parsedBranding || {}) };
    applyBrandingCssVars(initialBranding);

    // Determine initial role cleanly
    const rawRole = parsedUser?.role || localStorage.getItem('role') || 'Super Admin';
    const initialRole = ROLE_MAP[normalizeRoleKey(rawRole)] || rawRole;

    const initialAccount = parsedAccount || (
        parsedUser
            ? (normalizeRoleKey(parsedUser.role) === 'SUPER_ADMIN' ? PLATFORM_ACCOUNT : initialCustomers[0])
            : null
    );

    return {
        role: initialRole,
        isAuthenticated: !!parsedUser,
        user: parsedUser,
        selectedAccount: initialAccount,
        customers: initialCustomers,
        walletTransactions: initialTransactions,
        messagePricing: initialPricing,
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

        addCustomer: (customerData) => {
            let created = null;
            set((state) => {
                const nextIndex = state.customers.length + 1;
                const id = `cust-${String(nextIndex).padStart(3, '0')}`;
                const cleanCode = (customerData.companyName || 'CUST')
                    .replace(/[^A-Za-z0-9]/g, '')
                    .slice(0, 4)
                    .toUpperCase() || 'CUST';

                created = {
                    id,
                    workspaceCode: `${cleanCode}-WA-${String(nextIndex).padStart(2, '0')}`,
                    activeSeats: Number(customerData.activeSeats) || 5,
                    contactsCount: Number(customerData.contactsCount) || 0,
                    leadsCount: Number(customerData.leadsCount) || 0,
                    conversionsCount: Number(customerData.conversionsCount) || 0,
                    messagesSent: Number(customerData.messagesSent) || 0,
                    monthlyQuotaCount: Number(customerData.monthlyQuotaCount) || 50000,
                    monthlyQuota: `${(Number(customerData.monthlyQuotaCount) || 50000).toLocaleString()} msgs`,
                    walletBalance: Number(customerData.walletBalance) || 250,
                    monthlySpend: Number(customerData.monthlySpend) || 0,
                    country: customerData.country || 'USA',
                    industry: customerData.industry || 'General Business',
                    whatsappNumber: customerData.phone,
                    adminEmail: customerData.email,
                    monthlyPerformance: [
                        { month: 'Jun', leads: 10, conversions: 2, messages: 400 },
                        { month: 'Jul', leads: 14, conversions: 3, messages: 620 },
                        { month: 'Aug', leads: 18, conversions: 4, messages: 810 },
                        { month: 'Sep', leads: 22, conversions: 6, messages: 950 },
                        { month: 'Oct', leads: 25, conversions: 7, messages: 1120 },
                        { month: 'Nov', leads: 29, conversions: 8, messages: 1340 },
                    ],
                    recentLeads: [],
                    recentActivity: [
                        { id: `act-${Date.now()}`, action: 'Customer workspace provisioned', time: 'Just now', actor: state.user?.name || 'Super Admin' },
                    ],
                    reselling: {
                        product: customerData.assignedSoftware,
                        plan: customerData.planTier || 'Pro',
                        monthlyPrice: Number(customerData.monthlyPrice) || 199,
                        activationDate: customerData.activationDate || new Date().toISOString().split('T')[0],
                        billingCycle: customerData.billingCycle || 'Monthly',
                        status: customerData.status || 'Active',
                    },
                    ...customerData,
                };
                const nextCustomers = [created, ...state.customers];
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                return { customers: nextCustomers };
            });
            return created;
        },

        updateCustomer: (id, updates) => {
            set((state) => {
                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== id) return cust;
                    const merged = {
                        ...cust,
                        ...updates,
                        whatsappNumber: updates.phone ?? cust.whatsappNumber,
                        adminEmail: updates.email ?? cust.adminEmail,
                        monthlyQuota: updates.monthlyQuotaCount
                            ? `${Number(updates.monthlyQuotaCount).toLocaleString()} msgs`
                            : cust.monthlyQuota,
                    };
                    return merged;
                });
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                const nextSelected = state.selectedAccount?.id === id
                    ? nextCustomers.find((c) => c.id === id) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === id) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }
                return { customers: nextCustomers, selectedAccount: nextSelected };
            });
        },

        setCustomerStatus: (id, status) => {
            set((state) => {
                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== id) return cust;
                    return {
                        ...cust,
                        status,
                        reselling: cust.reselling ? { ...cust.reselling, status } : cust.reselling,
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `Account status changed to ${status}`,
                                time: 'Just now',
                                actor: state.user?.name || 'Super Admin',
                            },
                            ...(cust.recentActivity || []),
                        ],
                    };
                });
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                const nextSelected = state.selectedAccount?.id === id
                    ? nextCustomers.find((c) => c.id === id) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === id) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }
                return { customers: nextCustomers, selectedAccount: nextSelected };
            });
        },

        updateCustomerReselling: (id, resellingUpdates) => {
            set((state) => {
                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== id) return cust;
                    return {
                        ...cust,
                        assignedSoftware: resellingUpdates.product || cust.assignedSoftware,
                        planTier: resellingUpdates.plan || cust.planTier,
                        reselling: {
                            ...(cust.reselling || {}),
                            ...resellingUpdates,
                        },
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `Software reselling updated (${resellingUpdates.product || cust.assignedSoftware})`,
                                time: 'Just now',
                                actor: state.user?.name || 'Super Admin',
                            },
                            ...(cust.recentActivity || []),
                        ],
                    };
                });
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                const nextSelected = state.selectedAccount?.id === id
                    ? nextCustomers.find((c) => c.id === id) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === id) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }
                return { customers: nextCustomers, selectedAccount: nextSelected };
            });
        },

        // Phase 04: Frontend-only Customer Wallet, Usage Deduction & Billing Actions
        rechargeCustomerWallet: ({ customerId, amount, paymentMethod, simulateFailure = false, note = '' }) => {
            const numericAmount = Number(Number(amount).toFixed(2));
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                return { ok: false, error: 'Enter a valid recharge amount greater than $0.00.' };
            }

            let result = { ok: false, error: 'Customer account not found.' };

            set((state) => {
                const targetCustomer = state.customers.find((c) => c.id === customerId);
                if (!targetCustomer) return {};

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;
                const currentBalance = Number(targetCustomer.walletBalance) || 0;
                const txnId = `TXN-${Math.floor(10000 + Math.random() * 89999)}`;

                if (simulateFailure) {
                    const failedTxn = {
                        id: txnId,
                        customerId: targetCustomer.id,
                        customerName: targetCustomer.companyName,
                        date: dateStr,
                        timestamp: timeStr,
                        type: 'Recharge',
                        category: null,
                        quantity: null,
                        unitPrice: null,
                        amount: numericAmount,
                        balanceAfter: currentBalance,
                        status: 'Failed',
                        paymentMethod: paymentMethod || 'Demo Card •••• 4242',
                        invoiceNumber: null,
                        actor: state.user?.name || targetCustomer.contactPerson,
                        note: note || 'Simulated payment declined by demo gateway. Wallet balance unchanged.',
                    };
                    const nextTransactions = [failedTxn, ...state.walletTransactions];
                    localStorage.setItem('demo_wallet_transactions', JSON.stringify(nextTransactions));
                    result = {
                        ok: false,
                        transaction: failedTxn,
                        newBalance: currentBalance,
                        error: failedTxn.note,
                    };
                    return { walletTransactions: nextTransactions };
                }

                const newBalance = Number((currentBalance + numericAmount).toFixed(2));
                const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1200 + Math.random() * 8799)}`;
                const successTxn = {
                    id: txnId,
                    customerId: targetCustomer.id,
                    customerName: targetCustomer.companyName,
                    date: dateStr,
                    timestamp: timeStr,
                    type: 'Recharge',
                    category: null,
                    quantity: null,
                    unitPrice: null,
                    amount: numericAmount,
                    balanceAfter: newBalance,
                    status: 'Success',
                    paymentMethod: paymentMethod || 'Demo Card •••• 4242',
                    invoiceNumber,
                    actor: state.user?.name || targetCustomer.contactPerson,
                    note: note || `Wallet recharged via ${paymentMethod || 'Demo Payment Gateway'}`,
                };

                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== customerId) return cust;
                    return {
                        ...cust,
                        walletBalance: newBalance,
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `Wallet recharged +$${numericAmount.toFixed(2)} (${invoiceNumber})`,
                                time: 'Just now',
                                actor: state.user?.name || cust.contactPerson,
                            },
                            ...(cust.recentActivity || []),
                        ],
                    };
                });

                const nextTransactions = [successTxn, ...state.walletTransactions];
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                localStorage.setItem('demo_wallet_transactions', JSON.stringify(nextTransactions));

                const nextSelected = state.selectedAccount?.id === customerId
                    ? nextCustomers.find((c) => c.id === customerId) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === customerId) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }

                result = {
                    ok: true,
                    transaction: successTxn,
                    newBalance,
                };
                return {
                    customers: nextCustomers,
                    walletTransactions: nextTransactions,
                    selectedAccount: nextSelected,
                };
            });

            return result;
        },

        simulateMessageDeduction: ({ customerId, category, quantity, note = '' }) => {
            const qty = Math.floor(Number(quantity));
            if (!Number.isFinite(qty) || qty <= 0) {
                return { ok: false, error: 'Enter a message quantity greater than 0.' };
            }

            let result = { ok: false, error: 'Unable to process message deduction.' };

            set((state) => {
                const targetCustomer = state.customers.find((c) => c.id === customerId);
                const rateObj = state.messagePricing?.[category];
                if (!targetCustomer || !rateObj) {
                    result = { ok: false, error: 'Invalid customer or message category selected.' };
                    return {};
                }

                const unitPrice = Number(rateObj.unitPrice) || 0;
                const totalCost = Number((qty * unitPrice).toFixed(2));
                const currentBalance = Number(targetCustomer.walletBalance) || 0;
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;
                const txnId = `TXN-${Math.floor(10000 + Math.random() * 89999)}`;

                if (totalCost > currentBalance) {
                    const blockedTxn = {
                        id: txnId,
                        customerId: targetCustomer.id,
                        customerName: targetCustomer.companyName,
                        date: dateStr,
                        timestamp: timeStr,
                        type: 'Deduction',
                        category,
                        quantity: qty,
                        unitPrice,
                        amount: totalCost,
                        balanceAfter: currentBalance,
                        status: 'Failed',
                        paymentMethod: 'Wallet Balance',
                        invoiceNumber: null,
                        actor: 'Billing Guard (Demo)',
                        note: `Insufficient balance: required $${totalCost.toFixed(2)}, available $${currentBalance.toFixed(2)}`,
                    };
                    const nextTransactions = [blockedTxn, ...state.walletTransactions];
                    localStorage.setItem('demo_wallet_transactions', JSON.stringify(nextTransactions));
                    result = {
                        ok: false,
                        transaction: blockedTxn,
                        required: totalCost,
                        available: currentBalance,
                        error: `Insufficient wallet balance ($${currentBalance.toFixed(2)} available, $${totalCost.toFixed(2)} required). Please recharge wallet first.`,
                    };
                    return { walletTransactions: nextTransactions };
                }

                const newBalance = Number((currentBalance - totalCost).toFixed(2));
                const nextMessagesSent = (Number(targetCustomer.messagesSent) || 0) + qty;
                const nextMonthlySpend = Number(((Number(targetCustomer.monthlySpend) || 0) + totalCost).toFixed(2));

                const deductionTxn = {
                    id: txnId,
                    customerId: targetCustomer.id,
                    customerName: targetCustomer.companyName,
                    date: dateStr,
                    timestamp: timeStr,
                    type: 'Deduction',
                    category,
                    quantity: qty,
                    unitPrice,
                    amount: totalCost,
                    balanceAfter: newBalance,
                    status: 'Success',
                    paymentMethod: 'Wallet Balance',
                    invoiceNumber: null,
                    actor: state.user?.name || 'Usage Simulator (Demo)',
                    note: note || `Simulated ${category} batch (${qty.toLocaleString()} msgs @ $${unitPrice.toFixed(3)})`,
                };

                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== customerId) return cust;
                    return {
                        ...cust,
                        walletBalance: newBalance,
                        messagesSent: nextMessagesSent,
                        monthlySpend: nextMonthlySpend,
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `${category} usage simulated (${qty.toLocaleString()} msgs, -$${totalCost.toFixed(2)})`,
                                time: 'Just now',
                                actor: state.user?.name || 'System',
                            },
                            ...(cust.recentActivity || []),
                        ],
                    };
                });

                const nextTransactions = [deductionTxn, ...state.walletTransactions];
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                localStorage.setItem('demo_wallet_transactions', JSON.stringify(nextTransactions));

                const nextSelected = state.selectedAccount?.id === customerId
                    ? nextCustomers.find((c) => c.id === customerId) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === customerId) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }

                result = {
                    ok: true,
                    transaction: deductionTxn,
                    newBalance,
                };
                return {
                    customers: nextCustomers,
                    walletTransactions: nextTransactions,
                    selectedAccount: nextSelected,
                };
            });

            return result;
        },

        adjustCustomerWallet: ({ customerId, type, amount, reason }) => {
            const numericAmount = Number(Number(amount).toFixed(2));
            const cleanReason = String(reason || '').trim();
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                return { ok: false, error: 'Adjustment amount must be greater than $0.00.' };
            }
            if (!cleanReason) {
                return { ok: false, error: 'Please provide a reason for the manual adjustment.' };
            }
            if (type !== 'Credit' && type !== 'Debit') {
                return { ok: false, error: 'Invalid adjustment type.' };
            }

            let result = { ok: false, error: 'Customer account not found.' };

            set((state) => {
                const targetCustomer = state.customers.find((c) => c.id === customerId);
                if (!targetCustomer) return {};

                const currentBalance = Number(targetCustomer.walletBalance) || 0;
                if (type === 'Debit' && numericAmount > currentBalance) {
                    result = {
                        ok: false,
                        error: `Cannot debit $${numericAmount.toFixed(2)} — available balance is $${currentBalance.toFixed(2)}.`,
                    };
                    return {};
                }

                const newBalance = type === 'Credit'
                    ? Number((currentBalance + numericAmount).toFixed(2))
                    : Number((currentBalance - numericAmount).toFixed(2));

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;
                const txn = {
                    id: `TXN-${Math.floor(10000 + Math.random() * 89999)}`,
                    customerId: targetCustomer.id,
                    customerName: targetCustomer.companyName,
                    date: dateStr,
                    timestamp: timeStr,
                    type,
                    category: null,
                    quantity: null,
                    unitPrice: null,
                    amount: numericAmount,
                    balanceAfter: newBalance,
                    status: 'Success',
                    paymentMethod: 'Manual Adjustment',
                    invoiceNumber: type === 'Credit' ? `CRN-${now.getFullYear()}-${Math.floor(100 + Math.random() * 899)}` : null,
                    actor: state.user?.name || 'Super Admin',
                    note: cleanReason,
                };

                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== customerId) return cust;
                    return {
                        ...cust,
                        walletBalance: newBalance,
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `Manual ${type.toLowerCase()} ${type === 'Credit' ? '+' : '-'}$${numericAmount.toFixed(2)}: ${cleanReason}`,
                                time: 'Just now',
                                actor: state.user?.name || 'Super Admin',
                            },
                            ...(cust.recentActivity || []),
                        ],
                    };
                });

                const nextTransactions = [txn, ...state.walletTransactions];
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                localStorage.setItem('demo_wallet_transactions', JSON.stringify(nextTransactions));

                const nextSelected = state.selectedAccount?.id === customerId
                    ? nextCustomers.find((c) => c.id === customerId) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === customerId) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }

                result = { ok: true, transaction: txn, newBalance };
                return {
                    customers: nextCustomers,
                    walletTransactions: nextTransactions,
                    selectedAccount: nextSelected,
                };
            });

            return result;
        },

        updateMessagePricing: (pricingUpdates) => {
            set((state) => {
                const nextPricing = { ...state.messagePricing };
                Object.keys(mockMessagePricing).forEach((cat) => {
                    const incoming = pricingUpdates?.[cat];
                    const parsedRate = Number(incoming?.unitPrice ?? incoming);
                    nextPricing[cat] = {
                        ...mockMessagePricing[cat],
                        ...(state.messagePricing?.[cat] || {}),
                        unitPrice: Number.isFinite(parsedRate) && parsedRate > 0
                            ? Number(parsedRate.toFixed(4))
                            : mockMessagePricing[cat].unitPrice,
                    };
                });
                localStorage.setItem('demo_message_pricing', JSON.stringify(nextPricing));
                return { messagePricing: nextPricing };
            });
        },

        resetMessagePricing: () => {
            localStorage.removeItem('demo_message_pricing');
            set({ messagePricing: mockMessagePricing });
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


