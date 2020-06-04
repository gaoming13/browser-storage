'use strict';

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var preKey = ''; // 测试键名

var testKey = '__test__'; // cookie存储选项
// https://github.com/jshttp/cookie#options-1

var cookieOptions = {
  path: '/'
};
/**
 * 获取某个cookie值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */

var getItem = function getItem(key) {
  var cookieObj = cookie.parse(document.cookie);
  return cookieObj[preKey + key] === undefined ? null : cookieObj[preKey + key];
};
/**
 * 设置某个cookie值
 *
 * @param {string} key
 * @param {string} value
 * @param {object} options
 * @example obj.setItem('a2', 'b', { maxAge: 86400, domain: 'local.com' })
 */


var setItem = function setItem(key, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  options = Object.assign({}, cookieOptions, options);
  document.cookie = cookie.serialize(preKey + key, value, options);
};
/**
 * 删除某个cookie
 *
 * @param {string} key
 * @param {object} options
 * @example obj.removeItem('a2', { domain: 'local.com' })
 */


var removeItem = function removeItem(key, options) {
  options = Object.assign({}, cookieOptions, options, {
    maxAge: -1
  });
  document.cookie = cookie.serialize(preKey + key, '', options);
};
/**
 * 验证是否支持cookie
 *
 * @return {boolean}
 * @example obj.isSupport()
 */


var isSupport = function isSupport() {
  try {
    setItem(testKey, 'a');
    var value1 = getItem(testKey);
    removeItem(testKey);
    var value2 = getItem(testKey);
    return value1 === 'a' && value2 === null;
  } catch (e) {
    return false;
  }
};
/**
 * 设置cookie存储选项
 *
 * @param {object} option
 * @example obj.setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' })
 */


var setOptions = function setOptions(option) {
  cookieOptions = Object.assign({}, cookieOptions, option);
};
/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */


var setPreKey = function setPreKey(key) {
  preKey = key;
};
/**
 * 设置测试键名
 *
 * @param {string} key
 * @example obj.setTestKey('__test_key__')
 */


var setTestKey = function setTestKey(key) {
  testKey = key;
};

var cookieStore = {
  // 获取某个值
  getItem: getItem,
  // 设置某个值
  setItem: setItem,
  // 删除某个键值
  removeItem: removeItem,
  // 是否支持cookie
  isSupport: isSupport,
  // 设置cookie存储选项
  setOptions: setOptions,
  // 设置键名前缀
  setPreKey: setPreKey,
  // 设置测试键名
  setTestKey: setTestKey
};

// 键名前缀
var preKey$1 = ''; // 测试键名

var testKey$1 = '__test__';
/**
 * 获取某个localStorage值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */

var getItem$1 = function getItem(key) {
  return localStorage.getItem(preKey$1 + key);
};
/**
 * 设置某个localStorage值
 *
 * @param {string} key
 * @param {string} value
 * @example obj.setItem('a2', 'b')
 */


var setItem$1 = function setItem(key, value) {
  localStorage.setItem(preKey$1 + key, value);
};
/**
 * 删除某个localStorage键
 *
 * @param {string} key
 * @example obj.removeItem('a2')
 */


var removeItem$1 = function removeItem(key) {
  localStorage.removeItem(preKey$1 + key);
};
/**
 * 验证是否支持localStorage
 *
 * @return {boolean}
 * @example obj.isSupport()
 */


var isSupport$1 = function isSupport() {
  try {
    setItem$1(testKey$1, 'a');
    var value1 = getItem$1(testKey$1);
    removeItem$1(testKey$1);
    var value2 = getItem$1(testKey$1);
    return value1 === 'a' && value2 === null;
  } catch (e) {
    return false;
  }
};
/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */


var setPreKey$1 = function setPreKey(key) {
  preKey$1 = key;
};
/**
 * 设置测试键名
 *
 * @param {string} key
 * @example obj.setTestKey('__test_key__')
 */


var setTestKey$1 = function setTestKey(key) {
  testKey$1 = key;
};

var localStore = {
  // 获取某个值
  getItem: getItem$1,
  // 设置某个值
  setItem: setItem$1,
  // 删除某个键值
  removeItem: removeItem$1,
  // 是否支持localStorage
  isSupport: isSupport$1,
  // 设置键名前缀
  setPreKey: setPreKey$1,
  // 设置测试键名
  setTestKey: setTestKey$1
};

// 键名前缀
var preKey$2 = ''; // 测试键名

var testKey$2 = '__test__';
/**
 * 获取某个sessionStorage值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */

var getItem$2 = function getItem(key) {
  return sessionStorage.getItem(preKey$2 + key);
};
/**
 * 设置某个sessionStorage值
 *
 * @param {string} key
 * @param {string} value
 * @example obj.setItem('a2', 'b')
 */


var setItem$2 = function setItem(key, value) {
  sessionStorage.setItem(preKey$2 + key, value);
};
/**
 * 删除某个sessionStorage键
 *
 * @param {string} key
 * @example obj.removeItem('a2')
 */


