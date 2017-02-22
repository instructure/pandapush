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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(22);
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNWU3NWU3MDgxMThmYWVmNTNkNCIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC91cmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy90cmFuc3BvcnQvdHJhbnNwb3J0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL2RlZmVycmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9taXhpbnMvbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvdG9fanNvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL21peGlucy9wdWJsaXNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2FycmF5LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9icm93c2VyL2V2ZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb3B5X29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FzYXAvYnJvd3Nlci1hc2FwLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2dyYW1tYXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9wcm90b2NvbC9zY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy90cmFuc3BvcnQveGhyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2Nvb2tpZXMvYnJvd3Nlcl9jb29raWVzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9mYXllX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hc2FwL2Jyb3dzZXItcmF3LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL3RpbWVvdXRzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2Vycm9yLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZXh0ZW5zaWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL3B1YmxpY2F0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvc3Vic2NyaXB0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2Jyb3dzZXJfdHJhbnNwb3J0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9jb3JzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2V2ZW50X3NvdXJjZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9qc29ucC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC93ZWJfc29ja2V0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9ldmVudF9lbWl0dGVyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC92YWxpZGF0ZV9vcHRpb25zLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC93ZWJzb2NrZXQvYnJvd3Nlcl93ZWJzb2NrZXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbIkZheWUiLCJyZXF1aXJlIiwiQ2xhc3MiLCJDbGllbnQiLCJpbml0aWFsaXplIiwiYmFzZSIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJjYWxsIiwic2VsZiIsIl90b2tlbnMiLCJfcHJlc2VuY2VDQnMiLCJhZGRFeHRlbnNpb24iLCJvdXRnb2luZyIsIm1lc3NhZ2UiLCJjYWxsYmFjayIsInRva2VuIiwiZGF0YSIsIl9vcmlnaW5hbERhdGEiLCJfdG9rZW4iLCJjaGFubmVsIiwic3Vic2NyaXB0aW9uIiwiZXh0IiwiYXV0aCIsImluY29taW5nIiwicHJlc2VuY2UiLCJwcmVzZW5jZUNCIiwic3Vic2NyaWJlVG8iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzdWJzY3JpYmUiLCJ3aXRoQ2hhbm5lbCIsInB1Ymxpc2hUbyIsIndyYXBwZWREYXRhIiwicHVibGlzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFF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Q0E7O0FBRUE7O0FBRUE7Ozs7Ozs7OzhDQ2RBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OENDOU5BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs4Q0N6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLLElBQUk7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsdUNBQXVDLHlCQUF5Qjs7QUFFaEUsT0FBTztBQUNQO0FBQ0Esc0NBQXNDLG9DQUFvQztBQUMxRTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDLGtDQUFrQzs7QUFFMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLLElBQUk7QUFDVCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUssSUFBSTtBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyxJQUFJO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLElBQUk7QUFDWDs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUJBQWlCO0FBQ25EO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OzhDQ2pZQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0RBQXdEOztBQUV4RDtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsT0FBTztBQUM3QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsK0VBQStFO0FBQy9ILHlDQUF5QztBQUN6Qzs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQ3hMQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7Ozs7Ozs7QUN0REE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0EseUNBQXlDLE9BQU87QUFDaEQ7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDMUtBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OENDVEE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ1RBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LE9BQVAsR0FBaUI7QUFDZmpDLFVBQVFBO0FBRE8sQ0FBakIsQyIsImZpbGUiOiIuL2NsaWVudC9kaXN0L2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlBhbmRhcHVzaFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJQYW5kYXB1c2hcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMzkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGM1ZTc1ZTcwODExOGZhZWY1M2Q0IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIG1ldGhvZHMpIHtcbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICBtZXRob2RzID0gcGFyZW50O1xuICAgIHBhcmVudCAgPSBPYmplY3Q7XG4gIH1cblxuICB2YXIga2xhc3MgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZSkgcmV0dXJuIHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gIH07XG5cbiAgdmFyIGJyaWRnZSA9IGZ1bmN0aW9uKCkge307XG4gIGJyaWRnZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gIGtsYXNzLnByb3RvdHlwZSA9IG5ldyBicmlkZ2UoKTtcbiAgZXh0ZW5kKGtsYXNzLnByb3RvdHlwZSwgbWV0aG9kcyk7XG5cbiAgcmV0dXJuIGtsYXNzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2NsYXNzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXN0LCBzb3VyY2UsIG92ZXJ3cml0ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIGRlc3Q7XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICBpZiAoIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICBpZiAoZGVzdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG92ZXJ3cml0ZSA9PT0gZmFsc2UpIGNvbnRpbnVlO1xuICAgIGlmIChkZXN0W2tleV0gIT09IHNvdXJjZVtrZXldKVxuICAgICAgZGVzdFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvZXh0ZW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1VSSTogZnVuY3Rpb24odXJpKSB7XG4gICAgcmV0dXJuIHVyaSAmJiB1cmkucHJvdG9jb2wgJiYgdXJpLmhvc3QgJiYgdXJpLnBhdGg7XG4gIH0sXG5cbiAgaXNTYW1lT3JpZ2luOiBmdW5jdGlvbih1cmkpIHtcbiAgICByZXR1cm4gdXJpLnByb3RvY29sID09PSBsb2NhdGlvbi5wcm90b2NvbCAmJlxuICAgICAgICAgICB1cmkuaG9zdG5hbWUgPT09IGxvY2F0aW9uLmhvc3RuYW1lICYmXG4gICAgICAgICAgIHVyaS5wb3J0ICAgICA9PT0gbG9jYXRpb24ucG9ydDtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24odXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSByZXR1cm4gdXJsO1xuICAgIHZhciB1cmkgPSB7fSwgcGFydHMsIHF1ZXJ5LCBwYWlycywgaSwgbiwgZGF0YTtcblxuICAgIHZhciBjb25zdW1lID0gZnVuY3Rpb24obmFtZSwgcGF0dGVybikge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UocGF0dGVybiwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgdXJpW25hbWVdID0gbWF0Y2g7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0pO1xuICAgICAgdXJpW25hbWVdID0gdXJpW25hbWVdIHx8ICcnO1xuICAgIH07XG5cbiAgICBjb25zdW1lKCdwcm90b2NvbCcsIC9eW2Etel0rXFw6L2kpO1xuICAgIGNvbnN1bWUoJ2hvc3QnLCAgICAgL15cXC9cXC9bXlxcL1xcPyNdKy8pO1xuXG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpICYmICF1cmkuaG9zdClcbiAgICAgIHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1teXFwvXSokLywgJycpICsgdXJsO1xuXG4gICAgY29uc3VtZSgncGF0aG5hbWUnLCAvXlteXFw/I10qLyk7XG4gICAgY29uc3VtZSgnc2VhcmNoJywgICAvXlxcP1teI10qLyk7XG4gICAgY29uc3VtZSgnaGFzaCcsICAgICAvXiMuKi8pO1xuXG4gICAgdXJpLnByb3RvY29sID0gdXJpLnByb3RvY29sIHx8IGxvY2F0aW9uLnByb3RvY29sO1xuXG4gICAgaWYgKHVyaS5ob3N0KSB7XG4gICAgICB1cmkuaG9zdCAgICAgPSB1cmkuaG9zdC5zdWJzdHIoMik7XG4gICAgICBwYXJ0cyAgICAgICAgPSB1cmkuaG9zdC5zcGxpdCgnOicpO1xuICAgICAgdXJpLmhvc3RuYW1lID0gcGFydHNbMF07XG4gICAgICB1cmkucG9ydCAgICAgPSBwYXJ0c1sxXSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdXJpLmhvc3QgICAgID0gbG9jYXRpb24uaG9zdDtcbiAgICAgIHVyaS5ob3N0bmFtZSA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgdXJpLnBvcnQgICAgID0gbG9jYXRpb24ucG9ydDtcbiAgICB9XG5cbiAgICB1cmkucGF0aG5hbWUgPSB1cmkucGF0aG5hbWUgfHwgJy8nO1xuICAgIHVyaS5wYXRoID0gdXJpLnBhdGhuYW1lICsgdXJpLnNlYXJjaDtcblxuICAgIHF1ZXJ5ID0gdXJpLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpO1xuICAgIHBhaXJzID0gcXVlcnkgPyBxdWVyeS5zcGxpdCgnJicpIDogW107XG4gICAgZGF0YSAgPSB7fTtcblxuICAgIGZvciAoaSA9IDAsIG4gPSBwYWlycy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHBhcnRzID0gcGFpcnNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIGRhdGFbZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdIHx8ICcnKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0gfHwgJycpO1xuICAgIH1cblxuICAgIHVyaS5xdWVyeSA9IGRhdGE7XG5cbiAgICB1cmkuaHJlZiA9IHRoaXMuc3RyaW5naWZ5KHVyaSk7XG4gICAgcmV0dXJuIHVyaTtcbiAgfSxcblxuICBzdHJpbmdpZnk6IGZ1bmN0aW9uKHVyaSkge1xuICAgIHZhciBzdHJpbmcgPSB1cmkucHJvdG9jb2wgKyAnLy8nICsgdXJpLmhvc3RuYW1lO1xuICAgIGlmICh1cmkucG9ydCkgc3RyaW5nICs9ICc6JyArIHVyaS5wb3J0O1xuICAgIHN0cmluZyArPSB1cmkucGF0aG5hbWUgKyB0aGlzLnF1ZXJ5U3RyaW5nKHVyaS5xdWVyeSkgKyAodXJpLmhhc2ggfHwgJycpO1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH0sXG5cbiAgcXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIHF1ZXJ5KSB7XG4gICAgICBpZiAoIXF1ZXJ5Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeVtrZXldKSk7XG4gICAgfVxuICAgIGlmIChwYWlycy5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgICByZXR1cm4gJz8nICsgcGFpcnMuam9pbignJicpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvdXJpLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIENvb2tpZSAgID0gcmVxdWlyZSgnLi4vdXRpbC9jb29raWVzJykuQ29va2llLFxuICAgIFByb21pc2UgID0gcmVxdWlyZSgnLi4vdXRpbC9wcm9taXNlJyksXG4gICAgVVJJICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGFycmF5ICAgID0gcmVxdWlyZSgnLi4vdXRpbC9hcnJheScpLFxuICAgIGV4dGVuZCAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBMb2dnaW5nICA9IHJlcXVpcmUoJy4uL21peGlucy9sb2dnaW5nJyksXG4gICAgVGltZW91dHMgPSByZXF1aXJlKCcuLi9taXhpbnMvdGltZW91dHMnKSxcbiAgICBDaGFubmVsICA9IHJlcXVpcmUoJy4uL3Byb3RvY29sL2NoYW5uZWwnKTtcblxudmFyIFRyYW5zcG9ydCA9IGV4dGVuZChDbGFzcyh7IGNsYXNzTmFtZTogJ1RyYW5zcG9ydCcsXG4gIERFRkFVTFRfUE9SVFM6IHsnaHR0cDonOiA4MCwgJ2h0dHBzOic6IDQ0MywgJ3dzOic6IDgwLCAnd3NzOic6IDQ0M30sXG4gIE1BWF9ERUxBWTogICAgIDAsXG5cbiAgYmF0Y2hpbmc6ICB0cnVlLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgdGhpcy5fZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy5lbmRwb2ludCAgICA9IGVuZHBvaW50O1xuICAgIHRoaXMuX291dGJveCAgICAgPSBbXTtcbiAgICB0aGlzLl9wcm94eSAgICAgID0gZXh0ZW5kKHt9LCB0aGlzLl9kaXNwYXRjaGVyLnByb3h5KTtcblxuICAgIGlmICghdGhpcy5fcHJveHkub3JpZ2luKVxuICAgICAgdGhpcy5fcHJveHkub3JpZ2luID0gdGhpcy5fZmluZFByb3h5KCk7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge30sXG5cbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiAnJztcbiAgfSxcblxuICBzZW5kTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHRoaXMuZGVidWcoJ0NsaWVudCA/IHNlbmRpbmcgbWVzc2FnZSB0byA/OiA/JyxcbiAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIG1lc3NhZ2UpO1xuXG4gICAgaWYgKCF0aGlzLmJhdGNoaW5nKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucmVxdWVzdChbbWVzc2FnZV0pKTtcblxuICAgIHRoaXMuX291dGJveC5wdXNoKG1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZsdXNoTGFyZ2VCYXRjaCgpO1xuXG4gICAgaWYgKG1lc3NhZ2UuY2hhbm5lbCA9PT0gQ2hhbm5lbC5IQU5EU0hBS0UpXG4gICAgICByZXR1cm4gdGhpcy5fcHVibGlzaCgwLjAxKTtcblxuICAgIGlmIChtZXNzYWdlLmNoYW5uZWwgPT09IENoYW5uZWwuQ09OTkVDVClcbiAgICAgIHRoaXMuX2Nvbm5lY3RNZXNzYWdlID0gbWVzc2FnZTtcblxuICAgIHJldHVybiB0aGlzLl9wdWJsaXNoKHRoaXMuTUFYX0RFTEFZKTtcbiAgfSxcblxuICBfbWFrZVByb21pc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuX3JlcXVlc3RQcm9taXNlID0gdGhpcy5fcmVxdWVzdFByb21pc2UgfHwgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgc2VsZi5fcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgIH0pO1xuICB9LFxuXG4gIF9wdWJsaXNoOiBmdW5jdGlvbihkZWxheSkge1xuICAgIHRoaXMuX21ha2VQcm9taXNlKCk7XG5cbiAgICB0aGlzLmFkZFRpbWVvdXQoJ3B1Ymxpc2gnLCBkZWxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9mbHVzaCgpO1xuICAgICAgZGVsZXRlIHRoaXMuX3JlcXVlc3RQcm9taXNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RQcm9taXNlO1xuICB9LFxuXG4gIF9mbHVzaDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVUaW1lb3V0KCdwdWJsaXNoJyk7XG5cbiAgICBpZiAodGhpcy5fb3V0Ym94Lmxlbmd0aCA+IDEgJiYgdGhpcy5fY29ubmVjdE1lc3NhZ2UpXG4gICAgICB0aGlzLl9jb25uZWN0TWVzc2FnZS5hZHZpY2UgPSB7dGltZW91dDogMH07XG5cbiAgICB0aGlzLl9yZXNvbHZlUHJvbWlzZSh0aGlzLnJlcXVlc3QodGhpcy5fb3V0Ym94KSk7XG5cbiAgICB0aGlzLl9jb25uZWN0TWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fb3V0Ym94ID0gW107XG4gIH0sXG5cbiAgX2ZsdXNoTGFyZ2VCYXRjaDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZyA9IHRoaXMuZW5jb2RlKHRoaXMuX291dGJveCk7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPCB0aGlzLl9kaXNwYXRjaGVyLm1heFJlcXVlc3RTaXplKSByZXR1cm47XG4gICAgdmFyIGxhc3QgPSB0aGlzLl9vdXRib3gucG9wKCk7XG5cbiAgICB0aGlzLl9tYWtlUHJvbWlzZSgpO1xuICAgIHRoaXMuX2ZsdXNoKCk7XG5cbiAgICBpZiAobGFzdCkgdGhpcy5fb3V0Ym94LnB1c2gobGFzdCk7XG4gIH0sXG5cbiAgX3JlY2VpdmU6IGZ1bmN0aW9uKHJlcGxpZXMpIHtcbiAgICBpZiAoIXJlcGxpZXMpIHJldHVybjtcbiAgICByZXBsaWVzID0gW10uY29uY2F0KHJlcGxpZXMpO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ2xpZW50ID8gcmVjZWl2ZWQgZnJvbSA/IHZpYSA/OiA/JyxcbiAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIHRoaXMuY29ubmVjdGlvblR5cGUsIHJlcGxpZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSByZXBsaWVzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlUmVzcG9uc2UocmVwbGllc1tpXSk7XG4gIH0sXG5cbiAgX2hhbmRsZUVycm9yOiBmdW5jdGlvbihtZXNzYWdlcywgaW1tZWRpYXRlKSB7XG4gICAgbWVzc2FnZXMgPSBbXS5jb25jYXQobWVzc2FnZXMpO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ2xpZW50ID8gZmFpbGVkIHRvIHNlbmQgdG8gPyB2aWEgPzogPycsXG4gICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLCB0aGlzLmNvbm5lY3Rpb25UeXBlLCBtZXNzYWdlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlRXJyb3IobWVzc2FnZXNbaV0pO1xuICB9LFxuXG4gIF9nZXRDb29raWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29va2llcyA9IHRoaXMuX2Rpc3BhdGNoZXIuY29va2llcyxcbiAgICAgICAgdXJsICAgICA9IFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCk7XG5cbiAgICBpZiAoIWNvb2tpZXMpIHJldHVybiAnJztcblxuICAgIHJldHVybiBhcnJheS5tYXAoY29va2llcy5nZXRDb29raWVzU3luYyh1cmwpLCBmdW5jdGlvbihjb29raWUpIHtcbiAgICAgIHJldHVybiBjb29raWUuY29va2llU3RyaW5nKCk7XG4gICAgfSkuam9pbignOyAnKTtcbiAgfSxcblxuICBfc3RvcmVDb29raWVzOiBmdW5jdGlvbihzZXRDb29raWUpIHtcbiAgICB2YXIgY29va2llcyA9IHRoaXMuX2Rpc3BhdGNoZXIuY29va2llcyxcbiAgICAgICAgdXJsICAgICA9IFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksXG4gICAgICAgIGNvb2tpZTtcblxuICAgIGlmICghc2V0Q29va2llIHx8ICFjb29raWVzKSByZXR1cm47XG4gICAgc2V0Q29va2llID0gW10uY29uY2F0KHNldENvb2tpZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IHNldENvb2tpZS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGNvb2tpZSA9IENvb2tpZS5wYXJzZShzZXRDb29raWVbaV0pO1xuICAgICAgY29va2llcy5zZXRDb29raWVTeW5jKGNvb2tpZSwgdXJsKTtcbiAgICB9XG4gIH0sXG5cbiAgX2ZpbmRQcm94eTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHZhciBwcm90b2NvbCA9IHRoaXMuZW5kcG9pbnQucHJvdG9jb2w7XG4gICAgaWYgKCFwcm90b2NvbCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHZhciBuYW1lICAgPSBwcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKS50b0xvd2VyQ2FzZSgpICsgJ19wcm94eScsXG4gICAgICAgIHVwY2FzZSA9IG5hbWUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgZW52ICAgID0gcHJvY2Vzcy5lbnYsXG4gICAgICAgIGtleXMsIHByb3h5O1xuXG4gICAgaWYgKG5hbWUgPT09ICdodHRwX3Byb3h5JyAmJiBlbnYuUkVRVUVTVF9NRVRIT0QpIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhlbnYpLmZpbHRlcihmdW5jdGlvbihrKSB7IHJldHVybiAvXmh0dHBfcHJveHkkL2kudGVzdChrKSB9KTtcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoa2V5c1swXSA9PT0gbmFtZSAmJiBlbnZbdXBjYXNlXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHByb3h5ID0gZW52W25hbWVdO1xuICAgICAgfSBlbHNlIGlmIChrZXlzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcHJveHkgPSBlbnZbbmFtZV07XG4gICAgICB9XG4gICAgICBwcm94eSA9IHByb3h5IHx8IGVudlsnQ0dJXycgKyB1cGNhc2VdO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94eSA9IGVudltuYW1lXSB8fCBlbnZbdXBjYXNlXTtcbiAgICAgIGlmIChwcm94eSAmJiAhZW52W25hbWVdKVxuICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSAnICsgdXBjYXNlICtcbiAgICAgICAgICAgICAgICAgICAgICcgaXMgZGlzY291cmFnZWQuIFVzZSAnICsgbmFtZSArICcuJyk7XG4gICAgfVxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG59KSwge1xuICBnZXQ6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGFsbG93ZWQsIGRpc2FibGVkLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBlbmRwb2ludCA9IGRpc3BhdGNoZXIuZW5kcG9pbnQ7XG5cbiAgICBhcnJheS5hc3luY0VhY2godGhpcy5fdHJhbnNwb3J0cywgZnVuY3Rpb24ocGFpciwgcmVzdW1lKSB7XG4gICAgICB2YXIgY29ublR5cGUgICAgID0gcGFpclswXSwga2xhc3MgPSBwYWlyWzFdLFxuICAgICAgICAgIGNvbm5FbmRwb2ludCA9IGRpc3BhdGNoZXIuZW5kcG9pbnRGb3IoY29ublR5cGUpO1xuXG4gICAgICBpZiAoYXJyYXkuaW5kZXhPZihkaXNhYmxlZCwgY29ublR5cGUpID49IDApXG4gICAgICAgIHJldHVybiByZXN1bWUoKTtcblxuICAgICAgaWYgKGFycmF5LmluZGV4T2YoYWxsb3dlZCwgY29ublR5cGUpIDwgMCkge1xuICAgICAgICBrbGFzcy5pc1VzYWJsZShkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQsIGZ1bmN0aW9uKCkge30pO1xuICAgICAgICByZXR1cm4gcmVzdW1lKCk7XG4gICAgICB9XG5cbiAgICAgIGtsYXNzLmlzVXNhYmxlKGRpc3BhdGNoZXIsIGNvbm5FbmRwb2ludCwgZnVuY3Rpb24oaXNVc2FibGUpIHtcbiAgICAgICAgaWYgKCFpc1VzYWJsZSkgcmV0dXJuIHJlc3VtZSgpO1xuICAgICAgICB2YXIgdHJhbnNwb3J0ID0ga2xhc3MuaGFzT3duUHJvcGVydHkoJ2NyZWF0ZScpID8ga2xhc3MuY3JlYXRlKGRpc3BhdGNoZXIsIGNvbm5FbmRwb2ludCkgOiBuZXcga2xhc3MoZGlzcGF0Y2hlciwgY29ubkVuZHBvaW50KTtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cmFuc3BvcnQpO1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGEgdXNhYmxlIGNvbm5lY3Rpb24gdHlwZSBmb3IgJyArIFVSSS5zdHJpbmdpZnkoZW5kcG9pbnQpKTtcbiAgICB9KTtcbiAgfSxcblxuICByZWdpc3RlcjogZnVuY3Rpb24odHlwZSwga2xhc3MpIHtcbiAgICB0aGlzLl90cmFuc3BvcnRzLnB1c2goW3R5cGUsIGtsYXNzXSk7XG4gICAga2xhc3MucHJvdG90eXBlLmNvbm5lY3Rpb25UeXBlID0gdHlwZTtcbiAgfSxcblxuICBnZXRDb25uZWN0aW9uVHlwZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhcnJheS5tYXAodGhpcy5fdHJhbnNwb3J0cywgZnVuY3Rpb24odCkgeyByZXR1cm4gdFswXSB9KTtcbiAgfSxcblxuICBfdHJhbnNwb3J0czogW11cbn0pO1xuXG5leHRlbmQoVHJhbnNwb3J0LnByb3RvdHlwZSwgTG9nZ2luZyk7XG5leHRlbmQoVHJhbnNwb3J0LnByb3RvdHlwZSwgVGltZW91dHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcG9ydDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvdHJhbnNwb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgICA9IHJlcXVpcmUoJy4uL3V0aWwvcHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGhlbjogZnVuY3Rpb24oY2FsbGJhY2ssIGVycmJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLl9wcm9taXNlKVxuICAgICAgdGhpcy5fcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBzZWxmLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgc2VsZi5fcmVqZWN0ICA9IHJlamVjdDtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5fcHJvbWlzZS50aGVuKGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgfSxcblxuICBjYWxsYmFjazogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUpIH0pO1xuICB9LFxuXG4gIGVycmJhY2s6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBmdW5jdGlvbihyZWFzb24pIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCByZWFzb24pIH0pO1xuICB9LFxuXG4gIHRpbWVvdXQ6IGZ1bmN0aW9uKHNlY29uZHMsIG1lc3NhZ2UpIHtcbiAgICB0aGlzLnRoZW4oKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fdGltZXIgPSBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuX3JlamVjdChtZXNzYWdlKTtcbiAgICB9LCBzZWNvbmRzICogMTAwMCk7XG4gIH0sXG5cbiAgc2V0RGVmZXJyZWRTdGF0dXM6IGZ1bmN0aW9uKHN0YXR1cywgdmFsdWUpIHtcbiAgICBpZiAodGhpcy5fdGltZXIpIGdsb2JhbC5jbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuXG4gICAgdGhpcy50aGVuKCk7XG5cbiAgICBpZiAoc3RhdHVzID09PSAnc3VjY2VlZGVkJylcbiAgICAgIHRoaXMuX3Jlc29sdmUodmFsdWUpO1xuICAgIGVsc2UgaWYgKHN0YXR1cyA9PT0gJ2ZhaWxlZCcpXG4gICAgICB0aGlzLl9yZWplY3QodmFsdWUpO1xuICAgIGVsc2VcbiAgICAgIGRlbGV0ZSB0aGlzLl9wcm9taXNlO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL21peGlucy9kZWZlcnJhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvSlNPTiA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpO1xuXG52YXIgTG9nZ2luZyA9IHtcbiAgTE9HX0xFVkVMUzoge1xuICAgIGZhdGFsOiAgNCxcbiAgICBlcnJvcjogIDMsXG4gICAgd2FybjogICAyLFxuICAgIGluZm86ICAgMSxcbiAgICBkZWJ1ZzogIDBcbiAgfSxcblxuICB3cml0ZUxvZzogZnVuY3Rpb24obWVzc2FnZUFyZ3MsIGxldmVsKSB7XG4gICAgdmFyIGxvZ2dlciA9IExvZ2dpbmcubG9nZ2VyIHx8IChMb2dnaW5nLndyYXBwZXIgfHwgTG9nZ2luZykubG9nZ2VyO1xuICAgIGlmICghbG9nZ2VyKSByZXR1cm47XG5cbiAgICB2YXIgYXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG1lc3NhZ2VBcmdzKSxcbiAgICAgICAgYmFubmVyID0gJ1tGYXllJyxcbiAgICAgICAga2xhc3MgID0gdGhpcy5jbGFzc05hbWUsXG5cbiAgICAgICAgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKS5yZXBsYWNlKC9cXD8vZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0b0pTT04oYXJncy5zaGlmdCgpKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuICdbT2JqZWN0XSc7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIGlmIChrbGFzcykgYmFubmVyICs9ICcuJyArIGtsYXNzO1xuICAgIGJhbm5lciArPSAnXSAnO1xuXG4gICAgaWYgKHR5cGVvZiBsb2dnZXJbbGV2ZWxdID09PSAnZnVuY3Rpb24nKVxuICAgICAgbG9nZ2VyW2xldmVsXShiYW5uZXIgKyBtZXNzYWdlKTtcbiAgICBlbHNlIGlmICh0eXBlb2YgbG9nZ2VyID09PSAnZnVuY3Rpb24nKVxuICAgICAgbG9nZ2VyKGJhbm5lciArIG1lc3NhZ2UpO1xuICB9XG59O1xuXG5mb3IgKHZhciBrZXkgaW4gTG9nZ2luZy5MT0dfTEVWRUxTKVxuICAoZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBMb2dnaW5nW2xldmVsXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy53cml0ZUxvZyhhcmd1bWVudHMsIGxldmVsKTtcbiAgICB9O1xuICB9KShrZXkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvbWl4aW5zL2xvZ2dpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBodHRwOi8vYXNzYW5rYS5uZXQvY29udGVudC90ZWNoLzIwMDkvMDkvMDIvanNvbjItanMtdnMtcHJvdG90eXBlL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuICh0aGlzW2tleV0gaW5zdGFuY2VvZiBBcnJheSkgPyB0aGlzW2tleV0gOiB2YWx1ZTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvdG9fanNvbi5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc2FwID0gcmVxdWlyZSgnYXNhcCcpO1xuXG52YXIgUEVORElORyAgID0gMCxcbiAgICBGVUxGSUxMRUQgPSAxLFxuICAgIFJFSkVDVEVEICA9IDI7XG5cbnZhciBSRVRVUk4gPSBmdW5jdGlvbih4KSB7IHJldHVybiB4IH0sXG4gICAgVEhST1cgID0gZnVuY3Rpb24oeCkgeyB0aHJvdyAgeCB9O1xuXG52YXIgUHJvbWlzZSA9IGZ1bmN0aW9uKHRhc2spIHtcbiAgdGhpcy5fc3RhdGUgICAgICAgPSBQRU5ESU5HO1xuICB0aGlzLl9vbkZ1bGZpbGxlZCA9IFtdO1xuICB0aGlzLl9vblJlamVjdGVkICA9IFtdO1xuXG4gIGlmICh0eXBlb2YgdGFzayAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGFzayhmdW5jdGlvbih2YWx1ZSkgIHsgcmVzb2x2ZShzZWxmLCB2YWx1ZSkgfSxcbiAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHNlbGYsIHJlYXNvbikgfSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgdmFyIG5leHQgPSBuZXcgUHJvbWlzZSgpO1xuICByZWdpc3Rlck9uRnVsZmlsbGVkKHRoaXMsIG9uRnVsZmlsbGVkLCBuZXh0KTtcbiAgcmVnaXN0ZXJPblJlamVjdGVkKHRoaXMsIG9uUmVqZWN0ZWQsIG5leHQpO1xuICByZXR1cm4gbmV4dDtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblxudmFyIHJlZ2lzdGVyT25GdWxmaWxsZWQgPSBmdW5jdGlvbihwcm9taXNlLCBvbkZ1bGZpbGxlZCwgbmV4dCkge1xuICBpZiAodHlwZW9mIG9uRnVsZmlsbGVkICE9PSAnZnVuY3Rpb24nKSBvbkZ1bGZpbGxlZCA9IFJFVFVSTjtcbiAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbih2YWx1ZSkgeyBpbnZva2Uob25GdWxmaWxsZWQsIHZhbHVlLCBuZXh0KSB9O1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHByb21pc2UuX29uRnVsZmlsbGVkLnB1c2goaGFuZGxlcik7XG4gIH0gZWxzZSBpZiAocHJvbWlzZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGhhbmRsZXIocHJvbWlzZS5fdmFsdWUpO1xuICB9XG59O1xuXG52YXIgcmVnaXN0ZXJPblJlamVjdGVkID0gZnVuY3Rpb24ocHJvbWlzZSwgb25SZWplY3RlZCwgbmV4dCkge1xuICBpZiAodHlwZW9mIG9uUmVqZWN0ZWQgIT09ICdmdW5jdGlvbicpIG9uUmVqZWN0ZWQgPSBUSFJPVztcbiAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbihyZWFzb24pIHsgaW52b2tlKG9uUmVqZWN0ZWQsIHJlYXNvbiwgbmV4dCkgfTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICBwcm9taXNlLl9vblJlamVjdGVkLnB1c2goaGFuZGxlcik7XG4gIH0gZWxzZSBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgaGFuZGxlcihwcm9taXNlLl9yZWFzb24pO1xuICB9XG59O1xuXG52YXIgaW52b2tlID0gZnVuY3Rpb24oZm4sIHZhbHVlLCBuZXh0KSB7XG4gIGFzYXAoZnVuY3Rpb24oKSB7IF9pbnZva2UoZm4sIHZhbHVlLCBuZXh0KSB9KTtcbn07XG5cbnZhciBfaW52b2tlID0gZnVuY3Rpb24oZm4sIHZhbHVlLCBuZXh0KSB7XG4gIHZhciBvdXRjb21lO1xuXG4gIHRyeSB7XG4gICAgb3V0Y29tZSA9IGZuKHZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gcmVqZWN0KG5leHQsIGVycm9yKTtcbiAgfVxuXG4gIGlmIChvdXRjb21lID09PSBuZXh0KSB7XG4gICAgcmVqZWN0KG5leHQsIG5ldyBUeXBlRXJyb3IoJ1JlY3Vyc2l2ZSBwcm9taXNlIGNoYWluIGRldGVjdGVkJykpO1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmUobmV4dCwgb3V0Y29tZSk7XG4gIH1cbn07XG5cbnZhciByZXNvbHZlID0gZnVuY3Rpb24ocHJvbWlzZSwgdmFsdWUpIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlLCB0eXBlLCB0aGVuO1xuXG4gIHRyeSB7XG4gICAgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICB0aGVuID0gdmFsdWUgIT09IG51bGwgJiYgKHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcpICYmIHZhbHVlLnRoZW47XG5cbiAgICBpZiAodHlwZW9mIHRoZW4gIT09ICdmdW5jdGlvbicpIHJldHVybiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcblxuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgaWYgKCEoY2FsbGVkIF4gKGNhbGxlZCA9IHRydWUpKSkgcmV0dXJuO1xuICAgICAgcmVzb2x2ZShwcm9taXNlLCB2KTtcbiAgICB9LCBmdW5jdGlvbihyKSB7XG4gICAgICBpZiAoIShjYWxsZWQgXiAoY2FsbGVkID0gdHJ1ZSkpKSByZXR1cm47XG4gICAgICByZWplY3QocHJvbWlzZSwgcik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKCEoY2FsbGVkIF4gKGNhbGxlZCA9IHRydWUpKSkgcmV0dXJuO1xuICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gIH1cbn07XG5cbnZhciBmdWxmaWxsID0gZnVuY3Rpb24ocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSByZXR1cm47XG5cbiAgcHJvbWlzZS5fc3RhdGUgICAgICA9IEZVTEZJTExFRDtcbiAgcHJvbWlzZS5fdmFsdWUgICAgICA9IHZhbHVlO1xuICBwcm9taXNlLl9vblJlamVjdGVkID0gW107XG5cbiAgdmFyIG9uRnVsZmlsbGVkID0gcHJvbWlzZS5fb25GdWxmaWxsZWQsIGZuO1xuICB3aGlsZSAoZm4gPSBvbkZ1bGZpbGxlZC5zaGlmdCgpKSBmbih2YWx1ZSk7XG59O1xuXG52YXIgcmVqZWN0ID0gZnVuY3Rpb24ocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgcmV0dXJuO1xuXG4gIHByb21pc2UuX3N0YXRlICAgICAgID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3JlYXNvbiAgICAgID0gcmVhc29uO1xuICBwcm9taXNlLl9vbkZ1bGZpbGxlZCA9IFtdO1xuXG4gIHZhciBvblJlamVjdGVkID0gcHJvbWlzZS5fb25SZWplY3RlZCwgZm47XG4gIHdoaWxlIChmbiA9IG9uUmVqZWN0ZWQuc2hpZnQoKSkgZm4ocmVhc29uKTtcbn07XG5cblByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSh2YWx1ZSkgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHJlYXNvbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7IHJlamVjdChyZWFzb24pIH0pO1xufTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihwcm9taXNlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGxpc3QgPSBbXSwgbiA9IHByb21pc2VzLmxlbmd0aCwgaTtcblxuICAgIGlmIChuID09PSAwKSByZXR1cm4gcmVzb2x2ZShsaXN0KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIChmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBsaXN0W2ldID0gdmFsdWU7XG4gICAgICAgIGlmICgtLW4gPT09IDApIHJlc29sdmUobGlzdCk7XG4gICAgICB9LCByZWplY3QpO1xuICAgIH0pKHByb21pc2VzW2ldLCBpKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbihwcm9taXNlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwcm9taXNlcy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLmRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0dXBsZSA9IHt9O1xuXG4gIHR1cGxlLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0dXBsZS5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB0dXBsZS5yZWplY3QgID0gcmVqZWN0O1xuICB9KTtcbiAgcmV0dXJuIHR1cGxlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvcHJvbWlzZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvZXZlbnRfZW1pdHRlcicpO1xuXG52YXIgUHVibGlzaGVyID0ge1xuICBjb3VudExpc3RlbmVyczogZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzKGV2ZW50VHlwZSkubGVuZ3RoO1xuICB9LFxuXG4gIGJpbmQ6IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgc2xpY2UgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBsaXN0ZW5lci5hcHBseShjb250ZXh0LCBzbGljZS5jYWxsKGFyZ3VtZW50cykpIH07XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMgfHwgW107XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goW2V2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQsIGhhbmRsZXJdKTtcbiAgICByZXR1cm4gdGhpcy5vbihldmVudFR5cGUsIGhhbmRsZXIpO1xuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgY29udGV4dCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyB8fCBbXTtcbiAgICB2YXIgbiA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGgsIHR1cGxlO1xuXG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgdHVwbGUgPSB0aGlzLl9saXN0ZW5lcnNbbl07XG4gICAgICBpZiAodHVwbGVbMF0gIT09IGV2ZW50VHlwZSkgY29udGludWU7XG4gICAgICBpZiAobGlzdGVuZXIgJiYgKHR1cGxlWzFdICE9PSBsaXN0ZW5lciB8fCB0dXBsZVsyXSAhPT0gY29udGV4dCkpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShuLCAxKTtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnRUeXBlLCB0dXBsZVszXSk7XG4gICAgfVxuICB9XG59O1xuXG5leHRlbmQoUHVibGlzaGVyLCBFdmVudEVtaXR0ZXIucHJvdG90eXBlKTtcblB1Ymxpc2hlci50cmlnZ2VyID0gUHVibGlzaGVyLmVtaXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gUHVibGlzaGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL21peGlucy9wdWJsaXNoZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tbW9uRWxlbWVudDogZnVuY3Rpb24obGlzdGEsIGxpc3RiKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsaXN0YS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmluZGV4T2YobGlzdGIsIGxpc3RhW2ldKSAhPT0gLTEpXG4gICAgICAgIHJldHVybiBsaXN0YVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgaW5kZXhPZjogZnVuY3Rpb24obGlzdCwgbmVlZGxlKSB7XG4gICAgaWYgKGxpc3QuaW5kZXhPZikgcmV0dXJuIGxpc3QuaW5kZXhPZihuZWVkbGUpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsaXN0Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IG5lZWRsZSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAob2JqZWN0Lm1hcCkgcmV0dXJuIG9iamVjdC5tYXAoY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBvYmplY3QubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBudWxsLCBvYmplY3RbaV0sIGkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG51bGwsIGtleSwgb2JqZWN0W2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBmaWx0ZXI6IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChhcnJheS5maWx0ZXIpIHJldHVybiBhcnJheS5maWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBudWxsLCBhcnJheVtpXSwgaSkpXG4gICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBhc3luY0VhY2g6IGZ1bmN0aW9uKGxpc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBuICAgICAgID0gbGlzdC5sZW5ndGgsXG4gICAgICAgIGkgICAgICAgPSAtMSxcbiAgICAgICAgY2FsbHMgICA9IDAsXG4gICAgICAgIGxvb3BpbmcgPSBmYWxzZTtcblxuICAgIHZhciBpdGVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBjYWxscyAtPSAxO1xuICAgICAgaSArPSAxO1xuICAgICAgaWYgKGkgPT09IG4pIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xuICAgICAgaXRlcmF0b3IobGlzdFtpXSwgcmVzdW1lKTtcbiAgICB9O1xuXG4gICAgdmFyIGxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChsb29waW5nKSByZXR1cm47XG4gICAgICBsb29waW5nID0gdHJ1ZTtcbiAgICAgIHdoaWxlIChjYWxscyA+IDApIGl0ZXJhdGUoKTtcbiAgICAgIGxvb3BpbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbHMgKz0gMTtcbiAgICAgIGxvb3AoKTtcbiAgICB9O1xuICAgIHJlc3VtZSgpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvYXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50ID0ge1xuICBfcmVnaXN0cnk6IFtdLFxuXG4gIG9uOiBmdW5jdGlvbihlbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHdyYXBwZWQgPSBmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0KSB9O1xuXG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHdyYXBwZWQsIGZhbHNlKTtcbiAgICBlbHNlXG4gICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIHdyYXBwZWQpO1xuXG4gICAgdGhpcy5fcmVnaXN0cnkucHVzaCh7XG4gICAgICBfZWxlbWVudDogICBlbGVtZW50LFxuICAgICAgX3R5cGU6ICAgICAgZXZlbnROYW1lLFxuICAgICAgX2NhbGxiYWNrOiAgY2FsbGJhY2ssXG4gICAgICBfY29udGV4dDogICAgIGNvbnRleHQsXG4gICAgICBfaGFuZGxlcjogICB3cmFwcGVkXG4gICAgfSk7XG4gIH0sXG5cbiAgZGV0YWNoOiBmdW5jdGlvbihlbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIGkgPSB0aGlzLl9yZWdpc3RyeS5sZW5ndGgsIHJlZ2lzdGVyO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHJlZ2lzdGVyID0gdGhpcy5fcmVnaXN0cnlbaV07XG5cbiAgICAgIGlmICgoZWxlbWVudCAgICAmJiBlbGVtZW50ICAgICE9PSByZWdpc3Rlci5fZWxlbWVudCkgIHx8XG4gICAgICAgICAgKGV2ZW50TmFtZSAgJiYgZXZlbnROYW1lICAhPT0gcmVnaXN0ZXIuX3R5cGUpICAgICB8fFxuICAgICAgICAgIChjYWxsYmFjayAgICYmIGNhbGxiYWNrICAgIT09IHJlZ2lzdGVyLl9jYWxsYmFjaykgfHxcbiAgICAgICAgICAoY29udGV4dCAgICAmJiBjb250ZXh0ICAgICE9PSByZWdpc3Rlci5fY29udGV4dCkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAocmVnaXN0ZXIuX2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgcmVnaXN0ZXIuX2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihyZWdpc3Rlci5fdHlwZSwgcmVnaXN0ZXIuX2hhbmRsZXIsIGZhbHNlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmVnaXN0ZXIuX2VsZW1lbnQuZGV0YWNoRXZlbnQoJ29uJyArIHJlZ2lzdGVyLl90eXBlLCByZWdpc3Rlci5faGFuZGxlcik7XG5cbiAgICAgIHRoaXMuX3JlZ2lzdHJ5LnNwbGljZShpLDEpO1xuICAgICAgcmVnaXN0ZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufTtcblxuaWYgKGdsb2JhbC5vbnVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICBFdmVudC5vbihnbG9iYWwsICd1bmxvYWQnLCBFdmVudC5kZXRhY2gsIEV2ZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEV2ZW50OiBFdmVudFxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2Jyb3dzZXIvZXZlbnQuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvcHlPYmplY3QgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNsb25lLCBpLCBrZXk7XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGNsb25lID0gW107XG4gICAgaSA9IG9iamVjdC5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkgY2xvbmVbaV0gPSBjb3B5T2JqZWN0KG9iamVjdFtpXSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSB7XG4gICAgY2xvbmUgPSAob2JqZWN0ID09PSBudWxsKSA/IG51bGwgOiB7fTtcbiAgICBmb3IgKGtleSBpbiBvYmplY3QpIGNsb25lW2tleV0gPSBjb3B5T2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvY29weV9vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyByYXdBc2FwIHByb3ZpZGVzIGV2ZXJ5dGhpbmcgd2UgbmVlZCBleGNlcHQgZXhjZXB0aW9uIG1hbmFnZW1lbnQuXG52YXIgcmF3QXNhcCA9IHJlcXVpcmUoXCIuL3Jhd1wiKTtcbi8vIFJhd1Rhc2tzIGFyZSByZWN5Y2xlZCB0byByZWR1Y2UgR0MgY2h1cm4uXG52YXIgZnJlZVRhc2tzID0gW107XG4vLyBXZSBxdWV1ZSBlcnJvcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHRocm93biBpbiByaWdodCBvcmRlciAoRklGTykuXG4vLyBBcnJheS1hcy1xdWV1ZSBpcyBnb29kIGVub3VnaCBoZXJlLCBzaW5jZSB3ZSBhcmUganVzdCBkZWFsaW5nIHdpdGggZXhjZXB0aW9ucy5cbnZhciBwZW5kaW5nRXJyb3JzID0gW107XG52YXIgcmVxdWVzdEVycm9yVGhyb3cgPSByYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcih0aHJvd0ZpcnN0RXJyb3IpO1xuXG5mdW5jdGlvbiB0aHJvd0ZpcnN0RXJyb3IoKSB7XG4gICAgaWYgKHBlbmRpbmdFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IHBlbmRpbmdFcnJvcnMuc2hpZnQoKTtcbiAgICB9XG59XG5cbi8qKlxuICogQ2FsbHMgYSB0YXNrIGFzIHNvb24gYXMgcG9zc2libGUgYWZ0ZXIgcmV0dXJuaW5nLCBpbiBpdHMgb3duIGV2ZW50LCB3aXRoIHByaW9yaXR5XG4gKiBvdmVyIG90aGVyIGV2ZW50cyBsaWtlIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVwYWludC4gQW4gZXJyb3IgdGhyb3duIGZyb20gYW5cbiAqIGV2ZW50IHdpbGwgbm90IGludGVycnVwdCwgbm9yIGV2ZW4gc3Vic3RhbnRpYWxseSBzbG93IGRvd24gdGhlIHByb2Nlc3Npbmcgb2ZcbiAqIG90aGVyIGV2ZW50cywgYnV0IHdpbGwgYmUgcmF0aGVyIHBvc3Rwb25lZCB0byBhIGxvd2VyIHByaW9yaXR5IGV2ZW50LlxuICogQHBhcmFtIHt7Y2FsbH19IHRhc2sgQSBjYWxsYWJsZSBvYmplY3QsIHR5cGljYWxseSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgbm9cbiAqIGFyZ3VtZW50cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBhc2FwO1xuZnVuY3Rpb24gYXNhcCh0YXNrKSB7XG4gICAgdmFyIHJhd1Rhc2s7XG4gICAgaWYgKGZyZWVUYXNrcy5sZW5ndGgpIHtcbiAgICAgICAgcmF3VGFzayA9IGZyZWVUYXNrcy5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByYXdUYXNrID0gbmV3IFJhd1Rhc2soKTtcbiAgICB9XG4gICAgcmF3VGFzay50YXNrID0gdGFzaztcbiAgICByYXdBc2FwKHJhd1Rhc2spO1xufVxuXG4vLyBXZSB3cmFwIHRhc2tzIHdpdGggcmVjeWNsYWJsZSB0YXNrIG9iamVjdHMuICBBIHRhc2sgb2JqZWN0IGltcGxlbWVudHNcbi8vIGBjYWxsYCwganVzdCBsaWtlIGEgZnVuY3Rpb24uXG5mdW5jdGlvbiBSYXdUYXNrKCkge1xuICAgIHRoaXMudGFzayA9IG51bGw7XG59XG5cbi8vIFRoZSBzb2xlIHB1cnBvc2Ugb2Ygd3JhcHBpbmcgdGhlIHRhc2sgaXMgdG8gY2F0Y2ggdGhlIGV4Y2VwdGlvbiBhbmQgcmVjeWNsZVxuLy8gdGhlIHRhc2sgb2JqZWN0IGFmdGVyIGl0cyBzaW5nbGUgdXNlLlxuUmF3VGFzay5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICB0aGlzLnRhc2suY2FsbCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChhc2FwLm9uZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaG9vayBleGlzdHMgcHVyZWx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuICAgICAgICAgICAgLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0XG4gICAgICAgICAgICAvLyBkZXBlbmRzIG9uIGl0cyBleGlzdGVuY2UuXG4gICAgICAgICAgICBhc2FwLm9uZXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSW4gYSB3ZWIgYnJvd3NlciwgZXhjZXB0aW9ucyBhcmUgbm90IGZhdGFsLiBIb3dldmVyLCB0byBhdm9pZFxuICAgICAgICAgICAgLy8gc2xvd2luZyBkb3duIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIHRhc2tzLCB3ZSByZXRocm93IHRoZSBlcnJvciBpbiBhXG4gICAgICAgICAgICAvLyBsb3dlciBwcmlvcml0eSB0dXJuLlxuICAgICAgICAgICAgcGVuZGluZ0Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgIHJlcXVlc3RFcnJvclRocm93KCk7XG4gICAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnRhc2sgPSBudWxsO1xuICAgICAgICBmcmVlVGFza3NbZnJlZVRhc2tzLmxlbmd0aF0gPSB0aGlzO1xuICAgIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXNhcC9icm93c2VyLWFzYXAuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBleHRlbmQgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIFB1Ymxpc2hlciA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBHcmFtbWFyICAgPSByZXF1aXJlKCcuL2dyYW1tYXInKTtcblxudmFyIENoYW5uZWwgPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5uYW1lID0gbmFtZTtcbiAgfSxcblxuICBwdXNoOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy50cmlnZ2VyKCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gIH0sXG5cbiAgaXNVbnVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50TGlzdGVuZXJzKCdtZXNzYWdlJykgPT09IDA7XG4gIH1cbn0pO1xuXG5leHRlbmQoQ2hhbm5lbC5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5cbmV4dGVuZChDaGFubmVsLCB7XG4gIEhBTkRTSEFLRTogICAgJy9tZXRhL2hhbmRzaGFrZScsXG4gIENPTk5FQ1Q6ICAgICAgJy9tZXRhL2Nvbm5lY3QnLFxuICBTVUJTQ1JJQkU6ICAgICcvbWV0YS9zdWJzY3JpYmUnLFxuICBVTlNVQlNDUklCRTogICcvbWV0YS91bnN1YnNjcmliZScsXG4gIERJU0NPTk5FQ1Q6ICAgJy9tZXRhL2Rpc2Nvbm5lY3QnLFxuXG4gIE1FVEE6ICAgICAgICAgJ21ldGEnLFxuICBTRVJWSUNFOiAgICAgICdzZXJ2aWNlJyxcblxuICBleHBhbmQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnBhcnNlKG5hbWUpLFxuICAgICAgICBjaGFubmVscyA9IFsnLyoqJywgbmFtZV07XG5cbiAgICB2YXIgY29weSA9IHNlZ21lbnRzLnNsaWNlKCk7XG4gICAgY29weVtjb3B5Lmxlbmd0aCAtIDFdID0gJyonO1xuICAgIGNoYW5uZWxzLnB1c2godGhpcy51bnBhcnNlKGNvcHkpKTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBjb3B5ID0gc2VnbWVudHMuc2xpY2UoMCwgaSk7XG4gICAgICBjb3B5LnB1c2goJyoqJyk7XG4gICAgICBjaGFubmVscy5wdXNoKHRoaXMudW5wYXJzZShjb3B5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5uZWxzO1xuICB9LFxuXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gR3JhbW1hci5DSEFOTkVMX05BTUUudGVzdChuYW1lKSB8fFxuICAgICAgICAgICBHcmFtbWFyLkNIQU5ORUxfUEFUVEVSTi50ZXN0KG5hbWUpO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQobmFtZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBuYW1lLnNwbGl0KCcvJykuc2xpY2UoMSk7XG4gIH0sXG5cbiAgdW5wYXJzZTogZnVuY3Rpb24oc2VnbWVudHMpIHtcbiAgICByZXR1cm4gJy8nICsgc2VnbWVudHMuam9pbignLycpO1xuICB9LFxuXG4gIGlzTWV0YTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzZWdtZW50cyA9IHRoaXMucGFyc2UobmFtZSk7XG4gICAgcmV0dXJuIHNlZ21lbnRzID8gKHNlZ21lbnRzWzBdID09PSB0aGlzLk1FVEEpIDogbnVsbDtcbiAgfSxcblxuICBpc1NlcnZpY2U6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnBhcnNlKG5hbWUpO1xuICAgIHJldHVybiBzZWdtZW50cyA/IChzZWdtZW50c1swXSA9PT0gdGhpcy5TRVJWSUNFKSA6IG51bGw7XG4gIH0sXG5cbiAgaXNTdWJzY3JpYmFibGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZChuYW1lKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuICF0aGlzLmlzTWV0YShuYW1lKSAmJiAhdGhpcy5pc1NlcnZpY2UobmFtZSk7XG4gIH0sXG5cbiAgU2V0OiBDbGFzcyh7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFubmVscyA9IHt9O1xuICAgIH0sXG5cbiAgICBnZXRLZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXlzID0gW107XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fY2hhbm5lbHMpIGtleXMucHVzaChrZXkpO1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW25hbWVdO1xuICAgIH0sXG5cbiAgICBoYXNTdWJzY3JpcHRpb246IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShuYW1lKTtcbiAgICB9LFxuXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbihuYW1lcywgc3Vic2NyaXB0aW9uKSB7XG4gICAgICB2YXIgbmFtZTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gbmFtZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tuYW1lXSA9IHRoaXMuX2NoYW5uZWxzW25hbWVdIHx8IG5ldyBDaGFubmVsKG5hbWUpO1xuICAgICAgICBjaGFubmVsLmJpbmQoJ21lc3NhZ2UnLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24obmFtZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICB2YXIgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW25hbWVdO1xuICAgICAgaWYgKCFjaGFubmVsKSByZXR1cm4gZmFsc2U7XG4gICAgICBjaGFubmVsLnVuYmluZCgnbWVzc2FnZScsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgIGlmIChjaGFubmVsLmlzVW51c2VkKCkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobmFtZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXN0cmlidXRlTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgdmFyIGNoYW5uZWxzID0gQ2hhbm5lbC5leHBhbmQobWVzc2FnZS5jaGFubmVsKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjaGFubmVscy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsc1tpXV07XG4gICAgICAgIGlmIChjaGFubmVsKSBjaGFubmVsLnRyaWdnZXIoJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFubmVsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2NoYW5uZWwuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENIQU5ORUxfTkFNRTogICAgIC9eXFwvKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApKSkrKFxcLygoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKSkpKykqJC8sXG4gIENIQU5ORUxfUEFUVEVSTjogIC9eKFxcLygoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKSkpKykqXFwvXFwqezEsMn0kLyxcbiAgRVJST1I6ICAgICAgICAgICAgL14oWzAtOV1bMC05XVswLTldOigoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKXwgfFxcL3xcXCp8XFwuKSkqKCwoKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCl8IHxcXC98XFwqfFxcLikpKikqOigoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKXwgfFxcL3xcXCp8XFwuKSkqfFswLTldWzAtOV1bMC05XTo6KCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSopJC8sXG4gIFZFUlNJT046ICAgICAgICAgIC9eKFswLTldKSsoXFwuKChbYS16XXxbQS1aXSl8WzAtOV0pKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8XFwtfFxcXykpKikqJC9cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvZ3JhbW1hci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKTtcblxudmFyIFNjaGVkdWxlciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgdGhpcy5tZXNzYWdlICA9IG1lc3NhZ2U7XG4gIHRoaXMub3B0aW9ucyAgPSBvcHRpb25zO1xuICB0aGlzLmF0dGVtcHRzID0gMDtcbn07XG5cbmV4dGVuZChTY2hlZHVsZXIucHJvdG90eXBlLCB7XG4gIGdldFRpbWVvdXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudGltZW91dDtcbiAgfSxcblxuICBnZXRJbnRlcnZhbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbnRlcnZhbDtcbiAgfSxcblxuICBpc0RlbGl2ZXJhYmxlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXR0ZW1wdHMgPSB0aGlzLm9wdGlvbnMuYXR0ZW1wdHMsXG4gICAgICAgIG1hZGUgICAgID0gdGhpcy5hdHRlbXB0cyxcbiAgICAgICAgZGVhZGxpbmUgPSB0aGlzLm9wdGlvbnMuZGVhZGxpbmUsXG4gICAgICAgIG5vdyAgICAgID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAoYXR0ZW1wdHMgIT09IHVuZGVmaW5lZCAmJiBtYWRlID49IGF0dGVtcHRzKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKGRlYWRsaW5lICE9PSB1bmRlZmluZWQgJiYgbm93ID4gZGVhZGxpbmUpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBzZW5kOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmF0dGVtcHRzICs9IDE7XG4gIH0sXG5cbiAgc3VjY2VlZDogZnVuY3Rpb24oKSB7fSxcblxuICBmYWlsOiBmdW5jdGlvbigpIHt9LFxuXG4gIGFib3J0OiBmdW5jdGlvbigpIHt9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgVVJJICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBicm93c2VyICAgPSByZXF1aXJlKCcuLi91dGlsL2Jyb3dzZXInKSxcbiAgICBleHRlbmQgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHRvSlNPTiAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpLFxuICAgIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cbnZhciBYSFIgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gdG9KU09OKG1lc3NhZ2VzKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHZhciBocmVmID0gdGhpcy5lbmRwb2ludC5ocmVmLFxuICAgICAgICBzZWxmID0gdGhpcyxcbiAgICAgICAgeGhyO1xuXG4gICAgLy8gUHJlZmVyIFhNTEh0dHBSZXF1ZXN0IG92ZXIgQWN0aXZlWE9iamVjdCBpZiB0aGV5IGJvdGggZXhpc3RcbiAgICBpZiAoZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5BY3RpdmVYT2JqZWN0KSB7XG4gICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9XG5cbiAgICB4aHIub3BlbignUE9TVCcsIGhyZWYsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuXG4gICAgdmFyIGhlYWRlcnMgPSB0aGlzLl9kaXNwYXRjaGVyLmhlYWRlcnM7XG4gICAgZm9yICh2YXIga2V5IGluIGhlYWRlcnMpIHtcbiAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICB9XG5cbiAgICB2YXIgYWJvcnQgPSBmdW5jdGlvbigpIHsgeGhyLmFib3J0KCkgfTtcbiAgICBpZiAoZ2xvYmFsLm9uYmVmb3JldW5sb2FkICE9PSB1bmRlZmluZWQpXG4gICAgICBicm93c2VyLkV2ZW50Lm9uKGdsb2JhbCwgJ2JlZm9yZXVubG9hZCcsIGFib3J0KTtcblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgheGhyIHx8IHhoci5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XG5cbiAgICAgIHZhciByZXBsaWVzICAgID0gbnVsbCxcbiAgICAgICAgICBzdGF0dXMgICAgID0geGhyLnN0YXR1cyxcbiAgICAgICAgICB0ZXh0ICAgICAgID0geGhyLnJlc3BvbnNlVGV4dCxcbiAgICAgICAgICBzdWNjZXNzZnVsID0gKHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwKSB8fCBzdGF0dXMgPT09IDMwNCB8fCBzdGF0dXMgPT09IDEyMjM7XG5cbiAgICAgIGlmIChnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYnJvd3Nlci5FdmVudC5kZXRhY2goZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgYWJvcnQpO1xuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgIHhociA9IG51bGw7XG5cbiAgICAgIGlmICghc3VjY2Vzc2Z1bCkgcmV0dXJuIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVwbGllcyA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge31cblxuICAgICAgaWYgKHJlcGxpZXMpXG4gICAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgeGhyLnNlbmQodGhpcy5lbmNvZGUobWVzc2FnZXMpKTtcbiAgICByZXR1cm4geGhyO1xuICB9XG59KSwge1xuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHVzYWJsZSA9IChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJylcbiAgICAgICAgICAgICAgfHwgVVJJLmlzU2FtZU9yaWdpbihlbmRwb2ludCk7XG5cbiAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHVzYWJsZSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhIUjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQveGhyLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgVkVSU0lPTjogICAgICAgICAgJzEuMi40JyxcblxuICBCQVlFVVhfVkVSU0lPTjogICAnMS4wJyxcbiAgSURfTEVOR1RIOiAgICAgICAgMTYwLFxuICBKU09OUF9DQUxMQkFDSzogICAnanNvbnBjYWxsYmFjaycsXG4gIENPTk5FQ1RJT05fVFlQRVM6IFsnbG9uZy1wb2xsaW5nJywgJ2Nyb3NzLW9yaWdpbi1sb25nLXBvbGxpbmcnLCAnY2FsbGJhY2stcG9sbGluZycsICd3ZWJzb2NrZXQnLCAnZXZlbnRzb3VyY2UnLCAnaW4tcHJvY2VzcyddLFxuXG4gIE1BTkRBVE9SWV9DT05ORUNUSU9OX1RZUEVTOiBbJ2xvbmctcG9sbGluZycsICdjYWxsYmFjay1wb2xsaW5nJywgJ2luLXByb2Nlc3MnXVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2NvbnN0YW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvY29va2llcy9icm93c2VyX2Nvb2tpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzID0gcmVxdWlyZSgnLi9jbGFzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5faW5kZXggPSB7fTtcbiAgfSxcblxuICBhZGQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIga2V5ID0gKGl0ZW0uaWQgIT09IHVuZGVmaW5lZCkgPyBpdGVtLmlkIDogaXRlbTtcbiAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuX2luZGV4W2tleV0gPSBpdGVtO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGZvckVhY2g6IGZ1bmN0aW9uKGJsb2NrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2luZGV4KSB7XG4gICAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgYmxvY2suY2FsbChjb250ZXh0LCB0aGlzLl9pbmRleFtrZXldKTtcbiAgICB9XG4gIH0sXG5cbiAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2luZGV4KSB7XG4gICAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBtZW1iZXI6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5faW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLl9pbmRleFtrZXldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBrZXkgPSAoaXRlbS5pZCAhPT0gdW5kZWZpbmVkKSA/IGl0ZW0uaWQgOiBpdGVtO1xuICAgIHZhciByZW1vdmVkID0gdGhpcy5faW5kZXhba2V5XTtcbiAgICBkZWxldGUgdGhpcy5faW5kZXhba2V5XTtcbiAgICByZXR1cm4gcmVtb3ZlZDtcbiAgfSxcblxuICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyBhcnJheS5wdXNoKGl0ZW0pIH0pO1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9zZXQuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vdXRpbC9jb25zdGFudHMnKSxcbiAgICBMb2dnaW5nICAgPSByZXF1aXJlKCcuL21peGlucy9sb2dnaW5nJyk7XG5cbnZhciBGYXllID0ge1xuICBWRVJTSU9OOiAgICBjb25zdGFudHMuVkVSU0lPTixcblxuICBDbGllbnQ6ICAgICByZXF1aXJlKCcuL3Byb3RvY29sL2NsaWVudCcpLFxuICBTY2hlZHVsZXI6ICByZXF1aXJlKCcuL3Byb3RvY29sL3NjaGVkdWxlcicpXG59O1xuXG5Mb2dnaW5nLndyYXBwZXIgPSBGYXllO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZheWU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvZmF5ZV9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gVXNlIHRoZSBmYXN0ZXN0IG1lYW5zIHBvc3NpYmxlIHRvIGV4ZWN1dGUgYSB0YXNrIGluIGl0cyBvd24gdHVybiwgd2l0aFxuLy8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIElPLCBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlZHJhd1xuLy8gZXZlbnRzIGluIGJyb3dzZXJzLlxuLy9cbi8vIEFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYSB0YXNrIHdpbGwgcGVybWFuZW50bHkgaW50ZXJydXB0IHRoZSBwcm9jZXNzaW5nIG9mXG4vLyBzdWJzZXF1ZW50IHRhc2tzLiBUaGUgaGlnaGVyIGxldmVsIGBhc2FwYCBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24gYnkgYSB0YXNrLCB0aGF0IHRoZSB0YXNrIHF1ZXVlIHdpbGwgY29udGludWUgZmx1c2hpbmcgYXNcbi8vIHNvb24gYXMgcG9zc2libGUsIGJ1dCBpZiB5b3UgdXNlIGByYXdBc2FwYCBkaXJlY3RseSwgeW91IGFyZSByZXNwb25zaWJsZSB0b1xuLy8gZWl0aGVyIGVuc3VyZSB0aGF0IG5vIGV4Y2VwdGlvbnMgYXJlIHRocm93biBmcm9tIHlvdXIgdGFzaywgb3IgdG8gbWFudWFsbHlcbi8vIGNhbGwgYHJhd0FzYXAucmVxdWVzdEZsdXNoYCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxubW9kdWxlLmV4cG9ydHMgPSByYXdBc2FwO1xuZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG4gICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmVxdWVzdEZsdXNoKCk7XG4gICAgICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRXF1aXZhbGVudCB0byBwdXNoLCBidXQgYXZvaWRzIGEgZnVuY3Rpb24gY2FsbC5cbiAgICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcbn1cblxudmFyIHF1ZXVlID0gW107XG4vLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuLy8gbmVjZXNzYXJ5IHVudGlsIHRoZSBuZXh0IGBmbHVzaGAgY29tcGxldGVzLlxudmFyIGZsdXNoaW5nID0gZmFsc2U7XG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBhbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBtZXRob2QgdGhhdCBhdHRlbXB0cyB0byBraWNrXG4vLyBvZmYgYSBgZmx1c2hgIGV2ZW50IGFzIHF1aWNrbHkgYXMgcG9zc2libGUuIGBmbHVzaGAgd2lsbCBhdHRlbXB0IHRvIGV4aGF1c3Rcbi8vIHRoZSBldmVudCBxdWV1ZSBiZWZvcmUgeWllbGRpbmcgdG8gdGhlIGJyb3dzZXIncyBvd24gZXZlbnQgbG9vcC5cbnZhciByZXF1ZXN0Rmx1c2g7XG4vLyBUaGUgcG9zaXRpb24gb2YgdGhlIG5leHQgdGFzayB0byBleGVjdXRlIGluIHRoZSB0YXNrIHF1ZXVlLiBUaGlzIGlzXG4vLyBwcmVzZXJ2ZWQgYmV0d2VlbiBjYWxscyB0byBgZmx1c2hgIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3VtZWQgaWZcbi8vIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLlxudmFyIGluZGV4ID0gMDtcbi8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcbi8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcbi8vIHRydW5jYXRlIGFscmVhZHktY29tcGxldGVkIHRhc2tzLlxudmFyIGNhcGFjaXR5ID0gMTAyNDtcblxuLy8gVGhlIGZsdXNoIGZ1bmN0aW9uIHByb2Nlc3NlcyBhbGwgdGFza3MgdGhhdCBoYXZlIGJlZW4gc2NoZWR1bGVkIHdpdGhcbi8vIGByYXdBc2FwYCB1bmxlc3MgYW5kIHVudGlsIG9uZSBvZiB0aG9zZSB0YXNrcyB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuLy8gSWYgYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24sIGBmbHVzaGAgZW5zdXJlcyB0aGF0IGl0cyBzdGF0ZSB3aWxsIHJlbWFpblxuLy8gY29uc2lzdGVudCBhbmQgd2lsbCByZXN1bWUgd2hlcmUgaXQgbGVmdCBvZmYgd2hlbiBjYWxsZWQgYWdhaW4uXG4vLyBIb3dldmVyLCBgZmx1c2hgIGRvZXMgbm90IG1ha2UgYW55IGFycmFuZ2VtZW50cyB0byBiZSBjYWxsZWQgYWdhaW4gaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB3aGlsZSAoaW5kZXggPCBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAvLyBBZHZhbmNlIHRoZSBpbmRleCBiZWZvcmUgY2FsbGluZyB0aGUgdGFzay4gVGhpcyBlbnN1cmVzIHRoYXQgd2Ugd2lsbFxuICAgICAgICAvLyBiZWdpbiBmbHVzaGluZyBvbiB0aGUgbmV4dCB0YXNrIHRoZSB0YXNrIHRocm93cyBhbiBlcnJvci5cbiAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XG4gICAgICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpO1xuICAgICAgICAvLyBQcmV2ZW50IGxlYWtpbmcgbWVtb3J5IGZvciBsb25nIGNoYWlucyBvZiByZWN1cnNpdmUgY2FsbHMgdG8gYGFzYXBgLlxuICAgICAgICAvLyBJZiB3ZSBjYWxsIGBhc2FwYCB3aXRoaW4gdGFza3Mgc2NoZWR1bGVkIGJ5IGBhc2FwYCwgdGhlIHF1ZXVlIHdpbGxcbiAgICAgICAgLy8gZ3JvdywgYnV0IHRvIGF2b2lkIGFuIE8obikgd2FsayBmb3IgZXZlcnkgdGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuICAgICAgICAvLyBzaGlmdCB0YXNrcyBvZmYgdGhlIHF1ZXVlIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGV4ZWN1dGVkLlxuICAgICAgICAvLyBJbnN0ZWFkLCB3ZSBwZXJpb2RpY2FsbHkgc2hpZnQgMTAyNCB0YXNrcyBvZmYgdGhlIHF1ZXVlLlxuICAgICAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuICAgICAgICAgICAgLy8gTWFudWFsbHkgc2hpZnQgYWxsIHZhbHVlcyBzdGFydGluZyBhdCB0aGUgaW5kZXggYmFjayB0byB0aGVcbiAgICAgICAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG4gICAgICAgICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuICAgICAgICAgICAgICAgIHF1ZXVlW3NjYW5dID0gcXVldWVbc2NhbiArIGluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGluZGV4ID0gMDtcbiAgICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBpbXBsZW1lbnRlZCB1c2luZyBhIHN0cmF0ZWd5IGJhc2VkIG9uIGRhdGEgY29sbGVjdGVkIGZyb21cbi8vIGV2ZXJ5IGF2YWlsYWJsZSBTYXVjZUxhYnMgU2VsZW5pdW0gd2ViIGRyaXZlciB3b3JrZXIgYXQgdGltZSBvZiB3cml0aW5nLlxuLy8gaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMW1HLTVVWUd1cDVxeEdkRU1Xa2hQNkJXQ3owNTNOVWIyRTFRb1VUVTE2dUEvZWRpdCNnaWQ9NzgzNzI0NTkzXG5cbi8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcbi8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG4vLyBNdXN0IHVzZSBgZ2xvYmFsYCBvciBgc2VsZmAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cblxuLyogZ2xvYmFscyBzZWxmICovXG52YXIgc2NvcGUgPSB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogc2VsZjtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IHNjb3BlLk11dGF0aW9uT2JzZXJ2ZXIgfHwgc2NvcGUuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuLy8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG4vLyByZWxpYWJseSBldmVyeXdoZXJlIHRoZXkgYXJlIGltcGxlbWVudGVkLlxuLy8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cbi8vXG4vLyAtIEFuZHJvaWQgNC00LjNcbi8vIC0gQ2hyb21lIDI2LTM0XG4vLyAtIEZpcmVmb3ggMTQtMjlcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbi8vIC0gaVBhZCBTYWZhcmkgNi03LjFcbi8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuLy8gLSBTYWZhcmkgNi03XG5pZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cbi8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbi8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcbi8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbi8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuLy8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cbi8vIEludGVybmV0IEV4cGxvcmVyIDEwIGlzIHRoZSBvbmx5IGJyb3dzZXIgdGhhdCBoYXMgc2V0SW1tZWRpYXRlIGJ1dCBkb2VzXG4vLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbi8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcbi8vIHByZWZlcnJhYmxlIHRvIGZhbGxpbmcgYmFjayB0byBzZXRUaW1lb3V0IHNpbmNlIGl0IGRvZXMgbm90IGhhdmVcbi8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuLy8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG4vLyBEZXNrdG9wIHRvIGEgbGVzc2VyIGV4dGVudCkgdGhhdCByZW5kZXJzIGJvdGggc2V0SW1tZWRpYXRlIGFuZFxuLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4vLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG4vLyBUaW1lcnMgYXJlIGltcGxlbWVudGVkIHVuaXZlcnNhbGx5LlxuLy8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcbi8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4vLyBIb3dldmVyLCBub3RlIHRoYXQgZXZlbiB0aGlzIHNpbXBsZSBjYXNlIHJlcXVpcmVzIG51YW5jZXMgdG8gb3BlcmF0ZSBpbiBhXG4vLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cbi8vXG4vLyAtIEZpcmVmb3ggMy0xM1xuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcbi8vIC0gaVBhZCBTYWZhcmkgNC4zXG4vLyAtIEx5bnggMi44Ljdcbn0gZWxzZSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5cbi8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuLy8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgdG9nZ2xlID0gMTtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuICAgIH07XG59XG5cbi8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcblxuLy8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuLy8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcbi8vIE11dGF0aW9uT2JzZXJ2ZXJzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGZhbGwgYmFjayBpbiB0aGF0IGNhc2UuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuLy8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4vLyAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21TZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG4vLyBzY3JvbGxpbmcuIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBpbXBhY3QgQVNBUCBiZWNhdXNlIFNhZmFyaSA2LjAgc3VwcG9ydHNcbi8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG4vLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG4vLyBpcyB0byBhZGQgYSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBmb3IgYSBmbHVzaC5cblxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgLy8gV2UgZGlzcGF0Y2ggYSB0aW1lb3V0IHdpdGggYSBzcGVjaWZpZWQgZGVsYXkgb2YgMCBmb3IgZW5naW5lcyB0aGF0XG4gICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcbiAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgICAgIC8vIGJldHdlZW4gZXZlbnRzLlxuICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcbiAgICAgICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lcigpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gVGhpcyBpcyBmb3IgYGFzYXAuanNgIG9ubHkuXG4vLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuLy8gaXRzIGV4aXN0ZW5jZS5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyO1xuXG4vLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hc2FwL2Jyb3dzZXItcmF3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRUaW1lb3V0OiBmdW5jdGlvbihuYW1lLCBkZWxheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLl90aW1lb3V0cyA9IHRoaXMuX3RpbWVvdXRzIHx8IHt9O1xuICAgIGlmICh0aGlzLl90aW1lb3V0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgcmV0dXJuO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90aW1lb3V0c1tuYW1lXSA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZGVsZXRlIHNlbGYuX3RpbWVvdXRzW25hbWVdO1xuICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICB9LCAxMDAwICogZGVsYXkpO1xuICB9LFxuXG4gIHJlbW92ZVRpbWVvdXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLl90aW1lb3V0cyA9IHRoaXMuX3RpbWVvdXRzIHx8IHt9O1xuICAgIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dHNbbmFtZV07XG4gICAgaWYgKCF0aW1lb3V0KSByZXR1cm47XG4gICAgZ2xvYmFsLmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICBkZWxldGUgdGhpcy5fdGltZW91dHNbbmFtZV07XG4gIH0sXG5cbiAgcmVtb3ZlQWxsVGltZW91dHM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3RpbWVvdXRzID0gdGhpcy5fdGltZW91dHMgfHwge307XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLl90aW1lb3V0cykgdGhpcy5yZW1vdmVUaW1lb3V0KG5hbWUpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL21peGlucy90aW1lb3V0cy5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNhcCAgICAgICAgICAgID0gcmVxdWlyZSgnYXNhcCcpLFxuICAgIENsYXNzICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBQcm9taXNlICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKSxcbiAgICBVUkkgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGFycmF5ICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYXJyYXknKSxcbiAgICBicm93c2VyICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2Jyb3dzZXInKSxcbiAgICBjb25zdGFudHMgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NvbnN0YW50cycpLFxuICAgIGV4dGVuZCAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC92YWxpZGF0ZV9vcHRpb25zJyksXG4gICAgRGVmZXJyYWJsZSAgICAgID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKSxcbiAgICBMb2dnaW5nICAgICAgICAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFB1Ymxpc2hlciAgICAgICA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBDaGFubmVsICAgICAgICAgPSByZXF1aXJlKCcuL2NoYW5uZWwnKSxcbiAgICBEaXNwYXRjaGVyICAgICAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKSxcbiAgICBFcnJvciAgICAgICAgICAgPSByZXF1aXJlKCcuL2Vycm9yJyksXG4gICAgRXh0ZW5zaWJsZSAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpYmxlJyksXG4gICAgUHVibGljYXRpb24gICAgID0gcmVxdWlyZSgnLi9wdWJsaWNhdGlvbicpLFxuICAgIFN1YnNjcmlwdGlvbiAgICA9IHJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XG5cbnZhciBDbGllbnQgPSBDbGFzcyh7IGNsYXNzTmFtZTogJ0NsaWVudCcsXG4gIFVOQ09OTkVDVEVEOiAgICAgICAgMSxcbiAgQ09OTkVDVElORzogICAgICAgICAyLFxuICBDT05ORUNURUQ6ICAgICAgICAgIDMsXG4gIERJU0NPTk5FQ1RFRDogICAgICAgNCxcblxuICBIQU5EU0hBS0U6ICAgICAgICAgICdoYW5kc2hha2UnLFxuICBSRVRSWTogICAgICAgICAgICAgICdyZXRyeScsXG4gIE5PTkU6ICAgICAgICAgICAgICAgJ25vbmUnLFxuXG4gIENPTk5FQ1RJT05fVElNRU9VVDogNjAsXG5cbiAgREVGQVVMVF9FTkRQT0lOVDogICAnL2JheWV1eCcsXG4gIElOVEVSVkFMOiAgICAgICAgICAgMCxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihlbmRwb2ludCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5mbygnTmV3IGNsaWVudCBjcmVhdGVkIGZvciA/JywgZW5kcG9pbnQpO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMsIFsnaW50ZXJ2YWwnLCAndGltZW91dCcsICdlbmRwb2ludHMnLCAncHJveHknLCAncmV0cnknLCAnc2NoZWR1bGVyJywgJ3dlYnNvY2tldEV4dGVuc2lvbnMnLCAndGxzJywgJ2NhJ10pO1xuXG4gICAgdGhpcy5fY2hhbm5lbHMgICA9IG5ldyBDaGFubmVsLlNldCgpO1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBEaXNwYXRjaGVyLmNyZWF0ZSh0aGlzLCBlbmRwb2ludCB8fCB0aGlzLkRFRkFVTFRfRU5EUE9JTlQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbWVzc2FnZUlkID0gMDtcbiAgICB0aGlzLl9zdGF0ZSAgICAgPSB0aGlzLlVOQ09OTkVDVEVEO1xuXG4gICAgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3MgPSB7fTtcblxuICAgIHRoaXMuX2FkdmljZSA9IHtcbiAgICAgIHJlY29ubmVjdDogdGhpcy5SRVRSWSxcbiAgICAgIGludGVydmFsOiAgMTAwMCAqIChvcHRpb25zLmludGVydmFsIHx8IHRoaXMuSU5URVJWQUwpLFxuICAgICAgdGltZW91dDogICAxMDAwICogKG9wdGlvbnMudGltZW91dCAgfHwgdGhpcy5DT05ORUNUSU9OX1RJTUVPVVQpXG4gICAgfTtcbiAgICB0aGlzLl9kaXNwYXRjaGVyLnRpbWVvdXQgPSB0aGlzLl9hZHZpY2UudGltZW91dCAvIDEwMDA7XG5cbiAgICB0aGlzLl9kaXNwYXRjaGVyLmJpbmQoJ21lc3NhZ2UnLCB0aGlzLl9yZWNlaXZlTWVzc2FnZSwgdGhpcyk7XG5cbiAgICBpZiAoYnJvd3Nlci5FdmVudCAmJiBnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgICAgIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhcnJheS5pbmRleE9mKHRoaXMuX2Rpc3BhdGNoZXIuX2Rpc2FibGVkLCAnYXV0b2Rpc2Nvbm5lY3QnKSA8IDApXG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBhZGRXZWJzb2NrZXRFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyLmFkZFdlYnNvY2tldEV4dGVuc2lvbihleHRlbnNpb24pO1xuICB9LFxuXG4gIGRpc2FibGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlci5kaXNhYmxlKGZlYXR1cmUpO1xuICB9LFxuXG4gIHNldEhlYWRlcjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlci5zZXRIZWFkZXIobmFtZSwgdmFsdWUpO1xuICB9LFxuXG4gIC8vIFJlcXVlc3RcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogdmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlc1xuICAvLyBNQVkgaW5jbHVkZTogICAqIG1pbmltdW1WZXJzaW9uXG4gIC8vICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICogaWRcbiAgLy9cbiAgLy8gU3VjY2VzcyBSZXNwb25zZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRmFpbGVkIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIHZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBzdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXMgICAgICAgICAgICAgICAgICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlc1xuICAvLyAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyBNQVkgaW5jbHVkZTogICAqIG1pbmltdW1WZXJzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHZlcnNpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBhZHZpY2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBtaW5pbXVtVmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICogYXV0aFN1Y2Nlc3NmdWxcbiAgaGFuZHNoYWtlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICh0aGlzLl9hZHZpY2UucmVjb25uZWN0ID09PSB0aGlzLk5PTkUpIHJldHVybjtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuVU5DT05ORUNURUQpIHJldHVybjtcblxuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5DT05ORUNUSU5HO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuaW5mbygnSW5pdGlhdGluZyBoYW5kc2hha2Ugd2l0aCA/JywgVVJJLnN0cmluZ2lmeSh0aGlzLl9kaXNwYXRjaGVyLmVuZHBvaW50KSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlci5zZWxlY3RUcmFuc3BvcnQoY29uc3RhbnRzLk1BTkRBVE9SWV9DT05ORUNUSU9OX1RZUEVTKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICAgICAgICAgICAgICAgICAgQ2hhbm5lbC5IQU5EU0hBS0UsXG4gICAgICB2ZXJzaW9uOiAgICAgICAgICAgICAgICAgIGNvbnN0YW50cy5CQVlFVVhfVkVSU0lPTixcbiAgICAgIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlczogdGhpcy5fZGlzcGF0Y2hlci5nZXRDb25uZWN0aW9uVHlwZXMoKVxuXG4gICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzZnVsKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5DT05ORUNURUQ7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQgID0gcmVzcG9uc2UuY2xpZW50SWQ7XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5zZWxlY3RUcmFuc3BvcnQocmVzcG9uc2Uuc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzKTtcblxuICAgICAgICB0aGlzLmluZm8oJ0hhbmRzaGFrZSBzdWNjZXNzZnVsOiA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpYmUodGhpcy5fY2hhbm5lbHMuZ2V0S2V5cygpLCB0cnVlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBhc2FwKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQpIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZm8oJ0hhbmRzaGFrZSB1bnN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNlbGYuaGFuZHNoYWtlKGNhbGxiYWNrLCBjb250ZXh0KSB9LCB0aGlzLl9kaXNwYXRjaGVyLnJldHJ5ICogMTAwMCk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5VTkNPTk5FQ1RFRDtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vICAgICAgICAgICAgICAgICogY29ubmVjdGlvblR5cGUgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdGltZXN0YW1wXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuX2FkdmljZS5yZWNvbm5lY3QgPT09IHRoaXMuTk9ORSkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5ESVNDT05ORUNURUQpIHJldHVybjtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5VTkNPTk5FQ1RFRClcbiAgICAgIHJldHVybiB0aGlzLmhhbmRzaGFrZShmdW5jdGlvbigpIHsgdGhpcy5jb25uZWN0KGNhbGxiYWNrLCBjb250ZXh0KSB9LCB0aGlzKTtcblxuICAgIHRoaXMuY2FsbGJhY2soY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gdGhpcy5DT05ORUNURUQpIHJldHVybjtcblxuICAgIHRoaXMuaW5mbygnQ2FsbGluZyBkZWZlcnJlZCBhY3Rpb25zIGZvciA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgdGhpcy5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgdGhpcy5zZXREZWZlcnJlZFN0YXR1cygndW5rbm93bicpO1xuXG4gICAgaWYgKHRoaXMuX2Nvbm5lY3RSZXF1ZXN0KSByZXR1cm47XG4gICAgdGhpcy5fY29ubmVjdFJlcXVlc3QgPSB0cnVlO1xuXG4gICAgdGhpcy5pbmZvKCdJbml0aWF0aW5nIGNvbm5lY3Rpb24gZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICAgICAgICBDaGFubmVsLkNPTk5FQ1QsXG4gICAgICBjbGllbnRJZDogICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCxcbiAgICAgIGNvbm5lY3Rpb25UeXBlOiB0aGlzLl9kaXNwYXRjaGVyLmNvbm5lY3Rpb25UeXBlXG5cbiAgICB9LCB7fSwgdGhpcy5fY3ljbGVDb25uZWN0aW9uLCB0aGlzKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICBkaXNjb25uZWN0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuQ09OTkVDVEVEKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLkRJU0NPTk5FQ1RFRDtcblxuICAgIHRoaXMuaW5mbygnRGlzY29ubmVjdGluZyA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHVibGljYXRpb24oKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICBDaGFubmVsLkRJU0NPTk5FQ1QsXG4gICAgICBjbGllbnRJZDogdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZFxuXG4gICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzc2Z1bCkge1xuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsb3NlKCk7XG4gICAgICAgIHByb21pc2Uuc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJywgRXJyb3IucGFyc2UocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuaW5mbygnQ2xlYXJpbmcgY2hhbm5lbCBsaXN0ZW5lcnMgZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB0aGlzLl9jaGFubmVscyA9IG5ldyBDaGFubmVsLlNldCgpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyAgICAgICAgICAgICAgICAqIHN1YnNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAgICAgKiBjbGllbnRJZFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYWR2aWNlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB0aW1lc3RhbXBcbiAgc3Vic2NyaWJlOiBmdW5jdGlvbihjaGFubmVsLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChjaGFubmVsIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICByZXR1cm4gYXJyYXkubWFwKGNoYW5uZWwsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGMsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICAgIH0sIHRoaXMpO1xuXG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcywgY2hhbm5lbCwgY2FsbGJhY2ssIGNvbnRleHQpLFxuICAgICAgICBmb3JjZSAgICAgICAgPSAoY2FsbGJhY2sgPT09IHRydWUpLFxuICAgICAgICBoYXNTdWJzY3JpYmUgPSB0aGlzLl9jaGFubmVscy5oYXNTdWJzY3JpcHRpb24oY2hhbm5lbCk7XG5cbiAgICBpZiAoaGFzU3Vic2NyaWJlICYmICFmb3JjZSkge1xuICAgICAgdGhpcy5fY2hhbm5lbHMuc3Vic2NyaWJlKFtjaGFubmVsXSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gYXR0ZW1wdGluZyB0byBzdWJzY3JpYmUgdG8gPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWwpO1xuICAgICAgaWYgKCFmb3JjZSkgdGhpcy5fY2hhbm5lbHMuc3Vic2NyaWJlKFtjaGFubmVsXSwgc3Vic2NyaXB0aW9uKTtcblxuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBjaGFubmVsOiAgICAgIENoYW5uZWwuU1VCU0NSSUJFLFxuICAgICAgICBjbGllbnRJZDogICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsXG4gICAgICAgIHN1YnNjcmlwdGlvbjogY2hhbm5lbFxuXG4gICAgICB9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzZnVsKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnLCBFcnJvci5wYXJzZShyZXNwb25zZS5lcnJvcikpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVscy51bnN1YnNjcmliZShjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoYW5uZWxzID0gW10uY29uY2F0KHJlc3BvbnNlLnN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuaW5mbygnU3Vic2NyaXB0aW9uIGFja25vd2xlZGdlZCBmb3IgPyB0byA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbHMpO1xuICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICogY2xpZW50SWRcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3Vic2NyaXB0aW9uXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdGltZXN0YW1wXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihjaGFubmVsLCBzdWJzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hhbm5lbCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgcmV0dXJuIGFycmF5Lm1hcChjaGFubmVsLCBmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVuc3Vic2NyaWJlKGMsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIHZhciBkZWFkID0gdGhpcy5fY2hhbm5lbHMudW5zdWJzY3JpYmUoY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcbiAgICBpZiAoIWRlYWQpIHJldHVybjtcblxuICAgIHRoaXMuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gYXR0ZW1wdGluZyB0byB1bnN1YnNjcmliZSBmcm9tID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVsKTtcblxuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBjaGFubmVsOiAgICAgIENoYW5uZWwuVU5TVUJTQ1JJQkUsXG4gICAgICAgIGNsaWVudElkOiAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCxcbiAgICAgICAgc3Vic2NyaXB0aW9uOiBjaGFubmVsXG5cbiAgICAgIH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3NmdWwpIHJldHVybjtcblxuICAgICAgICB2YXIgY2hhbm5lbHMgPSBbXS5jb25jYXQocmVzcG9uc2Uuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5pbmZvKCdVbnN1YnNjcmlwdGlvbiBhY2tub3dsZWRnZWQgZm9yID8gZnJvbSA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbHMpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBkYXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGNsaWVudElkICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgcHVibGlzaDogZnVuY3Rpb24oY2hhbm5lbCwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zIHx8IHt9LCBbJ2F0dGVtcHRzJywgJ2RlYWRsaW5lJ10pO1xuICAgIHZhciBwdWJsaWNhdGlvbiA9IG5ldyBQdWJsaWNhdGlvbigpO1xuXG4gICAgdGhpcy5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbmZvKCdDbGllbnQgPyBxdWV1ZWluZyBwdWJsaXNoZWQgbWVzc2FnZSB0byA/OiA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbCwgZGF0YSk7XG5cbiAgICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbDogIGNoYW5uZWwsXG4gICAgICAgIGRhdGE6ICAgICBkYXRhLFxuICAgICAgICBjbGllbnRJZDogdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZFxuXG4gICAgICB9LCBvcHRpb25zLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzc2Z1bClcbiAgICAgICAgICBwdWJsaWNhdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwdWJsaWNhdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJywgRXJyb3IucGFyc2UocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHB1YmxpY2F0aW9uO1xuICB9LFxuXG4gIF9zZW5kTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBtZXNzYWdlLmlkID0gdGhpcy5fZ2VuZXJhdGVNZXNzYWdlSWQoKTtcblxuICAgIHZhciB0aW1lb3V0ID0gdGhpcy5fYWR2aWNlLnRpbWVvdXRcbiAgICAgICAgICAgICAgICA/IDEuMiAqIHRoaXMuX2FkdmljZS50aW1lb3V0IC8gMTAwMFxuICAgICAgICAgICAgICAgIDogMS4yICogdGhpcy5fZGlzcGF0Y2hlci5yZXRyeTtcblxuICAgIHRoaXMucGlwZVRocm91Z2hFeHRlbnNpb25zKCdvdXRnb2luZycsIG1lc3NhZ2UsIG51bGwsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgaWYgKGNhbGxiYWNrKSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1ttZXNzYWdlLmlkXSA9IFtjYWxsYmFjaywgY29udGV4dF07XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIHRpbWVvdXQsIG9wdGlvbnMgfHwge30pO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIF9nZW5lcmF0ZU1lc3NhZ2VJZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbWVzc2FnZUlkICs9IDE7XG4gICAgaWYgKHRoaXMuX21lc3NhZ2VJZCA+PSBNYXRoLnBvdygyLDMyKSkgdGhpcy5fbWVzc2FnZUlkID0gMDtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZUlkLnRvU3RyaW5nKDM2KTtcbiAgfSxcblxuICBfcmVjZWl2ZU1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB2YXIgaWQgPSBtZXNzYWdlLmlkLCBjYWxsYmFjaztcblxuICAgIGlmIChtZXNzYWdlLnN1Y2Nlc3NmdWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tpZF07XG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbaWRdO1xuICAgIH1cblxuICAgIHRoaXMucGlwZVRocm91Z2hFeHRlbnNpb25zKCdpbmNvbWluZycsIG1lc3NhZ2UsIG51bGwsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgaWYgKG1lc3NhZ2UuYWR2aWNlKSB0aGlzLl9oYW5kbGVBZHZpY2UobWVzc2FnZS5hZHZpY2UpO1xuICAgICAgdGhpcy5fZGVsaXZlck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrWzBdLmNhbGwoY2FsbGJhY2tbMV0sIG1lc3NhZ2UpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIF9oYW5kbGVBZHZpY2U6IGZ1bmN0aW9uKGFkdmljZSkge1xuICAgIGV4dGVuZCh0aGlzLl9hZHZpY2UsIGFkdmljZSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlci50aW1lb3V0ID0gdGhpcy5fYWR2aWNlLnRpbWVvdXQgLyAxMDAwO1xuXG4gICAgaWYgKHRoaXMuX2FkdmljZS5yZWNvbm5lY3QgPT09IHRoaXMuSEFORFNIQUtFICYmIHRoaXMuX3N0YXRlICE9PSB0aGlzLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLlVOQ09OTkVDVEVEO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCA9IG51bGw7XG4gICAgICB0aGlzLl9jeWNsZUNvbm5lY3Rpb24oKTtcbiAgICB9XG4gIH0sXG5cbiAgX2RlbGl2ZXJNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaWYgKCFtZXNzYWdlLmNoYW5uZWwgfHwgbWVzc2FnZS5kYXRhID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICB0aGlzLmluZm8oJ0NsaWVudCA/IGNhbGxpbmcgbGlzdGVuZXJzIGZvciA/IHdpdGggPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIG1lc3NhZ2UuY2hhbm5lbCwgbWVzc2FnZS5kYXRhKTtcbiAgICB0aGlzLl9jaGFubmVscy5kaXN0cmlidXRlTWVzc2FnZShtZXNzYWdlKTtcbiAgfSxcblxuICBfY3ljbGVDb25uZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fY29ubmVjdFJlcXVlc3QpIHtcbiAgICAgIHRoaXMuX2Nvbm5lY3RSZXF1ZXN0ID0gbnVsbDtcbiAgICAgIHRoaXMuaW5mbygnQ2xvc2VkIGNvbm5lY3Rpb24gZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB9XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzZWxmLmNvbm5lY3QoKSB9LCB0aGlzLl9hZHZpY2UuaW50ZXJ2YWwpO1xuICB9XG59KTtcblxuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgTG9nZ2luZyk7XG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgRXh0ZW5zaWJsZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2NsaWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFVSSSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgY29va2llcyAgID0gcmVxdWlyZSgnLi4vdXRpbC9jb29raWVzJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBMb2dnaW5nICAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFB1Ymxpc2hlciA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBUcmFuc3BvcnQgPSByZXF1aXJlKCcuLi90cmFuc3BvcnQnKSxcbiAgICBTY2hlZHVsZXIgPSByZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgRGlzcGF0Y2hlciA9IENsYXNzKHsgY2xhc3NOYW1lOiAnRGlzcGF0Y2hlcicsXG4gIE1BWF9SRVFVRVNUX1NJWkU6IDIwNDgsXG4gIERFRkFVTFRfUkVUUlk6ICAgIDUsXG5cbiAgVVA6ICAgMSxcbiAgRE9XTjogMixcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihjbGllbnQsIGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5fY2xpZW50ICAgICA9IGNsaWVudDtcbiAgICB0aGlzLmVuZHBvaW50ICAgID0gVVJJLnBhcnNlKGVuZHBvaW50KTtcbiAgICB0aGlzLl9hbHRlcm5hdGVzID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG5cbiAgICB0aGlzLmNvb2tpZXMgICAgICA9IGNvb2tpZXMuQ29va2llSmFyICYmIG5ldyBjb29raWVzLkNvb2tpZUphcigpO1xuICAgIHRoaXMuX2Rpc2FibGVkICAgID0gW107XG4gICAgdGhpcy5fZW52ZWxvcGVzICAgPSB7fTtcbiAgICB0aGlzLmhlYWRlcnMgICAgICA9IHt9O1xuICAgIHRoaXMucmV0cnkgICAgICAgID0gb3B0aW9ucy5yZXRyeSB8fCB0aGlzLkRFRkFVTFRfUkVUUlk7XG4gICAgdGhpcy5fc2NoZWR1bGVyICAgPSBvcHRpb25zLnNjaGVkdWxlciB8fCBTY2hlZHVsZXI7XG4gICAgdGhpcy5fc3RhdGUgICAgICAgPSAwO1xuICAgIHRoaXMudHJhbnNwb3J0cyAgID0ge307XG4gICAgdGhpcy53c0V4dGVuc2lvbnMgPSBbXTtcblxuICAgIHRoaXMucHJveHkgPSBvcHRpb25zLnByb3h5IHx8IHt9O1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcHJveHkgPT09ICdzdHJpbmcnKSB0aGlzLl9wcm94eSA9IHtvcmlnaW46IHRoaXMuX3Byb3h5fTtcblxuICAgIHZhciBleHRzID0gb3B0aW9ucy53ZWJzb2NrZXRFeHRlbnNpb25zO1xuICAgIGlmIChleHRzKSB7XG4gICAgICBleHRzID0gW10uY29uY2F0KGV4dHMpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBleHRzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgICAgdGhpcy5hZGRXZWJzb2NrZXRFeHRlbnNpb24oZXh0c1tpXSk7XG4gICAgfVxuXG4gICAgdGhpcy50bHMgPSBvcHRpb25zLnRscyB8fCB7fTtcbiAgICB0aGlzLnRscy5jYSA9IHRoaXMudGxzLmNhIHx8IG9wdGlvbnMuY2E7XG5cbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMuX2FsdGVybmF0ZXMpXG4gICAgICB0aGlzLl9hbHRlcm5hdGVzW3R5cGVdID0gVVJJLnBhcnNlKHRoaXMuX2FsdGVybmF0ZXNbdHlwZV0pO1xuXG4gICAgdGhpcy5tYXhSZXF1ZXN0U2l6ZSA9IHRoaXMuTUFYX1JFUVVFU1RfU0laRTtcbiAgfSxcblxuICBlbmRwb2ludEZvcjogZnVuY3Rpb24oY29ubmVjdGlvblR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fYWx0ZXJuYXRlc1tjb25uZWN0aW9uVHlwZV0gfHwgdGhpcy5lbmRwb2ludDtcbiAgfSxcblxuICBhZGRXZWJzb2NrZXRFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIHRoaXMud3NFeHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcbiAgfSxcblxuICBkaXNhYmxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQucHVzaChmZWF0dXJlKTtcbiAgfSxcblxuICBzZXRIZWFkZXI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFuc3BvcnQgPSB0aGlzLl90cmFuc3BvcnQ7XG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zcG9ydDtcbiAgICBpZiAodHJhbnNwb3J0KSB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgfSxcblxuICBnZXRDb25uZWN0aW9uVHlwZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUcmFuc3BvcnQuZ2V0Q29ubmVjdGlvblR5cGVzKCk7XG4gIH0sXG5cbiAgc2VsZWN0VHJhbnNwb3J0OiBmdW5jdGlvbih0cmFuc3BvcnRUeXBlcykge1xuICAgIFRyYW5zcG9ydC5nZXQodGhpcywgdHJhbnNwb3J0VHlwZXMsIHRoaXMuX2Rpc2FibGVkLCBmdW5jdGlvbih0cmFuc3BvcnQpIHtcbiAgICAgIHRoaXMuZGVidWcoJ1NlbGVjdGVkID8gdHJhbnNwb3J0IGZvciA/JywgdHJhbnNwb3J0LmNvbm5lY3Rpb25UeXBlLCBVUkkuc3RyaW5naWZ5KHRyYW5zcG9ydC5lbmRwb2ludCkpO1xuXG4gICAgICBpZiAodHJhbnNwb3J0ID09PSB0aGlzLl90cmFuc3BvcnQpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLl90cmFuc3BvcnQpIHRoaXMuX3RyYW5zcG9ydC5jbG9zZSgpO1xuXG4gICAgICB0aGlzLl90cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25UeXBlID0gdHJhbnNwb3J0LmNvbm5lY3Rpb25UeXBlO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIHNlbmRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlLCB0aW1lb3V0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgaWQgICAgICAgPSBtZXNzYWdlLmlkLFxuICAgICAgICBhdHRlbXB0cyA9IG9wdGlvbnMuYXR0ZW1wdHMsXG4gICAgICAgIGRlYWRsaW5lID0gb3B0aW9ucy5kZWFkbGluZSAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIChvcHRpb25zLmRlYWRsaW5lICogMTAwMCksXG4gICAgICAgIGVudmVsb3BlID0gdGhpcy5fZW52ZWxvcGVzW2lkXSxcbiAgICAgICAgc2NoZWR1bGVyO1xuXG4gICAgaWYgKCFlbnZlbG9wZSkge1xuICAgICAgc2NoZWR1bGVyID0gbmV3IHRoaXMuX3NjaGVkdWxlcihtZXNzYWdlLCB7dGltZW91dDogdGltZW91dCwgaW50ZXJ2YWw6IHRoaXMucmV0cnksIGF0dGVtcHRzOiBhdHRlbXB0cywgZGVhZGxpbmU6IGRlYWRsaW5lfSk7XG4gICAgICBlbnZlbG9wZSAgPSB0aGlzLl9lbnZlbG9wZXNbaWRdID0ge21lc3NhZ2U6IG1lc3NhZ2UsIHNjaGVkdWxlcjogc2NoZWR1bGVyfTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZW5kRW52ZWxvcGUoZW52ZWxvcGUpO1xuICB9LFxuXG4gIF9zZW5kRW52ZWxvcGU6IGZ1bmN0aW9uKGVudmVsb3BlKSB7XG4gICAgaWYgKCF0aGlzLl90cmFuc3BvcnQpIHJldHVybjtcbiAgICBpZiAoZW52ZWxvcGUucmVxdWVzdCB8fCBlbnZlbG9wZS50aW1lcikgcmV0dXJuO1xuXG4gICAgdmFyIG1lc3NhZ2UgICA9IGVudmVsb3BlLm1lc3NhZ2UsXG4gICAgICAgIHNjaGVkdWxlciA9IGVudmVsb3BlLnNjaGVkdWxlcixcbiAgICAgICAgc2VsZiAgICAgID0gdGhpcztcblxuICAgIGlmICghc2NoZWR1bGVyLmlzRGVsaXZlcmFibGUoKSkge1xuICAgICAgc2NoZWR1bGVyLmFib3J0KCk7XG4gICAgICBkZWxldGUgdGhpcy5fZW52ZWxvcGVzW21lc3NhZ2UuaWRdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVudmVsb3BlLnRpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmhhbmRsZUVycm9yKG1lc3NhZ2UpO1xuICAgIH0sIHNjaGVkdWxlci5nZXRUaW1lb3V0KCkgKiAxMDAwKTtcblxuICAgIHNjaGVkdWxlci5zZW5kKCk7XG4gICAgZW52ZWxvcGUucmVxdWVzdCA9IHRoaXMuX3RyYW5zcG9ydC5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgfSxcblxuICBoYW5kbGVSZXNwb25zZTogZnVuY3Rpb24ocmVwbHkpIHtcbiAgICB2YXIgZW52ZWxvcGUgPSB0aGlzLl9lbnZlbG9wZXNbcmVwbHkuaWRdO1xuXG4gICAgaWYgKHJlcGx5LnN1Y2Nlc3NmdWwgIT09IHVuZGVmaW5lZCAmJiBlbnZlbG9wZSkge1xuICAgICAgZW52ZWxvcGUuc2NoZWR1bGVyLnN1Y2NlZWQoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbnZlbG9wZXNbcmVwbHkuaWRdO1xuICAgICAgZ2xvYmFsLmNsZWFyVGltZW91dChlbnZlbG9wZS50aW1lcik7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdtZXNzYWdlJywgcmVwbHkpO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLlVQKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLlVQO1xuICAgIHRoaXMuX2NsaWVudC50cmlnZ2VyKCd0cmFuc3BvcnQ6dXAnKTtcbiAgfSxcblxuICBoYW5kbGVFcnJvcjogZnVuY3Rpb24obWVzc2FnZSwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIGVudmVsb3BlID0gdGhpcy5fZW52ZWxvcGVzW21lc3NhZ2UuaWRdLFxuICAgICAgICByZXF1ZXN0ICA9IGVudmVsb3BlICYmIGVudmVsb3BlLnJlcXVlc3QsXG4gICAgICAgIHNlbGYgICAgID0gdGhpcztcblxuICAgIGlmICghcmVxdWVzdCkgcmV0dXJuO1xuXG4gICAgcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlcSkge1xuICAgICAgaWYgKHJlcSAmJiByZXEuYWJvcnQpIHJlcS5hYm9ydCgpO1xuICAgIH0pO1xuXG4gICAgdmFyIHNjaGVkdWxlciA9IGVudmVsb3BlLnNjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZmFpbCgpO1xuXG4gICAgZ2xvYmFsLmNsZWFyVGltZW91dChlbnZlbG9wZS50aW1lcik7XG4gICAgZW52ZWxvcGUucmVxdWVzdCA9IGVudmVsb3BlLnRpbWVyID0gbnVsbDtcblxuICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgIHRoaXMuX3NlbmRFbnZlbG9wZShlbnZlbG9wZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudmVsb3BlLnRpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVudmVsb3BlLnRpbWVyID0gbnVsbDtcbiAgICAgICAgc2VsZi5fc2VuZEVudmVsb3BlKGVudmVsb3BlKTtcbiAgICAgIH0sIHNjaGVkdWxlci5nZXRJbnRlcnZhbCgpICogMTAwMCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLkRPV04pIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuRE9XTjtcbiAgICB0aGlzLl9jbGllbnQudHJpZ2dlcigndHJhbnNwb3J0OmRvd24nKTtcbiAgfVxufSk7XG5cbkRpc3BhdGNoZXIuY3JlYXRlID0gZnVuY3Rpb24oY2xpZW50LCBlbmRwb2ludCwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IERpc3BhdGNoZXIoY2xpZW50LCBlbmRwb2ludCwgb3B0aW9ucyk7XG59O1xuXG5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIExvZ2dpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvZGlzcGF0Y2hlci5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBHcmFtbWFyID0gcmVxdWlyZSgnLi9ncmFtbWFyJyk7XG5cbnZhciBFcnJvciA9IENsYXNzKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oY29kZSwgcGFyYW1zLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5jb2RlICAgID0gY29kZTtcbiAgICB0aGlzLnBhcmFtcyAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChwYXJhbXMpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH0sXG5cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNvZGUgKyAnOicgK1xuICAgICAgICAgICB0aGlzLnBhcmFtcy5qb2luKCcsJykgKyAnOicgK1xuICAgICAgICAgICB0aGlzLm1lc3NhZ2U7XG4gIH1cbn0pO1xuXG5FcnJvci5wYXJzZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgJyc7XG4gIGlmICghR3JhbW1hci5FUlJPUi50ZXN0KG1lc3NhZ2UpKSByZXR1cm4gbmV3IEVycm9yKG51bGwsIFtdLCBtZXNzYWdlKTtcblxuICB2YXIgcGFydHMgICA9IG1lc3NhZ2Uuc3BsaXQoJzonKSxcbiAgICAgIGNvZGUgICAgPSBwYXJzZUludChwYXJ0c1swXSksXG4gICAgICBwYXJhbXMgID0gcGFydHNbMV0uc3BsaXQoJywnKSxcbiAgICAgIG1lc3NhZ2UgPSBwYXJ0c1syXTtcblxuICByZXR1cm4gbmV3IEVycm9yKGNvZGUsIHBhcmFtcywgbWVzc2FnZSk7XG59O1xuXG4vLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvY29tZXRkL3dpa2kvQmF5ZXV4Q29kZXNcbnZhciBlcnJvcnMgPSB7XG4gIHZlcnNpb25NaXNtYXRjaDogIFszMDAsICdWZXJzaW9uIG1pc21hdGNoJ10sXG4gIGNvbm50eXBlTWlzbWF0Y2g6IFszMDEsICdDb25uZWN0aW9uIHR5cGVzIG5vdCBzdXBwb3J0ZWQnXSxcbiAgZXh0TWlzbWF0Y2g6ICAgICAgWzMwMiwgJ0V4dGVuc2lvbiBtaXNtYXRjaCddLFxuICBiYWRSZXF1ZXN0OiAgICAgICBbNDAwLCAnQmFkIHJlcXVlc3QnXSxcbiAgY2xpZW50VW5rbm93bjogICAgWzQwMSwgJ1Vua25vd24gY2xpZW50J10sXG4gIHBhcmFtZXRlck1pc3Npbmc6IFs0MDIsICdNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlciddLFxuICBjaGFubmVsRm9yYmlkZGVuOiBbNDAzLCAnRm9yYmlkZGVuIGNoYW5uZWwnXSxcbiAgY2hhbm5lbFVua25vd246ICAgWzQwNCwgJ1Vua25vd24gY2hhbm5lbCddLFxuICBjaGFubmVsSW52YWxpZDogICBbNDA1LCAnSW52YWxpZCBjaGFubmVsJ10sXG4gIGV4dFVua25vd246ICAgICAgIFs0MDYsICdVbmtub3duIGV4dGVuc2lvbiddLFxuICBwdWJsaXNoRmFpbGVkOiAgICBbNDA3LCAnRmFpbGVkIHRvIHB1Ymxpc2gnXSxcbiAgc2VydmVyRXJyb3I6ICAgICAgWzUwMCwgJ0ludGVybmFsIHNlcnZlciBlcnJvciddXG59O1xuXG5mb3IgKHZhciBuYW1lIGluIGVycm9ycylcbiAgKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBFcnJvcltuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJvcnNbbmFtZV1bMF0sIGFyZ3VtZW50cywgZXJyb3JzW25hbWVdWzFdKS50b1N0cmluZygpO1xuICAgIH07XG4gIH0pKG5hbWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVycm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2Vycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBMb2dnaW5nID0gcmVxdWlyZSgnLi4vbWl4aW5zL2xvZ2dpbmcnKTtcblxudmFyIEV4dGVuc2libGUgPSB7XG4gIGFkZEV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IHRoaXMuX2V4dGVuc2lvbnMgfHwgW107XG4gICAgdGhpcy5fZXh0ZW5zaW9ucy5wdXNoKGV4dGVuc2lvbik7XG4gICAgaWYgKGV4dGVuc2lvbi5hZGRlZCkgZXh0ZW5zaW9uLmFkZGVkKHRoaXMpO1xuICB9LFxuXG4gIHJlbW92ZUV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgaWYgKCF0aGlzLl9leHRlbnNpb25zKSByZXR1cm47XG4gICAgdmFyIGkgPSB0aGlzLl9leHRlbnNpb25zLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGhpcy5fZXh0ZW5zaW9uc1tpXSAhPT0gZXh0ZW5zaW9uKSBjb250aW51ZTtcbiAgICAgIHRoaXMuX2V4dGVuc2lvbnMuc3BsaWNlKGksMSk7XG4gICAgICBpZiAoZXh0ZW5zaW9uLnJlbW92ZWQpIGV4dGVuc2lvbi5yZW1vdmVkKHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICBwaXBlVGhyb3VnaEV4dGVuc2lvbnM6IGZ1bmN0aW9uKHN0YWdlLCBtZXNzYWdlLCByZXF1ZXN0LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuZGVidWcoJ1Bhc3NpbmcgdGhyb3VnaCA/IGV4dGVuc2lvbnM6ID8nLCBzdGFnZSwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2V4dGVuc2lvbnMpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuICAgIHZhciBleHRlbnNpb25zID0gdGhpcy5fZXh0ZW5zaW9ucy5zbGljZSgpO1xuXG4gICAgdmFyIHBpcGUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICB2YXIgZXh0ZW5zaW9uID0gZXh0ZW5zaW9ucy5zaGlmdCgpO1xuICAgICAgaWYgKCFleHRlbnNpb24pIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICB2YXIgZm4gPSBleHRlbnNpb25bc3RhZ2VdO1xuICAgICAgaWYgKCFmbikgcmV0dXJuIHBpcGUobWVzc2FnZSk7XG5cbiAgICAgIGlmIChmbi5sZW5ndGggPj0gMykgZXh0ZW5zaW9uW3N0YWdlXShtZXNzYWdlLCByZXF1ZXN0LCBwaXBlKTtcbiAgICAgIGVsc2UgICAgICAgICAgICAgICAgZXh0ZW5zaW9uW3N0YWdlXShtZXNzYWdlLCBwaXBlKTtcbiAgICB9O1xuICAgIHBpcGUobWVzc2FnZSk7XG4gIH1cbn07XG5cbmV4dGVuZChFeHRlbnNpYmxlLCBMb2dnaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpYmxlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3Byb3RvY29sL2V4dGVuc2libGUuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3MoRGVmZXJyYWJsZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvcHVibGljYXRpb24uanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgZXh0ZW5kICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyk7XG5cbnZhciBTdWJzY3JpcHRpb24gPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNsaWVudCwgY2hhbm5lbHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fY2xpZW50ICAgID0gY2xpZW50O1xuICAgIHRoaXMuX2NoYW5uZWxzICA9IGNoYW5uZWxzO1xuICAgIHRoaXMuX2NhbGxiYWNrICA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX2NvbnRleHQgICA9IGNvbnRleHQ7XG4gICAgdGhpcy5fY2FuY2VsbGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgd2l0aENoYW5uZWw6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fd2l0aENoYW5uZWwgPSBbY2FsbGJhY2ssIGNvbnRleHRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGFwcGx5OiBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBhcmdzWzBdO1xuXG4gICAgaWYgKHRoaXMuX2NhbGxiYWNrKVxuICAgICAgdGhpcy5fY2FsbGJhY2suY2FsbCh0aGlzLl9jb250ZXh0LCBtZXNzYWdlLmRhdGEpO1xuXG4gICAgaWYgKHRoaXMuX3dpdGhDaGFubmVsKVxuICAgICAgdGhpcy5fd2l0aENoYW5uZWxbMF0uY2FsbCh0aGlzLl93aXRoQ2hhbm5lbFsxXSwgbWVzc2FnZS5jaGFubmVsLCBtZXNzYWdlLmRhdGEpO1xuICB9LFxuXG4gIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2NhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuX2NsaWVudC51bnN1YnNjcmliZSh0aGlzLl9jaGFubmVscywgdGhpcyk7XG4gICAgdGhpcy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgfSxcblxuICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgfVxufSk7XG5cbmV4dGVuZChTdWJzY3JpcHRpb24ucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpcHRpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvc3Vic2NyaXB0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG5UcmFuc3BvcnQucmVnaXN0ZXIoJ3dlYnNvY2tldCcsIHJlcXVpcmUoJy4vd2ViX3NvY2tldCcpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignZXZlbnRzb3VyY2UnLCByZXF1aXJlKCcuL2V2ZW50X3NvdXJjZScpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignbG9uZy1wb2xsaW5nJywgcmVxdWlyZSgnLi94aHInKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2Nyb3NzLW9yaWdpbi1sb25nLXBvbGxpbmcnLCByZXF1aXJlKCcuL2NvcnMnKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2NhbGxiYWNrLXBvbGxpbmcnLCByZXF1aXJlKCcuL2pzb25wJykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcG9ydDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvYnJvd3Nlcl90cmFuc3BvcnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgU2V0ICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9zZXQnKSxcbiAgICBVUkkgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGV4dGVuZCAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdG9KU09OICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIENPUlMgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gJ21lc3NhZ2U9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0b0pTT04obWVzc2FnZXMpKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHZhciB4aHJDbGFzcyA9IGdsb2JhbC5YRG9tYWluUmVxdWVzdCA/IFhEb21haW5SZXF1ZXN0IDogWE1MSHR0cFJlcXVlc3QsXG4gICAgICAgIHhociAgICAgID0gbmV3IHhockNsYXNzKCksXG4gICAgICAgIGlkICAgICAgID0gKytDT1JTLl9pZCxcbiAgICAgICAgaGVhZGVycyAgPSB0aGlzLl9kaXNwYXRjaGVyLmhlYWRlcnMsXG4gICAgICAgIHNlbGYgICAgID0gdGhpcyxcbiAgICAgICAga2V5O1xuXG4gICAgeGhyLm9wZW4oJ1BPU1QnLCBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLCB0cnVlKTtcblxuICAgIGlmICh4aHIuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1ByYWdtYScsICduby1jYWNoZScpO1xuICAgICAgZm9yIChrZXkgaW4gaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2xlYW5VcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF4aHIpIHJldHVybiBmYWxzZTtcbiAgICAgIENPUlMuX3BlbmRpbmcucmVtb3ZlKGlkKTtcbiAgICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IHhoci5vbnRpbWVvdXQgPSB4aHIub25wcm9ncmVzcyA9IG51bGw7XG4gICAgICB4aHIgPSBudWxsO1xuICAgIH07XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVwbGllcztcbiAgICAgIHRyeSB7IHJlcGxpZXMgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBjbGVhblVwKCk7XG5cbiAgICAgIGlmIChyZXBsaWVzKVxuICAgICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgICAgZWxzZVxuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0geGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYW5VcCgpO1xuICAgICAgc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH07XG5cbiAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBpZiAoeGhyQ2xhc3MgPT09IGdsb2JhbC5YRG9tYWluUmVxdWVzdClcbiAgICAgIENPUlMuX3BlbmRpbmcuYWRkKHtpZDogaWQsIHhocjogeGhyfSk7XG5cbiAgICB4aHIuc2VuZCh0aGlzLmVuY29kZShtZXNzYWdlcykpO1xuICAgIHJldHVybiB4aHI7XG4gIH1cbn0pLCB7XG4gIF9pZDogICAgICAwLFxuICBfcGVuZGluZzogbmV3IFNldCgpLFxuXG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAoVVJJLmlzU2FtZU9yaWdpbihlbmRwb2ludCkpXG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSk7XG5cbiAgICBpZiAoZ2xvYmFsLlhEb21haW5SZXF1ZXN0KVxuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZW5kcG9pbnQucHJvdG9jb2wgPT09IGxvY2F0aW9uLnByb3RvY29sKTtcblxuICAgIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHhoci53aXRoQ3JlZGVudGlhbHMgIT09IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ09SUztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvY29ycy5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbC9jb3B5X29iamVjdCcpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIERlZmVycmFibGUgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpLFxuICAgIFRyYW5zcG9ydCAgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpLFxuICAgIFhIUiAgICAgICAgPSByZXF1aXJlKCcuL3hocicpO1xuXG52YXIgRXZlbnRTb3VyY2UgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuICAgIGlmICghZ2xvYmFsLkV2ZW50U291cmNlKSByZXR1cm4gdGhpcy5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJyk7XG5cbiAgICB0aGlzLl94aHIgPSBuZXcgWEhSKGRpc3BhdGNoZXIsIGVuZHBvaW50KTtcblxuICAgIGVuZHBvaW50ID0gY29weU9iamVjdChlbmRwb2ludCk7XG4gICAgZW5kcG9pbnQucGF0aG5hbWUgKz0gJy8nICsgZGlzcGF0Y2hlci5jbGllbnRJZDtcblxuICAgIHZhciBzb2NrZXQgPSBuZXcgZ2xvYmFsLkV2ZW50U291cmNlKFVSSS5zdHJpbmdpZnkoZW5kcG9pbnQpKSxcbiAgICAgICAgc2VsZiAgID0gdGhpcztcblxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuX2V2ZXJDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgfTtcblxuICAgIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2VsZi5fZXZlckNvbm5lY3RlZCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihbXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcbiAgICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHJlcGxpZXM7XG4gICAgICB0cnkgeyByZXBsaWVzID0gSlNPTi5wYXJzZShldmVudC5kYXRhKSB9IGNhdGNoIChlcnJvcikge31cblxuICAgICAgaWYgKHJlcGxpZXMpXG4gICAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKFtdKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc29ja2V0ID0gc29ja2V0O1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgcmV0dXJuO1xuICAgIHRoaXMuX3NvY2tldC5vbm9wZW4gPSB0aGlzLl9zb2NrZXQub25lcnJvciA9IHRoaXMuX3NvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICAgIGRlbGV0ZSB0aGlzLl9zb2NrZXQ7XG4gIH0sXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jYWxsYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cnVlKSB9KTtcbiAgICB0aGlzLmVycmJhY2soZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpIH0pO1xuICB9LFxuXG4gIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gdGhpcy5feGhyLmVuY29kZShtZXNzYWdlcyk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gdGhpcy5feGhyLnJlcXVlc3QobWVzc2FnZXMpO1xuICB9XG5cbn0pLCB7XG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaWQgPSBkaXNwYXRjaGVyLmNsaWVudElkO1xuICAgIGlmICghaWQpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcblxuICAgIFhIUi5pc1VzYWJsZShkaXNwYXRjaGVyLCBlbmRwb2ludCwgZnVuY3Rpb24odXNhYmxlKSB7XG4gICAgICBpZiAoIXVzYWJsZSkgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuICAgICAgdGhpcy5jcmVhdGUoZGlzcGF0Y2hlciwgZW5kcG9pbnQpLmlzVXNhYmxlKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgdmFyIHNvY2tldHMgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMuZXZlbnRzb3VyY2UgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMuZXZlbnRzb3VyY2UgfHwge30sXG4gICAgICAgIGlkICAgICAgPSBkaXNwYXRjaGVyLmNsaWVudElkO1xuXG4gICAgdmFyIHVybCA9IGNvcHlPYmplY3QoZW5kcG9pbnQpO1xuICAgIHVybC5wYXRobmFtZSArPSAnLycgKyAoaWQgfHwgJycpO1xuICAgIHVybCA9IFVSSS5zdHJpbmdpZnkodXJsKTtcblxuICAgIHNvY2tldHNbdXJsXSA9IHNvY2tldHNbdXJsXSB8fCBuZXcgdGhpcyhkaXNwYXRjaGVyLCBlbmRwb2ludCk7XG4gICAgcmV0dXJuIHNvY2tldHNbdXJsXTtcbiAgfVxufSk7XG5cbmV4dGVuZChFdmVudFNvdXJjZS5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50U291cmNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9ldmVudF9zb3VyY2UuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgVVJJICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWwvY29weV9vYmplY3QnKSxcbiAgICBleHRlbmQgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgVHJhbnNwb3J0ICA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cbnZhciBKU09OUCA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiBlbmNvZGU6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIHVybCA9IGNvcHlPYmplY3QodGhpcy5lbmRwb2ludCk7XG4gICAgdXJsLnF1ZXJ5Lm1lc3NhZ2UgPSB0b0pTT04obWVzc2FnZXMpO1xuICAgIHVybC5xdWVyeS5qc29ucCAgID0gJ19fanNvbnAnICsgSlNPTlAuX2NiQ291bnQgKyAnX18nO1xuICAgIHJldHVybiBVUkkuc3RyaW5naWZ5KHVybCk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB2YXIgaGVhZCAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgICAgc2NyaXB0ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG4gICAgICAgIGNhbGxiYWNrTmFtZSA9IEpTT05QLmdldENhbGxiYWNrTmFtZSgpLFxuICAgICAgICBlbmRwb2ludCAgICAgPSBjb3B5T2JqZWN0KHRoaXMuZW5kcG9pbnQpLFxuICAgICAgICBzZWxmICAgICAgICAgPSB0aGlzO1xuXG4gICAgZW5kcG9pbnQucXVlcnkubWVzc2FnZSA9IHRvSlNPTihtZXNzYWdlcyk7XG4gICAgZW5kcG9pbnQucXVlcnkuanNvbnAgICA9IGNhbGxiYWNrTmFtZTtcblxuICAgIHZhciBjbGVhbnVwID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWdsb2JhbFtjYWxsYmFja05hbWVdKSByZXR1cm4gZmFsc2U7XG4gICAgICBnbG9iYWxbY2FsbGJhY2tOYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgIHRyeSB7IGRlbGV0ZSBnbG9iYWxbY2FsbGJhY2tOYW1lXSB9IGNhdGNoIChlcnJvcikge31cbiAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgfTtcblxuICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gZnVuY3Rpb24ocmVwbGllcykge1xuICAgICAgY2xlYW51cCgpO1xuICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICB9O1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICBzY3JpcHQuc3JjICA9IFVSSS5zdHJpbmdpZnkoZW5kcG9pbnQpO1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIHJldHVybiB7YWJvcnQ6IGNsZWFudXB9O1xuICB9XG59KSwge1xuICBfY2JDb3VudDogMCxcblxuICBnZXRDYWxsYmFja05hbWU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2NiQ291bnQgKz0gMTtcbiAgICByZXR1cm4gJ19fanNvbnAnICsgdGhpcy5fY2JDb3VudCArICdfXyc7XG4gIH0sXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdHJ1ZSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEpTT05QO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9qc29ucC5qc1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBQcm9taXNlICAgID0gcmVxdWlyZSgnLi4vdXRpbC9wcm9taXNlJyksXG4gICAgU2V0ICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvc2V0JyksXG4gICAgVVJJICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgYnJvd3NlciAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYnJvd3NlcicpLFxuICAgIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuLi91dGlsL2NvcHlfb2JqZWN0JyksXG4gICAgZXh0ZW5kICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdG9KU09OICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpLFxuICAgIHdzICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3dlYnNvY2tldCcpLFxuICAgIERlZmVycmFibGUgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpLFxuICAgIFRyYW5zcG9ydCAgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG52YXIgV2ViU29ja2V0ID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuICBVTkNPTk5FQ1RFRDogIDEsXG4gIENPTk5FQ1RJTkc6ICAgMixcbiAgQ09OTkVDVEVEOiAgICAzLFxuXG4gIGJhdGNoaW5nOiAgICAgZmFsc2UsXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jYWxsYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cnVlKSB9KTtcbiAgICB0aGlzLmVycmJhY2soZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpIH0pO1xuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdGhpcy5fcGVuZGluZyA9IHRoaXMuX3BlbmRpbmcgfHwgbmV3IFNldCgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB0aGlzLl9wZW5kaW5nLmFkZChtZXNzYWdlc1tpXSk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgc2VsZi5jYWxsYmFjayhmdW5jdGlvbihzb2NrZXQpIHtcbiAgICAgICAgaWYgKCFzb2NrZXQgfHwgc29ja2V0LnJlYWR5U3RhdGUgIT09IDEpIHJldHVybjtcbiAgICAgICAgc29ja2V0LnNlbmQodG9KU09OKG1lc3NhZ2VzKSk7XG4gICAgICAgIHJlc29sdmUoc29ja2V0KTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLmNvbm5lY3QoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24oKSB7IHByb21pc2UudGhlbihmdW5jdGlvbih3cykgeyB3cy5jbG9zZSgpIH0pIH1cbiAgICB9O1xuICB9LFxuXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChXZWJTb2NrZXQuX3VubG9hZGVkKSByZXR1cm47XG5cbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuX3N0YXRlIHx8IHRoaXMuVU5DT05ORUNURUQ7XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSB0aGlzLlVOQ09OTkVDVEVEKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLkNPTk5FQ1RJTkc7XG5cbiAgICB2YXIgc29ja2V0ID0gdGhpcy5fY3JlYXRlU29ja2V0KCk7XG4gICAgaWYgKCFzb2NrZXQpIHJldHVybiB0aGlzLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzb2NrZXQuaGVhZGVycykgc2VsZi5fc3RvcmVDb29raWVzKHNvY2tldC5oZWFkZXJzWydzZXQtY29va2llJ10pO1xuICAgICAgc2VsZi5fc29ja2V0ID0gc29ja2V0O1xuICAgICAgc2VsZi5fc3RhdGUgPSBzZWxmLkNPTk5FQ1RFRDtcbiAgICAgIHNlbGYuX2V2ZXJDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgc2VsZi5fcGluZygpO1xuICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJywgc29ja2V0KTtcbiAgICB9O1xuXG4gICAgdmFyIGNsb3NlZCA9IGZhbHNlO1xuICAgIHNvY2tldC5vbmNsb3NlID0gc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjbG9zZWQpIHJldHVybjtcbiAgICAgIGNsb3NlZCA9IHRydWU7XG5cbiAgICAgIHZhciB3YXNDb25uZWN0ZWQgPSAoc2VsZi5fc3RhdGUgPT09IHNlbGYuQ09OTkVDVEVEKTtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSBzb2NrZXQub25jbG9zZSA9IHNvY2tldC5vbmVycm9yID0gc29ja2V0Lm9ubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgIGRlbGV0ZSBzZWxmLl9zb2NrZXQ7XG4gICAgICBzZWxmLl9zdGF0ZSA9IHNlbGYuVU5DT05ORUNURUQ7XG4gICAgICBzZWxmLnJlbW92ZVRpbWVvdXQoJ3BpbmcnKTtcblxuICAgICAgdmFyIHBlbmRpbmcgPSBzZWxmLl9wZW5kaW5nID8gc2VsZi5fcGVuZGluZy50b0FycmF5KCkgOiBbXTtcbiAgICAgIGRlbGV0ZSBzZWxmLl9wZW5kaW5nO1xuXG4gICAgICBpZiAod2FzQ29ubmVjdGVkIHx8IHNlbGYuX2V2ZXJDb25uZWN0ZWQpIHtcbiAgICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygndW5rbm93bicpO1xuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihwZW5kaW5nLCB3YXNDb25uZWN0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHJlcGxpZXM7XG4gICAgICB0cnkgeyByZXBsaWVzID0gSlNPTi5wYXJzZShldmVudC5kYXRhKSB9IGNhdGNoIChlcnJvcikge31cblxuICAgICAgaWYgKCFyZXBsaWVzKSByZXR1cm47XG5cbiAgICAgIHJlcGxpZXMgPSBbXS5jb25jYXQocmVwbGllcyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcmVwbGllcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaWYgKHJlcGxpZXNbaV0uc3VjY2Vzc2Z1bCA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgICAgc2VsZi5fcGVuZGluZy5yZW1vdmUocmVwbGllc1tpXSk7XG4gICAgICB9XG4gICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgIH07XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSByZXR1cm47XG4gICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4gIH0sXG5cbiAgX2NyZWF0ZVNvY2tldDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVybCAgICAgICAgPSBXZWJTb2NrZXQuZ2V0U29ja2V0VXJsKHRoaXMuZW5kcG9pbnQpLFxuICAgICAgICBoZWFkZXJzICAgID0gdGhpcy5fZGlzcGF0Y2hlci5oZWFkZXJzLFxuICAgICAgICBleHRlbnNpb25zID0gdGhpcy5fZGlzcGF0Y2hlci53c0V4dGVuc2lvbnMsXG4gICAgICAgIGNvb2tpZSAgICAgPSB0aGlzLl9nZXRDb29raWVzKCksXG4gICAgICAgIHRscyAgICAgICAgPSB0aGlzLl9kaXNwYXRjaGVyLnRscyxcbiAgICAgICAgb3B0aW9ucyAgICA9IHtleHRlbnNpb25zOiBleHRlbnNpb25zLCBoZWFkZXJzOiBoZWFkZXJzLCBwcm94eTogdGhpcy5fcHJveHksIHRsczogdGxzfTtcblxuICAgIGlmIChjb29raWUgIT09ICcnKSBvcHRpb25zLmhlYWRlcnNbJ0Nvb2tpZSddID0gY29va2llO1xuXG4gICAgcmV0dXJuIHdzLmNyZWF0ZSh1cmwsIFtdLCBvcHRpb25zKTtcbiAgfSxcblxuICBfcGluZzogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQgfHwgdGhpcy5fc29ja2V0LnJlYWR5U3RhdGUgIT09IDEpIHJldHVybjtcbiAgICB0aGlzLl9zb2NrZXQuc2VuZCgnW10nKTtcbiAgICB0aGlzLmFkZFRpbWVvdXQoJ3BpbmcnLCB0aGlzLl9kaXNwYXRjaGVyLnRpbWVvdXQgLyAyLCB0aGlzLl9waW5nLCB0aGlzKTtcbiAgfVxuXG59KSwge1xuICBQUk9UT0NPTFM6IHtcbiAgICAnaHR0cDonOiAgJ3dzOicsXG4gICAgJ2h0dHBzOic6ICd3c3M6J1xuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQpIHtcbiAgICB2YXIgc29ja2V0cyA9IGRpc3BhdGNoZXIudHJhbnNwb3J0cy53ZWJzb2NrZXQgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMud2Vic29ja2V0IHx8IHt9O1xuICAgIHNvY2tldHNbZW5kcG9pbnQuaHJlZl0gPSBzb2NrZXRzW2VuZHBvaW50LmhyZWZdIHx8IG5ldyB0aGlzKGRpc3BhdGNoZXIsIGVuZHBvaW50KTtcbiAgICByZXR1cm4gc29ja2V0c1tlbmRwb2ludC5ocmVmXTtcbiAgfSxcblxuICBnZXRTb2NrZXRVcmw6IGZ1bmN0aW9uKGVuZHBvaW50KSB7XG4gICAgZW5kcG9pbnQgPSBjb3B5T2JqZWN0KGVuZHBvaW50KTtcbiAgICBlbmRwb2ludC5wcm90b2NvbCA9IHRoaXMuUFJPVE9DT0xTW2VuZHBvaW50LnByb3RvY29sXTtcbiAgICByZXR1cm4gVVJJLnN0cmluZ2lmeShlbmRwb2ludCk7XG4gIH0sXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuY3JlYXRlKGRpc3BhdGNoZXIsIGVuZHBvaW50KS5pc1VzYWJsZShjYWxsYmFjaywgY29udGV4dCk7XG4gIH1cbn0pO1xuXG5leHRlbmQoV2ViU29ja2V0LnByb3RvdHlwZSwgRGVmZXJyYWJsZSk7XG5cbmlmIChicm93c2VyLkV2ZW50ICYmIGdsb2JhbC5vbmJlZm9yZXVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICBicm93c2VyLkV2ZW50Lm9uKGdsb2JhbCwgJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uKCkgeyBXZWJTb2NrZXQuX3VubG9hZGVkID0gdHJ1ZSB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWJTb2NrZXQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L3dlYl9zb2NrZXQuanNcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5Db3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2ZcbnRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW5cbnRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG9cbnVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzXG5vZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG9cbnNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbnZhciBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbidcbiAgICA/IEFycmF5LmlzQXJyYXlcbiAgICA6IGZ1bmN0aW9uICh4cykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICAgIH1cbjtcbmZ1bmN0aW9uIGluZGV4T2YgKHhzLCB4KSB7XG4gICAgaWYgKHhzLmluZGV4T2YpIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHggPT09IHhzW2ldKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzQXJyYXkodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpXG4gICAge1xuICAgICAgaWYgKGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGFyZ3VtZW50c1sxXTsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuY2F1Z2h0LCB1bnNwZWNpZmllZCAnZXJyb3InIGV2ZW50LlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIGZhbHNlO1xuICB2YXIgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gRXZlbnRFbWl0dGVyIGlzIGRlZmluZWQgaW4gc3JjL25vZGVfZXZlbnRzLmNjXG4vLyBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQoKSBpcyBhbHNvIGRlZmluZWQgdGhlcmUuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYWRkTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09IFwibmV3TGlzdGVuZXJzXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyc1wiLlxuICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL2V2ZW50X2VtaXR0ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMsIHZhbGlkS2V5cykge1xuICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChhcnJheS5pbmRleE9mKHZhbGlkS2V5cywga2V5KSA8IDApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VucmVjb2duaXplZCBvcHRpb246ICcgKyBrZXkpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvdmFsaWRhdGVfb3B0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgV1MgPSBnbG9iYWwuTW96V2ViU29ja2V0IHx8IGdsb2JhbC5XZWJTb2NrZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IGZ1bmN0aW9uKHVybCwgcHJvdG9jb2xzLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBXUyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBXUyh1cmwpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvd2Vic29ja2V0L2Jyb3dzZXJfd2Vic29ja2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgRmF5ZSA9IHJlcXVpcmUoJ2ZheWUvc3JjL2ZheWVfYnJvd3NlcicpO1xuY29uc3QgQ2xhc3MgPSByZXF1aXJlKCdmYXllL3NyYy91dGlsL2NsYXNzJyk7XG5cbmNvbnN0IENsaWVudCA9IENsYXNzKEZheWUuQ2xpZW50LCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChiYXNlLCBvcHRpb25zKSB7XG4gICAgRmF5ZS5DbGllbnQucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBiYXNlLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX3Rva2VucyA9IHt9O1xuICAgIHNlbGYuX3ByZXNlbmNlQ0JzID0ge307XG5cbiAgICB0aGlzLmFkZEV4dGVuc2lvbih7XG4gICAgICBvdXRnb2luZzogZnVuY3Rpb24gKG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB0b2tlbjtcblxuICAgICAgICBpZiAobWVzc2FnZS5kYXRhICYmIG1lc3NhZ2UuZGF0YS5fb3JpZ2luYWxEYXRhKSB7XG4gICAgICAgICAgdG9rZW4gPSBtZXNzYWdlLmRhdGEuX3Rva2VuO1xuICAgICAgICAgIG1lc3NhZ2UuZGF0YSA9IG1lc3NhZ2UuZGF0YS5fb3JpZ2luYWxEYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgIGNvbnN0IGNoYW5uZWwgPSAobWVzc2FnZS5jaGFubmVsID09PSAnL21ldGEvc3Vic2NyaWJlJ1xuICAgICAgICAgICAgPyBtZXNzYWdlLnN1YnNjcmlwdGlvblxuICAgICAgICAgICAgOiBtZXNzYWdlLmNoYW5uZWwpO1xuICAgICAgICAgIHRva2VuID0gc2VsZi5fdG9rZW5zW2NoYW5uZWxdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgaWYgKCFtZXNzYWdlLmV4dCkgbWVzc2FnZS5leHQgPSB7fTtcbiAgICAgICAgICBtZXNzYWdlLmV4dC5hdXRoID0ge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgICAgfSxcbiAgICAgIGluY29taW5nOiBmdW5jdGlvbiAobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UuY2hhbm5lbCA9PT0gJy9tZXRhL3N1YnNjcmliZScgJiYgbWVzc2FnZS5leHQgJiYgbWVzc2FnZS5leHQucHJlc2VuY2UpIHtcbiAgICAgICAgICBjb25zdCBwcmVzZW5jZUNCID0gc2VsZi5fcHJlc2VuY2VDQnNbbWVzc2FnZS5zdWJzY3JpcHRpb25dO1xuICAgICAgICAgIGlmIChwcmVzZW5jZUNCKSB7XG4gICAgICAgICAgICBwcmVzZW5jZUNCKG1lc3NhZ2UuZXh0LnByZXNlbmNlLCBtZXNzYWdlLnN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0gY2hhbm5lbCBbU3RyaW5nXVxuICAgKiBAcGFyYW0gdG9rZW4gW1N0cmluZ10gKG9wdGlvbmFsKVxuICAgKiBAY2FsbGJhY2sgW2Z1bmN0aW9uKG1lc3NhZ2UsIGNoYW5uZWwpXSAob3B0aW9uYWwpXG4gICAqICAgQHBhcmFtIG1lc3NhZ2UgW09iamVjdF1cbiAgICogICBAcGFyYW0gY2hhbm5lbCBbU3RyaW5nXVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICpcbiAgICogc3Vic2NyaWJlVG8oY2hhbm5lbCwgY2FsbGJhY2spXG4gICAqIHN1YnNjcmliZVRvKGNoYW5uZWwsIHRva2VuLCBjYWxsYmFjayk7XG4gICAqL1xuICBzdWJzY3JpYmVUbzogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBhcmd1bWVudHNbMF07XG4gICAgbGV0IGNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBsZXQgdG9rZW47XG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB0b2tlbiA9IGFyZ3VtZW50c1sxXTtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRoaXMuX3Rva2Vuc1tjaGFubmVsXSA9IHRva2VuO1xuICAgIH1cblxuICAgIHRoaXMuX3ByZXNlbmNlQ0JzW2NoYW5uZWxdID0gY2FsbGJhY2s7XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmUoY2hhbm5lbCkud2l0aENoYW5uZWwoZnVuY3Rpb24gKGNoYW5uZWwsIG1lc3NhZ2UpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhtZXNzYWdlLCBjaGFubmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIGNoYW5uZWwgW1N0cmluZ11cbiAgICogQHBhcmFtIHRva2VuIFtTdHJpbmddXG4gICAqIEBwYXJhbSBtZXNzYWdlIFtPYmplY3RdXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgcHVibGlzaFRvOiBmdW5jdGlvbiAoY2hhbm5lbCwgdG9rZW4sIGRhdGEpIHtcbiAgICBjb25zdCB3cmFwcGVkRGF0YSA9IHtcbiAgICAgIF9vcmlnaW5hbERhdGE6IGRhdGEsXG4gICAgICBfdG9rZW46IHRva2VuXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnB1Ymxpc2goY2hhbm5lbCwgd3JhcHBlZERhdGEpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENsaWVudDogQ2xpZW50XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY2xpZW50L2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==