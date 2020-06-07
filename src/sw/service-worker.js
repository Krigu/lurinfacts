import {
  CacheFirst,
  CacheOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { preparePushMessage } from "./pushMessageHandler.js";
import { RangeRequestsPlugin } from "workbox-range-requests";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

import {
  addMediaToCache,
  webShareMediaCache,
} from "./../services/imageMediaDataCache";

// This will be replaced by the list of files to precache by
// the `workbox injectManifest` build step.
const precachedRoutes = self.__WB_MANIFEST;

const shareTargetHandler = async ({ event }) => {
  console.log("Saving media locally...");
  const formData = await event.request.formData();
  const mediaFiles = formData.getAll("media");

  for (const mediaFile of mediaFiles) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.
    if (!mediaFile.name) {
      console.log("Sorry! No name found on incoming media.");
      continue;
    }
    await addMediaToCache("image", mediaFile);
  }

  // After the POST succeeds, redirect to the main page.
  return Response.redirect("/addImage?shareTarget", 303);
};

const cachedMediaHandler = new CacheOnly({
  cacheName: webShareMediaCache,
  plugins: [
    // Support for cache requests that include a Range: header.
    new RangeRequestsPlugin(),
  ],
});

skipWaiting();
clientsClaim();

precacheAndRoute(precachedRoutes);

//this handler catches the request to urls like: lurinfacts.ch/map and serves the index.html
//it not registered and the app is offline, no site will be returned by sw => 404 notfound
const handler = createHandlerBoundToURL("index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

registerRoute("/_share-target", shareTargetHandler, "POST");

registerRoute(new RegExp("/_media/"), cachedMediaHandler);

registerRoute(
  /\.(?:gif|jpg|jpeg|png|ico|webp)$/,
  new CacheFirst({
    cacheName: "my-image-cache",
  })
);

registerRoute(
  new RegExp(
    "^https://firebasestorage.googleapis.com/v0/b/burning-inferno-892.appspot.com/"
  ),
  new CacheFirst({
    cacheName: "firebasestorage-cache",
  })
);

// test content: {"type":"newfact","itemKey":"-Ldehm5uG6-Aij15awKw","message":"newfact!!","title":"pushTitle"}
self.addEventListener("push", function (event) {
  var msg = preparePushMessage(event);
  event.waitUntil(self.registration.showNotification(msg.title, msg.options));
});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);
