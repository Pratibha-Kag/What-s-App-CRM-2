import React, { useMemo, useState, useEffect } from 'react';
import {
    Compass,
    Search,
    MapPin,
    Building2,
    Globe,
    Phone,
    Mail,
    Star,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Play,
    Square,
    RotateCcw,
    Download,
    UserPlus,
    Eye,
    Trash2,
    Layers,
    ShieldCheck,
    Clock,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Info,
    ExternalLink,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react';
import useAppStore, { getRolePath, normalizeRoleKey } from '../store/useStore';
import { mockScraperCategories } from '../mock/mockData';
import { detectDuplicateLead, exportRowsToCsv, resolveScopedCustomerId } from '../lib/crmUtils';
import { toast } from '../components/ui/Toast';
import DuplicateReviewModal from '../components/crm/DuplicateReviewModal';

const GoogleScraper = () => {
    const {
        role,
        selectedAccount,
        setSelectedAccount,
        customers,
        leads,
        contacts,
        addCrmLead,
        googleBusinessProfilesByCustomer,
        connectGoogleBusiness,
        disconnectGoogleBusiness,
        testGoogleBusinessConnection,
        extractedBusinessesByCustomer,
        addExtractedBusinesses,
        deleteExtractedBusiness,
        updateExtractedBusinessStatus,
        scraperExecutionHistoryByCustomer,
        addScraperExecution,
    } = useAppStore();

    const roleKey = normalizeRoleKey(role);
    const isSuperAdmin = roleKey === 'SUPER_ADMIN';

    // Scoped active customer resolution
    const [explicitCustomerId, setExplicitCustomerId] = useState('cust-001');
    const activeCustomerId = resolveScopedCustomerId(role, selectedAccount, explicitCustomerId);

    const activeCustomer = useMemo(() => {
        return customers.find((c) => c.id === activeCustomerId) || customers[0] || { id: 'cust-001', companyName: 'Apex Digital Solutions' };
    }, [customers, activeCustomerId]);

    // Google Business profile state for active customer
    const businessProfile = useMemo(() => {
        return (
            googleBusinessProfilesByCustomer[activeCustomerId] || {
                customerId: activeCustomerId,
                customerName: activeCustomer.companyName,
                status: 'disconnected',
                accountName: `${activeCustomer.companyName} Profile`,
                googleEmail: `admin@${String(activeCustomer.companyName || 'demo').toLowerCase().replace(/\s+/g, '')}.com`,
                placeId: 'ChIJ-DEMO-PLACE-ID-01',
                locationName: `${activeCustomer.companyName} Branch`,
                category: 'Digital Marketing & IT',
                address: 'Main Commercial Plaza, Sector 4, Mumbai, MH 400001',
                phone: '+91 98200 12345',
                website: 'https://example.com',
                rating: 4.8,
                reviewCount: 95,
                isVerified: false,
                lastSync: 'Not synced yet',
            }
        );
    }, [googleBusinessProfilesByCustomer, activeCustomerId, activeCustomer]);

    // Extracted businesses for active customer
    const extractedList = useMemo(() => {
        return extractedBusinessesByCustomer[activeCustomerId] || [];
    }, [extractedBusinessesByCustomer, activeCustomerId]);

    // Execution history for active customer
    const executionHistory = useMemo(() => {
        return scraperExecutionHistoryByCustomer[activeCustomerId] || [];
    }, [scraperExecutionHistoryByCustomer, activeCustomerId]);

    // Connection feedback message
    const [connectionFeedback, setConnectionFeedback] = useState(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    // Google Auth Modal State
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authEmail, setAuthEmail] = useState('');
    const [authProfileName, setAuthProfileName] = useState('');
    const [authLocationName, setAuthLocationName] = useState('');
    const [authCategory, setAuthCategory] = useState('Digital Marketing & IT');
    const [authSimulateMode, setAuthSimulateMode] = useState('success'); // 'success' | 'failure'
    const [isAuthorizing, setIsAuthorizing] = useState(false);

    // Scraper Search Controls State
    const [keyword, setKeyword] = useState('Dental Clinic');
    const [selectedCategory, setSelectedCategory] = useState('Healthcare & Dental Clinics');
    const [country, setCountry] = useState('India');
    const [city, setCity] = useState('Mumbai');
    const [searchRadius, setSearchRadius] = useState('15 km');

    // Scraper Execution Simulation State
    const [isScraping, setIsScraping] = useState(false);
    const [scrapeProgress, setScrapeProgress] = useState(0);
    const [scrapeStatusMessage, setScrapeStatusMessage] = useState('Idle');
    const [kpiExtractedCount, setKpiExtractedCount] = useState(0);
    const [kpiContactsCount, setKpiContactsCount] = useState(0);
    const [kpiDuplicatesCount, setKpiDuplicatesCount] = useState(0);

    // Results Table Filter & Selection State
    const [tableSearch, setTableSearch] = useState('');
    const [tableCategoryFilter, setTableCategoryFilter] = useState('All');
    const [tableRatingFilter, setTableRatingFilter] = useState('All');
    const [selectedBusinessIds, setSelectedBusinessIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 6;

    // Preview Details Modal State
    const [previewBusiness, setPreviewBusiness] = useState(null);

    // Duplicate Lead Review Modal State
    const [duplicateReviewQueue, setDuplicateReviewQueue] = useState([]);
    const [activeDuplicateItem, setActiveDuplicateItem] = useState(null);
    const [importSummaryResult, setImportSummaryResult] = useState(null);

    // Tab view: 'results' | 'history' | 'superMatrix'
    const [activeTab, setActiveTab] = useState('results');

    // Pre-fill auth modal when opened
    const handleOpenAuthModal = () => {
        setAuthEmail(businessProfile.googleEmail || `admin@${String(activeCustomer.companyName || 'demo').toLowerCase().replace(/\s+/g, '')}.com`);
        setAuthProfileName(businessProfile.accountName || `${activeCustomer.companyName} Profile`);
        setAuthLocationName(businessProfile.locationName || `${activeCustomer.companyName} Head Office`);
        setAuthCategory(businessProfile.category || 'Digital Marketing & IT');
        setAuthSimulateMode('success');
        setAuthModalOpen(true);
    };

    const handleAuthorize = () => {
        setIsAuthorizing(true);
        setTimeout(() => {
            setIsAuthorizing(false);
            if (authSimulateMode === 'failure') {
                setConnectionFeedback({
                    type: 'error',
                    message: 'Authorization failed (OAuth 401): Invalid Google Workspace credentials or permission denied.',
                });
                toast.error('Google authorization failed: Simulated token rejection.');
            } else {
                connectGoogleBusiness(activeCustomerId, {
                    accountName: authProfileName,
                    googleEmail: authEmail,
                    locationName: authLocationName,
                    category: authCategory,
                });
                setConnectionFeedback({
                    type: 'success',
                    message: `Google Business account "${authProfileName}" successfully authorized and connected!`,
                });
                toast.success('Google Business account connected successfully!');
            }
            setAuthModalOpen(false);
        }, 800);
    };

    const handleDisconnect = () => {
        disconnectGoogleBusiness(activeCustomerId);
        setConnectionFeedback({
            type: 'info',
            message: 'Google Business profile has been disconnected.',
        });
        toast.info('Google Business disconnected.');
    };

    const handleTestConnection = () => {
        setIsTestingConnection(true);
        setConnectionFeedback(null);
        setTimeout(() => {
            setIsTestingConnection(false);
            const isConnected = businessProfile.status === 'connected';
            const res = testGoogleBusinessConnection(activeCustomerId, !isConnected);
            setConnectionFeedback({
                type: res.success ? 'success' : 'error',
                message: res.message,
            });
            if (res.success) {
                toast.success('Google Business connection verified (200 OK)');
            } else {
                toast.error('Connection test failed: Account disconnected');
            }
        }, 700);
    };

    // Scraper simulation runner
    const handleStartScraping = () => {
        if (!keyword.trim()) {
            toast.error('Please enter a search keyword or business type.');
            return;
        }

        setIsScraping(true);
        setScrapeProgress(5);
        setScrapeStatusMessage(`Scanning Google Maps Places for "${keyword}" in ${city}, ${country}...`);
        setKpiExtractedCount(0);
        setKpiContactsCount(0);
        setKpiDuplicatesCount(0);

        const startTime = Date.now();

        const step1 = setTimeout(() => {
            setScrapeProgress(35);
            setScrapeStatusMessage('Locating verified business listings & reading rating metadata...');
            setKpiExtractedCount(4);
            setKpiContactsCount(3);
        }, 600);

        const step2 = setTimeout(() => {
            setScrapeProgress(70);
            setScrapeStatusMessage('Extracting verified phone numbers, websites and addresses...');
            setKpiExtractedCount(8);
            setKpiContactsCount(7);
            setKpiDuplicatesCount(1);
        }, 1200);

        const step3 = setTimeout(() => {
            setScrapeProgress(100);
            setScrapeStatusMessage('Extraction complete! Added 3 new verified business records.');
            setIsScraping(false);

            const durationSec = Math.round((Date.now() - startTime) / 1000);

            // Generate realistic dummy scraped records tailored to the search parameters
            const timestampStr = new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            const freshBusinesses = [
                {
                    id: `gmb-live-${Date.now()}-1`,
                    name: `${city} ${keyword.replace(/clinic|agency|partners|firm/gi, '').trim() || 'Premier'} Care Center`,
                    category: selectedCategory === 'All Categories' ? 'Healthcare & Dental Clinics' : selectedCategory,
                    phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
                    email: `info@${keyword.toLowerCase().replace(/[^a-z0-9]/g, '')}${city.toLowerCase()}.com`,
                    website: `https://${keyword.toLowerCase().replace(/[^a-z0-9]/g, '')}${city.toLowerCase()}.com`,
                    address: `Suite 104, Horizon Towers, Main Hub, ${city}, ${country}`,
                    city: city,
                    country: country,
                    placeId: `ChIJ${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
                    rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
                    reviewCount: Math.floor(40 + Math.random() * 160),
                    source: 'Google Business Scraper',
                    status: 'Extracted',
                    extractedAt: timestampStr,
                },
                {
                    id: `gmb-live-${Date.now()}-2`,
                    name: `Apex ${keyword} & Consultation Services`,
                    category: selectedCategory === 'All Categories' ? 'Digital Marketing & IT' : selectedCategory,
                    phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
                    email: `contact@apex${keyword.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
                    website: `https://apex${keyword.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
                    address: `45 Commercial Ring Road, Near Metro, ${city}, ${country}`,
                    city: city,
                    country: country,
                    placeId: `ChIJ${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
                    rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
                    reviewCount: Math.floor(80 + Math.random() * 200),
                    source: 'Google Business Scraper',
                    status: 'Extracted',
                    extractedAt: timestampStr,
                },
            ];

            addExtractedBusinesses(activeCustomerId, freshBusinesses);

            // Log execution history
            addScraperExecution(activeCustomerId, {
                keyword,
                category: selectedCategory,
                location: `${city}, ${country}`,
                status: 'Completed',
                totalFound: 12,
                successful: 12,
                failed: 0,
                startedAt: timestampStr,
                duration: `${Math.max(1, durationSec)}s`,
            });

            toast.success(`Scraper finished: Extracted new business listings for "${keyword}".`);
        }, 1800);

        return () => {
            clearTimeout(step1);
            clearTimeout(step2);
            clearTimeout(step3);
        };
    };

    const handleStopScraping = () => {
        setIsScraping(false);
        setScrapeStatusMessage('Extraction cancelled by user.');
        toast.info('Scraper extraction stopped.');
    };

    const handleResetFilters = () => {
        setKeyword('Dental Clinic');
        setSelectedCategory('Healthcare & Dental Clinics');
        setCountry('India');
        setCity('Mumbai');
        setSearchRadius('15 km');
        setScrapeProgress(0);
        setScrapeStatusMessage('Idle');
        toast.info('Search parameters reset to default.');
    };

    // Filtered businesses in results table
    const filteredBusinesses = useMemo(() => {
        return extractedList.filter((b) => {
            const q = tableSearch.trim().toLowerCase();
            const matchesSearch =
                !q ||
                b.name.toLowerCase().includes(q) ||
                b.category.toLowerCase().includes(q) ||
                b.city.toLowerCase().includes(q) ||
                b.phone.toLowerCase().includes(q) ||
                (b.email && b.email.toLowerCase().includes(q));

            const matchesCategory =
                tableCategoryFilter === 'All' || b.category === tableCategoryFilter;

            const matchesRating =
                tableRatingFilter === 'All' ||
                (tableRatingFilter === '4.5+' && b.rating >= 4.5) ||
                (tableRatingFilter === '4.0+' && b.rating >= 4.0);

            return matchesSearch && matchesCategory && matchesRating;
        });
    }, [extractedList, tableSearch, tableCategoryFilter, tableRatingFilter]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / PAGE_SIZE));
    const paginatedBusinesses = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredBusinesses.slice(start, start + PAGE_SIZE);
    }, [filteredBusinesses, currentPage]);

    // Selection handlers
    const isAllSelected =
        paginatedBusinesses.length > 0 &&
        paginatedBusinesses.every((b) => selectedBusinessIds.has(b.id));

    const handleToggleSelectAll = () => {
        const next = new Set(selectedBusinessIds);
        if (isAllSelected) {
            paginatedBusinesses.forEach((b) => next.delete(b.id));
        } else {
            paginatedBusinesses.forEach((b) => next.add(b.id));
        }
        setSelectedBusinessIds(next);
    };

    const handleToggleSelectOne = (id) => {
        const next = new Set(selectedBusinessIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedBusinessIds(next);
    };

    // Export selected or all visible to CSV
    const handleExportCsv = () => {
        const targets =
            selectedBusinessIds.size > 0
                ? extractedList.filter((b) => selectedBusinessIds.has(b.id))
                : filteredBusinesses;

        if (targets.length === 0) {
            toast.error('No business records available to export.');
            return;
        }

        const headers = [
            'ID',
            'Business Name',
            'Category',
            'Phone',
            'Email',
            'Website',
            'Address',
            'City',
            'Country',
            'Rating',
            'Review Count',
            'Source',
            'Status',
            'Extracted At',
        ];

        const rows = targets.map((b) => [
            b.id,
            b.name,
            b.category,
            b.phone || '',
            b.email || '',
            b.website || '',
            b.address || '',
            b.city || '',
            b.country || '',
            b.rating,
            b.reviewCount,
            b.source,
            b.status,
            b.extractedAt,
        ]);

        const filename = `Google-Business-Export-${activeCustomerId}-${new Date().toISOString().slice(0, 10)}.csv`;
        exportRowsToCsv(headers, rows, filename);
        toast.success(`Exported ${targets.length} business records to CSV.`);
    };

    // CRM Lead Import & Duplicate Check Flow
    const handleStartImportToCrm = () => {
        const targets = extractedList.filter((b) => selectedBusinessIds.has(b.id));

        if (targets.length === 0) {
            toast.error('Please select at least one business record to import.');
            return;
        }

        const queue = [];
        const cleanToImport = [];

        targets.forEach((biz) => {
            const dup = detectDuplicateLead(
                { email: biz.email, phone: biz.phone },
                leads,
                contacts
            );
            if (dup) {
                queue.push({ business: biz, duplicate: dup });
            } else {
                cleanToImport.push(biz);
            }
        });

        // Directly import clean leads
        let directSuccessCount = 0;
        cleanToImport.forEach((biz) => {
            const res = addCrmLead(
                {
                    customerId: activeCustomerId,
                    companyName: activeCustomer.companyName,
                    name: biz.name,
                    phone: biz.phone,
                    email: biz.email,
                    country: biz.country || 'Global',
                    qualification: biz.category,
                    source: 'Google Business',
                    stage: 'New',
                },
                { forceCreate: true }
            );
            if (res.ok) directSuccessCount++;
        });

        if (cleanToImport.length > 0) {
            updateExtractedBusinessStatus(
                activeCustomerId,
                cleanToImport.map((b) => b.id),
                'Imported'
            );
        }

        if (queue.length > 0) {
            setDuplicateReviewQueue(queue);
            setActiveDuplicateItem(queue[0]);
            toast.warning(`Found ${queue.length} potential duplicate lead(s). Review required.`);
        } else {
            setSelectedBusinessIds(new Set());
            setImportSummaryResult({
                total: targets.length,
                imported: directSuccessCount,
                duplicates: 0,
            });
            toast.success(`Successfully imported ${directSuccessCount} new lead(s) into CRM Leads!`);
        }
    };

    // Duplicate Modal Actions
    const handleResolveDuplicate = (action) => {
        if (!activeDuplicateItem) return;
        const biz = activeDuplicateItem.business;

        if (action === 'merge' || action === 'createAnyway') {
            addCrmLead(
                {
                    customerId: activeCustomerId,
                    companyName: activeCustomer.companyName,
                    name: biz.name,
                    phone: biz.phone,
                    email: biz.email,
                    country: biz.country || 'Global',
                    qualification: biz.category,
                    source: 'Google Business',
                    stage: action === 'merge' ? 'Qualified' : 'New',
                },
                { forceCreate: true }
            );
            updateExtractedBusinessStatus(activeCustomerId, [biz.id], 'Imported');
            toast.success(
                action === 'merge'
                    ? `Merged "${biz.name}" with existing record.`
                    : `Created "${biz.name}" as new lead.`
            );
        } else {
            toast.info(`Skipped duplicate lead "${biz.name}".`);
        }

        // Advance queue
        const remaining = duplicateReviewQueue.slice(1);
        setDuplicateReviewQueue(remaining);
        if (remaining.length > 0) {
            setActiveDuplicateItem(remaining[0]);
        } else {
            setActiveDuplicateItem(null);
            setSelectedBusinessIds(new Set());
            toast.success('All duplicate reviews resolved and leads updated!');
        }
    };

    const handleDeleteSelected = () => {
        if (selectedBusinessIds.size === 0) return;
        selectedBusinessIds.forEach((id) => deleteExtractedBusiness(activeCustomerId, id));
        setSelectedBusinessIds(new Set());
        toast.info('Deleted selected business records.');
    };

    return (
        <div className="space-y-6 text-white pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B] pb-5">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span>Integrations</span>
                        <span>/</span>
                        <span className="text-blue-400 font-medium">Google Business & Scraper</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                Google Business & Scraper
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    D2-05
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400">
                                Connect Google Business profile, scrape verified local business contacts, and import directly into CRM Leads.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer Selector for Super Admin or Scoped Account Info */}
                <div className="flex items-center gap-3 flex-wrap">
                    {isSuperAdmin ? (
                        <div className="flex items-center gap-2 bg-[#1C1F26] border border-[#2D333B] px-3 py-1.5 rounded-xl text-xs">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400">Customer Workspace:</span>
                            <select
                                value={activeCustomerId}
                                onChange={(e) => {
                                    setExplicitCustomerId(e.target.value);
                                    setSelectedBusinessIds(new Set());
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                            >
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.companyName} ({c.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-[#1C1F26] border border-[#2D333B] px-3 py-1.5 rounded-xl text-xs">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400">Account:</span>
                            <span className="font-semibold text-white">{activeCustomer.companyName}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Interactive Demo Simulation</span>
                    </div>
                </div>
            </div>

            {/* Dependency Notice banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-blue-200">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-semibold text-blue-300">Client Integration Notice:</span>{' '}
                    This module is operating in simulated UI demonstration mode using realistic mock data, React state, and local persistence.
                    External Google OAuth credentials and the client-provided scraper worker repository remain subject to client verification.
                </div>
            </div>

            {/* SECTION 1: Google Business Connection Card */}
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D333B]/60 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 font-bold text-sm shadow">
                            G
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg font-bold text-white">
                                    Google Business Profile Connection
                                </h2>
                                {businessProfile.status === 'connected' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Connected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Disconnected
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">
                                Link official Google Business account to read profile verification, reviews, and sync local business search tokens.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {businessProfile.status === 'connected' ? (
                            <>
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTestingConnection}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-white transition disabled:opacity-50"
                                >
                                    {isTestingConnection ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                                    ) : (
                                        <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                                    )}
                                    <span>Test Connection</span>
                                </button>
                                <button
                                    onClick={handleDisconnect}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition"
                                >
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Disconnect</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleOpenAuthModal}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition"
                            >
                                <ShieldCheck className="w-4 h-4 text-white" />
                                <span>Connect Google Business</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Connection Feedback Message */}
                {connectionFeedback && (
                    <div
                        className={`mb-4 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border ${
                            connectionFeedback.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : connectionFeedback.type === 'error'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {connectionFeedback.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span>{connectionFeedback.message}</span>
                        </div>
                        <button
                            onClick={() => setConnectionFeedback(null)}
                            className="text-gray-400 hover:text-white"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Profile Details Grid */}
                {businessProfile.status === 'connected' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                            <span className="text-gray-400 block mb-1">Account & Email</span>
                            <p className="font-semibold text-white truncate">{businessProfile.accountName}</p>
                            <span className="text-gray-400 truncate block text-[11px]">{businessProfile.googleEmail}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                            <span className="text-gray-400 block mb-1">Place ID & Category</span>
                            <p className="font-mono text-gray-300 text-[11px] truncate">{businessProfile.placeId}</p>
                            <span className="text-blue-400 font-medium block text-[11px]">{businessProfile.category}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                            <span className="text-gray-400 block mb-1">Rating & Verification</span>
                            <div className="flex items-center gap-2 font-semibold text-white">
                                <span className="flex items-center text-amber-400 gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {businessProfile.rating}
                                </span>
                                <span className="text-gray-400 text-[11px]">({businessProfile.reviewCount} reviews)</span>
                            </div>
                            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Google Verified Profile
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                            <span className="text-gray-400 block mb-1">Location & Last Sync</span>
                            <p className="text-gray-300 truncate">{businessProfile.locationName}</p>
                            <span className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-gray-500" />
                                {businessProfile.lastSync}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-[#111318] border border-dashed border-[#2D333B] text-center text-xs text-gray-400">
                        Google Business profile is currently disconnected for this customer. Click{' '}
                        <button
                            onClick={handleOpenAuthModal}
                            className="text-blue-400 font-semibold underline hover:text-blue-300"
                        >
                            Connect Google Business
                        </button>{' '}
                        to launch the simulated authorization modal.
                    </div>
                )}
            </div>

            {/* SECTION 2: Business Scraper Control Interface */}
            <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2D333B]/60 pb-3">
                    <div className="flex items-center gap-2.5">
                        <Search className="w-5 h-5 text-blue-400" />
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                Google Business Scraper & Search Controls
                            </h2>
                            <p className="text-xs text-gray-400">
                                Configure target search parameters to extract local businesses from Google Maps.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">Status:</span>
                        <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold ${
                                isScraping
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse'
                                    : 'bg-gray-500/15 text-gray-300 border border-gray-500/30'
                            }`}
                        >
                            {isScraping ? 'Extraction Running...' : 'Ready'}
                        </span>
                    </div>
                </div>

                {/* Filter Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Keyword Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Search Keyword / Business
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g. Dental Clinic"
                                className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Business Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                            {mockScraperCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Country Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Country</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="e.g. India"
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* City / Region Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">City / Region</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Mumbai"
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Search Radius */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Radius / Location</label>
                        <select
                            value={searchRadius}
                            onChange={(e) => setSearchRadius(e.target.value)}
                            className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="5 km">5 km radius</option>
                            <option value="15 km">15 km radius</option>
                            <option value="30 km">30 km radius</option>
                            <option value="City-wide">City-wide</option>
                        </select>
                    </div>
                </div>

                {/* Control Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleStartScraping}
                            disabled={isScraping}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition disabled:opacity-50"
                        >
                            {isScraping ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <Play className="w-4 h-4 fill-white text-white" />
                            )}
                            <span>Start Extraction</span>
                        </button>

                        <button
                            onClick={handleStopScraping}
                            disabled={!isScraping}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition disabled:opacity-40"
                        >
                            <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                            <span>Stop</span>
                        </button>

                        <button
                            onClick={handleResetFilters}
                            disabled={isScraping}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 transition disabled:opacity-40"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* Live KPIs */}
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="bg-[#111318] border border-[#2D333B] px-3 py-1.5 rounded-xl text-gray-300">
                            Total Records: <strong className="text-white">{extractedList.length}</strong>
                        </span>
                        <span className="bg-[#111318] border border-[#2D333B] px-3 py-1.5 rounded-xl text-emerald-400">
                            Valid Contacts: <strong>{extractedList.filter((b) => b.phone).length}</strong>
                        </span>
                        <span className="bg-[#111318] border border-[#2D333B] px-3 py-1.5 rounded-xl text-blue-400">
                            Imported to CRM:{' '}
                            <strong>{extractedList.filter((b) => b.status === 'Imported').length}</strong>
                        </span>
                    </div>
                </div>

                {/* Animated Progress Bar */}
                {isScraping && (
                    <div className="space-y-1.5 pt-2 border-t border-[#2D333B]/60">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-300 flex items-center gap-1.5">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                                {scrapeStatusMessage}
                            </span>
                            <span className="font-mono font-bold text-white">{scrapeProgress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#111318] overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${scrapeProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 3: Tab Selector (Extracted Results vs. Execution History vs. Super Admin Matrix) */}
            <div className="flex items-center justify-between border-b border-[#2D333B] pb-3 gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'results'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                        }`}
                    >
                        Extracted Businesses ({filteredBusinesses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'history'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                        }`}
                    >
                        Scraper Execution History ({executionHistory.length})
                    </button>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setActiveTab('superMatrix')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                activeTab === 'superMatrix'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-[#1C1F26] text-gray-400 hover:text-white border border-[#2D333B]'
                            }`}
                        >
                            Customer Scraper Matrix ({customers.length})
                        </button>
                    )}
                </div>

                {/* Import Summary Banner */}
                {importSummaryResult && (
                    <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                            Import complete: {importSummaryResult.imported} imported,{' '}
                            {importSummaryResult.duplicates} duplicates handled.
                        </span>
                        <button
                            onClick={() => setImportSummaryResult(null)}
                            className="text-gray-400 hover:text-white ml-1"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>

            {/* TAB 1: Extracted Businesses Table & Actions */}
            {activeTab === 'results' && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                    {/* Toolbar with Search, Category Filter, Rating Filter, and Bulk Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                            {/* Search */}
                            <div className="relative min-w-[200px] flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={tableSearch}
                                    onChange={(e) => {
                                        setTableSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by name, category, phone, city..."
                                    className="w-full bg-[#111318] border border-[#2D333B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={tableCategoryFilter}
                                onChange={(e) => {
                                    setTableCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="All">All Categories</option>
                                {mockScraperCategories.filter((c) => c !== 'All Categories').map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            {/* Rating Filter */}
                            <select
                                value={tableRatingFilter}
                                onChange={(e) => {
                                    setTableRatingFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="All">All Ratings</option>
                                <option value="4.5+">4.5+ Stars</option>
                                <option value="4.0+">4.0+ Stars</option>
                            </select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedBusinessIds.size > 0 && (
                                <span className="text-xs text-blue-400 font-semibold px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    {selectedBusinessIds.size} Selected
                                </span>
                            )}

                            <button
                                onClick={handleStartImportToCrm}
                                disabled={selectedBusinessIds.size === 0}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition disabled:opacity-40"
                            >
                                <UserPlus className="w-3.5 h-3.5 text-white" />
                                <span>Import Selected to CRM Leads</span>
                            </button>

                            <button
                                onClick={handleExportCsv}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-white transition"
                            >
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Export CSV</span>
                            </button>

                            {selectedBusinessIds.size > 0 && (
                                <button
                                    onClick={handleDeleteSelected}
                                    className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition"
                                    title="Delete selected"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Extracted Businesses Table */}
                    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-gray-400 border-b border-[#2D333B] uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="p-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleToggleSelectAll}
                                            className="rounded border-[#2D333B] text-blue-600 focus:ring-0 bg-[#1C1F26]"
                                        />
                                    </th>
                                    <th className="p-3 font-semibold">Business Name & Category</th>
                                    <th className="p-3 font-semibold">Contact Details</th>
                                    <th className="p-3 font-semibold">Location & Website</th>
                                    <th className="p-3 font-semibold">Rating</th>
                                    <th className="p-3 font-semibold">Status</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/60 text-gray-300">
                                {paginatedBusinesses.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-400">
                                            No business records match your current filters. Click "Start Extraction" above to scrape new businesses.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedBusinesses.map((biz) => {
                                        const isSelected = selectedBusinessIds.has(biz.id);
                                        return (
                                            <tr
                                                key={biz.id}
                                                className={`hover:bg-[#252933] transition ${
                                                    isSelected ? 'bg-blue-500/5' : ''
                                                }`}
                                            >
                                                <td className="p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleToggleSelectOne(biz.id)}
                                                        className="rounded border-[#2D333B] text-blue-600 focus:ring-0 bg-[#111318]"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-semibold text-white flex items-center gap-1.5">
                                                        <span>{biz.name}</span>
                                                    </div>
                                                    <span className="text-[11px] text-gray-400 block mt-0.5">
                                                        {biz.category}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1.5 text-gray-300">
                                                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                                                        <span>{biz.phone || 'No phone'}</span>
                                                    </div>
                                                    {biz.email && (
                                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px]">
                                                            <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                                                            <span className="truncate">{biz.email}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 max-w-[220px]">
                                                    <div className="flex items-start gap-1 text-gray-300 truncate">
                                                        <MapPin className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                                                        <span className="truncate">{biz.address}</span>
                                                    </div>
                                                    {biz.website && (
                                                        <a
                                                            href={biz.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline mt-0.5"
                                                        >
                                                            <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                                                            <span className="truncate">{biz.website.replace('https://', '')}</span>
                                                            <ExternalLink className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1 font-semibold text-amber-400">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                        <span>{biz.rating}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">
                                                        ({biz.reviewCount} reviews)
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {biz.status === 'Imported' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                            <Check className="w-2.5 h-2.5" />
                                                            Imported to CRM
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                            Extracted
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => setPreviewBusiness(biz)}
                                                            className="p-1.5 rounded-lg bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 hover:text-white transition"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteExtractedBusiness(activeCustomerId, biz.id)}
                                                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 pt-2">
                        <span>
                            Showing {filteredBusinesses.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{' '}
                            {Math.min(currentPage * PAGE_SIZE, filteredBusinesses.length)} of {filteredBusinesses.length} records
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg bg-[#2D333B] hover:bg-[#383F4A] text-white disabled:opacity-40 transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg bg-[#2D333B] hover:bg-[#383F4A] text-white disabled:opacity-40 transition"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Scraper Execution History */}
            {activeTab === 'history' && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white">Scraper Execution History</h3>
                            <p className="text-xs text-gray-400">
                                Audit log of past extraction runs for {activeCustomer.companyName}.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-gray-400 border-b border-[#2D333B] uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="p-3 font-semibold">Run ID</th>
                                    <th className="p-3 font-semibold">Keyword & Category</th>
                                    <th className="p-3 font-semibold">Target Location</th>
                                    <th className="p-3 font-semibold">Found / Success</th>
                                    <th className="p-3 font-semibold">Duration</th>
                                    <th className="p-3 font-semibold">Started At</th>
                                    <th className="p-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/60 text-gray-300">
                                {executionHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-400">
                                            No execution history found. Run your first scrape above.
                                        </td>
                                    </tr>
                                ) : (
                                    executionHistory.map((run) => (
                                        <tr key={run.id} className="hover:bg-[#252933] transition">
                                            <td className="p-3 font-mono font-medium text-blue-400">{run.id}</td>
                                            <td className="p-3">
                                                <div className="font-semibold text-white">{run.keyword}</div>
                                                <span className="text-[11px] text-gray-400">{run.category}</span>
                                            </td>
                                            <td className="p-3">{run.location}</td>
                                            <td className="p-3">
                                                <span className="text-emerald-400 font-semibold">{run.successful}</span>
                                                <span className="text-gray-400"> / {run.totalFound}</span>
                                            </td>
                                            <td className="p-3 text-gray-300">{run.duration}</td>
                                            <td className="p-3 text-gray-400">{run.startedAt}</td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                    {run.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: Super Admin Scraper Matrix (Visible only to Super Admin) */}
            {activeTab === 'superMatrix' && isSuperAdmin && (
                <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white">Super Admin Customer Scraper Matrix</h3>
                            <p className="text-xs text-gray-400">
                                Overview of Google Business connections and scraper metrics across all customer tenants.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#111318] text-gray-400 border-b border-[#2D333B] uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="p-3 font-semibold">Customer Account</th>
                                    <th className="p-3 font-semibold">Google Business Status</th>
                                    <th className="p-3 font-semibold">Total Extracted</th>
                                    <th className="p-3 font-semibold">Imported to CRM</th>
                                    <th className="p-3 font-semibold">Last Execution</th>
                                    <th className="p-3 font-semibold text-right">Switch Customer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D333B]/60 text-gray-300">
                                {customers.map((c) => {
                                    const prof = googleBusinessProfilesByCustomer[c.id];
                                    const businesses = extractedBusinessesByCustomer[c.id] || [];
                                    const hist = scraperExecutionHistoryByCustomer[c.id] || [];
                                    const isCurrent = c.id === activeCustomerId;

                                    return (
                                        <tr
                                            key={c.id}
                                            className={`hover:bg-[#252933] transition ${
                                                isCurrent ? 'bg-blue-500/5' : ''
                                            }`}
                                        >
                                            <td className="p-3">
                                                <div className="font-semibold text-white">{c.companyName}</div>
                                                <span className="text-[11px] text-gray-400 font-mono">{c.id}</span>
                                            </td>
                                            <td className="p-3">
                                                {prof?.status === 'connected' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        Connected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30">
                                                        Disconnected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 font-semibold text-white">{businesses.length}</td>
                                            <td className="p-3 text-emerald-400 font-semibold">
                                                {businesses.filter((b) => b.status === 'Imported').length}
                                            </td>
                                            <td className="p-3 text-gray-400">
                                                {hist[0]?.startedAt || 'No runs yet'}
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => {
                                                        setExplicitCustomerId(c.id);
                                                        setActiveTab('results');
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                                        isCurrent
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-[#2D333B] hover:bg-[#383F4A] text-gray-300'
                                                    }`}
                                                >
                                                    {isCurrent ? 'Active' : 'Manage'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL 1: Simulated Google OAuth Authorization Modal */}
            {authModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Google Business Authorization Modal"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
                        {/* Header */}
                        <div className="p-5 border-b border-[#2D333B] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 font-bold text-sm">
                                    G
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-white">
                                        Google Business OAuth Simulation
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Authorize access to Google Business Profile API & Maps Places tokens
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAuthModalOpen(false)}
                                className="text-gray-400 hover:text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 text-xs">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-blue-300">
                                <strong>Simulated Consent Screen:</strong> Grants read-only access to verify business details and fetch local place ratings for <em>{activeCustomer.companyName}</em>.
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-gray-400 font-medium mb-1">
                                        Google Account Email
                                    </label>
                                    <input
                                        type="email"
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 font-medium mb-1">
                                        Business Profile Name
                                    </label>
                                    <input
                                        type="text"
                                        value={authProfileName}
                                        onChange={(e) => setAuthProfileName(e.target.value)}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 font-medium mb-1">
                                        Location / Branch Name
                                    </label>
                                    <input
                                        type="text"
                                        value={authLocationName}
                                        onChange={(e) => setAuthLocationName(e.target.value)}
                                        className="w-full bg-[#111318] border border-[#2D333B] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Simulation Outcome Selector */}
                                <div className="pt-2">
                                    <label className="block text-gray-400 font-medium mb-1">
                                        Simulated Authorization Outcome
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setAuthSimulateMode('success')}
                                            className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                                                authSimulateMode === 'success'
                                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                                    : 'bg-[#111318] border-[#2D333B] text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Simulate Success
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAuthSimulateMode('failure')}
                                            className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                                                authSimulateMode === 'failure'
                                                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                                                    : 'bg-[#111318] border-[#2D333B] text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Simulate Failure
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-[#2D333B] flex items-center justify-end gap-2 bg-[#111318]">
                            <button
                                onClick={() => setAuthModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAuthorize}
                                disabled={isAuthorizing}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition disabled:opacity-50"
                            >
                                {isAuthorizing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                ) : (
                                    <Check className="w-3.5 h-3.5 text-white" />
                                )}
                                <span>Authorize Demo Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: Business Details Preview Modal */}
            {previewBusiness && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Business Details Preview"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <div className="bg-[#1C1F26] border border-[#2D333B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
                        <div className="p-5 border-b border-[#2D333B] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h3 className="font-bold text-base text-white">{previewBusiness.name}</h3>
                                    <span className="text-xs text-blue-400">{previewBusiness.category}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewBusiness(null)}
                                className="text-gray-400 hover:text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-5 space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <span className="text-gray-400 block mb-1">Google Rating</span>
                                    <div className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                        <span>{previewBusiness.rating} / 5.0</span>
                                    </div>
                                    <span className="text-gray-400 text-[11px]">
                                        Based on {previewBusiness.reviewCount} reviews
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B]">
                                    <span className="text-gray-400 block mb-1">Extraction Status</span>
                                    <span
                                        className={`inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                                            previewBusiness.status === 'Imported'
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                        }`}
                                    >
                                        {previewBusiness.status}
                                    </span>
                                    <span className="text-gray-500 text-[10px] block mt-1">
                                        {previewBusiness.extractedAt}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#111318] border border-[#2D333B] space-y-2">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Phone Contact:</span>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{previewBusiness.phone || 'Not available'}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-400 block mb-0.5">Email Contact:</span>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                                        <span>{previewBusiness.email || 'Not available'}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-400 block mb-0.5">Physical Address:</span>
                                    <div className="flex items-start gap-2 text-gray-300">
                                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                        <span>{previewBusiness.address}</span>
                                    </div>
                                </div>

                                {previewBusiness.website && (
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Official Website:</span>
                                        <a
                                            href={previewBusiness.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 text-blue-400 hover:underline"
                                        >
                                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{previewBusiness.website}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400 block mb-0.5">Google Place ID:</span>
                                    <code className="text-[11px] text-gray-300 font-mono bg-black/40 px-2 py-0.5 rounded">
                                        {previewBusiness.placeId}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#2D333B] flex items-center justify-end gap-2 bg-[#111318]">
                            <button
                                onClick={() => setPreviewBusiness(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D333B] hover:bg-[#383F4A] text-white transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: Duplicate Lead Review Modal (Reusing DuplicateReviewModal) */}
            {activeDuplicateItem && (
                <DuplicateReviewModal
                    isOpen={true}
                    duplicateMatch={activeDuplicateItem.duplicate}
                    incomingLead={{
                        name: activeDuplicateItem.business.name,
                        email: activeDuplicateItem.business.email,
                        phone: activeDuplicateItem.business.phone,
                        companyName: activeCustomer.companyName,
                        source: 'Google Business',
                    }}
                    onMerge={() => handleResolveDuplicate('merge')}
                    onSkip={() => handleResolveDuplicate('skip')}
                    onCreateAnyway={() => handleResolveDuplicate('createAnyway')}
                    onClose={() => handleResolveDuplicate('skip')}
                />
            )}
        </div>
    );
};

export default GoogleScraper;
