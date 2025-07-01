import { z } from 'zod'
import type { ValidationRule, ValidationSchema, ValidationError } from '@/types'

/**
 * Enterprise-grade Validation System
 * Provides comprehensive validation for forms, API requests, and user input
 */

// Common validation patterns
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  SEMANTIC_VERSION: /^\d+\.\d+\.\d+$/,
} as const

// Zod schemas for common validations
export const CommonSchemas = {
  // User authentication
  loginCredentials: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),

  registerData: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(ValidationPatterns.USERNAME, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(ValidationPatterns.PASSWORD, 'Password must contain uppercase, lowercase, number, and special character'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
    newsletter: z.boolean().optional(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(ValidationPatterns.PASSWORD, 'Password must contain uppercase, lowercase, number, and special character'),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }).refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }),

  resetPassword: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),

  // Profile management
  editProfile: z.object({
    displayName: z.string()
      .min(1, 'Display name is required')
      .max(50, 'Display name must be less than 50 characters'),
    bio: z.string()
      .max(500, 'Bio must be less than 500 characters')
      .optional(),
    website: z.string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
    country: z.string().optional(),
  }),

  // Music content
  createPlaylist: z.object({
    name: z.string()
      .min(1, 'Playlist name is required')
      .max(100, 'Playlist name must be less than 100 characters'),
    description: z.string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional(),
    is_public: z.boolean(),
    collaborative: z.boolean().optional(),
  }),

  trackMetadata: z.object({
    title: z.string()
      .min(1, 'Track title is required')
      .max(200, 'Track title must be less than 200 characters'),
    artist: z.string()
      .min(1, 'Artist name is required')
      .max(100, 'Artist name must be less than 100 characters'),
    album: z.string()
      .max(100, 'Album name must be less than 100 characters')
      .optional(),
    year: z.number()
      .min(1900, 'Year must be after 1900')
      .max(new Date().getFullYear() + 1, 'Year cannot be in the future')
      .optional(),
    genre: z.string()
      .max(50, 'Genre must be less than 50 characters')
      .optional(),
    trackNumber: z.number()
      .min(1, 'Track number must be positive')
      .max(999, 'Track number must be less than 999')
      .optional(),
    discNumber: z.number()
      .min(1, 'Disc number must be positive')
      .max(99, 'Disc number must be less than 99')
      .optional(),
  }),

  // File upload
  fileUpload: z.object({
    fileName: z.string()
      .min(1, 'File name is required')
      .max(255, 'File name is too long'),
    fileSize: z.number()
      .min(1, 'File size must be greater than 0')
      .max(50 * 1024 * 1024, 'File size must be less than 50MB'),
    mimeType: z.string()
      .refine(type => [
        'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/aac',
        'image/jpeg', 'image/png', 'image/webp', 'image/gif'
      ].includes(type), 'File type not supported'),
  }),

  // Search and pagination
  searchParams: z.object({
    q: z.string()
      .min(1, 'Search query is required')
      .max(100, 'Search query is too long'),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    sort: z.enum(['relevance', 'date', 'popularity', 'alphabetical']).optional(),
    filter: z.enum(['all', 'tracks', 'artists', 'albums', 'playlists']).optional(),
  }),

  paginationParams: z.object({
    page: z.number().min(1, 'Page must be at least 1').optional(),
    pageSize: z.number()
      .min(1, 'Page size must be at least 1')
      .max(100, 'Page size cannot exceed 100')
      .optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),

  // Settings
  userPreferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'vi']),
    audioQuality: z.enum(['low', 'normal', 'high']),
    autoplay: z.boolean(),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      newMusic: z.boolean(),
      playlists: z.boolean(),
      followers: z.boolean(),
      marketing: z.boolean(),
    }),
    privacy: z.object({
      profilePublic: z.boolean(),
      playlistsPublic: z.boolean(),
      followersVisible: z.boolean(),
      listeningHistoryPublic: z.boolean(),
    }),
  }),
} as const

/**
 * Custom validation class for complex scenarios
 */
export class Validator {
  /**
   * Validate data against a Zod schema
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean
    data?: T
    errors?: ValidationError[]
  } {
    try {
      const result = schema.parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }))
        return { success: false, errors }
      }
      return {
        success: false,
        errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }]
      }
    }
  }

  /**
   * Validate multiple fields with custom rules
   */
  static validateFields<T extends Record<string, any>>(
    data: T,
    schema: ValidationSchema<T>
  ): {
    isValid: boolean
    errors: Record<keyof T, string[]>
  } {
    const errors: Record<keyof T, string[]> = {} as any
    let isValid = true

    for (const [field, rule] of Object.entries(schema) as [keyof T, ValidationRule][]) {
      const value = data[field]
      const fieldErrors: string[] = []

      // Required validation
      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(rule.message || `${String(field)} is required`)
        isValid = false
      }

      // Skip other validations if field is empty and not required
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue
      }

