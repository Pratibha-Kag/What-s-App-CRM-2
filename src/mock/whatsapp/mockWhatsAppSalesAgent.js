/**
 * Developer 1 — AI Sales Agent Mock Data & Deterministic Simulator
 * Fictional AI providers (ChatGPT & Kimi), configurations, demo conversation flows,
 * and activity audit logs for WhatsApp CRM.
 */

export const initialSalesAgentProviders = {
    chatgpt: {
        id: 'chatgpt',
        name: 'OpenAI ChatGPT',
        company: 'OpenAI Inc.',
        icon: 'Sparkles',
        badgeColor: '#10A37F',
        description: 'Advanced conversational reasoning, multilingual sales persuasion, and versatile context handling.',
        status: 'Connected (Simulated)',
        isConfigured: true,
        latencyMs: 128,
        models: [
            { id: 'gpt-4o', name: 'GPT-4o (Omni Flagship - Recommended)', description: 'Fast multimodal reasoning, ideal for sales negotiations' },
            { id: 'gpt-4o-mini', name: 'GPT-4o-mini (Lightweight & Low Latency)', description: 'Ultra-fast response for high-volume customer inquiries' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (High Capability)', description: 'Deep analytical context for complex B2B quotes' }
        ],
        selectedModel: 'gpt-4o',
        endpoint: 'https://api.openai.com/v1/chat/completions (Sandbox)'
    },
    kimi: {
        id: 'kimi',
        name: 'Moonshot Kimi',
        company: 'Moonshot AI Ltd.',
        icon: 'BrainCircuit',
        badgeColor: '#6366F1',
        description: 'Exceptional long-context document synthesis, nuanced bilingual nuances, and structured data queries.',
        status: 'Connected (Simulated)',
        isConfigured: true,
        latencyMs: 142,
        models: [
            { id: 'kimi-k1.5', name: 'Kimi k1.5 (Multimodal Long-Context)', description: 'Leading 200k context window with nuanced consultative answers' },
            { id: 'moonshot-v1-8k', name: 'Moonshot v1 (8k Standard)', description: 'Optimized for quick transactional replies' },
            { id: 'moonshot-v1-32k', name: 'Moonshot v1 (32k Extended)', description: 'Deep context memory for multi-turn sales journeys' }
        ],
        selectedModel: 'kimi-k1.5',
        endpoint: 'https://api.moonshot.cn/v1/chat/completions (Sandbox)'
    }
};

export const initialSalesAgentConfig = {
    agentEnabled: true,
    automationEnabled: true,
    selectedProvider: 'chatgpt', // 'chatgpt' | 'kimi'
    agentDisplayName: 'Aria - AI Sales Specialist',
    businessName: 'WhatsApp CRM Enterprise',
    businessDescription: 'All-in-one WhatsApp Marketing, Automated Workflows, and Multi-Agent CRM suite for growing businesses.',
    responseLanguage: 'English (Global)',
    autoDetectLanguage: true,
    responseTone: 'Consultative & Solution-focused',
    messageFormat: {
        maxLength: 'detailed', // 'concise' | 'detailed'
        includeEmoji: true,
        includeDemoLink: true
    },
    businessInfo: {
        industry: 'SaaS / Marketing Automation',
        supportEmail: 'support@whatsapp-crm.demo',
        supportPhone: '+91 98765 43210',
        workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
        pricingSummary: 'Starter: ₹2,499/mo (5k msgs) • Growth: ₹5,999/mo (25k msgs) • Enterprise: ₹14,999/mo (Unlimited + Dedicated IP)'
    },
    imageRecognition: {
        enabled: false,
        simulated: true,
        statusNote: 'Image Recognition is currently running in a simulated sandbox. Real-time vision model processing requires dedicated cloud GPU quota and client confirmation.'
    },
    systemInstructions: 'Answer customer inquiries politely about pricing, WhatsApp templates, bulk campaign scheduling, and integrations. Offer a live 1-on-1 walkthrough link (https://crm.io/demo) whenever appropriate.'
};

export const initialDemoConversation = [
    {
        id: 'msg-001',
        sender: 'ai',
        senderName: 'Aria (AI Sales Agent)',
        provider: 'OpenAI ChatGPT · gpt-4o',
        text: 'Hello! 👋 Welcome to WhatsApp CRM Enterprise. I am Aria, your AI Sales Assistant. How can I help you scale your customer outreach today?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    }
];

export const initialSalesAgentActivities = [
    {
        id: 'ACT-8801',
        conversationName: 'Rahul Verma (+91 98765 43210)',
        provider: 'OpenAI ChatGPT',
        activityType: 'Simulated Reply',
        details: 'Answered inquiry regarding Enterprise tier pricing and custom WhatsApp bot setup.',
        status: 'Success',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    {
        id: 'ACT-8802',
        conversationName: 'Priya Sundaram (+91 98112 34567)',
        provider: 'OpenAI ChatGPT',
        activityType: 'Simulated Reply',
        details: 'Shared live product demonstration booking link (https://crm.io/demo).',
        status: 'Success',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
        id: 'ACT-8803',
        conversationName: 'System Diagnostic',
        provider: 'OpenAI ChatGPT',
        activityType: 'Connection Test',
        details: 'Ping latency: 128ms. OpenAI API Sandbox Healthy.',
        status: 'Success',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
        id: 'ACT-8804',
        conversationName: 'Admin Configuration',
        provider: 'Moonshot Kimi',
        activityType: 'Provider Switch',
        details: 'Admin verified Kimi k1.5 long-context bilingual model settings.',
        status: 'Simulation Sandbox',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    },
    {
        id: 'ACT-8805',
        conversationName: 'Ananya Sharma (+91 97234 56789)',
        provider: 'OpenAI ChatGPT',
        activityType: 'Simulated Reply',
        details: 'Clarified Meta Cloud API template approval guidelines and billing credits.',
        status: 'Success',
        timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString()
    },
    {
        id: 'ACT-8806',
        conversationName: 'Master Agent State',
        provider: 'OpenAI ChatGPT',
        activityType: 'Agent Toggled',
        details: 'AI Sales Agent enabled by Admin. Active and ready for demonstration.',
        status: 'Success',
        timestamp: new Date(Date.now() - 200 * 60 * 1000).toISOString()
    }
];

/**
 * Deterministic contextual reply generator for the demo sandbox
 */
export const generateSimulatedAIResponse = (userText, config, provider) => {
    const text = (userText || '').toLowerCase().trim();
    const isKimi = provider.id === 'kimi';
    const providerName = isKimi ? 'Moonshot Kimi' : 'OpenAI ChatGPT';
    const businessName = config.businessName || 'WhatsApp CRM Enterprise';

    if (text.includes('pricing') || text.includes('cost') || text.includes('plan') || text.includes('price')) {
        return `Here is our transparent pricing structure for ${businessName}:
• **Starter Plan**: ₹2,499/mo (Up to 5,000 monthly WhatsApp messages, shared inbox)
• **Growth Plan**: ₹5,999/mo (Up to 25,000 messages, automated birthday & festival campaigns)
• **Enterprise Plan**: ₹14,999/mo (Unlimited throughput, dedicated routing IP, custom API webhooks)

All plans include official Meta Cloud API integration with zero hidden server maintenance fees! Would you like a custom quote for your business volume?`;
    }

    if (text.includes('demo') || text.includes('demonstration') || text.includes('walkthrough') || text.includes('trial') || text.includes('call')) {
        return `We would be delighted to demonstrate ${businessName} live! 🎉

You can choose a convenient 20-minute 1-on-1 walkthrough slot with our solution architects here:
🔗 **https://crm.io/demo**

During the session, we will demonstrate:
1. Connecting your verified WhatsApp Business number
2. Automated appointment & payment reminder rules
3. Bulk broadcast campaign scheduling with CSV import

What date works best for you?`;
    }

    if (text.includes('service') || text.includes('feature') || text.includes('sell') || text.includes('what do you') || text.includes('product')) {
        return `${businessName} provides an enterprise-grade WhatsApp customer engagement suite:
1. **Shared Multi-Agent Inbox**: Manage unified customer conversations with green-tick verified numbers.
2. **Campaign Blast Engine**: Send bulk announcements with Excel/CSV recipient mapping and read-rate tracking.
3. **Automated Trigger Workflows**: Automatically dispatch Birthday, Festival, Appointment, and Payment Reminders.
4. **AI Sales Agent**: 24/7 automated inquiry handling powered by ${providerName}.

Which of these modules would you like to explore first?`;
    }

    if (text.includes('hour') || text.includes('time') || text.includes('support') || text.includes('contact') || text.includes('open')) {
        return `Our dedicated support desk is available:
• **Working Hours**: ${config.businessInfo?.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}
• **Support Email**: ${config.businessInfo?.supportEmail || 'support@whatsapp-crm.demo'}
• **Direct Helpline**: ${config.businessInfo?.supportPhone || '+91 98765 43210'}

Even outside working hours, our AI sales agent (${config.agentDisplayName}) remains active 24/7 to answer customer inquiries and book appointments!`;
    }

    if (text.includes('template') || text.includes('campaign') || text.includes('broadcast') || text.includes('bulk')) {
        return `With our Campaign Engine, you can broadcast approved WhatsApp Marketing & Utility templates to thousands of verified contacts in seconds!

Features include:
• Pre-built library of 12+ pre-approved WhatsApp templates
• Dynamic variable mapping (e.g. {{1}} Customer Name, {{2}} Discount)
• Live recipient delivery, read receipt ticks, and failed-message retry controls.

Would you like to try sending a test broadcast in the Campaigns module?`;
    }

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
        return `Hello there! 👋 Glad to connect with you. I am ${config.agentDisplayName}, powered by ${providerName}. 

How can ${businessName} assist your sales and customer automation goals today? Feel free to ask about our pricing plans, WhatsApp broadcast campaigns, or book a live product demo!`;
    }

    // Default intelligent consultative fallback
    return `Thank you for your message! At ${businessName}, we specialize in empowering businesses to automate customer communications, recover unpaid invoices, and drive higher campaign conversion rates over WhatsApp.

I am operating on the **${providerName} (${provider.selectedModel})** engine. Could you share a few details about your team size or monthly WhatsApp messaging volume so I can recommend the perfect configuration for you?`;
};
