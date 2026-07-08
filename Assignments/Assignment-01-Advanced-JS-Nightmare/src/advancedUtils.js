"use strict";

/*
  Advanced JavaScript Nightmare Assignment
  Mini JavaScript Utility Library

  Rules followed:
  - No map
  - No filter
  - No reduce
  - No find
  - No some
  - No every
  - No flat
  - No flatMap
  - No sort
  - No includes
  - No indexOf
*/

function isArray(value) {
  return Array.isArray(value);
}

function isFunction(value) {
  return typeof value === "function";
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/* 1. customMap */
function customMap(array, callback, thisArg) {
  if (!isArray(array)) {
    throw new TypeError("customMap expects the first argument to be an array");
  }

  if (!isFunction(callback)) {
    throw new TypeError("customMap expects the second argument to be a function");
  }

  var result = new Array(array.length);

  for (var i = 0; i < array.length; i++) {
    if (i in array) {
      result[i] = callback.call(thisArg, array[i], i, array);
    }
  }

  return result;
}

/* 2. customFilter */
function customFilter(array, callback, thisArg) {
  if (!isArray(array)) {
    throw new TypeError("customFilter expects the first argument to be an array");
  }

  if (!isFunction(callback)) {
    throw new TypeError("customFilter expects the second argument to be a function");
  }

  var result = [];

  for (var i = 0; i < array.length; i++) {
    if (i in array) {
      if (callback.call(thisArg, array[i], i, array)) {
        result.push(array[i]);
      }
    }
  }

  return result;
}

/* 3. customReduce */
function customReduce(array, callback, initialValue) {
  if (!isArray(array)) {
    throw new TypeError("customReduce expects the first argument to be an array");
  }

  if (!isFunction(callback)) {
    throw new TypeError("customReduce expects the second argument to be a function");
  }

  var hasInitialValue = arguments.length >= 3;
  var accumulator;
  var startIndex = 0;

  if (hasInitialValue) {
    accumulator = initialValue;
  } else {
    while (startIndex < array.length && !(startIndex in array)) {
      startIndex++;
    }

    if (startIndex >= array.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = array[startIndex];
    startIndex++;
  }

  for (var i = startIndex; i < array.length; i++) {
    if (i in array) {
      accumulator = callback(accumulator, array[i], i, array);
    }
  }

  return accumulator;
}

/* 4. groupBy */
function groupBy(array, property) {
  if (!isArray(array)) {
    throw new TypeError("groupBy expects the first argument to be an array");
  }

  if (
    typeof property !== "string" &&
    typeof property !== "number" &&
    typeof property !== "symbol"
  ) {
    throw new TypeError("groupBy expects property to be a string, number, or symbol");
  }

  var result = Object.create(null);

  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    var key;

    if (item !== null && item !== undefined && property in Object(item)) {
      key = item[property];
    } else {
      key = "undefined";
    }

    var groupKey = String(key);

    if (!hasOwn(result, groupKey)) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}

/* 5. deepClone */
function deepClone(value, seen) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (!seen) {
    seen = new WeakMap();
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    var copiedRegex = new RegExp(value.source, value.flags);
    copiedRegex.lastIndex = value.lastIndex;
    return copiedRegex;
  }

  if (isArray(value)) {
    var copiedArray = new Array(value.length);
    seen.set(value, copiedArray);

    for (var i = 0; i < value.length; i++) {
      if (i in value) {
        copiedArray[i] = deepClone(value[i], seen);
      }
    }

    return copiedArray;
  }

  var clonedObject = Object.create(Object.getPrototypeOf(value));
  seen.set(value, clonedObject);

  var keys = Object.keys(value);

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    clonedObject[key] = deepClone(value[key], seen);
  }

  var symbols = Object.getOwnPropertySymbols(value);

  for (var s = 0; s < symbols.length; s++) {
    var symbolKey = symbols[s];

    if (Object.prototype.propertyIsEnumerable.call(value, symbolKey)) {
      clonedObject[symbolKey] = deepClone(value[symbolKey], seen);
    }
  }

  return clonedObject;
}