      // String length validations
      if (typeof value === 'string') {
        if (rule.min && value.length < rule.min) {
          fieldErrors.push(rule.message || `${String(field)} must be at least ${rule.min} characters`)
          isValid = false
        }
        if (rule.max && value.length > rule.max) {
          fieldErrors.push(rule.message || `${String(field)} must be less than ${rule.max} characters`)
          isValid = false
        }
      }

      // Number range validations
      if (typeof value === 'number') {
        if (rule.min && value < rule.min) {
          fieldErrors.push(rule.message || `${String(field)} must be at least ${rule.min}`)
          isValid = false
        }
        if (rule.max && value > rule.max) {
          fieldErrors.push(rule.message || `${String(field)} must be less than ${rule.max}`)
          isValid = false
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message || `${String(field)} format is invalid`)
        isValid = false
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value)
        if (customResult !== true) {
          fieldErrors.push(typeof customResult === 'string' ? customResult : rule.message || `${String(field)} is invalid`)
          isValid = false
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors
      }
    }

    return { isValid, errors }
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitize(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  /**
   * Validate file uploads
   */
  static validateFile(file: File): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // File size validation (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      errors.push('File size must be less than 50MB')
    }

    // File type validation
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/aac',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif'
    ]
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported')
    }

    // File name validation
    if (file.name.length > 255) {
      errors.push('File name is too long')
    }

    // Check for potentially dangerous file names
    const dangerousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
      /^(con|prn|aux|nul|com\d|lpt\d)$/i,
      /[<>:"/\\|?*\x00-\x1f]/
    ]
    
    if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('File name contains invalid characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate URLs
   */
  static validateURL(url: string): boolean {
    try {
      new URL(url)
      return ValidationPatterns.URL.test(url)
    } catch {
      return false
    }
  }

  /**
   * Validate email addresses with additional checks
   */
  static validateEmail(email: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // Basic format check
    if (!ValidationPatterns.EMAIL.test(email)) {
      errors.push('Invalid email format')
    }

    // Length check
    if (email.length > 254) {
      errors.push('Email address is too long')
    }

    // Domain validation
    const domain = email.split('@')[1]
    if (domain) {
      // Check for consecutive dots
      if (domain.includes('..')) {
        errors.push('Invalid domain format')
      }
      
      // Check domain length
      if (domain.length > 253) {
        errors.push('Domain name is too long')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    score: number
    isValid: boolean
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    // Length check
    if (password.length >= 8) score += 1
    else feedback.push('Use at least 8 characters')

    if (password.length >= 12) score += 1
    else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security')

    // Character variety
    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Add lowercase letters')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Add uppercase letters')

    if (/\d/.test(password)) score += 1
    else feedback.push('Add numbers')

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    else feedback.push('Add special characters')

    // Common password check
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    if (commonPasswords.includes(password.toLowerCase())) {
      score = Math.max(0, score - 2)
      feedback.push('Avoid common passwords')
    }

    // Repetition check
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(0, score - 1)
      feedback.push('Avoid repeating characters')
    }

    return {
      score: Math.min(6, score),
      isValid: score >= 4 && feedback.length <= 2,
      feedback
    }
  }

  /**
   * Validate credit card numbers (for premium features)
   */
  static validateCreditCard(number: string): {
    isValid: boolean
    type: string | null
  } {
    // Remove spaces and non-digits
    const cleaned = number.replace(/\D/g, '')

    // Luhn algorithm
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }

    const isValid = sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19

    // Determine card type
    let type: string | null = null
    if (isValid) {
      if (/^4/.test(cleaned)) type = 'Visa'
      else if (/^5[1-5]/.test(cleaned)) type = 'MasterCard'
      else if (/^3[47]/.test(cleaned)) type = 'American Express'
      else if (/^6(?:011|5)/.test(cleaned)) type = 'Discover'
      else type = 'Unknown'
    }

    return { isValid, type }
  }
}

/**
 * Form validation hook
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>
) {
  const [errors, setErrors] = React.useState<Record<string, string[]>>({})
  const [isValid, setIsValid] = React.useState(false)

  const validate = React.useCallback((data: unknown) => {
    const result = Validator.validate(schema, data)
    
    if (result.success) {
      setErrors({})
      setIsValid(true)
      return result.data
    } else {
      const errorMap: Record<string, string[]> = {}
      result.errors?.forEach(error => {
        if (!errorMap[error.field]) {
          errorMap[error.field] = []
        }
        errorMap[error.field].push(error.message)
      })
      setErrors(errorMap)
      setIsValid(false)
      return null
    }
  }, [schema])

  const clearErrors = React.useCallback(() => {
    setErrors({})
    setIsValid(false)
  }, [])

  const getFieldError = React.useCallback((field: string) => {
    return errors[field]?.[0] || null
  }, [errors])

  const hasFieldError = React.useCallback((field: string) => {
    return Boolean(errors[field]?.length)
  }, [errors])

  return {
    validate,
    clearErrors,
    getFieldError,
    hasFieldError,
    errors,
    isValid
  }
}

// Re-export for convenience
export { z }
export type { z as ZodType }

// Export React import fix
import React from 'react'
