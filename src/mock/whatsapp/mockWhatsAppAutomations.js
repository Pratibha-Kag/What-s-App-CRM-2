/**
 * Developer 1 — Common Automation & Trigger Engine Initial Mock Data & Presets
 * Serves as the foundation for:
 * - Phase 4: Common Automation & Trigger Engine
 * - Phase 5: Birthday & Event Automations
 * - Phase 6: Festival & Holiday Campaigns
 * - Phase 7: Appointment & Payment Reminders
 */

export const automationPresets = [
    {
        id: 'birthday',
        name: 'Birthday Wishes',
        category: 'Customer Lifecycle',
        description: 'Automatically send personalized birthday greetings to applicants on their birthday at designated time.',
        defaultTrigger: 'SCHEDULE_ANNUAL',
        suggestedTemplateCategory: 'Marketing',
        suggestedTemplateName: 'birthday_wishes',
        iconName: 'Cake',
        eventField: 'dob',
        defaultOffset: { value: 0, unit: 'days', direction: 'on' },
        defaultTime: '09:00',
        badge: 'Phase 5 Ready'
    },
    {
        id: 'festival',
        name: 'Festival Greetings',
        category: 'Seasonal Marketing',
        description: 'Broadcast seasonal festival and holiday wishes to applicant segments on specified holiday dates.',
        defaultTrigger: 'SCHEDULE_ONCE',
        suggestedTemplateCategory: 'Marketing',
        suggestedTemplateName: 'festival_greetings',
        iconName: 'Sparkles',
        eventField: 'holiday_date',
        defaultOffset: { value: 0, unit: 'days', direction: 'on' },
        defaultTime: '08:00',
        badge: 'Phase 6 Ready'
    },
    {
        id: 'appointment_reminder',
        name: 'Appointment Reminder',
        category: 'Counseling & Meetings',
        description: 'Send automated reminders 24 hours or 2 hours prior to scheduled counselor interviews or visa sessions.',
        defaultTrigger: 'EVENT_RELATIVE',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'appointment_reminder',
        iconName: 'CalendarClock',
        eventField: 'appointment_datetime',
        defaultOffset: { value: 24, unit: 'hours', direction: 'before' },
        defaultTime: '10:00',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'missed_appointment',
        name: 'Missed Appointment Follow-up',
        category: 'Counseling & Meetings',
        description: 'Trigger an immediate supportive follow-up when a candidate misses an admissions counseling session.',
        defaultTrigger: 'EXTERNAL_EVENT',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'appointment_rescheduling',
        iconName: 'UserX',
        eventField: 'crm.appointment_status_missed',
        defaultOffset: { value: 30, unit: 'minutes', direction: 'after' },
        defaultTime: 'Immediate',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'appointment_reschedule',
        name: 'Appointment Rescheduling',
        category: 'Counseling & Meetings',
        description: 'Notify candidate whenever a counseling slot or visa briefing is rescheduled by the admissions team.',
        defaultTrigger: 'EXTERNAL_EVENT',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'appointment_rescheduling',
        iconName: 'CalendarSync',
        eventField: 'crm.appointment_rescheduled',
        defaultOffset: { value: 0, unit: 'minutes', direction: 'immediate' },
        defaultTime: 'Immediate',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'appointment_cancel',
        name: 'Appointment Cancellation',
        category: 'Counseling & Meetings',
        description: 'Send instant cancellation confirmation and direct link to pick a new available counselor date.',
        defaultTrigger: 'EXTERNAL_EVENT',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'appointment_cancellation',
        iconName: 'CalendarX',
        eventField: 'crm.appointment_cancelled',
        defaultOffset: { value: 0, unit: 'minutes', direction: 'immediate' },
        defaultTime: 'Immediate',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'payment_reminder',
        name: 'Payment Reminder',
        category: 'Finance & Invoicing',
        description: 'Dispatch tuition installment reminders 3 days before payment due date with secure payment link.',
        defaultTrigger: 'EVENT_RELATIVE',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'payment_reminder',
        iconName: 'CreditCard',
        eventField: 'invoice_due_date',
        defaultOffset: { value: 3, unit: 'days', direction: 'before' },
        defaultTime: '11:00',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'payment_confirm',
        name: 'Payment Confirmation',
        category: 'Finance & Invoicing',
        description: 'Send real-time receipt acknowledgement and fee confirmation when university fees are recorded as paid.',
        defaultTrigger: 'EXTERNAL_EVENT',
        suggestedTemplateCategory: 'Utility',
        suggestedTemplateName: 'payment_confirmation',
        iconName: 'ReceiptCheck',
        eventField: 'crm.payment_received',
        defaultOffset: { value: 0, unit: 'minutes', direction: 'immediate' },
        defaultTime: 'Immediate',
        badge: 'Phase 7 Ready'
    },
    {
        id: 'custom',
        name: 'Custom Automation Rule',
        category: 'Custom Engine',
        description: 'Build a custom trigger rule combining specific dates, recurring intervals, or simulated webhook events.',
        defaultTrigger: 'SCHEDULE_RECURRING',
        suggestedTemplateCategory: 'Marketing',
        suggestedTemplateName: 'promotional_offer',
        iconName: 'Sliders',
        eventField: 'custom_event',
        defaultOffset: { value: 0, unit: 'days', direction: 'on' },
        defaultTime: '10:00',
        badge: 'General'
    }
];

