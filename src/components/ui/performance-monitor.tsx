import React, { memo, useEffect } from 'react';
import { usePerformance } from '@/hooks/use-performance';
import { logger } from '@/utils/logger';

interface PerformanceMonitorProps {
  reportingEnabled?: boolean;
  thresholds?: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

const PerformanceMonitor = memo(({ 
  reportingEnabled = true,
  thresholds = {
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1
  }
}: PerformanceMonitorProps) => {
  const { metrics, performanceScore } = usePerformance();

  useEffect(() => {
    if (!reportingEnabled || !metrics) return;

    // Log performance metrics
    logger.info('Performance metrics captured', {
      metrics,
      score: performanceScore,
      timestamp: Date.now()
    });

    // Alert for poor performance
    const alerts = [];
    
    if (metrics.fcp && metrics.fcp > thresholds.fcp!) {
      alerts.push(`FCP slow: ${metrics.fcp}ms (threshold: ${thresholds.fcp}ms)`);
    }
    
    if (metrics.lcp && metrics.lcp > thresholds.lcp!) {
      alerts.push(`LCP slow: ${metrics.lcp}ms (threshold: ${thresholds.lcp}ms)`);
    }
    
    if (metrics.fid && metrics.fid > thresholds.fid!) {
      alerts.push(`FID slow: ${metrics.fid}ms (threshold: ${thresholds.fid}ms)`);
    }
    
    if (metrics.cls && metrics.cls > thresholds.cls!) {
      alerts.push(`CLS high: ${metrics.cls} (threshold: ${thresholds.cls})`);
    }

    if (alerts.length > 0 && false) { // Production build - dev alerts disabled
      logger.warn('Performance thresholds exceeded', { alerts, metrics });
    }

    // Report only critical issues in production
    if (true && performanceScore < 70) { // Production monitoring enabled
      logger.warn('Critical performance issue', {
        score: performanceScore,
        lcp: metrics.lcp,
        cls: metrics.cls
      });
    }
  }, [metrics, performanceScore, reportingEnabled, thresholds]);

  // Component doesn't render anything - it's just for monitoring
  return null;
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export { PerformanceMonitor };