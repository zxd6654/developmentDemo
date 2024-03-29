let Cache = {

    enabled: false,

    files: {},

    add: function (key, file) {

        if (this.enabled === false) return;

        // console.log( 'THREE.Cache', 'Adding key:', key );

        this.files[key] = file;

    },

    get: function (key) {

        if (this.enabled === false) return;

        // console.log( 'THREE.Cache', 'Checking key:', key );

        return this.files[key];

    },

    remove: function (key) {

        delete this.files[key];

    },

    clear: function () {

        this.files = {};

    }

};

/**
 * @author mrdoob / http://mrdoob.com/
 */

let loading = {};
function LoadingManager(onLoad, onProgress, onError) {

    var scope = this;

    var isLoading = false;
    var itemsLoaded = 0;
    var itemsTotal = 0;
    var urlModifier = undefined;

    this.onStart = undefined;
    this.onLoad = onLoad;
    this.onProgress = onProgress;
    this.onError = onError;

    this.itemStart = function (url) {

        itemsTotal++;

        if (isLoading === false) {

            if (scope.onStart !== undefined) {

                scope.onStart(url, itemsLoaded, itemsTotal);

            }

        }

        isLoading = true;

    };

    this.itemEnd = function (url) {

        itemsLoaded++;

        if (scope.onProgress !== undefined) {

            scope.onProgress(url, itemsLoaded, itemsTotal);

        }

        if (itemsLoaded === itemsTotal) {

            isLoading = false;

            if (scope.onLoad !== undefined) {

                scope.onLoad();

            }

        }

    };

    this.itemError = function (url) {

        if (scope.onError !== undefined) {

            scope.onError(url);

        }

    };

    this.resolveURL = function (url) {

        if (urlModifier) {

            return urlModifier(url);

        }

        return url;

    };

    this.setURLModifier = function (transform) {

        urlModifier = transform;
        return this;

    };

}

let DefaultLoadingManager = new LoadingManager();


function FileLoader(manager) {

    this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

}

