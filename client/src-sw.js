const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
// registerRoute() will return a cached page if there is no network connectivity
registerRoute(
  ({ request })  => ['style', 'script', 'worker'].includes (request.mode === 'navigate', pageCache),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// // offlineFallback() will return a cached page if there is no network connectivity
// offlineFallback([
//   { urlPattern: /\.(?:html|css|js|json)$/, strategy: pageCache },
// ]);

// TODO: Implement asset caching
registerRoute();
