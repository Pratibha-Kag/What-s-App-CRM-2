/**
 * Developer 1 — Module-Specific WhatsApp Mock Dataset
 * Standalone mock dataset specifically powering WhatsApp Messaging & Tracking UI.
 * Does not modify global src/mock/mockData.js.
 */

export const initialWhatsAppAccount = {
    connected: true,
    status: 'connected', // 'connected' | 'disconnected' | 'connecting'
    businessName: 'WhatsApp CRM Official',
    phone: '+1 (555) 019-2834',
    verified: true,
    qualityRating: 'High (Green)',
    channelType: 'WhatsApp Cloud API',
    lastSynced: 'Just now'
};

export const initialWhatsAppConversations = [
    {
        id: 'conv-101',
        lead_id: 101,
        lead_name: 'Aarav Patel',
        lead_phone: '+91 98765 43210',
        unread_count: 0,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        tag: 'Student / UK Intake',
        last_message: 'Thank you! I have uploaded my transcript and SOP draft.',
        last_message_time: '2026-09-06T10:30:00.000Z',
        last_message_status: 'read'
    },
    {
        id: 'conv-102',
        lead_id: 102,
        lead_name: 'Fatima Al-Zahra',
        lead_phone: '+971 50 123 4567',
        unread_count: 2,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
        tag: 'Biotechnology MSc',
        last_message: 'Can you please confirm the scholarship deadline for January intake?',
        last_message_time: '2026-09-07T06:45:00.000Z',
        last_message_status: null // Incoming
    },
    {
        id: 'conv-103',
        lead_id: 103,
        lead_name: 'Carlos Mendoza',
        lead_phone: '+1 (555) 234-5678',
        unread_count: 0,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        tag: 'STEM MBA / USA',
        last_message: 'Sounds great. Let us schedule the call for Thursday afternoon.',
        last_message_time: '2026-09-05T15:20:00.000Z',
        last_message_status: 'delivered'
    },
    {
        id: 'conv-104',
        lead_id: 104,
        lead_name: 'Zoe Chen',
        lead_phone: '+1 (416) 789-0123',
        unread_count: 0,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
        tag: 'Undergraduate Australia',
        last_message: 'Offer letter received! Thank you so much for your assistance.',
        last_message_time: '2026-09-04T18:00:00.000Z',
        last_message_status: 'read'
    },
    {
        id: 'conv-105',
        lead_id: 105,
        lead_name: 'Tariq Mahmoud',
        lead_phone: '+20 100 555 1234',
        unread_count: 1,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        tag: 'Mechanical Eng / Germany',
        last_message: 'Do I need German B1 proficiency before applying for the Master program?',
        last_message_time: '2026-09-07T08:15:00.000Z',
        last_message_status: null
    },
    {
        id: 'conv-106',
        lead_id: 106,
        lead_name: 'Ananya Deshmukh',
        lead_phone: '+91 99887 76655',
        unread_count: 0,
        channel: 'WhatsApp',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
        tag: 'B.Pharm / Canada',
        last_message: 'Your official document checklist has been generated.',
        last_message_time: '2026-09-07T11:20:00.000Z',
        last_message_status: 'failed' // Showcases retry UI!
    }
];

