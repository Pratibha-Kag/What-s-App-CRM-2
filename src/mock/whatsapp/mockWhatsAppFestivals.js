/**
 * Developer 1 — Festival Automation Mock Data & Multi-Year Calendar Presets
 * Pre-configured with Diwali, Dussehra, and major seasonal festivals.
 * Supports configurable/editable celebration dates for each calendar year.
 */

export const prebuiltFestivalPresets = [
    {
        id: 'diwali',
        name: 'Diwali (Festival of Lights)',
        description: 'Major Hindu festival celebrated with lamps and celebrations. Date varies annually per lunar calendar.',
        category: 'Indian Festivals',
        yearlyDates: {
            '2026': '2026-11-08',
            '2027': '2027-10-29',
            '2028': '2028-10-17'
        },
        suggestedGreeting: 'Wishing you and your family a luminous and joyous Diwali! May the festival of lights illuminate your academic goals.',
        suggestedTemplateCategory: 'Marketing'
    },
    {
        id: 'dussehra',
        name: 'Dussehra (Vijayadashami)',
        description: 'Celebrates the victory of good over evil. Date varies annually according to Hindu calendar.',
        category: 'Indian Festivals',
        yearlyDates: {
            '2026': '2026-10-20',
            '2027': '2027-10-10',
            '2028': '2028-09-29'
        },
        suggestedGreeting: 'Warmest wishes on the auspicious occasion of Dussehra! Wishing you triumph and success on your educational journey.',
        suggestedTemplateCategory: 'Marketing'
    },
    {
        id: 'new_year',
        name: 'New Year Celebration',
        description: 'Global New Year greeting for prospective students and admitted applicants.',
        category: 'Global Holidays',
        yearlyDates: {
            '2026': '2026-01-01',
            '2027': '2027-01-01',
            '2028': '2028-01-01'
        },
        suggestedGreeting: 'Wishing you a happy, prosperous, and successful New Year! May this year bring admission offers from your dream universities.',
        suggestedTemplateCategory: 'Marketing'
    },
    {
        id: 'eid',
        name: 'Eid al-Fitr',
        description: 'Celebration marking the conclusion of Ramadan. Date varies per Islamic lunar sighting.',
        category: 'Islamic Holidays',
        yearlyDates: {
            '2026': '2026-03-20',
            '2027': '2027-03-10',
            '2028': '2028-02-27'
        },
        suggestedGreeting: 'Eid Mubarak! Wishing you and your loved ones peace, happiness, and prosperity in all your academic endeavors.',
        suggestedTemplateCategory: 'Marketing'
    },
    {
        id: 'holi',
        name: 'Holi (Festival of Colors)',
        description: 'Vibrant spring festival of joy and friendship. Date shifts annually with lunar calendar.',
        category: 'Indian Festivals',
        yearlyDates: {
            '2026': '2026-03-04',
            '2027': '2027-03-23',
            '2028': '2028-03-12'
        },
        suggestedGreeting: 'Wishing you a vibrant and colorful Holi! May your path be brightened with joy, success, and academic achievements.',
        suggestedTemplateCategory: 'Marketing'
    },
    {
        id: 'christmas',
        name: 'Christmas Holiday',
        description: 'Annual holiday season and university winter recess greeting.',
        category: 'Global Holidays',
        yearlyDates: {
            '2026': '2026-12-25',
            '2027': '2027-12-25',
            '2028': '2028-12-25'
        },
        suggestedGreeting: 'Merry Christmas and season greetings from our admissions team! Wishing you peace, cheer, and happy holidays.',
        suggestedTemplateCategory: 'Marketing'
    }
];

export const initialWhatsAppFestivals = [
    {
        id: 'fest-201',
        name: 'Diwali 2026 Festival of Lights Broadcast',
        festivalId: 'diwali',
        festivalName: 'Diwali (Festival of Lights)',
        year: '2026',
        celebrationDate: '2026-11-08',
        audienceGroup: 'All Contacts',
        totalRecipients: 16,
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Diwali 2026!',
            body: 'Wishing you and your family a joyful Diwali! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Admissions & Student Care Team',
            buttons: [{ type: 'QUICK_REPLY', text: 'Thank you!' }]
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'Diwali 2026' }
        ],
        scheduledTime: '08:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Completed', // 'Draft' | 'Scheduled' | 'Running' | 'Completed' | 'Paused'
        stats: {
            sent: 16,
            delivered: 16,
            read: 14,
            failed: 0
        },
        sentAt: '2026-11-08T08:00:00.000Z',
        createdAt: '2026-10-10T10:00:00.000Z'
    },
    {
        id: 'fest-202',
        name: 'Dussehra 2026 Vijayadashami Greetings',
        festivalId: 'dussehra',
        festivalName: 'Dussehra (Vijayadashami)',
        year: '2026',
        celebrationDate: '2026-10-20',
        audienceGroup: 'All Contacts',
        totalRecipients: 16,
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Dussehra!',
            body: 'Wishing you and your family a joyful Dussehra! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Global Study Advisory'
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'Dussehra' }
        ],
        scheduledTime: '09:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Completed',
        stats: {
            sent: 16,
            delivered: 15,
            read: 13,
            failed: 1
        },
        sentAt: '2026-10-20T09:00:00.000Z',
        createdAt: '2026-09-20T11:00:00.000Z'
    },
    {
        id: 'fest-203',
        name: 'New Year 2027 Global Admissions Greeting',
        festivalId: 'new_year',
        festivalName: 'New Year Celebration',
        year: '2027',
        celebrationDate: '2027-01-01',
        audienceGroup: 'All Contacts',
        totalRecipients: 16,
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy New Year 2027!',
            body: 'Wishing you and your family a joyful New Year 2027! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Admissions & Student Care Team'
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'New Year 2027' }
        ],
        scheduledTime: '08:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        stats: {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0
        },
        sentAt: null,
        createdAt: '2026-11-01T08:00:00.000Z'
    },
    {
        id: 'fest-204',
        name: 'Holi 2027 Festival Campaign',
        festivalId: 'holi',
        festivalName: 'Holi (Festival of Colors)',
        year: '2027',
        celebrationDate: '2027-03-23',
        audienceGroup: 'Admissions Inquiries',
        totalRecipients: 6,
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Holi 2027!',
            body: 'Wishing you and your family a joyful Holi! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Admissions & Student Care Team'
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'Holi 2027' }
        ],
        scheduledTime: '08:30',
        timezone: 'GMT+5:30 (IST)',
        status: 'Draft',
        stats: {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0
        },
        sentAt: null,
        createdAt: '2026-11-15T14:00:00.000Z'
    }
];
