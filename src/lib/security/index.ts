/**
 * Security Configuration and Utilities
 * Provides security headers, CSP, and authentication helpers
 */

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CSRF_TOKEN_HEADER: 'X-CSRF-Token',
}

// Content Security Policy configuration
export const getCSPConfig = () => {
    const isDev = process.env.NODE_ENV === 'development'

    const cspDirectives = {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            "'unsafe-inline'", // Allow inline scripts for Next.js
            isDev ? "'unsafe-eval'" : null, // Allow eval in development only
            'https://vercel.live',
            'https://va.vercel-scripts.com',
        ].filter(Boolean),
        'style-src': [
            "'self'",
            "'unsafe-inline'", // Allow inline styles for Tailwind
            'https://fonts.googleapis.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://*.scdn.co', // Spotify images
            'https://i.scdn.co',
            'https://dailymix-images.scdn.co',
            'https://mosaic.scdn.co',
            'https://lineup-images.scdn.co',
            'https://thisis-images.scdn.co',
            'https://seeded-session-images.scdn.co',
            'https://seed-mix-image.spotifycdn.com',
            'https://charts-images.scdn.co',
            (
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            ).replace('/api', ''), // API domain for images
        ],
        'media-src': [
            "'self'",
            'blob:',
            (
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            ).replace('/api', ''), // API domain for audio
        ],
        'connect-src': [
            "'self'",
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
            'https://va.vercel-analytics.com',
            'wss:', // WebSocket connections
        ],
        'frame-ancestors': ["'none'"], // Prevent clickjacking
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'worker-src': ["'self'", 'blob:'],
        'child-src': ["'self'"],
        'manifest-src': ["'self'"],
    }

    return Object.entries(cspDirectives)
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ')
}

// Security headers configuration
export const getSecurityHeaders = () => [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
    },
    {
        key: 'Content-Security-Policy',
        value: getCSPConfig(),
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
    },
]

/**
 * Authentication utilities
 */
export class AuthSecurity {
    /**
     * Validates password strength
     */
    static validatePassword(password: string): {
        isValid: boolean
        errors: string[]
        score: number
    } {
        const errors: string[] = []
        let score = 0

        // Length check
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long')
        } else {
            score += 1
        }

