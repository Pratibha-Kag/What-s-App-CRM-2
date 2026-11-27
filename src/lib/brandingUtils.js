export const DEFAULT_BRANDING = {
    companyName: 'WhatsApp CRM',
    appName: 'WhatsApp CRM',
    logoDataUrl: null,
    primaryColor: '#8B5CF6',
    accentColor: '#10B981',
}

export const ALLOWED_LOGO_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
]

export const MAX_LOGO_SIZE_BYTES = 1024 * 1024 // 1 MB for safe localStorage demo persistence

export const isValidHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(String(value || '').trim())

/**
 * Computes accessible foreground text color (#FFFFFF or #0F172A)
 * for any 6-digit hex background color using WCAG relative luminance.
 */
export const getContrastTextColor = (hexColor) => {
    if (!isValidHexColor(hexColor)) return '#FFFFFF'
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
    const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

    return luminance > 0.42 ? '#0F172A' : '#FFFFFF'
}

/**
 * Computes approximate WCAG contrast ratio against white or dark slate text.
 */
export const getContrastRatio = (hex1, hex2) => {
    const lum = (hex) => {
        if (!isValidHexColor(hex)) return 0
        const clean = hex.replace('#', '')
        const vals = [0, 2, 4].map((i) => {
            const c = parseInt(clean.substring(i, i + 2), 16) / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * vals[0] + 0.7152 * vals[1] + 0.0722 * vals[2]
    }
    const l1 = lum(hex1)
    const l2 = lum(hex2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

export const validateLogoFile = (file) => {
    if (!file) return { valid: false, error: 'No file selected.' }
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Unsupported logo format. Please upload PNG, JPG, WEBP, or SVG.',
        }
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
        return {
            valid: false,
            error: 'Logo file is too large. Maximum allowed size is 1 MB.',
        }
    }
    return { valid: true, error: null }
}

export const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
        reader.onerror = () => reject(new Error('Failed to read selected image file.'))
        reader.readAsDataURL(file)
    })

export const applyBrandingCssVars = (branding) => {
    if (typeof document === 'undefined') return
    const merged = { ...DEFAULT_BRANDING, ...(branding || {}) }
    const root = document.documentElement
    root.style.setProperty('--brand-primary', isValidHexColor(merged.primaryColor) ? merged.primaryColor : DEFAULT_BRANDING.primaryColor)
    root.style.setProperty('--brand-accent', isValidHexColor(merged.accentColor) ? merged.accentColor : DEFAULT_BRANDING.accentColor)
    root.style.setProperty('--brand-primary-fg', getContrastTextColor(merged.primaryColor))
    root.style.setProperty('--brand-accent-fg', getContrastTextColor(merged.accentColor))
}
