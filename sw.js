const CACHE_NAME = 'cache1';
const urlsToCache = [
    'index.html',
    'js/bundle.js',
  
];

self.addEventListener('install', ev=> {

    console.log('Installed the service worker...');
    ev.waitUntil(
         cacheOpened =  caches.open(CACHE_NAME)
                .then(cache=> {
                    return cache.addAll(urlsToCache);
                })
    );
});

self.addEventListener('activate', ev=> {
    // Force service worker to "take over" your page immediately, rather than
    // on reload
    console.log('Claiming control...');
    return self.clients.claim();
});

self.addEventListener('fetch', ev=> {

    console.log(`Service worker intercepted request for: ${ev.request.url}`);

    // Is the response from this URL in the cache?  (promise-based code)
    ev.respondWith(
         caches.match(ev.request)
            .then(res=> {

                // The promise will resolve with the cached response
                if(res) {
                    // Return it
                    console.log('This is in the cache');
                    return res;
                }

                // Otherwise, use the fetch API to send a request to the URL
                // and return it.
                console.log('This is NOT in the cache - fetching from web');
                return fetch(ev.request);
            })
    );
});

