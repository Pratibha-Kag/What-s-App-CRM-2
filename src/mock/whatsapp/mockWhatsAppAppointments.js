/**
 * Developer 1 — Appointment Automation Mock Data
 * Realistic simulated appointment records from connected software sources:
 * - Calendly Sync
 * - Clinic Pro CRM
 * - HubSpot Meeting
 * - Internal Admissions CRM
 */

export const initialConnectedSources = [
    {
        id: 'calendly',
        name: 'Calendly Sync',
        type: 'Appointment Booking',
        status: 'Connected',
        lastSyncedAt: '2026-11-27T10:15:00.000Z',
        recordsCount: 4,
        badge: 'Real-time Webhook'
    },
    {
        id: 'hubspot',
        name: 'HubSpot Meeting',
        type: 'CRM Meetings',
        status: 'Connected',
        lastSyncedAt: '2026-11-27T09:40:00.000Z',
        recordsCount: 3,
        badge: 'Bi-directional'
    },
    {
        id: 'clinic_pro',
        name: 'Clinic Pro CRM',
        type: 'Student Wellness & Assessments',
        status: 'Connected',
        lastSyncedAt: '2026-11-27T08:30:00.000Z',
        recordsCount: 1,
        badge: 'API Connected'
    },
    {
        id: 'internal',
        name: 'Internal Admissions CRM',
        type: 'Direct Scheduling',
        status: 'Connected',
        lastSyncedAt: '2026-11-27T10:30:00.000Z',
        recordsCount: 2,
        badge: 'Native Database'
    }
];

