import React, { useCallback, useRef, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  id: string;
}

interface AnalyticsBatchConfig {
  batchSize: number;
  flushInterval: number; // milliseconds
  maxWaitTime: number; // milliseconds
}

const DEFAULT_CONFIG: AnalyticsBatchConfig = {
  batchSize: 20,
  flushInterval: 10000, // 10 seconds - Reduced frequency
  maxWaitTime: 60000, // 60 seconds
};

/**
 * Hook for batching analytics events to improve performance
 * Reduces individual network requests by batching multiple events
 */
export const useAnalyticsBatch = (config: Partial<AnalyticsBatchConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const queue = useRef<AnalyticsEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout>();
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout>();

  // Flush events to analytics service
  const flushEvents = useCallback(async () => {
    if (queue.current.length === 0) return;

    const eventsToSend = [...queue.current];
    queue.current = [];

    // Clear timeouts
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = undefined;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = undefined;
    }

    try {
      logger.info('Flushing analytics batch', { 
        eventCount: eventsToSend.length,
        events: eventsToSend.map(e => e.name)
      });

      // Send to analytics service (GA4, custom backend, etc.)
      await sendAnalyticsBatch(eventsToSend);
      
      logger.info('Analytics batch sent successfully', { 
        eventCount: eventsToSend.length 
      });
      
    } catch (error) {
      logger.error('Failed to send analytics batch', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        eventCount: eventsToSend.length 
      });
      
      // Optionally re-queue events for retry
      // queue.current.unshift(...eventsToSend);
    }
  }, []);

  // Schedule flush based on batch size or time
  const scheduleFlush = useCallback(() => {
    // Flush immediately if batch size reached
    if (queue.current.length >= finalConfig.batchSize) {
      flushEvents();
      return;
    }

    // Schedule flush if not already scheduled
    if (!flushTimeoutRef.current) {
      flushTimeoutRef.current = setTimeout(flushEvents, finalConfig.flushInterval);
    }

    // Set max wait time if first event in queue
    if (queue.current.length === 1 && !maxWaitTimeoutRef.current) {
      maxWaitTimeoutRef.current = setTimeout(flushEvents, finalConfig.maxWaitTime);
    }
  }, [flushEvents, finalConfig.batchSize, finalConfig.flushInterval, finalConfig.maxWaitTime]);

  // Add event to batch queue
  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
      id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9)
    };

    queue.current.push(event);
    scheduleFlush();

    logger.debug('Analytics event queued', { 
      eventName: name, 
      queueSize: queue.current.length 
    });
  }, [scheduleFlush]);

  // Force flush all pending events
  const flush = useCallback(() => {
    flushEvents();
  }, [flushEvents]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Flush remaining events before unmount
      if (queue.current.length > 0) {
        flushEvents();
      }
      
      // Clear timeouts
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, [flushEvents]);

  // Flush on page visibility change (user leaving)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && queue.current.length > 0) {
        // Use sendBeacon for reliable sending when page is unloading  
        if ('sendBeacon' in navigator) {
          sendAnalyticsBeacon(queue.current);
        }
        queue.current = [];
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    trackEvent,
    flush,
    getQueueSize: () => queue.current.length,
    getConfig: () => finalConfig
  };
};

// Send batch to analytics service
async function sendAnalyticsBatch(events: AnalyticsEvent[]) {
  // Example implementation for GA4
  if (typeof (window as any).gtag !== 'undefined') {
    events.forEach(event => {
      (window as any).gtag('event', event.name, event.properties);
    });
  }

  // Example implementation for custom analytics
  if (import.meta.env.PROD) {
    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: getSessionId(),
          timestamp: Date.now()
        }),
      });
    } catch (error) {
      logger.warn('Custom analytics endpoint failed', { error });
    }
  }
}

// Send using beacon API for reliability during page unload
function sendAnalyticsBeacon(events: AnalyticsEvent[]) {
  try {
    const data = JSON.stringify({
      events,
      sessionId: getSessionId(),
      timestamp: Date.now(),
      beacon: true
    });

    navigator.sendBeacon('/api/analytics/batch', data);
    
    logger.info('Analytics sent via beacon', { eventCount: events.length });
  } catch (error) {
    logger.warn('Beacon send failed', { error });
  }
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  
  return sessionId;
}