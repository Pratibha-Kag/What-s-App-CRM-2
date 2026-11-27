/**
 * Developer 1 — WhatsApp Campaign Management Initial Mock Data
 * Realistic campaigns for educational consultancy & admissions workflow.
 */

export const initialWhatsAppCampaigns = [
    {
        id: 'camp-101',
        name: 'Fall 2026 Admissions Priority Broadcast',
        description: 'Targeted broadcast to UK Applicants regarding priority scholarship deadlines.',
        type: 'Bulk',
        status: 'Completed',
        templateId: 'tpl-102',
        templateName: 'appointment_reminder',
        templateCategory: 'Utility',
        templateSnapshot: {
            header: 'Admission Counseling Notice',
            body: 'Hello {{1}}, this is a reminder for your upcoming session on {{2}} at {{3}} with our senior counselor {{4}}. Please be on time.',
            footer: 'Global Study Abroad Consultancy',
            buttons: [
                { type: 'QUICK_REPLY', text: 'Confirm Attendance' },
                { type: 'QUICK_REPLY', text: 'Request Reschedule' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Student' },
            { key: '2', source: 'custom', customValue: 'Tomorrow, Oct 15' },
            { key: '3', source: 'custom', customValue: '03:00 PM' },
            { key: '4', source: 'custom', customValue: 'Dr. Alistair Finch' }
        ],
        audienceSource: 'CRM_GROUP',
        audienceGroupName: 'UK Applicants',
        totalRecipients: 6,
        stats: {
            sent: 6,
            delivered: 6,
            read: 5,
            failed: 0,
            pending: 0
        },
        scheduledFor: null,
        timezone: 'GMT+5:30 (IST)',
        createdAt: '2026-10-14T09:30:00.000Z',
        completedAt: '2026-10-14T09:35:00.000Z',
        recipients: [
            {
                id: 'rec-001',
                name: 'Aarav Patel',
                phone: '+91 98765 43210',
                status: 'Read',
                sentAt: '09:30 AM',
                deliveredAt: '09:30 AM',
                readAt: '09:32 AM',
                errorReason: null
            },
            {
                id: 'rec-002',
                name: 'Rasel Ahmed',
                phone: '+880 1718 369004',
                status: 'Read',
                sentAt: '09:30 AM',
                deliveredAt: '09:31 AM',
                readAt: '09:34 AM',
                errorReason: null
            },
            {
                id: 'rec-003',
                name: 'Sohel Rana',
                phone: '+880 1749 616154',
                status: 'Delivered',
                sentAt: '09:30 AM',
                deliveredAt: '09:31 AM',
                readAt: null,
                errorReason: null
            },
            {
                id: 'rec-004',
                name: 'Hannah Schmidt',
                phone: '+49 151 23456789',
                status: 'Read',
                sentAt: '09:30 AM',
                deliveredAt: '09:31 AM',
                readAt: '09:33 AM',
                errorReason: null
            },
            {
                id: 'rec-005',
                name: 'Kwame Mensah',
                phone: '+233 24 123 4567',
                status: 'Read',
                sentAt: '09:30 AM',
                deliveredAt: '09:32 AM',
                readAt: '09:35 AM',
                errorReason: null
            },
            {
                id: 'rec-006',
                name: 'Zoe Chen',
                phone: '+1 (416) 789-0123',
                status: 'Read',
                sentAt: '09:30 AM',
                deliveredAt: '09:31 AM',
                readAt: '09:36 AM',
                errorReason: null
            }
        ]
    },
    {
        id: 'camp-102',
        name: 'Urgent Tuition Fee Due Reminder',
        description: 'Payment milestone notification for enrolled university candidates.',
        type: 'Manual',
        status: 'Paused',
        templateId: 'tpl-105',
        templateName: 'payment_reminder',
        templateCategory: 'Utility',
        templateSnapshot: {
            header: 'Tuition Payment Notice',
            body: 'Dear {{1}}, friendly reminder that invoice {{2}} of {{3}} is due on {{4}}. Please clear your outstanding dues to avoid visa delays.',
            footer: 'Student Accounts Finance Office',
            buttons: [
                { type: 'URL', text: 'Pay Online Now', url: 'https://university.portal/pay' },
                { type: 'QUICK_REPLY', text: 'Sent Bank Transfer' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Student' },
            { key: '2', source: 'custom', customValue: 'INV-2026-881' },
            { key: '3', source: 'custom', customValue: '$3,450.00' },
            { key: '4', source: 'custom', customValue: 'October 30, 2026' }
        ],
        audienceSource: 'CRM_GROUP',
        audienceGroupName: 'VIP Leads',
        totalRecipients: 5,
        stats: {
            sent: 4,
            delivered: 3,
            read: 1,
            failed: 1,
            pending: 1
        },
        scheduledFor: null,
        timezone: 'GMT+5:30 (IST)',
        createdAt: '2026-10-18T11:00:00.000Z',
        completedAt: null,
        recipients: [
            {
                id: 'rec-101',
                name: 'Tariq Mahmoud',
                phone: '+20 100 555 1234',
                status: 'Read',
                sentAt: '11:00 AM',
                deliveredAt: '11:01 AM',
                readAt: '11:04 AM',
                errorReason: null
            },
            {
                id: 'rec-102',
                name: 'Ananya Deshmukh',
                phone: '+91 99887 76655',
                status: 'Delivered',
                sentAt: '11:00 AM',
                deliveredAt: '11:02 AM',
                readAt: null,
                errorReason: null
            },
            {
                id: 'rec-103',
                name: 'Carlos Mendoza',
                phone: '+1 (555) 234-5678',
                status: 'Delivered',
                sentAt: '11:00 AM',
                deliveredAt: '11:02 AM',
                readAt: null,
                errorReason: null
            },
            {
                id: 'rec-104',
                name: 'Invalid Lead Entry',
                phone: '+1 (000) 000-0000',
                status: 'Failed',
                sentAt: '11:00 AM',
                deliveredAt: null,
                readAt: null,
                errorReason: 'WhatsApp number is not registered or unreachable'
            },
            {
                id: 'rec-105',
                name: 'Fatima Al-Zahra',
                phone: '+971 50 123 4567',
                status: 'Pending',
                sentAt: null,
                deliveredAt: null,
                readAt: null,
                errorReason: null
            }
        ]
    },
    {
        id: 'camp-103',
        name: 'UK Student Visa Briefing Webinar',
        description: 'Invitation to upcoming interactive briefing on UK tier-4 student visa updates.',
        type: 'Bulk',
        status: 'Scheduled',
        templateId: 'tpl-101',
        templateName: 'promotional_offer',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Exclusive Webinar Invitation',
            body: 'Hello {{1}}, join our exclusive session {{2}}! Learn direct strategies and claim your waiver code {{3}} before {{4}}.',
            footer: 'Global Study Network',
            buttons: [
                { type: 'URL', text: 'Register Free', url: 'https://studyportal.com/webinar' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Applicant' },
            { key: '2', source: 'custom', customValue: 'UK Visa 2026 Masterclass' },
            { key: '3', source: 'custom', customValue: 'VISA2026' },
            { key: '4', source: 'custom', customValue: 'Nov 05' }
        ],
        audienceSource: 'CSV_IMPORT',
        audienceGroupName: 'Imported CSV List',
        totalRecipients: 4,
        stats: {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            pending: 4
        },
        scheduledFor: '2026-11-28T10:00:00.000Z',
        timezone: 'GMT+5:30 (IST)',
        createdAt: '2026-10-20T14:10:00.000Z',
        completedAt: null,
        recipients: [
            { id: 'rec-201', name: 'Aarav Patel', phone: '+91 98765 43210', status: 'Pending', sentAt: null, deliveredAt: null, readAt: null, errorReason: null },
            { id: 'rec-202', name: 'Fatima Al-Zahra', phone: '+971 50 123 4567', status: 'Pending', sentAt: null, deliveredAt: null, readAt: null, errorReason: null },
            { id: 'rec-203', name: 'Carlos Mendoza', phone: '+1 (555) 234-5678', status: 'Pending', sentAt: null, deliveredAt: null, readAt: null, errorReason: null },
            { id: 'rec-204', name: 'Zoe Chen', phone: '+1 (416) 789-0123', status: 'Pending', sentAt: null, deliveredAt: null, readAt: null, errorReason: null }
        ]
    },
    {
        id: 'camp-104',
        name: 'Festival Greetings & Counseling Holiday Notice',
        description: 'Seasonal holiday wishes and updated office hours announcement.',
        type: 'Bulk',
        status: 'Draft',
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Holidays from Global Study',
            body: 'Wishing you and your family a joyful {{1}}! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Admissions & Student Care Team',
            buttons: [
                { type: 'QUICK_REPLY', text: 'Thank you!' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'Holiday Season' }
        ],
        audienceSource: 'CRM_GROUP',
        audienceGroupName: 'All Contacts',
        totalRecipients: 8,
        stats: {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            pending: 8
        },
        scheduledFor: null,
        timezone: 'GMT+5:30 (IST)',
        createdAt: '2026-10-22T08:15:00.000Z',
        completedAt: null,
        recipients: []
    }
];
