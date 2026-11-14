// Vite PWA settings, imported by vite.config.js
export const pwaConfig = {
  registerType: 'autoUpdate',
  manifest: {
    name: 'AstroVital AI',
    short_name: 'AstroVital',
    description: 'Space Health & Mission Wellness Platform',
    theme_color: '#0B3D91',
    background_color: '#061A35',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
    navigateFallback: '/index.html',
    // API calls are NOT cached by the service worker.
    // Old data lives in IndexedDB and is marked live:false (see offlineApi.js).
    runtimeCaching: [],
  },
};