const CACHE_NAME = "cotab-mudas-v5";

const FILES_TO_CACHE = [
    "./",
    "./cotab_mudas.html",

    "./manifest.json",

    "./firebase.js",

    "./cotab.js",
    "./contagem.js",
    "./especies.js",
    "./saida.js",
    "./historico.js",
    "./relatorio.js",

    "./estilo/cotab.css",
    "./contagem.css",
    "./especies.css",
    "./saida.css",
    "./historico.css",
    "./relatorioo.css",

    "./contagem.html",
    "./especies.html",
    "./saida.html",
    "./historco.html",
    "./relatorio.html",

    "./img/icon-192.png",
    "./img/icon-512.png",
    "./img/Capturar.PNG"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            const copia = response.clone();

            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, copia);
            });

            return response;
        })
        .catch(() => {
            return caches.match(event.request)
            .then(response => {
                return response || caches.match("./cotab_mudas.html");
            });
        })
    );
});