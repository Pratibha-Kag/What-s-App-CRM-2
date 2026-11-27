import { normalizeRoleKey } from '../store/useStore';

export const normalizeEmail = (val) => String(val || '').trim().toLowerCase();

export const normalizePhoneDigits = (val) => String(val || '').replace(/\D/g, '');

export const phonesMatch = (a, b) => {
    const da = normalizePhoneDigits(a);
    const db = normalizePhoneDigits(b);
    if (da.length < 7 || db.length < 7) return false;
    if (da === db) return true;
    const tailA = da.slice(-9);
    const tailB = db.slice(-9);
    return tailA.length >= 7 && tailA === tailB;
};

/**
 * Checks existing leads and contacts for duplicate email or phone matches.
 */
export const detectDuplicateLead = (
    { email, phone, excludeLeadId = null },
    leads = [],
    contacts = []
) => {
    const targetEmail = normalizeEmail(email);

    const matchedLead = leads.find((item) => {
        if (excludeLeadId != null && String(item.id) === String(excludeLeadId)) return false;
        const emailHit = Boolean(targetEmail && normalizeEmail(item.email) === targetEmail);
        const phoneHit = phonesMatch(phone, item.phone);
        return emailHit || phoneHit;
    });

    const matchedContact = contacts.find((item) => {
        const emailHit = Boolean(targetEmail && normalizeEmail(item.email) === targetEmail);
        const phoneHit = phonesMatch(phone, item.phone);
        return emailHit || phoneHit;
    });

    if (!matchedLead && !matchedContact) return null;

    const reasons = [];
    const emailMatchesLead = matchedLead && targetEmail && normalizeEmail(matchedLead.email) === targetEmail;
    const emailMatchesContact = matchedContact && targetEmail && normalizeEmail(matchedContact.email) === targetEmail;
    if (emailMatchesLead || emailMatchesContact) reasons.push('Email');

    const phoneMatchesLead = matchedLead && phonesMatch(phone, matchedLead.phone);
    const phoneMatchesContact = matchedContact && phonesMatch(phone, matchedContact.phone);
    if (phoneMatchesLead || phoneMatchesContact) reasons.push('Phone');

    return {
        existingLead: matchedLead || null,
        existingContact: matchedContact || null,
        matchedBy: reasons.join(' & ') || 'Email / Phone',
    };
};

/**
 * Resolves the active customer ID filter based on role and optional explicit filter.
 */
export const resolveScopedCustomerId = (role, selectedAccount, explicitCustomerId = 'All') => {
    const key = normalizeRoleKey(role);
    if (key === 'ADMIN' || key === 'CUSTOMER_ADMIN') {
        if (selectedAccount?.id && selectedAccount.id !== 'platform') {
            return selectedAccount.id;
        }
        return 'cust-001';
    }
    return explicitCustomerId;
};

export const exportRowsToCsv = (headers, rows, filename) => {
    const escapeCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
        headers.map(escapeCell).join(','),
        ...rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
