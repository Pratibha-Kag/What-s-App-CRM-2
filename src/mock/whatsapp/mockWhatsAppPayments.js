/**
 * Developer 1 — WhatsApp Payment Reminder Automation Mock Data
 * Realistic simulated payment records from external accounting, ERP, billing and CRM platforms:
 * QuickBooks Sync, Zoho Books, Tally Prime ERP, and Razorpay Invoices.
 */

export const initialConnectedPaymentSources = [
    {
        id: 'quickbooks',
        name: 'QuickBooks Online Sync',
        type: 'Accounting / Invoicing',
        status: 'connected',
        icon: 'FileSpreadsheet',
        lastSyncedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
        recordsCount: 14,
        autoSyncEnabled: true,
        endpoint: 'https://api.intuit.com/v3/company/demo/invoices'
    },
    {
        id: 'zoho',
        name: 'Zoho Books Enterprise',
        type: 'ERP & Billing',
        status: 'connected',
        icon: 'BookOpen',
        lastSyncedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        recordsCount: 9,
        autoSyncEnabled: true,
        endpoint: 'https://books.zoho.com/api/v3/invoices'
    },
    {
        id: 'tally',
        name: 'Tally Prime ERP Connector',
        type: 'Desktop ERP Bridge',
        status: 'connected',
        icon: 'Database',
        lastSyncedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        recordsCount: 18,
        autoSyncEnabled: true,
        endpoint: 'http://localhost:9000/tally-bridge/v1/vouchers'
    },
    {
        id: 'razorpay',
        name: 'Razorpay Invoices & Links',
        type: 'Payment Gateway Invoicing',
        status: 'connected',
        icon: 'CreditCard',
        lastSyncedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        recordsCount: 7,
        autoSyncEnabled: true,
        endpoint: 'https://api.razorpay.com/v1/invoices'
    }
];

export const initialPaymentReminderRules = {
    beforeDue: {
        enabled: true,
        daysOffset: 3, // 3 days before due date
        executionTime: '10:00',
        timezone: 'GMT+5:30 (IST)',
        templateId: 'tmpl-105',
        templateName: 'fee_payment_reminder',
        title: '3-Day Pre-Due Reminder'
    },
    onDue: {
        enabled: true,
        executionTime: '09:00',
        timezone: 'GMT+5:30 (IST)',
        templateId: 'tmpl-105',
        templateName: 'fee_payment_reminder',
        title: 'Due Date Alert'
    },
    overdue: {
        enabled: true,
        daysOffset: 2, // 2 days after due date
        recurring: true,
        frequency: 'every_3_days', // 'daily' | 'every_3_days' | 'weekly' | 'monthly'
        maxAttempts: 3,
        executionTime: '11:00',
        timezone: 'GMT+5:30 (IST)',
        templateId: 'tmpl-105',
        templateName: 'fee_payment_reminder',
        title: 'Overdue Follow-up'
    },
    paymentReceived: {
        enabled: true,
        autoSendConfirmation: true,
        templateId: 'tmpl-106',
        templateName: 'payment_received_confirmation',
        title: 'Instant Payment Receipt Confirmation'
    }
};

