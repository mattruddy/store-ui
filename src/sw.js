importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp('https://hacker-news.firebaseio.com'),
  new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener('push', (event) => {
    const push = JSON.parse(event.data.text());
    const title = `Your PWA was ${push.code}`;
    const options = {
        body: push.message == 'null' ? 'Congrats!' : push.message,
        icon: 'assets/icon/logo-180.png',
        badge: 'assets/icon/logo-180.png',
        image: 'assets/icon/logo-180.png',
    };
    
    event.waitUntil(
      clients.matchAll({
          includeUncontrolled: true
      }).then(c => {
            self.registration.showNotification(title, options)
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  const urlToOpen = new URL(self.location.origin).href;
  const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
  }).then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url.includes(urlToOpen)) {
            matchingClient = windowClient;
            break;
          }
      }

      if (matchingClient) {
          return matchingClient.focus();
      } else {
          return clients.openWindow(urlToOpen);
      }
  });

  event.waitUntil(promiseChain);
  event.notification.close();
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);