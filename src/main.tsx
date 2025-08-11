import './sentry.client'
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "./index.css";

// Register advanced service worker - Enhanced duplicate prevention
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Enhanced check for existing registrations and active service workers
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      const hasActiveRegistration = existingRegistrations.some(reg => 
        reg.active && reg.scope === window.location.origin + '/'
      );
      
      // Prevent duplicate registrations more aggressively
      if (hasActiveRegistration || navigator.serviceWorker.controller || 
          window.location.pathname.includes('sw-advanced.js')) {
        return;
      }
      
      // Register new advanced service worker
      const registration = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      // Enhanced update handling
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, consider showing update notification
            }
          });
        }
      });
      
    } catch (error) {
      // Only log SW errors in development
      if (false) { // Production build - SW dev logging disabled
        // Service Worker registration failed in production
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
