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

const Faye = __webpack_require__(21);
const Class = __webpack_require__(0);

const Client = Class(Faye.Client, {
  initialize: function (base, options) {
    Faye.Client.prototype.initialize.call(this, base, options);

    const self = this;
    self._tokens = {};
    self._presenceCBs = {};

    this.addExtension({
      outgoing: function (message, callback) {
        let token;

        if (message.data && message.data._originalData) {
          token = message.data._token;
          message.data = message.data._originalData;
        }

        if (!token) {
          const channel = (message.channel === '/meta/subscribe'
            ? message.subscription
            : message.channel);
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
      incoming: function (message, callback) {
        if (message.channel === '/meta/subscribe' && message.ext && message.ext.presence) {
          const presenceCB = self._presenceCBs[message.subscription];
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
  subscribeTo: function () {
    const channel = arguments[0];
    let callback;
    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    }
    let token;
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
  publishTo: function (channel, token, data) {
    const wrappedData = {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlNzgzODE1NzM5Y2M5MzkwZGU1ZSIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC91cmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy90cmFuc3BvcnQvdHJhbnNwb3J0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL2RlZmVycmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9taXhpbnMvbG9nZ2luZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvdG9fanNvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3V0aWwvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL21peGlucy9wdWJsaXNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2FycmF5LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9icm93c2VyL2V2ZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb3B5X29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FzYXAvYnJvd3Nlci1hc2FwLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2dyYW1tYXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9wcm90b2NvbC9zY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy90cmFuc3BvcnQveGhyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy91dGlsL2Nvb2tpZXMvYnJvd3Nlcl9jb29raWVzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9mYXllL3NyYy9mYXllX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hc2FwL2Jyb3dzZXItcmF3LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvbWl4aW5zL3RpbWVvdXRzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL2Vycm9yLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvZXh0ZW5zaWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3Byb3RvY29sL3B1YmxpY2F0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvcHJvdG9jb2wvc3Vic2NyaXB0aW9uLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2Jyb3dzZXJfdHJhbnNwb3J0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9jb3JzLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2V2ZW50X3NvdXJjZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9qc29ucC5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC93ZWJfc29ja2V0LmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC9ldmVudF9lbWl0dGVyLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC92YWxpZGF0ZV9vcHRpb25zLmpzIiwid2VicGFjazovLy8uL34vZmF5ZS9zcmMvdXRpbC93ZWJzb2NrZXQvYnJvd3Nlcl93ZWJzb2NrZXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUN0QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNYQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNwQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLE9BQU87QUFDeEM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OzsrQ0NsRkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhCQUE4QjtBQUM5QixrQkFBa0IsbURBQW1EO0FBQ3JFOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0EsR0FBRzs7QUFFSCxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0EscUNBQXFDOztBQUVyQzs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxPQUFPO0FBQy9DO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUssU0FBUztBQUNkLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5Q0FBeUMsT0FBTztBQUNoRDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRCxpQ0FBaUM7QUFDbkY7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxvREFBb0QsY0FBYztBQUNsRSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBOzs7Ozs7Ozs7OENDbE5BOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxzQ0FBc0MsZ0NBQWdDO0FBQ3RFLEdBQUc7O0FBRUg7QUFDQSw2Q0FBNkMsaUNBQWlDO0FBQzlFLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDL0NBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7Ozs7Ozs7QUM5Q0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7OztBQ1JBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsV0FBVztBQUNyQywwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEseUJBQXlCLHVCQUF1QjtBQUNoRCx5QkFBeUIsdUJBQXVCO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQzs7QUFFbEM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsMkJBQTJCO0FBQzlDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELGlCQUFpQjtBQUNqRTs7QUFFQTtBQUNBLGdEQUFnRCxpQkFBaUI7QUFDakU7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLE9BQU87QUFDL0M7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNoS0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3BDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDLE9BQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLE9BQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OENDekVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDakRBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDbEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0MsT0FBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsMENBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDs7Ozs7Ozs7QUNuSUE7O0FBRUE7QUFDQTtBQUNBLG9GQUFvRixJQUFJO0FBQ3hGO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNQQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVILHdCQUF3Qjs7QUFFeEIscUJBQXFCOztBQUVyQjtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7OzhDQzdDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7QUNqRkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ1RBOztBQUVBOzs7Ozs7OztBQ0ZBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDakREOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7OzhDQ2RBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OENDOU5BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs4Q0N6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLLElBQUk7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsdUNBQXVDLHlCQUF5Qjs7QUFFaEUsT0FBTztBQUNQO0FBQ0Esc0NBQXNDLG9DQUFvQztBQUMxRTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDLGtDQUFrQzs7QUFFMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLLElBQUk7QUFDVCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUssSUFBSTtBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyxJQUFJO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPLElBQUk7QUFDWDs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsaUJBQWlCO0FBQ25EO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OzhDQ2pZQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0RBQXdEOztBQUV4RDtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsT0FBTztBQUM3QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsK0VBQStFO0FBQy9ILHlDQUF5QztBQUN6Qzs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQ3hMQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7Ozs7Ozs7QUN0REE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7OztBQzlDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7OztBQ0xBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7Ozs7Ozs7O0FDM0NBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OzhDQ1ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyx5Q0FBeUM7O0FBRXBEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx5QkFBeUIsaUJBQWlCOztBQUUxQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OENDbkZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsbUNBQW1DOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLDhCQUE4QiwrQkFBK0I7QUFDN0QsNkJBQTZCLGdDQUFnQztBQUM3RCxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0EsNkZBQTZGO0FBQzdGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOzs7Ozs7Ozs7OENDaEdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsOEJBQThCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs4Q0MvREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDhCQUE4QiwrQkFBK0I7QUFDN0QsNkJBQTZCLGdDQUFnQztBQUM3RDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLHdDQUF3QyxPQUFPOztBQUUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLEtBQUs7O0FBRUw7QUFDQSx5QkFBeUIsNEJBQTRCLGFBQWE7QUFDbEU7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsbUNBQW1DOztBQUU5Qzs7QUFFQTs7QUFFQSx5Q0FBeUMsT0FBTztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0EsdURBQXVELDZCQUE2Qjs7QUFFcEY7Ozs7Ozs7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0EseUNBQXlDLE9BQU87QUFDaEQ7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDMUtBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OENDVEE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ1RBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUNuTHRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vY2xpZW50L2Rpc3QvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiUGFuZGFwdXNoXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlBhbmRhcHVzaFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTc4MzgxNTczOWNjOTM5MGRlNWUiLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhcmVudCwgbWV0aG9kcykge1xuICBpZiAodHlwZW9mIHBhcmVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1ldGhvZHMgPSBwYXJlbnQ7XG4gICAgcGFyZW50ICA9IE9iamVjdDtcbiAgfVxuXG4gIHZhciBrbGFzcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplKSByZXR1cm4gdGhpcztcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgfTtcblxuICB2YXIgYnJpZGdlID0gZnVuY3Rpb24oKSB7fTtcbiAgYnJpZGdlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAga2xhc3MucHJvdG90eXBlID0gbmV3IGJyaWRnZSgpO1xuICBleHRlbmQoa2xhc3MucHJvdG90eXBlLCBtZXRob2RzKTtcblxuICByZXR1cm4ga2xhc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvY2xhc3MuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlc3QsIHNvdXJjZSwgb3ZlcndyaXRlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gZGVzdDtcbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgIGlmIChkZXN0Lmhhc093blByb3BlcnR5KGtleSkgJiYgb3ZlcndyaXRlID09PSBmYWxzZSkgY29udGludWU7XG4gICAgaWYgKGRlc3Rba2V5XSAhPT0gc291cmNlW2tleV0pXG4gICAgICBkZXN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9leHRlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzVVJJOiBmdW5jdGlvbih1cmkpIHtcbiAgICByZXR1cm4gdXJpICYmIHVyaS5wcm90b2NvbCAmJiB1cmkuaG9zdCAmJiB1cmkucGF0aDtcbiAgfSxcblxuICBpc1NhbWVPcmlnaW46IGZ1bmN0aW9uKHVyaSkge1xuICAgIHJldHVybiB1cmkucHJvdG9jb2wgPT09IGxvY2F0aW9uLnByb3RvY29sICYmXG4gICAgICAgICAgIHVyaS5ob3N0bmFtZSA9PT0gbG9jYXRpb24uaG9zdG5hbWUgJiZcbiAgICAgICAgICAgdXJpLnBvcnQgICAgID09PSBsb2NhdGlvbi5wb3J0O1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbih1cmwpIHtcbiAgICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHJldHVybiB1cmw7XG4gICAgdmFyIHVyaSA9IHt9LCBwYXJ0cywgcXVlcnksIHBhaXJzLCBpLCBuLCBkYXRhO1xuXG4gICAgdmFyIGNvbnN1bWUgPSBmdW5jdGlvbihuYW1lLCBwYXR0ZXJuKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZShwYXR0ZXJuLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICB1cmlbbmFtZV0gPSBtYXRjaDtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSk7XG4gICAgICB1cmlbbmFtZV0gPSB1cmlbbmFtZV0gfHwgJyc7XG4gICAgfTtcblxuICAgIGNvbnN1bWUoJ3Byb3RvY29sJywgL15bYS16XStcXDovaSk7XG4gICAgY29uc3VtZSgnaG9zdCcsICAgICAvXlxcL1xcL1teXFwvXFw/I10rLyk7XG5cbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkgJiYgIXVyaS5ob3N0KVxuICAgICAgdXJsID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvW15cXC9dKiQvLCAnJykgKyB1cmw7XG5cbiAgICBjb25zdW1lKCdwYXRobmFtZScsIC9eW15cXD8jXSovKTtcbiAgICBjb25zdW1lKCdzZWFyY2gnLCAgIC9eXFw/W14jXSovKTtcbiAgICBjb25zdW1lKCdoYXNoJywgICAgIC9eIy4qLyk7XG5cbiAgICB1cmkucHJvdG9jb2wgPSB1cmkucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2w7XG5cbiAgICBpZiAodXJpLmhvc3QpIHtcbiAgICAgIHVyaS5ob3N0ICAgICA9IHVyaS5ob3N0LnN1YnN0cigyKTtcbiAgICAgIHBhcnRzICAgICAgICA9IHVyaS5ob3N0LnNwbGl0KCc6Jyk7XG4gICAgICB1cmkuaG9zdG5hbWUgPSBwYXJ0c1swXTtcbiAgICAgIHVyaS5wb3J0ICAgICA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmkuaG9zdCAgICAgPSBsb2NhdGlvbi5ob3N0O1xuICAgICAgdXJpLmhvc3RuYW1lID0gbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgICB1cmkucG9ydCAgICAgPSBsb2NhdGlvbi5wb3J0O1xuICAgIH1cblxuICAgIHVyaS5wYXRobmFtZSA9IHVyaS5wYXRobmFtZSB8fCAnLyc7XG4gICAgdXJpLnBhdGggPSB1cmkucGF0aG5hbWUgKyB1cmkuc2VhcmNoO1xuXG4gICAgcXVlcnkgPSB1cmkuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJyk7XG4gICAgcGFpcnMgPSBxdWVyeSA/IHF1ZXJ5LnNwbGl0KCcmJykgOiBbXTtcbiAgICBkYXRhICA9IHt9O1xuXG4gICAgZm9yIChpID0gMCwgbiA9IHBhaXJzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgcGFydHMgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgZGF0YVtkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0gfHwgJycpXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSB8fCAnJyk7XG4gICAgfVxuXG4gICAgdXJpLnF1ZXJ5ID0gZGF0YTtcblxuICAgIHVyaS5ocmVmID0gdGhpcy5zdHJpbmdpZnkodXJpKTtcbiAgICByZXR1cm4gdXJpO1xuICB9LFxuXG4gIHN0cmluZ2lmeTogZnVuY3Rpb24odXJpKSB7XG4gICAgdmFyIHN0cmluZyA9IHVyaS5wcm90b2NvbCArICcvLycgKyB1cmkuaG9zdG5hbWU7XG4gICAgaWYgKHVyaS5wb3J0KSBzdHJpbmcgKz0gJzonICsgdXJpLnBvcnQ7XG4gICAgc3RyaW5nICs9IHVyaS5wYXRobmFtZSArIHRoaXMucXVlcnlTdHJpbmcodXJpLnF1ZXJ5KSArICh1cmkuaGFzaCB8fCAnJyk7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfSxcblxuICBxdWVyeVN0cmluZzogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcXVlcnkpIHtcbiAgICAgIGlmICghcXVlcnkuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5W2tleV0pKTtcbiAgICB9XG4gICAgaWYgKHBhaXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xuICAgIHJldHVybiAnPycgKyBwYWlycy5qb2luKCcmJyk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC91cmkuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgQ29va2llICAgPSByZXF1aXJlKCcuLi91dGlsL2Nvb2tpZXMnKS5Db29raWUsXG4gICAgUHJvbWlzZSAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKSxcbiAgICBVUkkgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgYXJyYXkgICAgPSByZXF1aXJlKCcuLi91dGlsL2FycmF5JyksXG4gICAgZXh0ZW5kICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIExvZ2dpbmcgID0gcmVxdWlyZSgnLi4vbWl4aW5zL2xvZ2dpbmcnKSxcbiAgICBUaW1lb3V0cyA9IHJlcXVpcmUoJy4uL21peGlucy90aW1lb3V0cycpLFxuICAgIENoYW5uZWwgID0gcmVxdWlyZSgnLi4vcHJvdG9jb2wvY2hhbm5lbCcpO1xuXG52YXIgVHJhbnNwb3J0ID0gZXh0ZW5kKENsYXNzKHsgY2xhc3NOYW1lOiAnVHJhbnNwb3J0JyxcbiAgREVGQVVMVF9QT1JUUzogeydodHRwOic6IDgwLCAnaHR0cHM6JzogNDQzLCAnd3M6JzogODAsICd3c3M6JzogNDQzfSxcbiAgTUFYX0RFTEFZOiAgICAgMCxcblxuICBiYXRjaGluZzogIHRydWUsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQpIHtcbiAgICB0aGlzLl9kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmVuZHBvaW50ICAgID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5fb3V0Ym94ICAgICA9IFtdO1xuICAgIHRoaXMuX3Byb3h5ICAgICAgPSBleHRlbmQoe30sIHRoaXMuX2Rpc3BhdGNoZXIucHJveHkpO1xuXG4gICAgaWYgKCF0aGlzLl9wcm94eS5vcmlnaW4pXG4gICAgICB0aGlzLl9wcm94eS5vcmlnaW4gPSB0aGlzLl9maW5kUHJveHkoKTtcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24oKSB7fSxcblxuICBlbmNvZGU6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgcmV0dXJuICcnO1xuICB9LFxuXG4gIHNlbmRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy5kZWJ1ZygnQ2xpZW50ID8gc2VuZGluZyBtZXNzYWdlIHRvID86ID8nLFxuICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KSwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuYmF0Y2hpbmcpIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5yZXF1ZXN0KFttZXNzYWdlXSkpO1xuXG4gICAgdGhpcy5fb3V0Ym94LnB1c2gobWVzc2FnZSk7XG4gICAgdGhpcy5fZmx1c2hMYXJnZUJhdGNoKCk7XG5cbiAgICBpZiAobWVzc2FnZS5jaGFubmVsID09PSBDaGFubmVsLkhBTkRTSEFLRSlcbiAgICAgIHJldHVybiB0aGlzLl9wdWJsaXNoKDAuMDEpO1xuXG4gICAgaWYgKG1lc3NhZ2UuY2hhbm5lbCA9PT0gQ2hhbm5lbC5DT05ORUNUKVxuICAgICAgdGhpcy5fY29ubmVjdE1lc3NhZ2UgPSBtZXNzYWdlO1xuXG4gICAgcmV0dXJuIHRoaXMuX3B1Ymxpc2godGhpcy5NQVhfREVMQVkpO1xuICB9LFxuXG4gIF9tYWtlUHJvbWlzZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5fcmVxdWVzdFByb21pc2UgPSB0aGlzLl9yZXF1ZXN0UHJvbWlzZSB8fCBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICBzZWxmLl9yZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgfSk7XG4gIH0sXG5cbiAgX3B1Ymxpc2g6IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgdGhpcy5fbWFrZVByb21pc2UoKTtcblxuICAgIHRoaXMuYWRkVGltZW91dCgncHVibGlzaCcsIGRlbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2ZsdXNoKCk7XG4gICAgICBkZWxldGUgdGhpcy5fcmVxdWVzdFByb21pc2U7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFByb21pc2U7XG4gIH0sXG5cbiAgX2ZsdXNoOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZVRpbWVvdXQoJ3B1Ymxpc2gnKTtcblxuICAgIGlmICh0aGlzLl9vdXRib3gubGVuZ3RoID4gMSAmJiB0aGlzLl9jb25uZWN0TWVzc2FnZSlcbiAgICAgIHRoaXMuX2Nvbm5lY3RNZXNzYWdlLmFkdmljZSA9IHt0aW1lb3V0OiAwfTtcblxuICAgIHRoaXMuX3Jlc29sdmVQcm9taXNlKHRoaXMucmVxdWVzdCh0aGlzLl9vdXRib3gpKTtcblxuICAgIHRoaXMuX2Nvbm5lY3RNZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLl9vdXRib3ggPSBbXTtcbiAgfSxcblxuICBfZmx1c2hMYXJnZUJhdGNoOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nID0gdGhpcy5lbmNvZGUodGhpcy5fb3V0Ym94KTtcbiAgICBpZiAoc3RyaW5nLmxlbmd0aCA8IHRoaXMuX2Rpc3BhdGNoZXIubWF4UmVxdWVzdFNpemUpIHJldHVybjtcbiAgICB2YXIgbGFzdCA9IHRoaXMuX291dGJveC5wb3AoKTtcblxuICAgIHRoaXMuX21ha2VQcm9taXNlKCk7XG4gICAgdGhpcy5fZmx1c2goKTtcblxuICAgIGlmIChsYXN0KSB0aGlzLl9vdXRib3gucHVzaChsYXN0KTtcbiAgfSxcblxuICBfcmVjZWl2ZTogZnVuY3Rpb24ocmVwbGllcykge1xuICAgIGlmICghcmVwbGllcykgcmV0dXJuO1xuICAgIHJlcGxpZXMgPSBbXS5jb25jYXQocmVwbGllcyk7XG5cbiAgICB0aGlzLmRlYnVnKCdDbGllbnQgPyByZWNlaXZlZCBmcm9tID8gdmlhID86ID8nLFxuICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KSwgdGhpcy5jb25uZWN0aW9uVHlwZSwgcmVwbGllcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IHJlcGxpZXMubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgICAgdGhpcy5fZGlzcGF0Y2hlci5oYW5kbGVSZXNwb25zZShyZXBsaWVzW2ldKTtcbiAgfSxcblxuICBfaGFuZGxlRXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2VzLCBpbW1lZGlhdGUpIHtcbiAgICBtZXNzYWdlcyA9IFtdLmNvbmNhdChtZXNzYWdlcyk7XG5cbiAgICB0aGlzLmRlYnVnKCdDbGllbnQgPyBmYWlsZWQgdG8gc2VuZCB0byA/IHZpYSA/OiA/JyxcbiAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIHRoaXMuY29ubmVjdGlvblR5cGUsIG1lc3NhZ2VzKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgICAgdGhpcy5fZGlzcGF0Y2hlci5oYW5kbGVFcnJvcihtZXNzYWdlc1tpXSk7XG4gIH0sXG5cbiAgX2dldENvb2tpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb29raWVzID0gdGhpcy5fZGlzcGF0Y2hlci5jb29raWVzLFxuICAgICAgICB1cmwgICAgID0gVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KTtcblxuICAgIGlmICghY29va2llcykgcmV0dXJuICcnO1xuXG4gICAgcmV0dXJuIGFycmF5Lm1hcChjb29raWVzLmdldENvb2tpZXNTeW5jKHVybCksIGZ1bmN0aW9uKGNvb2tpZSkge1xuICAgICAgcmV0dXJuIGNvb2tpZS5jb29raWVTdHJpbmcoKTtcbiAgICB9KS5qb2luKCc7ICcpO1xuICB9LFxuXG4gIF9zdG9yZUNvb2tpZXM6IGZ1bmN0aW9uKHNldENvb2tpZSkge1xuICAgIHZhciBjb29raWVzID0gdGhpcy5fZGlzcGF0Y2hlci5jb29raWVzLFxuICAgICAgICB1cmwgICAgID0gVVJJLnN0cmluZ2lmeSh0aGlzLmVuZHBvaW50KSxcbiAgICAgICAgY29va2llO1xuXG4gICAgaWYgKCFzZXRDb29raWUgfHwgIWNvb2tpZXMpIHJldHVybjtcbiAgICBzZXRDb29raWUgPSBbXS5jb25jYXQoc2V0Q29va2llKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gc2V0Q29va2llLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgY29va2llID0gQ29va2llLnBhcnNlKHNldENvb2tpZVtpXSk7XG4gICAgICBjb29raWVzLnNldENvb2tpZVN5bmMoY29va2llLCB1cmwpO1xuICAgIH1cbiAgfSxcblxuICBfZmluZFByb3h5OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgdmFyIHByb3RvY29sID0gdGhpcy5lbmRwb2ludC5wcm90b2NvbDtcbiAgICBpZiAoIXByb3RvY29sKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgdmFyIG5hbWUgICA9IHByb3RvY29sLnJlcGxhY2UoLzokLywgJycpLnRvTG93ZXJDYXNlKCkgKyAnX3Byb3h5JyxcbiAgICAgICAgdXBjYXNlID0gbmFtZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICBlbnYgICAgPSBwcm9jZXNzLmVudixcbiAgICAgICAga2V5cywgcHJveHk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2h0dHBfcHJveHknICYmIGVudi5SRVFVRVNUX01FVEhPRCkge1xuICAgICAga2V5cyA9IE9iamVjdC5rZXlzKGVudikuZmlsdGVyKGZ1bmN0aW9uKGspIHsgcmV0dXJuIC9eaHR0cF9wcm94eSQvaS50ZXN0KGspIH0pO1xuICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChrZXlzWzBdID09PSBuYW1lICYmIGVudlt1cGNhc2VdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgcHJveHkgPSBlbnZbbmFtZV07XG4gICAgICB9IGVsc2UgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICBwcm94eSA9IGVudltuYW1lXTtcbiAgICAgIH1cbiAgICAgIHByb3h5ID0gcHJveHkgfHwgZW52WydDR0lfJyArIHVwY2FzZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3h5ID0gZW52W25hbWVdIHx8IGVudlt1cGNhc2VdO1xuICAgICAgaWYgKHByb3h5ICYmICFlbnZbbmFtZV0pXG4gICAgICAgIGNvbnNvbGUud2FybignVGhlIGVudmlyb25tZW50IHZhcmlhYmxlICcgKyB1cGNhc2UgK1xuICAgICAgICAgICAgICAgICAgICAgJyBpcyBkaXNjb3VyYWdlZC4gVXNlICcgKyBuYW1lICsgJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbn0pLCB7XG4gIGdldDogZnVuY3Rpb24oZGlzcGF0Y2hlciwgYWxsb3dlZCwgZGlzYWJsZWQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIGVuZHBvaW50ID0gZGlzcGF0Y2hlci5lbmRwb2ludDtcblxuICAgIGFycmF5LmFzeW5jRWFjaCh0aGlzLl90cmFuc3BvcnRzLCBmdW5jdGlvbihwYWlyLCByZXN1bWUpIHtcbiAgICAgIHZhciBjb25uVHlwZSAgICAgPSBwYWlyWzBdLCBrbGFzcyA9IHBhaXJbMV0sXG4gICAgICAgICAgY29ubkVuZHBvaW50ID0gZGlzcGF0Y2hlci5lbmRwb2ludEZvcihjb25uVHlwZSk7XG5cbiAgICAgIGlmIChhcnJheS5pbmRleE9mKGRpc2FibGVkLCBjb25uVHlwZSkgPj0gMClcbiAgICAgICAgcmV0dXJuIHJlc3VtZSgpO1xuXG4gICAgICBpZiAoYXJyYXkuaW5kZXhPZihhbGxvd2VkLCBjb25uVHlwZSkgPCAwKSB7XG4gICAgICAgIGtsYXNzLmlzVXNhYmxlKGRpc3BhdGNoZXIsIGNvbm5FbmRwb2ludCwgZnVuY3Rpb24oKSB7fSk7XG4gICAgICAgIHJldHVybiByZXN1bWUoKTtcbiAgICAgIH1cblxuICAgICAga2xhc3MuaXNVc2FibGUoZGlzcGF0Y2hlciwgY29ubkVuZHBvaW50LCBmdW5jdGlvbihpc1VzYWJsZSkge1xuICAgICAgICBpZiAoIWlzVXNhYmxlKSByZXR1cm4gcmVzdW1lKCk7XG4gICAgICAgIHZhciB0cmFuc3BvcnQgPSBrbGFzcy5oYXNPd25Qcm9wZXJ0eSgnY3JlYXRlJykgPyBrbGFzcy5jcmVhdGUoZGlzcGF0Y2hlciwgY29ubkVuZHBvaW50KSA6IG5ldyBrbGFzcyhkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQpO1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRyYW5zcG9ydCk7XG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgYSB1c2FibGUgY29ubmVjdGlvbiB0eXBlIGZvciAnICsgVVJJLnN0cmluZ2lmeShlbmRwb2ludCkpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbih0eXBlLCBrbGFzcykge1xuICAgIHRoaXMuX3RyYW5zcG9ydHMucHVzaChbdHlwZSwga2xhc3NdKTtcbiAgICBrbGFzcy5wcm90b3R5cGUuY29ubmVjdGlvblR5cGUgPSB0eXBlO1xuICB9LFxuXG4gIGdldENvbm5lY3Rpb25UeXBlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFycmF5Lm1hcCh0aGlzLl90cmFuc3BvcnRzLCBmdW5jdGlvbih0KSB7IHJldHVybiB0WzBdIH0pO1xuICB9LFxuXG4gIF90cmFuc3BvcnRzOiBbXVxufSk7XG5cbmV4dGVuZChUcmFuc3BvcnQucHJvdG90eXBlLCBMb2dnaW5nKTtcbmV4dGVuZChUcmFuc3BvcnQucHJvdG90eXBlLCBUaW1lb3V0cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC90cmFuc3BvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUHJvbWlzZSAgID0gcmVxdWlyZSgnLi4vdXRpbC9wcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0aGVuOiBmdW5jdGlvbihjYWxsYmFjaywgZXJyYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMuX3Byb21pc2UpXG4gICAgICB0aGlzLl9wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHNlbGYuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICBzZWxmLl9yZWplY3QgID0gcmVqZWN0O1xuICAgICAgfSk7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlLnRoZW4oY2FsbGJhY2ssIGVycmJhY2spO1xuICB9LFxuXG4gIGNhbGxiYWNrOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24odmFsdWUpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSkgfSk7XG4gIH0sXG5cbiAgZXJyYmFjazogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIGZ1bmN0aW9uKHJlYXNvbikgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHJlYXNvbikgfSk7XG4gIH0sXG5cbiAgdGltZW91dDogZnVuY3Rpb24oc2Vjb25kcywgbWVzc2FnZSkge1xuICAgIHRoaXMudGhlbigpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90aW1lciA9IGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5fcmVqZWN0KG1lc3NhZ2UpO1xuICAgIH0sIHNlY29uZHMgKiAxMDAwKTtcbiAgfSxcblxuICBzZXREZWZlcnJlZFN0YXR1czogZnVuY3Rpb24oc3RhdHVzLCB2YWx1ZSkge1xuICAgIGlmICh0aGlzLl90aW1lcikgZ2xvYmFsLmNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG5cbiAgICB0aGlzLnRoZW4oKTtcblxuICAgIGlmIChzdGF0dXMgPT09ICdzdWNjZWVkZWQnKVxuICAgICAgdGhpcy5fcmVzb2x2ZSh2YWx1ZSk7XG4gICAgZWxzZSBpZiAoc3RhdHVzID09PSAnZmFpbGVkJylcbiAgICAgIHRoaXMuX3JlamVjdCh2YWx1ZSk7XG4gICAgZWxzZVxuICAgICAgZGVsZXRlIHRoaXMuX3Byb21pc2U7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvbWl4aW5zL2RlZmVycmFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9KU09OID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyk7XG5cbnZhciBMb2dnaW5nID0ge1xuICBMT0dfTEVWRUxTOiB7XG4gICAgZmF0YWw6ICA0LFxuICAgIGVycm9yOiAgMyxcbiAgICB3YXJuOiAgIDIsXG4gICAgaW5mbzogICAxLFxuICAgIGRlYnVnOiAgMFxuICB9LFxuXG4gIHdyaXRlTG9nOiBmdW5jdGlvbihtZXNzYWdlQXJncywgbGV2ZWwpIHtcbiAgICB2YXIgbG9nZ2VyID0gTG9nZ2luZy5sb2dnZXIgfHwgKExvZ2dpbmcud3JhcHBlciB8fCBMb2dnaW5nKS5sb2dnZXI7XG4gICAgaWYgKCFsb2dnZXIpIHJldHVybjtcblxuICAgIHZhciBhcmdzICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobWVzc2FnZUFyZ3MpLFxuICAgICAgICBiYW5uZXIgPSAnW0ZheWUnLFxuICAgICAgICBrbGFzcyAgPSB0aGlzLmNsYXNzTmFtZSxcblxuICAgICAgICBtZXNzYWdlID0gYXJncy5zaGlmdCgpLnJlcGxhY2UoL1xcPy9nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHRvSlNPTihhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1tPYmplY3RdJztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgaWYgKGtsYXNzKSBiYW5uZXIgKz0gJy4nICsga2xhc3M7XG4gICAgYmFubmVyICs9ICddICc7XG5cbiAgICBpZiAodHlwZW9mIGxvZ2dlcltsZXZlbF0gPT09ICdmdW5jdGlvbicpXG4gICAgICBsb2dnZXJbbGV2ZWxdKGJhbm5lciArIG1lc3NhZ2UpO1xuICAgIGVsc2UgaWYgKHR5cGVvZiBsb2dnZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICBsb2dnZXIoYmFubmVyICsgbWVzc2FnZSk7XG4gIH1cbn07XG5cbmZvciAodmFyIGtleSBpbiBMb2dnaW5nLkxPR19MRVZFTFMpXG4gIChmdW5jdGlvbihsZXZlbCkge1xuICAgIExvZ2dpbmdbbGV2ZWxdID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLndyaXRlTG9nKGFyZ3VtZW50cywgbGV2ZWwpO1xuICAgIH07XG4gIH0pKGtleSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nZ2luZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9taXhpbnMvbG9nZ2luZy5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8vIGh0dHA6Ly9hc3NhbmthLm5ldC9jb250ZW50L3RlY2gvMjAwOS8wOS8wMi9qc29uMi1qcy12cy1wcm90b3R5cGUvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gKHRoaXNba2V5XSBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXNba2V5XSA6IHZhbHVlO1xuICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC90b19qc29uLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbnZhciBQRU5ESU5HICAgPSAwLFxuICAgIEZVTEZJTExFRCA9IDEsXG4gICAgUkVKRUNURUQgID0gMjtcblxudmFyIFJFVFVSTiA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggfSxcbiAgICBUSFJPVyAgPSBmdW5jdGlvbih4KSB7IHRocm93ICB4IH07XG5cbnZhciBQcm9taXNlID0gZnVuY3Rpb24odGFzaykge1xuICB0aGlzLl9zdGF0ZSAgICAgICA9IFBFTkRJTkc7XG4gIHRoaXMuX29uRnVsZmlsbGVkID0gW107XG4gIHRoaXMuX29uUmVqZWN0ZWQgID0gW107XG5cbiAgaWYgKHR5cGVvZiB0YXNrICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0YXNrKGZ1bmN0aW9uKHZhbHVlKSAgeyByZXNvbHZlKHNlbGYsIHZhbHVlKSB9LFxuICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3Qoc2VsZiwgcmVhc29uKSB9KTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgbmV4dCA9IG5ldyBQcm9taXNlKCk7XG4gIHJlZ2lzdGVyT25GdWxmaWxsZWQodGhpcywgb25GdWxmaWxsZWQsIG5leHQpO1xuICByZWdpc3Rlck9uUmVqZWN0ZWQodGhpcywgb25SZWplY3RlZCwgbmV4dCk7XG4gIHJldHVybiBuZXh0O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbihvblJlamVjdGVkKSB7XG4gIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuXG52YXIgcmVnaXN0ZXJPbkZ1bGZpbGxlZCA9IGZ1bmN0aW9uKHByb21pc2UsIG9uRnVsZmlsbGVkLCBuZXh0KSB7XG4gIGlmICh0eXBlb2Ygb25GdWxmaWxsZWQgIT09ICdmdW5jdGlvbicpIG9uRnVsZmlsbGVkID0gUkVUVVJOO1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKHZhbHVlKSB7IGludm9rZShvbkZ1bGZpbGxlZCwgdmFsdWUsIG5leHQpIH07XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgcHJvbWlzZS5fb25GdWxmaWxsZWQucHVzaChoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgaGFuZGxlcihwcm9taXNlLl92YWx1ZSk7XG4gIH1cbn07XG5cbnZhciByZWdpc3Rlck9uUmVqZWN0ZWQgPSBmdW5jdGlvbihwcm9taXNlLCBvblJlamVjdGVkLCBuZXh0KSB7XG4gIGlmICh0eXBlb2Ygb25SZWplY3RlZCAhPT0gJ2Z1bmN0aW9uJykgb25SZWplY3RlZCA9IFRIUk9XO1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKHJlYXNvbikgeyBpbnZva2Uob25SZWplY3RlZCwgcmVhc29uLCBuZXh0KSB9O1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHByb21pc2UuX29uUmVqZWN0ZWQucHVzaChoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBoYW5kbGVyKHByb21pc2UuX3JlYXNvbik7XG4gIH1cbn07XG5cbnZhciBpbnZva2UgPSBmdW5jdGlvbihmbiwgdmFsdWUsIG5leHQpIHtcbiAgYXNhcChmdW5jdGlvbigpIHsgX2ludm9rZShmbiwgdmFsdWUsIG5leHQpIH0pO1xufTtcblxudmFyIF9pbnZva2UgPSBmdW5jdGlvbihmbiwgdmFsdWUsIG5leHQpIHtcbiAgdmFyIG91dGNvbWU7XG5cbiAgdHJ5IHtcbiAgICBvdXRjb21lID0gZm4odmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiByZWplY3QobmV4dCwgZXJyb3IpO1xuICB9XG5cbiAgaWYgKG91dGNvbWUgPT09IG5leHQpIHtcbiAgICByZWplY3QobmV4dCwgbmV3IFR5cGVFcnJvcignUmVjdXJzaXZlIHByb21pc2UgY2hhaW4gZGV0ZWN0ZWQnKSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZShuZXh0LCBvdXRjb21lKTtcbiAgfVxufTtcblxudmFyIHJlc29sdmUgPSBmdW5jdGlvbihwcm9taXNlLCB2YWx1ZSkge1xuICB2YXIgY2FsbGVkID0gZmFsc2UsIHR5cGUsIHRoZW47XG5cbiAgdHJ5IHtcbiAgICB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICAgIHRoZW4gPSB2YWx1ZSAhPT0gbnVsbCAmJiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JykgJiYgdmFsdWUudGhlbjtcblxuICAgIGlmICh0eXBlb2YgdGhlbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuXG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICBpZiAoIShjYWxsZWQgXiAoY2FsbGVkID0gdHJ1ZSkpKSByZXR1cm47XG4gICAgICByZXNvbHZlKHByb21pc2UsIHYpO1xuICAgIH0sIGZ1bmN0aW9uKHIpIHtcbiAgICAgIGlmICghKGNhbGxlZCBeIChjYWxsZWQgPSB0cnVlKSkpIHJldHVybjtcbiAgICAgIHJlamVjdChwcm9taXNlLCByKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIShjYWxsZWQgXiAoY2FsbGVkID0gdHJ1ZSkpKSByZXR1cm47XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgfVxufTtcblxudmFyIGZ1bGZpbGwgPSBmdW5jdGlvbihwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHJldHVybjtcblxuICBwcm9taXNlLl9zdGF0ZSAgICAgID0gRlVMRklMTEVEO1xuICBwcm9taXNlLl92YWx1ZSAgICAgID0gdmFsdWU7XG4gIHByb21pc2UuX29uUmVqZWN0ZWQgPSBbXTtcblxuICB2YXIgb25GdWxmaWxsZWQgPSBwcm9taXNlLl9vbkZ1bGZpbGxlZCwgZm47XG4gIHdoaWxlIChmbiA9IG9uRnVsZmlsbGVkLnNoaWZ0KCkpIGZuKHZhbHVlKTtcbn07XG5cbnZhciByZWplY3QgPSBmdW5jdGlvbihwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSByZXR1cm47XG5cbiAgcHJvbWlzZS5fc3RhdGUgICAgICAgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVhc29uICAgICAgPSByZWFzb247XG4gIHByb21pc2UuX29uRnVsZmlsbGVkID0gW107XG5cbiAgdmFyIG9uUmVqZWN0ZWQgPSBwcm9taXNlLl9vblJlamVjdGVkLCBmbjtcbiAgd2hpbGUgKGZuID0gb25SZWplY3RlZC5zaGlmdCgpKSBmbihyZWFzb24pO1xufTtcblxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZXNvbHZlKHZhbHVlKSB9KTtcbn07XG5cblByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVqZWN0KHJlYXNvbikgfSk7XG59O1xuXG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uKHByb21pc2VzKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgbGlzdCA9IFtdLCBuID0gcHJvbWlzZXMubGVuZ3RoLCBpO1xuXG4gICAgaWYgKG4gPT09IDApIHJldHVybiByZXNvbHZlKGxpc3QpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgKGZ1bmN0aW9uKHByb21pc2UsIGkpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGxpc3RbaV0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKC0tbiA9PT0gMCkgcmVzb2x2ZShsaXN0KTtcbiAgICAgIH0sIHJlamVjdCk7XG4gICAgfSkocHJvbWlzZXNbaV0sIGkpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uKHByb21pc2VzKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IHByb21pc2VzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgIFByb21pc2UucmVzb2x2ZShwcm9taXNlc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICB9KTtcbn07XG5cblByb21pc2UuZGVmZXJyZWQgPSBQcm9taXNlLnBlbmRpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHR1cGxlID0ge307XG5cbiAgdHVwbGUucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHR1cGxlLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIHR1cGxlLnJlamVjdCAgPSByZWplY3Q7XG4gIH0pO1xuICByZXR1cm4gdHVwbGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9wcm9taXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vdXRpbC9ldmVudF9lbWl0dGVyJyk7XG5cbnZhciBQdWJsaXNoZXIgPSB7XG4gIGNvdW50TGlzdGVuZXJzOiBmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMoZXZlbnRUeXBlKS5sZW5ndGg7XG4gIH0sXG5cbiAgYmluZDogZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgY29udGV4dCkge1xuICAgIHZhciBzbGljZSAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGxpc3RlbmVyLmFwcGx5KGNvbnRleHQsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgfTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyB8fCBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChbZXZlbnRUeXBlLCBsaXN0ZW5lciwgY29udGV4dCwgaGFuZGxlcl0pO1xuICAgIHJldHVybiB0aGlzLm9uKGV2ZW50VHlwZSwgaGFuZGxlcik7XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzIHx8IFtdO1xuICAgIHZhciBuID0gdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCwgdHVwbGU7XG5cbiAgICB3aGlsZSAobi0tKSB7XG4gICAgICB0dXBsZSA9IHRoaXMuX2xpc3RlbmVyc1tuXTtcbiAgICAgIGlmICh0dXBsZVswXSAhPT0gZXZlbnRUeXBlKSBjb250aW51ZTtcbiAgICAgIGlmIChsaXN0ZW5lciAmJiAodHVwbGVbMV0gIT09IGxpc3RlbmVyIHx8IHR1cGxlWzJdICE9PSBjb250ZXh0KSkgY29udGludWU7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKG4sIDEpO1xuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudFR5cGUsIHR1cGxlWzNdKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4dGVuZChQdWJsaXNoZXIsIEV2ZW50RW1pdHRlci5wcm90b3R5cGUpO1xuUHVibGlzaGVyLnRyaWdnZXIgPSBQdWJsaXNoZXIuZW1pdDtcblxubW9kdWxlLmV4cG9ydHMgPSBQdWJsaXNoZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvbWl4aW5zL3B1Ymxpc2hlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb21tb25FbGVtZW50OiBmdW5jdGlvbihsaXN0YSwgbGlzdGIpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxpc3RhLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKHRoaXMuaW5kZXhPZihsaXN0YiwgbGlzdGFbaV0pICE9PSAtMSlcbiAgICAgICAgcmV0dXJuIGxpc3RhW2ldO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBpbmRleE9mOiBmdW5jdGlvbihsaXN0LCBuZWVkbGUpIHtcbiAgICBpZiAobGlzdC5pbmRleE9mKSByZXR1cm4gbGlzdC5pbmRleE9mKG5lZWRsZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxpc3QubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbmVlZGxlKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9LFxuXG4gIG1hcDogZnVuY3Rpb24ob2JqZWN0LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChvYmplY3QubWFwKSByZXR1cm4gb2JqZWN0Lm1hcChjYWxsYmFjaywgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IG9iamVjdC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG51bGwsIG9iamVjdFtpXSwgaSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgICByZXN1bHQucHVzaChjYWxsYmFjay5jYWxsKGNvbnRleHQgfHwgbnVsbCwga2V5LCBvYmplY3Rba2V5XSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIGZpbHRlcjogZnVuY3Rpb24oYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKGFycmF5LmZpbHRlcikgcmV0dXJuIGFycmF5LmZpbHRlcihjYWxsYmFjaywgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG51bGwsIGFycmF5W2ldLCBpKSlcbiAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIGFzeW5jRWFjaDogZnVuY3Rpb24obGlzdCwgaXRlcmF0b3IsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIG4gICAgICAgPSBsaXN0Lmxlbmd0aCxcbiAgICAgICAgaSAgICAgICA9IC0xLFxuICAgICAgICBjYWxscyAgID0gMCxcbiAgICAgICAgbG9vcGluZyA9IGZhbHNlO1xuXG4gICAgdmFyIGl0ZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxzIC09IDE7XG4gICAgICBpICs9IDE7XG4gICAgICBpZiAoaSA9PT0gbikgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICBpdGVyYXRvcihsaXN0W2ldLCByZXN1bWUpO1xuICAgIH07XG5cbiAgICB2YXIgbG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGxvb3BpbmcpIHJldHVybjtcbiAgICAgIGxvb3BpbmcgPSB0cnVlO1xuICAgICAgd2hpbGUgKGNhbGxzID4gMCkgaXRlcmF0ZSgpO1xuICAgICAgbG9vcGluZyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgcmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBjYWxscyArPSAxO1xuICAgICAgbG9vcCgpO1xuICAgIH07XG4gICAgcmVzdW1lKCk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9hcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnQgPSB7XG4gIF9yZWdpc3RyeTogW10sXG5cbiAgb246IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQpIH07XG5cbiAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcHBlZCwgZmFsc2UpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgd3JhcHBlZCk7XG5cbiAgICB0aGlzLl9yZWdpc3RyeS5wdXNoKHtcbiAgICAgIF9lbGVtZW50OiAgIGVsZW1lbnQsXG4gICAgICBfdHlwZTogICAgICBldmVudE5hbWUsXG4gICAgICBfY2FsbGJhY2s6ICBjYWxsYmFjayxcbiAgICAgIF9jb250ZXh0OiAgICAgY29udGV4dCxcbiAgICAgIF9oYW5kbGVyOiAgIHdyYXBwZWRcbiAgICB9KTtcbiAgfSxcblxuICBkZXRhY2g6IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaSA9IHRoaXMuX3JlZ2lzdHJ5Lmxlbmd0aCwgcmVnaXN0ZXI7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcmVnaXN0ZXIgPSB0aGlzLl9yZWdpc3RyeVtpXTtcblxuICAgICAgaWYgKChlbGVtZW50ICAgICYmIGVsZW1lbnQgICAgIT09IHJlZ2lzdGVyLl9lbGVtZW50KSAgfHxcbiAgICAgICAgICAoZXZlbnROYW1lICAmJiBldmVudE5hbWUgICE9PSByZWdpc3Rlci5fdHlwZSkgICAgIHx8XG4gICAgICAgICAgKGNhbGxiYWNrICAgJiYgY2FsbGJhY2sgICAhPT0gcmVnaXN0ZXIuX2NhbGxiYWNrKSB8fFxuICAgICAgICAgIChjb250ZXh0ICAgICYmIGNvbnRleHQgICAgIT09IHJlZ2lzdGVyLl9jb250ZXh0KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChyZWdpc3Rlci5fZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKVxuICAgICAgICByZWdpc3Rlci5fZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHJlZ2lzdGVyLl90eXBlLCByZWdpc3Rlci5faGFuZGxlciwgZmFsc2UpO1xuICAgICAgZWxzZVxuICAgICAgICByZWdpc3Rlci5fZWxlbWVudC5kZXRhY2hFdmVudCgnb24nICsgcmVnaXN0ZXIuX3R5cGUsIHJlZ2lzdGVyLl9oYW5kbGVyKTtcblxuICAgICAgdGhpcy5fcmVnaXN0cnkuc3BsaWNlKGksMSk7XG4gICAgICByZWdpc3RlciA9IG51bGw7XG4gICAgfVxuICB9XG59O1xuXG5pZiAoZ2xvYmFsLm9udW5sb2FkICE9PSB1bmRlZmluZWQpXG4gIEV2ZW50Lm9uKGdsb2JhbCwgJ3VubG9hZCcsIEV2ZW50LmRldGFjaCwgRXZlbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRXZlbnQ6IEV2ZW50XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvYnJvd3Nlci9ldmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29weU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY2xvbmUsIGksIGtleTtcbiAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgY2xvbmUgPSBbXTtcbiAgICBpID0gb2JqZWN0Lmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSBjbG9uZVtpXSA9IGNvcHlPYmplY3Qob2JqZWN0W2ldKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICBjbG9uZSA9IChvYmplY3QgPT09IG51bGwpID8gbnVsbCA6IHt9O1xuICAgIGZvciAoa2V5IGluIG9iamVjdCkgY2xvbmVba2V5XSA9IGNvcHlPYmplY3Qob2JqZWN0W2tleV0pO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9jb3B5X29iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJhd0FzYXAgcHJvdmlkZXMgZXZlcnl0aGluZyB3ZSBuZWVkIGV4Y2VwdCBleGNlcHRpb24gbWFuYWdlbWVudC5cbnZhciByYXdBc2FwID0gcmVxdWlyZShcIi4vcmF3XCIpO1xuLy8gUmF3VGFza3MgYXJlIHJlY3ljbGVkIHRvIHJlZHVjZSBHQyBjaHVybi5cbnZhciBmcmVlVGFza3MgPSBbXTtcbi8vIFdlIHF1ZXVlIGVycm9ycyB0byBlbnN1cmUgdGhleSBhcmUgdGhyb3duIGluIHJpZ2h0IG9yZGVyIChGSUZPKS5cbi8vIEFycmF5LWFzLXF1ZXVlIGlzIGdvb2QgZW5vdWdoIGhlcmUsIHNpbmNlIHdlIGFyZSBqdXN0IGRlYWxpbmcgd2l0aCBleGNlcHRpb25zLlxudmFyIHBlbmRpbmdFcnJvcnMgPSBbXTtcbnZhciByZXF1ZXN0RXJyb3JUaHJvdyA9IHJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKHRocm93Rmlyc3RFcnJvcik7XG5cbmZ1bmN0aW9uIHRocm93Rmlyc3RFcnJvcigpIHtcbiAgICBpZiAocGVuZGluZ0Vycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgcGVuZGluZ0Vycm9ycy5zaGlmdCgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDYWxscyBhIHRhc2sgYXMgc29vbiBhcyBwb3NzaWJsZSBhZnRlciByZXR1cm5pbmcsIGluIGl0cyBvd24gZXZlbnQsIHdpdGggcHJpb3JpdHlcbiAqIG92ZXIgb3RoZXIgZXZlbnRzIGxpa2UgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZXBhaW50LiBBbiBlcnJvciB0aHJvd24gZnJvbSBhblxuICogZXZlbnQgd2lsbCBub3QgaW50ZXJydXB0LCBub3IgZXZlbiBzdWJzdGFudGlhbGx5IHNsb3cgZG93biB0aGUgcHJvY2Vzc2luZyBvZlxuICogb3RoZXIgZXZlbnRzLCBidXQgd2lsbCBiZSByYXRoZXIgcG9zdHBvbmVkIHRvIGEgbG93ZXIgcHJpb3JpdHkgZXZlbnQuXG4gKiBAcGFyYW0ge3tjYWxsfX0gdGFzayBBIGNhbGxhYmxlIG9iamVjdCwgdHlwaWNhbGx5IGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuICogYXJndW1lbnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFzYXA7XG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgICB2YXIgcmF3VGFzaztcbiAgICBpZiAoZnJlZVRhc2tzLmxlbmd0aCkge1xuICAgICAgICByYXdUYXNrID0gZnJlZVRhc2tzLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJhd1Rhc2sgPSBuZXcgUmF3VGFzaygpO1xuICAgIH1cbiAgICByYXdUYXNrLnRhc2sgPSB0YXNrO1xuICAgIHJhd0FzYXAocmF3VGFzayk7XG59XG5cbi8vIFdlIHdyYXAgdGFza3Mgd2l0aCByZWN5Y2xhYmxlIHRhc2sgb2JqZWN0cy4gIEEgdGFzayBvYmplY3QgaW1wbGVtZW50c1xuLy8gYGNhbGxgLCBqdXN0IGxpa2UgYSBmdW5jdGlvbi5cbmZ1bmN0aW9uIFJhd1Rhc2soKSB7XG4gICAgdGhpcy50YXNrID0gbnVsbDtcbn1cblxuLy8gVGhlIHNvbGUgcHVycG9zZSBvZiB3cmFwcGluZyB0aGUgdGFzayBpcyB0byBjYXRjaCB0aGUgZXhjZXB0aW9uIGFuZCByZWN5Y2xlXG4vLyB0aGUgdGFzayBvYmplY3QgYWZ0ZXIgaXRzIHNpbmdsZSB1c2UuXG5SYXdUYXNrLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIHRoaXMudGFzay5jYWxsKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGFzYXAub25lcnJvcikge1xuICAgICAgICAgICAgLy8gVGhpcyBob29rIGV4aXN0cyBwdXJlbHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICAgICAgICAgICAvLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXRcbiAgICAgICAgICAgIC8vIGRlcGVuZHMgb24gaXRzIGV4aXN0ZW5jZS5cbiAgICAgICAgICAgIGFzYXAub25lcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJbiBhIHdlYiBicm93c2VyLCBleGNlcHRpb25zIGFyZSBub3QgZmF0YWwuIEhvd2V2ZXIsIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBzbG93aW5nIGRvd24gdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGFza3MsIHdlIHJldGhyb3cgdGhlIGVycm9yIGluIGFcbiAgICAgICAgICAgIC8vIGxvd2VyIHByaW9yaXR5IHR1cm4uXG4gICAgICAgICAgICBwZW5kaW5nRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgcmVxdWVzdEVycm9yVGhyb3coKTtcbiAgICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMudGFzayA9IG51bGw7XG4gICAgICAgIGZyZWVUYXNrc1tmcmVlVGFza3MubGVuZ3RoXSA9IHRoaXM7XG4gICAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hc2FwL2Jyb3dzZXItYXNhcC5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIGV4dGVuZCAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgUHVibGlzaGVyID0gcmVxdWlyZSgnLi4vbWl4aW5zL3B1Ymxpc2hlcicpLFxuICAgIEdyYW1tYXIgICA9IHJlcXVpcmUoJy4vZ3JhbW1hcicpO1xuXG52YXIgQ2hhbm5lbCA9IENsYXNzKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMuaWQgPSB0aGlzLm5hbWUgPSBuYW1lO1xuICB9LFxuXG4gIHB1c2g6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB0aGlzLnRyaWdnZXIoJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgfSxcblxuICBpc1VudXNlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnRMaXN0ZW5lcnMoJ21lc3NhZ2UnKSA9PT0gMDtcbiAgfVxufSk7XG5cbmV4dGVuZChDaGFubmVsLnByb3RvdHlwZSwgUHVibGlzaGVyKTtcblxuZXh0ZW5kKENoYW5uZWwsIHtcbiAgSEFORFNIQUtFOiAgICAnL21ldGEvaGFuZHNoYWtlJyxcbiAgQ09OTkVDVDogICAgICAnL21ldGEvY29ubmVjdCcsXG4gIFNVQlNDUklCRTogICAgJy9tZXRhL3N1YnNjcmliZScsXG4gIFVOU1VCU0NSSUJFOiAgJy9tZXRhL3Vuc3Vic2NyaWJlJyxcbiAgRElTQ09OTkVDVDogICAnL21ldGEvZGlzY29ubmVjdCcsXG5cbiAgTUVUQTogICAgICAgICAnbWV0YScsXG4gIFNFUlZJQ0U6ICAgICAgJ3NlcnZpY2UnLFxuXG4gIGV4cGFuZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzZWdtZW50cyA9IHRoaXMucGFyc2UobmFtZSksXG4gICAgICAgIGNoYW5uZWxzID0gWycvKionLCBuYW1lXTtcblxuICAgIHZhciBjb3B5ID0gc2VnbWVudHMuc2xpY2UoKTtcbiAgICBjb3B5W2NvcHkubGVuZ3RoIC0gMV0gPSAnKic7XG4gICAgY2hhbm5lbHMucHVzaCh0aGlzLnVucGFyc2UoY29weSkpO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIG4gPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGNvcHkgPSBzZWdtZW50cy5zbGljZSgwLCBpKTtcbiAgICAgIGNvcHkucHVzaCgnKionKTtcbiAgICAgIGNoYW5uZWxzLnB1c2godGhpcy51bnBhcnNlKGNvcHkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbm5lbHM7XG4gIH0sXG5cbiAgaXNWYWxpZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBHcmFtbWFyLkNIQU5ORUxfTkFNRS50ZXN0KG5hbWUpIHx8XG4gICAgICAgICAgIEdyYW1tYXIuQ0hBTk5FTF9QQVRURVJOLnRlc3QobmFtZSk7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZChuYW1lKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5hbWUuc3BsaXQoJy8nKS5zbGljZSgxKTtcbiAgfSxcblxuICB1bnBhcnNlOiBmdW5jdGlvbihzZWdtZW50cykge1xuICAgIHJldHVybiAnLycgKyBzZWdtZW50cy5qb2luKCcvJyk7XG4gIH0sXG5cbiAgaXNNZXRhOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHNlZ21lbnRzID0gdGhpcy5wYXJzZShuYW1lKTtcbiAgICByZXR1cm4gc2VnbWVudHMgPyAoc2VnbWVudHNbMF0gPT09IHRoaXMuTUVUQSkgOiBudWxsO1xuICB9LFxuXG4gIGlzU2VydmljZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzZWdtZW50cyA9IHRoaXMucGFyc2UobmFtZSk7XG4gICAgcmV0dXJuIHNlZ21lbnRzID8gKHNlZ21lbnRzWzBdID09PSB0aGlzLlNFUlZJQ0UpIDogbnVsbDtcbiAgfSxcblxuICBpc1N1YnNjcmliYWJsZTogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKG5hbWUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gIXRoaXMuaXNNZXRhKG5hbWUpICYmICF0aGlzLmlzU2VydmljZShuYW1lKTtcbiAgfSxcblxuICBTZXQ6IENsYXNzKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxzID0ge307XG4gICAgfSxcblxuICAgIGdldEtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9jaGFubmVscykga2V5cy5wdXNoKGtleSk7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbbmFtZV07XG4gICAgfSxcblxuICAgIGhhc1N1YnNjcmlwdGlvbjogZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzLmhhc093blByb3BlcnR5KG5hbWUpO1xuICAgIH0sXG5cbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uKG5hbWVzLCBzdWJzY3JpcHRpb24pIHtcbiAgICAgIHZhciBuYW1lO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBuYW1lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICB2YXIgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW25hbWVdID0gdGhpcy5fY2hhbm5lbHNbbmFtZV0gfHwgbmV3IENoYW5uZWwobmFtZSk7XG4gICAgICAgIGNoYW5uZWwuYmluZCgnbWVzc2FnZScsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihuYW1lLCBzdWJzY3JpcHRpb24pIHtcbiAgICAgIHZhciBjaGFubmVsID0gdGhpcy5fY2hhbm5lbHNbbmFtZV07XG4gICAgICBpZiAoIWNoYW5uZWwpIHJldHVybiBmYWxzZTtcbiAgICAgIGNoYW5uZWwudW5iaW5kKCdtZXNzYWdlJywgc3Vic2NyaXB0aW9uKTtcblxuICAgICAgaWYgKGNoYW5uZWwuaXNVbnVzZWQoKSkge1xuICAgICAgICB0aGlzLnJlbW92ZShuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRpc3RyaWJ1dGVNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICB2YXIgY2hhbm5lbHMgPSBDaGFubmVsLmV4cGFuZChtZXNzYWdlLmNoYW5uZWwpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNoYW5uZWxzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxzW2ldXTtcbiAgICAgICAgaWYgKGNoYW5uZWwpIGNoYW5uZWwudHJpZ2dlcignbWVzc2FnZScsIG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYW5uZWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2hhbm5lbC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0hBTk5FTF9OQU1FOiAgICAgL15cXC8oKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCkpKSsoXFwvKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApKSkrKSokLyxcbiAgQ0hBTk5FTF9QQVRURVJOOiAgL14oXFwvKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApKSkrKSpcXC9cXCp7MSwyfSQvLFxuICBFUlJPUjogICAgICAgICAgICAvXihbMC05XVswLTldWzAtOV06KCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSooLCgoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKXwgfFxcL3xcXCp8XFwuKSkqKSo6KCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSp8WzAtOV1bMC05XVswLTldOjooKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCl8IHxcXC98XFwqfFxcLikpKikkLyxcbiAgVkVSU0lPTjogICAgICAgICAgL14oWzAtOV0pKyhcXC4oKFthLXpdfFtBLVpdKXxbMC05XSkoKCgoW2Etel18W0EtWl0pfFswLTldKXxcXC18XFxfKSkqKSokL1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9ncmFtbWFyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpO1xuXG52YXIgU2NoZWR1bGVyID0gZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucykge1xuICB0aGlzLm1lc3NhZ2UgID0gbWVzc2FnZTtcbiAgdGhpcy5vcHRpb25zICA9IG9wdGlvbnM7XG4gIHRoaXMuYXR0ZW1wdHMgPSAwO1xufTtcblxuZXh0ZW5kKFNjaGVkdWxlci5wcm90b3R5cGUsIHtcbiAgZ2V0VGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50aW1lb3V0O1xuICB9LFxuXG4gIGdldEludGVydmFsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmludGVydmFsO1xuICB9LFxuXG4gIGlzRGVsaXZlcmFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdHRlbXB0cyA9IHRoaXMub3B0aW9ucy5hdHRlbXB0cyxcbiAgICAgICAgbWFkZSAgICAgPSB0aGlzLmF0dGVtcHRzLFxuICAgICAgICBkZWFkbGluZSA9IHRoaXMub3B0aW9ucy5kZWFkbGluZSxcbiAgICAgICAgbm93ICAgICAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmIChhdHRlbXB0cyAhPT0gdW5kZWZpbmVkICYmIG1hZGUgPj0gYXR0ZW1wdHMpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoZGVhZGxpbmUgIT09IHVuZGVmaW5lZCAmJiBub3cgPiBkZWFkbGluZSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXR0ZW1wdHMgKz0gMTtcbiAgfSxcblxuICBzdWNjZWVkOiBmdW5jdGlvbigpIHt9LFxuXG4gIGZhaWw6IGZ1bmN0aW9uKCkge30sXG5cbiAgYWJvcnQ6IGZ1bmN0aW9uKCkge31cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9zY2hlZHVsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGJyb3dzZXIgICA9IHJlcXVpcmUoJy4uL3V0aWwvYnJvd3NlcicpLFxuICAgIGV4dGVuZCAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdG9KU09OICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIFhIUiA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiB0b0pTT04obWVzc2FnZXMpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIGhyZWYgPSB0aGlzLmVuZHBvaW50LmhyZWYsXG4gICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICB4aHI7XG5cbiAgICAvLyBQcmVmZXIgWE1MSHR0cFJlcXVlc3Qgb3ZlciBBY3RpdmVYT2JqZWN0IGlmIHRoZXkgYm90aCBleGlzdFxuICAgIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLkFjdGl2ZVhPYmplY3QpIHtcbiAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH1cblxuICAgIHhoci5vcGVuKCdQT1NUJywgaHJlZiwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1ByYWdtYScsICduby1jYWNoZScpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG5cbiAgICB2YXIgaGVhZGVycyA9IHRoaXMuX2Rpc3BhdGNoZXIuaGVhZGVycztcbiAgICBmb3IgKHZhciBrZXkgaW4gaGVhZGVycykge1xuICAgICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgIH1cblxuICAgIHZhciBhYm9ydCA9IGZ1bmN0aW9uKCkgeyB4aHIuYWJvcnQoKSB9O1xuICAgIGlmIChnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgICAgIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgYWJvcnQpO1xuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF4aHIgfHwgeGhyLnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcblxuICAgICAgdmFyIHJlcGxpZXMgICAgPSBudWxsLFxuICAgICAgICAgIHN0YXR1cyAgICAgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHRleHQgICAgICAgPSB4aHIucmVzcG9uc2VUZXh0LFxuICAgICAgICAgIHN1Y2Nlc3NmdWwgPSAoc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDApIHx8IHN0YXR1cyA9PT0gMzA0IHx8IHN0YXR1cyA9PT0gMTIyMztcblxuICAgICAgaWYgKGdsb2JhbC5vbmJlZm9yZXVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBicm93c2VyLkV2ZW50LmRldGFjaChnbG9iYWwsICdiZWZvcmV1bmxvYWQnLCBhYm9ydCk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgeGhyID0gbnVsbDtcblxuICAgICAgaWYgKCFzdWNjZXNzZnVsKSByZXR1cm4gc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXBsaWVzID0gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBpZiAocmVwbGllcylcbiAgICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH07XG5cbiAgICB4aHIuc2VuZCh0aGlzLmVuY29kZShtZXNzYWdlcykpO1xuICAgIHJldHVybiB4aHI7XG4gIH1cbn0pLCB7XG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgdXNhYmxlID0gKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKVxuICAgICAgICAgICAgICB8fCBVUkkuaXNTYW1lT3JpZ2luKGVuZHBvaW50KTtcblxuICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdXNhYmxlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gWEhSO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC94aHIuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBWRVJTSU9OOiAgICAgICAgICAnMS4yLjQnLFxuXG4gIEJBWUVVWF9WRVJTSU9OOiAgICcxLjAnLFxuICBJRF9MRU5HVEg6ICAgICAgICAxNjAsXG4gIEpTT05QX0NBTExCQUNLOiAgICdqc29ucGNhbGxiYWNrJyxcbiAgQ09OTkVDVElPTl9UWVBFUzogWydsb25nLXBvbGxpbmcnLCAnY3Jvc3Mtb3JpZ2luLWxvbmctcG9sbGluZycsICdjYWxsYmFjay1wb2xsaW5nJywgJ3dlYnNvY2tldCcsICdldmVudHNvdXJjZScsICdpbi1wcm9jZXNzJ10sXG5cbiAgTUFOREFUT1JZX0NPTk5FQ1RJT05fVFlQRVM6IFsnbG9uZy1wb2xsaW5nJywgJ2NhbGxiYWNrLXBvbGxpbmcnLCAnaW4tcHJvY2VzcyddXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvY29uc3RhbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge307XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC9jb29raWVzL2Jyb3dzZXJfY29va2llcy5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgPSByZXF1aXJlKCcuL2NsYXNzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9pbmRleCA9IHt9O1xuICB9LFxuXG4gIGFkZDogZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBrZXkgPSAoaXRlbS5pZCAhPT0gdW5kZWZpbmVkKSA/IGl0ZW0uaWQgOiBpdGVtO1xuICAgIGlmICh0aGlzLl9pbmRleC5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5faW5kZXhba2V5XSA9IGl0ZW07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZm9yRWFjaDogZnVuY3Rpb24oYmxvY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5faW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLl9pbmRleC5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICBibG9jay5jYWxsKGNvbnRleHQsIHRoaXMuX2luZGV4W2tleV0pO1xuICAgIH1cbiAgfSxcblxuICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5faW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLl9pbmRleC5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIG1lbWJlcjogZnVuY3Rpb24oaXRlbSkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9pbmRleCkge1xuICAgICAgaWYgKHRoaXMuX2luZGV4W2tleV0gPT09IGl0ZW0pIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGtleSA9IChpdGVtLmlkICE9PSB1bmRlZmluZWQpID8gaXRlbS5pZCA6IGl0ZW07XG4gICAgdmFyIHJlbW92ZWQgPSB0aGlzLl9pbmRleFtrZXldO1xuICAgIGRlbGV0ZSB0aGlzLl9pbmRleFtrZXldO1xuICAgIHJldHVybiByZW1vdmVkO1xuICB9LFxuXG4gIHRvQXJyYXk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IGFycmF5LnB1c2goaXRlbSkgfSk7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy91dGlsL3NldC5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi91dGlsL2NvbnN0YW50cycpLFxuICAgIExvZ2dpbmcgICA9IHJlcXVpcmUoJy4vbWl4aW5zL2xvZ2dpbmcnKTtcblxudmFyIEZheWUgPSB7XG4gIFZFUlNJT046ICAgIGNvbnN0YW50cy5WRVJTSU9OLFxuXG4gIENsaWVudDogICAgIHJlcXVpcmUoJy4vcHJvdG9jb2wvY2xpZW50JyksXG4gIFNjaGVkdWxlcjogIHJlcXVpcmUoJy4vcHJvdG9jb2wvc2NoZWR1bGVyJylcbn07XG5cbkxvZ2dpbmcud3JhcHBlciA9IEZheWU7XG5cbm1vZHVsZS5leHBvcnRzID0gRmF5ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9mYXllX2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBFcXVpdmFsZW50IHRvIHB1c2gsIGJ1dCBhdm9pZHMgYSBmdW5jdGlvbiBjYWxsLlxuICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xufVxuXG52YXIgcXVldWUgPSBbXTtcbi8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG4vLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcbi8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuLy8gdGhlIGV2ZW50IHF1ZXVlIGJlZm9yZSB5aWVsZGluZyB0byB0aGUgYnJvd3NlcidzIG93biBldmVudCBsb29wLlxudmFyIHJlcXVlc3RGbHVzaDtcbi8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG52YXIgaW5kZXggPSAwO1xuLy8gSWYgYSB0YXNrIHNjaGVkdWxlcyBhZGRpdGlvbmFsIHRhc2tzIHJlY3Vyc2l2ZWx5LCB0aGUgdGFzayBxdWV1ZSBjYW4gZ3Jvd1xuLy8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuLy8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG52YXIgY2FwYWNpdHkgPSAxMDI0O1xuXG4vLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG4gICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG4gICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG4gICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG4gICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG4gICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuICAgICAgICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG4gICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgaW5kZXggPSAwO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuLy8gU2FmYXJpIDYgYW5kIDYuMSBmb3IgZGVza3RvcCwgaVBhZCwgYW5kIGlQaG9uZSBhcmUgdGhlIG9ubHkgYnJvd3NlcnMgdGhhdFxuLy8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cbi8vIE11c3QgdXNlIGBnbG9iYWxgIG9yIGBzZWxmYCBpbnN0ZWFkIG9mIGB3aW5kb3dgIHRvIHdvcmsgaW4gYm90aCBmcmFtZXMgYW5kIHdlYlxuLy8gd29ya2Vycy4gYGdsb2JhbGAgaXMgYSBwcm92aXNpb24gb2YgQnJvd3NlcmlmeSwgTXIsIE1ycywgb3IgTW9wLlxuXG4vKiBnbG9iYWxzIHNlbGYgKi9cbnZhciBzY29wZSA9IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiBzZWxmO1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gc2NvcGUuTXV0YXRpb25PYnNlcnZlciB8fCBzY29wZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4vLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcbmlmICh0eXBlb2YgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuLy8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuLy8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG4vLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4vLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuLy8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcbi8vIG5vdCBoYXZlIE11dGF0aW9uT2JzZXJ2ZXJzLlxuLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuLy8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuLy8gdGhlIG1pbmltdW0gNG1zIHBlbmFsdHkuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbi8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG4vLyBNZXNzYWdlQ2hhbm5lbCB1c2VsZXNzIGZvciB0aGUgcHVycG9zZXMgb2YgQVNBUC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cbi8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4vLyBXZSBmYWxsIGJhY2sgdG8gdGltZXJzIGluIHdvcmtlcnMgaW4gbW9zdCBlbmdpbmVzLCBhbmQgaW4gZm9yZWdyb3VuZFxuLy8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cbi8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbi8vIGJyb2FkIHNwZWN0cnVtIG9mIGJyb3dzZXJzLlxuLy9cbi8vIC0gRmlyZWZveCAzLTEzXG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDYtOVxuLy8gLSBpUGFkIFNhZmFyaSA0LjNcbi8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCByZXF1ZXN0cyB0aGF0IHRoZSBoaWdoIHByaW9yaXR5IGV2ZW50IHF1ZXVlIGJlIGZsdXNoZWQgYXNcbi8vIHNvb24gYXMgcG9zc2libGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcbi8vIHF1ZXVlIGlmIHRoZSBleGNlcHRpb24gaGFuZGxlZCBieSBOb2RlLmpz4oCZc1xuLy8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5yYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuLy8gVG8gcmVxdWVzdCBhIGhpZ2ggcHJpb3JpdHkgZXZlbnQsIHdlIGluZHVjZSBhIG11dGF0aW9uIG9ic2VydmVyIGJ5IHRvZ2dsaW5nXG4vLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHZhciB0b2dnbGUgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuICAgICAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gICAgfTtcbn1cblxuLy8gVGhlIG1lc3NhZ2UgY2hhbm5lbCB0ZWNobmlxdWUgd2FzIGRpc2NvdmVyZWQgYnkgTWFsdGUgVWJsIGFuZCB3YXMgdGhlXG4vLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG4vLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG4vLyBTYWZhcmkgNi4wLjUgKGF0IGxlYXN0KSBpbnRlcm1pdHRlbnRseSBmYWlscyB0byBjcmVhdGUgbWVzc2FnZSBwb3J0cyBvbiBhXG4vLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuLy8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcbi8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuLy8gRXZlbiBpZiB3ZSB3ZXJlLCB0aGVyZSBpcyBhbm90aGVyIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMC5cbi8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG4vLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuLy8gY2xvc3VyZS5cbi8vIE5ldmVyIGZvcmdldC5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG4vLyBgc2V0VGltZW91dGAgZG9lcyBub3QgY2FsbCB0aGUgcGFzc2VkIGNhbGxiYWNrIGlmIHRoZSBkZWxheSBpcyBsZXNzIHRoYW5cbi8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcbi8vIGV2ZW4gdGhlbi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAgICAgLy8gY2FuIHJlbGlhYmx5IGFjY29tbW9kYXRlIHRoYXQgcmVxdWVzdC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgc25hcHBlZFxuICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcbiAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVUaW1lciwgMCk7XG4gICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuICAgICAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxucmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cbi8vIEFTQVAgd2FzIG9yaWdpbmFsbHkgYSBuZXh0VGljayBzaGltIGluY2x1ZGVkIGluIFEuIFRoaXMgd2FzIGZhY3RvcmVkIG91dFxuLy8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcbi8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuLy8gdG8gY2FwdHVyZSB0aGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiBpbiBhIGNsb3N1cmUsIHdlcmUgaW50ZWdyYXRlZFxuLy8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FzYXAvYnJvd3Nlci1yYXcuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZFRpbWVvdXQ6IGZ1bmN0aW9uKG5hbWUsIGRlbGF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuX3RpbWVvdXRzID0gdGhpcy5fdGltZW91dHMgfHwge307XG4gICAgaWYgKHRoaXMuX3RpbWVvdXRzLmhhc093blByb3BlcnR5KG5hbWUpKSByZXR1cm47XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3RpbWVvdXRzW25hbWVdID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBkZWxldGUgc2VsZi5fdGltZW91dHNbbmFtZV07XG4gICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xuICAgIH0sIDEwMDAgKiBkZWxheSk7XG4gIH0sXG5cbiAgcmVtb3ZlVGltZW91dDogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMuX3RpbWVvdXRzID0gdGhpcy5fdGltZW91dHMgfHwge307XG4gICAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0c1tuYW1lXTtcbiAgICBpZiAoIXRpbWVvdXQpIHJldHVybjtcbiAgICBnbG9iYWwuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGRlbGV0ZSB0aGlzLl90aW1lb3V0c1tuYW1lXTtcbiAgfSxcblxuICByZW1vdmVBbGxUaW1lb3V0czogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fdGltZW91dHMgPSB0aGlzLl90aW1lb3V0cyB8fCB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMuX3RpbWVvdXRzKSB0aGlzLnJlbW92ZVRpbWVvdXQobmFtZSk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvbWl4aW5zL3RpbWVvdXRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc2FwICAgICAgICAgICAgPSByZXF1aXJlKCdhc2FwJyksXG4gICAgQ2xhc3MgICAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFByb21pc2UgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvcHJvbWlzZScpLFxuICAgIFVSSSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgYXJyYXkgICAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9hcnJheScpLFxuICAgIGJyb3dzZXIgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYnJvd3NlcicpLFxuICAgIGNvbnN0YW50cyAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY29uc3RhbnRzJyksXG4gICAgZXh0ZW5kICAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL3ZhbGlkYXRlX29wdGlvbnMnKSxcbiAgICBEZWZlcnJhYmxlICAgICAgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpLFxuICAgIExvZ2dpbmcgICAgICAgICA9IHJlcXVpcmUoJy4uL21peGlucy9sb2dnaW5nJyksXG4gICAgUHVibGlzaGVyICAgICAgID0gcmVxdWlyZSgnLi4vbWl4aW5zL3B1Ymxpc2hlcicpLFxuICAgIENoYW5uZWwgICAgICAgICA9IHJlcXVpcmUoJy4vY2hhbm5lbCcpLFxuICAgIERpc3BhdGNoZXIgICAgICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpLFxuICAgIEVycm9yICAgICAgICAgICA9IHJlcXVpcmUoJy4vZXJyb3InKSxcbiAgICBFeHRlbnNpYmxlICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2libGUnKSxcbiAgICBQdWJsaWNhdGlvbiAgICAgPSByZXF1aXJlKCcuL3B1YmxpY2F0aW9uJyksXG4gICAgU3Vic2NyaXB0aW9uICAgID0gcmVxdWlyZSgnLi9zdWJzY3JpcHRpb24nKTtcblxudmFyIENsaWVudCA9IENsYXNzKHsgY2xhc3NOYW1lOiAnQ2xpZW50JyxcbiAgVU5DT05ORUNURUQ6ICAgICAgICAxLFxuICBDT05ORUNUSU5HOiAgICAgICAgIDIsXG4gIENPTk5FQ1RFRDogICAgICAgICAgMyxcbiAgRElTQ09OTkVDVEVEOiAgICAgICA0LFxuXG4gIEhBTkRTSEFLRTogICAgICAgICAgJ2hhbmRzaGFrZScsXG4gIFJFVFJZOiAgICAgICAgICAgICAgJ3JldHJ5JyxcbiAgTk9ORTogICAgICAgICAgICAgICAnbm9uZScsXG5cbiAgQ09OTkVDVElPTl9USU1FT1VUOiA2MCxcblxuICBERUZBVUxUX0VORFBPSU5UOiAgICcvYmF5ZXV4JyxcbiAgSU5URVJWQUw6ICAgICAgICAgICAwLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbmZvKCdOZXcgY2xpZW50IGNyZWF0ZWQgZm9yID8nLCBlbmRwb2ludCk7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucywgWydpbnRlcnZhbCcsICd0aW1lb3V0JywgJ2VuZHBvaW50cycsICdwcm94eScsICdyZXRyeScsICdzY2hlZHVsZXInLCAnd2Vic29ja2V0RXh0ZW5zaW9ucycsICd0bHMnLCAnY2EnXSk7XG5cbiAgICB0aGlzLl9jaGFubmVscyAgID0gbmV3IENoYW5uZWwuU2V0KCk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlciA9IERpc3BhdGNoZXIuY3JlYXRlKHRoaXMsIGVuZHBvaW50IHx8IHRoaXMuREVGQVVMVF9FTkRQT0lOVCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIHRoaXMuX3N0YXRlICAgICA9IHRoaXMuVU5DT05ORUNURUQ7XG5cbiAgICB0aGlzLl9yZXNwb25zZUNhbGxiYWNrcyA9IHt9O1xuXG4gICAgdGhpcy5fYWR2aWNlID0ge1xuICAgICAgcmVjb25uZWN0OiB0aGlzLlJFVFJZLFxuICAgICAgaW50ZXJ2YWw6ICAxMDAwICogKG9wdGlvbnMuaW50ZXJ2YWwgfHwgdGhpcy5JTlRFUlZBTCksXG4gICAgICB0aW1lb3V0OiAgIDEwMDAgKiAob3B0aW9ucy50aW1lb3V0ICB8fCB0aGlzLkNPTk5FQ1RJT05fVElNRU9VVClcbiAgICB9O1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIudGltZW91dCA9IHRoaXMuX2FkdmljZS50aW1lb3V0IC8gMTAwMDtcblxuICAgIHRoaXMuX2Rpc3BhdGNoZXIuYmluZCgnbWVzc2FnZScsIHRoaXMuX3JlY2VpdmVNZXNzYWdlLCB0aGlzKTtcblxuICAgIGlmIChicm93c2VyLkV2ZW50ICYmIGdsb2JhbC5vbmJlZm9yZXVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgYnJvd3Nlci5FdmVudC5vbihnbG9iYWwsICdiZWZvcmV1bmxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGFycmF5LmluZGV4T2YodGhpcy5fZGlzcGF0Y2hlci5fZGlzYWJsZWQsICdhdXRvZGlzY29ubmVjdCcpIDwgMClcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIGFkZFdlYnNvY2tldEV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXIuYWRkV2Vic29ja2V0RXh0ZW5zaW9uKGV4dGVuc2lvbik7XG4gIH0sXG5cbiAgZGlzYWJsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyLmRpc2FibGUoZmVhdHVyZSk7XG4gIH0sXG5cbiAgc2V0SGVhZGVyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyLnNldEhlYWRlcihuYW1lLCB2YWx1ZSk7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdFxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiB2ZXJzaW9uXG4gIC8vICAgICAgICAgICAgICAgICogc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogbWluaW11bVZlcnNpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgKiBpZFxuICAvL1xuICAvLyBTdWNjZXNzIFJlc3BvbnNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGYWlsZWQgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogdmVyc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyAgICAgICAgICAgICAgICAqIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlcyAgICAgICAgICAgICAgICAgICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzXG4gIC8vICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYWR2aWNlXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogbWluaW11bVZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIGFkdmljZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIG1pbmltdW1WZXJzaW9uXG4gIC8vICAgICAgICAgICAgICAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgKiBhdXRoU3VjY2Vzc2Z1bFxuICBoYW5kc2hha2U6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuX2FkdmljZS5yZWNvbm5lY3QgPT09IHRoaXMuTk9ORSkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gdGhpcy5VTkNPTk5FQ1RFRCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLkNPTk5FQ1RJTkc7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5pbmZvKCdJbml0aWF0aW5nIGhhbmRzaGFrZSB3aXRoID8nLCBVUkkuc3RyaW5naWZ5KHRoaXMuX2Rpc3BhdGNoZXIuZW5kcG9pbnQpKTtcbiAgICB0aGlzLl9kaXNwYXRjaGVyLnNlbGVjdFRyYW5zcG9ydChjb25zdGFudHMuTUFOREFUT1JZX0NPTk5FQ1RJT05fVFlQRVMpO1xuXG4gICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgY2hhbm5lbDogICAgICAgICAgICAgICAgICBDaGFubmVsLkhBTkRTSEFLRSxcbiAgICAgIHZlcnNpb246ICAgICAgICAgICAgICAgICAgY29uc3RhbnRzLkJBWUVVWF9WRVJTSU9OLFxuICAgICAgc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzOiB0aGlzLl9kaXNwYXRjaGVyLmdldENvbm5lY3Rpb25UeXBlcygpXG5cbiAgICB9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3NmdWwpIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLkNPTk5FQ1RFRDtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCAgPSByZXNwb25zZS5jbGllbnRJZDtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLnNlbGVjdFRyYW5zcG9ydChyZXNwb25zZS5zdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXMpO1xuXG4gICAgICAgIHRoaXMuaW5mbygnSGFuZHNoYWtlIHN1Y2Nlc3NmdWw6ID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcblxuICAgICAgICB0aGlzLnN1YnNjcmliZSh0aGlzLl9jaGFubmVscy5nZXRLZXlzKCksIHRydWUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIGFzYXAoZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCkgfSk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW5mbygnSGFuZHNoYWtlIHVuc3VjY2Vzc2Z1bCcpO1xuICAgICAgICBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2VsZi5oYW5kc2hha2UoY2FsbGJhY2ssIGNvbnRleHQpIH0sIHRoaXMuX2Rpc3BhdGNoZXIucmV0cnkgKiAxMDAwKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLlVOQ09OTkVDVEVEO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjb25uZWN0aW9uVHlwZSAgICAgICAgICAgICAgICAgICAgICogY2xpZW50SWRcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBleHQgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYWR2aWNlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB0aW1lc3RhbXBcbiAgY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAodGhpcy5fYWR2aWNlLnJlY29ubmVjdCA9PT0gdGhpcy5OT05FKSByZXR1cm47XG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLkRJU0NPTk5FQ1RFRCkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLlVOQ09OTkVDVEVEKVxuICAgICAgcmV0dXJuIHRoaXMuaGFuZHNoYWtlKGZ1bmN0aW9uKCkgeyB0aGlzLmNvbm5lY3QoY2FsbGJhY2ssIGNvbnRleHQpIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5jYWxsYmFjayhjYWxsYmFjaywgY29udGV4dCk7XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSB0aGlzLkNPTk5FQ1RFRCkgcmV0dXJuO1xuXG4gICAgdGhpcy5pbmZvKCdDYWxsaW5nIGRlZmVycmVkIGFjdGlvbnMgZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB0aGlzLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICB0aGlzLnNldERlZmVycmVkU3RhdHVzKCd1bmtub3duJyk7XG5cbiAgICBpZiAodGhpcy5fY29ubmVjdFJlcXVlc3QpIHJldHVybjtcbiAgICB0aGlzLl9jb25uZWN0UmVxdWVzdCA9IHRydWU7XG5cbiAgICB0aGlzLmluZm8oJ0luaXRpYXRpbmcgY29ubmVjdGlvbiBmb3IgPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuXG4gICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgY2hhbm5lbDogICAgICAgIENoYW5uZWwuQ09OTkVDVCxcbiAgICAgIGNsaWVudElkOiAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLFxuICAgICAgY29ubmVjdGlvblR5cGU6IHRoaXMuX2Rpc3BhdGNoZXIuY29ubmVjdGlvblR5cGVcblxuICAgIH0sIHt9LCB0aGlzLl9jeWNsZUNvbm5lY3Rpb24sIHRoaXMpO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogY2xpZW50SWRcbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gdGhpcy5DT05ORUNURUQpIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuRElTQ09OTkVDVEVEO1xuXG4gICAgdGhpcy5pbmZvKCdEaXNjb25uZWN0aW5nID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQdWJsaWNhdGlvbigpO1xuXG4gICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgY2hhbm5lbDogIENoYW5uZWwuRElTQ09OTkVDVCxcbiAgICAgIGNsaWVudElkOiB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkXG5cbiAgICB9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzZnVsKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xvc2UoKTtcbiAgICAgICAgcHJvbWlzZS5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnLCBFcnJvci5wYXJzZShyZXNwb25zZS5lcnJvcikpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5pbmZvKCdDbGVhcmluZyBjaGFubmVsIGxpc3RlbmVycyBmb3IgPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuICAgIHRoaXMuX2NoYW5uZWxzID0gbmV3IENoYW5uZWwuU2V0KCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vICAgICAgICAgICAgICAgICogc3Vic2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1YnNjcmlwdGlvblxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhZHZpY2VcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHRpbWVzdGFtcFxuICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGNoYW5uZWwsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKGNoYW5uZWwgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgIHJldHVybiBhcnJheS5tYXAoY2hhbm5lbCwgZnVuY3Rpb24oYykge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmUoYywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih0aGlzLCBjaGFubmVsLCBjYWxsYmFjaywgY29udGV4dCksXG4gICAgICAgIGZvcmNlICAgICAgICA9IChjYWxsYmFjayA9PT0gdHJ1ZSksXG4gICAgICAgIGhhc1N1YnNjcmliZSA9IHRoaXMuX2NoYW5uZWxzLmhhc1N1YnNjcmlwdGlvbihjaGFubmVsKTtcblxuICAgIGlmIChoYXNTdWJzY3JpYmUgJiYgIWZvcmNlKSB7XG4gICAgICB0aGlzLl9jaGFubmVscy5zdWJzY3JpYmUoW2NoYW5uZWxdLCBzdWJzY3JpcHRpb24pO1xuICAgICAgc3Vic2NyaXB0aW9uLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbmZvKCdDbGllbnQgPyBhdHRlbXB0aW5nIHRvIHN1YnNjcmliZSB0byA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbCk7XG4gICAgICBpZiAoIWZvcmNlKSB0aGlzLl9jaGFubmVscy5zdWJzY3JpYmUoW2NoYW5uZWxdLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICAgIGNoYW5uZWw6ICAgICAgQ2hhbm5lbC5TVUJTQ1JJQkUsXG4gICAgICAgIGNsaWVudElkOiAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCxcbiAgICAgICAgc3Vic2NyaXB0aW9uOiBjaGFubmVsXG5cbiAgICAgIH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3NmdWwpIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcsIEVycm9yLnBhcnNlKHJlc3BvbnNlLmVycm9yKSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzLnVuc3Vic2NyaWJlKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hhbm5lbHMgPSBbXS5jb25jYXQocmVzcG9uc2Uuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5pbmZvKCdTdWJzY3JpcHRpb24gYWNrbm93bGVkZ2VkIGZvciA/IHRvID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVscyk7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyAgICAgICAgICAgICAgICAqIHN1YnNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAgICAgKiBjbGllbnRJZFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYWR2aWNlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB0aW1lc3RhbXBcbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKGNoYW5uZWwsIHN1YnNjcmlwdGlvbikge1xuICAgIGlmIChjaGFubmVsIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICByZXR1cm4gYXJyYXkubWFwKGNoYW5uZWwsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5zdWJzY3JpYmUoYywgc3Vic2NyaXB0aW9uKTtcbiAgICAgIH0sIHRoaXMpO1xuXG4gICAgdmFyIGRlYWQgPSB0aGlzLl9jaGFubmVscy51bnN1YnNjcmliZShjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgIGlmICghZGVhZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbmZvKCdDbGllbnQgPyBhdHRlbXB0aW5nIHRvIHVuc3Vic2NyaWJlIGZyb20gPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWwpO1xuXG4gICAgICB0aGlzLl9zZW5kTWVzc2FnZSh7XG4gICAgICAgIGNoYW5uZWw6ICAgICAgQ2hhbm5lbC5VTlNVQlNDUklCRSxcbiAgICAgICAgY2xpZW50SWQ6ICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLFxuICAgICAgICBzdWJzY3JpcHRpb246IGNoYW5uZWxcblxuICAgICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghcmVzcG9uc2Uuc3VjY2Vzc2Z1bCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBjaGFubmVscyA9IFtdLmNvbmNhdChyZXNwb25zZS5zdWJzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLmluZm8oJ1Vuc3Vic2NyaXB0aW9uIGFja25vd2xlZGdlZCBmb3IgPyBmcm9tID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVscyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogY2xpZW50SWQgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICBwdWJsaXNoOiBmdW5jdGlvbihjaGFubmVsLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMgfHwge30sIFsnYXR0ZW1wdHMnLCAnZGVhZGxpbmUnXSk7XG4gICAgdmFyIHB1YmxpY2F0aW9uID0gbmV3IFB1YmxpY2F0aW9uKCk7XG5cbiAgICB0aGlzLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmluZm8oJ0NsaWVudCA/IHF1ZXVlaW5nIHB1Ymxpc2hlZCBtZXNzYWdlIHRvID86ID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVsLCBkYXRhKTtcblxuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBjaGFubmVsOiAgY2hhbm5lbCxcbiAgICAgICAgZGF0YTogICAgIGRhdGEsXG4gICAgICAgIGNsaWVudElkOiB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkXG5cbiAgICAgIH0sIG9wdGlvbnMsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzZnVsKVxuICAgICAgICAgIHB1YmxpY2F0aW9uLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHB1YmxpY2F0aW9uLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnLCBFcnJvci5wYXJzZShyZXNwb25zZS5lcnJvcikpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gcHVibGljYXRpb247XG4gIH0sXG5cbiAgX3NlbmRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlLCBvcHRpb25zLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIG1lc3NhZ2UuaWQgPSB0aGlzLl9nZW5lcmF0ZU1lc3NhZ2VJZCgpO1xuXG4gICAgdmFyIHRpbWVvdXQgPSB0aGlzLl9hZHZpY2UudGltZW91dFxuICAgICAgICAgICAgICAgID8gMS4yICogdGhpcy5fYWR2aWNlLnRpbWVvdXQgLyAxMDAwXG4gICAgICAgICAgICAgICAgOiAxLjIgKiB0aGlzLl9kaXNwYXRjaGVyLnJldHJ5O1xuXG4gICAgdGhpcy5waXBlVGhyb3VnaEV4dGVuc2lvbnMoJ291dGdvaW5nJywgbWVzc2FnZSwgbnVsbCwgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKCFtZXNzYWdlKSByZXR1cm47XG4gICAgICBpZiAoY2FsbGJhY2spIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW21lc3NhZ2UuaWRdID0gW2NhbGxiYWNrLCBjb250ZXh0XTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuc2VuZE1lc3NhZ2UobWVzc2FnZSwgdGltZW91dCwgb3B0aW9ucyB8fCB7fSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgX2dlbmVyYXRlTWVzc2FnZUlkOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9tZXNzYWdlSWQgKz0gMTtcbiAgICBpZiAodGhpcy5fbWVzc2FnZUlkID49IE1hdGgucG93KDIsMzIpKSB0aGlzLl9tZXNzYWdlSWQgPSAwO1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlSWQudG9TdHJpbmcoMzYpO1xuICB9LFxuXG4gIF9yZWNlaXZlTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHZhciBpZCA9IG1lc3NhZ2UuaWQsIGNhbGxiYWNrO1xuXG4gICAgaWYgKG1lc3NhZ2Uuc3VjY2Vzc2Z1bCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjayA9IHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW2lkXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tpZF07XG4gICAgfVxuXG4gICAgdGhpcy5waXBlVGhyb3VnaEV4dGVuc2lvbnMoJ2luY29taW5nJywgbWVzc2FnZSwgbnVsbCwgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKCFtZXNzYWdlKSByZXR1cm47XG4gICAgICBpZiAobWVzc2FnZS5hZHZpY2UpIHRoaXMuX2hhbmRsZUFkdmljZShtZXNzYWdlLmFkdmljZSk7XG4gICAgICB0aGlzLl9kZWxpdmVyTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2tbMF0uY2FsbChjYWxsYmFja1sxXSwgbWVzc2FnZSk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgX2hhbmRsZUFkdmljZTogZnVuY3Rpb24oYWR2aWNlKSB7XG4gICAgZXh0ZW5kKHRoaXMuX2FkdmljZSwgYWR2aWNlKTtcbiAgICB0aGlzLl9kaXNwYXRjaGVyLnRpbWVvdXQgPSB0aGlzLl9hZHZpY2UudGltZW91dCAvIDEwMDA7XG5cbiAgICBpZiAodGhpcy5fYWR2aWNlLnJlY29ubmVjdCA9PT0gdGhpcy5IQU5EU0hBS0UgJiYgdGhpcy5fc3RhdGUgIT09IHRoaXMuRElTQ09OTkVDVEVEKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuVU5DT05ORUNURUQ7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkID0gbnVsbDtcbiAgICAgIHRoaXMuX2N5Y2xlQ29ubmVjdGlvbigpO1xuICAgIH1cbiAgfSxcblxuICBfZGVsaXZlck1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBpZiAoIW1lc3NhZ2UuY2hhbm5lbCB8fCBtZXNzYWdlLmRhdGEgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gY2FsbGluZyBsaXN0ZW5lcnMgZm9yID8gd2l0aCA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgbWVzc2FnZS5jaGFubmVsLCBtZXNzYWdlLmRhdGEpO1xuICAgIHRoaXMuX2NoYW5uZWxzLmRpc3RyaWJ1dGVNZXNzYWdlKG1lc3NhZ2UpO1xuICB9LFxuXG4gIF9jeWNsZUNvbm5lY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9jb25uZWN0UmVxdWVzdCkge1xuICAgICAgdGhpcy5fY29ubmVjdFJlcXVlc3QgPSBudWxsO1xuICAgICAgdGhpcy5pbmZvKCdDbG9zZWQgY29ubmVjdGlvbiBmb3IgPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQpO1xuICAgIH1cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNlbGYuY29ubmVjdCgpIH0sIHRoaXMuX2FkdmljZS5pbnRlcnZhbCk7XG4gIH1cbn0pO1xuXG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgRGVmZXJyYWJsZSk7XG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgUHVibGlzaGVyKTtcbmV4dGVuZChDbGllbnQucHJvdG90eXBlLCBMb2dnaW5nKTtcbmV4dGVuZChDbGllbnQucHJvdG90eXBlLCBFeHRlbnNpYmxlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvY2xpZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgVVJJICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBjb29raWVzICAgPSByZXF1aXJlKCcuLi91dGlsL2Nvb2tpZXMnKSxcbiAgICBleHRlbmQgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIExvZ2dpbmcgICA9IHJlcXVpcmUoJy4uL21peGlucy9sb2dnaW5nJyksXG4gICAgUHVibGlzaGVyID0gcmVxdWlyZSgnLi4vbWl4aW5zL3B1Ymxpc2hlcicpLFxuICAgIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4uL3RyYW5zcG9ydCcpLFxuICAgIFNjaGVkdWxlciA9IHJlcXVpcmUoJy4vc2NoZWR1bGVyJyk7XG5cbnZhciBEaXNwYXRjaGVyID0gQ2xhc3MoeyBjbGFzc05hbWU6ICdEaXNwYXRjaGVyJyxcbiAgTUFYX1JFUVVFU1RfU0laRTogMjA0OCxcbiAgREVGQVVMVF9SRVRSWTogICAgNSxcblxuICBVUDogICAxLFxuICBET1dOOiAyLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNsaWVudCwgZW5kcG9pbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9jbGllbnQgICAgID0gY2xpZW50O1xuICAgIHRoaXMuZW5kcG9pbnQgICAgPSBVUkkucGFyc2UoZW5kcG9pbnQpO1xuICAgIHRoaXMuX2FsdGVybmF0ZXMgPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcblxuICAgIHRoaXMuY29va2llcyAgICAgID0gY29va2llcy5Db29raWVKYXIgJiYgbmV3IGNvb2tpZXMuQ29va2llSmFyKCk7XG4gICAgdGhpcy5fZGlzYWJsZWQgICAgPSBbXTtcbiAgICB0aGlzLl9lbnZlbG9wZXMgICA9IHt9O1xuICAgIHRoaXMuaGVhZGVycyAgICAgID0ge307XG4gICAgdGhpcy5yZXRyeSAgICAgICAgPSBvcHRpb25zLnJldHJ5IHx8IHRoaXMuREVGQVVMVF9SRVRSWTtcbiAgICB0aGlzLl9zY2hlZHVsZXIgICA9IG9wdGlvbnMuc2NoZWR1bGVyIHx8IFNjaGVkdWxlcjtcbiAgICB0aGlzLl9zdGF0ZSAgICAgICA9IDA7XG4gICAgdGhpcy50cmFuc3BvcnRzICAgPSB7fTtcbiAgICB0aGlzLndzRXh0ZW5zaW9ucyA9IFtdO1xuXG4gICAgdGhpcy5wcm94eSA9IG9wdGlvbnMucHJveHkgfHwge307XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wcm94eSA9PT0gJ3N0cmluZycpIHRoaXMuX3Byb3h5ID0ge29yaWdpbjogdGhpcy5fcHJveHl9O1xuXG4gICAgdmFyIGV4dHMgPSBvcHRpb25zLndlYnNvY2tldEV4dGVuc2lvbnM7XG4gICAgaWYgKGV4dHMpIHtcbiAgICAgIGV4dHMgPSBbXS5jb25jYXQoZXh0cyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGV4dHMubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgICAgICB0aGlzLmFkZFdlYnNvY2tldEV4dGVuc2lvbihleHRzW2ldKTtcbiAgICB9XG5cbiAgICB0aGlzLnRscyA9IG9wdGlvbnMudGxzIHx8IHt9O1xuICAgIHRoaXMudGxzLmNhID0gdGhpcy50bHMuY2EgfHwgb3B0aW9ucy5jYTtcblxuICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5fYWx0ZXJuYXRlcylcbiAgICAgIHRoaXMuX2FsdGVybmF0ZXNbdHlwZV0gPSBVUkkucGFyc2UodGhpcy5fYWx0ZXJuYXRlc1t0eXBlXSk7XG5cbiAgICB0aGlzLm1heFJlcXVlc3RTaXplID0gdGhpcy5NQVhfUkVRVUVTVF9TSVpFO1xuICB9LFxuXG4gIGVuZHBvaW50Rm9yOiBmdW5jdGlvbihjb25uZWN0aW9uVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9hbHRlcm5hdGVzW2Nvbm5lY3Rpb25UeXBlXSB8fCB0aGlzLmVuZHBvaW50O1xuICB9LFxuXG4gIGFkZFdlYnNvY2tldEV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgdGhpcy53c0V4dGVuc2lvbnMucHVzaChleHRlbnNpb24pO1xuICB9LFxuXG4gIGRpc2FibGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICB0aGlzLl9kaXNhYmxlZC5wdXNoKGZlYXR1cmUpO1xuICB9LFxuXG4gIHNldEhlYWRlcjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLmhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYW5zcG9ydCA9IHRoaXMuX3RyYW5zcG9ydDtcbiAgICBkZWxldGUgdGhpcy5fdHJhbnNwb3J0O1xuICAgIGlmICh0cmFuc3BvcnQpIHRyYW5zcG9ydC5jbG9zZSgpO1xuICB9LFxuXG4gIGdldENvbm5lY3Rpb25UeXBlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFRyYW5zcG9ydC5nZXRDb25uZWN0aW9uVHlwZXMoKTtcbiAgfSxcblxuICBzZWxlY3RUcmFuc3BvcnQ6IGZ1bmN0aW9uKHRyYW5zcG9ydFR5cGVzKSB7XG4gICAgVHJhbnNwb3J0LmdldCh0aGlzLCB0cmFuc3BvcnRUeXBlcywgdGhpcy5fZGlzYWJsZWQsIGZ1bmN0aW9uKHRyYW5zcG9ydCkge1xuICAgICAgdGhpcy5kZWJ1ZygnU2VsZWN0ZWQgPyB0cmFuc3BvcnQgZm9yID8nLCB0cmFuc3BvcnQuY29ubmVjdGlvblR5cGUsIFVSSS5zdHJpbmdpZnkodHJhbnNwb3J0LmVuZHBvaW50KSk7XG5cbiAgICAgIGlmICh0cmFuc3BvcnQgPT09IHRoaXMuX3RyYW5zcG9ydCkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMuX3RyYW5zcG9ydCkgdGhpcy5fdHJhbnNwb3J0LmNsb3NlKCk7XG5cbiAgICAgIHRoaXMuX3RyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgICAgIHRoaXMuY29ubmVjdGlvblR5cGUgPSB0cmFuc3BvcnQuY29ubmVjdGlvblR5cGU7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgc2VuZE1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UsIHRpbWVvdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBpZCAgICAgICA9IG1lc3NhZ2UuaWQsXG4gICAgICAgIGF0dGVtcHRzID0gb3B0aW9ucy5hdHRlbXB0cyxcbiAgICAgICAgZGVhZGxpbmUgPSBvcHRpb25zLmRlYWRsaW5lICYmIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgKG9wdGlvbnMuZGVhZGxpbmUgKiAxMDAwKSxcbiAgICAgICAgZW52ZWxvcGUgPSB0aGlzLl9lbnZlbG9wZXNbaWRdLFxuICAgICAgICBzY2hlZHVsZXI7XG5cbiAgICBpZiAoIWVudmVsb3BlKSB7XG4gICAgICBzY2hlZHVsZXIgPSBuZXcgdGhpcy5fc2NoZWR1bGVyKG1lc3NhZ2UsIHt0aW1lb3V0OiB0aW1lb3V0LCBpbnRlcnZhbDogdGhpcy5yZXRyeSwgYXR0ZW1wdHM6IGF0dGVtcHRzLCBkZWFkbGluZTogZGVhZGxpbmV9KTtcbiAgICAgIGVudmVsb3BlICA9IHRoaXMuX2VudmVsb3Blc1tpZF0gPSB7bWVzc2FnZTogbWVzc2FnZSwgc2NoZWR1bGVyOiBzY2hlZHVsZXJ9O1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRFbnZlbG9wZShlbnZlbG9wZSk7XG4gIH0sXG5cbiAgX3NlbmRFbnZlbG9wZTogZnVuY3Rpb24oZW52ZWxvcGUpIHtcbiAgICBpZiAoIXRoaXMuX3RyYW5zcG9ydCkgcmV0dXJuO1xuICAgIGlmIChlbnZlbG9wZS5yZXF1ZXN0IHx8IGVudmVsb3BlLnRpbWVyKSByZXR1cm47XG5cbiAgICB2YXIgbWVzc2FnZSAgID0gZW52ZWxvcGUubWVzc2FnZSxcbiAgICAgICAgc2NoZWR1bGVyID0gZW52ZWxvcGUuc2NoZWR1bGVyLFxuICAgICAgICBzZWxmICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKCFzY2hlZHVsZXIuaXNEZWxpdmVyYWJsZSgpKSB7XG4gICAgICBzY2hlZHVsZXIuYWJvcnQoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbnZlbG9wZXNbbWVzc2FnZS5pZF07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZW52ZWxvcGUudGltZXIgPSBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuaGFuZGxlRXJyb3IobWVzc2FnZSk7XG4gICAgfSwgc2NoZWR1bGVyLmdldFRpbWVvdXQoKSAqIDEwMDApO1xuXG4gICAgc2NoZWR1bGVyLnNlbmQoKTtcbiAgICBlbnZlbG9wZS5yZXF1ZXN0ID0gdGhpcy5fdHJhbnNwb3J0LnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICB9LFxuXG4gIGhhbmRsZVJlc3BvbnNlOiBmdW5jdGlvbihyZXBseSkge1xuICAgIHZhciBlbnZlbG9wZSA9IHRoaXMuX2VudmVsb3Blc1tyZXBseS5pZF07XG5cbiAgICBpZiAocmVwbHkuc3VjY2Vzc2Z1bCAhPT0gdW5kZWZpbmVkICYmIGVudmVsb3BlKSB7XG4gICAgICBlbnZlbG9wZS5zY2hlZHVsZXIuc3VjY2VlZCgpO1xuICAgICAgZGVsZXRlIHRoaXMuX2VudmVsb3Blc1tyZXBseS5pZF07XG4gICAgICBnbG9iYWwuY2xlYXJUaW1lb3V0KGVudmVsb3BlLnRpbWVyKTtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ21lc3NhZ2UnLCByZXBseSk7XG5cbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHRoaXMuVVApIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuVVA7XG4gICAgdGhpcy5fY2xpZW50LnRyaWdnZXIoJ3RyYW5zcG9ydDp1cCcpO1xuICB9LFxuXG4gIGhhbmRsZUVycm9yOiBmdW5jdGlvbihtZXNzYWdlLCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgZW52ZWxvcGUgPSB0aGlzLl9lbnZlbG9wZXNbbWVzc2FnZS5pZF0sXG4gICAgICAgIHJlcXVlc3QgID0gZW52ZWxvcGUgJiYgZW52ZWxvcGUucmVxdWVzdCxcbiAgICAgICAgc2VsZiAgICAgPSB0aGlzO1xuXG4gICAgaWYgKCFyZXF1ZXN0KSByZXR1cm47XG5cbiAgICByZXF1ZXN0LnRoZW4oZnVuY3Rpb24ocmVxKSB7XG4gICAgICBpZiAocmVxICYmIHJlcS5hYm9ydCkgcmVxLmFib3J0KCk7XG4gICAgfSk7XG5cbiAgICB2YXIgc2NoZWR1bGVyID0gZW52ZWxvcGUuc2NoZWR1bGVyO1xuICAgIHNjaGVkdWxlci5mYWlsKCk7XG5cbiAgICBnbG9iYWwuY2xlYXJUaW1lb3V0KGVudmVsb3BlLnRpbWVyKTtcbiAgICBlbnZlbG9wZS5yZXF1ZXN0ID0gZW52ZWxvcGUudGltZXIgPSBudWxsO1xuXG4gICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgdGhpcy5fc2VuZEVudmVsb3BlKGVudmVsb3BlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW52ZWxvcGUudGltZXIgPSBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZW52ZWxvcGUudGltZXIgPSBudWxsO1xuICAgICAgICBzZWxmLl9zZW5kRW52ZWxvcGUoZW52ZWxvcGUpO1xuICAgICAgfSwgc2NoZWR1bGVyLmdldEludGVydmFsKCkgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IHRoaXMuRE9XTikgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5ET1dOO1xuICAgIHRoaXMuX2NsaWVudC50cmlnZ2VyKCd0cmFuc3BvcnQ6ZG93bicpO1xuICB9XG59KTtcblxuRGlzcGF0Y2hlci5jcmVhdGUgPSBmdW5jdGlvbihjbGllbnQsIGVuZHBvaW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgRGlzcGF0Y2hlcihjbGllbnQsIGVuZHBvaW50LCBvcHRpb25zKTtcbn07XG5cbmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwgUHVibGlzaGVyKTtcbmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwgTG9nZ2luZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGF0Y2hlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9kaXNwYXRjaGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIEdyYW1tYXIgPSByZXF1aXJlKCcuL2dyYW1tYXInKTtcblxudmFyIEVycm9yID0gQ2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbihjb2RlLCBwYXJhbXMsIG1lc3NhZ2UpIHtcbiAgICB0aGlzLmNvZGUgICAgPSBjb2RlO1xuICAgIHRoaXMucGFyYW1zICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHBhcmFtcyk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfSxcblxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZSArICc6JyArXG4gICAgICAgICAgIHRoaXMucGFyYW1zLmpvaW4oJywnKSArICc6JyArXG4gICAgICAgICAgIHRoaXMubWVzc2FnZTtcbiAgfVxufSk7XG5cbkVycm9yLnBhcnNlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnJztcbiAgaWYgKCFHcmFtbWFyLkVSUk9SLnRlc3QobWVzc2FnZSkpIHJldHVybiBuZXcgRXJyb3IobnVsbCwgW10sIG1lc3NhZ2UpO1xuXG4gIHZhciBwYXJ0cyAgID0gbWVzc2FnZS5zcGxpdCgnOicpLFxuICAgICAgY29kZSAgICA9IHBhcnNlSW50KHBhcnRzWzBdKSxcbiAgICAgIHBhcmFtcyAgPSBwYXJ0c1sxXS5zcGxpdCgnLCcpLFxuICAgICAgbWVzc2FnZSA9IHBhcnRzWzJdO1xuXG4gIHJldHVybiBuZXcgRXJyb3IoY29kZSwgcGFyYW1zLCBtZXNzYWdlKTtcbn07XG5cbi8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9jb21ldGQvd2lraS9CYXlldXhDb2Rlc1xudmFyIGVycm9ycyA9IHtcbiAgdmVyc2lvbk1pc21hdGNoOiAgWzMwMCwgJ1ZlcnNpb24gbWlzbWF0Y2gnXSxcbiAgY29ubnR5cGVNaXNtYXRjaDogWzMwMSwgJ0Nvbm5lY3Rpb24gdHlwZXMgbm90IHN1cHBvcnRlZCddLFxuICBleHRNaXNtYXRjaDogICAgICBbMzAyLCAnRXh0ZW5zaW9uIG1pc21hdGNoJ10sXG4gIGJhZFJlcXVlc3Q6ICAgICAgIFs0MDAsICdCYWQgcmVxdWVzdCddLFxuICBjbGllbnRVbmtub3duOiAgICBbNDAxLCAnVW5rbm93biBjbGllbnQnXSxcbiAgcGFyYW1ldGVyTWlzc2luZzogWzQwMiwgJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyJ10sXG4gIGNoYW5uZWxGb3JiaWRkZW46IFs0MDMsICdGb3JiaWRkZW4gY2hhbm5lbCddLFxuICBjaGFubmVsVW5rbm93bjogICBbNDA0LCAnVW5rbm93biBjaGFubmVsJ10sXG4gIGNoYW5uZWxJbnZhbGlkOiAgIFs0MDUsICdJbnZhbGlkIGNoYW5uZWwnXSxcbiAgZXh0VW5rbm93bjogICAgICAgWzQwNiwgJ1Vua25vd24gZXh0ZW5zaW9uJ10sXG4gIHB1Ymxpc2hGYWlsZWQ6ICAgIFs0MDcsICdGYWlsZWQgdG8gcHVibGlzaCddLFxuICBzZXJ2ZXJFcnJvcjogICAgICBbNTAwLCAnSW50ZXJuYWwgc2VydmVyIGVycm9yJ11cbn07XG5cbmZvciAodmFyIG5hbWUgaW4gZXJyb3JzKVxuICAoZnVuY3Rpb24obmFtZSkge1xuICAgIEVycm9yW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGVycm9yc1tuYW1lXVswXSwgYXJndW1lbnRzLCBlcnJvcnNbbmFtZV1bMV0pLnRvU3RyaW5nKCk7XG4gICAgfTtcbiAgfSkobmFtZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXJyb3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvZXJyb3IuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIExvZ2dpbmcgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpO1xuXG52YXIgRXh0ZW5zaWJsZSA9IHtcbiAgYWRkRXh0ZW5zaW9uOiBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICB0aGlzLl9leHRlbnNpb25zID0gdGhpcy5fZXh0ZW5zaW9ucyB8fCBbXTtcbiAgICB0aGlzLl9leHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcbiAgICBpZiAoZXh0ZW5zaW9uLmFkZGVkKSBleHRlbnNpb24uYWRkZWQodGhpcyk7XG4gIH0sXG5cbiAgcmVtb3ZlRXh0ZW5zaW9uOiBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICBpZiAoIXRoaXMuX2V4dGVuc2lvbnMpIHJldHVybjtcbiAgICB2YXIgaSA9IHRoaXMuX2V4dGVuc2lvbnMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmICh0aGlzLl9leHRlbnNpb25zW2ldICE9PSBleHRlbnNpb24pIGNvbnRpbnVlO1xuICAgICAgdGhpcy5fZXh0ZW5zaW9ucy5zcGxpY2UoaSwxKTtcbiAgICAgIGlmIChleHRlbnNpb24ucmVtb3ZlZCkgZXh0ZW5zaW9uLnJlbW92ZWQodGhpcyk7XG4gICAgfVxuICB9LFxuXG4gIHBpcGVUaHJvdWdoRXh0ZW5zaW9uczogZnVuY3Rpb24oc3RhZ2UsIG1lc3NhZ2UsIHJlcXVlc3QsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5kZWJ1ZygnUGFzc2luZyB0aHJvdWdoID8gZXh0ZW5zaW9uczogPycsIHN0YWdlLCBtZXNzYWdlKTtcblxuICAgIGlmICghdGhpcy5fZXh0ZW5zaW9ucykgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgbWVzc2FnZSk7XG4gICAgdmFyIGV4dGVuc2lvbnMgPSB0aGlzLl9leHRlbnNpb25zLnNsaWNlKCk7XG5cbiAgICB2YXIgcGlwZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgbWVzc2FnZSk7XG5cbiAgICAgIHZhciBleHRlbnNpb24gPSBleHRlbnNpb25zLnNoaWZ0KCk7XG4gICAgICBpZiAoIWV4dGVuc2lvbikgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgbWVzc2FnZSk7XG5cbiAgICAgIHZhciBmbiA9IGV4dGVuc2lvbltzdGFnZV07XG4gICAgICBpZiAoIWZuKSByZXR1cm4gcGlwZShtZXNzYWdlKTtcblxuICAgICAgaWYgKGZuLmxlbmd0aCA+PSAzKSBleHRlbnNpb25bc3RhZ2VdKG1lc3NhZ2UsIHJlcXVlc3QsIHBpcGUpO1xuICAgICAgZWxzZSAgICAgICAgICAgICAgICBleHRlbnNpb25bc3RhZ2VdKG1lc3NhZ2UsIHBpcGUpO1xuICAgIH07XG4gICAgcGlwZShtZXNzYWdlKTtcbiAgfVxufTtcblxuZXh0ZW5kKEV4dGVuc2libGUsIExvZ2dpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4dGVuc2libGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvcHJvdG9jb2wvZXh0ZW5zaWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBEZWZlcnJhYmxlID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGFzcyhEZWZlcnJhYmxlKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9wdWJsaWNhdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBleHRlbmQgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBEZWZlcnJhYmxlID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKTtcblxudmFyIFN1YnNjcmlwdGlvbiA9IENsYXNzKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oY2xpZW50LCBjaGFubmVscywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLl9jbGllbnQgICAgPSBjbGllbnQ7XG4gICAgdGhpcy5fY2hhbm5lbHMgID0gY2hhbm5lbHM7XG4gICAgdGhpcy5fY2FsbGJhY2sgID0gY2FsbGJhY2s7XG4gICAgdGhpcy5fY29udGV4dCAgID0gY29udGV4dDtcbiAgICB0aGlzLl9jYW5jZWxsZWQgPSBmYWxzZTtcbiAgfSxcblxuICB3aXRoQ2hhbm5lbDogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLl93aXRoQ2hhbm5lbCA9IFtjYWxsYmFjaywgY29udGV4dF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgYXBwbHk6IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGFyZ3NbMF07XG5cbiAgICBpZiAodGhpcy5fY2FsbGJhY2spXG4gICAgICB0aGlzLl9jYWxsYmFjay5jYWxsKHRoaXMuX2NvbnRleHQsIG1lc3NhZ2UuZGF0YSk7XG5cbiAgICBpZiAodGhpcy5fd2l0aENoYW5uZWwpXG4gICAgICB0aGlzLl93aXRoQ2hhbm5lbFswXS5jYWxsKHRoaXMuX3dpdGhDaGFubmVsWzFdLCBtZXNzYWdlLmNoYW5uZWwsIG1lc3NhZ2UuZGF0YSk7XG4gIH0sXG5cbiAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fY2FuY2VsbGVkKSByZXR1cm47XG4gICAgdGhpcy5fY2xpZW50LnVuc3Vic2NyaWJlKHRoaXMuX2NoYW5uZWxzLCB0aGlzKTtcbiAgICB0aGlzLl9jYW5jZWxsZWQgPSB0cnVlO1xuICB9LFxuXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICB9XG59KTtcblxuZXh0ZW5kKFN1YnNjcmlwdGlvbi5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1YnNjcmlwdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy9wcm90b2NvbC9zdWJzY3JpcHRpb24uanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cblRyYW5zcG9ydC5yZWdpc3Rlcignd2Vic29ja2V0JywgcmVxdWlyZSgnLi93ZWJfc29ja2V0JykpO1xuVHJhbnNwb3J0LnJlZ2lzdGVyKCdldmVudHNvdXJjZScsIHJlcXVpcmUoJy4vZXZlbnRfc291cmNlJykpO1xuVHJhbnNwb3J0LnJlZ2lzdGVyKCdsb25nLXBvbGxpbmcnLCByZXF1aXJlKCcuL3hocicpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignY3Jvc3Mtb3JpZ2luLWxvbmctcG9sbGluZycsIHJlcXVpcmUoJy4vY29ycycpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignY2FsbGJhY2stcG9sbGluZycsIHJlcXVpcmUoJy4vanNvbnAnKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9icm93c2VyX3RyYW5zcG9ydHMuanNcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBTZXQgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3NldCcpLFxuICAgIFVSSSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG52YXIgQ09SUyA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiAnbWVzc2FnZT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRvSlNPTihtZXNzYWdlcykpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIHhockNsYXNzID0gZ2xvYmFsLlhEb21haW5SZXF1ZXN0ID8gWERvbWFpblJlcXVlc3QgOiBYTUxIdHRwUmVxdWVzdCxcbiAgICAgICAgeGhyICAgICAgPSBuZXcgeGhyQ2xhc3MoKSxcbiAgICAgICAgaWQgICAgICAgPSArK0NPUlMuX2lkLFxuICAgICAgICBoZWFkZXJzICA9IHRoaXMuX2Rpc3BhdGNoZXIuaGVhZGVycyxcbiAgICAgICAgc2VsZiAgICAgPSB0aGlzLFxuICAgICAgICBrZXk7XG5cbiAgICB4aHIub3BlbignUE9TVCcsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIHRydWUpO1xuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XG4gICAgICBmb3IgKGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjbGVhblVwID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXhocikgcmV0dXJuIGZhbHNlO1xuICAgICAgQ09SUy5fcGVuZGluZy5yZW1vdmUoaWQpO1xuICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0geGhyLm9udGltZW91dCA9IHhoci5vbnByb2dyZXNzID0gbnVsbDtcbiAgICAgIHhociA9IG51bGw7XG4gICAgfTtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXBsaWVzO1xuICAgICAgdHJ5IHsgcmVwbGllcyA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgIGNsZWFuVXAoKTtcblxuICAgICAgaWYgKHJlcGxpZXMpXG4gICAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhblVwKCk7XG4gICAgICBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIGlmICh4aHJDbGFzcyA9PT0gZ2xvYmFsLlhEb21haW5SZXF1ZXN0KVxuICAgICAgQ09SUy5fcGVuZGluZy5hZGQoe2lkOiBpZCwgeGhyOiB4aHJ9KTtcblxuICAgIHhoci5zZW5kKHRoaXMuZW5jb2RlKG1lc3NhZ2VzKSk7XG4gICAgcmV0dXJuIHhocjtcbiAgfVxufSksIHtcbiAgX2lkOiAgICAgIDAsXG4gIF9wZW5kaW5nOiBuZXcgU2V0KCksXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChVUkkuaXNTYW1lT3JpZ2luKGVuZHBvaW50KSlcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcblxuICAgIGlmIChnbG9iYWwuWERvbWFpblJlcXVlc3QpXG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBlbmRwb2ludC5wcm90b2NvbCA9PT0gbG9jYXRpb24ucHJvdG9jb2wpO1xuXG4gICAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdCkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgeGhyLndpdGhDcmVkZW50aWFscyAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDT1JTO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3RyYW5zcG9ydC9jb3JzLmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFVSSSAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuLi91dGlsL2NvcHlfb2JqZWN0JyksXG4gICAgZXh0ZW5kICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyksXG4gICAgVHJhbnNwb3J0ICA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0JyksXG4gICAgWEhSICAgICAgICA9IHJlcXVpcmUoJy4veGhyJyk7XG5cbnZhciBFdmVudFNvdXJjZSA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQpIHtcbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBkaXNwYXRjaGVyLCBlbmRwb2ludCk7XG4gICAgaWYgKCFnbG9iYWwuRXZlbnRTb3VyY2UpIHJldHVybiB0aGlzLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcblxuICAgIHRoaXMuX3hociA9IG5ldyBYSFIoZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuXG4gICAgZW5kcG9pbnQgPSBjb3B5T2JqZWN0KGVuZHBvaW50KTtcbiAgICBlbmRwb2ludC5wYXRobmFtZSArPSAnLycgKyBkaXNwYXRjaGVyLmNsaWVudElkO1xuXG4gICAgdmFyIHNvY2tldCA9IG5ldyBnbG9iYWwuRXZlbnRTb3VyY2UoVVJJLnN0cmluZ2lmeShlbmRwb2ludCkpLFxuICAgICAgICBzZWxmICAgPSB0aGlzO1xuXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5fZXZlckNvbm5lY3RlZCA9IHRydWU7XG4gICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnKTtcbiAgICB9O1xuXG4gICAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzZWxmLl9ldmVyQ29ubmVjdGVkKSB7XG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKFtdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcpO1xuICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgcmVwbGllcztcbiAgICAgIHRyeSB7IHJlcGxpZXMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBpZiAocmVwbGllcylcbiAgICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IoW10pO1xuICAgIH07XG5cbiAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSByZXR1cm47XG4gICAgdGhpcy5fc29ja2V0Lm9ub3BlbiA9IHRoaXMuX3NvY2tldC5vbmVycm9yID0gdGhpcy5fc29ja2V0Lm9ubWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4gICAgZGVsZXRlIHRoaXMuX3NvY2tldDtcbiAgfSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLmNhbGxiYWNrKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRydWUpIH0pO1xuICAgIHRoaXMuZXJyYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSkgfSk7XG4gIH0sXG5cbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiB0aGlzLl94aHIuZW5jb2RlKG1lc3NhZ2VzKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiB0aGlzLl94aHIucmVxdWVzdChtZXNzYWdlcyk7XG4gIH1cblxufSksIHtcbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBpZCA9IGRpc3BhdGNoZXIuY2xpZW50SWQ7XG4gICAgaWYgKCFpZCkgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuXG4gICAgWEhSLmlzVXNhYmxlKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBmdW5jdGlvbih1c2FibGUpIHtcbiAgICAgIGlmICghdXNhYmxlKSByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSk7XG4gICAgICB0aGlzLmNyZWF0ZShkaXNwYXRjaGVyLCBlbmRwb2ludCkuaXNVc2FibGUoY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQpIHtcbiAgICB2YXIgc29ja2V0cyA9IGRpc3BhdGNoZXIudHJhbnNwb3J0cy5ldmVudHNvdXJjZSA9IGRpc3BhdGNoZXIudHJhbnNwb3J0cy5ldmVudHNvdXJjZSB8fCB7fSxcbiAgICAgICAgaWQgICAgICA9IGRpc3BhdGNoZXIuY2xpZW50SWQ7XG5cbiAgICB2YXIgdXJsID0gY29weU9iamVjdChlbmRwb2ludCk7XG4gICAgdXJsLnBhdGhuYW1lICs9ICcvJyArIChpZCB8fCAnJyk7XG4gICAgdXJsID0gVVJJLnN0cmluZ2lmeSh1cmwpO1xuXG4gICAgc29ja2V0c1t1cmxdID0gc29ja2V0c1t1cmxdIHx8IG5ldyB0aGlzKGRpc3BhdGNoZXIsIGVuZHBvaW50KTtcbiAgICByZXR1cm4gc29ja2V0c1t1cmxdO1xuICB9XG59KTtcblxuZXh0ZW5kKEV2ZW50U291cmNlLnByb3RvdHlwZSwgRGVmZXJyYWJsZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRTb3VyY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2V2ZW50X3NvdXJjZS5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbC9jb3B5X29iamVjdCcpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHRvSlNPTiAgICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICBUcmFuc3BvcnQgID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIEpTT05QID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB2YXIgdXJsID0gY29weU9iamVjdCh0aGlzLmVuZHBvaW50KTtcbiAgICB1cmwucXVlcnkubWVzc2FnZSA9IHRvSlNPTihtZXNzYWdlcyk7XG4gICAgdXJsLnF1ZXJ5Lmpzb25wICAgPSAnX19qc29ucCcgKyBKU09OUC5fY2JDb3VudCArICdfXyc7XG4gICAgcmV0dXJuIFVSSS5zdHJpbmdpZnkodXJsKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHZhciBoZWFkICAgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICBzY3JpcHQgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcbiAgICAgICAgY2FsbGJhY2tOYW1lID0gSlNPTlAuZ2V0Q2FsbGJhY2tOYW1lKCksXG4gICAgICAgIGVuZHBvaW50ICAgICA9IGNvcHlPYmplY3QodGhpcy5lbmRwb2ludCksXG4gICAgICAgIHNlbGYgICAgICAgICA9IHRoaXM7XG5cbiAgICBlbmRwb2ludC5xdWVyeS5tZXNzYWdlID0gdG9KU09OKG1lc3NhZ2VzKTtcbiAgICBlbmRwb2ludC5xdWVyeS5qc29ucCAgID0gY2FsbGJhY2tOYW1lO1xuXG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghZ2xvYmFsW2NhbGxiYWNrTmFtZV0pIHJldHVybiBmYWxzZTtcbiAgICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgdHJ5IHsgZGVsZXRlIGdsb2JhbFtjYWxsYmFja05hbWVdIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihyZXBsaWVzKSB7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgIH07XG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIHNjcmlwdC5zcmMgID0gVVJJLnN0cmluZ2lmeShlbmRwb2ludCk7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG4gICAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHthYm9ydDogY2xlYW51cH07XG4gIH1cbn0pLCB7XG4gIF9jYkNvdW50OiAwLFxuXG4gIGdldENhbGxiYWNrTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY2JDb3VudCArPSAxO1xuICAgIHJldHVybiAnX19qc29ucCcgKyB0aGlzLl9jYkNvdW50ICsgJ19fJztcbiAgfSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cnVlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSlNPTlA7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdHJhbnNwb3J0L2pzb25wLmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFByb21pc2UgICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKSxcbiAgICBTZXQgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9zZXQnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBicm93c2VyICAgID0gcmVxdWlyZSgnLi4vdXRpbC9icm93c2VyJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWwvY29weV9vYmplY3QnKSxcbiAgICBleHRlbmQgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgd3MgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvd2Vic29ja2V0JyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyksXG4gICAgVHJhbnNwb3J0ICA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cbnZhciBXZWJTb2NrZXQgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIFVOQ09OTkVDVEVEOiAgMSxcbiAgQ09OTkVDVElORzogICAyLFxuICBDT05ORUNURUQ6ICAgIDMsXG5cbiAgYmF0Y2hpbmc6ICAgICBmYWxzZSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLmNhbGxiYWNrKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRydWUpIH0pO1xuICAgIHRoaXMuZXJyYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSkgfSk7XG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB0aGlzLl9wZW5kaW5nID0gdGhpcy5fcGVuZGluZyB8fCBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBtZXNzYWdlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHRoaXMuX3BlbmRpbmcuYWRkKG1lc3NhZ2VzW2ldKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLmNhbGxiYWNrKGZ1bmN0aW9uKHNvY2tldCkge1xuICAgICAgICBpZiAoIXNvY2tldCB8fCBzb2NrZXQucmVhZHlTdGF0ZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgICBzb2NrZXQuc2VuZCh0b0pTT04obWVzc2FnZXMpKTtcbiAgICAgICAgcmVzb2x2ZShzb2NrZXQpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuY29ubmVjdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbigpIHsgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHdzKSB7IHdzLmNsb3NlKCkgfSkgfVxuICAgIH07XG4gIH0sXG5cbiAgY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKFdlYlNvY2tldC5fdW5sb2FkZWQpIHJldHVybjtcblxuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5fc3RhdGUgfHwgdGhpcy5VTkNPTk5FQ1RFRDtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuVU5DT05ORUNURUQpIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuQ09OTkVDVElORztcblxuICAgIHZhciBzb2NrZXQgPSB0aGlzLl9jcmVhdGVTb2NrZXQoKTtcbiAgICBpZiAoIXNvY2tldCkgcmV0dXJuIHRoaXMuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNvY2tldC5oZWFkZXJzKSBzZWxmLl9zdG9yZUNvb2tpZXMoc29ja2V0LmhlYWRlcnNbJ3NldC1jb29raWUnXSk7XG4gICAgICBzZWxmLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICBzZWxmLl9zdGF0ZSA9IHNlbGYuQ09OTkVDVEVEO1xuICAgICAgc2VsZi5fZXZlckNvbm5lY3RlZCA9IHRydWU7XG4gICAgICBzZWxmLl9waW5nKCk7XG4gICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnLCBzb2NrZXQpO1xuICAgIH07XG5cbiAgICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gICAgc29ja2V0Lm9uY2xvc2UgPSBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsb3NlZCkgcmV0dXJuO1xuICAgICAgY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgdmFyIHdhc0Nvbm5lY3RlZCA9IChzZWxmLl9zdGF0ZSA9PT0gc2VsZi5DT05ORUNURUQpO1xuICAgICAgc29ja2V0Lm9ub3BlbiA9IHNvY2tldC5vbmNsb3NlID0gc29ja2V0Lm9uZXJyb3IgPSBzb2NrZXQub25tZXNzYWdlID0gbnVsbDtcblxuICAgICAgZGVsZXRlIHNlbGYuX3NvY2tldDtcbiAgICAgIHNlbGYuX3N0YXRlID0gc2VsZi5VTkNPTk5FQ1RFRDtcbiAgICAgIHNlbGYucmVtb3ZlVGltZW91dCgncGluZycpO1xuXG4gICAgICB2YXIgcGVuZGluZyA9IHNlbGYuX3BlbmRpbmcgPyBzZWxmLl9wZW5kaW5nLnRvQXJyYXkoKSA6IFtdO1xuICAgICAgZGVsZXRlIHNlbGYuX3BlbmRpbmc7XG5cbiAgICAgIGlmICh3YXNDb25uZWN0ZWQgfHwgc2VsZi5fZXZlckNvbm5lY3RlZCkge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCd1bmtub3duJyk7XG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKHBlbmRpbmcsIHdhc0Nvbm5lY3RlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgcmVwbGllcztcbiAgICAgIHRyeSB7IHJlcGxpZXMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBpZiAoIXJlcGxpZXMpIHJldHVybjtcblxuICAgICAgcmVwbGllcyA9IFtdLmNvbmNhdChyZXBsaWVzKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSByZXBsaWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAocmVwbGllc1tpXS5zdWNjZXNzZnVsID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgICBzZWxmLl9wZW5kaW5nLnJlbW92ZShyZXBsaWVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgfTtcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHJldHVybjtcbiAgICB0aGlzLl9zb2NrZXQuY2xvc2UoKTtcbiAgfSxcblxuICBfY3JlYXRlU29ja2V0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXJsICAgICAgICA9IFdlYlNvY2tldC5nZXRTb2NrZXRVcmwodGhpcy5lbmRwb2ludCksXG4gICAgICAgIGhlYWRlcnMgICAgPSB0aGlzLl9kaXNwYXRjaGVyLmhlYWRlcnMsXG4gICAgICAgIGV4dGVuc2lvbnMgPSB0aGlzLl9kaXNwYXRjaGVyLndzRXh0ZW5zaW9ucyxcbiAgICAgICAgY29va2llICAgICA9IHRoaXMuX2dldENvb2tpZXMoKSxcbiAgICAgICAgdGxzICAgICAgICA9IHRoaXMuX2Rpc3BhdGNoZXIudGxzLFxuICAgICAgICBvcHRpb25zICAgID0ge2V4dGVuc2lvbnM6IGV4dGVuc2lvbnMsIGhlYWRlcnM6IGhlYWRlcnMsIHByb3h5OiB0aGlzLl9wcm94eSwgdGxzOiB0bHN9O1xuXG4gICAgaWYgKGNvb2tpZSAhPT0gJycpIG9wdGlvbnMuaGVhZGVyc1snQ29va2llJ10gPSBjb29raWU7XG5cbiAgICByZXR1cm4gd3MuY3JlYXRlKHVybCwgW10sIG9wdGlvbnMpO1xuICB9LFxuXG4gIF9waW5nOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCB8fCB0aGlzLl9zb2NrZXQucmVhZHlTdGF0ZSAhPT0gMSkgcmV0dXJuO1xuICAgIHRoaXMuX3NvY2tldC5zZW5kKCdbXScpO1xuICAgIHRoaXMuYWRkVGltZW91dCgncGluZycsIHRoaXMuX2Rpc3BhdGNoZXIudGltZW91dCAvIDIsIHRoaXMuX3BpbmcsIHRoaXMpO1xuICB9XG5cbn0pLCB7XG4gIFBST1RPQ09MUzoge1xuICAgICdodHRwOic6ICAnd3M6JyxcbiAgICAnaHR0cHM6JzogJ3dzczonXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCkge1xuICAgIHZhciBzb2NrZXRzID0gZGlzcGF0Y2hlci50cmFuc3BvcnRzLndlYnNvY2tldCA9IGRpc3BhdGNoZXIudHJhbnNwb3J0cy53ZWJzb2NrZXQgfHwge307XG4gICAgc29ja2V0c1tlbmRwb2ludC5ocmVmXSA9IHNvY2tldHNbZW5kcG9pbnQuaHJlZl0gfHwgbmV3IHRoaXMoZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuICAgIHJldHVybiBzb2NrZXRzW2VuZHBvaW50LmhyZWZdO1xuICB9LFxuXG4gIGdldFNvY2tldFVybDogZnVuY3Rpb24oZW5kcG9pbnQpIHtcbiAgICBlbmRwb2ludCA9IGNvcHlPYmplY3QoZW5kcG9pbnQpO1xuICAgIGVuZHBvaW50LnByb3RvY29sID0gdGhpcy5QUk9UT0NPTFNbZW5kcG9pbnQucHJvdG9jb2xdO1xuICAgIHJldHVybiBVUkkuc3RyaW5naWZ5KGVuZHBvaW50KTtcbiAgfSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jcmVhdGUoZGlzcGF0Y2hlciwgZW5kcG9pbnQpLmlzVXNhYmxlKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxufSk7XG5cbmV4dGVuZChXZWJTb2NrZXQucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcblxuaWYgKGJyb3dzZXIuRXZlbnQgJiYgZ2xvYmFsLm9uYmVmb3JldW5sb2FkICE9PSB1bmRlZmluZWQpXG4gIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgZnVuY3Rpb24oKSB7IFdlYlNvY2tldC5fdW5sb2FkZWQgPSB0cnVlIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYlNvY2tldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXllL3NyYy90cmFuc3BvcnQvd2ViX3NvY2tldC5qc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcbkNvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxudGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxudGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xudXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXNcbm9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkb1xuc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuKi9cblxudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHt9XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZheWUvc3JjL3V0aWwvZXZlbnRfZW1pdHRlci5qc1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyYXkgPSByZXF1aXJlKCcuL2FycmF5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucywgdmFsaWRLZXlzKSB7XG4gIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgaWYgKGFycmF5LmluZGV4T2YodmFsaWRLZXlzLCBrZXkpIDwgMClcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIG9wdGlvbjogJyArIGtleSk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC92YWxpZGF0ZV9vcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBXUyA9IGdsb2JhbC5Nb3pXZWJTb2NrZXQgfHwgZ2xvYmFsLldlYlNvY2tldDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24odXJsLCBwcm90b2NvbHMsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIFdTICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gbmV3IFdTKHVybCk7XG4gIH1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZmF5ZS9zcmMvdXRpbC93ZWJzb2NrZXQvYnJvd3Nlcl93ZWJzb2NrZXQuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBGYXllID0gcmVxdWlyZSgnZmF5ZS9zcmMvZmF5ZV9icm93c2VyJyk7XG5jb25zdCBDbGFzcyA9IHJlcXVpcmUoJ2ZheWUvc3JjL3V0aWwvY2xhc3MnKTtcblxuY29uc3QgQ2xpZW50ID0gQ2xhc3MoRmF5ZS5DbGllbnQsIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGJhc2UsIG9wdGlvbnMpIHtcbiAgICBGYXllLkNsaWVudC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIGJhc2UsIG9wdGlvbnMpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fdG9rZW5zID0ge307XG4gICAgc2VsZi5fcHJlc2VuY2VDQnMgPSB7fTtcblxuICAgIHRoaXMuYWRkRXh0ZW5zaW9uKHtcbiAgICAgIG91dGdvaW5nOiBmdW5jdGlvbiAobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHRva2VuO1xuXG4gICAgICAgIGlmIChtZXNzYWdlLmRhdGEgJiYgbWVzc2FnZS5kYXRhLl9vcmlnaW5hbERhdGEpIHtcbiAgICAgICAgICB0b2tlbiA9IG1lc3NhZ2UuZGF0YS5fdG9rZW47XG4gICAgICAgICAgbWVzc2FnZS5kYXRhID0gbWVzc2FnZS5kYXRhLl9vcmlnaW5hbERhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgY29uc3QgY2hhbm5lbCA9IChtZXNzYWdlLmNoYW5uZWwgPT09ICcvbWV0YS9zdWJzY3JpYmUnXG4gICAgICAgICAgICA/IG1lc3NhZ2Uuc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICA6IG1lc3NhZ2UuY2hhbm5lbCk7XG4gICAgICAgICAgdG9rZW4gPSBzZWxmLl90b2tlbnNbY2hhbm5lbF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBpZiAoIW1lc3NhZ2UuZXh0KSBtZXNzYWdlLmV4dCA9IHt9O1xuICAgICAgICAgIG1lc3NhZ2UuZXh0LmF1dGggPSB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgICB9LFxuICAgICAgaW5jb21pbmc6IGZ1bmN0aW9uIChtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAobWVzc2FnZS5jaGFubmVsID09PSAnL21ldGEvc3Vic2NyaWJlJyAmJiBtZXNzYWdlLmV4dCAmJiBtZXNzYWdlLmV4dC5wcmVzZW5jZSkge1xuICAgICAgICAgIGNvbnN0IHByZXNlbmNlQ0IgPSBzZWxmLl9wcmVzZW5jZUNCc1ttZXNzYWdlLnN1YnNjcmlwdGlvbl07XG4gICAgICAgICAgaWYgKHByZXNlbmNlQ0IpIHtcbiAgICAgICAgICAgIHByZXNlbmNlQ0IobWVzc2FnZS5leHQucHJlc2VuY2UsIG1lc3NhZ2Uuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSBjaGFubmVsIFtTdHJpbmddXG4gICAqIEBwYXJhbSB0b2tlbiBbU3RyaW5nXSAob3B0aW9uYWwpXG4gICAqIEBjYWxsYmFjayBbZnVuY3Rpb24obWVzc2FnZSwgY2hhbm5lbCldIChvcHRpb25hbClcbiAgICogICBAcGFyYW0gbWVzc2FnZSBbT2JqZWN0XVxuICAgKiAgIEBwYXJhbSBjaGFubmVsIFtTdHJpbmddXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKlxuICAgKiBzdWJzY3JpYmVUbyhjaGFubmVsLCBjYWxsYmFjaylcbiAgICogc3Vic2NyaWJlVG8oY2hhbm5lbCwgdG9rZW4sIGNhbGxiYWNrKTtcbiAgICovXG4gIHN1YnNjcmliZVRvOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2hhbm5lbCA9IGFyZ3VtZW50c1swXTtcbiAgICBsZXQgY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIGxldCB0b2tlbjtcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRva2VuID0gYXJndW1lbnRzWzFdO1xuICAgIH1cblxuICAgIGlmICh0b2tlbikge1xuICAgICAgdGhpcy5fdG9rZW5zW2NoYW5uZWxdID0gdG9rZW47XG4gICAgfVxuXG4gICAgdGhpcy5fcHJlc2VuY2VDQnNbY2hhbm5lbF0gPSBjYWxsYmFjaztcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmliZShjaGFubmVsKS53aXRoQ2hhbm5lbChmdW5jdGlvbiAoY2hhbm5lbCwgbWVzc2FnZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UsIGNoYW5uZWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0gY2hhbm5lbCBbU3RyaW5nXVxuICAgKiBAcGFyYW0gdG9rZW4gW1N0cmluZ11cbiAgICogQHBhcmFtIG1lc3NhZ2UgW09iamVjdF1cbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBwdWJsaXNoVG86IGZ1bmN0aW9uIChjaGFubmVsLCB0b2tlbiwgZGF0YSkge1xuICAgIGNvbnN0IHdyYXBwZWREYXRhID0ge1xuICAgICAgX29yaWdpbmFsRGF0YTogZGF0YSxcbiAgICAgIF90b2tlbjogdG9rZW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucHVibGlzaChjaGFubmVsLCB3cmFwcGVkRGF0YSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ2xpZW50OiBDbGllbnRcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NsaWVudC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==