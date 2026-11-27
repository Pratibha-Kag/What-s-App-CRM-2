/**
 * Developer 1 — WhatsApp Template Management Mock Data
 * Realistic WhatsApp Business Cloud API Message Templates across Marketing, Utility, and Authentication categories.
 */

export const initialWhatsAppTemplates = [
    {
        id: 'tmpl-101',
        name: 'early_bird_admissions_offer',
        title: 'Early Bird Admissions Offer',
        category: 'Marketing',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Exclusive Fall Admissions Waiver 🎓'
        },
        body: 'Hello {{1}}! Applications for the upcoming academic intake are now open at {{2}}. Apply before {{3}} to receive a {{4}} application fee waiver and priority scholarship review.',
        footer: 'Reply STOP to unsubscribe • EduCorp Official',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Aarav Patel' },
            { key: '2', name: 'University / College', sample: 'University of Manchester' },
            { key: '3', name: 'Deadline Date', sample: 'October 15, 2026' },
            { key: '4', name: 'Discount / Waiver', sample: '100%' }
        ],
        buttons: [
            { type: 'URL', text: 'Apply with Waiver', url: 'https://admissions.educorp.org/apply' },
            { type: 'QUICK_REPLY', text: 'Talk to an Advisor' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-10T10:00:00.000Z',
        updatedAt: '2026-08-12T14:30:00.000Z'
    },
    {
        id: 'tmpl-102',
        name: 'appointment_reminder_counseling',
        title: 'Counseling Appointment Reminder',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Upcoming Study Abroad Consultation 📅'
        },
        body: 'Hi {{1}}, this is a reminder for your scheduled 1-on-1 counseling session on {{2}} at {{3}} with advisor {{4}}. Please have your transcripts ready.',
        footer: 'EduCorp Student Advisory Services',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Fatima Al-Zahra' },
            { key: '2', name: 'Appointment Date', sample: 'September 12, 2026' },
            { key: '3', name: 'Appointment Time', sample: '3:30 PM EST' },
            { key: '4', name: 'Advisor Name', sample: 'Rahul Kapoor' }
        ],
        buttons: [
            { type: 'QUICK_REPLY', text: 'Confirm Attendance' },
            { type: 'QUICK_REPLY', text: 'Reschedule Session' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-15T09:15:00.000Z',
        updatedAt: '2026-08-16T11:00:00.000Z'
    },
    {
        id: 'tmpl-103',
        name: 'appointment_reschedule_notice',
        title: 'Appointment Rescheduled Confirmation',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Session Rescheduled 🔄'
        },
        body: 'Hello {{1}}, your consultation has been successfully rescheduled to {{2}} at {{3}} with {{4}}. A revised calendar invite has been sent to your email.',
        footer: 'EduCorp Global Admissions',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Carlos Mendoza' },
            { key: '2', name: 'New Date', sample: 'September 18, 2026' },
            { key: '3', name: 'New Time', sample: '4:00 PM EST' },
            { key: '4', name: 'Counselor Name', sample: 'Priya Sharma' }
        ],
        buttons: [
            { type: 'QUICK_REPLY', text: 'Add to Calendar' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-18T13:45:00.000Z',
        updatedAt: '2026-08-19T08:20:00.000Z'
    },
    {
        id: 'tmpl-104',
        name: 'appointment_cancellation_ack',
        title: 'Appointment Cancellation Notice',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Appointment Cancelled'
        },
        body: 'Hi {{1}}, as requested, your counseling session scheduled for {{2}} has been cancelled. You can easily book a new session whenever you are ready.',
        footer: 'EduCorp Admissions',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Zoe Chen' },
            { key: '2', name: 'Cancelled Date & Time', sample: 'September 20 at 2:00 PM' }
        ],
        buttons: [
            { type: 'URL', text: 'Book New Session', url: 'https://admissions.educorp.org/schedule' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-20T11:00:00.000Z',
        updatedAt: '2026-08-20T11:00:00.000Z'
    },
    {
        id: 'tmpl-105',
        name: 'fee_payment_reminder',
        title: 'Tuition Fee Payment Reminder',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Payment Reminder Notice 💳'
        },
        body: 'Dear {{1}}, this is a friendly reminder that an outstanding payment of {{2}} for invoice #{{3}} is due on {{4}}. Please process the payment to ensure uninterrupted visa processing.',
        footer: 'EduCorp Finance & Accounts',
        variables: [
            { key: '1', name: 'Payer Name', sample: 'Tariq Mahmoud' },
            { key: '2', name: 'Amount Due', sample: '$1,250.00 USD' },
            { key: '3', name: 'Invoice Number', sample: 'INV-2026-889' },
            { key: '4', name: 'Due Date', sample: 'September 25, 2026' }
        ],
        buttons: [
            { type: 'URL', text: 'Pay Securely Online', url: 'https://pay.educorp.org/invoice' },
            { type: 'QUICK_REPLY', text: 'Payment Already Made' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-22T15:30:00.000Z',
        updatedAt: '2026-08-23T10:10:00.000Z'
    },
    {
        id: 'tmpl-106',
        name: 'payment_received_confirmation',
        title: 'Payment Confirmation Receipt',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Payment Confirmation ✅'
        },
        body: 'Thank you {{1}}! We have successfully received your payment of {{2}} for {{3}}. Your transaction reference is {{4}}.',
        footer: 'EduCorp Official Finance Desk',
        variables: [
            { key: '1', name: 'Customer Name', sample: 'Kwame Mensah' },
            { key: '2', name: 'Amount Paid', sample: '$750.00 USD' },
            { key: '3', name: 'Service / Item', sample: 'Visa Filing Assistance' },
            { key: '4', name: 'Reference ID', sample: 'TXN-9988241' }
        ],
        buttons: [
            { type: 'URL', text: 'Download Receipt', url: 'https://admissions.educorp.org/receipts' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-25T12:00:00.000Z',
        updatedAt: '2026-08-25T14:45:00.000Z'
    },
    {
        id: 'tmpl-107',
        name: 'application_order_status_update',
        title: 'Application Document Status Update',
        category: 'Utility',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Application Status Update 📋'
        },
        body: 'Hi {{1}}, your application file for {{2}} at {{3}} has progressed to the stage: "{{4}}". Our compliance officer has verified all academic transcripts.',
        footer: 'EduCorp Verification Bureau',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Hannah Schmidt' },
            { key: '2', name: 'Program Name', sample: 'MSc Data Science' },
            { key: '3', name: 'Institution', sample: 'Technical University of Munich' },
            { key: '4', name: 'Status Stage', sample: 'Faculty Assessment' }
        ],
        buttons: [
            { type: 'URL', text: 'Track Application', url: 'https://portal.educorp.org/status' }
        ],
        rejectionReason: null,
        createdAt: '2026-08-28T09:00:00.000Z',
        updatedAt: '2026-08-29T16:00:00.000Z'
    },
    {
        id: 'tmpl-108',
        name: 'student_portal_otp_verification',
        title: 'Student Portal One-Time Passcode (OTP)',
        category: 'Authentication',
        language: 'English (US)',
        status: 'Approved',
        header: null,
        body: '{{1}} is your verification code for the EduCorp Portal. For your security, do not share this code with anyone. This code expires in 10 minutes.',
        footer: 'Security Automated Notice',
        variables: [
            { key: '1', name: 'OTP Code', sample: '849201' }
        ],
        buttons: [
            { type: 'URL', text: 'Copy Code', url: 'https://auth.educorp.org/verify?code=849201' }
        ],
        rejectionReason: null,
        createdAt: '2026-09-01T08:00:00.000Z',
        updatedAt: '2026-09-01T08:00:00.000Z'
    },
    {
        id: 'tmpl-109',
        name: 'birthday_wishes_student',
        title: 'Birthday Greeting & Special Gift',
        category: 'Marketing',
        language: 'English (US)',
        status: 'Approved',
        header: {
            type: 'TEXT',
            text: 'Happy Birthday {{1}}! 🎂'
        },
        body: 'Wishing you a fantastic birthday from all of us at {{2}}! To celebrate your special day, enjoy a complimentary {{3}} mock test voucher valid through the end of the month.',
        footer: 'Warmest wishes from the EduCorp Family',
        variables: [
            { key: '1', name: 'Customer Name', sample: 'Ananya Deshmukh' },
            { key: '2', name: 'Company Name', sample: 'EduCorp Global' },
            { key: '3', name: 'Gift / Voucher', sample: 'IELTS Band Assessment' }
        ],
        buttons: [
            { type: 'URL', text: 'Claim Birthday Gift', url: 'https://admissions.educorp.org/birthday' }
        ],
        rejectionReason: null,
        createdAt: '2026-09-02T10:30:00.000Z',
        updatedAt: '2026-09-02T11:00:00.000Z'
    },
    {
        id: 'tmpl-110',
        name: 'festival_greetings_new_year',
        title: 'Seasonal Festival & New Year Greeting',
        category: 'Marketing',
        language: 'English (US)',
        status: 'Pending',
        header: {
            type: 'TEXT',
            text: 'Season Greetings from EduCorp ✨'
        },
        body: 'Dear {{1}}, may the celebration of {{2}} bring happiness and success to you and your family! As we welcome the new season, our counselors are offering free portfolio reviews for {{3}} intake.',
        footer: 'EduCorp Admissions Network',
        variables: [
            { key: '1', name: 'Recipient Name', sample: 'Rasel Ahmed' },
            { key: '2', name: 'Festival / Season', sample: 'New Year 2027' },
            { key: '3', name: 'Target Intake', sample: 'Spring 2027' }
        ],
        buttons: [
            { type: 'QUICK_REPLY', text: 'Schedule Free Review' }
        ],
        rejectionReason: null,
        createdAt: '2026-09-05T14:00:00.000Z',
        updatedAt: '2026-09-05T14:00:00.000Z'
    },
    {
        id: 'tmpl-111',
        name: 'promotional_flash_scholarship',
        title: 'Flash Scholarship Opportunity',
        category: 'Marketing',
        language: 'English (US)',
        status: 'Rejected',
        header: {
            type: 'TEXT',
            text: 'URGENT: $10,000 Scholarship Available'
        },
        body: 'Click here immediately to claim {{1}} before midnight! Guaranteed visa approval for all {{2}} students.',
        footer: 'Unsubscribe anytime',
        variables: [
            { key: '1', name: 'Prize Amount', sample: '$10,000 USD' },
            { key: '2', name: 'Student Group', sample: 'International' }
        ],
        buttons: [
            { type: 'URL', text: 'Claim Money Now', url: 'https://admissions.educorp.org/claim' }
        ],
        rejectionReason: 'Content violates WhatsApp Commerce Policy regarding exaggerated claims, guaranteed visa promises, and spammy phrasing. Please revise text to remove guarantees and submit for re-review.',
        createdAt: '2026-09-06T16:20:00.000Z',
        updatedAt: '2026-09-07T09:30:00.000Z'
    },
    {
        id: 'tmpl-112',
        name: 'draft_visa_document_reminder',
        title: 'Visa Embassy Appointment Checklist (Draft)',
        category: 'Utility',
        language: 'English (US)',
        status: 'Draft',
        header: {
            type: 'TEXT',
            text: 'Embassy Biometrics Appointment Checklist'
        },
        body: 'Hello {{1}}, please be prepared for your upcoming visa biometrics on {{2}}. Make sure to bring your original passport and {{3}}.',
        footer: 'EduCorp Visa Services',
        variables: [
            { key: '1', name: 'Student Name', sample: 'Sohel Rana' },
            { key: '2', name: 'Biometrics Date', sample: 'October 5, 2026' },
            { key: '3', name: 'Required Document', sample: 'Form I-20 / CAS statement' }
        ],
        buttons: [
            { type: 'QUICK_REPLY', text: 'Documents Ready' }
        ],
        rejectionReason: null,
        createdAt: '2026-09-07T11:00:00.000Z',
        updatedAt: '2026-09-07T11:00:00.000Z'
    }
];
