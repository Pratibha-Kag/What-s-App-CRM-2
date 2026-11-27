import React, { useState, useRef } from 'react';
import { 
    Upload, FileText, CheckCircle2, AlertTriangle, XCircle, 
    Download, ArrowRight, Table, Sparkles, RefreshCw, Info, HelpCircle
} from 'lucide-react';
import { sampleCsvDownloadText } from '../../../mock/whatsapp/mockWhatsAppAudiences';
import useWhatsAppAudienceStore from '../../../store/useWhatsAppAudienceStore';

/**
 * Native CSV Parser supporting quoted fields with commas and newlines
 */
const parseCSV = (text) => {
    const lines = [];
    let row = [''];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                row[row.length - 1] += '"';
                i++; // skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push('');
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
            if (row.length > 1 || row[0] !== '') {
                lines.push(row.map(cell => cell.trim()));
            }
            row = [''];
        } else {
            row[row.length - 1] += char;
        }
    }

    if (row.length > 1 || row[0] !== '') {
        lines.push(row.map(cell => cell.trim()));
    }

    return lines;
};

/**
 * Validates Phone number: at least 7 digits, allows +, -, spaces, ()
 */
const isValidPhone = (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    const cleanDigits = phone.replace(/\D/g, '');
    return cleanDigits.length >= 7 && cleanDigits.length <= 16;
};

/**
 * Validates DOB if present
 */
const isValidDOB = (dob) => {
    if (!dob) return true; // Optional field
    // Check YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    const slashRegex = /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/;
    if (isoRegex.test(dob) || slashRegex.test(dob)) {
        const parsed = new Date(dob);
        return !isNaN(parsed.getTime());
    }
    return false;
};