export const initialWhatsAppPayments = [
    {
        id: 'pay-001',
        invoiceNumber: 'INV-2026-8801',
        customerId: 'cust-101',
        customerName: 'Rahul Verma',
        phone: '+91 98765 43210',
        email: 'rahul.verma@example.com',
        totalAmount: 45000,
        paidAmount: 0,
        outstandingAmount: 45000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-20', // Overdue by 7 days
        status: 'Overdue',
        source: 'QuickBooks Online Sync',
        sourceId: 'quickbooks',
        reminderStatus: 'Sent (2)',
        reminderCount: 2,
        lastReminderAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        nextReminderAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8801',
        items: [
            { description: 'Annual Enterprise WhatsApp CRM License', qty: 1, rate: 45000, amount: 45000 }
        ],
        paymentsHistory: [],
        remindersSent: [
            { id: 'rem-1', type: 'BEFORE_DUE', sentAt: '2026-11-17T10:00:00.000Z', status: 'Success', amountSnap: 45000 },
            { id: 'rem-2', type: 'ON_DUE', sentAt: '2026-11-20T09:00:00.000Z', status: 'Success', amountSnap: 45000 }
        ],
        createdAt: '2026-11-05T09:00:00.000Z',
        updatedAt: '2026-11-25T11:00:00.000Z'
    },
    {
        id: 'pay-002',
        invoiceNumber: 'INV-2026-8802',
        customerId: 'cust-102',
        customerName: 'Priya Sundaram',
        phone: '+91 98112 34567',
        email: 'priya.sundaram@techvista.in',
        totalAmount: 32000,
        paidAmount: 12000,
        outstandingAmount: 20000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-25', // Overdue by 2 days
        status: 'Overdue',
        source: 'Zoho Books Enterprise',
        sourceId: 'zoho',
        reminderStatus: 'Sent (1)',
        reminderCount: 1,
        lastReminderAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        nextReminderAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8802',
        items: [
            { description: 'Custom WhatsApp Bot & Webhook Setup', qty: 1, rate: 20000, amount: 20000 },
            { description: 'Meta Cloud API Verification Support', qty: 1, rate: 12000, amount: 12000 }
        ],
        paymentsHistory: [
            { id: 'tx-01', amount: 12000, paymentMethod: 'UPI / GPay', referenceNote: 'Advance Token Payment', paidAt: '2026-11-10T14:30:00.000Z' }
        ],
        remindersSent: [
            { id: 'rem-3', type: 'ON_DUE', sentAt: '2026-11-25T09:00:00.000Z', status: 'Success', amountSnap: 20000 }
        ],
        createdAt: '2026-11-08T10:15:00.000Z',
        updatedAt: '2026-11-25T16:00:00.000Z'
    },
    {
        id: 'pay-003',
        invoiceNumber: 'INV-2026-8803',
        customerId: 'cust-103',
        customerName: 'Ananya Sharma',
        phone: '+91 97234 56789',
        email: 'ananya.sharma@apexcorp.org',
        totalAmount: 18500,
        paidAmount: 0,
        outstandingAmount: 18500,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-27', // Today!
        status: 'Pending',
        source: 'Razorpay Invoices & Links',
        sourceId: 'razorpay',
        reminderStatus: 'Scheduled (Today)',
        reminderCount: 1,
        lastReminderAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        nextReminderAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8803',
        items: [
            { description: 'Quarterly Campaign Blast Credits (50,000 Msgs)', qty: 1, rate: 18500, amount: 18500 }
        ],
        paymentsHistory: [],
        remindersSent: [
            { id: 'rem-4', type: 'BEFORE_DUE', sentAt: '2026-11-24T10:00:00.000Z', status: 'Success', amountSnap: 18500 }
        ],
        createdAt: '2026-11-12T11:45:00.000Z',
        updatedAt: '2026-11-24T10:00:00.000Z'
    },
    {
        id: 'pay-004',
        invoiceNumber: 'INV-2026-8804',
        customerId: 'cust-104',
        customerName: 'Karthik Raja',
        phone: '+91 99401 23456',
        email: 'karthik.raja@chennaiclinic.com',
        totalAmount: 75000,
        paidAmount: 30000,
        outstandingAmount: 45000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-30', // In 3 days
        status: 'Partially Paid',
        source: 'Tally Prime ERP Connector',
        sourceId: 'tally',
        reminderStatus: 'Pending Next Trigger',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8804',
        items: [
            { description: 'Clinic Multi-Doctor Appointment Automation Module', qty: 1, rate: 60000, amount: 60000 },
            { description: 'Staff Onboarding & Training (5 Admins)', qty: 1, rate: 15000, amount: 15000 }
        ],
        paymentsHistory: [
            { id: 'tx-02', amount: 30000, paymentMethod: 'NEFT / RTGS', referenceNote: 'Part-1 Initial Deposit', paidAt: '2026-11-15T11:00:00.000Z' }
        ],
        remindersSent: [],
        createdAt: '2026-11-14T15:20:00.000Z',
        updatedAt: '2026-11-15T11:00:00.000Z'
    },
    {
        id: 'pay-005',
        invoiceNumber: 'INV-2026-8805',
        customerId: 'cust-105',
        customerName: 'Fatima Zahra',
        phone: '+91 98450 11223',
        email: 'fatima.zahra@gulfconnect.ae',
        totalAmount: 25000,
        paidAmount: 25000,
        outstandingAmount: 0,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-18', // Paid in full
        status: 'Paid',
        source: 'QuickBooks Online Sync',
        sourceId: 'quickbooks',
        reminderStatus: 'Completed (All Halted)',
        reminderCount: 1,
        lastReminderAt: '2026-11-15T10:00:00.000Z',
        nextReminderAt: null,
        demoPaymentLink: 'https://pay.crm.io/inv-8805',
        items: [
            { description: 'WhatsApp Business Green Tick Verification Retainer', qty: 1, rate: 25000, amount: 25000 }
        ],
        paymentsHistory: [
            { id: 'tx-03', amount: 25000, paymentMethod: 'Credit Card (Razorpay)', referenceNote: 'Full Settlement Online', paidAt: '2026-11-17T16:20:00.000Z' }
        ],
        remindersSent: [
            { id: 'rem-5', type: 'BEFORE_DUE', sentAt: '2026-11-15T10:00:00.000Z', status: 'Success', amountSnap: 25000 },
            { id: 'rem-6', type: 'PAYMENT_RECEIVED', sentAt: '2026-11-17T16:21:00.000Z', status: 'Success', amountSnap: 0 }
        ],
        createdAt: '2026-11-01T12:00:00.000Z',
        updatedAt: '2026-11-17T16:21:00.000Z'
    },
    {
        id: 'pay-006',
        invoiceNumber: 'INV-2026-8806',
        customerId: 'cust-106',
        customerName: 'Rohan Mehta',
        phone: '+91 97654 32109',
        email: 'rohan.mehta@mumbaifintech.com',
        totalAmount: 54000,
        paidAmount: 0,
        outstandingAmount: 54000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-12-05', // Upcoming in 8 days
        status: 'Pending',
        source: 'Zoho Books Enterprise',
        sourceId: 'zoho',
        reminderStatus: 'Not Scheduled',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8806',
        items: [
            { description: 'Dedicated Dedicated IP & High-Throughput Routing Node', qty: 1, rate: 54000, amount: 54000 }
        ],
        paymentsHistory: [],
        remindersSent: [],
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-20T10:00:00.000Z'
    },
    {
        id: 'pay-007',
        invoiceNumber: 'INV-2026-8807',
        customerId: 'cust-107',
        customerName: 'Sneha Kulkarni',
        phone: '+91 96543 21098',
        email: 'sneha.k@puneedtech.org',
        totalAmount: 62000,
        paidAmount: 62000,
        outstandingAmount: 0,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-12',
        status: 'Paid',
        source: 'Tally Prime ERP Connector',
        sourceId: 'tally',
        reminderStatus: 'Completed (All Halted)',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: null,
        demoPaymentLink: 'https://pay.crm.io/inv-8807',
        items: [
            { description: 'University Admissions Chatbot & Lead Importer', qty: 1, rate: 62000, amount: 62000 }
        ],
        paymentsHistory: [
            { id: 'tx-04', amount: 62000, paymentMethod: 'Net Banking (HDFC)', referenceNote: 'Full Settlement on Invoice Issue', paidAt: '2026-11-12T09:45:00.000Z' }
        ],
        remindersSent: [],
        createdAt: '2026-11-10T09:30:00.000Z',
        updatedAt: '2026-11-12T09:45:00.000Z'
    },
    {
        id: 'pay-008',
        invoiceNumber: 'INV-2026-8808',
        customerId: 'cust-108',
        customerName: 'Vikramaditya Rao',
        phone: '+91 95432 10987',
        email: 'vikram.rao@hyderabadlogistics.com',
        totalAmount: 110000,
        paidAmount: 40000,
        outstandingAmount: 70000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-15', // Overdue by 12 days
        status: 'Overdue',
        source: 'QuickBooks Online Sync',
        sourceId: 'quickbooks',
        reminderStatus: 'Sent (3 - Max Reached)',
        reminderCount: 3,
        lastReminderAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        nextReminderAt: null,
        demoPaymentLink: 'https://pay.crm.io/inv-8808',
        items: [
            { description: 'Enterprise Multi-Agent Customer Support Center (25 Agents)', qty: 1, rate: 110000, amount: 110000 }
        ],
        paymentsHistory: [
            { id: 'tx-05', amount: 40000, paymentMethod: 'Bank Transfer (ICICI)', referenceNote: 'Initial Implementation Milestone', paidAt: '2026-11-05T14:15:00.000Z' }
        ],
        remindersSent: [
            { id: 'rem-7', type: 'BEFORE_DUE', sentAt: '2026-11-12T10:00:00.000Z', status: 'Success', amountSnap: 70000 },
            { id: 'rem-8', type: 'ON_DUE', sentAt: '2026-11-15T09:00:00.000Z', status: 'Success', amountSnap: 70000 },
            { id: 'rem-9', type: 'OVERDUE', sentAt: '2026-11-18T11:00:00.000Z', status: 'Success', amountSnap: 70000 }
        ],
        createdAt: '2026-11-01T10:00:00.000Z',
        updatedAt: '2026-11-18T11:00:00.000Z'
    },
    {
        id: 'pay-009',
        invoiceNumber: 'INV-2026-8809',
        customerId: 'cust-109',
        customerName: 'Meera Nambiar',
        phone: '+91 94321 09876',
        email: 'meera.nambiar@kochiwellness.org',
        totalAmount: 22000,
        paidAmount: 0,
        outstandingAmount: 22000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-12-02', // Due in 5 days
        status: 'Pending',
        source: 'Razorpay Invoices & Links',
        sourceId: 'razorpay',
        reminderStatus: 'Scheduled (Nov 29)',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8809',
        items: [
            { description: 'Ayurvedic Retreat Automated Reminders & Intake Forms', qty: 1, rate: 22000, amount: 22000 }
        ],
        paymentsHistory: [],
        remindersSent: [],
        createdAt: '2026-11-22T14:00:00.000Z',
        updatedAt: '2026-11-22T14:00:00.000Z'
    },
    {
        id: 'pay-010',
        invoiceNumber: 'INV-2026-8810',
        customerId: 'cust-110',
        customerName: 'Gurpreet Singh',
        phone: '+91 93210 98765',
        email: 'gurpreet.singh@punjabinfratech.com',
        totalAmount: 38000,
        paidAmount: 18000,
        outstandingAmount: 20000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-26', // Overdue by 1 day
        status: 'Overdue',
        source: 'Tally Prime ERP Connector',
        sourceId: 'tally',
        reminderStatus: 'Sent (1)',
        reminderCount: 1,
        lastReminderAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        nextReminderAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8810',
        items: [
            { description: 'Heavy Machinery Maintenance SMS + WhatsApp Alert System', qty: 1, rate: 38000, amount: 38000 }
        ],
        paymentsHistory: [
            { id: 'tx-06', amount: 18000, paymentMethod: 'Cheque Clearance', referenceNote: 'Cheque #409921 cleared', paidAt: '2026-11-18T12:30:00.000Z' }
        ],
        remindersSent: [
            { id: 'rem-10', type: 'ON_DUE', sentAt: '2026-11-26T09:00:00.000Z', status: 'Success', amountSnap: 20000 }
        ],
        createdAt: '2026-11-10T16:00:00.000Z',
        updatedAt: '2026-11-26T09:00:00.000Z'
    }
];