var removeItem$2 = function removeItem(key) {
  sessionStorage.removeItem(preKey$2 + key);
};
/**
 * 清空sessionStorage键
 */


var clear = function clear() {
  sessionStorage.clear();
};
/**
 * 验证是否支持sessionStorage
 *
 * @return {boolean}
 * @example obj.isSupport()
 */


var isSupport$2 = function isSupport() {
  try {
    setItem$2(testKey$2, 'a');
    var value1 = getItem$2(testKey$2);
    removeItem$2(testKey$2);
    var value2 = getItem$2(testKey$2);
    return value1 === 'a' && value2 === null;
  } catch (e) {
    return false;
  }
};
/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */


var setPreKey$2 = function setPreKey(key) {
  preKey$2 = key;
};
/**
 * 设置测试键名
 *
 * @param {string} key
 * @example obj.setTestKey('__test_key__')
 */


var setTestKey$2 = function setTestKey(key) {
  testKey$2 = key;
};

var seesionStore = {
  // 获取某个值
  getItem: getItem$2,
  // 设置某个值
  setItem: setItem$2,
  // 删除某个键值
  removeItem: removeItem$2,
  // 清空键值
  clear: clear,
  // 是否支持sessionStorage
  isSupport: isSupport$2,
  // 设置键名前缀
  setPreKey: setPreKey$2,
  // 设置测试键名
  setTestKey: setTestKey$2
};

var cookieStoreIsSupport = cookieStore.isSupport();
var localStoreIsSupport = localStore.isSupport();
var seesionStoreIsSupport = seesionStore.isSupport(); // 存储方式优先级

var priority = 'lc';
/**
 * 获取某个值
 *
 * @param {string} key
 * @return {string}
 * @example obj.getItem('a2')
 */

var getItem$3 = function getItem(key) {
  var _iterator = _createForOfIteratorHelper(priority),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var type = _step.value;

      if (type === 'l' && localStoreIsSupport) {
        return localStore.getItem(key);
      }

      if (type === 'c' && cookieStoreIsSupport) {
        return cookieStore.getItem(key);
      }

      if (type === 's' && seesionStoreIsSupport) {
        return seesionStore.getItem(key);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
};
/**
 * 设置某个值
 *
 * @param {string} key
 * @param {string} value
 * @return {boolean} 是否设置成功
 * @example obj.setItem('a2', 'b')
 */


var setItem$3 = function setItem(key, value) {
  var _iterator2 = _createForOfIteratorHelper(priority),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var type = _step2.value;

      if (type === 'l' && localStoreIsSupport) {
        localStore.setItem(key, value);
        return true;
      }

      if (type === 'c' && cookieStoreIsSupport) {
        cookieStore.setItem(key, value);
        return true;
      }

      if (type === 's' && seesionStoreIsSupport) {
        seesionStore.setItem(key, value);
        return true;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return false;
};
/**
 * 删除某个键值
 *
 * @param {string} key
 * @return {boolean} 是否删除成功
 * @example obj.removeItem('a2')
 */


var removeItem$3 = function removeItem(key) {
  var _iterator3 = _createForOfIteratorHelper(priority),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var type = _step3.value;

      if (type === 'l' && localStoreIsSupport) {
        localStore.removeItem(key);
        return true;
      }

      if (type === 'c' && cookieStoreIsSupport) {
        cookieStore.removeItem(key);
        return true;
      }

      if (type === 's' && seesionStoreIsSupport) {
        seesionStore.removeItem(key);
        return true;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return false;
};
/**
 * 设置存储方式优先级
 *
 * @param {string} key
 * @example obj.setPriority('lcs')
 */


var setPriority = function setPriority(key) {
  priority = key;
};
/**
 * 设置键名前缀
 *
 * @param {string} key
 * @example obj.setPreKey('h5-')
 */


var setPreKey$3 = function setPreKey(key) {
  cookieStore.setPreKey(key);
  localStore.setPreKey(key);
  seesionStore.setPreKey(key);
};

var index = {
  // 获取某个值
  getItem: getItem$3,
  // 设置某个值
  setItem: setItem$3,
  // 删除某个键值
  removeItem: removeItem$3,
  // 设置存储方式优先级
  setPriority: setPriority,
  // 设置键名前缀
  setPreKey: setPreKey$3,
  // cookie设置键名前缀
  cookieStoreSetPreKey: cookieStore.setPreKey,
  // localStorage设置键名前缀
  localStoreSetPreKey: localStore.setPreKey,
  // sessionStorage设置键名前缀
  seesionStoreSetPreKey: seesionStore.setPreKey,
  // 是否支持cookie
  cookieStoreIsSupport: cookieStoreIsSupport,
  // 是否支持localStorage
  localStoreIsSupport: localStoreIsSupport,
  // 是否支持sessionStorage
  seesionStoreIsSupport: seesionStoreIsSupport,
  // cookie设置存储选项
  cookieSetOptions: cookieStore.setOptions
};

module.exports = index;
//# sourceMappingURL=browser-storage.common.js.map