/* 6. once */
function once(fn) {
  if (!isFunction(fn)) {
    throw new TypeError("once expects a function");
  }

  var called = false;
  var result;

  return function () {
    if (!called) {
      called = true;
      result = fn.apply(this, arguments);
    }

    return result;
  };
}

/* Helper for memoize */
function makeCacheKey(args) {
  var key = "";

  for (var i = 0; i < args.length; i++) {
    key += "|" + stringifyValue(args[i]);
  }

  return key;
}

function stringifyValue(value, seen) {
  var type = typeof value;

  if (value === null) {
    return "null";
  }

  if (type === "undefined") {
    return "undefined";
  }

  if (type === "number") {
    if (Number.isNaN(value)) {
      return "number:NaN";
    }

    return "number:" + String(value);
  }

  if (type === "string") {
    return "string:" + value;
  }

  if (type === "boolean") {
    return "boolean:" + String(value);
  }

  if (type === "bigint") {
    return "bigint:" + String(value);
  }

  if (type === "symbol") {
    return "symbol:" + String(value.description);
  }

  if (type === "function") {
    return "function:" + (value.name || "anonymous");
  }

  if (!seen) {
    seen = new WeakMap();
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.set(value, true);

  if (value instanceof Date) {
    return "date:" + String(value.getTime());
  }

  if (isArray(value)) {
    var arrayKey = "array[";

    for (var i = 0; i < value.length; i++) {
      if (i in value) {
        arrayKey += stringifyValue(value[i], seen);
      } else {
        arrayKey += "<empty>";
      }

      arrayKey += ",";
    }

    arrayKey += "]";
    return arrayKey;
  }

  var keys = Object.keys(value);
  var objectKey = "object{";

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    objectKey += key + ":" + stringifyValue(value[key], seen) + ",";
  }

  objectKey += "}";
  return objectKey;
}

/* 7. memoize */
function memoize(fn, resolver) {
  if (!isFunction(fn)) {
    throw new TypeError("memoize expects the first argument to be a function");
  }

  if (resolver !== undefined && !isFunction(resolver)) {
    throw new TypeError("memoize resolver must be a function");
  }

  var cache = Object.create(null);

  return function () {
    var key;

    if (resolver) {
      key = resolver.apply(this, arguments);
    } else {
      key = makeCacheKey(arguments);
    }

    key = String(key);

    if (hasOwn(cache, key)) {
      return cache[key];
    }

    var result = fn.apply(this, arguments);
    cache[key] = result;

    return result;
  };
}

/* 8. compose */
function compose() {
  var functions = arguments;

  for (var i = 0; i < functions.length; i++) {
    if (!isFunction(functions[i])) {
      throw new TypeError("compose expects only functions");
    }
  }

  return function (initialValue) {
    var result = initialValue;

    for (var i = functions.length - 1; i >= 0; i--) {
      result = functions[i].call(this, result);
    }

    return result;
  };
}

/* 9. flattenArray */
function flattenArray(array) {
  if (!isArray(array)) {
    throw new TypeError("flattenArray expects an array");
  }

  var result = [];

  function flatten(input) {
    for (var i = 0; i < input.length; i++) {
      if (i in input) {
        var item = input[i];

        if (isArray(item)) {
          flatten(item);
        } else {
          result.push(item);
        }
      }
    }
  }

  flatten(array);
  return result;
}

/* 10. createCounter */
function createCounter(start) {
  var initialValue = typeof start === "number" ? start : 0;
  var count = initialValue;

  return {
    increment: function (step) {
      var value = typeof step === "number" ? step : 1;
      count += value;
      return count;
    },

    decrement: function (step) {
      var value = typeof step === "number" ? step : 1;
      count -= value;
      return count;
    },

    reset: function (newStart) {
      count = typeof newStart === "number" ? newStart : initialValue;
      return count;
    },

    getValue: function () {
      return count;
    }
  };
}

/* 11. createSecretHolder */
function createSecretHolder(initialSecret) {
  var secret = initialSecret;

  return {
    getSecret: function () {
      return secret;
    },

    setSecret: function (newSecret) {
      secret = newSecret;
      return secret;
    }
  };
}

