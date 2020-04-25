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

workbox.precaching.precacheAndRoute([{"revision":"9bbca09ea2879cd873e8092e83d8667b","url":"App.css"},{"revision":"6949ee46f7a3ece29f8e4ae57d1df008","url":"App.test.tsx"},{"revision":"2fde025b15b6346038a019cc8e2fed26","url":"App.tsx"},{"revision":"404f773695a72f15da4bdc8db2fc7b8e","url":"components/CategoryOptions.tsx"},{"revision":"37389b796fce2288e2e47f43a6a9c97d","url":"components/PWACard.tsx"},{"revision":"1fd477b66e9ff882e561a72f5ac6f8fa","url":"components/PWAInfo.tsx"},{"revision":"b45b3091cb829f98b838b4f081a66ddb","url":"components/Rating.tsx"},{"revision":"011af6c89ae6ddd684cdf62d348e18df","url":"components/RatingItem.tsx"},{"revision":"c2cab66429557c132fcf533d3d265497","url":"components/ScreenshotSlider.css"},{"revision":"7388e607dc265dc492804fcfb21baa79","url":"components/ScreenshotSlider.tsx"},{"revision":"c9a61abf8d7c1dc245983d3f3c0d7def","url":"components/SearchBarList.tsx"},{"revision":"704a29c56e563bda32091ad99c3c568b","url":"data/AppContext.tsx"},{"revision":"daadca3006fa82e3f3c30028f4db705f","url":"data/combineReducers.ts"},{"revision":"0a8176359932fbf10b869e953a55014a","url":"data/connect.tsx"},{"revision":"7d13e4f967026b7b2881c40245b42917","url":"data/dataApi.ts"},{"revision":"bbf71baa645eb56e4494860bd4588f85","url":"data/env.ts"},{"revision":"ac3b8b749db318e51f81a00bc504c635","url":"data/state.ts"},{"revision":"725099dd875cae575bde204ca14fb761","url":"data/user/user.actions.ts"},{"revision":"f291c0fced72b2aa1fbe4feaa3cbdb80","url":"data/user/user.reducer.ts"},{"revision":"e004bb8af9df580f9a871a77cd2789fa","url":"data/user/user.state.ts"},{"revision":"c9c4703789a049ba38167e6cf2ae9a43","url":"index.tsx"},{"revision":"2227de0e1fbe39cc07f9687fe6fb60d2","url":"pages/About.tsx"},{"revision":"403e8b8fbf0d8f574f8151ad6e4c6050","url":"pages/Admin.tsx"},{"revision":"73b3fccb3f85e1be6dc72ca13deaa469","url":"pages/LogIn.tsx"},{"revision":"42f825c87f57e9cb89d640ddefa6e568","url":"pages/main.css"},{"revision":"7fa003cf3d24e60d37b34dd1f8fe78b3","url":"pages/MyPWA.tsx"},{"revision":"4125887fad4ff86d5b48e039fbd1aa6e","url":"pages/Profile.tsx"},{"revision":"652cab7f513109fdd887c3a78fc65e9d","url":"pages/PWA.tsx"},{"revision":"ee7a40d7edcbde0e37ea7d5b8b738cbf","url":"pages/PWAs.css"},{"revision":"0cc25c9b4395691bdb6e3d31a0309433","url":"pages/PWAs.tsx"},{"revision":"734f9a10808b0c5ec4b74ef6adf72e11","url":"pages/SignUp.tsx"},{"revision":"ada55c524a864a8e2bcb6e310681c30b","url":"pages/Support.tsx"},{"revision":"3b12a2a445e35988cd2eb9f73d12c500","url":"react-app-env.d.ts"},{"revision":"30d2fca726d2e400a3408bc244281441","url":"serviceWorker.ts"},{"revision":"dea886be67ea6fa5cee27dba16786b90","url":"setupTests.ts"},{"revision":"f357b1e42f92ae6c7c701d4ae7ffd4e5","url":"theme/variables.css"},{"revision":"3b55d9d8be8b4e0c25a2b9fcb4a5c187","url":"util/types.ts"},{"revision":"34dd14b9b56d47c14294618797d0fa7e","url":"util/utils.ts"}]);