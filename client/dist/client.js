(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Pandapush"] = factory();
	else
		root["Pandapush"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(1);

module.exports = function(parent, methods) {
  if (typeof parent !== 'function') {
    methods = parent;
    parent  = Object;
  }

  var klass = function() {
    if (!this.initialize) return this;
    return this.initialize.apply(this, arguments) || this;
  };

  var bridge = function() {};
  bridge.prototype = parent.prototype;

  klass.prototype = new bridge();
  extend(klass.prototype, methods);

  return klass;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function(dest, source, overwrite) {
  if (!source) return dest;
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    if (dest.hasOwnProperty(key) && overwrite === false) continue;
    if (dest[key] !== source[key])
      dest[key] = source[key];
  }
  return dest;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isURI: function(uri) {
    return uri && uri.protocol && uri.host && uri.path;
  },

  isSameOrigin: function(uri) {
    return uri.protocol === location.protocol &&
           uri.hostname === location.hostname &&
           uri.port     === location.port;
  },

  parse: function(url) {
    if (typeof url !== 'string') return url;
    var uri = {}, parts, query, pairs, i, n, data;

    var consume = function(name, pattern) {
      url = url.replace(pattern, function(match) {
        uri[name] = match;
        return '';
      });
      uri[name] = uri[name] || '';
    };

    consume('protocol', /^[a-z]+\:/i);
    consume('host',     /^\/\/[^\/\?#]+/);

    if (!/^\//.test(url) && !uri.host)
      url = location.pathname.replace(/[^\/]*$/, '') + url;

    consume('pathname', /^[^\?#]*/);
    consume('search',   /^\?[^#]*/);
    consume('hash',     /^#.*/);

    uri.protocol = uri.protocol || location.protocol;

    if (uri.host) {
      uri.host     = uri.host.substr(2);
      parts        = uri.host.split(':');
      uri.hostname = parts[0];
      uri.port     = parts[1] || '';
    } else {
      uri.host     = location.host;
      uri.hostname = location.hostname;
      uri.port     = location.port;
    }

    uri.pathname = uri.pathname || '/';
    uri.path = uri.pathname + uri.search;

    query = uri.search.replace(/^\?/, '');
    pairs = query ? query.split('&') : [];
    data  = {};

    for (i = 0, n = pairs.length; i < n; i++) {
      parts = pairs[i].split('=');
      data[decodeURIComponent(parts[0] || '')] = decodeURIComponent(parts[1] || '');
    }

    uri.query = data;

    uri.href = this.stringify(uri);
    return uri;
  },

  stringify: function(uri) {
    var string = uri.protocol + '//' + uri.hostname;
    if (uri.port) string += ':' + uri.port;
    string += uri.pathname + this.queryString(uri.query) + (uri.hash || '');
    return string;
  },

  queryString: function(query) {
    var pairs = [];
    for (var key in query) {
      if (!query.hasOwnProperty(key)) continue;
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
    }
    if (pairs.length === 0) return '';
    return '?' + pairs.join('&');
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var Class    = __webpack_require__(0),
    Cookie   = __webpack_require__(19).Cookie,
    Promise  = __webpack_require__(8),
    URI      = __webpack_require__(3),
    array    = __webpack_require__(10),
    extend   = __webpack_require__(1),
    Logging  = __webpack_require__(6),
    Timeouts = __webpack_require__(23),
    Channel  = __webpack_require__(14);

var Transport = extend(Class({ className: 'Transport',
  DEFAULT_PORTS: {'http:': 80, 'https:': 443, 'ws:': 80, 'wss:': 443},
  MAX_DELAY:     0,

  batching:  true,

  initialize: function(dispatcher, endpoint) {
    this._dispatcher = dispatcher;
    this.endpoint    = endpoint;
    this._outbox     = [];
    this._proxy      = extend({}, this._dispatcher.proxy);

    if (!this._proxy.origin)
      this._proxy.origin = this._findProxy();
  },

  close: function() {},

  encode: function(messages) {
    return '';
  },

  sendMessage: function(message) {
    this.debug('Client ? sending message to ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), message);

    if (!this.batching) return Promise.resolve(this.request([message]));

    this._outbox.push(message);
    this._flushLargeBatch();

    if (message.channel === Channel.HANDSHAKE)
      return this._publish(0.01);

    if (message.channel === Channel.CONNECT)
      this._connectMessage = message;

    return this._publish(this.MAX_DELAY);
  },

  _makePromise: function() {
    var self = this;

    this._requestPromise = this._requestPromise || new Promise(function(resolve) {
      self._resolvePromise = resolve;
    });
  },

  _publish: function(delay) {
    this._makePromise();

    this.addTimeout('publish', delay, function() {
      this._flush();
      delete this._requestPromise;
    }, this);

    return this._requestPromise;
  },

  _flush: function() {
    this.removeTimeout('publish');

    if (this._outbox.length > 1 && this._connectMessage)
      this._connectMessage.advice = {timeout: 0};

    this._resolvePromise(this.request(this._outbox));

    this._connectMessage = null;
    this._outbox = [];
  },

  _flushLargeBatch: function() {
    var string = this.encode(this._outbox);
    if (string.length < this._dispatcher.maxRequestSize) return;
    var last = this._outbox.pop();

    this._makePromise();
    this._flush();

    if (last) this._outbox.push(last);
  },

  _receive: function(replies) {
    if (!replies) return;
    replies = [].concat(replies);

    this.debug('Client ? received from ? via ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), this.connectionType, replies);

    for (var i = 0, n = replies.length; i < n; i++)
      this._dispatcher.handleResponse(replies[i]);
  },

  _handleError: function(messages, immediate) {
    messages = [].concat(messages);

    this.debug('Client ? failed to send to ? via ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), this.connectionType, messages);

    for (var i = 0, n = messages.length; i < n; i++)
      this._dispatcher.handleError(messages[i]);
  },

  _getCookies: function() {
    var cookies = this._dispatcher.cookies,
        url     = URI.stringify(this.endpoint);

    if (!cookies) return '';

    return array.map(cookies.getCookiesSync(url), function(cookie) {
      return cookie.cookieString();
    }).join('; ');
  },

  _storeCookies: function(setCookie) {
    var cookies = this._dispatcher.cookies,
        url     = URI.stringify(this.endpoint),
        cookie;

    if (!setCookie || !cookies) return;
    setCookie = [].concat(setCookie);

    for (var i = 0, n = setCookie.length; i < n; i++) {
      cookie = Cookie.parse(setCookie[i]);
      cookies.setCookieSync(cookie, url);
    }
  },

  _findProxy: function() {
    if (typeof process === 'undefined') return undefined;

    var protocol = this.endpoint.protocol;
    if (!protocol) return undefined;

    var name   = protocol.replace(/:$/, '').toLowerCase() + '_proxy',
        upcase = name.toUpperCase(),
        env    = process.env,
        keys, proxy;

    if (name === 'http_proxy' && env.REQUEST_METHOD) {
      keys = Object.keys(env).filter(function(k) { return /^http_proxy$/i.test(k) });
      if (keys.length === 1) {
        if (keys[0] === name && env[upcase] === undefined)
          proxy = env[name];
      } else if (keys.length > 1) {
        proxy = env[name];
      }
      proxy = proxy || env['CGI_' + upcase];
    } else {
      proxy = env[name] || env[upcase];
      if (proxy && !env[name])
        console.warn('The environment variable ' + upcase +
                     ' is discouraged. Use ' + name + '.');
    }
    return proxy;
  }

}), {
  get: function(dispatcher, allowed, disabled, callback, context) {
    var endpoint = dispatcher.endpoint;

    array.asyncEach(this._transports, function(pair, resume) {
      var connType     = pair[0], klass = pair[1],
          connEndpoint = dispatcher.endpointFor(connType);

      if (array.indexOf(disabled, connType) >= 0)
        return resume();

      if (array.indexOf(allowed, connType) < 0) {
        klass.isUsable(dispatcher, connEndpoint, function() {});
        return resume();
      }

      klass.isUsable(dispatcher, connEndpoint, function(isUsable) {
        if (!isUsable) return resume();
        var transport = klass.hasOwnProperty('create') ? klass.create(dispatcher, connEndpoint) : new klass(dispatcher, connEndpoint);
        callback.call(context, transport);
      });
    }, function() {
      throw new Error('Could not find a usable connection type for ' + URI.stringify(endpoint));
    });
  },

  register: function(type, klass) {
    this._transports.push([type, klass]);
    klass.prototype.connectionType = type;
  },

  getConnectionTypes: function() {
    return array.map(this._transports, function(t) { return t[0] });
  },

  _transports: []
});

extend(Transport.prototype, Logging);
extend(Transport.prototype, Timeouts);

module.exports = Transport;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Promise   = __webpack_require__(8);

module.exports = {
  then: function(callback, errback) {
    var self = this;
    if (!this._promise)
      this._promise = new Promise(function(resolve, reject) {
        self._resolve = resolve;
        self._reject  = reject;
      });

    if (arguments.length === 0)
      return this._promise;
    else
      return this._promise.then(callback, errback);
  },

  callback: function(callback, context) {
    return this.then(function(value) { callback.call(context, value) });
  },

  errback: function(callback, context) {
    return this.then(null, function(reason) { callback.call(context, reason) });
  },

  timeout: function(seconds, message) {
    this.then();
    var self = this;
    this._timer = global.setTimeout(function() {
      self._reject(message);
    }, seconds * 1000);
  },

  setDeferredStatus: function(status, value) {
    if (this._timer) global.clearTimeout(this._timer);

    this.then();

    if (status === 'succeeded')
      this._resolve(value);
    else if (status === 'failed')
      this._reject(value);
    else
      delete this._promise;
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toJSON = __webpack_require__(7);

var Logging = {
  LOG_LEVELS: {
    fatal:  4,
    error:  3,
    warn:   2,
    info:   1,
    debug:  0
  },

  writeLog: function(messageArgs, level) {
    var logger = Logging.logger || (Logging.wrapper || Logging).logger;
    if (!logger) return;

    var args   = Array.prototype.slice.apply(messageArgs),
        banner = '[Faye',
        klass  = this.className,

        message = args.shift().replace(/\?/g, function() {
          try {
            return toJSON(args.shift());
          } catch (error) {
            return '[Object]';
          }
        });

    if (klass) banner += '.' + klass;
    banner += '] ';

    if (typeof logger[level] === 'function')
      logger[level](banner + message);
    else if (typeof logger === 'function')
      logger(banner + message);
  }
};

for (var key in Logging.LOG_LEVELS)
  (function(level) {
    Logging[level] = function() {
      this.writeLog(arguments, level);
    };
  })(key);

module.exports = Logging;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/

module.exports = function(object) {
  return JSON.stringify(object, function(key, value) {
    return (this[key] instanceof Array) ? this[key] : value;
  });
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(13);

var PENDING   = 0,
    FULFILLED = 1,
    REJECTED  = 2;

var RETURN = function(x) { return x },
    THROW  = function(x) { throw  x };

var Promise = function(task) {
  this._state       = PENDING;
  this._onFulfilled = [];
  this._onRejected  = [];

  if (typeof task !== 'function') return;
  var self = this;

  task(function(value)  { resolve(self, value) },
       function(reason) { reject(self, reason) });
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var next = new Promise();
  registerOnFulfilled(this, onFulfilled, next);
  registerOnRejected(this, onRejected, next);
  return next;
};

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

var registerOnFulfilled = function(promise, onFulfilled, next) {
  if (typeof onFulfilled !== 'function') onFulfilled = RETURN;
  var handler = function(value) { invoke(onFulfilled, value, next) };

  if (promise._state === PENDING) {
    promise._onFulfilled.push(handler);
  } else if (promise._state === FULFILLED) {
    handler(promise._value);
  }
};

var registerOnRejected = function(promise, onRejected, next) {
  if (typeof onRejected !== 'function') onRejected = THROW;
  var handler = function(reason) { invoke(onRejected, reason, next) };

  if (promise._state === PENDING) {
    promise._onRejected.push(handler);
  } else if (promise._state === REJECTED) {
    handler(promise._reason);
  }
};

var invoke = function(fn, value, next) {
  asap(function() { _invoke(fn, value, next) });
};

var _invoke = function(fn, value, next) {
  var outcome;

  try {
    outcome = fn(value);
  } catch (error) {
    return reject(next, error);
  }

  if (outcome === next) {
    reject(next, new TypeError('Recursive promise chain detected'));
  } else {
    resolve(next, outcome);
  }
};

var resolve = function(promise, value) {
  var called = false, type, then;

  try {
    type = typeof value;
    then = value !== null && (type === 'function' || type === 'object') && value.then;

    if (typeof then !== 'function') return fulfill(promise, value);

    then.call(value, function(v) {
      if (!(called ^ (called = true))) return;
      resolve(promise, v);
    }, function(r) {
      if (!(called ^ (called = true))) return;
      reject(promise, r);
    });
  } catch (error) {
    if (!(called ^ (called = true))) return;
    reject(promise, error);
  }
};

var fulfill = function(promise, value) {
  if (promise._state !== PENDING) return;

  promise._state      = FULFILLED;
  promise._value      = value;
  promise._onRejected = [];

  var onFulfilled = promise._onFulfilled, fn;
  while (fn = onFulfilled.shift()) fn(value);
};

var reject = function(promise, reason) {
  if (promise._state !== PENDING) return;

  promise._state       = REJECTED;
  promise._reason      = reason;
  promise._onFulfilled = [];

  var onRejected = promise._onRejected, fn;
  while (fn = onRejected.shift()) fn(reason);
};

Promise.resolve = function(value) {
  return new Promise(function(resolve, reject) { resolve(value) });
};

Promise.reject = function(reason) {
  return new Promise(function(resolve, reject) { reject(reason) });
};

Promise.all = function(promises) {
  return new Promise(function(resolve, reject) {
    var list = [], n = promises.length, i;

    if (n === 0) return resolve(list);

    for (i = 0; i < n; i++) (function(promise, i) {
      Promise.resolve(promise).then(function(value) {
        list[i] = value;
        if (--n === 0) resolve(list);
      }, reject);
    })(promises[i], i);
  });
};

Promise.race = function(promises) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, n = promises.length; i < n; i++)
      Promise.resolve(promises[i]).then(resolve, reject);
  });
};

Promise.deferred = Promise.pending = function() {
  var tuple = {};

  tuple.promise = new Promise(function(resolve, reject) {
    tuple.resolve = resolve;
    tuple.reject  = reject;
  });
  return tuple;
};

module.exports = Promise;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend       = __webpack_require__(1),
    EventEmitter = __webpack_require__(35);

var Publisher = {
  countListeners: function(eventType) {
    return this.listeners(eventType).length;
  },

  bind: function(eventType, listener, context) {
    var slice   = Array.prototype.slice,
        handler = function() { listener.apply(context, slice.call(arguments)) };

    this._listeners = this._listeners || [];
    this._listeners.push([eventType, listener, context, handler]);
    return this.on(eventType, handler);
  },

  unbind: function(eventType, listener, context) {
    this._listeners = this._listeners || [];
    var n = this._listeners.length, tuple;

    while (n--) {
      tuple = this._listeners[n];
      if (tuple[0] !== eventType) continue;
      if (listener && (tuple[1] !== listener || tuple[2] !== context)) continue;
      this._listeners.splice(n, 1);
      this.removeListener(eventType, tuple[3]);
    }
  }
};

extend(Publisher, EventEmitter.prototype);
Publisher.trigger = Publisher.emit;

module.exports = Publisher;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  commonElement: function(lista, listb) {
    for (var i = 0, n = lista.length; i < n; i++) {
      if (this.indexOf(listb, lista[i]) !== -1)
        return lista[i];
    }
    return null;
  },

  indexOf: function(list, needle) {
    if (list.indexOf) return list.indexOf(needle);

    for (var i = 0, n = list.length; i < n; i++) {
      if (list[i] === needle) return i;
    }
    return -1;
  },

  map: function(object, callback, context) {
    if (object.map) return object.map(callback, context);
    var result = [];

    if (object instanceof Array) {
      for (var i = 0, n = object.length; i < n; i++) {
        result.push(callback.call(context || null, object[i], i));
      }
    } else {
      for (var key in object) {
        if (!object.hasOwnProperty(key)) continue;
        result.push(callback.call(context || null, key, object[key]));
      }
    }
    return result;
  },

  filter: function(array, callback, context) {
    if (array.filter) return array.filter(callback, context);
    var result = [];
    for (var i = 0, n = array.length; i < n; i++) {
      if (callback.call(context || null, array[i], i))
        result.push(array[i]);
    }
    return result;
  },

  asyncEach: function(list, iterator, callback, context) {
    var n       = list.length,
        i       = -1,
        calls   = 0,
        looping = false;

    var iterate = function() {
      calls -= 1;
      i += 1;
      if (i === n) return callback && callback.call(context);
      iterator(list[i], resume);
    };

    var loop = function() {
      if (looping) return;
      looping = true;
      while (calls > 0) iterate();
      looping = false;
    };

    var resume = function() {
      calls += 1;
      loop();
    };
    resume();
  }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Event = {
  _registry: [],

  on: function(element, eventName, callback, context) {
    var wrapped = function() { callback.call(context) };

    if (element.addEventListener)
      element.addEventListener(eventName, wrapped, false);
    else
      element.attachEvent('on' + eventName, wrapped);

    this._registry.push({
      _element:   element,
      _type:      eventName,
      _callback:  callback,
      _context:     context,
      _handler:   wrapped
    });
  },

  detach: function(element, eventName, callback, context) {
    var i = this._registry.length, register;
    while (i--) {
      register = this._registry[i];

      if ((element    && element    !== register._element)  ||
          (eventName  && eventName  !== register._type)     ||
          (callback   && callback   !== register._callback) ||
          (context    && context    !== register._context))
        continue;

      if (register._element.removeEventListener)
        register._element.removeEventListener(register._type, register._handler, false);
      else
        register._element.detachEvent('on' + register._type, register._handler);

      this._registry.splice(i,1);
      register = null;
    }
  }
};

if (global.onunload !== undefined)
  Event.on(global, 'unload', Event.detach, Event);

module.exports = {
  Event: Event
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var copyObject = function(object) {
  var clone, i, key;
  if (object instanceof Array) {
    clone = [];
    i = object.length;
    while (i--) clone[i] = copyObject(object[i]);
    return clone;
  } else if (typeof object === 'object') {
    clone = (object === null) ? null : {};
    for (key in object) clone[key] = copyObject(object[key]);
    return clone;
  } else {
    return object;
  }
};

module.exports = copyObject;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

"use strict";
throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/usr/src/app/node_modules/asap/browser-asap.js'\n    at Error (native)");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class     = __webpack_require__(0),
    extend    = __webpack_require__(1),
    Publisher = __webpack_require__(9),
    Grammar   = __webpack_require__(15);

var Channel = Class({
  initialize: function(name) {
    this.id = this.name = name;
  },

  push: function(message) {
    this.trigger('message', message);
  },

  isUnused: function() {
    return this.countListeners('message') === 0;
  }
});

extend(Channel.prototype, Publisher);

extend(Channel, {
  HANDSHAKE:    '/meta/handshake',
  CONNECT:      '/meta/connect',
  SUBSCRIBE:    '/meta/subscribe',
  UNSUBSCRIBE:  '/meta/unsubscribe',
  DISCONNECT:   '/meta/disconnect',

  META:         'meta',
  SERVICE:      'service',

  expand: function(name) {
    var segments = this.parse(name),
        channels = ['/**', name];

    var copy = segments.slice();
    copy[copy.length - 1] = '*';
    channels.push(this.unparse(copy));

    for (var i = 1, n = segments.length; i < n; i++) {
      copy = segments.slice(0, i);
      copy.push('**');
      channels.push(this.unparse(copy));
    }

    return channels;
  },

  isValid: function(name) {
    return Grammar.CHANNEL_NAME.test(name) ||
           Grammar.CHANNEL_PATTERN.test(name);
  },

  parse: function(name) {
    if (!this.isValid(name)) return null;
    return name.split('/').slice(1);
  },

  unparse: function(segments) {
    return '/' + segments.join('/');
  },

  isMeta: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.META) : null;
  },

  isService: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.SERVICE) : null;
  },

  isSubscribable: function(name) {
    if (!this.isValid(name)) return null;
    return !this.isMeta(name) && !this.isService(name);
  },

  Set: Class({
    initialize: function() {
      this._channels = {};
    },

    getKeys: function() {
      var keys = [];
      for (var key in this._channels) keys.push(key);
      return keys;
    },

    remove: function(name) {
      delete this._channels[name];
    },

    hasSubscription: function(name) {
      return this._channels.hasOwnProperty(name);
    },

    subscribe: function(names, subscription) {
      var name;
      for (var i = 0, n = names.length; i < n; i++) {
        name = names[i];
        var channel = this._channels[name] = this._channels[name] || new Channel(name);
        channel.bind('message', subscription);
      }
    },

    unsubscribe: function(name, subscription) {
      var channel = this._channels[name];
      if (!channel) return false;
      channel.unbind('message', subscription);

      if (channel.isUnused()) {
        this.remove(name);
        return true;
      } else {
        return false;
      }
    },

    distributeMessage: function(message) {
      var channels = Channel.expand(message.channel);

      for (var i = 0, n = channels.length; i < n; i++) {
        var channel = this._channels[channels[i]];
        if (channel) channel.trigger('message', message);
      }
    }
  })
});

module.exports = Channel;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
  CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
  ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
  VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(1);

var Scheduler = function(message, options) {
  this.message  = message;
  this.options  = options;
  this.attempts = 0;
};

extend(Scheduler.prototype, {
  getTimeout: function() {
    return this.options.timeout;
  },

  getInterval: function() {
    return this.options.interval;
  },

  isDeliverable: function() {
    var attempts = this.options.attempts,
        made     = this.attempts,
        deadline = this.options.deadline,
        now      = new Date().getTime();

    if (attempts !== undefined && made >= attempts)
      return false;

    if (deadline !== undefined && now > deadline)
      return false;

    return true;
  },

  send: function() {
    this.attempts += 1;
  },

  succeed: function() {},

  fail: function() {},

  abort: function() {}
});

module.exports = Scheduler;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(0),
    URI       = __webpack_require__(3),
    browser   = __webpack_require__(11),
    extend    = __webpack_require__(1),
    toJSON    = __webpack_require__(7),
    Transport = __webpack_require__(4);

var XHR = extend(Class(Transport, {
  encode: function(messages) {
    return toJSON(messages);
  },

  request: function(messages) {
    var href = this.endpoint.href,
        self = this,
        xhr;

    // Prefer XMLHttpRequest over ActiveXObject if they both exist
    if (global.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (global.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
      return this._handleError(messages);
    }

    xhr.open('POST', href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    var headers = this._dispatcher.headers;
    for (var key in headers) {
      if (!headers.hasOwnProperty(key)) continue;
      xhr.setRequestHeader(key, headers[key]);
    }

    var abort = function() { xhr.abort() };
    if (global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', abort);

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== 4) return;

      var replies    = null,
          status     = xhr.status,
          text       = xhr.responseText,
          successful = (status >= 200 && status < 300) || status === 304 || status === 1223;

      if (global.onbeforeunload !== undefined)
        browser.Event.detach(global, 'beforeunload', abort);

      xhr.onreadystatechange = function() {};
      xhr = null;

      if (!successful) return self._handleError(messages);

      try {
        replies = JSON.parse(text);
      } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var usable = (navigator.product === 'ReactNative')
              || URI.isSameOrigin(endpoint);

    callback.call(context, usable);
  }
});

module.exports = XHR;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {
  VERSION:          '1.2.4',

  BAYEUX_VERSION:   '1.0',
  ID_LENGTH:        160,
  JSONP_CALLBACK:   'jsonpcallback',
  CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

  MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process']
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class = __webpack_require__(0);

module.exports = Class({
  initialize: function() {
    this._index = {};
  },

  add: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    if (this._index.hasOwnProperty(key)) return false;
    this._index[key] = item;
    return true;
  },

  forEach: function(block, context) {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key))
        block.call(context, this._index[key]);
    }
  },

  isEmpty: function() {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key)) return false;
    }
    return true;
  },

  member: function(item) {
    for (var key in this._index) {
      if (this._index[key] === item) return true;
    }
    return false;
  },

  remove: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    var removed = this._index[key];
    delete this._index[key];
    return removed;
  },

  toArray: function() {
    var array = [];
    this.forEach(function(item) { array.push(item) });
    return array;
  }
});


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constants = __webpack_require__(18),
    Logging   = __webpack_require__(6);

var Faye = {
  VERSION:    constants.VERSION,

  Client:     __webpack_require__(24),
  Scheduler:  __webpack_require__(16)
};

Logging.wrapper = Faye;

module.exports = Faye;


/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = {
  addTimeout: function(name, delay, callback, context) {
    this._timeouts = this._timeouts || {};
    if (this._timeouts.hasOwnProperty(name)) return;
    var self = this;
    this._timeouts[name] = global.setTimeout(function() {
      delete self._timeouts[name];
      callback.call(context);
    }, 1000 * delay);
  },

  removeTimeout: function(name) {
    this._timeouts = this._timeouts || {};
    var timeout = this._timeouts[name];
    if (!timeout) return;
    global.clearTimeout(timeout);
    delete this._timeouts[name];
  },

  removeAllTimeouts: function() {
    this._timeouts = this._timeouts || {};
    for (var name in this._timeouts) this.removeTimeout(name);
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var asap            = __webpack_require__(13),
    Class           = __webpack_require__(0),
    Promise         = __webpack_require__(8),
    URI             = __webpack_require__(3),
    array           = __webpack_require__(10),
    browser         = __webpack_require__(11),
    constants       = __webpack_require__(18),
    extend          = __webpack_require__(1),
    validateOptions = __webpack_require__(36),
    Deferrable      = __webpack_require__(5),
    Logging         = __webpack_require__(6),
    Publisher       = __webpack_require__(9),
    Channel         = __webpack_require__(14),
    Dispatcher      = __webpack_require__(25),
    Error           = __webpack_require__(26),
    Extensible      = __webpack_require__(27),
    Publication     = __webpack_require__(28),
    Subscription    = __webpack_require__(29);

var Client = Class({ className: 'Client',
  UNCONNECTED:        1,
  CONNECTING:         2,
  CONNECTED:          3,
  DISCONNECTED:       4,

  HANDSHAKE:          'handshake',
  RETRY:              'retry',
  NONE:               'none',

  CONNECTION_TIMEOUT: 60,

  DEFAULT_ENDPOINT:   '/bayeux',
  INTERVAL:           0,

  initialize: function(endpoint, options) {
    this.info('New client created for ?', endpoint);
    options = options || {};

    validateOptions(options, ['interval', 'timeout', 'endpoints', 'proxy', 'retry', 'scheduler', 'websocketExtensions', 'tls', 'ca']);

    this._channels   = new Channel.Set();
    this._dispatcher = Dispatcher.create(this, endpoint || this.DEFAULT_ENDPOINT, options);

    this._messageId = 0;
    this._state     = this.UNCONNECTED;

    this._responseCallbacks = {};

    this._advice = {
      reconnect: this.RETRY,
      interval:  1000 * (options.interval || this.INTERVAL),
      timeout:   1000 * (options.timeout  || this.CONNECTION_TIMEOUT)
    };
    this._dispatcher.timeout = this._advice.timeout / 1000;

    this._dispatcher.bind('message', this._receiveMessage, this);

    if (browser.Event && global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', function() {
        if (array.indexOf(this._dispatcher._disabled, 'autodisconnect') < 0)
          this.disconnect();
      }, this);
  },

  addWebsocketExtension: function(extension) {
    return this._dispatcher.addWebsocketExtension(extension);
  },

  disable: function(feature) {
    return this._dispatcher.disable(feature);
  },

  setHeader: function(name, value) {
    return this._dispatcher.setHeader(name, value);
  },

  // Request
  // MUST include:  * channel
  //                * version
  //                * supportedConnectionTypes
  // MAY include:   * minimumVersion
  //                * ext
  //                * id
  //
  // Success Response                             Failed Response
  // MUST include:  * channel                     MUST include:  * channel
  //                * version                                    * successful
  //                * supportedConnectionTypes                   * error
  //                * clientId                    MAY include:   * supportedConnectionTypes
  //                * successful                                 * advice
  // MAY include:   * minimumVersion                             * version
  //                * advice                                     * minimumVersion
  //                * ext                                        * ext
  //                * id                                         * id
  //                * authSuccessful
  handshake: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state !== this.UNCONNECTED) return;

    this._state = this.CONNECTING;
    var self = this;

    this.info('Initiating handshake with ?', URI.stringify(this._dispatcher.endpoint));
    this._dispatcher.selectTransport(constants.MANDATORY_CONNECTION_TYPES);

    this._sendMessage({
      channel:                  Channel.HANDSHAKE,
      version:                  constants.BAYEUX_VERSION,
      supportedConnectionTypes: this._dispatcher.getConnectionTypes()

    }, {}, function(response) {

      if (response.successful) {
        this._state = this.CONNECTED;
        this._dispatcher.clientId  = response.clientId;

        this._dispatcher.selectTransport(response.supportedConnectionTypes);

        this.info('Handshake successful: ?', this._dispatcher.clientId);

        this.subscribe(this._channels.getKeys(), true);
        if (callback) asap(function() { callback.call(context) });

      } else {
        this.info('Handshake unsuccessful');
        global.setTimeout(function() { self.handshake(callback, context) }, this._dispatcher.retry * 1000);
        this._state = this.UNCONNECTED;
      }
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * connectionType                     * clientId
  // MAY include:   * ext                 MAY include:   * error
  //                * id                                 * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  connect: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state === this.DISCONNECTED) return;

    if (this._state === this.UNCONNECTED)
      return this.handshake(function() { this.connect(callback, context) }, this);

    this.callback(callback, context);
    if (this._state !== this.CONNECTED) return;

    this.info('Calling deferred actions for ?', this._dispatcher.clientId);
    this.setDeferredStatus('succeeded');
    this.setDeferredStatus('unknown');

    if (this._connectRequest) return;
    this._connectRequest = true;

    this.info('Initiating connection for ?', this._dispatcher.clientId);

    this._sendMessage({
      channel:        Channel.CONNECT,
      clientId:       this._dispatcher.clientId,
      connectionType: this._dispatcher.connectionType

    }, {}, this._cycleConnection, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  // MAY include:   * ext                                * clientId
  //                * id                  MAY include:   * error
  //                                                     * ext
  //                                                     * id
  disconnect: function() {
    if (this._state !== this.CONNECTED) return;
    this._state = this.DISCONNECTED;

    this.info('Disconnecting ?', this._dispatcher.clientId);
    var promise = new Publication();

    this._sendMessage({
      channel:  Channel.DISCONNECT,
      clientId: this._dispatcher.clientId

    }, {}, function(response) {
      if (response.successful) {
        this._dispatcher.close();
        promise.setDeferredStatus('succeeded');
      } else {
        promise.setDeferredStatus('failed', Error.parse(response.error));
      }
    }, this);

    this.info('Clearing channel listeners for ?', this._dispatcher.clientId);
    this._channels = new Channel.Set();

    return promise;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  subscribe: function(channel, callback, context) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.subscribe(c, callback, context);
      }, this);

    var subscription = new Subscription(this, channel, callback, context),
        force        = (callback === true),
        hasSubscribe = this._channels.hasSubscription(channel);

    if (hasSubscribe && !force) {
      this._channels.subscribe([channel], subscription);
      subscription.setDeferredStatus('succeeded');
      return subscription;
    }

    this.connect(function() {
      this.info('Client ? attempting to subscribe to ?', this._dispatcher.clientId, channel);
      if (!force) this._channels.subscribe([channel], subscription);

      this._sendMessage({
        channel:      Channel.SUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) {
          subscription.setDeferredStatus('failed', Error.parse(response.error));
          return this._channels.unsubscribe(channel, subscription);
        }

        var channels = [].concat(response.subscription);
        this.info('Subscription acknowledged for ? to ?', this._dispatcher.clientId, channels);
        subscription.setDeferredStatus('succeeded');
      }, this);
    }, this);

    return subscription;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  unsubscribe: function(channel, subscription) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.unsubscribe(c, subscription);
      }, this);

    var dead = this._channels.unsubscribe(channel, subscription);
    if (!dead) return;

    this.connect(function() {
      this.info('Client ? attempting to unsubscribe from ?', this._dispatcher.clientId, channel);

      this._sendMessage({
        channel:      Channel.UNSUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) return;

        var channels = [].concat(response.subscription);
        this.info('Unsubscription acknowledged for ? from ?', this._dispatcher.clientId, channels);
      }, this);
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * data                               * successful
  // MAY include:   * clientId            MAY include:   * id
  //                * id                                 * error
  //                * ext                                * ext
  publish: function(channel, data, options) {
    validateOptions(options || {}, ['attempts', 'deadline']);
    var publication = new Publication();

    this.connect(function() {
      this.info('Client ? queueing published message to ?: ?', this._dispatcher.clientId, channel, data);

      this._sendMessage({
        channel:  channel,
        data:     data,
        clientId: this._dispatcher.clientId

      }, options, function(response) {
        if (response.successful)
          publication.setDeferredStatus('succeeded');
        else
          publication.setDeferredStatus('failed', Error.parse(response.error));
      }, this);
    }, this);

    return publication;
  },

  _sendMessage: function(message, options, callback, context) {
    message.id = this._generateMessageId();

    var timeout = this._advice.timeout
                ? 1.2 * this._advice.timeout / 1000
                : 1.2 * this._dispatcher.retry;

    this.pipeThroughExtensions('outgoing', message, null, function(message) {
      if (!message) return;
      if (callback) this._responseCallbacks[message.id] = [callback, context];
      this._dispatcher.sendMessage(message, timeout, options || {});
    }, this);
  },

  _generateMessageId: function() {
    this._messageId += 1;
    if (this._messageId >= Math.pow(2,32)) this._messageId = 0;
    return this._messageId.toString(36);
  },

  _receiveMessage: function(message) {
    var id = message.id, callback;

    if (message.successful !== undefined) {
      callback = this._responseCallbacks[id];
      delete this._responseCallbacks[id];
    }

    this.pipeThroughExtensions('incoming', message, null, function(message) {
      if (!message) return;
      if (message.advice) this._handleAdvice(message.advice);
      this._deliverMessage(message);
      if (callback) callback[0].call(callback[1], message);
    }, this);
  },

  _handleAdvice: function(advice) {
    extend(this._advice, advice);
    this._dispatcher.timeout = this._advice.timeout / 1000;

    if (this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED) {
      this._state = this.UNCONNECTED;
      this._dispatcher.clientId = null;
      this._cycleConnection();
    }
  },

  _deliverMessage: function(message) {
    if (!message.channel || message.data === undefined) return;
    this.info('Client ? calling listeners for ? with ?', this._dispatcher.clientId, message.channel, message.data);
    this._channels.distributeMessage(message);
  },

  _cycleConnection: function() {
    if (this._connectRequest) {
      this._connectRequest = null;
      this.info('Closed connection for ?', this._dispatcher.clientId);
    }
    var self = this;
    global.setTimeout(function() { self.connect() }, this._advice.interval);
  }
});

extend(Client.prototype, Deferrable);
extend(Client.prototype, Publisher);
extend(Client.prototype, Logging);
extend(Client.prototype, Extensible);

module.exports = Client;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(0),
    URI       = __webpack_require__(3),
    cookies   = __webpack_require__(19),
    extend    = __webpack_require__(1),
    Logging   = __webpack_require__(6),
    Publisher = __webpack_require__(9),
    Transport = __webpack_require__(30),
    Scheduler = __webpack_require__(16);

var Dispatcher = Class({ className: 'Dispatcher',
  MAX_REQUEST_SIZE: 2048,
  DEFAULT_RETRY:    5,

  UP:   1,
  DOWN: 2,

  initialize: function(client, endpoint, options) {
    this._client     = client;
    this.endpoint    = URI.parse(endpoint);
    this._alternates = options.endpoints || {};

    this.cookies      = cookies.CookieJar && new cookies.CookieJar();
    this._disabled    = [];
    this._envelopes   = {};
    this.headers      = {};
    this.retry        = options.retry || this.DEFAULT_RETRY;
    this._scheduler   = options.scheduler || Scheduler;
    this._state       = 0;
    this.transports   = {};
    this.wsExtensions = [];

    this.proxy = options.proxy || {};
    if (typeof this._proxy === 'string') this._proxy = {origin: this._proxy};

    var exts = options.websocketExtensions;
    if (exts) {
      exts = [].concat(exts);
      for (var i = 0, n = exts.length; i < n; i++)
        this.addWebsocketExtension(exts[i]);
    }

    this.tls = options.tls || {};
    this.tls.ca = this.tls.ca || options.ca;

    for (var type in this._alternates)
      this._alternates[type] = URI.parse(this._alternates[type]);

    this.maxRequestSize = this.MAX_REQUEST_SIZE;
  },

  endpointFor: function(connectionType) {
    return this._alternates[connectionType] || this.endpoint;
  },

  addWebsocketExtension: function(extension) {
    this.wsExtensions.push(extension);
  },

  disable: function(feature) {
    this._disabled.push(feature);
  },

  setHeader: function(name, value) {
    this.headers[name] = value;
  },

  close: function() {
    var transport = this._transport;
    delete this._transport;
    if (transport) transport.close();
  },

  getConnectionTypes: function() {
    return Transport.getConnectionTypes();
  },

  selectTransport: function(transportTypes) {
    Transport.get(this, transportTypes, this._disabled, function(transport) {
      this.debug('Selected ? transport for ?', transport.connectionType, URI.stringify(transport.endpoint));

      if (transport === this._transport) return;
      if (this._transport) this._transport.close();

      this._transport = transport;
      this.connectionType = transport.connectionType;
    }, this);
  },

  sendMessage: function(message, timeout, options) {
    options = options || {};

    var id       = message.id,
        attempts = options.attempts,
        deadline = options.deadline && new Date().getTime() + (options.deadline * 1000),
        envelope = this._envelopes[id],
        scheduler;

    if (!envelope) {
      scheduler = new this._scheduler(message, {timeout: timeout, interval: this.retry, attempts: attempts, deadline: deadline});
      envelope  = this._envelopes[id] = {message: message, scheduler: scheduler};
    }

    this._sendEnvelope(envelope);
  },

  _sendEnvelope: function(envelope) {
    if (!this._transport) return;
    if (envelope.request || envelope.timer) return;

    var message   = envelope.message,
        scheduler = envelope.scheduler,
        self      = this;

    if (!scheduler.isDeliverable()) {
      scheduler.abort();
      delete this._envelopes[message.id];
      return;
    }

    envelope.timer = global.setTimeout(function() {
      self.handleError(message);
    }, scheduler.getTimeout() * 1000);

    scheduler.send();
    envelope.request = this._transport.sendMessage(message);
  },

  handleResponse: function(reply) {
    var envelope = this._envelopes[reply.id];

    if (reply.successful !== undefined && envelope) {
      envelope.scheduler.succeed();
      delete this._envelopes[reply.id];
      global.clearTimeout(envelope.timer);
    }

    this.trigger('message', reply);

    if (this._state === this.UP) return;
    this._state = this.UP;
    this._client.trigger('transport:up');
  },

  handleError: function(message, immediate) {
    var envelope = this._envelopes[message.id],
        request  = envelope && envelope.request,
        self     = this;

    if (!request) return;

    request.then(function(req) {
      if (req && req.abort) req.abort();
    });

    var scheduler = envelope.scheduler;
    scheduler.fail();

    global.clearTimeout(envelope.timer);
    envelope.request = envelope.timer = null;

    if (immediate) {
      this._sendEnvelope(envelope);
    } else {
      envelope.timer = global.setTimeout(function() {
        envelope.timer = null;
        self._sendEnvelope(envelope);
      }, scheduler.getInterval() * 1000);
    }

    if (this._state === this.DOWN) return;
    this._state = this.DOWN;
    this._client.trigger('transport:down');
  }
});

Dispatcher.create = function(client, endpoint, options) {
  return new Dispatcher(client, endpoint, options);
};

extend(Dispatcher.prototype, Publisher);
extend(Dispatcher.prototype, Logging);

module.exports = Dispatcher;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class   = __webpack_require__(0),
    Grammar = __webpack_require__(15);

var Error = Class({
  initialize: function(code, params, message) {
    this.code    = code;
    this.params  = Array.prototype.slice.call(params);
    this.message = message;
  },

  toString: function() {
    return this.code + ':' +
           this.params.join(',') + ':' +
           this.message;
  }
});

Error.parse = function(message) {
  message = message || '';
  if (!Grammar.ERROR.test(message)) return new Error(null, [], message);

  var parts   = message.split(':'),
      code    = parseInt(parts[0]),
      params  = parts[1].split(','),
      message = parts[2];

  return new Error(code, params, message);
};

// http://code.google.com/p/cometd/wiki/BayeuxCodes
var errors = {
  versionMismatch:  [300, 'Version mismatch'],
  conntypeMismatch: [301, 'Connection types not supported'],
  extMismatch:      [302, 'Extension mismatch'],
  badRequest:       [400, 'Bad request'],
  clientUnknown:    [401, 'Unknown client'],
  parameterMissing: [402, 'Missing required parameter'],
  channelForbidden: [403, 'Forbidden channel'],
  channelUnknown:   [404, 'Unknown channel'],
  channelInvalid:   [405, 'Invalid channel'],
  extUnknown:       [406, 'Unknown extension'],
  publishFailed:    [407, 'Failed to publish'],
  serverError:      [500, 'Internal server error']
};

for (var name in errors)
  (function(name) {
    Error[name] = function() {
      return new Error(errors[name][0], arguments, errors[name][1]).toString();
    };
  })(name);

module.exports = Error;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend  = __webpack_require__(1),
    Logging = __webpack_require__(6);

var Extensible = {
  addExtension: function(extension) {
    this._extensions = this._extensions || [];
    this._extensions.push(extension);
    if (extension.added) extension.added(this);
  },

  removeExtension: function(extension) {
    if (!this._extensions) return;
    var i = this._extensions.length;
    while (i--) {
      if (this._extensions[i] !== extension) continue;
      this._extensions.splice(i,1);
      if (extension.removed) extension.removed(this);
    }
  },

  pipeThroughExtensions: function(stage, message, request, callback, context) {
    this.debug('Passing through ? extensions: ?', stage, message);

    if (!this._extensions) return callback.call(context, message);
    var extensions = this._extensions.slice();

    var pipe = function(message) {
      if (!message) return callback.call(context, message);

      var extension = extensions.shift();
      if (!extension) return callback.call(context, message);

      var fn = extension[stage];
      if (!fn) return pipe(message);

      if (fn.length >= 3) extension[stage](message, request, pipe);
      else                extension[stage](message, pipe);
    };
    pipe(message);
  }
};

extend(Extensible, Logging);

module.exports = Extensible;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class      = __webpack_require__(0),
    Deferrable = __webpack_require__(5);

module.exports = Class(Deferrable);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class      = __webpack_require__(0),
    extend     = __webpack_require__(1),
    Deferrable = __webpack_require__(5);

var Subscription = Class({
  initialize: function(client, channels, callback, context) {
    this._client    = client;
    this._channels  = channels;
    this._callback  = callback;
    this._context   = context;
    this._cancelled = false;
  },

  withChannel: function(callback, context) {
    this._withChannel = [callback, context];
    return this;
  },

  apply: function(context, args) {
    var message = args[0];

    if (this._callback)
      this._callback.call(this._context, message.data);

    if (this._withChannel)
      this._withChannel[0].call(this._withChannel[1], message.channel, message.data);
  },

  cancel: function() {
    if (this._cancelled) return;
    this._client.unsubscribe(this._channels, this);
    this._cancelled = true;
  },

  unsubscribe: function() {
    this.cancel();
  }
});

extend(Subscription.prototype, Deferrable);

module.exports = Subscription;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Transport = __webpack_require__(4);

Transport.register('websocket', __webpack_require__(34));
Transport.register('eventsource', __webpack_require__(32));
Transport.register('long-polling', __webpack_require__(17));
Transport.register('cross-origin-long-polling', __webpack_require__(31));
Transport.register('callback-polling', __webpack_require__(33));

module.exports = Transport;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(0),
    Set       = __webpack_require__(20),
    URI       = __webpack_require__(3),
    extend    = __webpack_require__(1),
    toJSON    = __webpack_require__(7),
    Transport = __webpack_require__(4);

var CORS = extend(Class(Transport, {
  encode: function(messages) {
    return 'message=' + encodeURIComponent(toJSON(messages));
  },

  request: function(messages) {
    var xhrClass = global.XDomainRequest ? XDomainRequest : XMLHttpRequest,
        xhr      = new xhrClass(),
        id       = ++CORS._id,
        headers  = this._dispatcher.headers,
        self     = this,
        key;

    xhr.open('POST', URI.stringify(this.endpoint), true);

    if (xhr.setRequestHeader) {
      xhr.setRequestHeader('Pragma', 'no-cache');
      for (key in headers) {
        if (!headers.hasOwnProperty(key)) continue;
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    var cleanUp = function() {
      if (!xhr) return false;
      CORS._pending.remove(id);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onprogress = null;
      xhr = null;
    };

    xhr.onload = function() {
      var replies;
      try { replies = JSON.parse(xhr.responseText) } catch (error) {}

      cleanUp();

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.onerror = xhr.ontimeout = function() {
      cleanUp();
      self._handleError(messages);
    };

    xhr.onprogress = function() {};

    if (xhrClass === global.XDomainRequest)
      CORS._pending.add({id: id, xhr: xhr});

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  _id:      0,
  _pending: new Set(),

  isUsable: function(dispatcher, endpoint, callback, context) {
    if (URI.isSameOrigin(endpoint))
      return callback.call(context, false);

    if (global.XDomainRequest)
      return callback.call(context, endpoint.protocol === location.protocol);

    if (global.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
      return callback.call(context, xhr.withCredentials !== undefined);
    }
    return callback.call(context, false);
  }
});

module.exports = CORS;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(0),
    URI        = __webpack_require__(3),
    copyObject = __webpack_require__(12),
    extend     = __webpack_require__(1),
    Deferrable = __webpack_require__(5),
    Transport  = __webpack_require__(4),
    XHR        = __webpack_require__(17);

var EventSource = extend(Class(Transport, {
  initialize: function(dispatcher, endpoint) {
    Transport.prototype.initialize.call(this, dispatcher, endpoint);
    if (!global.EventSource) return this.setDeferredStatus('failed');

    this._xhr = new XHR(dispatcher, endpoint);

    endpoint = copyObject(endpoint);
    endpoint.pathname += '/' + dispatcher.clientId;

    var socket = new global.EventSource(URI.stringify(endpoint)),
        self   = this;

    socket.onopen = function() {
      self._everConnected = true;
      self.setDeferredStatus('succeeded');
    };

    socket.onerror = function() {
      if (self._everConnected) {
        self._handleError([]);
      } else {
        self.setDeferredStatus('failed');
        socket.close();
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError([]);
    };

    this._socket = socket;
  },

  close: function() {
    if (!this._socket) return;
    this._socket.onopen = this._socket.onerror = this._socket.onmessage = null;
    this._socket.close();
    delete this._socket;
  },

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
  },

  encode: function(messages) {
    return this._xhr.encode(messages);
  },

  request: function(messages) {
    return this._xhr.request(messages);
  }

}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var id = dispatcher.clientId;
    if (!id) return callback.call(context, false);

    XHR.isUsable(dispatcher, endpoint, function(usable) {
      if (!usable) return callback.call(context, false);
      this.create(dispatcher, endpoint).isUsable(callback, context);
    }, this);
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.eventsource = dispatcher.transports.eventsource || {},
        id      = dispatcher.clientId;

    var url = copyObject(endpoint);
    url.pathname += '/' + (id || '');
    url = URI.stringify(url);

    sockets[url] = sockets[url] || new this(dispatcher, endpoint);
    return sockets[url];
  }
});

extend(EventSource.prototype, Deferrable);

module.exports = EventSource;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(0),
    URI        = __webpack_require__(3),
    copyObject = __webpack_require__(12),
    extend     = __webpack_require__(1),
    toJSON     = __webpack_require__(7),
    Transport  = __webpack_require__(4);

var JSONP = extend(Class(Transport, {
 encode: function(messages) {
    var url = copyObject(this.endpoint);
    url.query.message = toJSON(messages);
    url.query.jsonp   = '__jsonp' + JSONP._cbCount + '__';
    return URI.stringify(url);
  },

  request: function(messages) {
    var head         = document.getElementsByTagName('head')[0],
        script       = document.createElement('script'),
        callbackName = JSONP.getCallbackName(),
        endpoint     = copyObject(this.endpoint),
        self         = this;

    endpoint.query.message = toJSON(messages);
    endpoint.query.jsonp   = callbackName;

    var cleanup = function() {
      if (!global[callbackName]) return false;
      global[callbackName] = undefined;
      try { delete global[callbackName] } catch (error) {}
      script.parentNode.removeChild(script);
    };

    global[callbackName] = function(replies) {
      cleanup();
      self._receive(replies);
    };

    script.type = 'text/javascript';
    script.src  = URI.stringify(endpoint);
    head.appendChild(script);

    script.onerror = function() {
      cleanup();
      self._handleError(messages);
    };

    return {abort: cleanup};
  }
}), {
  _cbCount: 0,

  getCallbackName: function() {
    this._cbCount += 1;
    return '__jsonp' + this._cbCount + '__';
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    callback.call(context, true);
  }
});

module.exports = JSONP;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(0),
    Promise    = __webpack_require__(8),
    Set        = __webpack_require__(20),
    URI        = __webpack_require__(3),
    browser    = __webpack_require__(11),
    copyObject = __webpack_require__(12),
    extend     = __webpack_require__(1),
    toJSON     = __webpack_require__(7),
    ws         = __webpack_require__(37),
    Deferrable = __webpack_require__(5),
    Transport  = __webpack_require__(4);

var WebSocket = extend(Class(Transport, {
  UNCONNECTED:  1,
  CONNECTING:   2,
  CONNECTED:    3,

  batching:     false,

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
    this.connect();
  },

  request: function(messages) {
    this._pending = this._pending || new Set();
    for (var i = 0, n = messages.length; i < n; i++) this._pending.add(messages[i]);

    var self = this;

    var promise = new Promise(function(resolve, reject) {
      self.callback(function(socket) {
        if (!socket || socket.readyState !== 1) return;
        socket.send(toJSON(messages));
        resolve(socket);
      });

      self.connect();
    });

    return {
      abort: function() { promise.then(function(ws) { ws.close() }) }
    };
  },

  connect: function() {
    if (WebSocket._unloaded) return;

    this._state = this._state || this.UNCONNECTED;
    if (this._state !== this.UNCONNECTED) return;
    this._state = this.CONNECTING;

    var socket = this._createSocket();
    if (!socket) return this.setDeferredStatus('failed');

    var self = this;

    socket.onopen = function() {
      if (socket.headers) self._storeCookies(socket.headers['set-cookie']);
      self._socket = socket;
      self._state = self.CONNECTED;
      self._everConnected = true;
      self._ping();
      self.setDeferredStatus('succeeded', socket);
    };

    var closed = false;
    socket.onclose = socket.onerror = function() {
      if (closed) return;
      closed = true;

      var wasConnected = (self._state === self.CONNECTED);
      socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;

      delete self._socket;
      self._state = self.UNCONNECTED;
      self.removeTimeout('ping');

      var pending = self._pending ? self._pending.toArray() : [];
      delete self._pending;

      if (wasConnected || self._everConnected) {
        self.setDeferredStatus('unknown');
        self._handleError(pending, wasConnected);
      } else {
        self.setDeferredStatus('failed');
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (!replies) return;

      replies = [].concat(replies);

      for (var i = 0, n = replies.length; i < n; i++) {
        if (replies[i].successful === undefined) continue;
        self._pending.remove(replies[i]);
      }
      self._receive(replies);
    };
  },

  close: function() {
    if (!this._socket) return;
    this._socket.close();
  },

  _createSocket: function() {
    var url        = WebSocket.getSocketUrl(this.endpoint),
        headers    = this._dispatcher.headers,
        extensions = this._dispatcher.wsExtensions,
        cookie     = this._getCookies(),
        tls        = this._dispatcher.tls,
        options    = {extensions: extensions, headers: headers, proxy: this._proxy, tls: tls};

    if (cookie !== '') options.headers['Cookie'] = cookie;

    return ws.create(url, [], options);
  },

  _ping: function() {
    if (!this._socket || this._socket.readyState !== 1) return;
    this._socket.send('[]');
    this.addTimeout('ping', this._dispatcher.timeout / 2, this._ping, this);
  }

}), {
  PROTOCOLS: {
    'http:':  'ws:',
    'https:': 'wss:'
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.websocket = dispatcher.transports.websocket || {};
    sockets[endpoint.href] = sockets[endpoint.href] || new this(dispatcher, endpoint);
    return sockets[endpoint.href];
  },

  getSocketUrl: function(endpoint) {
    endpoint = copyObject(endpoint);
    endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
    return URI.stringify(endpoint);
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    this.create(dispatcher, endpoint).isUsable(callback, context);
  }
});

extend(WebSocket.prototype, Deferrable);

if (browser.Event && global.onbeforeunload !== undefined)
  browser.Event.on(global, 'beforeunload', function() { WebSocket._unloaded = true });

module.exports = WebSocket;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 35 */
/***/ (function(module, exports) {

/*
Copyright Joyent, Inc. and other Node contributors. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

function EventEmitter() {}
module.exports = EventEmitter;

EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {
    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array = __webpack_require__(10);

module.exports = function(options, validKeys) {
  for (var key in options) {
    if (array.indexOf(validKeys, key) < 0)
      throw new Error('Unrecognized option: ' + key);
  }
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var WS = global.MozWebSocket || global.WebSocket;

module.exports = {
  create: function(url, protocols, options) {
    if (typeof WS !== 'function') return null;
    return new WS(url);
  }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Faye = __webpack_require__(21);
var Class = __webpack_require__(0);

var Client = Class(Faye.Client, {
  initialize: function initialize(base, options) {
    Faye.Client.prototype.initialize.call(this, base, options);

    var self = this;
    self._tokens = {};
    self._presenceCBs = {};

    this.addExtension({
      outgoing: function outgoing(message, callback) {
        var token = void 0;

        if (message.data && message.data._originalData) {
          token = message.data._token;
          message.data = message.data._originalData;
        }

        if (!token) {
          var channel = message.channel === '/meta/subscribe' ? message.subscription : message.channel;
          token = self._tokens[channel];
        }

        if (token) {
          if (!message.ext) message.ext = {};
          message.ext.auth = {
            token: token
          };
        }

        callback(message);
      },
      incoming: function incoming(message, callback) {
        if (message.channel === '/meta/subscribe' && message.ext && message.ext.presence) {
          var presenceCB = self._presenceCBs[message.subscription];
          if (presenceCB) {
            presenceCB(message.ext.presence, message.subscription);
          }
        }
        callback(message);
      }
    });
  },

  /**
   * @param channel [String]
   * @param token [String] (optional)
   * @callback [function(message, channel)] (optional)
   *   @param message [Object]
   *   @param channel [String]
   * @returns {Promise}
   *
   * subscribeTo(channel, callback)
   * subscribeTo(channel, token, callback);
   */
  subscribeTo: function subscribeTo() {
    var channel = arguments[0];
    var callback = void 0;
    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    }
    var token = void 0;
    if (typeof arguments[1] === 'string') {
      token = arguments[1];
    }

    if (token) {
      this._tokens[channel] = token;
    }

    this._presenceCBs[channel] = callback;

    return this.subscribe(channel).withChannel(function (channel, message) {
      if (callback) {
        callback(message, channel);
      }
    });
  },

  /**
   * @param channel [String]
   * @param token [String]
   * @param message [Object]
   * @returns {Promise}
   */
  publishTo: function publishTo(channel, token, data) {
    var wrappedData = {
      _originalData: data,
      _token: token
    };

    return this.publish(channel, wrappedData);
  }
});

module.exports = {
  Client: Client
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyYzIyZjU3YzU5ZDFhNmExMTY5YiIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC91cmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy90cmFuc3BvcnQvdHJhbnNwb3J0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL2RlZmVycmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9taXhpbnMvbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvdG9fanNvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL21peGlucy9wdWJsaXNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2FycmF5LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9icm93c2VyL2V2ZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb3B5X29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2NoYW5uZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9wcm90b2NvbC9ncmFtbWFyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L3hoci5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb29raWVzL2Jyb3dzZXJfY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvc2V0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvZmF5ZV9icm93c2VyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL3RpbWVvdXRzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2Vycm9yLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZXh0ZW5zaWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL3B1YmxpY2F0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvc3Vic2NyaXB0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2Jyb3dzZXJfdHJhbnNwb3J0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9jb3JzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2V2ZW50X3NvdXJjZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9qc29ucC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC93ZWJfc29ja2V0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9ldmVudF9lbWl0dGVyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC92YWxpZGF0ZV9vcHRpb25zLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC93ZWJzb2NrZXQvYnJvd3Nlcl93ZWJzb2NrZXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbIkZheWUiLCJyZXF1aXJlIiwiQ2xhc3MiLCJDbGllbnQiLCJpbml0aWFsaXplIiwiYmFzZSIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJjYWxsIiwic2VsZiIsIl90b2tlbnMiLCJfcHJlc2VuY2VDQnMiLCJhZGRFeHRlbnNpb24iLCJvdXRnb2luZyIsIm1lc3NhZ2UiLCJjYWxsYmFjayIsInRva2VuIiwiZGF0YSIsIl9vcmlnaW5hbERhdGEiLCJfdG9rZW4iLCJjaGFubmVsIiwic3Vic2NyaXB0aW9uIiwiZXh0IiwiYXV0aCIsImluY29taW5nIiwicHJlc2VuY2UiLCJwcmVzZW5jZUNCIiwic3Vic2NyaWJlVG8iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzdWJzY3JpYmUiLCJ3aXRoQ2hhbm5lbCIsInB1Ymxpc2hUbyIsIndyYXBwZWREYXRhIiwicHVibGlzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7O0FBRUE7O0FBRUE7QUFDQTtB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QUNBO0FBQ0EscUNBQXFDLE9BQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OENDekVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDakRBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ2xCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsMENBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDs7Ozs7Ozs7QUNuSUE7O0FBRUE7QUFDQTtBQUNBLG9GQUFvRixJQUFJO0FBQ3hGO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNQQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVILHdCQUF3Qjs7QUFFeEIscUJBQXFCOztBQUVyQjtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7OzhDQzdDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7QUNqRkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ1RBOztBQUVBOzs7Ozs7OztBQ0ZBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDakREOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs4Q0NkQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OENDekJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSyxJQUFJOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHVDQUF1Qyx5QkFBeUI7O0FBRWhFLE9BQU87QUFDUDtBQUNBLHNDQUFzQyxvQ0FBb0M7QUFDMUU7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxrQ0FBa0M7O0FBRTFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSyxJQUFJO0FBQ1QsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8sSUFBSTtBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyxJQUFJO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEUsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs4Q0NqWUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0I7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdEQUF3RDs7QUFFeEQ7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLE9BQU87QUFDN0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELCtFQUErRTtBQUMvSCx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7QUN4TEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7Ozs7Ozs7O0FDdERBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7QUM5Q0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNMQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOzs7Ozs7OztBQzNDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs4Q0NWQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcseUNBQXlDOztBQUVwRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OzhDQ1RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNUQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7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TixPQUFuQixFQUE0QjtBQUNyRSxVQUFJQyxRQUFKLEVBQWM7QUFDWkEsaUJBQVNELE9BQVQsRUFBa0JNLE9BQWxCO0FBQ0Q7QUFDRixLQUpNLENBQVA7QUFLRCxHQTlFK0I7O0FBZ0ZoQzs7Ozs7O0FBTUFZLGFBQVcsbUJBQVVaLE9BQVYsRUFBbUJKLEtBQW5CLEVBQTBCQyxJQUExQixFQUFnQztBQUN6QyxRQUFNZ0IsY0FBYztBQUNsQmYscUJBQWVELElBREc7QUFFbEJFLGNBQVFIO0FBRlUsS0FBcEI7O0FBS0EsV0FBTyxLQUFLa0IsT0FBTCxDQUFhZCxPQUFiLEVBQXNCYSxXQUF0QixDQUFQO0FBQ0Q7QUE3RitCLENBQW5CLENBQWY7O0FBZ0dBRSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZqQyxVQUFRQTtBQURPLENBQWpCLEMiLCJmaWxlIjoiLi9jbGllbnQvZGlzdC9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJQYW5kYXB1c2hcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUGFuZGFwdXNoXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDM5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyYzIyZjU3YzU5ZDFhNmExMTY5YiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGFyZW50LCBtZXRob2RzKSB7XG4gIGlmICh0eXBlb2YgcGFyZW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgbWV0aG9kcyA9IHBhcmVudDtcbiAgICBwYXJlbnQgID0gT2JqZWN0O1xuICB9XG5cbiAgdmFyIGtsYXNzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemUpIHJldHVybiB0aGlzO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICB9O1xuXG4gIHZhciBicmlkZ2UgPSBmdW5jdGlvbigpIHt9O1xuICBicmlkZ2UucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcblxuICBrbGFzcy5wcm90b3R5cGUgPSBuZXcgYnJpZGdlKCk7XG4gIGV4dGVuZChrbGFzcy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuXG4gIHJldHVybiBrbGFzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9jbGFzcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVzdCwgc291cmNlLCBvdmVyd3JpdGUpIHtcbiAgaWYgKCFzb3VyY2UpIHJldHVybiBkZXN0O1xuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgaWYgKGRlc3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvdmVyd3JpdGUgPT09IGZhbHNlKSBjb250aW51ZTtcbiAgICBpZiAoZGVzdFtrZXldICE9PSBzb3VyY2Vba2V5XSlcbiAgICAgIGRlc3Rba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2V4dGVuZC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNVUkk6IGZ1bmN0aW9uKHVyaSkge1xuICAgIHJldHVybiB1cmkgJiYgdXJpLnByb3RvY29sICYmIHVyaS5ob3N0ICYmIHVyaS5wYXRoO1xuICB9LFxuXG4gIGlzU2FtZU9yaWdpbjogZnVuY3Rpb24odXJpKSB7XG4gICAgcmV0dXJuIHVyaS5wcm90b2NvbCA9PT0gbG9jYXRpb24ucHJvdG9jb2wgJiZcbiAgICAgICAgICAgdXJpLmhvc3RuYW1lID09PSBsb2NhdGlvbi5ob3N0bmFtZSAmJlxuICAgICAgICAgICB1cmkucG9ydCAgICAgPT09IGxvY2F0aW9uLnBvcnQ7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKHVybCkge1xuICAgIGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykgcmV0dXJuIHVybDtcbiAgICB2YXIgdXJpID0ge30sIHBhcnRzLCBxdWVyeSwgcGFpcnMsIGksIG4sIGRhdGE7XG5cbiAgICB2YXIgY29uc3VtZSA9IGZ1bmN0aW9uKG5hbWUsIHBhdHRlcm4pIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKHBhdHRlcm4sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHVyaVtuYW1lXSA9IG1hdGNoO1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9KTtcbiAgICAgIHVyaVtuYW1lXSA9IHVyaVtuYW1lXSB8fCAnJztcbiAgICB9O1xuXG4gICAgY29uc3VtZSgncHJvdG9jb2wnLCAvXlthLXpdK1xcOi9pKTtcbiAgICBjb25zdW1lKCdob3N0JywgICAgIC9eXFwvXFwvW15cXC9cXD8jXSsvKTtcblxuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSAmJiAhdXJpLmhvc3QpXG4gICAgICB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9bXlxcL10qJC8sICcnKSArIHVybDtcblxuICAgIGNvbnN1bWUoJ3BhdGhuYW1lJywgL15bXlxcPyNdKi8pO1xuICAgIGNvbnN1bWUoJ3NlYXJjaCcsICAgL15cXD9bXiNdKi8pO1xuICAgIGNvbnN1bWUoJ2hhc2gnLCAgICAgL14jLiovKTtcblxuICAgIHVyaS5wcm90b2NvbCA9IHVyaS5wcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbDtcblxuICAgIGlmICh1cmkuaG9zdCkge1xuICAgICAgdXJpLmhvc3QgICAgID0gdXJpLmhvc3Quc3Vic3RyKDIpO1xuICAgICAgcGFydHMgICAgICAgID0gdXJpLmhvc3Quc3BsaXQoJzonKTtcbiAgICAgIHVyaS5ob3N0bmFtZSA9IHBhcnRzWzBdO1xuICAgICAgdXJpLnBvcnQgICAgID0gcGFydHNbMV0gfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVyaS5ob3N0ICAgICA9IGxvY2F0aW9uLmhvc3Q7XG4gICAgICB1cmkuaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICAgIHVyaS5wb3J0ICAgICA9IGxvY2F0aW9uLnBvcnQ7XG4gICAgfVxuXG4gICAgdXJpLnBhdGhuYW1lID0gdXJpLnBhdGhuYW1lIHx8ICcvJztcbiAgICB1cmkucGF0aCA9IHVyaS5wYXRobmFtZSArIHVyaS5zZWFyY2g7XG5cbiAgICBxdWVyeSA9IHVyaS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKTtcbiAgICBwYWlycyA9IHF1ZXJ5ID8gcXVlcnkuc3BsaXQoJyYnKSA6IFtdO1xuICAgIGRhdGEgID0ge307XG5cbiAgICBmb3IgKGkgPSAwLCBuID0gcGFpcnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBwYXJ0cyA9IHBhaXJzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICBkYXRhW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSB8fCAnJyldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdIHx8ICcnKTtcbiAgICB9XG5cbiAgICB1cmkucXVlcnkgPSBkYXRhO1xuXG4gICAgdXJpLmhyZWYgPSB0aGlzLnN0cmluZ2lmeSh1cmkpO1xuICAgIHJldHVybiB1cmk7XG4gIH0sXG5cbiAgc3RyaW5naWZ5OiBmdW5jdGlvbih1cmkpIHtcbiAgICB2YXIgc3RyaW5nID0gdXJpLnByb3RvY29sICsgJy8vJyArIHVyaS5ob3N0bmFtZTtcbiAgICBpZiAodXJpLnBvcnQpIHN0cmluZyArPSAnOicgKyB1cmkucG9ydDtcbiAgICBzdHJpbmcgKz0gdXJpLnBhdGhuYW1lICsgdGhpcy5xdWVyeVN0cmluZyh1cmkucXVlcnkpICsgKHVyaS5oYXNoIHx8ICcnKTtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9LFxuXG4gIHF1ZXJ5U3RyaW5nOiBmdW5jdGlvbihxdWVyeSkge1xuICAgIHZhciBwYWlycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBxdWVyeSkge1xuICAgICAgaWYgKCFxdWVyeS5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocXVlcnlba2V5XSkpO1xuICAgIH1cbiAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XG4gICAgcmV0dXJuICc/JyArIHBhaXJzLmpvaW4oJyYnKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3VyaS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBDb29raWUgICA9IHJlcXVpcmUoJy4uL3V0aWwvY29va2llcycpLkNvb2tpZSxcbiAgICBQcm9taXNlICA9IHJlcXVpcmUoJy4uL3V0aWwvcHJvbWlzZScpLFxuICAgIFVSSSAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBhcnJheSAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYXJyYXknKSxcbiAgICBleHRlbmQgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgTG9nZ2luZyAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFRpbWVvdXRzID0gcmVxdWlyZSgnLi4vbWl4aW5zL3RpbWVvdXRzJyksXG4gICAgQ2hhbm5lbCAgPSByZXF1aXJlKCcuLi9wcm90b2NvbC9jaGFubmVsJyk7XG5cbnZhciBUcmFuc3BvcnQgPSBleHRlbmQoQ2xhc3MoeyBjbGFzc05hbWU6ICdUcmFuc3BvcnQnLFxuICBERUZBVUxUX1BPUlRTOiB7J2h0dHA6JzogODAsICdodHRwczonOiA0NDMsICd3czonOiA4MCwgJ3dzczonOiA0NDN9LFxuICBNQVhfREVMQVk6ICAgICAwLFxuXG4gIGJhdGNoaW5nOiAgdHJ1ZSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCkge1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuZW5kcG9pbnQgICAgPSBlbmRwb2ludDtcbiAgICB0aGlzLl9vdXRib3ggICAgID0gW107XG4gICAgdGhpcy5fcHJveHkgICAgICA9IGV4dGVuZCh7fSwgdGhpcy5fZGlzcGF0Y2hlci5wcm94eSk7XG5cbiAgICBpZiAoIXRoaXMuX3Byb3h5Lm9yaWdpbilcbiAgICAgIHRoaXMuX3Byb3h5Lm9yaWdpbiA9IHRoaXMuX2ZpbmRQcm94eSgpO1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbigpIHt9LFxuXG4gIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gJyc7XG4gIH0sXG5cbiAgc2VuZE1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB0aGlzLmRlYnVnKCdDbGllbnQgPyBzZW5kaW5nIG1lc3NhZ2UgdG8gPzogPycsXG4gICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLCBtZXNzYWdlKTtcblxuICAgIGlmICghdGhpcy5iYXRjaGluZykgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnJlcXVlc3QoW21lc3NhZ2VdKSk7XG5cbiAgICB0aGlzLl9vdXRib3gucHVzaChtZXNzYWdlKTtcbiAgICB0aGlzLl9mbHVzaExhcmdlQmF0Y2goKTtcblxuICAgIGlmIChtZXNzYWdlLmNoYW5uZWwgPT09IENoYW5uZWwuSEFORFNIQUtFKVxuICAgICAgcmV0dXJuIHRoaXMuX3B1Ymxpc2goMC4wMSk7XG5cbiAgICBpZiAobWVzc2FnZS5jaGFubmVsID09PSBDaGFubmVsLkNPTk5FQ1QpXG4gICAgICB0aGlzLl9jb25uZWN0TWVzc2FnZSA9IG1lc3NhZ2U7XG5cbiAgICByZXR1cm4gdGhpcy5fcHVibGlzaCh0aGlzLk1BWF9ERUxBWSk7XG4gIH0sXG5cbiAgX21ha2VQcm9taXNlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLl9yZXF1ZXN0UHJvbWlzZSA9IHRoaXMuX3JlcXVlc3RQcm9taXNlIHx8IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHNlbGYuX3Jlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICB9KTtcbiAgfSxcblxuICBfcHVibGlzaDogZnVuY3Rpb24oZGVsYXkpIHtcbiAgICB0aGlzLl9tYWtlUHJvbWlzZSgpO1xuXG4gICAgdGhpcy5hZGRUaW1lb3V0KCdwdWJsaXNoJywgZGVsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fZmx1c2goKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXF1ZXN0UHJvbWlzZTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0UHJvbWlzZTtcbiAgfSxcblxuICBfZmx1c2g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlVGltZW91dCgncHVibGlzaCcpO1xuXG4gICAgaWYgKHRoaXMuX291dGJveC5sZW5ndGggPiAxICYmIHRoaXMuX2Nvbm5lY3RNZXNzYWdlKVxuICAgICAgdGhpcy5fY29ubmVjdE1lc3NhZ2UuYWR2aWNlID0ge3RpbWVvdXQ6IDB9O1xuXG4gICAgdGhpcy5fcmVzb2x2ZVByb21pc2UodGhpcy5yZXF1ZXN0KHRoaXMuX291dGJveCkpO1xuXG4gICAgdGhpcy5fY29ubmVjdE1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMuX291dGJveCA9IFtdO1xuICB9LFxuXG4gIF9mbHVzaExhcmdlQmF0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcgPSB0aGlzLmVuY29kZSh0aGlzLl9vdXRib3gpO1xuICAgIGlmIChzdHJpbmcubGVuZ3RoIDwgdGhpcy5fZGlzcGF0Y2hlci5tYXhSZXF1ZXN0U2l6ZSkgcmV0dXJuO1xuICAgIHZhciBsYXN0ID0gdGhpcy5fb3V0Ym94LnBvcCgpO1xuXG4gICAgdGhpcy5fbWFrZVByb21pc2UoKTtcbiAgICB0aGlzLl9mbHVzaCgpO1xuXG4gICAgaWYgKGxhc3QpIHRoaXMuX291dGJveC5wdXNoKGxhc3QpO1xuICB9LFxuXG4gIF9yZWNlaXZlOiBmdW5jdGlvbihyZXBsaWVzKSB7XG4gICAgaWYgKCFyZXBsaWVzKSByZXR1cm47XG4gICAgcmVwbGllcyA9IFtdLmNvbmNhdChyZXBsaWVzKTtcblxuICAgIHRoaXMuZGVidWcoJ0NsaWVudCA/IHJlY2VpdmVkIGZyb20gPyB2aWEgPzogPycsXG4gICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLCB0aGlzLmNvbm5lY3Rpb25UeXBlLCByZXBsaWVzKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gcmVwbGllcy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLmhhbmRsZVJlc3BvbnNlKHJlcGxpZXNbaV0pO1xuICB9LFxuXG4gIF9oYW5kbGVFcnJvcjogZnVuY3Rpb24obWVzc2FnZXMsIGltbWVkaWF0ZSkge1xuICAgIG1lc3NhZ2VzID0gW10uY29uY2F0KG1lc3NhZ2VzKTtcblxuICAgIHRoaXMuZGVidWcoJ0NsaWVudCA/IGZhaWxlZCB0byBzZW5kIHRvID8gdmlhID86ID8nLFxuICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KSwgdGhpcy5jb25uZWN0aW9uVHlwZSwgbWVzc2FnZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBtZXNzYWdlcy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLmhhbmRsZUVycm9yKG1lc3NhZ2VzW2ldKTtcbiAgfSxcblxuICBfZ2V0Q29va2llczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvb2tpZXMgPSB0aGlzLl9kaXNwYXRjaGVyLmNvb2tpZXMsXG4gICAgICAgIHVybCAgICAgPSBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpO1xuXG4gICAgaWYgKCFjb29raWVzKSByZXR1cm4gJyc7XG5cbiAgICByZXR1cm4gYXJyYXkubWFwKGNvb2tpZXMuZ2V0Q29va2llc1N5bmModXJsKSwgZnVuY3Rpb24oY29va2llKSB7XG4gICAgICByZXR1cm4gY29va2llLmNvb2tpZVN0cmluZygpO1xuICAgIH0pLmpvaW4oJzsgJyk7XG4gIH0sXG5cbiAgX3N0b3JlQ29va2llczogZnVuY3Rpb24oc2V0Q29va2llKSB7XG4gICAgdmFyIGNvb2tpZXMgPSB0aGlzLl9kaXNwYXRjaGVyLmNvb2tpZXMsXG4gICAgICAgIHVybCAgICAgPSBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLFxuICAgICAgICBjb29raWU7XG5cbiAgICBpZiAoIXNldENvb2tpZSB8fCAhY29va2llcykgcmV0dXJuO1xuICAgIHNldENvb2tpZSA9IFtdLmNvbmNhdChzZXRDb29raWUpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBzZXRDb29raWUubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBjb29raWUgPSBDb29raWUucGFyc2Uoc2V0Q29va2llW2ldKTtcbiAgICAgIGNvb2tpZXMuc2V0Q29va2llU3luYyhjb29raWUsIHVybCk7XG4gICAgfVxuICB9LFxuXG4gIF9maW5kUHJveHk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgcHJvdG9jb2wgPSB0aGlzLmVuZHBvaW50LnByb3RvY29sO1xuICAgIGlmICghcHJvdG9jb2wpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgbmFtZSAgID0gcHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykudG9Mb3dlckNhc2UoKSArICdfcHJveHknLFxuICAgICAgICB1cGNhc2UgPSBuYW1lLnRvVXBwZXJDYXNlKCksXG4gICAgICAgIGVudiAgICA9IHByb2Nlc3MuZW52LFxuICAgICAgICBrZXlzLCBwcm94eTtcblxuICAgIGlmIChuYW1lID09PSAnaHR0cF9wcm94eScgJiYgZW52LlJFUVVFU1RfTUVUSE9EKSB7XG4gICAgICBrZXlzID0gT2JqZWN0LmtleXMoZW52KS5maWx0ZXIoZnVuY3Rpb24oaykgeyByZXR1cm4gL15odHRwX3Byb3h5JC9pLnRlc3QoaykgfSk7XG4gICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKGtleXNbMF0gPT09IG5hbWUgJiYgZW52W3VwY2FzZV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBwcm94eSA9IGVudltuYW1lXTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHByb3h5ID0gZW52W25hbWVdO1xuICAgICAgfVxuICAgICAgcHJveHkgPSBwcm94eSB8fCBlbnZbJ0NHSV8nICsgdXBjYXNlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJveHkgPSBlbnZbbmFtZV0gfHwgZW52W3VwY2FzZV07XG4gICAgICBpZiAocHJveHkgJiYgIWVudltuYW1lXSlcbiAgICAgICAgY29uc29sZS53YXJuKCdUaGUgZW52aXJvbm1lbnQgdmFyaWFibGUgJyArIHVwY2FzZSArXG4gICAgICAgICAgICAgICAgICAgICAnIGlzIGRpc2NvdXJhZ2VkLiBVc2UgJyArIG5hbWUgKyAnLicpO1xuICAgIH1cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxufSksIHtcbiAgZ2V0OiBmdW5jdGlvbihkaXNwYXRjaGVyLCBhbGxvd2VkLCBkaXNhYmxlZCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgZW5kcG9pbnQgPSBkaXNwYXRjaGVyLmVuZHBvaW50O1xuXG4gICAgYXJyYXkuYXN5bmNFYWNoKHRoaXMuX3RyYW5zcG9ydHMsIGZ1bmN0aW9uKHBhaXIsIHJlc3VtZSkge1xuICAgICAgdmFyIGNvbm5UeXBlICAgICA9IHBhaXJbMF0sIGtsYXNzID0gcGFpclsxXSxcbiAgICAgICAgICBjb25uRW5kcG9pbnQgPSBkaXNwYXRjaGVyLmVuZHBvaW50Rm9yKGNvbm5UeXBlKTtcblxuICAgICAgaWYgKGFycmF5LmluZGV4T2YoZGlzYWJsZWQsIGNvbm5UeXBlKSA+PSAwKVxuICAgICAgICByZXR1cm4gcmVzdW1lKCk7XG5cbiAgICAgIGlmIChhcnJheS5pbmRleE9mKGFsbG93ZWQsIGNvbm5UeXBlKSA8IDApIHtcbiAgICAgICAga2xhc3MuaXNVc2FibGUoZGlzcGF0Y2hlciwgY29ubkVuZHBvaW50LCBmdW5jdGlvbigpIHt9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VtZSgpO1xuICAgICAgfVxuXG4gICAgICBrbGFzcy5pc1VzYWJsZShkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQsIGZ1bmN0aW9uKGlzVXNhYmxlKSB7XG4gICAgICAgIGlmICghaXNVc2FibGUpIHJldHVybiByZXN1bWUoKTtcbiAgICAgICAgdmFyIHRyYW5zcG9ydCA9IGtsYXNzLmhhc093blByb3BlcnR5KCdjcmVhdGUnKSA/IGtsYXNzLmNyZWF0ZShkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQpIDogbmV3IGtsYXNzKGRpc3BhdGNoZXIsIGNvbm5FbmRwb2ludCk7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdHJhbnNwb3J0KTtcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBhIHVzYWJsZSBjb25uZWN0aW9uIHR5cGUgZm9yICcgKyBVUkkuc3RyaW5naWZ5KGVuZHBvaW50KSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHR5cGUsIGtsYXNzKSB7XG4gICAgdGhpcy5fdHJhbnNwb3J0cy5wdXNoKFt0eXBlLCBrbGFzc10pO1xuICAgIGtsYXNzLnByb3RvdHlwZS5jb25uZWN0aW9uVHlwZSA9IHR5cGU7XG4gIH0sXG5cbiAgZ2V0Q29ubmVjdGlvblR5cGVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYXJyYXkubWFwKHRoaXMuX3RyYW5zcG9ydHMsIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHRbMF0gfSk7XG4gIH0sXG5cbiAgX3RyYW5zcG9ydHM6IFtdXG59KTtcblxuZXh0ZW5kKFRyYW5zcG9ydC5wcm90b3R5cGUsIExvZ2dpbmcpO1xuZXh0ZW5kKFRyYW5zcG9ydC5wcm90b3R5cGUsIFRpbWVvdXRzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L3RyYW5zcG9ydC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRoZW46IGZ1bmN0aW9uKGNhbGxiYWNrLCBlcnJiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy5fcHJvbWlzZSlcbiAgICAgIHRoaXMuX3Byb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgc2VsZi5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHNlbGYuX3JlamVjdCAgPSByZWplY3Q7XG4gICAgICB9KTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2U7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UudGhlbihjYWxsYmFjaywgZXJyYmFjayk7XG4gIH0sXG5cbiAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbih2YWx1ZSkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlKSB9KTtcbiAgfSxcblxuICBlcnJiYWNrOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgZnVuY3Rpb24ocmVhc29uKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgcmVhc29uKSB9KTtcbiAgfSxcblxuICB0aW1lb3V0OiBmdW5jdGlvbihzZWNvbmRzLCBtZXNzYWdlKSB7XG4gICAgdGhpcy50aGVuKCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3RpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9yZWplY3QobWVzc2FnZSk7XG4gICAgfSwgc2Vjb25kcyAqIDEwMDApO1xuICB9LFxuXG4gIHNldERlZmVycmVkU3RhdHVzOiBmdW5jdGlvbihzdGF0dXMsIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX3RpbWVyKSBnbG9iYWwuY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcblxuICAgIHRoaXMudGhlbigpO1xuXG4gICAgaWYgKHN0YXR1cyA9PT0gJ3N1Y2NlZWRlZCcpXG4gICAgICB0aGlzLl9yZXNvbHZlKHZhbHVlKTtcbiAgICBlbHNlIGlmIChzdGF0dXMgPT09ICdmYWlsZWQnKVxuICAgICAgdGhpcy5fcmVqZWN0KHZhbHVlKTtcbiAgICBlbHNlXG4gICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9taXhpbnMvZGVmZXJyYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b0pTT04gPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKTtcblxudmFyIExvZ2dpbmcgPSB7XG4gIExPR19MRVZFTFM6IHtcbiAgICBmYXRhbDogIDQsXG4gICAgZXJyb3I6ICAzLFxuICAgIHdhcm46ICAgMixcbiAgICBpbmZvOiAgIDEsXG4gICAgZGVidWc6ICAwXG4gIH0sXG5cbiAgd3JpdGVMb2c6IGZ1bmN0aW9uKG1lc3NhZ2VBcmdzLCBsZXZlbCkge1xuICAgIHZhciBsb2dnZXIgPSBMb2dnaW5nLmxvZ2dlciB8fCAoTG9nZ2luZy53cmFwcGVyIHx8IExvZ2dpbmcpLmxvZ2dlcjtcbiAgICBpZiAoIWxvZ2dlcikgcmV0dXJuO1xuXG4gICAgdmFyIGFyZ3MgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShtZXNzYWdlQXJncyksXG4gICAgICAgIGJhbm5lciA9ICdbRmF5ZScsXG4gICAgICAgIGtsYXNzICA9IHRoaXMuY2xhc3NOYW1lLFxuXG4gICAgICAgIG1lc3NhZ2UgPSBhcmdzLnNoaWZ0KCkucmVwbGFjZSgvXFw/L2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdG9KU09OKGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiAnW09iamVjdF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBpZiAoa2xhc3MpIGJhbm5lciArPSAnLicgKyBrbGFzcztcbiAgICBiYW5uZXIgKz0gJ10gJztcblxuICAgIGlmICh0eXBlb2YgbG9nZ2VyW2xldmVsXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGxvZ2dlcltsZXZlbF0oYmFubmVyICsgbWVzc2FnZSk7XG4gICAgZWxzZSBpZiAodHlwZW9mIGxvZ2dlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGxvZ2dlcihiYW5uZXIgKyBtZXNzYWdlKTtcbiAgfVxufTtcblxuZm9yICh2YXIga2V5IGluIExvZ2dpbmcuTE9HX0xFVkVMUylcbiAgKGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgTG9nZ2luZ1tsZXZlbF0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMud3JpdGVMb2coYXJndW1lbnRzLCBsZXZlbCk7XG4gICAgfTtcbiAgfSkoa2V5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2dnaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL21peGlucy9sb2dnaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuLy8gaHR0cDovL2Fzc2Fua2EubmV0L2NvbnRlbnQvdGVjaC8yMDA5LzA5LzAyL2pzb24yLWpzLXZzLXByb3RvdHlwZS9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiAodGhpc1trZXldIGluc3RhbmNlb2YgQXJyYXkpID8gdGhpc1trZXldIDogdmFsdWU7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3RvX2pzb24uanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNhcCA9IHJlcXVpcmUoJ2FzYXAnKTtcblxudmFyIFBFTkRJTkcgICA9IDAsXG4gICAgRlVMRklMTEVEID0gMSxcbiAgICBSRUpFQ1RFRCAgPSAyO1xuXG52YXIgUkVUVVJOID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCB9LFxuICAgIFRIUk9XICA9IGZ1bmN0aW9uKHgpIHsgdGhyb3cgIHggfTtcblxudmFyIFByb21pc2UgPSBmdW5jdGlvbih0YXNrKSB7XG4gIHRoaXMuX3N0YXRlICAgICAgID0gUEVORElORztcbiAgdGhpcy5fb25GdWxmaWxsZWQgPSBbXTtcbiAgdGhpcy5fb25SZWplY3RlZCAgPSBbXTtcblxuICBpZiAodHlwZW9mIHRhc2sgIT09ICdmdW5jdGlvbicpIHJldHVybjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRhc2soZnVuY3Rpb24odmFsdWUpICB7IHJlc29sdmUoc2VsZiwgdmFsdWUpIH0sXG4gICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChzZWxmLCByZWFzb24pIH0pO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHZhciBuZXh0ID0gbmV3IFByb21pc2UoKTtcbiAgcmVnaXN0ZXJPbkZ1bGZpbGxlZCh0aGlzLCBvbkZ1bGZpbGxlZCwgbmV4dCk7XG4gIHJlZ2lzdGVyT25SZWplY3RlZCh0aGlzLCBvblJlamVjdGVkLCBuZXh0KTtcbiAgcmV0dXJuIG5leHQ7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbn07XG5cbnZhciByZWdpc3Rlck9uRnVsZmlsbGVkID0gZnVuY3Rpb24ocHJvbWlzZSwgb25GdWxmaWxsZWQsIG5leHQpIHtcbiAgaWYgKHR5cGVvZiBvbkZ1bGZpbGxlZCAhPT0gJ2Z1bmN0aW9uJykgb25GdWxmaWxsZWQgPSBSRVRVUk47XG4gIHZhciBoYW5kbGVyID0gZnVuY3Rpb24odmFsdWUpIHsgaW52b2tlKG9uRnVsZmlsbGVkLCB2YWx1ZSwgbmV4dCkgfTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICBwcm9taXNlLl9vbkZ1bGZpbGxlZC5wdXNoKGhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKHByb21pc2UuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBoYW5kbGVyKHByb21pc2UuX3ZhbHVlKTtcbiAgfVxufTtcblxudmFyIHJlZ2lzdGVyT25SZWplY3RlZCA9IGZ1bmN0aW9uKHByb21pc2UsIG9uUmVqZWN0ZWQsIG5leHQpIHtcbiAgaWYgKHR5cGVvZiBvblJlamVjdGVkICE9PSAnZnVuY3Rpb24nKSBvblJlamVjdGVkID0gVEhST1c7XG4gIHZhciBoYW5kbGVyID0gZnVuY3Rpb24ocmVhc29uKSB7IGludm9rZShvblJlamVjdGVkLCByZWFzb24sIG5leHQpIH07XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgcHJvbWlzZS5fb25SZWplY3RlZC5wdXNoKGhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKHByb21pc2UuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIGhhbmRsZXIocHJvbWlzZS5fcmVhc29uKTtcbiAgfVxufTtcblxudmFyIGludm9rZSA9IGZ1bmN0aW9uKGZuLCB2YWx1ZSwgbmV4dCkge1xuICBhc2FwKGZ1bmN0aW9uKCkgeyBfaW52b2tlKGZuLCB2YWx1ZSwgbmV4dCkgfSk7XG59O1xuXG52YXIgX2ludm9rZSA9IGZ1bmN0aW9uKGZuLCB2YWx1ZSwgbmV4dCkge1xuICB2YXIgb3V0Y29tZTtcblxuICB0cnkge1xuICAgIG91dGNvbWUgPSBmbih2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHJlamVjdChuZXh0LCBlcnJvcik7XG4gIH1cblxuICBpZiAob3V0Y29tZSA9PT0gbmV4dCkge1xuICAgIHJlamVjdChuZXh0LCBuZXcgVHlwZUVycm9yKCdSZWN1cnNpdmUgcHJvbWlzZSBjaGFpbiBkZXRlY3RlZCcpKTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlKG5leHQsIG91dGNvbWUpO1xuICB9XG59O1xuXG52YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uKHByb21pc2UsIHZhbHVlKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZSwgdHlwZSwgdGhlbjtcblxuICB0cnkge1xuICAgIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgdGhlbiA9IHZhbHVlICE9PSBudWxsICYmICh0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnKSAmJiB2YWx1ZS50aGVuO1xuXG4gICAgaWYgKHR5cGVvZiB0aGVuICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG5cbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICghKGNhbGxlZCBeIChjYWxsZWQgPSB0cnVlKSkpIHJldHVybjtcbiAgICAgIHJlc29sdmUocHJvbWlzZSwgdik7XG4gICAgfSwgZnVuY3Rpb24ocikge1xuICAgICAgaWYgKCEoY2FsbGVkIF4gKGNhbGxlZCA9IHRydWUpKSkgcmV0dXJuO1xuICAgICAgcmVqZWN0KHByb21pc2UsIHIpO1xuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmICghKGNhbGxlZCBeIChjYWxsZWQgPSB0cnVlKSkpIHJldHVybjtcbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICB9XG59O1xuXG52YXIgZnVsZmlsbCA9IGZ1bmN0aW9uKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgcmV0dXJuO1xuXG4gIHByb21pc2UuX3N0YXRlICAgICAgPSBGVUxGSUxMRUQ7XG4gIHByb21pc2UuX3ZhbHVlICAgICAgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fb25SZWplY3RlZCA9IFtdO1xuXG4gIHZhciBvbkZ1bGZpbGxlZCA9IHByb21pc2UuX29uRnVsZmlsbGVkLCBmbjtcbiAgd2hpbGUgKGZuID0gb25GdWxmaWxsZWQuc2hpZnQoKSkgZm4odmFsdWUpO1xufTtcblxudmFyIHJlamVjdCA9IGZ1bmN0aW9uKHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHJldHVybjtcblxuICBwcm9taXNlLl9zdGF0ZSAgICAgICA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZWFzb24gICAgICA9IHJlYXNvbjtcbiAgcHJvbWlzZS5fb25GdWxmaWxsZWQgPSBbXTtcblxuICB2YXIgb25SZWplY3RlZCA9IHByb21pc2UuX29uUmVqZWN0ZWQsIGZuO1xuICB3aGlsZSAoZm4gPSBvblJlamVjdGVkLnNoaWZ0KCkpIGZuKHJlYXNvbik7XG59O1xuXG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7IHJlc29sdmUodmFsdWUpIH0pO1xufTtcblxuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZWplY3QocmVhc29uKSB9KTtcbn07XG5cblByb21pc2UuYWxsID0gZnVuY3Rpb24ocHJvbWlzZXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBsaXN0ID0gW10sIG4gPSBwcm9taXNlcy5sZW5ndGgsIGk7XG5cbiAgICBpZiAobiA9PT0gMCkgcmV0dXJuIHJlc29sdmUobGlzdCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSAoZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgbGlzdFtpXSA9IHZhbHVlO1xuICAgICAgICBpZiAoLS1uID09PSAwKSByZXNvbHZlKGxpc3QpO1xuICAgICAgfSwgcmVqZWN0KTtcbiAgICB9KShwcm9taXNlc1tpXSwgaSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24ocHJvbWlzZXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gcHJvbWlzZXMubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2VzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5kZWZlcnJlZCA9IFByb21pc2UucGVuZGluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdHVwbGUgPSB7fTtcblxuICB0dXBsZS5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdHVwbGUucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgdHVwbGUucmVqZWN0ICA9IHJlamVjdDtcbiAgfSk7XG4gIHJldHVybiB0dXBsZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3Byb21pc2UuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi91dGlsL2V2ZW50X2VtaXR0ZXInKTtcblxudmFyIFB1Ymxpc2hlciA9IHtcbiAgY291bnRMaXN0ZW5lcnM6IGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVycyhldmVudFR5cGUpLmxlbmd0aDtcbiAgfSxcblxuICBiaW5kOiBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHNsaWNlICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgbGlzdGVuZXIuYXBwbHkoY29udGV4dCwgc2xpY2UuY2FsbChhcmd1bWVudHMpKSB9O1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzIHx8IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKFtldmVudFR5cGUsIGxpc3RlbmVyLCBjb250ZXh0LCBoYW5kbGVyXSk7XG4gICAgcmV0dXJuIHRoaXMub24oZXZlbnRUeXBlLCBoYW5kbGVyKTtcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMgfHwgW107XG4gICAgdmFyIG4gPSB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoLCB0dXBsZTtcblxuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHR1cGxlID0gdGhpcy5fbGlzdGVuZXJzW25dO1xuICAgICAgaWYgKHR1cGxlWzBdICE9PSBldmVudFR5cGUpIGNvbnRpbnVlO1xuICAgICAgaWYgKGxpc3RlbmVyICYmICh0dXBsZVsxXSAhPT0gbGlzdGVuZXIgfHwgdHVwbGVbMl0gIT09IGNvbnRleHQpKSBjb250aW51ZTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UobiwgMSk7XG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50VHlwZSwgdHVwbGVbM10pO1xuICAgIH1cbiAgfVxufTtcblxuZXh0ZW5kKFB1Ymxpc2hlciwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XG5QdWJsaXNoZXIudHJpZ2dlciA9IFB1Ymxpc2hlci5lbWl0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFB1Ymxpc2hlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9taXhpbnMvcHVibGlzaGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbW1vbkVsZW1lbnQ6IGZ1bmN0aW9uKGxpc3RhLCBsaXN0Yikge1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbGlzdGEubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5pbmRleE9mKGxpc3RiLCBsaXN0YVtpXSkgIT09IC0xKVxuICAgICAgICByZXR1cm4gbGlzdGFbaV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIGluZGV4T2Y6IGZ1bmN0aW9uKGxpc3QsIG5lZWRsZSkge1xuICAgIGlmIChsaXN0LmluZGV4T2YpIHJldHVybiBsaXN0LmluZGV4T2YobmVlZGxlKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbGlzdC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBuZWVkbGUpIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH0sXG5cbiAgbWFwOiBmdW5jdGlvbihvYmplY3QsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iamVjdC5tYXApIHJldHVybiBvYmplY3QubWFwKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gb2JqZWN0Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICByZXN1bHQucHVzaChjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbnVsbCwgb2JqZWN0W2ldLCBpKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBudWxsLCBrZXksIG9iamVjdFtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgZmlsdGVyOiBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoYXJyYXkuZmlsdGVyKSByZXR1cm4gYXJyYXkuZmlsdGVyKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbnVsbCwgYXJyYXlbaV0sIGkpKVxuICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG5cbiAgYXN5bmNFYWNoOiBmdW5jdGlvbihsaXN0LCBpdGVyYXRvciwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgbiAgICAgICA9IGxpc3QubGVuZ3RoLFxuICAgICAgICBpICAgICAgID0gLTEsXG4gICAgICAgIGNhbGxzICAgPSAwLFxuICAgICAgICBsb29waW5nID0gZmFsc2U7XG5cbiAgICB2YXIgaXRlcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbHMgLT0gMTtcbiAgICAgIGkgKz0gMTtcbiAgICAgIGlmIChpID09PSBuKSByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgIGl0ZXJhdG9yKGxpc3RbaV0sIHJlc3VtZSk7XG4gICAgfTtcblxuICAgIHZhciBsb29wID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAobG9vcGluZykgcmV0dXJuO1xuICAgICAgbG9vcGluZyA9IHRydWU7XG4gICAgICB3aGlsZSAoY2FsbHMgPiAwKSBpdGVyYXRlKCk7XG4gICAgICBsb29waW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHZhciByZXN1bWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxzICs9IDE7XG4gICAgICBsb29wKCk7XG4gICAgfTtcbiAgICByZXN1bWUoKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2FycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudCA9IHtcbiAgX3JlZ2lzdHJ5OiBbXSxcblxuICBvbjogZnVuY3Rpb24oZWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciB3cmFwcGVkID0gZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCkgfTtcblxuICAgIGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB3cmFwcGVkLCBmYWxzZSk7XG4gICAgZWxzZVxuICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCB3cmFwcGVkKTtcblxuICAgIHRoaXMuX3JlZ2lzdHJ5LnB1c2goe1xuICAgICAgX2VsZW1lbnQ6ICAgZWxlbWVudCxcbiAgICAgIF90eXBlOiAgICAgIGV2ZW50TmFtZSxcbiAgICAgIF9jYWxsYmFjazogIGNhbGxiYWNrLFxuICAgICAgX2NvbnRleHQ6ICAgICBjb250ZXh0LFxuICAgICAgX2hhbmRsZXI6ICAgd3JhcHBlZFxuICAgIH0pO1xuICB9LFxuXG4gIGRldGFjaDogZnVuY3Rpb24oZWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBpID0gdGhpcy5fcmVnaXN0cnkubGVuZ3RoLCByZWdpc3RlcjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICByZWdpc3RlciA9IHRoaXMuX3JlZ2lzdHJ5W2ldO1xuXG4gICAgICBpZiAoKGVsZW1lbnQgICAgJiYgZWxlbWVudCAgICAhPT0gcmVnaXN0ZXIuX2VsZW1lbnQpICB8fFxuICAgICAgICAgIChldmVudE5hbWUgICYmIGV2ZW50TmFtZSAgIT09IHJlZ2lzdGVyLl90eXBlKSAgICAgfHxcbiAgICAgICAgICAoY2FsbGJhY2sgICAmJiBjYWxsYmFjayAgICE9PSByZWdpc3Rlci5fY2FsbGJhY2spIHx8XG4gICAgICAgICAgKGNvbnRleHQgICAgJiYgY29udGV4dCAgICAhPT0gcmVnaXN0ZXIuX2NvbnRleHQpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHJlZ2lzdGVyLl9lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICAgIHJlZ2lzdGVyLl9lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIocmVnaXN0ZXIuX3R5cGUsIHJlZ2lzdGVyLl9oYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlXG4gICAgICAgIHJlZ2lzdGVyLl9lbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyByZWdpc3Rlci5fdHlwZSwgcmVnaXN0ZXIuX2hhbmRsZXIpO1xuXG4gICAgICB0aGlzLl9yZWdpc3RyeS5zcGxpY2UoaSwxKTtcbiAgICAgIHJlZ2lzdGVyID0gbnVsbDtcbiAgICB9XG4gIH1cbn07XG5cbmlmIChnbG9iYWwub251bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgRXZlbnQub24oZ2xvYmFsLCAndW5sb2FkJywgRXZlbnQuZGV0YWNoLCBFdmVudCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBFdmVudDogRXZlbnRcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9icm93c2VyL2V2ZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb3B5T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjbG9uZSwgaSwga2V5O1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBjbG9uZSA9IFtdO1xuICAgIGkgPSBvYmplY3QubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIGNsb25lW2ldID0gY29weU9iamVjdChvYmplY3RbaV0pO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jykge1xuICAgIGNsb25lID0gKG9iamVjdCA9PT0gbnVsbCkgPyBudWxsIDoge307XG4gICAgZm9yIChrZXkgaW4gb2JqZWN0KSBjbG9uZVtrZXldID0gY29weU9iamVjdChvYmplY3Rba2V5XSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2NvcHlfb2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBQdWJsaXNoZXIgPSByZXF1aXJlKCcuLi9taXhpbnMvcHVibGlzaGVyJyksXG4gICAgR3JhbW1hciAgID0gcmVxdWlyZSgnLi9ncmFtbWFyJyk7XG5cbnZhciBDaGFubmVsID0gQ2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5pZCA9IHRoaXMubmFtZSA9IG5hbWU7XG4gIH0sXG5cbiAgcHVzaDogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHRoaXMudHJpZ2dlcignbWVzc2FnZScsIG1lc3NhZ2UpO1xuICB9LFxuXG4gIGlzVW51c2VkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudExpc3RlbmVycygnbWVzc2FnZScpID09PSAwO1xuICB9XG59KTtcblxuZXh0ZW5kKENoYW5uZWwucHJvdG90eXBlLCBQdWJsaXNoZXIpO1xuXG5leHRlbmQoQ2hhbm5lbCwge1xuICBIQU5EU0hBS0U6ICAgICcvbWV0YS9oYW5kc2hha2UnLFxuICBDT05ORUNUOiAgICAgICcvbWV0YS9jb25uZWN0JyxcbiAgU1VCU0NSSUJFOiAgICAnL21ldGEvc3Vic2NyaWJlJyxcbiAgVU5TVUJTQ1JJQkU6ICAnL21ldGEvdW5zdWJzY3JpYmUnLFxuICBESVNDT05ORUNUOiAgICcvbWV0YS9kaXNjb25uZWN0JyxcblxuICBNRVRBOiAgICAgICAgICdtZXRhJyxcbiAgU0VSVklDRTogICAgICAnc2VydmljZScsXG5cbiAgZXhwYW5kOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHNlZ21lbnRzID0gdGhpcy5wYXJzZShuYW1lKSxcbiAgICAgICAgY2hhbm5lbHMgPSBbJy8qKicsIG5hbWVdO1xuXG4gICAgdmFyIGNvcHkgPSBzZWdtZW50cy5zbGljZSgpO1xuICAgIGNvcHlbY29weS5sZW5ndGggLSAxXSA9ICcqJztcbiAgICBjaGFubmVscy5wdXNoKHRoaXMudW5wYXJzZShjb3B5KSk7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgY29weSA9IHNlZ21lbnRzLnNsaWNlKDAsIGkpO1xuICAgICAgY29weS5wdXNoKCcqKicpO1xuICAgICAgY2hhbm5lbHMucHVzaCh0aGlzLnVucGFyc2UoY29weSkpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFubmVscztcbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIEdyYW1tYXIuQ0hBTk5FTF9OQU1FLnRlc3QobmFtZSkgfHxcbiAgICAgICAgICAgR3JhbW1hci5DSEFOTkVMX1BBVFRFUk4udGVzdChuYW1lKTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKG5hbWUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gbmFtZS5zcGxpdCgnLycpLnNsaWNlKDEpO1xuICB9LFxuXG4gIHVucGFyc2U6IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XG4gICAgcmV0dXJuICcvJyArIHNlZ21lbnRzLmpvaW4oJy8nKTtcbiAgfSxcblxuICBpc01ldGE6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnBhcnNlKG5hbWUpO1xuICAgIHJldHVybiBzZWdtZW50cyA/IChzZWdtZW50c1swXSA9PT0gdGhpcy5NRVRBKSA6IG51bGw7XG4gIH0sXG5cbiAgaXNTZXJ2aWNlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHNlZ21lbnRzID0gdGhpcy5wYXJzZShuYW1lKTtcbiAgICByZXR1cm4gc2VnbWVudHMgPyAoc2VnbWVudHNbMF0gPT09IHRoaXMuU0VSVklDRSkgOiBudWxsO1xuICB9LFxuXG4gIGlzU3Vic2NyaWJhYmxlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQobmFtZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiAhdGhpcy5pc01ldGEobmFtZSkgJiYgIXRoaXMuaXNTZXJ2aWNlKG5hbWUpO1xuICB9LFxuXG4gIFNldDogQ2xhc3Moe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcbiAgICB9LFxuXG4gICAgZ2V0S2V5czogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2NoYW5uZWxzKSBrZXlzLnB1c2goa2V5KTtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tuYW1lXTtcbiAgICB9LFxuXG4gICAgaGFzU3Vic2NyaXB0aW9uOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHMuaGFzT3duUHJvcGVydHkobmFtZSk7XG4gICAgfSxcblxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24obmFtZXMsIHN1YnNjcmlwdGlvbikge1xuICAgICAgdmFyIG5hbWU7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IG5hbWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBuYW1lID0gbmFtZXNbaV07XG4gICAgICAgIHZhciBjaGFubmVsID0gdGhpcy5fY2hhbm5lbHNbbmFtZV0gPSB0aGlzLl9jaGFubmVsc1tuYW1lXSB8fCBuZXcgQ2hhbm5lbChuYW1lKTtcbiAgICAgICAgY2hhbm5lbC5iaW5kKCdtZXNzYWdlJywgc3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKG5hbWUsIHN1YnNjcmlwdGlvbikge1xuICAgICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tuYW1lXTtcbiAgICAgIGlmICghY2hhbm5lbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgY2hhbm5lbC51bmJpbmQoJ21lc3NhZ2UnLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICBpZiAoY2hhbm5lbC5pc1VudXNlZCgpKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKG5hbWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZGlzdHJpYnV0ZU1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBjaGFubmVscyA9IENoYW5uZWwuZXhwYW5kKG1lc3NhZ2UuY2hhbm5lbCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gY2hhbm5lbHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbHNbaV1dO1xuICAgICAgICBpZiAoY2hhbm5lbCkgY2hhbm5lbC50cmlnZ2VyKCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9KVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhbm5lbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9jaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDSEFOTkVMX05BTUU6ICAgICAvXlxcLygoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKSkpKyhcXC8oKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCkpKSspKiQvLFxuICBDSEFOTkVMX1BBVFRFUk46ICAvXihcXC8oKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCkpKSspKlxcL1xcKnsxLDJ9JC8sXG4gIEVSUk9SOiAgICAgICAgICAgIC9eKFswLTldWzAtOV1bMC05XTooKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCl8IHxcXC98XFwqfFxcLikpKigsKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSopKjooKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCl8IHxcXC98XFwqfFxcLikpKnxbMC05XVswLTldWzAtOV06OigoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKXwgfFxcL3xcXCp8XFwuKSkqKSQvLFxuICBWRVJTSU9OOiAgICAgICAgICAvXihbMC05XSkrKFxcLigoW2Etel18W0EtWl0pfFswLTldKSgoKChbYS16XXxbQS1aXSl8WzAtOV0pfFxcLXxcXF8pKSopKiQvXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2dyYW1tYXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyk7XG5cbnZhciBTY2hlZHVsZXIgPSBmdW5jdGlvbihtZXNzYWdlLCBvcHRpb25zKSB7XG4gIHRoaXMubWVzc2FnZSAgPSBtZXNzYWdlO1xuICB0aGlzLm9wdGlvbnMgID0gb3B0aW9ucztcbiAgdGhpcy5hdHRlbXB0cyA9IDA7XG59O1xuXG5leHRlbmQoU2NoZWR1bGVyLnByb3RvdHlwZSwge1xuICBnZXRUaW1lb3V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnRpbWVvdXQ7XG4gIH0sXG5cbiAgZ2V0SW50ZXJ2YWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW50ZXJ2YWw7XG4gIH0sXG5cbiAgaXNEZWxpdmVyYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0dGVtcHRzID0gdGhpcy5vcHRpb25zLmF0dGVtcHRzLFxuICAgICAgICBtYWRlICAgICA9IHRoaXMuYXR0ZW1wdHMsXG4gICAgICAgIGRlYWRsaW5lID0gdGhpcy5vcHRpb25zLmRlYWRsaW5lLFxuICAgICAgICBub3cgICAgICA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGF0dGVtcHRzICE9PSB1bmRlZmluZWQgJiYgbWFkZSA+PSBhdHRlbXB0cylcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChkZWFkbGluZSAhPT0gdW5kZWZpbmVkICYmIG5vdyA+IGRlYWRsaW5lKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgc2VuZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hdHRlbXB0cyArPSAxO1xuICB9LFxuXG4gIHN1Y2NlZWQ6IGZ1bmN0aW9uKCkge30sXG5cbiAgZmFpbDogZnVuY3Rpb24oKSB7fSxcblxuICBhYm9ydDogZnVuY3Rpb24oKSB7fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZWR1bGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL3NjaGVkdWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFVSSSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgYnJvd3NlciAgID0gcmVxdWlyZSgnLi4vdXRpbC9icm93c2VyJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG52YXIgWEhSID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuICBlbmNvZGU6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIHRvSlNPTihtZXNzYWdlcyk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB2YXIgaHJlZiA9IHRoaXMuZW5kcG9pbnQuaHJlZixcbiAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgIHhocjtcblxuICAgIC8vIFByZWZlciBYTUxIdHRwUmVxdWVzdCBvdmVyIEFjdGl2ZVhPYmplY3QgaWYgdGhleSBib3RoIGV4aXN0XG4gICAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdCkge1xuICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSBlbHNlIGlmIChnbG9iYWwuQWN0aXZlWE9iamVjdCkge1xuICAgICAgeGhyID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfVxuXG4gICAgeGhyLm9wZW4oJ1BPU1QnLCBocmVmLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcblxuICAgIHZhciBoZWFkZXJzID0gdGhpcy5fZGlzcGF0Y2hlci5oZWFkZXJzO1xuICAgIGZvciAodmFyIGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG4gICAgfVxuXG4gICAgdmFyIGFib3J0ID0gZnVuY3Rpb24oKSB7IHhoci5hYm9ydCgpIH07XG4gICAgaWYgKGdsb2JhbC5vbmJlZm9yZXVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgYnJvd3Nlci5FdmVudC5vbihnbG9iYWwsICdiZWZvcmV1bmxvYWQnLCBhYm9ydCk7XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXhociB8fCB4aHIucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xuXG4gICAgICB2YXIgcmVwbGllcyAgICA9IG51bGwsXG4gICAgICAgICAgc3RhdHVzICAgICA9IHhoci5zdGF0dXMsXG4gICAgICAgICAgdGV4dCAgICAgICA9IHhoci5yZXNwb25zZVRleHQsXG4gICAgICAgICAgc3VjY2Vzc2Z1bCA9IChzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCkgfHwgc3RhdHVzID09PSAzMDQgfHwgc3RhdHVzID09PSAxMjIzO1xuXG4gICAgICBpZiAoZ2xvYmFsLm9uYmVmb3JldW5sb2FkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGJyb3dzZXIuRXZlbnQuZGV0YWNoKGdsb2JhbCwgJ2JlZm9yZXVubG9hZCcsIGFib3J0KTtcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge307XG4gICAgICB4aHIgPSBudWxsO1xuXG4gICAgICBpZiAoIXN1Y2Nlc3NmdWwpIHJldHVybiBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcGxpZXMgPSBKU09OLnBhcnNlKHRleHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgIGlmIChyZXBsaWVzKVxuICAgICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgICAgZWxzZVxuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIHhoci5zZW5kKHRoaXMuZW5jb2RlKG1lc3NhZ2VzKSk7XG4gICAgcmV0dXJuIHhocjtcbiAgfVxufSksIHtcbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciB1c2FibGUgPSAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpXG4gICAgICAgICAgICAgIHx8IFVSSS5pc1NhbWVPcmlnaW4oZW5kcG9pbnQpO1xuXG4gICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB1c2FibGUpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBYSFI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L3hoci5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFZFUlNJT046ICAgICAgICAgICcxLjIuNCcsXG5cbiAgQkFZRVVYX1ZFUlNJT046ICAgJzEuMCcsXG4gIElEX0xFTkdUSDogICAgICAgIDE2MCxcbiAgSlNPTlBfQ0FMTEJBQ0s6ICAgJ2pzb25wY2FsbGJhY2snLFxuICBDT05ORUNUSU9OX1RZUEVTOiBbJ2xvbmctcG9sbGluZycsICdjcm9zcy1vcmlnaW4tbG9uZy1wb2xsaW5nJywgJ2NhbGxiYWNrLXBvbGxpbmcnLCAnd2Vic29ja2V0JywgJ2V2ZW50c291cmNlJywgJ2luLXByb2Nlc3MnXSxcblxuICBNQU5EQVRPUllfQ09OTkVDVElPTl9UWVBFUzogWydsb25nLXBvbGxpbmcnLCAnY2FsbGJhY2stcG9sbGluZycsICdpbi1wcm9jZXNzJ11cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9jb25zdGFudHMuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2Nvb2tpZXMvYnJvd3Nlcl9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyA9IHJlcXVpcmUoJy4vY2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2luZGV4ID0ge307XG4gIH0sXG5cbiAgYWRkOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGtleSA9IChpdGVtLmlkICE9PSB1bmRlZmluZWQpID8gaXRlbS5pZCA6IGl0ZW07XG4gICAgaWYgKHRoaXMuX2luZGV4Lmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLl9pbmRleFtrZXldID0gaXRlbTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBmb3JFYWNoOiBmdW5jdGlvbihibG9jaywgY29udGV4dCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9pbmRleCkge1xuICAgICAgaWYgKHRoaXMuX2luZGV4Lmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgIGJsb2NrLmNhbGwoY29udGV4dCwgdGhpcy5faW5kZXhba2V5XSk7XG4gICAgfVxuICB9LFxuXG4gIGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9pbmRleCkge1xuICAgICAgaWYgKHRoaXMuX2luZGV4Lmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgbWVtYmVyOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2luZGV4KSB7XG4gICAgICBpZiAodGhpcy5faW5kZXhba2V5XSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIga2V5ID0gKGl0ZW0uaWQgIT09IHVuZGVmaW5lZCkgPyBpdGVtLmlkIDogaXRlbTtcbiAgICB2YXIgcmVtb3ZlZCA9IHRoaXMuX2luZGV4W2tleV07XG4gICAgZGVsZXRlIHRoaXMuX2luZGV4W2tleV07XG4gICAgcmV0dXJuIHJlbW92ZWQ7XG4gIH0sXG5cbiAgdG9BcnJheTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgYXJyYXkucHVzaChpdGVtKSB9KTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvc2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL3V0aWwvY29uc3RhbnRzJyksXG4gICAgTG9nZ2luZyAgID0gcmVxdWlyZSgnLi9taXhpbnMvbG9nZ2luZycpO1xuXG52YXIgRmF5ZSA9IHtcbiAgVkVSU0lPTjogICAgY29uc3RhbnRzLlZFUlNJT04sXG5cbiAgQ2xpZW50OiAgICAgcmVxdWlyZSgnLi9wcm90b2NvbC9jbGllbnQnKSxcbiAgU2NoZWR1bGVyOiAgcmVxdWlyZSgnLi9wcm90b2NvbC9zY2hlZHVsZXInKVxufTtcblxuTG9nZ2luZy53cmFwcGVyID0gRmF5ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYXllO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL2ZheWVfYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkVGltZW91dDogZnVuY3Rpb24obmFtZSwgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fdGltZW91dHMgPSB0aGlzLl90aW1lb3V0cyB8fCB7fTtcbiAgICBpZiAodGhpcy5fdGltZW91dHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHJldHVybjtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fdGltZW91dHNbbmFtZV0gPSBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGRlbGV0ZSBzZWxmLl90aW1lb3V0c1tuYW1lXTtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgfSwgMTAwMCAqIGRlbGF5KTtcbiAgfSxcblxuICByZW1vdmVUaW1lb3V0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5fdGltZW91dHMgPSB0aGlzLl90aW1lb3V0cyB8fCB7fTtcbiAgICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXRzW25hbWVdO1xuICAgIGlmICghdGltZW91dCkgcmV0dXJuO1xuICAgIGdsb2JhbC5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgZGVsZXRlIHRoaXMuX3RpbWVvdXRzW25hbWVdO1xuICB9LFxuXG4gIHJlbW92ZUFsbFRpbWVvdXRzOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl90aW1lb3V0cyA9IHRoaXMuX3RpbWVvdXRzIHx8IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5fdGltZW91dHMpIHRoaXMucmVtb3ZlVGltZW91dChuYW1lKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9taXhpbnMvdGltZW91dHMuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzYXAgICAgICAgICAgICA9IHJlcXVpcmUoJ2FzYXAnKSxcbiAgICBDbGFzcyAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgUHJvbWlzZSAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9wcm9taXNlJyksXG4gICAgVVJJICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBhcnJheSAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2FycmF5JyksXG4gICAgYnJvd3NlciAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9icm93c2VyJyksXG4gICAgY29uc3RhbnRzICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jb25zdGFudHMnKSxcbiAgICBleHRlbmQgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvdmFsaWRhdGVfb3B0aW9ucycpLFxuICAgIERlZmVycmFibGUgICAgICA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyksXG4gICAgTG9nZ2luZyAgICAgICAgID0gcmVxdWlyZSgnLi4vbWl4aW5zL2xvZ2dpbmcnKSxcbiAgICBQdWJsaXNoZXIgICAgICAgPSByZXF1aXJlKCcuLi9taXhpbnMvcHVibGlzaGVyJyksXG4gICAgQ2hhbm5lbCAgICAgICAgID0gcmVxdWlyZSgnLi9jaGFubmVsJyksXG4gICAgRGlzcGF0Y2hlciAgICAgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyksXG4gICAgRXJyb3IgICAgICAgICAgID0gcmVxdWlyZSgnLi9lcnJvcicpLFxuICAgIEV4dGVuc2libGUgICAgICA9IHJlcXVpcmUoJy4vZXh0ZW5zaWJsZScpLFxuICAgIFB1YmxpY2F0aW9uICAgICA9IHJlcXVpcmUoJy4vcHVibGljYXRpb24nKSxcbiAgICBTdWJzY3JpcHRpb24gICAgPSByZXF1aXJlKCcuL3N1YnNjcmlwdGlvbicpO1xuXG52YXIgQ2xpZW50ID0gQ2xhc3MoeyBjbGFzc05hbWU6ICdDbGllbnQnLFxuICBVTkNPTk5FQ1RFRDogICAgICAgIDEsXG4gIENPTk5FQ1RJTkc6ICAgICAgICAgMixcbiAgQ09OTkVDVEVEOiAgICAgICAgICAzLFxuICBESVNDT05ORUNURUQ6ICAgICAgIDQsXG5cbiAgSEFORFNIQUtFOiAgICAgICAgICAnaGFuZHNoYWtlJyxcbiAgUkVUUlk6ICAgICAgICAgICAgICAncmV0cnknLFxuICBOT05FOiAgICAgICAgICAgICAgICdub25lJyxcblxuICBDT05ORUNUSU9OX1RJTUVPVVQ6IDYwLFxuXG4gIERFRkFVTFRfRU5EUE9JTlQ6ICAgJy9iYXlldXgnLFxuICBJTlRFUlZBTDogICAgICAgICAgIDAsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZW5kcG9pbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmluZm8oJ05ldyBjbGllbnQgY3JlYXRlZCBmb3IgPycsIGVuZHBvaW50KTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zLCBbJ2ludGVydmFsJywgJ3RpbWVvdXQnLCAnZW5kcG9pbnRzJywgJ3Byb3h5JywgJ3JldHJ5JywgJ3NjaGVkdWxlcicsICd3ZWJzb2NrZXRFeHRlbnNpb25zJywgJ3RscycsICdjYSddKTtcblxuICAgIHRoaXMuX2NoYW5uZWxzICAgPSBuZXcgQ2hhbm5lbC5TZXQoKTtcbiAgICB0aGlzLl9kaXNwYXRjaGVyID0gRGlzcGF0Y2hlci5jcmVhdGUodGhpcywgZW5kcG9pbnQgfHwgdGhpcy5ERUZBVUxUX0VORFBPSU5ULCBvcHRpb25zKTtcblxuICAgIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgdGhpcy5fc3RhdGUgICAgID0gdGhpcy5VTkNPTk5FQ1RFRDtcblxuICAgIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzID0ge307XG5cbiAgICB0aGlzLl9hZHZpY2UgPSB7XG4gICAgICByZWNvbm5lY3Q6IHRoaXMuUkVUUlksXG4gICAgICBpbnRlcnZhbDogIDEwMDAgKiAob3B0aW9ucy5pbnRlcnZhbCB8fCB0aGlzLklOVEVSVkFMKSxcbiAgICAgIHRpbWVvdXQ6ICAgMTAwMCAqIChvcHRpb25zLnRpbWVvdXQgIHx8IHRoaXMuQ09OTkVDVElPTl9USU1FT1VUKVxuICAgIH07XG4gICAgdGhpcy5fZGlzcGF0Y2hlci50aW1lb3V0ID0gdGhpcy5fYWR2aWNlLnRpbWVvdXQgLyAxMDAwO1xuXG4gICAgdGhpcy5fZGlzcGF0Y2hlci5iaW5kKCdtZXNzYWdlJywgdGhpcy5fcmVjZWl2ZU1lc3NhZ2UsIHRoaXMpO1xuXG4gICAgaWYgKGJyb3dzZXIuRXZlbnQgJiYgZ2xvYmFsLm9uYmVmb3JldW5sb2FkICE9PSB1bmRlZmluZWQpXG4gICAgICBicm93c2VyLkV2ZW50Lm9uKGdsb2JhbCwgJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXJyYXkuaW5kZXhPZih0aGlzLl9kaXNwYXRjaGVyLl9kaXNhYmxlZCwgJ2F1dG9kaXNjb25uZWN0JykgPCAwKVxuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgYWRkV2Vic29ja2V0RXh0ZW5zaW9uOiBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlci5hZGRXZWJzb2NrZXRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgfSxcblxuICBkaXNhYmxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXIuZGlzYWJsZShmZWF0dXJlKTtcbiAgfSxcblxuICBzZXRIZWFkZXI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXIuc2V0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0XG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIHZlcnNpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBzdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXNcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBtaW5pbXVtVmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAqIGlkXG4gIC8vXG4gIC8vIFN1Y2Nlc3MgUmVzcG9uc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZhaWxlZCBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiB2ZXJzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vICAgICAgICAgICAgICAgICogc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzICAgICAgICAgICAgICAgICAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBzdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXNcbiAgLy8gICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhZHZpY2VcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBtaW5pbXVtVmVyc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB2ZXJzaW9uXG4gIC8vICAgICAgICAgICAgICAgICogYWR2aWNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogbWluaW11bVZlcnNpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAqIGF1dGhTdWNjZXNzZnVsXG4gIGhhbmRzaGFrZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAodGhpcy5fYWR2aWNlLnJlY29ubmVjdCA9PT0gdGhpcy5OT05FKSByZXR1cm47XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSB0aGlzLlVOQ09OTkVDVEVEKSByZXR1cm47XG5cbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuQ09OTkVDVElORztcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmluZm8oJ0luaXRpYXRpbmcgaGFuZHNoYWtlIHdpdGggPycsIFVSSS5zdHJpbmdpZnkodGhpcy5fZGlzcGF0Y2hlci5lbmRwb2ludCkpO1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIuc2VsZWN0VHJhbnNwb3J0KGNvbnN0YW50cy5NQU5EQVRPUllfQ09OTkVDVElPTl9UWVBFUyk7XG5cbiAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICBjaGFubmVsOiAgICAgICAgICAgICAgICAgIENoYW5uZWwuSEFORFNIQUtFLFxuICAgICAgdmVyc2lvbjogICAgICAgICAgICAgICAgICBjb25zdGFudHMuQkFZRVVYX1ZFUlNJT04sXG4gICAgICBzdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXM6IHRoaXMuX2Rpc3BhdGNoZXIuZ2V0Q29ubmVjdGlvblR5cGVzKClcblxuICAgIH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzc2Z1bCkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuQ09OTkVDVEVEO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkICA9IHJlc3BvbnNlLmNsaWVudElkO1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuc2VsZWN0VHJhbnNwb3J0KHJlc3BvbnNlLnN1cHBvcnRlZENvbm5lY3Rpb25UeXBlcyk7XG5cbiAgICAgICAgdGhpcy5pbmZvKCdIYW5kc2hha2Ugc3VjY2Vzc2Z1bDogPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlKHRoaXMuX2NoYW5uZWxzLmdldEtleXMoKSwgdHJ1ZSk7XG4gICAgICAgIGlmIChjYWxsYmFjaykgYXNhcChmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0KSB9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmZvKCdIYW5kc2hha2UgdW5zdWNjZXNzZnVsJyk7XG4gICAgICAgIGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzZWxmLmhhbmRzaGFrZShjYWxsYmFjaywgY29udGV4dCkgfSwgdGhpcy5fZGlzcGF0Y2hlci5yZXRyeSAqIDEwMDApO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuVU5DT05ORUNURUQ7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyAgICAgICAgICAgICAgICAqIGNvbm5lY3Rpb25UeXBlICAgICAgICAgICAgICAgICAgICAgKiBjbGllbnRJZFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGV4dCAgICAgICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhZHZpY2VcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHRpbWVzdGFtcFxuICBjb25uZWN0OiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICh0aGlzLl9hZHZpY2UucmVjb25uZWN0ID09PSB0aGlzLk5PTkUpIHJldHVybjtcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHRoaXMuRElTQ09OTkVDVEVEKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHRoaXMuVU5DT05ORUNURUQpXG4gICAgICByZXR1cm4gdGhpcy5oYW5kc2hha2UoZnVuY3Rpb24oKSB7IHRoaXMuY29ubmVjdChjYWxsYmFjaywgY29udGV4dCkgfSwgdGhpcyk7XG5cbiAgICB0aGlzLmNhbGxiYWNrKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuQ09OTkVDVEVEKSByZXR1cm47XG5cbiAgICB0aGlzLmluZm8oJ0NhbGxpbmcgZGVmZXJyZWQgYWN0aW9ucyBmb3IgPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuICAgIHRoaXMuc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgIHRoaXMuc2V0RGVmZXJyZWRTdGF0dXMoJ3Vua25vd24nKTtcblxuICAgIGlmICh0aGlzLl9jb25uZWN0UmVxdWVzdCkgcmV0dXJuO1xuICAgIHRoaXMuX2Nvbm5lY3RSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHRoaXMuaW5mbygnSW5pdGlhdGluZyBjb25uZWN0aW9uIGZvciA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG5cbiAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICBjaGFubmVsOiAgICAgICAgQ2hhbm5lbC5DT05ORUNULFxuICAgICAgY2xpZW50SWQ6ICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsXG4gICAgICBjb25uZWN0aW9uVHlwZTogdGhpcy5fZGlzcGF0Y2hlci5jb25uZWN0aW9uVHlwZVxuXG4gICAgfSwge30sIHRoaXMuX2N5Y2xlQ29ubmVjdGlvbiwgdGhpcyk7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBjbGllbnRJZFxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgZGlzY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSB0aGlzLkNPTk5FQ1RFRCkgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5ESVNDT05ORUNURUQ7XG5cbiAgICB0aGlzLmluZm8oJ0Rpc2Nvbm5lY3RpbmcgPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuICAgIHZhciBwcm9taXNlID0gbmV3IFB1YmxpY2F0aW9uKCk7XG5cbiAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICBjaGFubmVsOiAgQ2hhbm5lbC5ESVNDT05ORUNULFxuICAgICAgY2xpZW50SWQ6IHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWRcblxuICAgIH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3NmdWwpIHtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbG9zZSgpO1xuICAgICAgICBwcm9taXNlLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb21pc2Uuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcsIEVycm9yLnBhcnNlKHJlc3BvbnNlLmVycm9yKSk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLmluZm8oJ0NsZWFyaW5nIGNoYW5uZWwgbGlzdGVuZXJzIGZvciA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgdGhpcy5fY2hhbm5lbHMgPSBuZXcgQ2hhbm5lbC5TZXQoKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICogY2xpZW50SWRcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3Vic2NyaXB0aW9uXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdGltZXN0YW1wXG4gIHN1YnNjcmliZTogZnVuY3Rpb24oY2hhbm5lbCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoY2hhbm5lbCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgcmV0dXJuIGFycmF5Lm1hcChjaGFubmVsLCBmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZShjLCBjYWxsYmFjaywgY29udGV4dCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrLCBjb250ZXh0KSxcbiAgICAgICAgZm9yY2UgICAgICAgID0gKGNhbGxiYWNrID09PSB0cnVlKSxcbiAgICAgICAgaGFzU3Vic2NyaWJlID0gdGhpcy5fY2hhbm5lbHMuaGFzU3Vic2NyaXB0aW9uKGNoYW5uZWwpO1xuXG4gICAgaWYgKGhhc1N1YnNjcmliZSAmJiAhZm9yY2UpIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxzLnN1YnNjcmliZShbY2hhbm5lbF0sIHN1YnNjcmlwdGlvbik7XG4gICAgICBzdWJzY3JpcHRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmluZm8oJ0NsaWVudCA/IGF0dGVtcHRpbmcgdG8gc3Vic2NyaWJlIHRvID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVsKTtcbiAgICAgIGlmICghZm9yY2UpIHRoaXMuX2NoYW5uZWxzLnN1YnNjcmliZShbY2hhbm5lbF0sIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbDogICAgICBDaGFubmVsLlNVQlNDUklCRSxcbiAgICAgICAgY2xpZW50SWQ6ICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLFxuICAgICAgICBzdWJzY3JpcHRpb246IGNoYW5uZWxcblxuICAgICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2Vzc2Z1bCkge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJywgRXJyb3IucGFyc2UocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHMudW5zdWJzY3JpYmUoY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGFubmVscyA9IFtdLmNvbmNhdChyZXNwb25zZS5zdWJzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLmluZm8oJ1N1YnNjcmlwdGlvbiBhY2tub3dsZWRnZWQgZm9yID8gdG8gPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWxzKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vICAgICAgICAgICAgICAgICogc3Vic2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1YnNjcmlwdGlvblxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhZHZpY2VcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHRpbWVzdGFtcFxuICB1bnN1YnNjcmliZTogZnVuY3Rpb24oY2hhbm5lbCwgc3Vic2NyaXB0aW9uKSB7XG4gICAgaWYgKGNoYW5uZWwgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgIHJldHVybiBhcnJheS5tYXAoY2hhbm5lbCwgZnVuY3Rpb24oYykge1xuICAgICAgICByZXR1cm4gdGhpcy51bnN1YnNjcmliZShjLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICB2YXIgZGVhZCA9IHRoaXMuX2NoYW5uZWxzLnVuc3Vic2NyaWJlKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgaWYgKCFkZWFkKSByZXR1cm47XG5cbiAgICB0aGlzLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmluZm8oJ0NsaWVudCA/IGF0dGVtcHRpbmcgdG8gdW5zdWJzY3JpYmUgZnJvbSA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbCk7XG5cbiAgICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbDogICAgICBDaGFubmVsLlVOU1VCU0NSSUJFLFxuICAgICAgICBjbGllbnRJZDogICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsXG4gICAgICAgIHN1YnNjcmlwdGlvbjogY2hhbm5lbFxuXG4gICAgICB9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzZnVsKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGNoYW5uZWxzID0gW10uY29uY2F0KHJlc3BvbnNlLnN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuaW5mbygnVW5zdWJzY3JpcHRpb24gYWNrbm93bGVkZ2VkIGZvciA/IGZyb20gPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWxzKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBjbGllbnRJZCAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIHB1Ymxpc2g6IGZ1bmN0aW9uKGNoYW5uZWwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucyB8fCB7fSwgWydhdHRlbXB0cycsICdkZWFkbGluZSddKTtcbiAgICB2YXIgcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24oKTtcblxuICAgIHRoaXMuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gcXVldWVpbmcgcHVibGlzaGVkIG1lc3NhZ2UgdG8gPzogPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWwsIGRhdGEpO1xuXG4gICAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICAgIGNoYW5uZWw6ICBjaGFubmVsLFxuICAgICAgICBkYXRhOiAgICAgZGF0YSxcbiAgICAgICAgY2xpZW50SWQ6IHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWRcblxuICAgICAgfSwgb3B0aW9ucywgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3NmdWwpXG4gICAgICAgICAgcHVibGljYXRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcHVibGljYXRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcsIEVycm9yLnBhcnNlKHJlc3BvbnNlLmVycm9yKSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBwdWJsaWNhdGlvbjtcbiAgfSxcblxuICBfc2VuZE1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UsIG9wdGlvbnMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgbWVzc2FnZS5pZCA9IHRoaXMuX2dlbmVyYXRlTWVzc2FnZUlkKCk7XG5cbiAgICB2YXIgdGltZW91dCA9IHRoaXMuX2FkdmljZS50aW1lb3V0XG4gICAgICAgICAgICAgICAgPyAxLjIgKiB0aGlzLl9hZHZpY2UudGltZW91dCAvIDEwMDBcbiAgICAgICAgICAgICAgICA6IDEuMiAqIHRoaXMuX2Rpc3BhdGNoZXIucmV0cnk7XG5cbiAgICB0aGlzLnBpcGVUaHJvdWdoRXh0ZW5zaW9ucygnb3V0Z29pbmcnLCBtZXNzYWdlLCBudWxsLCBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcbiAgICAgIGlmIChjYWxsYmFjaykgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbbWVzc2FnZS5pZF0gPSBbY2FsbGJhY2ssIGNvbnRleHRdO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlci5zZW5kTWVzc2FnZShtZXNzYWdlLCB0aW1lb3V0LCBvcHRpb25zIHx8IHt9KTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBfZ2VuZXJhdGVNZXNzYWdlSWQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX21lc3NhZ2VJZCArPSAxO1xuICAgIGlmICh0aGlzLl9tZXNzYWdlSWQgPj0gTWF0aC5wb3coMiwzMikpIHRoaXMuX21lc3NhZ2VJZCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VJZC50b1N0cmluZygzNik7XG4gIH0sXG5cbiAgX3JlY2VpdmVNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdmFyIGlkID0gbWVzc2FnZS5pZCwgY2FsbGJhY2s7XG5cbiAgICBpZiAobWVzc2FnZS5zdWNjZXNzZnVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhbGxiYWNrID0gdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbaWRdO1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW2lkXTtcbiAgICB9XG5cbiAgICB0aGlzLnBpcGVUaHJvdWdoRXh0ZW5zaW9ucygnaW5jb21pbmcnLCBtZXNzYWdlLCBudWxsLCBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcbiAgICAgIGlmIChtZXNzYWdlLmFkdmljZSkgdGhpcy5faGFuZGxlQWR2aWNlKG1lc3NhZ2UuYWR2aWNlKTtcbiAgICAgIHRoaXMuX2RlbGl2ZXJNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFja1swXS5jYWxsKGNhbGxiYWNrWzFdLCBtZXNzYWdlKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBfaGFuZGxlQWR2aWNlOiBmdW5jdGlvbihhZHZpY2UpIHtcbiAgICBleHRlbmQodGhpcy5fYWR2aWNlLCBhZHZpY2UpO1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIudGltZW91dCA9IHRoaXMuX2FkdmljZS50aW1lb3V0IC8gMTAwMDtcblxuICAgIGlmICh0aGlzLl9hZHZpY2UucmVjb25uZWN0ID09PSB0aGlzLkhBTkRTSEFLRSAmJiB0aGlzLl9zdGF0ZSAhPT0gdGhpcy5ESVNDT05ORUNURUQpIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5VTkNPTk5FQ1RFRDtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQgPSBudWxsO1xuICAgICAgdGhpcy5fY3ljbGVDb25uZWN0aW9uKCk7XG4gICAgfVxuICB9LFxuXG4gIF9kZWxpdmVyTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIGlmICghbWVzc2FnZS5jaGFubmVsIHx8IG1lc3NhZ2UuZGF0YSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgdGhpcy5pbmZvKCdDbGllbnQgPyBjYWxsaW5nIGxpc3RlbmVycyBmb3IgPyB3aXRoID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBtZXNzYWdlLmNoYW5uZWwsIG1lc3NhZ2UuZGF0YSk7XG4gICAgdGhpcy5fY2hhbm5lbHMuZGlzdHJpYnV0ZU1lc3NhZ2UobWVzc2FnZSk7XG4gIH0sXG5cbiAgX2N5Y2xlQ29ubmVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2Nvbm5lY3RSZXF1ZXN0KSB7XG4gICAgICB0aGlzLl9jb25uZWN0UmVxdWVzdCA9IG51bGw7XG4gICAgICB0aGlzLmluZm8oJ0Nsb3NlZCBjb25uZWN0aW9uIGZvciA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2VsZi5jb25uZWN0KCkgfSwgdGhpcy5fYWR2aWNlLmludGVydmFsKTtcbiAgfVxufSk7XG5cbmV4dGVuZChDbGllbnQucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcbmV4dGVuZChDbGllbnQucHJvdG90eXBlLCBQdWJsaXNoZXIpO1xuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIExvZ2dpbmcpO1xuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIEV4dGVuc2libGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsaWVudDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9jbGllbnQuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGNvb2tpZXMgICA9IHJlcXVpcmUoJy4uL3V0aWwvY29va2llcycpLFxuICAgIGV4dGVuZCAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgTG9nZ2luZyAgID0gcmVxdWlyZSgnLi4vbWl4aW5zL2xvZ2dpbmcnKSxcbiAgICBQdWJsaXNoZXIgPSByZXF1aXJlKCcuLi9taXhpbnMvcHVibGlzaGVyJyksXG4gICAgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi4vdHJhbnNwb3J0JyksXG4gICAgU2NoZWR1bGVyID0gcmVxdWlyZSgnLi9zY2hlZHVsZXInKTtcblxudmFyIERpc3BhdGNoZXIgPSBDbGFzcyh7IGNsYXNzTmFtZTogJ0Rpc3BhdGNoZXInLFxuICBNQVhfUkVRVUVTVF9TSVpFOiAyMDQ4LFxuICBERUZBVUxUX1JFVFJZOiAgICA1LFxuXG4gIFVQOiAgIDEsXG4gIERPV046IDIsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oY2xpZW50LCBlbmRwb2ludCwgb3B0aW9ucykge1xuICAgIHRoaXMuX2NsaWVudCAgICAgPSBjbGllbnQ7XG4gICAgdGhpcy5lbmRwb2ludCAgICA9IFVSSS5wYXJzZShlbmRwb2ludCk7XG4gICAgdGhpcy5fYWx0ZXJuYXRlcyA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuXG4gICAgdGhpcy5jb29raWVzICAgICAgPSBjb29raWVzLkNvb2tpZUphciAmJiBuZXcgY29va2llcy5Db29raWVKYXIoKTtcbiAgICB0aGlzLl9kaXNhYmxlZCAgICA9IFtdO1xuICAgIHRoaXMuX2VudmVsb3BlcyAgID0ge307XG4gICAgdGhpcy5oZWFkZXJzICAgICAgPSB7fTtcbiAgICB0aGlzLnJldHJ5ICAgICAgICA9IG9wdGlvbnMucmV0cnkgfHwgdGhpcy5ERUZBVUxUX1JFVFJZO1xuICAgIHRoaXMuX3NjaGVkdWxlciAgID0gb3B0aW9ucy5zY2hlZHVsZXIgfHwgU2NoZWR1bGVyO1xuICAgIHRoaXMuX3N0YXRlICAgICAgID0gMDtcbiAgICB0aGlzLnRyYW5zcG9ydHMgICA9IHt9O1xuICAgIHRoaXMud3NFeHRlbnNpb25zID0gW107XG5cbiAgICB0aGlzLnByb3h5ID0gb3B0aW9ucy5wcm94eSB8fCB7fTtcbiAgICBpZiAodHlwZW9mIHRoaXMuX3Byb3h5ID09PSAnc3RyaW5nJykgdGhpcy5fcHJveHkgPSB7b3JpZ2luOiB0aGlzLl9wcm94eX07XG5cbiAgICB2YXIgZXh0cyA9IG9wdGlvbnMud2Vic29ja2V0RXh0ZW5zaW9ucztcbiAgICBpZiAoZXh0cykge1xuICAgICAgZXh0cyA9IFtdLmNvbmNhdChleHRzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gZXh0cy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAgICAgIHRoaXMuYWRkV2Vic29ja2V0RXh0ZW5zaW9uKGV4dHNbaV0pO1xuICAgIH1cblxuICAgIHRoaXMudGxzID0gb3B0aW9ucy50bHMgfHwge307XG4gICAgdGhpcy50bHMuY2EgPSB0aGlzLnRscy5jYSB8fCBvcHRpb25zLmNhO1xuXG4gICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLl9hbHRlcm5hdGVzKVxuICAgICAgdGhpcy5fYWx0ZXJuYXRlc1t0eXBlXSA9IFVSSS5wYXJzZSh0aGlzLl9hbHRlcm5hdGVzW3R5cGVdKTtcblxuICAgIHRoaXMubWF4UmVxdWVzdFNpemUgPSB0aGlzLk1BWF9SRVFVRVNUX1NJWkU7XG4gIH0sXG5cbiAgZW5kcG9pbnRGb3I6IGZ1bmN0aW9uKGNvbm5lY3Rpb25UeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsdGVybmF0ZXNbY29ubmVjdGlvblR5cGVdIHx8IHRoaXMuZW5kcG9pbnQ7XG4gIH0sXG5cbiAgYWRkV2Vic29ja2V0RXh0ZW5zaW9uOiBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICB0aGlzLndzRXh0ZW5zaW9ucy5wdXNoKGV4dGVuc2lvbik7XG4gIH0sXG5cbiAgZGlzYWJsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHRoaXMuX2Rpc2FibGVkLnB1c2goZmVhdHVyZSk7XG4gIH0sXG5cbiAgc2V0SGVhZGVyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy5fdHJhbnNwb3J0O1xuICAgIGRlbGV0ZSB0aGlzLl90cmFuc3BvcnQ7XG4gICAgaWYgKHRyYW5zcG9ydCkgdHJhbnNwb3J0LmNsb3NlKCk7XG4gIH0sXG5cbiAgZ2V0Q29ubmVjdGlvblR5cGVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVHJhbnNwb3J0LmdldENvbm5lY3Rpb25UeXBlcygpO1xuICB9LFxuXG4gIHNlbGVjdFRyYW5zcG9ydDogZnVuY3Rpb24odHJhbnNwb3J0VHlwZXMpIHtcbiAgICBUcmFuc3BvcnQuZ2V0KHRoaXMsIHRyYW5zcG9ydFR5cGVzLCB0aGlzLl9kaXNhYmxlZCwgZnVuY3Rpb24odHJhbnNwb3J0KSB7XG4gICAgICB0aGlzLmRlYnVnKCdTZWxlY3RlZCA/IHRyYW5zcG9ydCBmb3IgPycsIHRyYW5zcG9ydC5jb25uZWN0aW9uVHlwZSwgVVJJLnN0cmluZ2lmeSh0cmFuc3BvcnQuZW5kcG9pbnQpKTtcblxuICAgICAgaWYgKHRyYW5zcG9ydCA9PT0gdGhpcy5fdHJhbnNwb3J0KSByZXR1cm47XG4gICAgICBpZiAodGhpcy5fdHJhbnNwb3J0KSB0aGlzLl90cmFuc3BvcnQuY2xvc2UoKTtcblxuICAgICAgdGhpcy5fdHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICAgICAgdGhpcy5jb25uZWN0aW9uVHlwZSA9IHRyYW5zcG9ydC5jb25uZWN0aW9uVHlwZTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBzZW5kTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSwgdGltZW91dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIGlkICAgICAgID0gbWVzc2FnZS5pZCxcbiAgICAgICAgYXR0ZW1wdHMgPSBvcHRpb25zLmF0dGVtcHRzLFxuICAgICAgICBkZWFkbGluZSA9IG9wdGlvbnMuZGVhZGxpbmUgJiYgbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAob3B0aW9ucy5kZWFkbGluZSAqIDEwMDApLFxuICAgICAgICBlbnZlbG9wZSA9IHRoaXMuX2VudmVsb3Blc1tpZF0sXG4gICAgICAgIHNjaGVkdWxlcjtcblxuICAgIGlmICghZW52ZWxvcGUpIHtcbiAgICAgIHNjaGVkdWxlciA9IG5ldyB0aGlzLl9zY2hlZHVsZXIobWVzc2FnZSwge3RpbWVvdXQ6IHRpbWVvdXQsIGludGVydmFsOiB0aGlzLnJldHJ5LCBhdHRlbXB0czogYXR0ZW1wdHMsIGRlYWRsaW5lOiBkZWFkbGluZX0pO1xuICAgICAgZW52ZWxvcGUgID0gdGhpcy5fZW52ZWxvcGVzW2lkXSA9IHttZXNzYWdlOiBtZXNzYWdlLCBzY2hlZHVsZXI6IHNjaGVkdWxlcn07XG4gICAgfVxuXG4gICAgdGhpcy5fc2VuZEVudmVsb3BlKGVudmVsb3BlKTtcbiAgfSxcblxuICBfc2VuZEVudmVsb3BlOiBmdW5jdGlvbihlbnZlbG9wZSkge1xuICAgIGlmICghdGhpcy5fdHJhbnNwb3J0KSByZXR1cm47XG4gICAgaWYgKGVudmVsb3BlLnJlcXVlc3QgfHwgZW52ZWxvcGUudGltZXIpIHJldHVybjtcblxuICAgIHZhciBtZXNzYWdlICAgPSBlbnZlbG9wZS5tZXNzYWdlLFxuICAgICAgICBzY2hlZHVsZXIgPSBlbnZlbG9wZS5zY2hlZHVsZXIsXG4gICAgICAgIHNlbGYgICAgICA9IHRoaXM7XG5cbiAgICBpZiAoIXNjaGVkdWxlci5pc0RlbGl2ZXJhYmxlKCkpIHtcbiAgICAgIHNjaGVkdWxlci5hYm9ydCgpO1xuICAgICAgZGVsZXRlIHRoaXMuX2VudmVsb3Blc1ttZXNzYWdlLmlkXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbnZlbG9wZS50aW1lciA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5oYW5kbGVFcnJvcihtZXNzYWdlKTtcbiAgICB9LCBzY2hlZHVsZXIuZ2V0VGltZW91dCgpICogMTAwMCk7XG5cbiAgICBzY2hlZHVsZXIuc2VuZCgpO1xuICAgIGVudmVsb3BlLnJlcXVlc3QgPSB0aGlzLl90cmFuc3BvcnQuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gIH0sXG5cbiAgaGFuZGxlUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcGx5KSB7XG4gICAgdmFyIGVudmVsb3BlID0gdGhpcy5fZW52ZWxvcGVzW3JlcGx5LmlkXTtcblxuICAgIGlmIChyZXBseS5zdWNjZXNzZnVsICE9PSB1bmRlZmluZWQgJiYgZW52ZWxvcGUpIHtcbiAgICAgIGVudmVsb3BlLnNjaGVkdWxlci5zdWNjZWVkKCk7XG4gICAgICBkZWxldGUgdGhpcy5fZW52ZWxvcGVzW3JlcGx5LmlkXTtcbiAgICAgIGdsb2JhbC5jbGVhclRpbWVvdXQoZW52ZWxvcGUudGltZXIpO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcignbWVzc2FnZScsIHJlcGx5KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5VUCkgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5VUDtcbiAgICB0aGlzLl9jbGllbnQudHJpZ2dlcigndHJhbnNwb3J0OnVwJyk7XG4gIH0sXG5cbiAgaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2UsIGltbWVkaWF0ZSkge1xuICAgIHZhciBlbnZlbG9wZSA9IHRoaXMuX2VudmVsb3Blc1ttZXNzYWdlLmlkXSxcbiAgICAgICAgcmVxdWVzdCAgPSBlbnZlbG9wZSAmJiBlbnZlbG9wZS5yZXF1ZXN0LFxuICAgICAgICBzZWxmICAgICA9IHRoaXM7XG5cbiAgICBpZiAoIXJlcXVlc3QpIHJldHVybjtcblxuICAgIHJlcXVlc3QudGhlbihmdW5jdGlvbihyZXEpIHtcbiAgICAgIGlmIChyZXEgJiYgcmVxLmFib3J0KSByZXEuYWJvcnQoKTtcbiAgICB9KTtcblxuICAgIHZhciBzY2hlZHVsZXIgPSBlbnZlbG9wZS5zY2hlZHVsZXI7XG4gICAgc2NoZWR1bGVyLmZhaWwoKTtcblxuICAgIGdsb2JhbC5jbGVhclRpbWVvdXQoZW52ZWxvcGUudGltZXIpO1xuICAgIGVudmVsb3BlLnJlcXVlc3QgPSBlbnZlbG9wZS50aW1lciA9IG51bGw7XG5cbiAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICB0aGlzLl9zZW5kRW52ZWxvcGUoZW52ZWxvcGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnZlbG9wZS50aW1lciA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBlbnZlbG9wZS50aW1lciA9IG51bGw7XG4gICAgICAgIHNlbGYuX3NlbmRFbnZlbG9wZShlbnZlbG9wZSk7XG4gICAgICB9LCBzY2hlZHVsZXIuZ2V0SW50ZXJ2YWwoKSAqIDEwMDApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5ET1dOKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLkRPV047XG4gICAgdGhpcy5fY2xpZW50LnRyaWdnZXIoJ3RyYW5zcG9ydDpkb3duJyk7XG4gIH1cbn0pO1xuXG5EaXNwYXRjaGVyLmNyZWF0ZSA9IGZ1bmN0aW9uKGNsaWVudCwgZW5kcG9pbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBEaXNwYXRjaGVyKGNsaWVudCwgZW5kcG9pbnQsIG9wdGlvbnMpO1xufTtcblxuZXh0ZW5kKERpc3BhdGNoZXIucHJvdG90eXBlLCBQdWJsaXNoZXIpO1xuZXh0ZW5kKERpc3BhdGNoZXIucHJvdG90eXBlLCBMb2dnaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2Rpc3BhdGNoZXIuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgR3JhbW1hciA9IHJlcXVpcmUoJy4vZ3JhbW1hcicpO1xuXG52YXIgRXJyb3IgPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNvZGUsIHBhcmFtcywgbWVzc2FnZSkge1xuICAgIHRoaXMuY29kZSAgICA9IGNvZGU7XG4gICAgdGhpcy5wYXJhbXMgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGFyYW1zKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9LFxuXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jb2RlICsgJzonICtcbiAgICAgICAgICAgdGhpcy5wYXJhbXMuam9pbignLCcpICsgJzonICtcbiAgICAgICAgICAgdGhpcy5tZXNzYWdlO1xuICB9XG59KTtcblxuRXJyb3IucGFyc2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuICBpZiAoIUdyYW1tYXIuRVJST1IudGVzdChtZXNzYWdlKSkgcmV0dXJuIG5ldyBFcnJvcihudWxsLCBbXSwgbWVzc2FnZSk7XG5cbiAgdmFyIHBhcnRzICAgPSBtZXNzYWdlLnNwbGl0KCc6JyksXG4gICAgICBjb2RlICAgID0gcGFyc2VJbnQocGFydHNbMF0pLFxuICAgICAgcGFyYW1zICA9IHBhcnRzWzFdLnNwbGl0KCcsJyksXG4gICAgICBtZXNzYWdlID0gcGFydHNbMl07XG5cbiAgcmV0dXJuIG5ldyBFcnJvcihjb2RlLCBwYXJhbXMsIG1lc3NhZ2UpO1xufTtcblxuLy8gaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2NvbWV0ZC93aWtpL0JheWV1eENvZGVzXG52YXIgZXJyb3JzID0ge1xuICB2ZXJzaW9uTWlzbWF0Y2g6ICBbMzAwLCAnVmVyc2lvbiBtaXNtYXRjaCddLFxuICBjb25udHlwZU1pc21hdGNoOiBbMzAxLCAnQ29ubmVjdGlvbiB0eXBlcyBub3Qgc3VwcG9ydGVkJ10sXG4gIGV4dE1pc21hdGNoOiAgICAgIFszMDIsICdFeHRlbnNpb24gbWlzbWF0Y2gnXSxcbiAgYmFkUmVxdWVzdDogICAgICAgWzQwMCwgJ0JhZCByZXF1ZXN0J10sXG4gIGNsaWVudFVua25vd246ICAgIFs0MDEsICdVbmtub3duIGNsaWVudCddLFxuICBwYXJhbWV0ZXJNaXNzaW5nOiBbNDAyLCAnTWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXInXSxcbiAgY2hhbm5lbEZvcmJpZGRlbjogWzQwMywgJ0ZvcmJpZGRlbiBjaGFubmVsJ10sXG4gIGNoYW5uZWxVbmtub3duOiAgIFs0MDQsICdVbmtub3duIGNoYW5uZWwnXSxcbiAgY2hhbm5lbEludmFsaWQ6ICAgWzQwNSwgJ0ludmFsaWQgY2hhbm5lbCddLFxuICBleHRVbmtub3duOiAgICAgICBbNDA2LCAnVW5rbm93biBleHRlbnNpb24nXSxcbiAgcHVibGlzaEZhaWxlZDogICAgWzQwNywgJ0ZhaWxlZCB0byBwdWJsaXNoJ10sXG4gIHNlcnZlckVycm9yOiAgICAgIFs1MDAsICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InXVxufTtcblxuZm9yICh2YXIgbmFtZSBpbiBlcnJvcnMpXG4gIChmdW5jdGlvbihuYW1lKSB7XG4gICAgRXJyb3JbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoZXJyb3JzW25hbWVdWzBdLCBhcmd1bWVudHMsIGVycm9yc1tuYW1lXVsxXSkudG9TdHJpbmcoKTtcbiAgICB9O1xuICB9KShuYW1lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFcnJvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9lcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgTG9nZ2luZyA9IHJlcXVpcmUoJy4uL21peGlucy9sb2dnaW5nJyk7XG5cbnZhciBFeHRlbnNpYmxlID0ge1xuICBhZGRFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSB0aGlzLl9leHRlbnNpb25zIHx8IFtdO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMucHVzaChleHRlbnNpb24pO1xuICAgIGlmIChleHRlbnNpb24uYWRkZWQpIGV4dGVuc2lvbi5hZGRlZCh0aGlzKTtcbiAgfSxcblxuICByZW1vdmVFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIGlmICghdGhpcy5fZXh0ZW5zaW9ucykgcmV0dXJuO1xuICAgIHZhciBpID0gdGhpcy5fZXh0ZW5zaW9ucy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKHRoaXMuX2V4dGVuc2lvbnNbaV0gIT09IGV4dGVuc2lvbikgY29udGludWU7XG4gICAgICB0aGlzLl9leHRlbnNpb25zLnNwbGljZShpLDEpO1xuICAgICAgaWYgKGV4dGVuc2lvbi5yZW1vdmVkKSBleHRlbnNpb24ucmVtb3ZlZCh0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgcGlwZVRocm91Z2hFeHRlbnNpb25zOiBmdW5jdGlvbihzdGFnZSwgbWVzc2FnZSwgcmVxdWVzdCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLmRlYnVnKCdQYXNzaW5nIHRocm91Z2ggPyBleHRlbnNpb25zOiA/Jywgc3RhZ2UsIG1lc3NhZ2UpO1xuXG4gICAgaWYgKCF0aGlzLl9leHRlbnNpb25zKSByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcbiAgICB2YXIgZXh0ZW5zaW9ucyA9IHRoaXMuX2V4dGVuc2lvbnMuc2xpY2UoKTtcblxuICAgIHZhciBwaXBlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKCFtZXNzYWdlKSByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcblxuICAgICAgdmFyIGV4dGVuc2lvbiA9IGV4dGVuc2lvbnMuc2hpZnQoKTtcbiAgICAgIGlmICghZXh0ZW5zaW9uKSByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBtZXNzYWdlKTtcblxuICAgICAgdmFyIGZuID0gZXh0ZW5zaW9uW3N0YWdlXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBwaXBlKG1lc3NhZ2UpO1xuXG4gICAgICBpZiAoZm4ubGVuZ3RoID49IDMpIGV4dGVuc2lvbltzdGFnZV0obWVzc2FnZSwgcmVxdWVzdCwgcGlwZSk7XG4gICAgICBlbHNlICAgICAgICAgICAgICAgIGV4dGVuc2lvbltzdGFnZV0obWVzc2FnZSwgcGlwZSk7XG4gICAgfTtcbiAgICBwaXBlKG1lc3NhZ2UpO1xuICB9XG59O1xuXG5leHRlbmQoRXh0ZW5zaWJsZSwgTG9nZ2luZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXh0ZW5zaWJsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9leHRlbnNpYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIERlZmVycmFibGUgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzKERlZmVycmFibGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL3B1YmxpY2F0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIERlZmVycmFibGUgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpO1xuXG52YXIgU3Vic2NyaXB0aW9uID0gQ2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbihjbGllbnQsIGNoYW5uZWxzLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuX2NsaWVudCAgICA9IGNsaWVudDtcbiAgICB0aGlzLl9jaGFubmVscyAgPSBjaGFubmVscztcbiAgICB0aGlzLl9jYWxsYmFjayAgPSBjYWxsYmFjaztcbiAgICB0aGlzLl9jb250ZXh0ICAgPSBjb250ZXh0O1xuICAgIHRoaXMuX2NhbmNlbGxlZCA9IGZhbHNlO1xuICB9LFxuXG4gIHdpdGhDaGFubmVsOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuX3dpdGhDaGFubmVsID0gW2NhbGxiYWNrLCBjb250ZXh0XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBhcHBseTogZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgIHZhciBtZXNzYWdlID0gYXJnc1swXTtcblxuICAgIGlmICh0aGlzLl9jYWxsYmFjaylcbiAgICAgIHRoaXMuX2NhbGxiYWNrLmNhbGwodGhpcy5fY29udGV4dCwgbWVzc2FnZS5kYXRhKTtcblxuICAgIGlmICh0aGlzLl93aXRoQ2hhbm5lbClcbiAgICAgIHRoaXMuX3dpdGhDaGFubmVsWzBdLmNhbGwodGhpcy5fd2l0aENoYW5uZWxbMV0sIG1lc3NhZ2UuY2hhbm5lbCwgbWVzc2FnZS5kYXRhKTtcbiAgfSxcblxuICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9jYW5jZWxsZWQpIHJldHVybjtcbiAgICB0aGlzLl9jbGllbnQudW5zdWJzY3JpYmUodGhpcy5fY2hhbm5lbHMsIHRoaXMpO1xuICAgIHRoaXMuX2NhbmNlbGxlZCA9IHRydWU7XG4gIH0sXG5cbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gIH1cbn0pO1xuXG5leHRlbmQoU3Vic2NyaXB0aW9uLnByb3RvdHlwZSwgRGVmZXJyYWJsZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3Vic2NyaXB0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL3N1YnNjcmlwdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxuVHJhbnNwb3J0LnJlZ2lzdGVyKCd3ZWJzb2NrZXQnLCByZXF1aXJlKCcuL3dlYl9zb2NrZXQnKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2V2ZW50c291cmNlJywgcmVxdWlyZSgnLi9ldmVudF9zb3VyY2UnKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2xvbmctcG9sbGluZycsIHJlcXVpcmUoJy4veGhyJykpO1xuVHJhbnNwb3J0LnJlZ2lzdGVyKCdjcm9zcy1vcmlnaW4tbG9uZy1wb2xsaW5nJywgcmVxdWlyZSgnLi9jb3JzJykpO1xuVHJhbnNwb3J0LnJlZ2lzdGVyKCdjYWxsYmFjay1wb2xsaW5nJywgcmVxdWlyZSgnLi9qc29ucCcpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2Jyb3dzZXJfdHJhbnNwb3J0cy5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFNldCAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvc2V0JyksXG4gICAgVVJJICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBleHRlbmQgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHRvSlNPTiAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpLFxuICAgIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cbnZhciBDT1JTID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuICBlbmNvZGU6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuICdtZXNzYWdlPScgKyBlbmNvZGVVUklDb21wb25lbnQodG9KU09OKG1lc3NhZ2VzKSk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB2YXIgeGhyQ2xhc3MgPSBnbG9iYWwuWERvbWFpblJlcXVlc3QgPyBYRG9tYWluUmVxdWVzdCA6IFhNTEh0dHBSZXF1ZXN0LFxuICAgICAgICB4aHIgICAgICA9IG5ldyB4aHJDbGFzcygpLFxuICAgICAgICBpZCAgICAgICA9ICsrQ09SUy5faWQsXG4gICAgICAgIGhlYWRlcnMgID0gdGhpcy5fZGlzcGF0Y2hlci5oZWFkZXJzLFxuICAgICAgICBzZWxmICAgICA9IHRoaXMsXG4gICAgICAgIGtleTtcblxuICAgIHhoci5vcGVuKCdQT1NUJywgVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KSwgdHJ1ZSk7XG5cbiAgICBpZiAoeGhyLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcbiAgICAgIGZvciAoa2V5IGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNsZWFuVXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgheGhyKSByZXR1cm4gZmFsc2U7XG4gICAgICBDT1JTLl9wZW5kaW5nLnJlbW92ZShpZCk7XG4gICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSB4aHIub250aW1lb3V0ID0geGhyLm9ucHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgeGhyID0gbnVsbDtcbiAgICB9O1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlcGxpZXM7XG4gICAgICB0cnkgeyByZXBsaWVzID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSB9IGNhdGNoIChlcnJvcikge31cblxuICAgICAgY2xlYW5VcCgpO1xuXG4gICAgICBpZiAocmVwbGllcylcbiAgICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFuVXAoKTtcbiAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgaWYgKHhockNsYXNzID09PSBnbG9iYWwuWERvbWFpblJlcXVlc3QpXG4gICAgICBDT1JTLl9wZW5kaW5nLmFkZCh7aWQ6IGlkLCB4aHI6IHhocn0pO1xuXG4gICAgeGhyLnNlbmQodGhpcy5lbmNvZGUobWVzc2FnZXMpKTtcbiAgICByZXR1cm4geGhyO1xuICB9XG59KSwge1xuICBfaWQ6ICAgICAgMCxcbiAgX3BlbmRpbmc6IG5ldyBTZXQoKSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKFVSSS5pc1NhbWVPcmlnaW4oZW5kcG9pbnQpKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuXG4gICAgaWYgKGdsb2JhbC5YRG9tYWluUmVxdWVzdClcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGVuZHBvaW50LnByb3RvY29sID09PSBsb2NhdGlvbi5wcm90b2NvbCk7XG5cbiAgICBpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCB4aHIud2l0aENyZWRlbnRpYWxzICE9PSB1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENPUlM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2NvcnMuanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgVVJJICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWwvY29weV9vYmplY3QnKSxcbiAgICBleHRlbmQgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBEZWZlcnJhYmxlID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKSxcbiAgICBUcmFuc3BvcnQgID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKSxcbiAgICBYSFIgICAgICAgID0gcmVxdWlyZSgnLi94aHInKTtcblxudmFyIEV2ZW50U291cmNlID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCkge1xuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIGRpc3BhdGNoZXIsIGVuZHBvaW50KTtcbiAgICBpZiAoIWdsb2JhbC5FdmVudFNvdXJjZSkgcmV0dXJuIHRoaXMuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcpO1xuXG4gICAgdGhpcy5feGhyID0gbmV3IFhIUihkaXNwYXRjaGVyLCBlbmRwb2ludCk7XG5cbiAgICBlbmRwb2ludCA9IGNvcHlPYmplY3QoZW5kcG9pbnQpO1xuICAgIGVuZHBvaW50LnBhdGhuYW1lICs9ICcvJyArIGRpc3BhdGNoZXIuY2xpZW50SWQ7XG5cbiAgICB2YXIgc29ja2V0ID0gbmV3IGdsb2JhbC5FdmVudFNvdXJjZShVUkkuc3RyaW5naWZ5KGVuZHBvaW50KSksXG4gICAgICAgIHNlbGYgICA9IHRoaXM7XG5cbiAgICBzb2NrZXQub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9ldmVyQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGYuc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgIH07XG5cbiAgICBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNlbGYuX2V2ZXJDb25uZWN0ZWQpIHtcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IoW10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJyk7XG4gICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHZhciByZXBsaWVzO1xuICAgICAgdHJ5IHsgcmVwbGllcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgIGlmIChyZXBsaWVzKVxuICAgICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgICAgZWxzZVxuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihbXSk7XG4gICAgfTtcblxuICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHJldHVybjtcbiAgICB0aGlzLl9zb2NrZXQub25vcGVuID0gdGhpcy5fc29ja2V0Lm9uZXJyb3IgPSB0aGlzLl9zb2NrZXQub25tZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLl9zb2NrZXQuY2xvc2UoKTtcbiAgICBkZWxldGUgdGhpcy5fc29ja2V0O1xuICB9LFxuXG4gIGlzVXNhYmxlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuY2FsbGJhY2soZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdHJ1ZSkgfSk7XG4gICAgdGhpcy5lcnJiYWNrKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKSB9KTtcbiAgfSxcblxuICBlbmNvZGU6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hoci5lbmNvZGUobWVzc2FnZXMpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hoci5yZXF1ZXN0KG1lc3NhZ2VzKTtcbiAgfVxuXG59KSwge1xuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIGlkID0gZGlzcGF0Y2hlci5jbGllbnRJZDtcbiAgICBpZiAoIWlkKSByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSk7XG5cbiAgICBYSFIuaXNVc2FibGUoZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGZ1bmN0aW9uKHVzYWJsZSkge1xuICAgICAgaWYgKCF1c2FibGUpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcbiAgICAgIHRoaXMuY3JlYXRlKGRpc3BhdGNoZXIsIGVuZHBvaW50KS5pc1VzYWJsZShjYWxsYmFjaywgY29udGV4dCk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCkge1xuICAgIHZhciBzb2NrZXRzID0gZGlzcGF0Y2hlci50cmFuc3BvcnRzLmV2ZW50c291cmNlID0gZGlzcGF0Y2hlci50cmFuc3BvcnRzLmV2ZW50c291cmNlIHx8IHt9LFxuICAgICAgICBpZCAgICAgID0gZGlzcGF0Y2hlci5jbGllbnRJZDtcblxuICAgIHZhciB1cmwgPSBjb3B5T2JqZWN0KGVuZHBvaW50KTtcbiAgICB1cmwucGF0aG5hbWUgKz0gJy8nICsgKGlkIHx8ICcnKTtcbiAgICB1cmwgPSBVUkkuc3RyaW5naWZ5KHVybCk7XG5cbiAgICBzb2NrZXRzW3VybF0gPSBzb2NrZXRzW3VybF0gfHwgbmV3IHRoaXMoZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuICAgIHJldHVybiBzb2NrZXRzW3VybF07XG4gIH1cbn0pO1xuXG5leHRlbmQoRXZlbnRTb3VyY2UucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFNvdXJjZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvZXZlbnRfc291cmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFVSSSAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuLi91dGlsL2NvcHlfb2JqZWN0JyksXG4gICAgZXh0ZW5kICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdG9KU09OICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpLFxuICAgIFRyYW5zcG9ydCAgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG52YXIgSlNPTlAgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHZhciB1cmwgPSBjb3B5T2JqZWN0KHRoaXMuZW5kcG9pbnQpO1xuICAgIHVybC5xdWVyeS5tZXNzYWdlID0gdG9KU09OKG1lc3NhZ2VzKTtcbiAgICB1cmwucXVlcnkuanNvbnAgICA9ICdfX2pzb25wJyArIEpTT05QLl9jYkNvdW50ICsgJ19fJztcbiAgICByZXR1cm4gVVJJLnN0cmluZ2lmeSh1cmwpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIGhlYWQgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sXG4gICAgICAgIHNjcmlwdCAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuICAgICAgICBjYWxsYmFja05hbWUgPSBKU09OUC5nZXRDYWxsYmFja05hbWUoKSxcbiAgICAgICAgZW5kcG9pbnQgICAgID0gY29weU9iamVjdCh0aGlzLmVuZHBvaW50KSxcbiAgICAgICAgc2VsZiAgICAgICAgID0gdGhpcztcblxuICAgIGVuZHBvaW50LnF1ZXJ5Lm1lc3NhZ2UgPSB0b0pTT04obWVzc2FnZXMpO1xuICAgIGVuZHBvaW50LnF1ZXJ5Lmpzb25wICAgPSBjYWxsYmFja05hbWU7XG5cbiAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFnbG9iYWxbY2FsbGJhY2tOYW1lXSkgcmV0dXJuIGZhbHNlO1xuICAgICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICB0cnkgeyBkZWxldGUgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIH07XG5cbiAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uKHJlcGxpZXMpIHtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgfTtcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgc2NyaXB0LnNyYyAgPSBVUkkuc3RyaW5naWZ5KGVuZHBvaW50KTtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYW51cCgpO1xuICAgICAgc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge2Fib3J0OiBjbGVhbnVwfTtcbiAgfVxufSksIHtcbiAgX2NiQ291bnQ6IDAsXG5cbiAgZ2V0Q2FsbGJhY2tOYW1lOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jYkNvdW50ICs9IDE7XG4gICAgcmV0dXJuICdfX2pzb25wJyArIHRoaXMuX2NiQ291bnQgKyAnX18nO1xuICB9LFxuXG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRydWUpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBKU09OUDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvanNvbnAuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgUHJvbWlzZSAgICA9IHJlcXVpcmUoJy4uL3V0aWwvcHJvbWlzZScpLFxuICAgIFNldCAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3NldCcpLFxuICAgIFVSSSAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGJyb3dzZXIgICAgPSByZXF1aXJlKCcuLi91dGlsL2Jyb3dzZXInKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbC9jb3B5X29iamVjdCcpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHRvSlNPTiAgICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICB3cyAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC93ZWJzb2NrZXQnKSxcbiAgICBEZWZlcnJhYmxlID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKSxcbiAgICBUcmFuc3BvcnQgID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIFdlYlNvY2tldCA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgVU5DT05ORUNURUQ6ICAxLFxuICBDT05ORUNUSU5HOiAgIDIsXG4gIENPTk5FQ1RFRDogICAgMyxcblxuICBiYXRjaGluZzogICAgIGZhbHNlLFxuXG4gIGlzVXNhYmxlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuY2FsbGJhY2soZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdHJ1ZSkgfSk7XG4gICAgdGhpcy5lcnJiYWNrKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKSB9KTtcbiAgICB0aGlzLmNvbm5lY3QoKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHRoaXMuX3BlbmRpbmcgPSB0aGlzLl9wZW5kaW5nIHx8IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IG47IGkrKykgdGhpcy5fcGVuZGluZy5hZGQobWVzc2FnZXNbaV0pO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHNlbGYuY2FsbGJhY2soZnVuY3Rpb24oc29ja2V0KSB7XG4gICAgICAgIGlmICghc29ja2V0IHx8IHNvY2tldC5yZWFkeVN0YXRlICE9PSAxKSByZXR1cm47XG4gICAgICAgIHNvY2tldC5zZW5kKHRvSlNPTihtZXNzYWdlcykpO1xuICAgICAgICByZXNvbHZlKHNvY2tldCk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5jb25uZWN0KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkgeyBwcm9taXNlLnRoZW4oZnVuY3Rpb24od3MpIHsgd3MuY2xvc2UoKSB9KSB9XG4gICAgfTtcbiAgfSxcblxuICBjb25uZWN0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoV2ViU29ja2V0Ll91bmxvYWRlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLl9zdGF0ZSB8fCB0aGlzLlVOQ09OTkVDVEVEO1xuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gdGhpcy5VTkNPTk5FQ1RFRCkgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5DT05ORUNUSU5HO1xuXG4gICAgdmFyIHNvY2tldCA9IHRoaXMuX2NyZWF0ZVNvY2tldCgpO1xuICAgIGlmICghc29ja2V0KSByZXR1cm4gdGhpcy5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzb2NrZXQub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc29ja2V0LmhlYWRlcnMpIHNlbGYuX3N0b3JlQ29va2llcyhzb2NrZXQuaGVhZGVyc1snc2V0LWNvb2tpZSddKTtcbiAgICAgIHNlbGYuX3NvY2tldCA9IHNvY2tldDtcbiAgICAgIHNlbGYuX3N0YXRlID0gc2VsZi5DT05ORUNURUQ7XG4gICAgICBzZWxmLl9ldmVyQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGYuX3BpbmcoKTtcbiAgICAgIHNlbGYuc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcsIHNvY2tldCk7XG4gICAgfTtcblxuICAgIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgICBzb2NrZXQub25jbG9zZSA9IHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2xvc2VkKSByZXR1cm47XG4gICAgICBjbG9zZWQgPSB0cnVlO1xuXG4gICAgICB2YXIgd2FzQ29ubmVjdGVkID0gKHNlbGYuX3N0YXRlID09PSBzZWxmLkNPTk5FQ1RFRCk7XG4gICAgICBzb2NrZXQub25vcGVuID0gc29ja2V0Lm9uY2xvc2UgPSBzb2NrZXQub25lcnJvciA9IHNvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgICBkZWxldGUgc2VsZi5fc29ja2V0O1xuICAgICAgc2VsZi5fc3RhdGUgPSBzZWxmLlVOQ09OTkVDVEVEO1xuICAgICAgc2VsZi5yZW1vdmVUaW1lb3V0KCdwaW5nJyk7XG5cbiAgICAgIHZhciBwZW5kaW5nID0gc2VsZi5fcGVuZGluZyA/IHNlbGYuX3BlbmRpbmcudG9BcnJheSgpIDogW107XG4gICAgICBkZWxldGUgc2VsZi5fcGVuZGluZztcblxuICAgICAgaWYgKHdhc0Nvbm5lY3RlZCB8fCBzZWxmLl9ldmVyQ29ubmVjdGVkKSB7XG4gICAgICAgIHNlbGYuc2V0RGVmZXJyZWRTdGF0dXMoJ3Vua25vd24nKTtcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IocGVuZGluZywgd2FzQ29ubmVjdGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHZhciByZXBsaWVzO1xuICAgICAgdHJ5IHsgcmVwbGllcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgIGlmICghcmVwbGllcykgcmV0dXJuO1xuXG4gICAgICByZXBsaWVzID0gW10uY29uY2F0KHJlcGxpZXMpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHJlcGxpZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGlmIChyZXBsaWVzW2ldLnN1Y2Nlc3NmdWwgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICAgIHNlbGYuX3BlbmRpbmcucmVtb3ZlKHJlcGxpZXNbaV0pO1xuICAgICAgfVxuICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICB9O1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgcmV0dXJuO1xuICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICB9LFxuXG4gIF9jcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1cmwgICAgICAgID0gV2ViU29ja2V0LmdldFNvY2tldFVybCh0aGlzLmVuZHBvaW50KSxcbiAgICAgICAgaGVhZGVycyAgICA9IHRoaXMuX2Rpc3BhdGNoZXIuaGVhZGVycyxcbiAgICAgICAgZXh0ZW5zaW9ucyA9IHRoaXMuX2Rpc3BhdGNoZXIud3NFeHRlbnNpb25zLFxuICAgICAgICBjb29raWUgICAgID0gdGhpcy5fZ2V0Q29va2llcygpLFxuICAgICAgICB0bHMgICAgICAgID0gdGhpcy5fZGlzcGF0Y2hlci50bHMsXG4gICAgICAgIG9wdGlvbnMgICAgPSB7ZXh0ZW5zaW9uczogZXh0ZW5zaW9ucywgaGVhZGVyczogaGVhZGVycywgcHJveHk6IHRoaXMuX3Byb3h5LCB0bHM6IHRsc307XG5cbiAgICBpZiAoY29va2llICE9PSAnJykgb3B0aW9ucy5oZWFkZXJzWydDb29raWUnXSA9IGNvb2tpZTtcblxuICAgIHJldHVybiB3cy5jcmVhdGUodXJsLCBbXSwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgX3Bpbmc6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5fc29ja2V0IHx8IHRoaXMuX3NvY2tldC5yZWFkeVN0YXRlICE9PSAxKSByZXR1cm47XG4gICAgdGhpcy5fc29ja2V0LnNlbmQoJ1tdJyk7XG4gICAgdGhpcy5hZGRUaW1lb3V0KCdwaW5nJywgdGhpcy5fZGlzcGF0Y2hlci50aW1lb3V0IC8gMiwgdGhpcy5fcGluZywgdGhpcyk7XG4gIH1cblxufSksIHtcbiAgUFJPVE9DT0xTOiB7XG4gICAgJ2h0dHA6JzogICd3czonLFxuICAgICdodHRwczonOiAnd3NzOidcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgdmFyIHNvY2tldHMgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMud2Vic29ja2V0ID0gZGlzcGF0Y2hlci50cmFuc3BvcnRzLndlYnNvY2tldCB8fCB7fTtcbiAgICBzb2NrZXRzW2VuZHBvaW50LmhyZWZdID0gc29ja2V0c1tlbmRwb2ludC5ocmVmXSB8fCBuZXcgdGhpcyhkaXNwYXRjaGVyLCBlbmRwb2ludCk7XG4gICAgcmV0dXJuIHNvY2tldHNbZW5kcG9pbnQuaHJlZl07XG4gIH0sXG5cbiAgZ2V0U29ja2V0VXJsOiBmdW5jdGlvbihlbmRwb2ludCkge1xuICAgIGVuZHBvaW50ID0gY29weU9iamVjdChlbmRwb2ludCk7XG4gICAgZW5kcG9pbnQucHJvdG9jb2wgPSB0aGlzLlBST1RPQ09MU1tlbmRwb2ludC5wcm90b2NvbF07XG4gICAgcmV0dXJuIFVSSS5zdHJpbmdpZnkoZW5kcG9pbnQpO1xuICB9LFxuXG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLmNyZWF0ZShkaXNwYXRjaGVyLCBlbmRwb2ludCkuaXNVc2FibGUoY2FsbGJhY2ssIGNvbnRleHQpO1xuICB9XG59KTtcblxuZXh0ZW5kKFdlYlNvY2tldC5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuXG5pZiAoYnJvd3Nlci5FdmVudCAmJiBnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgYnJvd3Nlci5FdmVudC5vbihnbG9iYWwsICdiZWZvcmV1bmxvYWQnLCBmdW5jdGlvbigpIHsgV2ViU29ja2V0Ll91bmxvYWRlZCA9IHRydWUgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC93ZWJfc29ja2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mXG50aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluXG50aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvXG51c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllc1xub2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvXG5zbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG4qL1xuXG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm9uKHR5cGUsIGZ1bmN0aW9uIGcoKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0FycmF5KGxpc3QpKSB7XG4gICAgdmFyIGkgPSBpbmRleE9mKGxpc3QsIGxpc3RlbmVyKTtcbiAgICBpZiAoaSA8IDApIHJldHVybiB0aGlzO1xuICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfSBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0gPT09IGxpc3RlbmVyKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9ldmVudF9lbWl0dGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zLCB2YWxpZEtleXMpIHtcbiAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAoYXJyYXkuaW5kZXhPZih2YWxpZEtleXMsIGtleSkgPCAwKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnJlY29nbml6ZWQgb3B0aW9uOiAnICsga2V5KTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3ZhbGlkYXRlX29wdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIFdTID0gZ2xvYmFsLk1veldlYlNvY2tldCB8fCBnbG9iYWwuV2ViU29ja2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiBmdW5jdGlvbih1cmwsIHByb3RvY29scywgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgV1MgIT09ICdmdW5jdGlvbicpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBuZXcgV1ModXJsKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3dlYnNvY2tldC9icm93c2VyX3dlYnNvY2tldC5qc1xuLy8gbW9kdWxlIGlkID0gMzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IEZheWUgPSByZXF1aXJlKCdmYXllL3NyYy9mYXllX2Jyb3dzZXInKTtcbmNvbnN0IENsYXNzID0gcmVxdWlyZSgnZmF5ZS9zcmMvdXRpbC9jbGFzcycpO1xuXG5jb25zdCBDbGllbnQgPSBDbGFzcyhGYXllLkNsaWVudCwge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYmFzZSwgb3B0aW9ucykge1xuICAgIEZheWUuQ2xpZW50LnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgYmFzZSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLl90b2tlbnMgPSB7fTtcbiAgICBzZWxmLl9wcmVzZW5jZUNCcyA9IHt9O1xuXG4gICAgdGhpcy5hZGRFeHRlbnNpb24oe1xuICAgICAgb3V0Z29pbmc6IGZ1bmN0aW9uIChtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgdG9rZW47XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UuZGF0YSAmJiBtZXNzYWdlLmRhdGEuX29yaWdpbmFsRGF0YSkge1xuICAgICAgICAgIHRva2VuID0gbWVzc2FnZS5kYXRhLl90b2tlbjtcbiAgICAgICAgICBtZXNzYWdlLmRhdGEgPSBtZXNzYWdlLmRhdGEuX29yaWdpbmFsRGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICBjb25zdCBjaGFubmVsID0gKG1lc3NhZ2UuY2hhbm5lbCA9PT0gJy9tZXRhL3N1YnNjcmliZSdcbiAgICAgICAgICAgID8gbWVzc2FnZS5zdWJzY3JpcHRpb25cbiAgICAgICAgICAgIDogbWVzc2FnZS5jaGFubmVsKTtcbiAgICAgICAgICB0b2tlbiA9IHNlbGYuX3Rva2Vuc1tjaGFubmVsXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgIGlmICghbWVzc2FnZS5leHQpIG1lc3NhZ2UuZXh0ID0ge307XG4gICAgICAgICAgbWVzc2FnZS5leHQuYXV0aCA9IHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcbiAgICAgIH0sXG4gICAgICBpbmNvbWluZzogZnVuY3Rpb24gKG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmNoYW5uZWwgPT09ICcvbWV0YS9zdWJzY3JpYmUnICYmIG1lc3NhZ2UuZXh0ICYmIG1lc3NhZ2UuZXh0LnByZXNlbmNlKSB7XG4gICAgICAgICAgY29uc3QgcHJlc2VuY2VDQiA9IHNlbGYuX3ByZXNlbmNlQ0JzW21lc3NhZ2Uuc3Vic2NyaXB0aW9uXTtcbiAgICAgICAgICBpZiAocHJlc2VuY2VDQikge1xuICAgICAgICAgICAgcHJlc2VuY2VDQihtZXNzYWdlLmV4dC5wcmVzZW5jZSwgbWVzc2FnZS5zdWJzY3JpcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIGNoYW5uZWwgW1N0cmluZ11cbiAgICogQHBhcmFtIHRva2VuIFtTdHJpbmddIChvcHRpb25hbClcbiAgICogQGNhbGxiYWNrIFtmdW5jdGlvbihtZXNzYWdlLCBjaGFubmVsKV0gKG9wdGlvbmFsKVxuICAgKiAgIEBwYXJhbSBtZXNzYWdlIFtPYmplY3RdXG4gICAqICAgQHBhcmFtIGNoYW5uZWwgW1N0cmluZ11cbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqXG4gICAqIHN1YnNjcmliZVRvKGNoYW5uZWwsIGNhbGxiYWNrKVxuICAgKiBzdWJzY3JpYmVUbyhjaGFubmVsLCB0b2tlbiwgY2FsbGJhY2spO1xuICAgKi9cbiAgc3Vic2NyaWJlVG86IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjaGFubmVsID0gYXJndW1lbnRzWzBdO1xuICAgIGxldCBjYWxsYmFjaztcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgbGV0IHRva2VuO1xuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnc3RyaW5nJykge1xuICAgICAgdG9rZW4gPSBhcmd1bWVudHNbMV07XG4gICAgfVxuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0aGlzLl90b2tlbnNbY2hhbm5lbF0gPSB0b2tlbjtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmVzZW5jZUNCc1tjaGFubmVsXSA9IGNhbGxiYWNrO1xuXG4gICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGNoYW5uZWwpLndpdGhDaGFubmVsKGZ1bmN0aW9uIChjaGFubmVsLCBtZXNzYWdlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSwgY2hhbm5lbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSBjaGFubmVsIFtTdHJpbmddXG4gICAqIEBwYXJhbSB0b2tlbiBbU3RyaW5nXVxuICAgKiBAcGFyYW0gbWVzc2FnZSBbT2JqZWN0XVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIHB1Ymxpc2hUbzogZnVuY3Rpb24gKGNoYW5uZWwsIHRva2VuLCBkYXRhKSB7XG4gICAgY29uc3Qgd3JhcHBlZERhdGEgPSB7XG4gICAgICBfb3JpZ2luYWxEYXRhOiBkYXRhLFxuICAgICAgX3Rva2VuOiB0b2tlblxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoKGNoYW5uZWwsIHdyYXBwZWREYXRhKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDbGllbnQ6IENsaWVudFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NsaWVudC9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=