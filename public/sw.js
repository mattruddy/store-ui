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

workbox.precaching.precacheAndRoute([{"revision":"9bbca09ea2879cd873e8092e83d8667b","url":"App.css"},{"revision":"6949ee46f7a3ece29f8e4ae57d1df008","url":"App.test.tsx"},{"revision":"2fde025b15b6346038a019cc8e2fed26","url":"App.tsx"},{"revision":"e76e224ae26f9388b384c30e8213a396","url":"components/CategoryOptions.tsx"},{"revision":"4bb0d2a6dfc0e3983b030ed725571e9f","url":"components/PWACard.tsx"},{"revision":"704a29c56e563bda32091ad99c3c568b","url":"data/AppContext.tsx"},{"revision":"daadca3006fa82e3f3c30028f4db705f","url":"data/combineReducers.ts"},{"revision":"0a8176359932fbf10b869e953a55014a","url":"data/connect.tsx"},{"revision":"a16ef72e1e6577b3e833d2403f25ae23","url":"data/dataApi.ts"},{"revision":"54f8144d0b01e69e82cbee2c3ad2a9c7","url":"data/env.ts"},{"revision":"ac3b8b749db318e51f81a00bc504c635","url":"data/state.ts"},{"revision":"725099dd875cae575bde204ca14fb761","url":"data/user/user.actions.ts"},{"revision":"f291c0fced72b2aa1fbe4feaa3cbdb80","url":"data/user/user.reducer.ts"},{"revision":"e004bb8af9df580f9a871a77cd2789fa","url":"data/user/user.state.ts"},{"revision":"c9c4703789a049ba38167e6cf2ae9a43","url":"index.tsx"},{"revision":"6f6ca06a4ab0e39b2539144381c66a1d","url":"pages/About.tsx"},{"revision":"403e8b8fbf0d8f574f8151ad6e4c6050","url":"pages/Admin.tsx"},{"revision":"7c51c22b2d3954c3f0a743f3830cdcc7","url":"pages/LogIn.tsx"},{"revision":"42f825c87f57e9cb89d640ddefa6e568","url":"pages/main.css"},{"revision":"e30df79b608a1ae0c1266afadceccc12","url":"pages/MyPWA.tsx"},{"revision":"b7ee573635368946766d8772f905702d","url":"pages/Profile.tsx"},{"revision":"703f9634d9fef1e2e90da4034a88c741","url":"pages/PWA.tsx"},{"revision":"040761696b8d02d847aaf1ccddbceb6e","url":"pages/PWAs.tsx"},{"revision":"734f9a10808b0c5ec4b74ef6adf72e11","url":"pages/SignUp.tsx"},{"revision":"ada55c524a864a8e2bcb6e310681c30b","url":"pages/Support.tsx"},{"revision":"3b12a2a445e35988cd2eb9f73d12c500","url":"react-app-env.d.ts"},{"revision":"30d2fca726d2e400a3408bc244281441","url":"serviceWorker.ts"},{"revision":"dea886be67ea6fa5cee27dba16786b90","url":"setupTests.ts"},{"revision":"362e8bd92c72cb7ef586d81d8168c38c","url":"theme/variables.css"},{"revision":"f3fc0adfe0bc594bcc98e07360de4461","url":"util/types.ts"},{"revision":"67eccfdc7178a714df7ec58b2ddb0dfd","url":"util/utils.ts"}]);