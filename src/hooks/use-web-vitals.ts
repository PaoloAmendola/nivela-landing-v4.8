import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}

interface UseWebVitalsOptions {
  reportingEndpoint?: string;
  onMetric?: (metric: any) => void;
}

export const useWebVitals = (options: UseWebVitalsOptions = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports performance APIs
    if (typeof window !== 'undefined' && 'performance' in window) {
      setIsSupported(true);
      
      const observers: PerformanceObserver[] = [];
      const reportedMetrics = new Set<string>();
      
      // LCP - Largest Contentful Paint
      const observeLCP = () => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.startTime;
          
          if (!reportedMetrics.has('LCP')) {
            reportedMetrics.add('LCP');
            setMetrics(prev => ({ ...prev, lcp }));
            options.onMetric?.({ name: 'LCP', value: lcp });
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        observers.push(observer);
      };

      // FCP - First Contentful Paint
      const observeFCP = () => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          
          if (fcpEntry && !reportedMetrics.has('FCP')) {
            reportedMetrics.add('FCP');
            const fcp = fcpEntry.startTime;
            setMetrics(prev => ({ ...prev, fcp }));
            options.onMetric?.({ name: 'FCP', value: fcp });
          }
        });
        
        observer.observe({ entryTypes: ['paint'] });
        observers.push(observer);
      };

      // CLS - Cumulative Layout Shift (throttled updates)
      const observeCLS = () => {
        let clsValue = 0;
        let lastUpdateTime = 0;
        const UPDATE_INTERVAL = 1000; // 1 second throttle
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          const now = Date.now();
          if (now - lastUpdateTime > UPDATE_INTERVAL) {
            lastUpdateTime = now;
            setMetrics(prev => ({ ...prev, cls: clsValue }));
            options.onMetric?.({ name: 'CLS', value: clsValue });
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        observers.push(observer);
      };

      // TTFB - Time to First Byte (one-time measurement)
      const measureTTFB = () => {
        if (reportedMetrics.has('TTFB')) return;
        
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          reportedMetrics.add('TTFB');
          setMetrics(prev => ({ ...prev, ttfb }));
          options.onMetric?.({ name: 'TTFB', value: ttfb });
        }
      };

      // Initialize observers
      try {
        observeLCP();
        observeFCP();
        observeCLS();
        measureTTFB();
      } catch (error) {
        // Web vitals initialization error handled silently
      }

      // Cleanup function
      return () => {
        observers.forEach(observer => observer.disconnect());
      };
    }
  }, []); // Remove options dependency to prevent loops

  const getPerformanceGrade = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      lcp: { good: 2500, needs: 4000 },
      fcp: { good: 1800, needs: 3000 },
      cls: { good: 0.1, needs: 0.25 },
      fid: { good: 100, needs: 300 },
      ttfb: { good: 600, needs: 1500 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needs) return 'needs-improvement';
    return 'poor';
  };

  return {
    metrics,
    isSupported,
    getPerformanceGrade
  };
};

// Hook para monitorar erros JavaScript
export const useErrorTracking = () => {
  const [errors, setErrors] = useState<Array<{ message: string; stack?: string; timestamp: number }>>([]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, {
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now()
      }]);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now()
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const clearErrors = () => setErrors([]);

  return { errors, clearErrors };
};