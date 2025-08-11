import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
  locale?: string;
  alternateLocales?: string[];
}

export const useEnhancedSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update page title
    document.title = config.title;

    // Update meta description
    updateMetaTag('description', config.description);

    // Update keywords
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords.join(', '));
    }

    // Update canonical URL
    if (config.canonical) {
      updateLinkTag('canonical', config.canonical);
    }

    // Update Open Graph tags
    updateMetaTag('og:title', config.title, 'property');
    updateMetaTag('og:description', config.description, 'property');
    updateMetaTag('og:type', config.ogType || 'website', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:locale', config.locale || 'pt_BR', 'property');

    if (config.ogImage) {
      updateMetaTag('og:image', config.ogImage, 'property');
      updateMetaTag('og:image:alt', config.title, 'property');
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', config.title);
    updateMetaTag('twitter:description', config.description);
    if (config.ogImage) {
      updateMetaTag('twitter:image', config.ogImage);
    }

    // Add alternate locales
    if (config.alternateLocales) {
      config.alternateLocales.forEach(locale => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', locale);
        updateLinkTag('alternate', url.toString(), locale);
      });
    }

    // Add structured data
    if (config.structuredData) {
      addStructuredData(config.structuredData);
    }

  }, [config]);

  const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let link = document.querySelector(selector) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      document.head.appendChild(link);
    }
    link.href = href;
  };

  const addStructuredData = (data: object) => {
    const id = 'structured-data';
    let script = document.getElementById(id) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  };
};

// Schema.org structured data generators
export const generateProductSchema = (product: {
  name: string;
  description: string;
  brand: string;
  image?: string;
  url: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  offers?: {
    price?: string;
    currency?: string;
    availability?: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "image": product.image,
  "url": product.url,
  "offers": {
    "@type": "Offer",
    "availability": `https://schema.org/${product.availability}`,
    ...product.offers
  }
});

export const generateOrganizationSchema = (org: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    type: string;
    telephone?: string;
    email?: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": org.name,
  "url": org.url,
  "logo": org.logo,
  "sameAs": org.sameAs,
  "contactPoint": org.contactPoint ? {
    "@type": "ContactPoint",
    "contactType": org.contactPoint.type,
    "telephone": org.contactPoint.telephone,
    "email": org.contactPoint.email
  } : undefined
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});