Object.assign(FileLoader.prototype, {

    load: function (url, onLoad, onProgress, onError) {

        if (url === undefined) url = '';

        if (this.path !== undefined) url = this.path + url;

        url = this.manager.resolveURL(url);

        var scope = this;

        var cached = Cache.get(url);

        if (cached !== undefined) {

            scope.manager.itemStart(url);

            setTimeout(function () {

                if (onLoad) onLoad(cached);

                scope.manager.itemEnd(url);

            }, 0);

            return cached;

        }

        // Check if request is duplicate

        if (loading[url] !== undefined) {

            loading[url].push({

                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError

            });

            return;

        }

        // Check for data: URI
        var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
        var dataUriRegexResult = url.match(dataUriRegex);

        // Safari can not handle Data URIs through XMLHttpRequest so process manually
        if (dataUriRegexResult) {

            var mimeType = dataUriRegexResult[1];
            var isBase64 = !!dataUriRegexResult[2];
            var data = dataUriRegexResult[3];

            data = window.decodeURIComponent(data);

            if (isBase64) data = window.atob(data);

            try {

                var response;
                var responseType = ( this.responseType || '' ).toLowerCase();

                switch (responseType) {

                    case 'arraybuffer':
                    case 'blob':

                        var view = new Uint8Array(data.length);

                        for (var i = 0; i < data.length; i++) {

                            view[i] = data.charCodeAt(i);

                        }

                        if (responseType === 'blob') {

                            response = new Blob([view.buffer], {type: mimeType});

                        } else {

                            response = view.buffer;

                        }

                        break;

                    case 'document':

                        var parser = new DOMParser();
                        response = parser.parseFromString(data, mimeType);

                        break;

                    case 'json':

                        response = JSON.parse(data);

                        break;

                    default: // 'text' or other

                        response = data;

                        break;

                }

                // Wait for next browser tick like standard XMLHttpRequest event dispatching does
                window.setTimeout(function () {

                    if (onLoad) onLoad(response);

                    scope.manager.itemEnd(url);

                }, 0);

            } catch (error) {

                // Wait for next browser tick like standard XMLHttpRequest event dispatching does
                window.setTimeout(function () {

                    if (onError) onError(error);

                    scope.manager.itemEnd(url);
                    scope.manager.itemError(url);

                }, 0);

            }

        } else {

            // Initialise array for duplicate requests

            loading[url] = [];

            loading[url].push({

                onLoad: onLoad,
                onProgress: onProgress,
                onError: onError

            });

            var request = new XMLHttpRequest();

            request.open('GET', url, true);

            request.addEventListener('load', function (event) {

                var response = this.response;

                Cache.add(url, response);

                var callbacks = loading[url];

                delete loading[url];

                if (this.status === 200 || this.status === 0) {

                    // Some browsers return HTTP Status 0 when using non-http protocol
                    // e.g. 'file://' or 'data://'. Handle as success.

                    if (this.status === 0) console.warn('THREE.FileLoader: HTTP Status 0 received.');

                    for (var i = 0, il = callbacks.length; i < il; i++) {

                        var callback = callbacks[i];
                        if (callback.onLoad) callback.onLoad(response);

                    }

                    scope.manager.itemEnd(url);

                } else {

                    for (var i = 0, il = callbacks.length; i < il; i++) {

                        var callback = callbacks[i];
                        if (callback.onError) callback.onError(event);

                    }

                    scope.manager.itemEnd(url);
                    scope.manager.itemError(url);

                }

            }, false);

            request.addEventListener('progress', function (event) {

                var callbacks = loading[url];

                for (var i = 0, il = callbacks.length; i < il; i++) {

                    var callback = callbacks[i];
                    if (callback.onProgress) callback.onProgress(event);

                }

            }, false);

            request.addEventListener('error', function (event) {

                var callbacks = loading[url];

                delete loading[url];

                for (var i = 0, il = callbacks.length; i < il; i++) {

                    var callback = callbacks[i];
                    if (callback.onError) callback.onError(event);

                }

                scope.manager.itemEnd(url);
                scope.manager.itemError(url);

            }, false);

            if (this.responseType !== undefined) request.responseType = this.responseType;
            if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;

            if (request.overrideMimeType) request.overrideMimeType(this.mimeType !== undefined ? this.mimeType : 'text/plain');

            for (var header in this.requestHeader) {

                request.setRequestHeader(header, this.requestHeader[header]);

            }

            request.send(null);

        }

        scope.manager.itemStart(url);

        return request;

    },

    setPath: function (value) {

        this.path = value;
        return this;

    },

    setResponseType: function (value) {

        this.responseType = value;
        return this;

    },

    setWithCredentials: function (value) {

        this.withCredentials = value;
        return this;

    },

    setMimeType: function (value) {

        this.mimeType = value;
        return this;

    },

    setRequestHeader: function (value) {

        this.requestHeader = value;
        return this;

    }

});


function Wrapper(load, entity) {
    load.load(entity.url, function (data) {
        //noinspection JSUnresolvedFunction
        entity.callback.call(entity, data);
    });
}

class Execute {
    constructor() {
        this.queue = [];
    }

    add(entity) {
        this.queue.push(entity)
    }

    execute(onFinishCallback, onError) {
        onError = onError || function (e) {
                console.warn(e);
            };
        let queue = this.queue;
        let allEntity = [];
        let onProgress = function (url, loaded, total) {
            if (loaded == total) {
                onFinishCallback(allEntity);
            }
        };
        let onLoad = function (a, b, c) {

        }
        let fLoad = new FileLoader(new LoadingManager(onLoad, onProgress, onError));
        while (queue.length > 0) {
            let entity = queue.shift();
            new Wrapper(fLoad, entity);
            allEntity.push(entity);
        }
    }

}


export {Execute,Cache}