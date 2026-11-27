/**
 * Developer 1 — Birthday Calculation and Telemetry Utilities
 * Accurately calculates upcoming birthdays across calendar years,
 * identifies missing/invalid DOBs, and formats countdown days.
 */

export const parseDOB = (dobString) => {
    if (!dobString || typeof dobString !== 'string' || !dobString.trim()) {
        return null;
    }

    const trimmed = dobString.trim();

    // Check ISO YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const month = parseInt(isoMatch[2], 10);
        const day = parseInt(isoMatch[3], 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2026) {
            return { year, month, day };
        }
    }

    // Check DD/MM/YYYY or DD-MM-YYYY
    const slashMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (slashMatch) {
        const day = parseInt(slashMatch[1], 10);
        const month = parseInt(slashMatch[2], 10);
        const year = parseInt(slashMatch[3], 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2026) {
            return { year, month, day };
        }
    }

    // Try standard Date.parse
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        if (year >= 1900 && year <= 2026) {
            return {
                year,
                month: parsed.getMonth() + 1,
                day: parsed.getDate()
            };
        }
    }

    return null;
};

/**
 * Calculates next upcoming birthday, days remaining, upcoming age, and timeframe flags.
 * Correctly rolls over to next calendar year if birthday already occurred in current year.
 */
export const calculateUpcomingBirthdayInfo = (dobString, refDate = new Date()) => {
    const parsed = parseDOB(dobString);
    if (!parsed) {
        return {
            isValid: false,
            formattedDOB: dobString || 'Not specified',
            errorReason: !dobString ? 'Missing Date of Birth' : 'Invalid Date Format',
            nextBirthdayDate: null,
            formattedNextBirthday: '—',
            daysRemaining: null,
            upcomingAge: null,
            isToday: false,
            isThisWeek: false,
            isThisMonth: false
        };
    }

    const { year: birthYear, month, day } = parsed;

    // Use midnight of reference date for accurate calendar-day differences
    const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
    const currentYear = today.getFullYear();

    // Candidate 1: Birthday in current calendar year
    let nextBday = new Date(currentYear, month - 1, day);

    // If current year's birthday already passed (strictly before today)
    if (nextBday < today) {
        // Roll over to next calendar year
        nextBday = new Date(currentYear + 1, month - 1, day);
    }

    const diffTime = nextBday.getTime() - today.getTime();
    const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isToday = daysRemaining === 0;
    const isThisWeek = daysRemaining >= 0 && daysRemaining <= 7;
    const isThisMonth = daysRemaining >= 0 && daysRemaining <= 30;

    const upcomingAge = nextBday.getFullYear() - birthYear;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedNextBirthday = `${months[nextBday.getMonth()]} ${String(nextBday.getDate()).padStart(2, '0')}, ${nextBday.getFullYear()}`;
    const formattedDOB = `${months[month - 1]} ${String(day).padStart(2, '0')}, ${birthYear}`;

    return {
        isValid: true,
        birthYear,
        month,
        day,
        formattedDOB,
        nextBirthdayDate: nextBday,
        formattedNextBirthday,
        daysRemaining,
        upcomingAge,
        isToday,
        isThisWeek,
        isThisMonth
    };
};

/**
 * Filter customers based on birthday criteria
 */
export const filterCustomersByBirthday = (customers, filterType, refDate = new Date()) => {
    return customers.map(c => ({
        ...c,
        bdayInfo: calculateUpcomingBirthdayInfo(c.dob, refDate)
    })).filter(c => {
        if (filterType === 'all') return true;
        if (filterType === 'valid') return c.bdayInfo.isValid;
        if (filterType === 'today') return c.bdayInfo.isValid && c.bdayInfo.isToday;
        if (filterType === 'week') return c.bdayInfo.isValid && c.bdayInfo.isThisWeek;
        if (filterType === 'month') return c.bdayInfo.isValid && c.bdayInfo.isThisMonth;
        if (filterType === 'missing_invalid') return !c.bdayInfo.isValid;
        return true;
    }).sort((a, b) => {
        // Sort valid upcoming by days remaining ascending, then invalid at bottom
        if (a.bdayInfo.isValid && b.bdayInfo.isValid) {
            return a.bdayInfo.daysRemaining - b.bdayInfo.daysRemaining;
        }
        if (a.bdayInfo.isValid) return -1;
        if (b.bdayInfo.isValid) return 1;
        return 0;
    });
};