export const initialWhatsAppAppointments = [
    {
        id: 'appt-001',
        customerId: 'aud-001',
        customerName: 'Aarav Patel',
        phone: '+91 98765 43210',
        appointmentType: 'Admissions Counseling',
        counselorName: 'Dr. Alistair Finch',
        scheduledDate: '2026-11-27',
        scheduledTime: '16:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Confirmed', // 'Scheduled' | 'Confirmed' | 'Completed' | 'Missed' | 'Rescheduled' | 'Cancelled'
        source: 'Calendly Sync',
        reminderStatus: '1-Day Sent', // 'Pending' | '1-Day Sent' | 'Same-Day Sent' | 'Follow-up Sent' | 'Cancelled'
        remindersSent: [
            { type: '1_DAY_BEFORE', sentAt: '2026-11-26T16:00:00.000Z', status: 'Success' }
        ],
        notes: 'Priority consultation regarding UK Russell Group universities.',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-26T16:00:00.000Z'
    },
    {
        id: 'appt-002',
        customerId: 'aud-002',
        customerName: 'Fatima Al-Zahra',
        phone: '+971 50 123 4567',
        appointmentType: 'UK Tier-4 Visa Briefing',
        counselorName: 'Sarah Jenkins',
        scheduledDate: '2026-11-28',
        scheduledTime: '11:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'HubSpot Meeting',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'Review of financial evidence and CAS statement prerequisites.',
        createdAt: '2026-11-21T11:30:00.000Z',
        updatedAt: '2026-11-21T11:30:00.000Z'
    },
    {
        id: 'appt-003',
        customerId: 'aud-003',
        customerName: 'Carlos Mendoza',
        phone: '+1 (555) 234-5678',
        appointmentType: 'Scholarship Eligibility Review',
        counselorName: 'Michael Chang',
        scheduledDate: '2026-11-29',
        scheduledTime: '14:30',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'Internal Admissions CRM',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'MBA merit scholarship assessment and GMAT score evaluation.',
        createdAt: '2026-11-22T09:15:00.000Z',
        updatedAt: '2026-11-22T09:15:00.000Z'
    },
    {
        id: 'appt-004',
        customerId: 'aud-004',
        customerName: 'Zoe Chen',
        phone: '+1 (416) 789-0123',
        appointmentType: 'Academic Assessment & SOP Review',
        counselorName: 'Dr. Alistair Finch',
        scheduledDate: '2026-11-27',
        scheduledTime: '14:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Completed',
        source: 'Calendly Sync',
        reminderStatus: 'Same-Day Sent',
        remindersSent: [
            { type: '1_DAY_BEFORE', sentAt: '2026-11-26T14:00:00.000Z', status: 'Success' },
            { type: 'SAME_DAY', sentAt: '2026-11-27T12:00:00.000Z', status: 'Success' }
        ],
        notes: 'Undergraduate STEM personal statement completed and approved.',
        createdAt: '2026-11-22T14:00:00.000Z',
        updatedAt: '2026-11-27T14:45:00.000Z'
    },
    {
        id: 'appt-005',
        customerId: 'aud-005',
        customerName: 'Tariq Mahmoud',
        phone: '+20 100 555 1234',
        appointmentType: 'Admissions Counseling',
        counselorName: 'Sarah Jenkins',
        scheduledDate: '2026-11-26',
        scheduledTime: '10:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Missed',
        source: 'Clinic Pro CRM',
        reminderStatus: 'Follow-up Sent',
        remindersSent: [
            { type: '1_DAY_BEFORE', sentAt: '2026-11-25T10:00:00.000Z', status: 'Success' },
            { type: 'MISSED_FOLLOWUP', sentAt: '2026-11-26T10:30:00.000Z', status: 'Success' }
        ],
        notes: 'Candidate did not connect to virtual meeting room. Follow-up dispatched.',
        createdAt: '2026-11-19T10:00:00.000Z',
        updatedAt: '2026-11-26T10:30:00.000Z'
    },
    {
        id: 'appt-006',
        customerId: 'aud-006',
        customerName: 'Hannah Schmidt',
        phone: '+49 151 23456789',
        appointmentType: 'UK Tier-4 Visa Briefing',
        counselorName: 'Michael Chang',
        scheduledDate: '2026-12-01',
        scheduledTime: '15:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Rescheduled',
        source: 'HubSpot Meeting',
        reminderStatus: 'Reschedule Alert Sent',
        remindersSent: [
            { type: 'RESCHEDULED', sentAt: '2026-11-25T11:00:00.000Z', status: 'Success' }
        ],
        notes: 'Rescheduled from original date Nov 25 due to university exam conflict.',
        previousDate: '2026-11-25',
        previousTime: '15:00',
        createdAt: '2026-11-18T12:00:00.000Z',
        updatedAt: '2026-11-25T11:00:00.000Z'
    },
    {
        id: 'appt-007',
        customerId: 'aud-007',
        customerName: 'Kwame Mensah',
        phone: '+233 24 123 4567',
        appointmentType: 'University Pre-Departure Orientation',
        counselorName: 'Dr. Alistair Finch',
        scheduledDate: '2026-12-03',
        scheduledTime: '13:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'Internal Admissions CRM',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'Pre-departure housing, airport pickup, and visa stamping verification.',
        createdAt: '2026-11-24T16:00:00.000Z',
        updatedAt: '2026-11-24T16:00:00.000Z'
    },
    {
        id: 'appt-008',
        customerId: 'aud-008',
        customerName: 'Ananya Deshmukh',
        phone: '+91 99887 76655',
        appointmentType: 'Scholarship Eligibility Review',
        counselorName: 'Sarah Jenkins',
        scheduledDate: '2026-11-26',
        scheduledTime: '16:30',
        timezone: 'GMT+5:30 (IST)',
        status: 'Cancelled',
        source: 'Calendly Sync',
        reminderStatus: 'Cancellation Sent',
        remindersSent: [
            { type: 'CANCELLED', sentAt: '2026-11-26T12:00:00.000Z', status: 'Success' }
        ],
        cancellationReason: 'Candidate deferred enrollment to Spring 2027 intake.',
        createdAt: '2026-11-20T09:00:00.000Z',
        updatedAt: '2026-11-26T12:00:00.000Z'
    },
    {
        id: 'appt-009',
        customerId: 'aud-009',
        customerName: 'Rasel Ahmed',
        phone: '+880 1718 369004',
        appointmentType: 'Admissions Counseling',
        counselorName: 'Dr. Alistair Finch',
        scheduledDate: '2026-12-05',
        scheduledTime: '11:30',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'Calendly Sync',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'Inquiry regarding Birmingham and Manchester engineering direct entry.',
        createdAt: '2026-11-25T15:00:00.000Z',
        updatedAt: '2026-11-25T15:00:00.000Z'
    },
    {
        id: 'appt-010',
        customerId: 'aud-015',
        customerName: 'Priya Sharma',
        phone: '+91 97112 34567',
        appointmentType: 'UK Tier-4 Visa Briefing',
        counselorName: 'Sarah Jenkins',
        scheduledDate: '2026-11-27',
        scheduledTime: '17:30',
        timezone: 'GMT+5:30 (IST)',
        status: 'Confirmed',
        source: 'HubSpot Meeting',
        reminderStatus: 'Same-Day Sent',
        remindersSent: [
            { type: 'SAME_DAY', sentAt: '2026-11-27T15:00:00.000Z', status: 'Success' }
        ],
        notes: 'Priority visa document checklist verification.',
        createdAt: '2026-11-26T08:00:00.000Z',
        updatedAt: '2026-11-27T15:00:00.000Z'
    }
];

export const simulatedSyncIncomingPool = [
    {
        id: 'appt-011',
        customerId: 'aud-010',
        customerName: 'Amit Halder',
        phone: '+880 1948 724309',
        appointmentType: 'Admissions Counseling',
        counselorName: 'Michael Chang',
        scheduledDate: '2026-11-30',
        scheduledTime: '10:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'Calendly Sync',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'Synced live from Calendly intake form.',
        createdAt: '2026-11-27T10:45:00.000Z',
        updatedAt: '2026-11-27T10:45:00.000Z'
    },
    {
        id: 'appt-012',
        customerId: 'aud-016',
        customerName: 'Lucas Silva',
        phone: '+55 11 98765-4321',
        appointmentType: 'Scholarship Eligibility Review',
        counselorName: 'Dr. Alistair Finch',
        scheduledDate: '2026-12-02',
        scheduledTime: '16:00',
        timezone: 'GMT+5:30 (IST)',
        status: 'Scheduled',
        source: 'HubSpot Meeting',
        reminderStatus: 'Pending',
        remindersSent: [],
        notes: 'Synced live from HubSpot CRM scheduling widget.',
        createdAt: '2026-11-27T10:50:00.000Z',
        updatedAt: '2026-11-27T10:50:00.000Z'
    }
];