        // Character variety checks
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        } else {
            score += 1
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        } else {
            score += 1
        }

        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number')
        } else {
            score += 1
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character')
        } else {
            score += 1
        }

        // Common password checks
        const commonPasswords = [
            'password',
            '123456',
            '123456789',
            'qwerty',
            'abc123',
            'password123',
            'admin',
            'letmein',
            'welcome',
            'monkey',
        ]

        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common')
            score = Math.max(0, score - 2)
        }

        return {
            isValid: errors.length === 0 && score >= 4,
            errors,
            score: Math.min(5, score),
        }
    }

    /**
     * Generates a secure session ID
     */
    static generateSessionId(): string {
        const array = new Uint8Array(32)
        crypto.getRandomValues(array)
        return Array.from(array, (byte) =>
            byte.toString(16).padStart(2, '0')
        ).join('')
    }

    /**
     * Generates a CSRF token
     */
    static generateCSRFToken(): string {
        const array = new Uint8Array(16)
        crypto.getRandomValues(array)
        return Array.from(array, (byte) =>
            byte.toString(16).padStart(2, '0')
        ).join('')
    }

    /**
     * Validates email format
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email) && email.length <= 254
    }

    /**
     * Checks if a session is expired
     */
    static isSessionExpired(sessionTimestamp: number): boolean {
        const now = Date.now()
        return now - sessionTimestamp > SECURITY_CONFIG.SESSION_TIMEOUT
    }

    /**
     * Sanitizes user input to prevent XSS
     */
    static sanitizeInput(input: string): string {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
    }

    /**
     * Validates file uploads for security
     */
    static validateFileUpload(file: File): {
        isValid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        // File size check
        if (file.size > 10 * 1024 * 1024) {
            // 10MB
            errors.push('File size must be less than 10MB')
        }

        // File type check
        const allowedTypes = [
            'audio/mpeg',
            'audio/wav',
            'audio/flac',
            'audio/ogg',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ]

        if (!allowedTypes.includes(file.type)) {
            errors.push('File type not allowed')
        }

        // File name check
        const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/
        if (dangerousChars.test(file.name)) {
            errors.push('File name contains invalid characters')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
    private static attempts = new Map<string, number[]>()

    /**
     * Checks if an IP/user has exceeded rate limits
     */
    static isRateLimited(
        identifier: string,
        maxAttempts: number = 5,
        windowMs: number = 15 * 60 * 1000
    ): boolean {
        const now = Date.now()
        const attempts = this.attempts.get(identifier) || []

        // Remove old attempts outside the window
        const recentAttempts = attempts.filter((time) => now - time < windowMs)

        // Update attempts
        this.attempts.set(identifier, recentAttempts)

        return recentAttempts.length >= maxAttempts
    }

    /**
     * Records an attempt for an identifier
     */
    static recordAttempt(identifier: string): void {
        const now = Date.now()
        const attempts = this.attempts.get(identifier) || []
        attempts.push(now)
        this.attempts.set(identifier, attempts)
    }

    /**
     * Clears attempts for an identifier
     */
    static clearAttempts(identifier: string): void {
        this.attempts.delete(identifier)
    }

    /**
     * Cleanup old entries (should be called periodically)
     */
    static cleanup(): void {
        const now = Date.now()
        const windowMs = 15 * 60 * 1000 // 15 minutes

        for (const [identifier, attempts] of this.attempts.entries()) {
            const recentAttempts = attempts.filter(
                (time) => now - time < windowMs
            )
            if (recentAttempts.length === 0) {
                this.attempts.delete(identifier)
            } else {
                this.attempts.set(identifier, recentAttempts)
            }
        }
    }
}

/**
 * Encryption utilities for sensitive data
 */
export class Encryption {
    /**
     * Hashes a string using SHA-256
     */
    static async hash(text: string): Promise<string> {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }

    /**
     * Generates a random string for tokens/IDs
     */
    static generateRandomString(length: number = 32): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        const array = new Uint8Array(length)
        crypto.getRandomValues(array)

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length]
        }

        return result
    }
}

/**
 * Privacy and data protection utilities
 */
export class Privacy {
    /**
     * Masks sensitive data for logging
     */
    static maskSensitiveData(data: any): any {
        if (typeof data !== 'object' || data === null) {
            return data
        }

        const sensitiveFields = [
            'password',
            'token',
            'secret',
            'key',
            'authorization',
            'cookie',
        ]
        const masked = { ...data }

        for (const [key, value] of Object.entries(masked)) {
            const keyLower = key.toLowerCase()
            if (sensitiveFields.some((field) => keyLower.includes(field))) {
                masked[key] = '*'.repeat(8)
            } else if (typeof value === 'object' && value !== null) {
                masked[key] = this.maskSensitiveData(value)
            }
        }

        return masked
    }

    /**
     * Anonymizes IP addresses
     */
    static anonymizeIP(ip: string): string {
        if (ip.includes(':')) {
            // IPv6
            const parts = ip.split(':')
            return parts.slice(0, 4).join(':') + '::0'
        } else {
            // IPv4
            const parts = ip.split('.')
            return parts.slice(0, 3).join('.') + '.0'
        }
    }

    /**
     * Checks if user consent is required
     */
    static requiresConsent(location: string): boolean {
        // EU countries and other regions with strict privacy laws
        const strictPrivacyRegions = [
            'AT',
            'BE',
            'BG',
            'HR',
            'CY',
            'CZ',
            'DK',
            'EE',
            'FI',
            'FR',
            'DE',
            'GR',
            'HU',
            'IE',
            'IT',
            'LV',
            'LT',
            'LU',
            'MT',
            'NL',
            'PL',
            'PT',
            'RO',
            'SK',
            'SI',
            'ES',
            'SE',
            'GB',
            'CA',
            'AU',
        ]

        return strictPrivacyRegions.includes(location.toUpperCase())
    }
}
