import { create } from 'zustand'
import {
    buildDefaultIntegrationsForCustomer,
    mockContacts,
    mockCustomerAccounts,
    mockExternalIntegrationsByCustomer,
    mockExternalSyncLogs,
    mockExternalSyncPreview,
    mockLeadAutomationConfig,
    mockLeads,
    mockLeadSources,
    mockMessagePricing,
    mockUsers,
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
    const parsedLeads = safeParseJson(localStorage.getItem('demo_leads'));
    const parsedContacts = safeParseJson(localStorage.getItem('demo_contacts'));
    const parsedLeadSources = safeParseJson(localStorage.getItem('demo_lead_sources'));
    const parsedAutomation = safeParseJson(localStorage.getItem('demo_lead_automation'));
    const parsedExtIntegrations = safeParseJson(localStorage.getItem('demo_external_integrations'));
    const parsedExtLogs = safeParseJson(localStorage.getItem('demo_external_sync_logs'));
    const parsedExtPreview = safeParseJson(localStorage.getItem('demo_external_sync_preview'));
    const initialCustomers = Array.isArray(parsedCustomers) && parsedCustomers.length > 0
        ? parsedCustomers
        : mockCustomerAccounts;
    const initialTransactions = Array.isArray(parsedTransactions) && parsedTransactions.length > 0
        ? parsedTransactions
        : mockWalletTransactions;
    const initialPricing = parsedPricing && typeof parsedPricing === 'object'
        ? { ...mockMessagePricing, ...parsedPricing }
        : mockMessagePricing;
    const initialLeads = Array.isArray(parsedLeads) && parsedLeads.length > 0
        ? parsedLeads
        : mockLeads;
    const initialContacts = Array.isArray(parsedContacts) && parsedContacts.length > 0
        ? parsedContacts
        : mockContacts;
    const initialLeadSources = Array.isArray(parsedLeadSources) && parsedLeadSources.length > 0
        ? parsedLeadSources
        : mockLeadSources;
    const initialAutomation = parsedAutomation && typeof parsedAutomation === 'object'
        ? { ...mockLeadAutomationConfig, ...parsedAutomation }
        : mockLeadAutomationConfig;
    const initialExtIntegrations = parsedExtIntegrations && typeof parsedExtIntegrations === 'object'
        ? parsedExtIntegrations
        : mockExternalIntegrationsByCustomer;
    const initialExtLogs = Array.isArray(parsedExtLogs) && parsedExtLogs.length > 0
        ? parsedExtLogs
        : mockExternalSyncLogs;
    const initialExtPreview = parsedExtPreview && typeof parsedExtPreview === 'object'
        ? parsedExtPreview
        : mockExternalSyncPreview;
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
        leads: initialLeads,
        contacts: initialContacts,
        leadSources: initialLeadSources,
        leadAutomationConfig: initialAutomation,
        externalIntegrationsByCustomer: initialExtIntegrations,
        externalSyncLogs: initialExtLogs,
        externalSyncPreview: initialExtPreview,
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

        // Phase 05: CRM Contacts, Leads, Duplicate Handling & Lead Source Integrations
        findDuplicateMatch: ({ email, phone, excludeLeadId = null }) => {
            let match = null;
            set((state) => {
                const targetEmail = String(email || '').trim().toLowerCase();
                const normDigits = (v) => String(v || '').replace(/\D/g, '');
                const samePhone = (a, b) => {
                    const da = normDigits(a);
                    const db = normDigits(b);
                    if (da.length < 7 || db.length < 7) return false;
                    return da === db || da.slice(-9) === db.slice(-9);
                };
                const existingLead = state.leads.find((l) => {
                    if (excludeLeadId != null && String(l.id) === String(excludeLeadId)) return false;
                    return (targetEmail && String(l.email || '').trim().toLowerCase() === targetEmail) || samePhone(phone, l.phone);
                });
                const existingContact = state.contacts.find((c) => {
                    return (targetEmail && String(c.email || '').trim().toLowerCase() === targetEmail) || samePhone(phone, c.phone);
                });
                if (existingLead || existingContact) {
                    const reasons = [];
                    if (
                        (existingLead && targetEmail && String(existingLead.email || '').trim().toLowerCase() === targetEmail) ||
                        (existingContact && targetEmail && String(existingContact.email || '').trim().toLowerCase() === targetEmail)
                    ) {
                        reasons.push('Email');
                    }
                    if (
                        (existingLead && samePhone(phone, existingLead.phone)) ||
                        (existingContact && samePhone(phone, existingContact.phone))
                    ) {
                        reasons.push('Phone');
                    }
                    match = {
                        existingLead: existingLead || null,
                        existingContact: existingContact || null,
                        matchedBy: reasons.join(' & ') || 'Email / Phone',
                    };
                }
                return {};
            });
            return match;
        },

        addCrmLead: (leadData, { forceCreate = false } = {}) => {
            let outcome = { ok: false };
            set((state) => {
                const targetCustomer =
                    state.customers.find((c) => c.id === leadData.customerId) ||
                    (state.selectedAccount?.id && state.selectedAccount.id !== 'platform'
                        ? state.customers.find((c) => c.id === state.selectedAccount.id)
                        : null) ||
                    state.customers[0];

                const targetEmail = String(leadData.email || '').trim().toLowerCase();
                const normDigits = (v) => String(v || '').replace(/\D/g, '');
                const samePhone = (a, b) => {
                    const da = normDigits(a);
                    const db = normDigits(b);
                    if (da.length < 7 || db.length < 7) return false;
                    return da === db || da.slice(-9) === db.slice(-9);
                };

                if (!forceCreate) {
                    const existingLead = state.leads.find((l) =>
                        (targetEmail && String(l.email || '').trim().toLowerCase() === targetEmail) || samePhone(leadData.phone, l.phone)
                    );
                    const existingContact = state.contacts.find((c) =>
                        (targetEmail && String(c.email || '').trim().toLowerCase() === targetEmail) || samePhone(leadData.phone, c.phone)
                    );
                    if (existingLead || existingContact) {
                        const reasons = [];
                        if (
                            (existingLead && targetEmail && String(existingLead.email || '').trim().toLowerCase() === targetEmail) ||
                            (existingContact && targetEmail && String(existingContact.email || '').trim().toLowerCase() === targetEmail)
                        ) {
                            reasons.push('Email');
                        }
                        if (
                            (existingLead && samePhone(leadData.phone, existingLead.phone)) ||
                            (existingContact && samePhone(leadData.phone, existingContact.phone))
                        ) {
                            reasons.push('Phone');
                        }
                        outcome = {
                            ok: false,
                            duplicate: {
                                existingLead: existingLead || null,
                                existingContact: existingContact || null,
                                matchedBy: reasons.join(' & ') || 'Email / Phone',
                            },
                        };
                        return {};
                    }
                }

                const nextId = Math.max(...state.leads.map((l) => Number(l.id) || 0), 100) + 1;
                const assignedUser = mockUsers.find((u) => u.id === leadData.assigned_to);
                const nowIso = new Date().toISOString();
                const newLead = {
                    id: nextId,
                    customerId: targetCustomer?.id || 'cust-001',
                    companyName: targetCustomer?.companyName || 'Apex Digital Solutions',
                    name: String(leadData.name || 'New Lead').trim(),
                    phone: String(leadData.phone || '').trim(),
                    email: String(leadData.email || '').trim(),
                    country: leadData.country || leadData.interested_country || targetCustomer?.country || 'Global',
                    interested_country: leadData.country || leadData.interested_country || targetCustomer?.country || 'Global',
                    qualification: leadData.qualification || leadData.academic_background || '-',
                    academic_background: leadData.qualification || leadData.academic_background || '-',
                    ielts_score: leadData.ielts_score || '-',
                    source: leadData.source || 'WhatsApp',
                    stage: leadData.stage || 'New',
                    assigned_to: assignedUser?.id || leadData.assigned_to || null,
                    assigned_name: assignedUser?.name || leadData.assigned_name || null,
                    last_conversation_date: nowIso,
                    next_followup_date: leadData.next_followup_date || null,
                    created_at: nowIso,
                };

                const nextLeads = [newLead, ...state.leads];
                localStorage.setItem('demo_leads', JSON.stringify(nextLeads));

                // Also upsert into CRM Contacts if missing
                const hasContact = state.contacts.some((c) =>
                    (targetEmail && String(c.email || '').trim().toLowerCase() === targetEmail) || samePhone(newLead.phone, c.phone)
                );
                let nextContacts = state.contacts;
                let contactAdded = false;
                if (!hasContact) {
                    const newContact = {
                        id: `cnt-${Date.now().toString().slice(-5)}`,
                        customerId: newLead.customerId,
                        companyName: newLead.companyName,
                        name: newLead.name,
                        phone: newLead.phone,
                        email: newLead.email,
                        channel: newLead.source === 'Meta Ads' || newLead.source === 'Facebook' ? 'Meta Ads' : newLead.source,
                        source: newLead.source,
                        label: newLead.stage === 'Converted' ? 'VIP Customer' : `${newLead.stage} Lead`,
                        lastContacted: 'Just now',
                        customerSince: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        orders: [],
                        activities: [
                            {
                                id: `cact-${Date.now()}`,
                                title: `Lead captured from ${newLead.source}`,
                                time: 'Just now',
                                detail: `Added to ${newLead.companyName} (${newLead.country || 'Global'})`,
                            },
                        ],
                    };
                    nextContacts = [newContact, ...state.contacts];
                    localStorage.setItem('demo_contacts', JSON.stringify(nextContacts));
                    contactAdded = true;
                }

                // Sync customer dashboard counts & recent activity/leads
                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== newLead.customerId) return cust;
                    return {
                        ...cust,
                        leadsCount: (Number(cust.leadsCount) || 0) + 1,
                        contactsCount: (Number(cust.contactsCount) || 0) + (contactAdded ? 1 : 0),
                        conversionsCount: (Number(cust.conversionsCount) || 0) + (newLead.stage === 'Converted' ? 1 : 0),
                        recentLeads: [
                            {
                                id: `lead-${newLead.id}`,
                                name: newLead.name,
                                phone: newLead.phone || newLead.email,
                                stage: newLead.stage,
                                source: newLead.source,
                                updatedAt: 'Just now',
                            },
                            ...(cust.recentLeads || []).slice(0, 4),
                        ],
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `New ${newLead.source} lead captured: ${newLead.name}`,
                                time: 'Just now',
                                actor: state.user?.name || 'CRM Sync (Demo)',
                            },
                            ...(cust.recentActivity || []).slice(0, 6),
                        ],
                    };
                });
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));

                const nextSelected = state.selectedAccount?.id === newLead.customerId
                    ? nextCustomers.find((c) => c.id === newLead.customerId) || state.selectedAccount
                    : state.selectedAccount;
                if (nextSelected && state.selectedAccount?.id === newLead.customerId) {
                    localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                }

                outcome = { ok: true, lead: newLead, contactAdded };
                return {
                    leads: nextLeads,
                    contacts: nextContacts,
                    customers: nextCustomers,
                    selectedAccount: nextSelected,
                };
            });
            return outcome;
        },

        mergeDuplicateLead: ({ existingLeadId, existingContactId = null, incomingLead }) => {
            let mergedRecord = null;
            set((state) => {
                const nowIso = new Date().toISOString();
                let affectedCustomerId = null;

                const nextLeads = state.leads.map((l) => {
                    if (String(l.id) !== String(existingLeadId)) return l;
                    affectedCustomerId = l.customerId;
                    mergedRecord = {
                        ...l,
                        name: incomingLead.name || l.name,
                        phone: incomingLead.phone || l.phone,
                        email: incomingLead.email || l.email,
                        country: incomingLead.country || l.country,
                        interested_country: incomingLead.country || l.interested_country,
                        qualification: incomingLead.qualification || l.qualification,
                        academic_background: incomingLead.qualification || l.academic_background,
                        ielts_score: incomingLead.ielts_score || l.ielts_score,
                        last_conversation_date: nowIso,
                    };
                    return mergedRecord;
                });
                localStorage.setItem('demo_leads', JSON.stringify(nextLeads));

                const nextContacts = state.contacts.map((c) => {
                    const isMatch = existingContactId
                        ? c.id === existingContactId
                        : mergedRecord && (
                            (mergedRecord.email && String(c.email || '').toLowerCase() === String(mergedRecord.email).toLowerCase()) ||
                            (mergedRecord.phone && String(c.phone || '').replace(/\D/g, '').slice(-9) === String(mergedRecord.phone).replace(/\D/g, '').slice(-9))
                        );
                    if (!isMatch) return c;
                    affectedCustomerId = affectedCustomerId || c.customerId;
                    return {
                        ...c,
                        name: incomingLead.name || c.name,
                        phone: incomingLead.phone || c.phone,
                        email: incomingLead.email || c.email,
                        lastContacted: 'Just now',
                        activities: [
                            {
                                id: `cact-${Date.now()}`,
                                title: `Duplicate merged from ${incomingLead.source || 'Lead Source'}`,
                                time: 'Just now',
                                detail: 'Updated existing CRM profile with incoming submission.',
                            },
                            ...(c.activities || []),
                        ],
                    };
                });
                localStorage.setItem('demo_contacts', JSON.stringify(nextContacts));

                const nextCustomers = state.customers.map((cust) => {
                    if (cust.id !== affectedCustomerId) return cust;
                    return {
                        ...cust,
                        recentActivity: [
                            {
                                id: `act-${Date.now()}`,
                                action: `Duplicate lead merged for ${mergedRecord?.name || incomingLead.name}`,
                                time: 'Just now',
                                actor: state.user?.name || 'Duplicate Reviewer',
                            },
                            ...(cust.recentActivity || []).slice(0, 6),
                        ],
                    };
                });
                localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));

                return {
                    leads: nextLeads,
                    contacts: nextContacts,
                    customers: nextCustomers,
                };
            });
            return mergedRecord;
        },

        updateCrmLead: (leadId, updates) => {
            set((state) => {
                let customerDelta = null;
                const nextLeads = state.leads.map((lead) => {
                    if (String(lead.id) !== String(leadId)) return lead;
                    const prevConverted = lead.stage === 'Converted';
                    const nextStage = updates.stage !== undefined ? updates.stage : lead.stage;
                    const nextConverted = nextStage === 'Converted';
                    if (prevConverted !== nextConverted) {
                        customerDelta = {
                            customerId: lead.customerId,
                            delta: nextConverted ? 1 : -1,
                            leadName: updates.name || lead.name,
                            nextStage,
                        };
                    }
                    const nextCustomer = updates.customerId
                        ? state.customers.find((c) => c.id === updates.customerId)
                        : null;
                    return {
                        ...lead,
                        ...updates,
                        interested_country: updates.country ?? lead.interested_country,
                        academic_background: updates.qualification ?? lead.academic_background,
                        companyName: nextCustomer ? nextCustomer.companyName : lead.companyName,
                    };
                });
                localStorage.setItem('demo_leads', JSON.stringify(nextLeads));

                let nextCustomers = state.customers;
                let nextSelected = state.selectedAccount;
                if (customerDelta) {
                    nextCustomers = state.customers.map((cust) => {
                        if (cust.id !== customerDelta.customerId) return cust;
                        return {
                            ...cust,
                            conversionsCount: Math.max(0, (Number(cust.conversionsCount) || 0) + customerDelta.delta),
                            recentActivity: [
                                {
                                    id: `act-${Date.now()}`,
                                    action: `${customerDelta.leadName} stage changed to ${customerDelta.nextStage}`,
                                    time: 'Just now',
                                    actor: state.user?.name || 'CRM Operator',
                                },
                                ...(cust.recentActivity || []).slice(0, 6),
                            ],
                        };
                    });
                    localStorage.setItem('demo_customers', JSON.stringify(nextCustomers));
                    if (state.selectedAccount?.id === customerDelta.customerId) {
                        nextSelected = nextCustomers.find((c) => c.id === customerDelta.customerId) || state.selectedAccount;
                        localStorage.setItem('demo_customer_account', JSON.stringify(nextSelected));
                    }
                }

                return {
                    leads: nextLeads,
                    customers: nextCustomers,
                    selectedAccount: nextSelected,
                };
            });
        },

        assignCrmLead: (leadId, assigneeId) => {
            const assignedUser = mockUsers.find((u) => u.id === assigneeId);
            set((state) => {
                const nextLeads = state.leads.map((lead) =>
                    String(lead.id) === String(leadId)
                        ? {
                              ...lead,
                              assigned_to: assigneeId || null,
                              assigned_name: assignedUser ? assignedUser.name : null,
                          }
                        : lead
                );
                localStorage.setItem('demo_leads', JSON.stringify(nextLeads));
                return { leads: nextLeads };
            });
        },

        updateLeadSource: (sourceId, updates) => {
            set((state) => {
                const nextSources = state.leadSources.map((src) => {
                    if (src.id !== sourceId) return src;
                    return {
                        ...src,
                        ...updates,
                        config: updates.config ? { ...src.config, ...updates.config } : src.config,
                        fieldMapping: updates.fieldMapping ? { ...src.fieldMapping, ...updates.fieldMapping } : src.fieldMapping,
                    };
                });
                localStorage.setItem('demo_lead_sources', JSON.stringify(nextSources));
                return { leadSources: nextSources };
            });
        },

        testLeadSourceConnection: (sourceId) => {
            let updatedSource = null;
            set((state) => {
                const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`;
                const nextSources = state.leadSources.map((src) => {
                    if (src.id !== sourceId) return src;
                    updatedSource = {
                        ...src,
                        connected: true,
                        lastSync: nowStr,
                        lastTestStatus: 'Connection verified (Demo 200 OK)',
                    };
                    return updatedSource;
                });
                localStorage.setItem('demo_lead_sources', JSON.stringify(nextSources));
                return { leadSources: nextSources };
            });
            return updatedSource;
        },

        toggleLeadSource: (sourceId) => {
            set((state) => {
                const nextSources = state.leadSources.map((src) =>
                    src.id === sourceId ? { ...src, enabled: !src.enabled } : src
                );
                localStorage.setItem('demo_lead_sources', JSON.stringify(nextSources));
                return { leadSources: nextSources };
            });
        },

        recordLeadSourceSync: (sourceId) => {
            set((state) => {
                const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`;
                const nextSources = state.leadSources.map((src) =>
                    src.id === sourceId
                        ? {
                              ...src,
                              connected: true,
                              receivedCount: (Number(src.receivedCount) || 0) + 1,
                              lastSync: nowStr,
                          }
                        : src
                );
                localStorage.setItem('demo_lead_sources', JSON.stringify(nextSources));
                return { leadSources: nextSources };
            });
        },

        updateLeadAutomationConfig: (updates) => {
            set((state) => {
                const next = { ...state.leadAutomationConfig, ...updates };
                localStorage.setItem('demo_lead_automation', JSON.stringify(next));
                return { leadAutomationConfig: next };
            });
        },

        // Phase 06: External Software Integrations (Customer-scoped, Frontend-only)
        updateExternalIntegration: (customerId, softwareId, updates) => {
            set((state) => {
                const custObj = state.customers.find((c) => c.id === customerId) || state.customers[0];
                const currentList =
                    state.externalIntegrationsByCustomer[customerId] ||
                    buildDefaultIntegrationsForCustomer(custObj);
                const nextList = currentList.map((item) =>
                    item.id === softwareId ? { ...item, ...updates } : item
                );
                const nextMap = {
                    ...state.externalIntegrationsByCustomer,
                    [customerId]: nextList,
                };
                localStorage.setItem('demo_external_integrations', JSON.stringify(nextMap));
                return { externalIntegrationsByCustomer: nextMap };
            });
        },

        toggleExternalIntegration: (customerId, softwareId) => {
            set((state) => {
                const custObj = state.customers.find((c) => c.id === customerId) || state.customers[0];
                const currentList =
                    state.externalIntegrationsByCustomer[customerId] ||
                    buildDefaultIntegrationsForCustomer(custObj);
                const nextList = currentList.map((item) =>
                    item.id === softwareId ? { ...item, enabled: !item.enabled } : item
                );
                const nextMap = {
                    ...state.externalIntegrationsByCustomer,
                    [customerId]: nextList,
                };
                localStorage.setItem('demo_external_integrations', JSON.stringify(nextMap));
                return { externalIntegrationsByCustomer: nextMap };
            });
        },

        testExternalIntegrationConnection: (customerId, softwareId, simulateFailure = false) => {
            let outcome = { ok: !simulateFailure };
            set((state) => {
                const custObj = state.customers.find((c) => c.id === customerId) || state.customers[0];
                const currentList =
                    state.externalIntegrationsByCustomer[customerId] ||
                    buildDefaultIntegrationsForCustomer(custObj);
                const target = currentList.find((i) => i.id === softwareId);
                if (!target) return {};

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;

                const nextList = currentList.map((item) => {
                    if (item.id !== softwareId) return item;
                    return {
                        ...item,
                        connected: !simulateFailure,
                        lastConnectionResult: simulateFailure
                            ? 'Simulated auth error: invalid demo key (401)'
                            : 'Connected (Demo 200 OK)',
                    };
                });
                const nextMap = { ...state.externalIntegrationsByCustomer, [customerId]: nextList };
                localStorage.setItem('demo_external_integrations', JSON.stringify(nextMap));

                const logEntry = {
                    id: `LOG-${Math.floor(1000 + Math.random() * 8999)}`,
                    customerId,
                    customerName: custObj.companyName,
                    softwareId,
                    softwareName: target.softwareName,
                    date: dateStr,
                    timestamp: timeStr,
                    action: 'Connection Test',
                    recordsProcessed: 0,
                    successRecords: 0,
                    failedRecords: 0,
                    status: simulateFailure ? 'Failed' : 'Success',
                    message: simulateFailure
                        ? `Simulated connection test failed for ${target.apiEndpoint}`
                        : `Simulated connection test succeeded for ${target.apiEndpoint}`,
                };
                const nextLogs = [logEntry, ...state.externalSyncLogs];
                localStorage.setItem('demo_external_sync_logs', JSON.stringify(nextLogs));

                outcome = { ok: !simulateFailure, logEntry };
                return {
                    externalIntegrationsByCustomer: nextMap,
                    externalSyncLogs: nextLogs,
                };
            });
            return outcome;
        },

        runExternalSoftwareSync: (customerId, softwareId, simulatePartialFailure = false) => {
            let result = { ok: false };
            set((state) => {
                const custObj = state.customers.find((c) => c.id === customerId) || state.customers[0];
                const currentList =
                    state.externalIntegrationsByCustomer[customerId] ||
                    buildDefaultIntegrationsForCustomer(custObj);
                const target = currentList.find((i) => i.id === softwareId);
                if (!target) return {};

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;
                const batchSuccess = simulatePartialFailure ? 7 : 12;
                const batchFailed = simulatePartialFailure ? 2 : 0;

                const nextList = currentList.map((item) => {
                    if (item.id !== softwareId) return item;
                    return {
                        ...item,
                        connected: true,
                        lastSync: timeStr,
                        lastSyncStatus: simulatePartialFailure ? 'Partial Failed' : 'Synced',
                        successCount: (Number(item.successCount) || 0) + batchSuccess,
                        failedCount: (Number(item.failedCount) || 0) + batchFailed,
                    };
                });
                const nextMap = { ...state.externalIntegrationsByCustomer, [customerId]: nextList };
                localStorage.setItem('demo_external_integrations', JSON.stringify(nextMap));

                const logEntry = {
                    id: `LOG-${Math.floor(1000 + Math.random() * 8999)}`,
                    customerId,
                    customerName: custObj.companyName,
                    softwareId,
                    softwareName: target.softwareName,
                    date: dateStr,
                    timestamp: timeStr,
                    action: 'Manual Sync',
                    recordsProcessed: batchSuccess + batchFailed,
                    successRecords: batchSuccess,
                    failedRecords: batchFailed,
                    status: simulatePartialFailure ? 'Failed' : 'Success',
                    message: simulatePartialFailure
                        ? `Synced ${batchSuccess} records; ${batchFailed} failed validation (demo).`
                        : `Synchronized ${batchSuccess} customer, appointment & payment records.`,
                };
                const nextLogs = [logEntry, ...state.externalSyncLogs];
                localStorage.setItem('demo_external_sync_logs', JSON.stringify(nextLogs));

                const nextCustomersPreview = [
                    {
                        id: `EXT-C${Math.floor(300 + Math.random() * 699)}`,
                        customerId,
                        softwareId,
                        softwareName: target.shortName || target.softwareName,
                        name: `Synced Client (${target.category})`,
                        phone: '+1 (555) 602-' + String(Math.floor(1000 + Math.random() * 8999)),
                        email: `sync-${Date.now().toString().slice(-4)}@example.com`,
                        status: simulatePartialFailure ? 'Failed' : 'Synced',
                    },
                    ...(state.externalSyncPreview.customers || []),
                ].slice(0, 20);
                const nextPreview = {
                    ...state.externalSyncPreview,
                    customers: nextCustomersPreview,
                };
                localStorage.setItem('demo_external_sync_preview', JSON.stringify(nextPreview));

                result = { ok: true, logEntry, batchSuccess, batchFailed };
                return {
                    externalIntegrationsByCustomer: nextMap,
                    externalSyncLogs: nextLogs,
                    externalSyncPreview: nextPreview,
                };
            });
            return result;
        },

        retryFailedSyncLog: (logId) => {
            let retriedLog = null;
            set((state) => {
                const targetLog = state.externalSyncLogs.find((l) => l.id === logId);
                if (!targetLog) return {};

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;
                const recoveredCount = Math.max(1, Number(targetLog.failedRecords) || 1);

                const nextLogs = state.externalSyncLogs.map((l) =>
                    l.id === logId
                        ? {
                              ...l,
                              status: 'Success',
                              action: 'Retry Sync',
                              successRecords: (Number(l.successRecords) || 0) + recoveredCount,
                              failedRecords: 0,
                              timestamp: timeStr,
                              message: `Retry succeeded: ${recoveredCount} previously failed record(s) synchronized.`,
                          }
                        : l
                );
                localStorage.setItem('demo_external_sync_logs', JSON.stringify(nextLogs));

                const custObj = state.customers.find((c) => c.id === targetLog.customerId) || state.customers[0];
                const currentList =
                    state.externalIntegrationsByCustomer[targetLog.customerId] ||
                    buildDefaultIntegrationsForCustomer(custObj);
                const nextList = currentList.map((item) =>
                    item.id === targetLog.softwareId
                        ? {
                              ...item,
                              lastSync: timeStr,
                              lastSyncStatus: 'Synced',
                              successCount: (Number(item.successCount) || 0) + recoveredCount,
                              failedCount: Math.max(0, (Number(item.failedCount) || 0) - recoveredCount),
                          }
                        : item
                );
                const nextMap = {
                    ...state.externalIntegrationsByCustomer,
                    [targetLog.customerId]: nextList,
                };
                localStorage.setItem('demo_external_integrations', JSON.stringify(nextMap));

                const nextPreview = {
                    ...state.externalSyncPreview,
                    customers: (state.externalSyncPreview.customers || []).map((r) =>
                        r.customerId === targetLog.customerId && r.softwareId === targetLog.softwareId
                            ? { ...r, status: 'Synced' }
                            : r
                    ),
                    appointments: (state.externalSyncPreview.appointments || []).map((r) =>
                        r.customerId === targetLog.customerId && r.softwareId === targetLog.softwareId
                            ? { ...r, syncStatus: 'Synced' }
                            : r
                    ),
                };
                localStorage.setItem('demo_external_sync_preview', JSON.stringify(nextPreview));

                retriedLog = nextLogs.find((l) => l.id === logId);
                return {
                    externalSyncLogs: nextLogs,
                    externalIntegrationsByCustomer: nextMap,
                    externalSyncPreview: nextPreview,
                };
            });
            return retriedLog;
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


