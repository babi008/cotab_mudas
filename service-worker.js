const CACHE_NAME = "cotab-mudas-v1";

const FILES_TO_CACHE = [
    "./",
    "./cotab_mudas.html",
    "./cotab.js",
    "./firebase.js",
    "./estilo/cotab.css",
    "./especies.html",
    "./especies.js",
    "./especies.css",
    "./contagem.html",
    "./contagem.js",
    "./contagem.css",
    "./saida.html",
    "./saida.js",
    "./saida.css",
    "./historco.html",
    "./historico.js",
    "./historico.css",
    "./relatorio.html",
    "./relatorio.js",
    "./relatorioo.css",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});