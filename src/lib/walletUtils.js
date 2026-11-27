import { mockMessagePricing, mockWalletConfig } from '../mock/mockData';

export const formatCurrency = (value, symbol = mockWalletConfig.currencySymbol) => {
    const num = Number(value) || 0;
    return `${symbol}${num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const formatUnitPrice = (value, symbol = mockWalletConfig.currencySymbol) => {
    const num = Number(value) || 0;
    return `${symbol}${num.toFixed(3)}`;
};

/**
 * Classifies customer wallet balance into Healthy / Low / Insufficient health states.
 */
export const getWalletHealth = (balance) => {
    const amount = Number(balance) || 0;
    if (amount <= mockWalletConfig.criticalBalanceThreshold) {
        return {
            key: 'Insufficient',
            label: 'Insufficient Balance',
            badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
            textClass: 'text-rose-400',
            hint: 'Critically low or depleted. Immediate recharge required for outbound messaging.',
        };
    }
    if (amount <= mockWalletConfig.lowBalanceThreshold) {
        return {
            key: 'Low',
            label: 'Low Balance',
            badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
            textClass: 'text-amber-400',
            hint: `Below ${formatCurrency(mockWalletConfig.lowBalanceThreshold)} recommended threshold.`,
        };
    }
    return {
        key: 'Healthy',
        label: 'Healthy Balance',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        textClass: 'text-emerald-400',
        hint: 'Sufficient funds available for scheduled WhatsApp workflows.',
    };
};

/**
 * Aggregates recharge, deduction, net balance delta, and category breakdown for one customer.
 */
export const getCustomerWalletSummary = (customerId, transactions = [], messagePricing = mockMessagePricing) => {
    const custTxns = transactions.filter((t) => t.customerId === customerId);

    const totalRecharged = custTxns
        .filter((t) => (t.type === 'Recharge' || t.type === 'Credit') && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalDeductions = custTxns
        .filter((t) => (t.type === 'Deduction' || t.type === 'Debit') && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const billedMessages = custTxns
        .filter((t) => t.type === 'Deduction' && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    const failedCount = custTxns.filter((t) => t.status === 'Failed').length;

    const categoryBreakdown = Object.keys(mockMessagePricing).map((category) => {
        const rate = Number(messagePricing?.[category]?.unitPrice ?? mockMessagePricing[category].unitPrice);
        const catTxns = custTxns.filter(
            (t) => t.type === 'Deduction' && t.category === category && t.status === 'Success'
        );
        const quantity = catTxns.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
        const totalCost = catTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        return {
            category,
            unitPrice: rate,
            description: mockMessagePricing[category].description,
            badgeColor: mockMessagePricing[category].badgeColor,
            quantity,
            totalCost: Number(totalCost.toFixed(2)),
        };
    });

    return {
        transactions: custTxns,
        totalRecharged: Number(totalRecharged.toFixed(2)),
        totalDeductions: Number(totalDeductions.toFixed(2)),
        billedMessages,
        failedCount,
        categoryBreakdown,
    };
};

export const filterWalletTransactions = (
    transactions = [],
    { search = '', type = 'All', status = 'All', category = 'All', customerId = 'All', dateFrom = '', dateTo = '' } = {}
) => {
    const q = search.trim().toLowerCase();
    return transactions.filter((txn) => {
        if (customerId !== 'All' && txn.customerId !== customerId) return false;
        if (type !== 'All' && txn.type !== type) return false;
        if (status !== 'All' && txn.status !== status) return false;
        if (category !== 'All' && txn.category !== category) return false;
        if (dateFrom && txn.date < dateFrom) return false;
        if (dateTo && txn.date > dateTo) return false;
        if (q) {
            return (
                (txn.id || '').toLowerCase().includes(q) ||
                (txn.customerName || '').toLowerCase().includes(q) ||
                (txn.note || '').toLowerCase().includes(q) ||
                (txn.paymentMethod || '').toLowerCase().includes(q) ||
                (txn.category || '').toLowerCase().includes(q) ||
                (txn.invoiceNumber || '').toLowerCase().includes(q) ||
                (txn.actor || '').toLowerCase().includes(q)
            );
        }
        return true;
    });
};