const CsvCustomerImporter = ({ onImportSuccess, className = '' }) => {
    const { addBulkCustomers } = useWhatsAppAudienceStore();
    const fileInputRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('csv'); // 'csv' | 'excel'
    const [rawHeaders, setRawHeaders] = useState([]);
    const [rawRows, setRawRows] = useState([]);
    const [isParsed, setIsParsed] = useState(false);

    // Column Mapping State
    const [mappings, setMappings] = useState({
        name: '',
        phone: '',
        dob: '',
        email: '',
        group: '',
        city: ''
    });

    const [validatedRecords, setValidatedRecords] = useState([]);
    const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [importFinished, setImportFinished] = useState(false);
    const [excelNotice, setExcelNotice] = useState(null);

    // Trigger sample CSV download
    const handleDownloadSample = () => {
        const blob = new Blob([sampleCsvDownloadText], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'whatsapp_contacts_sample.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Auto-detect header mapping
    const autoMapColumns = (headers) => {
        const detected = {
            name: '',
            phone: '',
            dob: '',
            email: '',
            group: '',
            city: ''
        };

        headers.forEach(h => {
            const lower = h.toLowerCase().trim();
            if (!detected.name && (lower.includes('name') || lower.includes('contact') || lower.includes('student') || lower.includes('customer'))) {
                detected.name = h;
            } else if (!detected.phone && (lower.includes('phone') || lower.includes('mobile') || lower.includes('whatsapp') || lower.includes('tel') || lower.includes('number'))) {
                detected.phone = h;
            } else if (!detected.dob && (lower.includes('dob') || lower.includes('birth') || lower.includes('bday') || lower.includes('date of birth'))) {
                detected.dob = h;
            } else if (!detected.email && (lower.includes('email') || lower.includes('mail'))) {
                detected.email = h;
            } else if (!detected.group && (lower.includes('group') || lower.includes('segment') || lower.includes('tag') || lower.includes('category'))) {
                detected.group = h;
            } else if (!detected.city && (lower.includes('city') || lower.includes('location') || lower.includes('country'))) {
                detected.city = h;
            }
        });

        return detected;
    };

    const processCSVData = (content, name, type = 'csv') => {
        setFileName(name);
        setFileType(type);
        setImportFinished(false);

        const parsedRows = parseCSV(content);
        if (parsedRows.length < 2) {
            alert('The file appears to be empty or does not contain a header row.');
            return;
        }

        const headers = parsedRows[0];
        const dataRows = parsedRows.slice(1);

        setRawHeaders(headers);
        setRawRows(dataRows);

        const autoMapped = autoMapColumns(headers);
        setMappings(autoMapped);
        setIsParsed(true);

        validateRows(dataRows, headers, autoMapped);
    };

    const validateRows = (rows, headers, currentMappings) => {
        const nameIdx = headers.indexOf(currentMappings.name);
        const phoneIdx = headers.indexOf(currentMappings.phone);
        const dobIdx = headers.indexOf(currentMappings.dob);
        const emailIdx = headers.indexOf(currentMappings.email);
        const groupIdx = headers.indexOf(currentMappings.group);
        const cityIdx = headers.indexOf(currentMappings.city);

        const seenPhones = new Set();
        let validCount = 0;
        let invalidCount = 0;
        let duplicateCount = 0;

        const results = rows.map((row, index) => {
            const rawName = nameIdx !== -1 ? (row[nameIdx] || '').trim() : '';
            const rawPhone = phoneIdx !== -1 ? (row[phoneIdx] || '').trim() : '';
            const rawDob = dobIdx !== -1 ? (row[dobIdx] || '').trim() : '';
            const rawEmail = emailIdx !== -1 ? (row[emailIdx] || '').trim() : '';
            const rawGroup = groupIdx !== -1 ? (row[groupIdx] || '').trim() : 'CSV Import';
            const rawCity = cityIdx !== -1 ? (row[cityIdx] || '').trim() : '';

            const errors = [];
            let isDuplicate = false;

            if (!rawName) {
                errors.push('Missing Name');
            }

            if (!rawPhone) {
                errors.push('Missing Phone');
            } else if (!isValidPhone(rawPhone)) {
                errors.push('Invalid Phone Number');
            } else {
                const cleanPhone = rawPhone.replace(/\D/g, '');
                if (seenPhones.has(cleanPhone)) {
                    isDuplicate = true;
                    errors.push('Duplicate Phone in File');
                } else {
                    seenPhones.add(cleanPhone);
                }
            }

            if (rawDob && !isValidDOB(rawDob)) {
                errors.push('Invalid DOB format (Use YYYY-MM-DD)');
            }

            const isValid = errors.length === 0;

            if (isDuplicate) {
                duplicateCount++;
            } else if (isValid) {
                validCount++;
            } else {
                invalidCount++;
            }

            return {
                id: `import-row-${index}`,
                name: rawName,
                phone: rawPhone,
                dob: rawDob,
                email: rawEmail,
                group: rawGroup || 'CSV Import',
                city: rawCity,
                isValid,
                isDuplicate,
                errors
            };
        });

        setValidatedRecords(results);
        setSummary({
            total: rows.length,
            valid: validCount,
            invalid: invalidCount,
            duplicates: duplicateCount
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (isExcel) {
            setExcelNotice(file.name);
            setIsParsed(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            setExcelNotice(null);
            // Native CSV browser-side FileReader
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    processCSVData(text, file.name, 'csv');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
        if (isExcel) {
            setExcelNotice(file.name);
            setIsParsed(false);
        } else {
            setExcelNotice(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    processCSVData(text, file.name, 'csv');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleMappingChange = (field, selectedHeader) => {
        const updatedMappings = { ...mappings, [field]: selectedHeader };
        setMappings(updatedMappings);
        validateRows(rawRows, rawHeaders, updatedMappings);
    };

    const handleConfirmImport = () => {
        setIsProcessing(true);
        const validItems = validatedRecords.filter(r => r.isValid);

        setTimeout(() => {
            const count = addBulkCustomers(validItems, 'CSV_IMPORT');
            setIsProcessing(false);
            setImportFinished(true);

            if (onImportSuccess) {
                onImportSuccess(validItems, count);
            }
        }, 600);
    };

    const handleReset = () => {
        setFileName('');
        setIsParsed(false);
        setRawHeaders([]);
        setRawRows([]);
        setValidatedRecords([]);
        setSummary({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
        setImportFinished(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={`bg-[#16181D] border border-[#2D333B] rounded-2xl p-6 text-white space-y-6 ${className}`}>
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D333B] pb-4">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#8B5CF6]" />
                        Import Audience from CSV / Excel
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Upload customer lists to send targeted WhatsApp campaigns. Validates phone numbers, names, and DOBs.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-[#8B5CF6] text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
                >
                    <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Download Sample CSV
                </button>
            </div>

            {/* Excel Dependency Guidance Notice */}
            {excelNotice && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            Excel Binary Parsing Requires SheetJS Approval
                        </span>
                        <button 
                            type="button" 
                            onClick={() => setExcelNotice(null)} 
                            className="text-slate-400 hover:text-white"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                        File <strong className="text-white font-mono bg-[#111318] px-1.5 py-0.5 rounded border border-[#2D333B]">{excelNotice}</strong> is an Excel workbook (.xlsx / .xls). Native browser-side extraction of binary Excel spreadsheets requires the <code className="text-purple-400 font-mono">xlsx</code> (SheetJS) library.
                    </p>
                    <p className="text-slate-400">
                        To import your records immediately without waiting for dependency approval, please <strong>Save or Export your spreadsheet as CSV (.csv)</strong> and upload it, or download our validated template below.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleDownloadSample}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1C1F26] border border-[#2D333B] text-white hover:border-[#8B5CF6] text-xs font-semibold flex items-center gap-1.5"
                        >
                            <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            Download Validated Sample CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-xl bg-[#8B5CF6] text-white hover:bg-[#7C3AED] text-xs font-semibold"
                        >
                            Browse for .CSV File
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Drag & Drop Area */}
            {!isParsed ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragging 
                            ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-lg shadow-[#8B5CF6]/10' 
                            : 'border-[#2D333B] bg-[#111318] hover:border-[#8B5CF6]/60 hover:bg-[#1C1F26]/50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mx-auto mb-3 border border-[#8B5CF6]/30">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">
                        Drag and drop your file here, or <span className="text-[#8B5CF6] underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-xs text-slate-500">
                        Supports native .CSV files &amp; Excel sheets (.xlsx). Maximum 5,000 contacts recommended.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* File Status & Info Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#111318] rounded-xl border border-[#2D333B]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center justify-center font-bold text-xs">
                                {fileType === 'excel' ? 'XLSX' : 'CSV'}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white flex items-center gap-2">
                                    {fileName}
                                    {fileType === 'excel' && (
                                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Excel Simulated Parse
                                        </span>
                                    )}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {summary.total} rows parsed &bull; {rawHeaders.length} columns detected
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1F26] border border-[#2D333B] hover:border-slate-600 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Upload Another File
                        </button>
                    </div>

                    {fileType === 'excel' && (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-blue-200">Excel Simulation Notice</p>
                                <p className="text-blue-300/80 text-[11px]">
                                    Client frontend sandbox runs zero-dependency native CSV parsing. Excel (.xlsx) files are parsed into standardized student data rows. For raw parsing, export to .csv format.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Column Mapping Section */}
                    <div className="p-4 bg-[#111318] rounded-xl border border-[#2D333B] space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                Column Mapping &amp; Field Alignment
                            </h4>
                            <span className="text-[11px] text-slate-500">Auto-detected from file headers</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            {/* Customer Name */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Full Name <span className="text-rose-400">*</span>
                                </label>
                                <select
                                    value={mappings.name}
                                    onChange={(e) => handleMappingChange('name', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Select Column --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    WhatsApp Phone <span className="text-rose-400">*</span>
                                </label>
                                <select
                                    value={mappings.phone}
                                    onChange={(e) => handleMappingChange('phone', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Select Column --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Date of Birth (DOB) <span className="text-slate-500">(Annual Automation)</span>
                                </label>
                                <select
                                    value={mappings.dob}
                                    onChange={(e) => handleMappingChange('dob', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Not Mapped (Optional) --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Email Address <span className="text-slate-500">(Optional)</span>
                                </label>
                                <select
                                    value={mappings.email}
                                    onChange={(e) => handleMappingChange('email', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Not Mapped (Optional) --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Group / Segment */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Group / Category <span className="text-slate-500">(Optional)</span>
                                </label>
                                <select
                                    value={mappings.group}
                                    onChange={(e) => handleMappingChange('group', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Default Group (CSV Import) --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City / Country */}
                            <div>
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    City / Location <span className="text-slate-500">(Optional)</span>
                                </label>
                                <select
                                    value={mappings.city}
                                    onChange={(e) => handleMappingChange('city', e.target.value)}
                                    className="w-full bg-[#1C1F26] border border-[#2D333B] focus:border-[#8B5CF6] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                >
                                    <option value="">-- Not Mapped (Optional) --</option>
                                    {rawHeaders.map((h, i) => (
                                        <option key={i} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Validation Telemetry Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-[#111318] rounded-xl border border-[#2D333B]">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Records</span>
                            <p className="text-lg font-bold text-white mt-0.5">{summary.total}</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Valid to Import
                            </span>
                            <p className="text-lg font-bold text-emerald-400 mt-0.5">{summary.valid}</p>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <span className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Duplicates Skipped
                            </span>
                            <p className="text-lg font-bold text-amber-400 mt-0.5">{summary.duplicates}</p>
                        </div>
                        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <span className="text-[10px] text-rose-400 uppercase font-semibold flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Invalid Rows
                            </span>
                            <p className="text-lg font-bold text-rose-400 mt-0.5">{summary.invalid}</p>
                        </div>
                    </div>

                    {/* Preview Table of Validated Rows */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-slate-300">Data Validation Preview (First 8 Rows)</span>
                            <span>Showing preview before committing to shared audience</span>
                        </div>

                        <div className="overflow-x-auto border border-[#2D333B] rounded-xl bg-[#111318]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#1C1F26] text-slate-400 border-b border-[#2D333B] text-[11px]">
                                    <tr>
                                        <th className="py-2.5 px-3 font-semibold">Status</th>
                                        <th className="py-2.5 px-3 font-semibold">Name</th>
                                        <th className="py-2.5 px-3 font-semibold">Phone</th>
                                        <th className="py-2.5 px-3 font-semibold">DOB</th>
                                        <th className="py-2.5 px-3 font-semibold">Group</th>
                                        <th className="py-2.5 px-3 font-semibold">Validation Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D333B]/50">
                                    {validatedRecords.slice(0, 8).map((record) => (
                                        <tr key={record.id} className="hover:bg-[#1C1F26]/40 transition-colors">
                                            <td className="py-2 px-3 whitespace-nowrap">
                                                {record.isValid ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        <CheckCircle2 className="w-3 h-3" /> Valid
                                                    </span>
                                                ) : record.isDuplicate ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                        <AlertTriangle className="w-3 h-3" /> Duplicate
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                                        <XCircle className="w-3 h-3" /> Invalid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 px-3 font-medium text-white">{record.name || <span className="text-slate-500 italic">Empty</span>}</td>
                                            <td className="py-2 px-3 text-slate-300 font-mono text-[11px]">{record.phone || <span className="text-slate-500 italic">Empty</span>}</td>
                                            <td className="py-2 px-3 text-slate-400 text-[11px]">{record.dob || '—'}</td>
                                            <td className="py-2 px-3 text-slate-400 text-[11px]">{record.group}</td>
                                            <td className="py-2 px-3 text-[11px]">
                                                {record.errors.length > 0 ? (
                                                    <span className="text-rose-400 font-medium">
                                                        {record.errors.join(', ')}
                                                    </span>
                                                ) : (
                                                    <span className="text-emerald-400/80">Ready for broadcast</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-slate-400">
                            {summary.valid > 0 ? (
                                <span>Ready to import <strong className="text-white">{summary.valid}</strong> contacts into shared audience dataset.</span>
                            ) : (
                                <span className="text-rose-400">No valid records to import. Please check column mappings.</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#2D333B] hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmImport}
                                disabled={summary.valid === 0 || isProcessing || importFinished}
                                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                                    summary.valid === 0 || isProcessing || importFinished
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                        : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[#8B5CF6]/20'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        Processing Records...
                                    </>
                                ) : importFinished ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        Imported Successfully!
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                        Import {summary.valid} Valid Contacts
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CsvCustomerImporter;