/* 12. pipeAsync */
function pipeAsync() {
  var functions = arguments;

  for (var i = 0; i < functions.length; i++) {
    if (!isFunction(functions[i])) {
      throw new TypeError("pipeAsync expects only functions");
    }
  }

  return function (initialValue) {
    var context = this;
    var promise = Promise.resolve(initialValue);

    for (var i = 0; i < functions.length; i++) {
      (function (fn) {
        promise = promise.then(function (value) {
          return fn.call(context, value);
        });
      })(functions[i]);
    }

    return promise;
  };
}

/* 14. Final Boss - Event Emitter */
function EventEmitter() {
  this.events = Object.create(null);
}

EventEmitter.prototype.validateEventName = function (eventName) {
  if (typeof eventName !== "string" && typeof eventName !== "symbol") {
    throw new TypeError("Event name must be a string or symbol");
  }
};

EventEmitter.prototype.on = function (eventName, callback) {
  this.validateEventName(eventName);

  if (!isFunction(callback)) {
    throw new TypeError("Listener must be a function");
  }

  if (!this.events[eventName]) {
    this.events[eventName] = [];
  }

  this.events[eventName].push({
    callback: callback,
    once: false
  });

  return this;
};

EventEmitter.prototype.once = function (eventName, callback) {
  this.validateEventName(eventName);

  if (!isFunction(callback)) {
    throw new TypeError("Listener must be a function");
  }

  if (!this.events[eventName]) {
    this.events[eventName] = [];
  }

  this.events[eventName].push({
    callback: callback,
    once: true
  });

  return this;
};

EventEmitter.prototype.off = function (eventName, callback) {
  this.validateEventName(eventName);

  if (!isFunction(callback)) {
    throw new TypeError("Listener must be a function");
  }

  var listeners = this.events[eventName];

  if (!listeners) {
    return this;
  }

  var updatedListeners = [];

  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i].callback !== callback) {
      updatedListeners.push(listeners[i]);
    }
  }

  if (updatedListeners.length === 0) {
    delete this.events[eventName];
  } else {
    this.events[eventName] = updatedListeners;
  }

  return this;
};

EventEmitter.prototype.removeListenerObject = function (eventName, targetListener) {
  var listeners = this.events[eventName];

  if (!listeners) {
    return;
  }

  var updatedListeners = [];

  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i] !== targetListener) {
      updatedListeners.push(listeners[i]);
    }
  }

  if (updatedListeners.length === 0) {
    delete this.events[eventName];
  } else {
    this.events[eventName] = updatedListeners;
  }
};

EventEmitter.prototype.emit = function (eventName) {
  this.validateEventName(eventName);

  var listeners = this.events[eventName];

  if (!listeners) {
    return false;
  }

  var args = [];

  for (var a = 1; a < arguments.length; a++) {
    args.push(arguments[a]);
  }

  var snapshot = [];

  for (var i = 0; i < listeners.length; i++) {
    snapshot.push(listeners[i]);
  }

  for (var j = 0; j < snapshot.length; j++) {
    var listener = snapshot[j];

    listener.callback.apply(this, args);

    if (listener.once) {
      this.removeListenerObject(eventName, listener);
    }
  }

  return true;
};

EventEmitter.prototype.listenerCount = function (eventName) {
  this.validateEventName(eventName);

  var listeners = this.events[eventName];

  if (!listeners) {
    return 0;
  }

  return listeners.length;
};

EventEmitter.prototype.removeAllListeners = function (eventName) {
  if (eventName === undefined) {
    this.events = Object.create(null);
    return this;
  }

  this.validateEventName(eventName);
  delete this.events[eventName];

  return this;
};

module.exports = {
  customMap: customMap,
  customFilter: customFilter,
  customReduce: customReduce,
  groupBy: groupBy,
  deepClone: deepClone,
  once: once,
  memoize: memoize,
  compose: compose,
  flattenArray: flattenArray,
  createCounter: createCounter,
  createSecretHolder: createSecretHolder,
  pipeAsync: pipeAsync,
  EventEmitter: EventEmitter
};