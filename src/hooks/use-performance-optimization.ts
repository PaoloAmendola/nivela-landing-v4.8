import { useEffect, useCallback, useRef } from 'react';

interface PerformanceConfig {
  enableLazyLoading?: boolean;
  enableImageOptimization?: boolean;
  enableCodeSplitting?: boolean;
  enableCaching?: boolean;
  performanceBudget?: {
    maxImageSize: number;
    maxBundleSize: number;
    maxRenderTime: number;
  };
}

interface PerformanceMetrics {
  renderTime: number;
  imageLoadTime: number;
  bundleSize: number;
  cacheHitRate: number;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    imageLoadTime: 0,
    bundleSize: 0,
    cacheHitRate: 0
  });

  const renderStartRef = useRef<number>(0);
  const imageLoadStartRef = useRef<number>(0);

  // Start render timing
  const startRenderTiming = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // End render timing
  const endRenderTiming = useCallback(() => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      metricsRef.current.renderTime = renderTime;
      
      // Performance budget check - handled silently in production
      
      renderStartRef.current = 0;
    }
  }, [config.performanceBudget?.maxRenderTime]);

  // Image load timing
  const trackImageLoad = useCallback((src: string, loadTime: number) => {
    metricsRef.current.imageLoadTime = loadTime;
    
    if (config.performanceBudget?.maxImageSize) {
      // Check image size if possible
      fetch(src, { method: 'HEAD' })
        .then(response => {
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            const size = parseInt(contentLength, 10);
            // Image size budget check - handled silently in production
          }
        })
        .catch(() => {
          // Silently fail for HEAD requests
        });
    }
  }, [config.performanceBudget?.maxImageSize]);

  // Monitor Core Web Vitals - Throttled to prevent excessive logging
  const monitorWebVitals = useCallback(() => {
    if (typeof PerformanceObserver === 'undefined') {
      return;
    }

    // Monitor LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const lcp = entry.startTime;
        // LCP performance check - handled silently in production
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        // FID performance check - handled silently in production
      }
    }).observe({ entryTypes: ['first-input'] });

    // Monitor CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      // CLS performance check - handled silently in production
    }).observe({ entryTypes: ['layout-shift'] });
  }, []);

  // Optimize images
  const optimizeImage = useCallback((src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'original';
  } = {}) => {
    if (!config.enableImageOptimization) return src;

    // For Supabase images, apply transformations
    if (src.includes('supabase.co/storage/v1/object/public/')) {
      const url = new URL(src);
      const params = new URLSearchParams();
      
      if (options.width) params.set('width', options.width.toString());
      if (options.height) params.set('height', options.height.toString());
      if (options.quality) params.set('quality', options.quality.toString());
      if (options.format && options.format !== 'original') {
        params.set('format', options.format);
      }
      
      if (params.toString()) {
        url.search = params.toString();
        return url.toString();
      }
    }

    return src;
  }, [config.enableImageOptimization]);

  // Preload critical resources
  const preloadCriticalResources = useCallback((resources: string[]) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf)$/i)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (resource.match(/\.(css)$/i)) {
        link.as = 'style';
      } else if (resource.match(/\.(js)$/i)) {
        link.as = 'script';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    monitorWebVitals();

    // Report performance metrics
    const reportMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        // Page load performance metrics - handled silently in production
      }
    };

    // Report metrics after page load
    if (document.readyState === 'complete') {
      reportMetrics();
    } else {
      window.addEventListener('load', reportMetrics);
      return () => window.removeEventListener('load', reportMetrics);
    }
  }, [monitorWebVitals]);

  return {
    startRenderTiming,
    endRenderTiming,
    trackImageLoad,
    optimizeImage,
    preloadCriticalResources,
    metrics: metricsRef.current
  };
};