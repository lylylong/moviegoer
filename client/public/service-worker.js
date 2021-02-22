const APP_PREFIX = 'moveigoer-'; 
const VERSION = 'v1'; 
const CACHE_NAME = APP_PREFIX + VERSION; 
const DATA_CACHE_NAME = "data-cache-" + VERSION; 

const FILE_TO_CACHE = [
    "./index.html",  
    "./css/style.css", 
    "./js/idb.js", 
    "./js/index.js", 
    "./manifest.json", 
    "./logo192.png", 
    "./logo512.png", 
]; 

// cache all of your files 
self.addEventListener("install", function(event) { 
    // wait until these certain things happen first 
    event.waitUntil(
        // when cache name open and then the cache function 
        caches.open(CACHE_NAME).then(function(cache) { 
            // console log that it is intalling plus the name 
            console.long('cache is installing : ' + CACHE_NAME)
            // when wroking return all the cached files 
            return cache.addAll(FILE_TO_CACHE); 
        })
    );
});

// fetching the reposded cached files 
self.addEventListener("fetch", function(event) { 
    if (event.request.url.includes("/api/")) { 
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => { 
                return fetch(event.request)
                .then(response => { 
                    if (response.status === 200) { 
                        cache.put(event.request.url, response.clone()); 
                    }
                    return response; 
                })
                .catch(err => { 
                    return cache.match(event.request); 
                });
            }).catch(err => console.log(err))
        ); 
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function() { 
            return caches.match(event.request).then(function(response) { 
                if (response) { 
                    return response; 
                } else if (event.request.headers.get("accept").includes("text/html")) {
                return caches.match("/");
                }
            });
        })
    );
});

self.addEventListener('activate', function (e) { 
    e.waitUntil(
        caches.keys().then(function (keyList) { 
            let cacheKeeplist = KeyList.filter(function (key) { 
                return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME);
            return Promise.all(keyList.map(function (key, i) { 
                if (cacheKeeplist.indexOf(key) === -1) { 
                    console.log('removing : ' + keyList[i] ); 
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});