// Staging pool for simulated sync with external accounting software
export const simulatedPaymentSyncIncomingPool = [
    {
        id: 'pay-sync-011',
        invoiceNumber: 'INV-2026-8811',
        customerId: 'cust-111',
        customerName: 'Divya Nambeesan',
        phone: '+91 98877 66554',
        email: 'divya.n@keralatourism.org',
        totalAmount: 29500,
        paidAmount: 0,
        outstandingAmount: 29500,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-12-04',
        status: 'Pending',
        source: 'QuickBooks Online Sync',
        sourceId: 'quickbooks',
        reminderStatus: 'Not Scheduled',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8811',
        items: [
            { description: 'Resort Booking WhatsApp Confirmation Engine', qty: 1, rate: 29500, amount: 29500 }
        ],
        paymentsHistory: [],
        remindersSent: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'pay-sync-012',
        invoiceNumber: 'INV-2026-8812',
        customerId: 'cust-112',
        customerName: 'Aditya Birla Chemicals',
        phone: '+91 97766 55443',
        email: 'finance@abc-chemicals.in',
        totalAmount: 85000,
        paidAmount: 35000,
        outstandingAmount: 50000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-23', // Overdue
        status: 'Overdue',
        source: 'Zoho Books Enterprise',
        sourceId: 'zoho',
        reminderStatus: 'Not Scheduled',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date().toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8812',
        items: [
            { description: 'Supply Chain Bulk Notification API (Monthly Subscription)', qty: 1, rate: 85000, amount: 85000 }
        ],
        paymentsHistory: [
            { id: 'tx-07', amount: 35000, paymentMethod: 'RTGS', referenceNote: 'Milestone 1 Payment', paidAt: '2026-11-15T10:00:00.000Z' }
        ],
        remindersSent: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'pay-sync-013',
        invoiceNumber: 'INV-2026-8813',
        customerId: 'cust-113',
        customerName: 'Shalini Sengupta',
        phone: '+91 96655 44332',
        email: 'shalini@kolkatadesign.com',
        totalAmount: 16000,
        paidAmount: 0,
        outstandingAmount: 16000,
        currency: 'INR',
        currencySymbol: '₹',
        dueDate: '2026-11-28',
        status: 'Pending',
        source: 'Razorpay Invoices & Links',
        sourceId: 'razorpay',
        reminderStatus: 'Scheduled (Tomorrow)',
        reminderCount: 0,
        lastReminderAt: null,
        nextReminderAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        demoPaymentLink: 'https://pay.crm.io/inv-8813',
        items: [
            { description: 'Design Studio Client Proofing via WhatsApp', qty: 1, rate: 16000, amount: 16000 }
        ],
        paymentsHistory: [],
        remindersSent: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
