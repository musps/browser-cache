'use strict'

/**
 *******************************************************
 * CONFIGURATION
 *******************************************************
 */

const CACHE_STATE = false

const CACHE_NAME = 'cache_1000'

const CACHE_FILES = [
  {
    "url": "main.js",
    "revision": "837a8fbd3c8557e0edb984cb5b3e0d3e"
  },
  {
    "url": "second.js",
    "revision": "837a8fbd3c8557e0edb984cb5b3e0d3e"
  }
]

/**
 *******************************************************
 * MAIN SCRIPT
 *******************************************************
 */

const getCacheFiles = files => files.map(f => f.url)

const installCache = async () => {
  // Step 1 : Check if current cache exist.
  const cacheExist = await caches.has(CACHE_NAME)
  if (cacheExist) {
    return true
  }

  // Step 2 : If not we remove all old cache.
  caches
    .keys()
    .then((cacheNames) => {
      cacheNames
        .filter((cacheName) => {
          return cacheName !== CACHE_NAME
        })
        .map((cacheName) => {
          return caches.delete(cacheName)
        })
    })

  // Step 3 : We install the fresh new cache.
  caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(getCacheFiles(CACHE_FILES))
  })
}

self.addEventListener('install', function(event) {
  self.skipWaiting()
})

if (CACHE_STATE) {
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return response || fetch(event.request)
        })
        .catch((response) => {
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/index-offline.html')
          }
          return response
        })
    )
  })

  installCache()
}
