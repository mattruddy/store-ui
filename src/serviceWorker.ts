// This optional code is used to register a service worker.
// register() is not called by default.

import { vars } from "./data/env"
import { Store } from "."
import { thunkAddPush } from "./redux/User/actions"
import { Push } from "./util/types"
import { setHasUpdate } from "./redux/App/actions"

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export function register(store: Store, config?: Config) {
  if ("serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, store, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://bit.ly/CRA-PWA"
          )
        })
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, store, config)
      }
    })
  }
}

function registerValidSW(swUrl: string, store: Store, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://bit.ly/CRA-PWA."
              )
              store.dispatch<any>(setHasUpdate())
              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log("Content is cached for offline use.")

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }

      if ("PushManager" in window) {
        registration.pushManager.getSubscription().then((subscription) => {
          const isSubscribed = !(subscription === null)
          if (isSubscribed) {
            console.log("user is subbed to push notifications")
          } else {
            subscribeUser(registration, store)
          }
        })
      }
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error)
    })
}

function checkValidServiceWorker(swUrl: string, store: Store, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type")
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, store, config)
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      )
    })
}

function subscribeUser(registration: ServiceWorkerRegistration, store: Store) {
  const applicationServerKey = urlB64ToUint8Array(vars().env.APP_SERVER_KEY)
  registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function (subscription: PushSubscription) {
      const subJson = subscription.toJSON()
      const key = subJson.keys!.p256dh as string
      const auth = subJson.keys!.auth as string
      const endpoint = subJson.endpoint as string
      // Get public key, user auth and push endpoint from the subscription object.
      // If the user is logged in, add the device.
      // Otherwise store in local storage and add after login.
      store.dispatch<any>(
        thunkAddPush({ key: key, auth: auth, endpoint: endpoint } as Push)
      )
    })
    .catch(function (err: Error) {
      console.log("Failed to subscribe the user: ", err)
    })
}

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}