export const initialWhatsAppMessages = {
    'conv-101': [
        {
            id: 'msg-101-1',
            conversation_id: 'conv-101',
            sender_type: 'Customer',
            message: 'Hello! I am looking for Master in Computer Science programs in the UK with September intake.',
            created_at: '2026-09-06T09:00:00.000Z',
            status: null
        },
        {
            id: 'msg-101-2',
            conversation_id: 'conv-101',
            sender_type: 'Agent',
            message: 'Hi Aarav! We would be thrilled to help you. Which universities are on your shortlist? Also, what is your IELTS score?',
            created_at: '2026-09-06T09:12:00.000Z',
            status: 'read'
        },
        {
            id: 'msg-101-3',
            conversation_id: 'conv-101',
            sender_type: 'Customer',
            message: 'My IELTS overall band is 7.5. Shortlisted Manchester, Bristol, and Sheffield.',
            created_at: '2026-09-06T09:25:00.000Z',
            status: null
        },
        {
            id: 'msg-101-4',
            conversation_id: 'conv-101',
            sender_type: 'Agent',
            message: 'Excellent profile! Those align perfectly with your background. Please upload your graduation transcripts and current SOP.',
            created_at: '2026-09-06T09:40:00.000Z',
            status: 'read'
        },
        {
            id: 'msg-101-5',
            conversation_id: 'conv-101',
            sender_type: 'Customer',
            message: 'Thank you! I have uploaded my transcript and SOP draft.',
            created_at: '2026-09-06T10:30:00.000Z',
            status: null
        },
        {
            id: 'msg-101-6',
            conversation_id: 'conv-101',
            sender_type: 'Agent',
            message: 'Received! Our counselor will review the SOP draft and get back to you within 24 hours.',
            created_at: '2026-09-06T10:35:00.000Z',
            status: 'read'
        }
    ],
    'conv-102': [
        {
            id: 'msg-102-1',
            conversation_id: 'conv-102',
            sender_type: 'Customer',
            message: 'Hi there, interested in studying biotechnology in Canada.',
            created_at: '2026-09-07T06:10:00.000Z',
            status: null
        },
        {
            id: 'msg-102-2',
            conversation_id: 'conv-102',
            sender_type: 'Agent',
            message: 'Welcome Fatima! McGill and UBC have world-class research institutes for biotechnology. Have you checked their prerequisite courses?',
            created_at: '2026-09-07T06:22:00.000Z',
            status: 'read'
        },
        {
            id: 'msg-102-3',
            conversation_id: 'conv-102',
            sender_type: 'Customer',
            message: 'Yes, I meet the credit requirements. Can you please confirm the scholarship deadline for January intake?',
            created_at: '2026-09-07T06:45:00.000Z',
            status: null
        }
    ],
    'conv-103': [
        {
            id: 'msg-103-1',
            conversation_id: 'conv-103',
            sender_type: 'Customer',
            message: 'Saw your WhatsApp ad about MBA programs with STEM designation.',
            created_at: '2026-09-05T14:00:00.000Z',
            status: null
        },
        {
            id: 'msg-103-2',
            conversation_id: 'conv-103',
            sender_type: 'Agent',
            message: 'Hello Carlos! Yes, STEM MBAs offer a 3-year OPT extension in the US. Would you like a 15-minute consultation with our advisor?',
            created_at: '2026-09-05T14:30:00.000Z',
            status: 'delivered'
        },
        {
            id: 'msg-103-3',
            conversation_id: 'conv-103',
            sender_type: 'Customer',
            message: 'Sounds great. Let us schedule the call for Thursday afternoon.',
            created_at: '2026-09-05T15:20:00.000Z',
            status: null
        },
        {
            id: 'msg-103-4',
            conversation_id: 'conv-103',
            sender_type: 'Agent',
            message: 'Calendar invite sent to your registered email for 3:00 PM EST.',
            created_at: '2026-09-05T15:25:00.000Z',
            status: 'delivered'
        }
    ],
    'conv-104': [
        {
            id: 'msg-104-1',
            conversation_id: 'conv-104',
            sender_type: 'Customer',
            message: 'Hi, I applied through your portal last month.',
            created_at: '2026-09-04T17:30:00.000Z',
            status: null
        },
        {
            id: 'msg-104-2',
            conversation_id: 'conv-104',
            sender_type: 'Agent',
            message: 'Hello Zoe! Checking your university portal status now.',
            created_at: '2026-09-04T17:45:00.000Z',
            status: 'read'
        },
        {
            id: 'msg-104-3',
            conversation_id: 'conv-104',
            sender_type: 'Customer',
            message: 'Offer letter received! Thank you so much for your assistance.',
            created_at: '2026-09-04T18:00:00.000Z',
            status: null
        },
        {
            id: 'msg-104-4',
            conversation_id: 'conv-104',
            sender_type: 'Agent',
            message: 'Congratulations Zoe! 🎉 That is fantastic news! Next step is visa document collection.',
            created_at: '2026-09-04T18:05:00.000Z',
            status: 'sent'
        }
    ],
    'conv-105': [
        {
            id: 'msg-105-1',
            conversation_id: 'conv-105',
            sender_type: 'Customer',
            message: 'Do I need German B1 proficiency before applying for the Master program in Mechanical Engineering?',
            created_at: '2026-09-07T08:15:00.000Z',
            status: null
        }
    ],
    'conv-106': [
        {
            id: 'msg-106-1',
            conversation_id: 'conv-106',
            sender_type: 'Customer',
            message: 'Hi team, could you please send the pharmacy board verification checklist?',
            created_at: '2026-09-07T11:00:00.000Z',
            status: null
        },
        {
            id: 'msg-106-2',
            conversation_id: 'conv-106',
            sender_type: 'Agent',
            message: 'Your official document checklist has been generated.',
            created_at: '2026-09-07T11:20:00.000Z',
            status: 'failed',
            error_reason: 'Network timeout (Simulated error)'
        }
    ]
};
