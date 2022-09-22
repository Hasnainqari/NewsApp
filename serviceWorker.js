const staticDevCoffee = "#news#-website-v1";
const assets = ["/", "/index.html", "/app.js", "/logo","/style.css","/allfont", "Inspiration", "Josefin_sans"];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("The service worker is serving the asset.");
  event.respondWith(
    checkResponse(event.request).catch(function () {
      return returnFromCache(event.request);
    })
  );
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function (request) {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return fetch(request).then(function (response) {
      console.log("[PWA Builder] add page to offline" + response.url);
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function (request) {
  return caches.open("pwabuilder-offline").then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status == 404) {
        return cache.match("offline.html");
      } else {
        return matching;
      }
    });
  });
};
