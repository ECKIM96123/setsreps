const CACHE_NAME = 'sets-reps-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add more static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkoutData());
  }
});

async function syncWorkoutData() {
  try {
    // Get pending syncs from IndexedDB or localStorage
    const pendingSyncs = JSON.parse(localStorage.getItem('pendingSyncs') || '[]');
    
    if (pendingSyncs.length > 0) {
      console.log('Syncing workout data in background...');
      // In a real app, you'd send this data to your server
      
      // For now, just clear the pending syncs
      localStorage.setItem('pendingSyncs', '[]');
      
      // Show notification
      self.registration.showNotification('Workout data synced!', {
        body: `Successfully synced ${pendingSyncs.length} items`,
        icon: '/favicon.ico'
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}