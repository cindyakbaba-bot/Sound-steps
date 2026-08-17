const CACHE_NAME = "sound-steps-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./audio/letters/a.mp3",
  "./audio/letters/b.mp3",
  "./audio/letters/c.mp3",
  "./audio/letters/d.mp3",
  "./audio/letters/e.mp3",
  "./audio/letters/f.mp3",
  "./audio/letters/g.mp3",
  "./audio/letters/h.mp3",
  "./audio/letters/i.mp3",
  "./audio/letters/j.mp3",
  "./audio/letters/k.mp3",
  "./audio/letters/l.mp3",
  "./audio/letters/m.mp3",
  "./audio/letters/n.mp3",
  "./audio/letters/o.mp3",
  "./audio/letters/p.mp3",
  "./audio/letters/q.mp3",
  "./audio/letters/r.mp3",
  "./audio/letters/s.mp3",
  "./audio/letters/t.mp3",
  "./audio/letters/u.mp3",
  "./audio/letters/v.mp3",
  "./audio/letters/w.mp3",
  "./audio/letters/x.mp3",
  "./audio/letters/y.mp3",
  "./audio/letters/z.mp3",
  "./audio/letters/a_long.mp3",
  "./audio/letters/e_long.mp3",
  "./audio/letters/i_long.mp3",
  "./audio/letters/o_long.mp3",
  "./audio/letters/u_long.mp3",
  "./audio/words/bad.mp3",
  "./audio/words/bat.mp3",
  "./audio/words/beat.mp3",
  "./audio/words/bed.mp3",
  "./audio/words/bee.mp3",
  "./audio/words/berry.mp3",
  "./audio/words/big.mp3",
  "./audio/words/bit.mp3",
  "./audio/words/boat.mp3",
  "./audio/words/bun.mp3",
  "./audio/words/cat.mp3",
  "./audio/words/cheap.mp3",
  "./audio/words/chip.mp3",
  "./audio/words/cup.mp3",
  "./audio/words/cut.mp3",
  "./audio/words/dig.mp3",
  "./audio/words/dog.mp3",
  "./audio/words/fan.mp3",
  "./audio/words/feel.mp3",
  "./audio/words/fill.mp3",
  "./audio/words/fin.mp3",
  "./audio/words/fine.mp3",
  "./audio/words/fish.mp3",
  "./audio/words/fog.mp3",
  "./audio/words/free.mp3",
  "./audio/words/frog.mp3",
  "./audio/words/fun.mp3",
  "./audio/words/gum.mp3",
  "./audio/words/hat.mp3",
  "./audio/words/hop.mp3",
  "./audio/words/hot.mp3",
  "./audio/words/jam.mp3",
  "./audio/words/jog.mp3",
  "./audio/words/kite.mp3",
  "./audio/words/leave.mp3",
  "./audio/words/leg.mp3",
  "./audio/words/lice.mp3",
  "./audio/words/light.mp3",
  "./audio/words/live.mp3",
  "./audio/words/load.mp3",
  "./audio/words/log.mp3",
  "./audio/words/map.mp3",
  "./audio/words/mat.mp3",
  "./audio/words/mop.mp3",
  "./audio/words/net.mp3",
  "./audio/words/pig.mp3",
  "./audio/words/pin.mp3",
  "./audio/words/pop.mp3",
  "./audio/words/rat.mp3",
  "./audio/words/red.mp3",
  "./audio/words/rice.mp3",
  "./audio/words/right.mp3",
  "./audio/words/road.mp3",
  "./audio/words/run.mp3",
  "./audio/words/sat.mp3",
  "./audio/words/seat.mp3",
  "./audio/words/see.mp3",
  "./audio/words/sheep.mp3",
  "./audio/words/ship.mp3",
  "./audio/words/sink.mp3",
  "./audio/words/sit.mp3",
  "./audio/words/stop.mp3",
  "./audio/words/sun.mp3",
  "./audio/words/thin.mp3",
  "./audio/words/think.mp3",
  "./audio/words/three.mp3",
  "./audio/words/top.mp3",
  "./audio/words/tree.mp3",
  "./audio/words/van.mp3",
  "./audio/words/very.mp3",
  "./audio/words/vine.mp3",
  "./audio/words/vote.mp3",
  "./audio/words/wig.mp3",
  "./audio/words/win.mp3",
  "./audio/words/zoo.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => cached)
    )
  );
});
