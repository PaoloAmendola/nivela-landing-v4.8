/**
 * Advanced Resource Preloading Utilities
 * Implements intelligent preloading for critical sections and assets
 */

interface PreloadConfig {
  priority: 'high' | 'medium' | 'low';
  as: 'image' | 'video' | 'script' | 'style' | 'font' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
}

interface SectionPreloadMap {
  [sectionId: string]: {
    images: string[];
    videos: string[];
    scripts: string[];
    styles: string[];
    priority: 'high' | 'medium' | 'low';
  };
}

// Critical sections configuration
const CRITICAL_SECTIONS: SectionPreloadMap = {
  'manifesto': {
    images: [],
    videos: [],
    scripts: [],
    styles: [],
    priority: 'high'
  },
  'produto': {
    images: ['https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/frasco-nivela-destaque.webp'],
    videos: [],
    scripts: [],
    styles: [],
    priority: 'high'
  },
  'tecnologia': {
    images: [],
    videos: ['https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4'],
    scripts: [],
    styles: [],
    priority: 'medium'
  },
  'ingredientes': {
    images: [
      'https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/capsaicina-amazonia.webp',
      'https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/andiroba-amazonia.webp',
      'https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/jambu-amazonia.webp'
    ],
    videos: [],
    scripts: [],
    styles: [],
    priority: 'medium'
  }
};

class ResourcePreloader {
  private preloadedUrls = new Set<string>();
  private observer: IntersectionObserver | null = null;
  private preloadQueue: Array<{ url: string; config: PreloadConfig }> = [];
  private processingQueue = false;

  constructor() {
    this.initializeObserver();
    this.preloadCriticalResources();
  }

  /**
   * Initialize Intersection Observer for section-based preloading
   */
  private initializeObserver() {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            const sectionId = entry.target.id;
            if (sectionId && CRITICAL_SECTIONS[sectionId]) {
              this.preloadSection(sectionId);
            }
          }
        });
      },
      {
        threshold: [0.1],
        rootMargin: '200px 0px' // Start preloading 200px before section enters viewport
      }
    );

    // Observe all sections with IDs
    setTimeout(() => {
      const sections = document.querySelectorAll('section[id], div[id]');
      sections.forEach(section => this.observer?.observe(section));
    }, 100);
  }

  /**
   * Preload critical above-the-fold resources immediately
   */
  private preloadCriticalResources() {
    // Critical images for hero section
    this.preloadResource('https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/logo-bembeauty-transparente.png', {
      priority: 'high',
      as: 'image'
    });

    this.preloadResource('https://fdyzlqovxvdpkzlwuhjj.supabase.co/storage/v1/object/public/imagens/frasco-trans-comp.png', {
      priority: 'high',
      as: 'image'
    });

    // Critical fonts
    this.preloadResource('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap', {
      priority: 'high',
      as: 'style'
    });
  }

  /**
   * Preload resources for a specific section
   */
  private preloadSection(sectionId: string) {
    const section = CRITICAL_SECTIONS[sectionId];
    if (!section) return;

    // Section preloading started

    // Preload images
    section.images.forEach(url => {
      this.preloadResource(url, {
        priority: section.priority,
        as: 'image'
      });
    });

    // Preload videos (metadata only for faster startup)
    section.videos.forEach(url => {
      this.preloadVideoMetadata(url);
    });

    // Preload scripts
    section.scripts.forEach(url => {
      this.preloadResource(url, {
        priority: section.priority,
        as: 'script'
      });
    });

    // Preload styles
    section.styles.forEach(url => {
      this.preloadResource(url, {
        priority: section.priority,
        as: 'style'
      });
    });
  }

  /**
   * Generic resource preloading with intelligent queuing
   */
  public preloadResource(url: string, config: PreloadConfig) {
    if (this.preloadedUrls.has(url) || typeof window === 'undefined') return;

    this.preloadQueue.push({ url, config });
    
    if (!this.processingQueue) {
      this.processQueue();
    }
  }

  /**
   * Process preload queue with priority and connection-aware loading
   */
  private async processQueue() {
    if (this.processingQueue || this.preloadQueue.length === 0) return;
    
    this.processingQueue = true;

    // Sort by priority
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.config.priority] - priorityOrder[a.config.priority];
    });

    // Check network conditions
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.saveData
    );

    // Process high priority first, respect network conditions
    const batchSize = isSlowConnection ? 2 : 4;
    
    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, batchSize);
      
      await Promise.allSettled(
        batch.map(({ url, config }) => this.createPreloadLink(url, config))
      );

      // Add delay for slow connections
      if (isSlowConnection) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.processingQueue = false;
  }

  /**
   * Create and inject preload link element
   */
  private createPreloadLink(url: string, config: PreloadConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedUrls.has(url)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = config.as;
      
      if (config.crossorigin) {
        link.crossOrigin = config.crossorigin;
      }
      
      if (config.media) {
        link.media = config.media;
      }

      // Set fetch priority for supported browsers
      if ('fetchPriority' in link) {
        (link as any).fetchPriority = config.priority;
      }

      link.onload = () => {
        this.preloadedUrls.add(url);
        // Resource preloaded successfully
        resolve();
      };

      link.onerror = () => {
        // Resource preload failed - handled silently
        reject(new Error(`Failed to preload: ${url}`));
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Preload video metadata for faster startup
   */
  private preloadVideoMetadata(url: string) {
    if (this.preloadedUrls.has(url)) return;

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.muted = true;
    video.style.display = 'none';
    
    video.addEventListener('loadedmetadata', () => {
      this.preloadedUrls.add(url);
      // Video metadata preloaded successfully
      document.body.removeChild(video);
    });

    video.addEventListener('error', () => {
      // Video preload failed - handled silently
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
    });

    document.body.appendChild(video);
  }

  /**
   * Prefetch resources for next likely navigation
   */
  public prefetchResource(url: string) {
    if (this.preloadedUrls.has(url) || typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    link.onload = () => {
      this.preloadedUrls.add(url);
      // Resource prefetched successfully
    };

    document.head.appendChild(link);
  }

  /**
   * Clean up observer
   */
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Get preloading stats
   */
  public getStats() {
    return {
      preloadedCount: this.preloadedUrls.size,
      queueLength: this.preloadQueue.length,
      isProcessing: this.processingQueue
    };
  }
}

// Singleton instance
let preloaderInstance: ResourcePreloader | null = null;

export const getPreloader = (): ResourcePreloader => {
  if (!preloaderInstance) {
    preloaderInstance = new ResourcePreloader();
  }
  return preloaderInstance;
};

export const preloadCriticalResources = () => {
  getPreloader();
};

export const preloadSection = (sectionId: string) => {
  getPreloader().preloadResource('', { priority: 'medium', as: 'fetch' });
};

export const preloadResource = (url: string, config: PreloadConfig) => {
  getPreloader().preloadResource(url, config);
};

export const prefetchResource = (url: string) => {
  getPreloader().prefetchResource(url);
};

export const getPreloaderStats = () => {
  return preloaderInstance?.getStats() || { preloadedCount: 0, queueLength: 0, isProcessing: false };
};