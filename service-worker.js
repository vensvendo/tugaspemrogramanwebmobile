(function() {
  'use strict';

	var CACHE_NAME = 'static-cache';
	var urlsToCache = [
	'.',
	'index.html',
	'gallery.html',
	'product.html',
	'css/main.css',
	'css/style.css',
	'pages/offline.html',
    'pages/404.html',
	'img/offline_1200.jpg',
	'img/offline.jpg',
	'img/offline_1000.jpg',
	'img/offline_500.jpg',
	'img/not-found-t.jpg',
	'img/not-found-t_800.jpg',
	'img/not-found-t_1000.jpg',
	'img/not-found-t_500.jpg',
	'index.html',
	'pages/offline.html',
	'pages/404.html'
	];
	self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('pages/404.html');
          }
          return caches.open(CACHE_NAME).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        console.log('Error, ', error);
        return caches.match('pages/offline.html');
      })
    );
  });

  self.addEventListener('activate', function(event) {
    console.log('Activating new service worker...');

    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

})();