export const initialWhatsAppAutomations = [
    {
        id: 'auto-101',
        name: 'Applicant Birthday Greeting Engine',
        description: 'Scans applicant DOBs daily and sends birthday wishes with anniversary application fee waiver.',
        type: 'birthday',
        triggerType: 'SCHEDULE_ANNUAL', // 'SCHEDULE_ONCE' | 'SCHEDULE_RECURRING' | 'SCHEDULE_ANNUAL' | 'EVENT_RELATIVE' | 'EXTERNAL_EVENT'
        conditions: {
            field: 'dob',
            matchType: 'MONTH_DAY_MATCH',
            timezone: 'GMT+5:30 (IST)'
        },
        audienceConfig: {
            source: 'CRM_AUDIENCE',
            group: 'All Contacts',
            targetCount: 12
        },
        templateId: 'tpl-107',
        templateName: 'birthday_wishes',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy Birthday!',
            body: 'Happy Birthday {{1}}! 🎂 Wishing you a wonderful year ahead. Enjoy {{2}} off your university application fees with code {{3}}!',
            footer: 'Global Study Admissions Team',
            buttons: [
                { type: 'URL', text: 'Claim Birthday Waiver', url: 'https://university.portal/bday' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Valued Student' },
            { key: '2', source: 'custom', customValue: '25% discount' },
            { key: '3', source: 'custom', customValue: 'BDAY2026' }
        ],
        schedule: {
            time: '09:00',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Annual',
            nextExecutionAt: '2026-11-28T09:00:00.000Z'
        },
        status: 'Active', // 'Draft' | 'Active' | 'Paused' | 'Disabled'
        stats: {
            totalRuns: 14,
            success: 14,
            failed: 0,
            skipped: 2
        },
        createdAt: '2026-09-01T08:00:00.000Z',
        updatedAt: '2026-11-20T10:15:00.000Z'
    },
    {
        id: 'auto-102',
        name: 'Admissions Counseling 24-Hour Reminder',
        description: 'Sends automated counseling session reminders 24 hours prior to appointment slot.',
        type: 'appointment_reminder',
        triggerType: 'EVENT_RELATIVE',
        conditions: {
            event: 'appointment.scheduled_time',
            offsetValue: 24,
            offsetUnit: 'hours',
            offsetDirection: 'before',
            timezone: 'GMT+5:30 (IST)'
        },
        audienceConfig: {
            source: 'CRM_AUDIENCE',
            group: 'Admissions Inquiries',
            targetCount: 4
        },
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
            { key: '1', source: 'name', fallback: 'Applicant' },
            { key: '2', source: 'custom', customValue: 'Tomorrow' },
            { key: '3', source: 'custom', customValue: '11:00 AM' },
            { key: '4', source: 'custom', customValue: 'Admissions Officer' }
        ],
        schedule: {
            time: 'Hourly Evaluation',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Event-driven',
            nextExecutionAt: '2026-11-27T16:00:00.000Z'
        },
        status: 'Active',
        stats: {
            totalRuns: 28,
            success: 27,
            failed: 1,
            skipped: 4
        },
        createdAt: '2026-09-10T12:00:00.000Z',
        updatedAt: '2026-11-22T09:30:00.000Z'
    },
    {
        id: 'auto-103',
        name: 'Tuition Fee Milestone 3-Day Reminder',
        description: 'Notifies enrolled candidates 3 days before payment milestone due date.',
        type: 'payment_reminder',
        triggerType: 'EVENT_RELATIVE',
        conditions: {
            event: 'payment.due_date',
            offsetValue: 3,
            offsetUnit: 'days',
            offsetDirection: 'before',
            timezone: 'GMT+5:30 (IST)'
        },
        audienceConfig: {
            source: 'CRM_AUDIENCE',
            group: 'VIP Leads',
            targetCount: 2
        },
        templateId: 'tpl-105',
        templateName: 'payment_reminder',
        templateCategory: 'Utility',
        templateSnapshot: {
            header: 'Tuition Payment Notice',
            body: 'Dear {{1}}, friendly reminder that invoice {{2}} of {{3}} is due on {{4}}. Please clear your outstanding dues to avoid visa delays.',
            footer: 'Student Accounts Finance Office',
            buttons: [
                { type: 'URL', text: 'Pay Online Now', url: 'https://university.portal/pay' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Student' },
            { key: '2', source: 'custom', customValue: 'INV-2026-904' },
            { key: '3', source: 'custom', customValue: '$2,500' },
            { key: '4', source: 'custom', customValue: 'Dec 01, 2026' }
        ],
        schedule: {
            time: '11:00',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Daily Check',
            nextExecutionAt: '2026-11-28T11:00:00.000Z'
        },
        status: 'Active',
        stats: {
            totalRuns: 12,
            success: 11,
            failed: 1,
            skipped: 1
        },
        createdAt: '2026-10-01T14:20:00.000Z',
        updatedAt: '2026-11-25T11:00:00.000Z'
    },
    {
        id: 'auto-104',
        name: 'New Year 2027 Global Holiday Greeting',
        description: 'Scheduled broadcast greeting on January 1st to all prospective students and alumni.',
        type: 'festival',
        triggerType: 'SCHEDULE_ONCE',
        conditions: {
            scheduledDate: '2027-01-01',
            scheduledTime: '08:00',
            timezone: 'GMT+5:30 (IST)'
        },
        audienceConfig: {
            source: 'CRM_AUDIENCE',
            group: 'All Contacts',
            targetCount: 12
        },
        templateId: 'tpl-108',
        templateName: 'festival_greetings',
        templateCategory: 'Marketing',
        templateSnapshot: {
            header: 'Happy New Year 2027!',
            body: 'Wishing you and your family a joyful {{1}}! May this season bring warmth, success, and prosperity to your academic journey.',
            footer: 'Admissions & Student Care Team'
        },
        variableMappings: [
            { key: '1', source: 'custom', customValue: 'New Year 2027' }
        ],
        schedule: {
            time: '08:00',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Once',
            nextExecutionAt: '2027-01-01T08:00:00.000Z'
        },
        status: 'Active',
        stats: {
            totalRuns: 0,
            success: 0,
            failed: 0,
            skipped: 0
        },
        createdAt: '2026-10-15T09:00:00.000Z',
        updatedAt: '2026-10-15T09:00:00.000Z'
    },
    {
        id: 'auto-105',
        name: 'Admissions Slot Rescheduling Instant Notification',
        description: 'Instant notification dispatched when counselor or applicant moves meeting time.',
        type: 'appointment_reschedule',
        triggerType: 'EXTERNAL_EVENT',
        conditions: {
            eventCode: 'crm.appointment_rescheduled',
            payloadField: 'appointment_id'
        },
        audienceConfig: {
            source: 'CRM_AUDIENCE',
            group: 'UK Applicants',
            targetCount: 3
        },
        templateId: 'tpl-103',
        templateName: 'appointment_rescheduling',
        templateCategory: 'Utility',
        templateSnapshot: {
            header: 'Counseling Session Rescheduled',
            body: 'Hello {{1}}, your counseling session originally set for {{2}} has been rescheduled to {{3}} at {{4}}. Please confirm if this works.',
            footer: 'Global Study Academic Services',
            buttons: [
                { type: 'QUICK_REPLY', text: 'Confirm New Time' },
                { type: 'QUICK_REPLY', text: 'Needs Change' }
            ]
        },
        variableMappings: [
            { key: '1', source: 'name', fallback: 'Student' },
            { key: '2', source: 'custom', customValue: 'Yesterday' },
            { key: '3', source: 'custom', customValue: 'Friday, Nov 28' },
            { key: '4', source: 'custom', customValue: '04:00 PM' }
        ],
        schedule: {
            time: 'Instant Trigger',
            timezone: 'GMT+5:30 (IST)',
            frequency: 'Event-driven',
            nextExecutionAt: 'On Event Trigger'
        },
        status: 'Paused',
        stats: {
            totalRuns: 5,
            success: 5,
            failed: 0,
            skipped: 0
        },
        createdAt: '2026-10-20T11:15:00.000Z',
        updatedAt: '2026-11-26T14:40:00.000Z'
    }
];

export const initialExecutionHistory = [
    {
        id: 'exec-801',
        automationId: 'auto-101',
        automationName: 'Applicant Birthday Greeting Engine',
        triggerType: 'SCHEDULE_ANNUAL',
        recipientName: 'Carlos Mendoza',
        recipientPhone: '+1 (555) 234-5678',
        templateName: 'birthday_wishes',
        templateSnapshot: {
            body: 'Happy Birthday Carlos Mendoza! 🎂 Wishing you a wonderful year ahead. Enjoy 25% discount off your university application fees with code BDAY2026!'
        },
        status: 'Success', // 'Success' | 'Failed' | 'Skipped'
        reason: 'Delivered to active WhatsApp chat',
        executedAt: '2026-11-27T09:00:15.000Z',
        isTest: false,
        duplicateKey: 'auto-101:+1(555)234-5678:2026-11-27'
    },
    {
        id: 'exec-802',
        automationId: 'auto-101',
        automationName: 'Applicant Birthday Greeting Engine',
        triggerType: 'SCHEDULE_ANNUAL',
        recipientName: 'Carlos Mendoza',
        recipientPhone: '+1 (555) 234-5678',
        templateName: 'birthday_wishes',
        templateSnapshot: {
            body: 'Happy Birthday Carlos Mendoza! 🎂 Wishing you a wonderful year ahead.'
        },
        status: 'Skipped',
        reason: 'Duplicate message prevented: already sent for this annual occurrence (2026-11-27)',
        executedAt: '2026-11-27T09:05:00.000Z',
        isTest: false,
        duplicateKey: 'auto-101:+1(555)234-5678:2026-11-27'
    },
    {
        id: 'exec-803',
        automationId: 'auto-102',
        automationName: 'Admissions Counseling 24-Hour Reminder',
        triggerType: 'EVENT_RELATIVE',
        recipientName: 'Fatima Al-Zahra',
        recipientPhone: '+971 50 123 4567',
        templateName: 'appointment_reminder',
        templateSnapshot: {
            body: 'Hello Fatima Al-Zahra, this is a reminder for your upcoming session on Tomorrow at 11:00 AM with our senior counselor Admissions Officer.'
        },
        status: 'Success',
        reason: 'Delivered (Read by candidate)',
        executedAt: '2026-11-27T10:00:22.000Z',
        isTest: false,
        duplicateKey: 'auto-102:+971501234567:appt-771'
    },
    {
        id: 'exec-804',
        automationId: 'auto-102',
        automationName: 'Admissions Counseling 24-Hour Reminder',
        triggerType: 'EVENT_RELATIVE',
        recipientName: 'Invalid Lead Entry',
        recipientPhone: '+1 (000) 000-0000',
        templateName: 'appointment_reminder',
        templateSnapshot: {
            body: 'Hello Invalid Lead Entry, this is a reminder for your upcoming session on Tomorrow at 11:00 AM.'
        },
        status: 'Failed',
        reason: 'WhatsApp number is invalid or not registered on WhatsApp',
        executedAt: '2026-11-27T10:00:24.000Z',
        isTest: false,
        duplicateKey: 'auto-102:+10000000000:appt-772'
    },
    {
        id: 'exec-805',
        automationId: 'auto-103',
        automationName: 'Tuition Fee Milestone 3-Day Reminder',
        triggerType: 'EVENT_RELATIVE',
        recipientName: 'Tariq Mahmoud',
        recipientPhone: '+20 100 555 1234',
        templateName: 'payment_reminder',
        templateSnapshot: {
            body: 'Dear Tariq Mahmoud, friendly reminder that invoice INV-2026-904 of $2,500 is due on Dec 01, 2026.'
        },
        status: 'Success',
        reason: 'Delivered (Double tick confirmed)',
        executedAt: '2026-11-27T11:00:08.000Z',
        isTest: false,
        duplicateKey: 'auto-103:+201005551234:inv-904'
    },
    {
        id: 'exec-806',
        automationId: 'auto-101',
        automationName: 'Applicant Birthday Greeting Engine',
        triggerType: 'SCHEDULE_ANNUAL',
        recipientName: 'Aarav Patel (Test)',
        recipientPhone: '+91 98765 43210',
        templateName: 'birthday_wishes',
        templateSnapshot: {
            body: 'Happy Birthday Aarav Patel! 🎂 Wishing you a wonderful year ahead. Enjoy 25% discount off your university application fees with code BDAY2026!'
        },
        status: 'Success',
        reason: 'Simulated Test Execution completed successfully',
        executedAt: '2026-11-27T12:30:10.000Z',
        isTest: true,
        duplicateKey: 'test:auto-101:+919876543210:test-run-1'
    }
];
