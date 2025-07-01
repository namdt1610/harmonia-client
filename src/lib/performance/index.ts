import { useEffect } from 'react'
import { logger } from '@/lib/utils/logger'

/**
 * Performance Optimization Utilities
 * Provides tools for monitoring, optimizing, and improving app performance
 */

// Performance monitoring
export class PerformanceMonitor {
  private static marks = new Map<string, number>()
  private static measures = new Map<string, number>()

  /**
   * Start timing a performance mark
   */
  static mark(name: string): void {
    this.marks.set(name, performance.now())
    
    if (typeof performance.mark === 'function') {
      performance.mark(`${name}-start`)
    }
  }

  /**
   * End timing and measure performance
   */
  static measure(name: string): number {
    const startTime = this.marks.get(name)
    if (!startTime) {
      logger.warn(`Performance mark "${name}" not found`)
      return 0
    }

    const duration = performance.now() - startTime
    this.measures.set(name, duration)
    this.marks.delete(name)

    if (typeof performance.mark === 'function' && typeof performance.measure === 'function') {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }

    logger.debug(`Performance: ${name} took ${duration.toFixed(2)}ms`)
    return duration
  }

  /**
   * Get all measurements
   */
  static getMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures)
  }

  /**
   * Clear all measurements
   */
  static clear(): void {
    this.marks.clear()
    this.measures.clear()
    
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks()
    }
    if (typeof performance.clearMeasures === 'function') {
      performance.clearMeasures()
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  static monitorWebVitals(): void {
    if (typeof window === 'undefined') return

    // Monitor First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              logger.info(`FCP: ${entry.startTime.toFixed(2)}ms`)
            }
          }
        })
        observer.observe({ entryTypes: ['paint'] })
      } catch (error) {
        logger.warn('Failed to observe paint metrics', { error })
      }

      // Monitor Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          logger.info(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        logger.warn('Failed to observe LCP metrics', { error })
      }

      // Monitor Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          logger.info(`CLS: ${clsValue.toFixed(4)}`)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        logger.warn('Failed to observe CLS metrics', { error })
      }
    }
  }

  /**
   * Monitor resource loading performance
   */
  static monitorResources(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming
          if (resource.duration > 1000) { // Log slow resources (>1s)
            logger.warn(`Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`)
          }
        }
      })
      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      logger.warn('Failed to observe resource metrics', { error })
    }
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  /**
   * Lazy loading with Intersection Observer
   */
  static createLazyLoader(): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null
    }

    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            img.classList.remove('lazy')
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })
  }

  /**
   * Preload critical images
   */
  static preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      
      if (priority === 'high') {
        img.fetchPriority = 'high'
      }
      
      img.src = src
    })
  }

  /**
   * Generate responsive image sizes
   */
  static generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
      .join(', ')
  }

  /**
   * Optimize image format based on browser support
   */
  static getOptimalFormat(): 'webp' | 'avif' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg'

    // Check for AVIF support
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx && canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif'
    }

    // Check for WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp'
    }

    return 'jpeg'
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  /**
   * Cache data with TTL
   */
  static set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  /**
   * Get cached data
   */
  static get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Clear expired cache entries
   */
  static cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  static size(): number {
    return this.cache.size
  }

  /**
   * Monitor memory usage
   */
  static getMemoryInfo(): any {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return null
    }

    const memory = (performance as any).memory
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%'
    }
  }
}

/**
 * Bundle optimization utilities
 */
export class BundleOptimizer {
  /**
   * Dynamic import with error handling
   */
  static async importComponent<T>(
    importFn: () => Promise<{ default: T }>,
    fallback?: T
  ): Promise<T> {
    try {
      const module = await importFn()
      return module.default
    } catch (error) {
      logger.error('Failed to load component', { error })
      if (fallback) {
        return fallback
      }
      throw error
    }
  }

  /**
   * Preload a module
   */
  static preload(importFn: () => Promise<any>): void {
    if (typeof window === 'undefined') return

    // Use requestIdleCallback if available, otherwise use setTimeout
    const schedulePreload = () => {
      importFn().catch((error) => {
        logger.warn('Failed to preload module', { error })
      })
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(schedulePreload, { timeout: 2000 })
    } else {
      setTimeout(schedulePreload, 1000)
    }
  }

  /**
   * Check if feature should be loaded based on connection
   */
  static shouldLoadFeature(): boolean {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return true // Default to loading if we can't detect connection
    }

    const connection = (navigator as any).connection
    if (!connection) return true

    // Don't load non-essential features on slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false
    }

    // Don't load on save-data mode
    if (connection.saveData) {
      return false
    }

    return true
  }
}

/**
 * Database/API optimization utilities
 */
export class APIOptimizer {
  private static requestCache = new Map<string, Promise<any>>()
  private static pendingRequests = new Map<string, AbortController>()

  /**
   * Deduplicate identical requests
   */
  static async dedupedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttlMs: number = 30000
  ): Promise<T> {
    // Check if request is already in progress
    const existingRequest = this.requestCache.get(key)
    if (existingRequest) {
      return existingRequest
    }

    // Create new request
    const requestPromise = requestFn()
    this.requestCache.set(key, requestPromise)

    // Clean up after completion or TTL
    requestPromise.finally(() => {
      setTimeout(() => {
        this.requestCache.delete(key)
      }, ttlMs)
    })

    return requestPromise
  }

  /**
   * Cancel previous request when new one is made
   */
  static async cancelableRequest<T>(
    key: string,
    requestFn: (signal: AbortSignal) => Promise<T>
  ): Promise<T> {
    // Cancel existing request
    const existingController = this.pendingRequests.get(key)
    if (existingController) {
      existingController.abort()
    }

    // Create new request with abort controller
    const controller = new AbortController()
    this.pendingRequests.set(key, controller)

    try {
      const result = await requestFn(controller.signal)
      this.pendingRequests.delete(key)
      return result
    } catch (error) {
      this.pendingRequests.delete(key)
      throw error
    }
  }

  /**
   * Batch multiple requests
   */
  static async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    batchSize: number = 5
  ): Promise<T[]> {
    const results: T[] = []
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map(fn => fn()))
      results.push(...batchResults)
      
      // Small delay between batches to prevent overwhelming the server
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  if (typeof window === 'undefined') return

  useEffect(() => {
    PerformanceMonitor.mark(`${componentName}-mount`)
    
    return () => {
      PerformanceMonitor.measure(`${componentName}-mount`)
    }
  }, [componentName])
}

// Auto-start performance monitoring in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  PerformanceMonitor.monitorWebVitals()
  PerformanceMonitor.monitorResources()
  
  // Cleanup memory cache periodically
  setInterval(() => {
    MemoryManager.cleanup()
  }, 5 * 60 * 1000) // Every 5 minutes
}
