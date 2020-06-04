(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.browserStore = factory());
}(this, (function () { 'use strict';

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

  function cov_fossv89kh() {
    var path = "/Users/zhaoliming/GM13/github/browser-storage/src/cookieStore.js";
    var hash = "74b4b9bba49d40312e275dbd3a0d03606286a083";
    var global = new Function("return this")();
    var gcv = "__coverage__";
    var coverageData = {
      path: "/Users/zhaoliming/GM13/github/browser-storage/src/cookieStore.js",
      statementMap: {
        "0": {
          start: {
            line: 4,
            column: 13
          },
          end: {
            line: 4,
            column: 15
          }
        },
        "1": {
          start: {
            line: 7,
            column: 14
          },
          end: {
            line: 7,
            column: 24
          }
        },
        "2": {
          start: {
            line: 11,
            column: 20
          },
          end: {
            line: 13,
            column: 1
          }
        },
        "3": {
          start: {
            line: 22,
            column: 16
          },
          end: {
            line: 25,
            column: 1
          }
        },
        "4": {
          start: {
            line: 23,
            column: 20
          },
          end: {
            line: 23,
            column: 49
          }
        },
        "5": {
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 24,
            column: 80
          }
        },
        "6": {
          start: {
            line: 35,
            column: 16
          },
          end: {
            line: 38,
            column: 1
          }
        },
        "7": {
          start: {
            line: 36,
            column: 2
          },
          end: {
            line: 36,
            column: 54
          }
        },
        "8": {
          start: {
            line: 37,
            column: 2
          },
          end: {
            line: 37,
            column: 67
          }
        },
        "9": {
          start: {
            line: 47,
            column: 19
          },
          end: {
            line: 50,
            column: 1
          }
        },
        "10": {
          start: {
            line: 48,
            column: 2
          },
          end: {
            line: 48,
            column: 68
          }
        },
        "11": {
          start: {
            line: 49,
            column: 2
          },
          end: {
            line: 49,
            column: 64
          }
        },
        "12": {
          start: {
            line: 58,
            column: 18
          },
          end: {
            line: 68,
            column: 1
          }
        },
        "13": {
          start: {
            line: 59,
            column: 2
          },
          end: {
            line: 67,
            column: 3
          }
        },
        "14": {
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 60,
            column: 26
          }
        },
        "15": {
          start: {
            line: 61,
            column: 19
          },
          end: {
            line: 61,
            column: 35
          }
        },
        "16": {
          start: {
            line: 62,
            column: 4
          },
          end: {
            line: 62,
            column: 24
          }
        },
        "17": {
          start: {
            line: 63,
            column: 19
          },
          end: {
            line: 63,
            column: 35
          }
        },
        "18": {
          start: {
            line: 64,
            column: 4
          },
          end: {
            line: 64,
            column: 45
          }
        },
        "19": {
          start: {
            line: 66,
            column: 4
          },
          end: {
            line: 66,
            column: 17
          }
        },
        "20": {
          start: {
            line: 76,
            column: 19
          },
          end: {
            line: 78,
            column: 1
          }
        },
        "21": {
          start: {
            line: 77,
            column: 2
          },
          end: {
            line: 77,
            column: 59
          }
        },
        "22": {
          start: {
            line: 86,
            column: 18
          },
          end: {
            line: 88,
            column: 1
          }
        },
        "23": {
          start: {
            line: 87,
            column: 2
          },
          end: {
            line: 87,
            column: 15
          }
        },
        "24": {
          start: {
            line: 96,
            column: 19
          },
          end: {
            line: 98,
            column: 1
          }
        },
        "25": {
          start: {
            line: 97,
            column: 2
          },
          end: {
            line: 97,
            column: 16
          }
        }
      },
      fnMap: {
        "0": {
          name: "(anonymous_0)",
          decl: {
            start: {
              line: 22,
              column: 16
            },
            end: {
              line: 22,
              column: 17
            }
          },
          loc: {
            start: {
              line: 22,
              column: 25
            },
            end: {
              line: 25,
              column: 1
            }
          },
          line: 22
        },
        "1": {
          name: "(anonymous_1)",
          decl: {
            start: {
              line: 35,
              column: 16
            },
            end: {
              line: 35,
              column: 17
            }
          },
          loc: {
            start: {
              line: 35,
              column: 46
            },
            end: {
              line: 38,
              column: 1
            }
          },
          line: 35
        },
        "2": {
          name: "(anonymous_2)",
          decl: {
            start: {
              line: 47,
              column: 19
            },
            end: {
              line: 47,
              column: 20
            }
          },
          loc: {
            start: {
              line: 47,
              column: 37
            },
            end: {
              line: 50,
              column: 1
            }
          },
          line: 47
        },
        "3": {
          name: "(anonymous_3)",
          decl: {
            start: {
              line: 58,
              column: 18
            },
            end: {
              line: 58,
              column: 19
            }
          },
          loc: {
            start: {
              line: 58,
              column: 24
            },
            end: {
              line: 68,
              column: 1
            }
          },
          line: 58
        },
        "4": {
          name: "(anonymous_4)",
          decl: {
            start: {
              line: 76,
              column: 19
            },
            end: {
              line: 76,
              column: 20
            }
          },
          loc: {
            start: {
              line: 76,
              column: 31
            },
            end: {
              line: 78,
              column: 1
            }
          },
          line: 76
        },
        "5": {
          name: "(anonymous_5)",
          decl: {
            start: {
              line: 86,
              column: 18
            },
            end: {
              line: 86,
              column: 19
            }
          },
          loc: {
            start: {
              line: 86,
              column: 27
            },
            end: {
              line: 88,
              column: 1
            }
          },
          line: 86
        },
        "6": {
          name: "(anonymous_6)",
          decl: {
            start: {
              line: 96,
              column: 19
            },
            end: {
              line: 96,
              column: 20
            }
          },
          loc: {
            start: {
              line: 96,
              column: 28
            },
            end: {
              line: 98,
              column: 1
            }
          },
          line: 96
        }
      },
      branchMap: {
        "0": {
          loc: {
            start: {
              line: 24,
              column: 9
            },
            end: {
              line: 24,
              column: 79
            }
          },
          type: "cond-expr",
          locations: [{
            start: {
              line: 24,
              column: 49
            },
            end: {
              line: 24,
              column: 53
            }
          }, {
            start: {
              line: 24,
              column: 56
            },
            end: {
              line: 24,
              column: 79
            }
          }],
          line: 24
        },
        "1": {
          loc: {
            start: {
              line: 35,
              column: 29
            },
            end: {
              line: 35,
              column: 41
            }
          },
          type: "default-arg",
          locations: [{
            start: {
              line: 35,
              column: 39
            },
            end: {
              line: 35,
              column: 41
            }
          }],
          line: 35
        },
        "2": {
          loc: {
            start: {
              line: 64,
              column: 11
            },
            end: {
              line: 64,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 64,
              column: 11
            },
            end: {
              line: 64,
              column: 25
            }
          }, {
            start: {
              line: 64,
              column: 29
            },
            end: {
              line: 64,
              column: 44
            }
          }],
          line: 64
        }
      },
      s: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 0,
        "21": 0,
        "22": 0,
        "23": 0,
        "24": 0,
        "25": 0
      },
      f: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
      },
      b: {
        "0": [0, 0],
        "1": [0],
        "2": [0, 0]
      },
      _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
      hash: "74b4b9bba49d40312e275dbd3a0d03606286a083"
    };
    var coverage = global[gcv] || (global[gcv] = {});

    if (!coverage[path] || coverage[path].hash !== hash) {
      coverage[path] = coverageData;
    }

    var actualCoverage = coverage[path];
    {
      // @ts-ignore
      cov_fossv89kh = function () {
        return actualCoverage;
      };
    }
    return actualCoverage;
  }

  cov_fossv89kh();

  var preKey = (cov_fossv89kh().s[0]++, ''); // 测试键名

  var testKey = (cov_fossv89kh().s[1]++, '__test__'); // cookie存储选项
  // https://github.com/jshttp/cookie#options-1

  var cookieOptions = (cov_fossv89kh().s[2]++, {
    path: '/'
  });
  /**
   * 获取某个cookie值
   *
   * @param {string} key
   * @return {string}
   * @example obj.getItem('a2')
   */

  cov_fossv89kh().s[3]++;

  var getItem = function getItem(key) {
    cov_fossv89kh().f[0]++;
    var cookieObj = (cov_fossv89kh().s[4]++, cookie.parse(document.cookie));
    cov_fossv89kh().s[5]++;
    return cookieObj[preKey + key] === undefined ? (cov_fossv89kh().b[0][0]++, null) : (cov_fossv89kh().b[0][1]++, cookieObj[preKey + key]);
  };
  /**
   * 设置某个cookie值
   *
   * @param {string} key
   * @param {string} value
   * @param {object} options
   * @example obj.setItem('a2', 'b', { maxAge: 86400, domain: 'local.com' })
   */


  cov_fossv89kh().s[6]++;

  var setItem = function setItem(key, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (cov_fossv89kh().b[1][0]++, {});
    cov_fossv89kh().f[1]++;
    cov_fossv89kh().s[7]++;
    options = Object.assign({}, cookieOptions, options);
    cov_fossv89kh().s[8]++;
    document.cookie = cookie.serialize(preKey + key, value, options);
  };
  /**
   * 删除某个cookie
   *
   * @param {string} key
   * @param {object} options
   * @example obj.removeItem('a2', { domain: 'local.com' })
   */


  cov_fossv89kh().s[9]++;

  var removeItem = function removeItem(key, options) {
    cov_fossv89kh().f[2]++;
    cov_fossv89kh().s[10]++;
    options = Object.assign({}, cookieOptions, options, {
      maxAge: -1
    });
    cov_fossv89kh().s[11]++;
    document.cookie = cookie.serialize(preKey + key, '', options);
  };
  /**
   * 验证是否支持cookie
   *
   * @return {boolean}
   * @example obj.isSupport()
   */


  cov_fossv89kh().s[12]++;

  var isSupport = function isSupport() {
    cov_fossv89kh().f[3]++;
    cov_fossv89kh().s[13]++;

    try {
      cov_fossv89kh().s[14]++;
      setItem(testKey, 'a');
      var value1 = (cov_fossv89kh().s[15]++, getItem(testKey));
      cov_fossv89kh().s[16]++;
      removeItem(testKey);
      var value2 = (cov_fossv89kh().s[17]++, getItem(testKey));
      cov_fossv89kh().s[18]++;
      return (cov_fossv89kh().b[2][0]++, value1 === 'a') && (cov_fossv89kh().b[2][1]++, value2 === null);
    } catch (e) {
      cov_fossv89kh().s[19]++;
      return false;
    }
  };
  /**
   * 设置cookie存储选项
   *
   * @param {object} option
   * @example obj.setCookieOptions({ path: '/abc', maxAge: 86400, domain: 'local.com' })
   */


  cov_fossv89kh().s[20]++;

  var setOptions = function setOptions(option) {
    cov_fossv89kh().f[4]++;
    cov_fossv89kh().s[21]++;
    cookieOptions = Object.assign({}, cookieOptions, option);
  };
  /**
   * 设置键名前缀
   *
   * @param {string} key
   * @example obj.setPreKey('h5-')
   */


  cov_fossv89kh().s[22]++;

  var setPreKey = function setPreKey(key) {
    cov_fossv89kh().f[5]++;
    cov_fossv89kh().s[23]++;
    preKey = key;
  };
  /**
   * 设置测试键名
   *
   * @param {string} key
   * @example obj.setTestKey('__test_key__')
   */


  cov_fossv89kh().s[24]++;

  var setTestKey = function setTestKey(key) {
    cov_fossv89kh().f[6]++;
    cov_fossv89kh().s[25]++;
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

  function cov_14x3ahwvzn() {
    var path = "/Users/zhaoliming/GM13/github/browser-storage/src/localStore.js";
    var hash = "dbebb39df8046fdfebcbf3c81ab9c8c4f06aec1a";
    var global = new Function("return this")();
    var gcv = "__coverage__";
    var coverageData = {
      path: "/Users/zhaoliming/GM13/github/browser-storage/src/localStore.js",
      statementMap: {
        "0": {
          start: {
            line: 2,
            column: 13
          },
          end: {
            line: 2,
            column: 15
          }
        },
        "1": {
          start: {
            line: 5,
            column: 14
          },
          end: {
            line: 5,
            column: 24
          }
        },
        "2": {
          start: {
            line: 14,
            column: 16
          },
          end: {
            line: 16,
            column: 1
          }
        },
        "3": {
          start: {
            line: 15,
            column: 2
          },
          end: {
            line: 15,
            column: 44
          }
        },
        "4": {
          start: {
            line: 25,
            column: 16
          },
          end: {
            line: 27,
            column: 1
          }
        },
        "5": {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 44
          }
        },
        "6": {
          start: {
            line: 35,
            column: 19
          },
          end: {
            line: 37,
            column: 1
          }
        },
        "7": {
          start: {
            line: 36,
            column: 2
          },
          end: {
            line: 36,
            column: 40
          }
        },
        "8": {
          start: {
            line: 45,
            column: 18
          },
          end: {
            line: 55,
            column: 1
          }
        },
        "9": {
          start: {
            line: 46,
            column: 2
          },
          end: {
            line: 54,
            column: 3
          }
        },
        "10": {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 47,
            column: 26
          }
        },
        "11": {
          start: {
            line: 48,
            column: 19
          },
          end: {
            line: 48,
            column: 35
          }
        },
        "12": {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 24
          }
        },
        "13": {
          start: {
            line: 50,
            column: 19
          },
          end: {
            line: 50,
            column: 35
          }
        },
        "14": {
          start: {
            line: 51,
            column: 4
          },
          end: {
            line: 51,
            column: 45
          }
        },
        "15": {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 53,
            column: 17
          }
        },
        "16": {
          start: {
            line: 63,
            column: 18
          },
          end: {
            line: 65,
            column: 1
          }
        },
        "17": {
          start: {
            line: 64,
            column: 2
          },
          end: {
            line: 64,
            column: 15
          }
        },
        "18": {
          start: {
            line: 73,
            column: 19
          },
          end: {
            line: 75,
            column: 1
          }
        },
        "19": {
          start: {
            line: 74,
            column: 2
          },
          end: {
            line: 74,
            column: 16
          }
        }
      },
      fnMap: {
        "0": {
          name: "(anonymous_0)",
          decl: {
            start: {
              line: 14,
              column: 16
            },
            end: {
              line: 14,
              column: 17
            }
          },
          loc: {
            start: {
              line: 14,
              column: 25
            },
            end: {
              line: 16,
              column: 1
            }
          },
          line: 14
        },
        "1": {
          name: "(anonymous_1)",
          decl: {
            start: {
              line: 25,
              column: 16
            },
            end: {
              line: 25,
              column: 17
            }
          },
          loc: {
            start: {
              line: 25,
              column: 32
            },
            end: {
              line: 27,
              column: 1
            }
          },
          line: 25
        },
        "2": {
          name: "(anonymous_2)",
          decl: {
            start: {
              line: 35,
              column: 19
            },
            end: {
              line: 35,
              column: 20
            }
          },
          loc: {
            start: {
              line: 35,
              column: 28
            },
            end: {
              line: 37,
              column: 1
            }
          },
          line: 35
        },
        "3": {
          name: "(anonymous_3)",
          decl: {
            start: {
              line: 45,
              column: 18
            },
            end: {
              line: 45,
              column: 19
            }
          },
          loc: {
            start: {
              line: 45,
              column: 24
            },
            end: {
              line: 55,
              column: 1
            }
          },
          line: 45
        },
        "4": {
          name: "(anonymous_4)",
          decl: {
            start: {
              line: 63,
              column: 18
            },
            end: {
              line: 63,
              column: 19
            }
          },
          loc: {
            start: {
              line: 63,
              column: 27
            },
            end: {
              line: 65,
              column: 1
            }
          },
          line: 63
        },
        "5": {
          name: "(anonymous_5)",
          decl: {
            start: {
              line: 73,
              column: 19
            },
            end: {
              line: 73,
              column: 20
            }
          },
          loc: {
            start: {
              line: 73,
              column: 28
            },
            end: {
              line: 75,
              column: 1
            }
          },
          line: 73
        }
      },
      branchMap: {
        "0": {
          loc: {
            start: {
              line: 51,
              column: 11
            },
            end: {
              line: 51,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 51,
              column: 11
            },
            end: {
              line: 51,
              column: 25
            }
          }, {
            start: {
              line: 51,
              column: 29
            },
            end: {
              line: 51,
              column: 44
            }
          }],
          line: 51
        }
      },
      s: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0
      },
      f: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
      },
      b: {
        "0": [0, 0]
      },
      _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
      hash: "dbebb39df8046fdfebcbf3c81ab9c8c4f06aec1a"
    };
    var coverage = global[gcv] || (global[gcv] = {});

    if (!coverage[path] || coverage[path].hash !== hash) {
      coverage[path] = coverageData;
    }

    var actualCoverage = coverage[path];
    {
      // @ts-ignore
      cov_14x3ahwvzn = function () {
        return actualCoverage;
      };
    }
    return actualCoverage;
  }

  cov_14x3ahwvzn();
  // 键名前缀
  var preKey$1 = (cov_14x3ahwvzn().s[0]++, ''); // 测试键名

  var testKey$1 = (cov_14x3ahwvzn().s[1]++, '__test__');
  /**
   * 获取某个localStorage值
   *
   * @param {string} key
   * @return {string}
   * @example obj.getItem('a2')
   */

  cov_14x3ahwvzn().s[2]++;

  var getItem$1 = function getItem(key) {
    cov_14x3ahwvzn().f[0]++;
    cov_14x3ahwvzn().s[3]++;
    return localStorage.getItem(preKey$1 + key);
  };
  /**
   * 设置某个localStorage值
   *
   * @param {string} key
   * @param {string} value
   * @example obj.setItem('a2', 'b')
   */


  cov_14x3ahwvzn().s[4]++;

  var setItem$1 = function setItem(key, value) {
    cov_14x3ahwvzn().f[1]++;
    cov_14x3ahwvzn().s[5]++;
    localStorage.setItem(preKey$1 + key, value);
  };
  /**
   * 删除某个localStorage键
   *
   * @param {string} key
   * @example obj.removeItem('a2')
   */


  cov_14x3ahwvzn().s[6]++;

  var removeItem$1 = function removeItem(key) {
    cov_14x3ahwvzn().f[2]++;
    cov_14x3ahwvzn().s[7]++;
    localStorage.removeItem(preKey$1 + key);
  };
  /**
   * 验证是否支持localStorage
   *
   * @return {boolean}
   * @example obj.isSupport()
   */


  cov_14x3ahwvzn().s[8]++;

  var isSupport$1 = function isSupport() {
    cov_14x3ahwvzn().f[3]++;
    cov_14x3ahwvzn().s[9]++;

    try {
      cov_14x3ahwvzn().s[10]++;
      setItem$1(testKey$1, 'a');
      var value1 = (cov_14x3ahwvzn().s[11]++, getItem$1(testKey$1));
      cov_14x3ahwvzn().s[12]++;
      removeItem$1(testKey$1);
      var value2 = (cov_14x3ahwvzn().s[13]++, getItem$1(testKey$1));
      cov_14x3ahwvzn().s[14]++;
      return (cov_14x3ahwvzn().b[0][0]++, value1 === 'a') && (cov_14x3ahwvzn().b[0][1]++, value2 === null);
    } catch (e) {
      cov_14x3ahwvzn().s[15]++;
      return false;
    }
  };
  /**
   * 设置键名前缀
   *
   * @param {string} key
   * @example obj.setPreKey('h5-')
   */


  cov_14x3ahwvzn().s[16]++;

  var setPreKey$1 = function setPreKey(key) {
    cov_14x3ahwvzn().f[4]++;
    cov_14x3ahwvzn().s[17]++;
    preKey$1 = key;
  };
  /**
   * 设置测试键名
   *
   * @param {string} key
   * @example obj.setTestKey('__test_key__')
   */


  cov_14x3ahwvzn().s[18]++;

  var setTestKey$1 = function setTestKey(key) {
    cov_14x3ahwvzn().f[5]++;
    cov_14x3ahwvzn().s[19]++;
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

  function cov_r1ckgzlm5() {
    var path = "/Users/zhaoliming/GM13/github/browser-storage/src/sessionStore.js";
    var hash = "dbdff48875d40e0fac0edf1541871515cd9535d9";
    var global = new Function("return this")();
    var gcv = "__coverage__";
    var coverageData = {
      path: "/Users/zhaoliming/GM13/github/browser-storage/src/sessionStore.js",
      statementMap: {
        "0": {
          start: {
            line: 2,
            column: 13
          },
          end: {
            line: 2,
            column: 15
          }
        },
        "1": {
          start: {
            line: 5,
            column: 14
          },
          end: {
            line: 5,
            column: 24
          }
        },
        "2": {
          start: {
            line: 14,
            column: 16
          },
          end: {
            line: 16,
            column: 1
          }
        },
        "3": {
          start: {
            line: 15,
            column: 2
          },
          end: {
            line: 15,
            column: 46
          }
        },
        "4": {
          start: {
            line: 25,
            column: 16
          },
          end: {
            line: 27,
            column: 1
          }
        },
        "5": {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 46
          }
        },
        "6": {
          start: {
            line: 35,
            column: 19
          },
          end: {
            line: 37,
            column: 1
          }
        },
        "7": {
          start: {
            line: 36,
            column: 2
          },
          end: {
            line: 36,
            column: 42
          }
        },
        "8": {
          start: {
            line: 42,
            column: 14
          },
          end: {
            line: 44,
            column: 1
          }
        },
        "9": {
          start: {
            line: 43,
            column: 2
          },
          end: {
            line: 43,
            column: 25
          }
        },
        "10": {
          start: {
            line: 52,
            column: 18
          },
          end: {
            line: 62,
            column: 1
          }
        },
        "11": {
          start: {
            line: 53,
            column: 2
          },
          end: {
            line: 61,
            column: 3
          }
        },
        "12": {
          start: {
            line: 54,
            column: 4
          },
          end: {
            line: 54,
            column: 26
          }
        },
        "13": {
          start: {
            line: 55,
            column: 19
          },
          end: {
            line: 55,
            column: 35
          }
        },
        "14": {
          start: {
            line: 56,
            column: 4
          },
          end: {
            line: 56,
            column: 24
          }
        },
        "15": {
          start: {
            line: 57,
            column: 19
          },
          end: {
            line: 57,
            column: 35
          }
        },
        "16": {
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 58,
            column: 45
          }
        },
        "17": {
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 60,
            column: 17
          }
        },
        "18": {
          start: {
            line: 70,
            column: 18
          },
          end: {
            line: 72,
            column: 1
          }
        },
        "19": {
          start: {
            line: 71,
            column: 2
          },
          end: {
            line: 71,
            column: 15
          }
        },
        "20": {
          start: {
            line: 80,
            column: 19
          },
          end: {
            line: 82,
            column: 1
          }
        },
        "21": {
          start: {
            line: 81,
            column: 2
          },
          end: {
            line: 81,
            column: 16
          }
        }
      },
      fnMap: {
        "0": {
          name: "(anonymous_0)",
          decl: {
            start: {
              line: 14,
              column: 16
            },
            end: {
              line: 14,
              column: 17
            }
          },
          loc: {
            start: {
              line: 14,
              column: 25
            },
            end: {
              line: 16,
              column: 1
            }
          },
          line: 14
        },
        "1": {
          name: "(anonymous_1)",
          decl: {
            start: {
              line: 25,
              column: 16
            },
            end: {
              line: 25,
              column: 17
            }
          },
          loc: {
            start: {
              line: 25,
              column: 32
            },
            end: {
              line: 27,
              column: 1
            }
          },
          line: 25
        },
        "2": {
          name: "(anonymous_2)",
          decl: {
            start: {
              line: 35,
              column: 19
            },
            end: {
              line: 35,
              column: 20
            }
          },
          loc: {
            start: {
              line: 35,
              column: 28
            },
            end: {
              line: 37,
              column: 1
            }
          },
          line: 35
        },
        "3": {
          name: "(anonymous_3)",
          decl: {
            start: {
              line: 42,
              column: 14
            },
            end: {
              line: 42,
              column: 15
            }
          },
          loc: {
            start: {
              line: 42,
              column: 20
            },
            end: {
              line: 44,
              column: 1
            }
          },
          line: 42
        },
        "4": {
          name: "(anonymous_4)",
          decl: {
            start: {
              line: 52,
              column: 18
            },
            end: {
              line: 52,
              column: 19
            }
          },
          loc: {
            start: {
              line: 52,
              column: 24
            },
            end: {
              line: 62,
              column: 1
            }
          },
          line: 52
        },
        "5": {
          name: "(anonymous_5)",
          decl: {
            start: {
              line: 70,
              column: 18
            },
            end: {
              line: 70,
              column: 19
            }
          },
          loc: {
            start: {
              line: 70,
              column: 27
            },
            end: {
              line: 72,
              column: 1
            }
          },
          line: 70
        },
        "6": {
          name: "(anonymous_6)",
          decl: {
            start: {
              line: 80,
              column: 19
            },
            end: {
              line: 80,
              column: 20
            }
          },
          loc: {
            start: {
              line: 80,
              column: 28
            },
            end: {
              line: 82,
              column: 1
            }
          },
          line: 80
        }
      },
      branchMap: {
        "0": {
          loc: {
            start: {
              line: 58,
              column: 11
            },
            end: {
              line: 58,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 58,
              column: 11
            },
            end: {
              line: 58,
              column: 25
            }
          }, {
            start: {
              line: 58,
              column: 29
            },
            end: {
              line: 58,
              column: 44
            }
          }],
          line: 58
        }
      },
      s: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 0,
        "21": 0
      },
      f: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
      },
      b: {
        "0": [0, 0]
      },
      _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
      hash: "dbdff48875d40e0fac0edf1541871515cd9535d9"
    };
    var coverage = global[gcv] || (global[gcv] = {});

    if (!coverage[path] || coverage[path].hash !== hash) {
      coverage[path] = coverageData;
    }

    var actualCoverage = coverage[path];
    {
      // @ts-ignore
      cov_r1ckgzlm5 = function () {
        return actualCoverage;
      };
    }
    return actualCoverage;
  }

  cov_r1ckgzlm5();
  // 键名前缀
  var preKey$2 = (cov_r1ckgzlm5().s[0]++, ''); // 测试键名

  var testKey$2 = (cov_r1ckgzlm5().s[1]++, '__test__');
  /**
   * 获取某个sessionStorage值
   *
   * @param {string} key
   * @return {string}
   * @example obj.getItem('a2')
   */

  cov_r1ckgzlm5().s[2]++;

  var getItem$2 = function getItem(key) {
    cov_r1ckgzlm5().f[0]++;
    cov_r1ckgzlm5().s[3]++;
    return sessionStorage.getItem(preKey$2 + key);
  };
  /**
   * 设置某个sessionStorage值
   *
   * @param {string} key
   * @param {string} value
   * @example obj.setItem('a2', 'b')
   */


  cov_r1ckgzlm5().s[4]++;

  var setItem$2 = function setItem(key, value) {
    cov_r1ckgzlm5().f[1]++;
    cov_r1ckgzlm5().s[5]++;
    sessionStorage.setItem(preKey$2 + key, value);
  };
  /**
   * 删除某个sessionStorage键
   *
   * @param {string} key
   * @example obj.removeItem('a2')
   */


  cov_r1ckgzlm5().s[6]++;

  var removeItem$2 = function removeItem(key) {
    cov_r1ckgzlm5().f[2]++;
    cov_r1ckgzlm5().s[7]++;
    sessionStorage.removeItem(preKey$2 + key);
  };
  /**
   * 清空sessionStorage键
   */


  cov_r1ckgzlm5().s[8]++;

  var clear = function clear() {
    cov_r1ckgzlm5().f[3]++;
    cov_r1ckgzlm5().s[9]++;
    sessionStorage.clear();
  };
  /**
   * 验证是否支持sessionStorage
   *
   * @return {boolean}
   * @example obj.isSupport()
   */


  cov_r1ckgzlm5().s[10]++;

  var isSupport$2 = function isSupport() {
    cov_r1ckgzlm5().f[4]++;
    cov_r1ckgzlm5().s[11]++;

    try {
      cov_r1ckgzlm5().s[12]++;
      setItem$2(testKey$2, 'a');
      var value1 = (cov_r1ckgzlm5().s[13]++, getItem$2(testKey$2));
      cov_r1ckgzlm5().s[14]++;
      removeItem$2(testKey$2);
      var value2 = (cov_r1ckgzlm5().s[15]++, getItem$2(testKey$2));
      cov_r1ckgzlm5().s[16]++;
      return (cov_r1ckgzlm5().b[0][0]++, value1 === 'a') && (cov_r1ckgzlm5().b[0][1]++, value2 === null);
    } catch (e) {
      cov_r1ckgzlm5().s[17]++;
      return false;
    }
  };
  /**
   * 设置键名前缀
   *
   * @param {string} key
   * @example obj.setPreKey('h5-')
   */


  cov_r1ckgzlm5().s[18]++;

  var setPreKey$2 = function setPreKey(key) {
    cov_r1ckgzlm5().f[5]++;
    cov_r1ckgzlm5().s[19]++;
    preKey$2 = key;
  };
  /**
   * 设置测试键名
   *
   * @param {string} key
   * @example obj.setTestKey('__test_key__')
   */


  cov_r1ckgzlm5().s[20]++;

  var setTestKey$2 = function setTestKey(key) {
    cov_r1ckgzlm5().f[6]++;
    cov_r1ckgzlm5().s[21]++;
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

  function cov_1oviqvp1qe() {
    var path = "/Users/zhaoliming/GM13/github/browser-storage/src/index.js";
    var hash = "64f672ce0fc4f06ff94992f1f30b952fad4d45c3";
    var global = new Function("return this")();
    var gcv = "__coverage__";
    var coverageData = {
      path: "/Users/zhaoliming/GM13/github/browser-storage/src/index.js",
      statementMap: {
        "0": {
          start: {
            line: 6,
            column: 29
          },
          end: {
            line: 6,
            column: 52
          }
        },
        "1": {
          start: {
            line: 7,
            column: 28
          },
          end: {
            line: 7,
            column: 50
          }
        },
        "2": {
          start: {
            line: 8,
            column: 30
          },
          end: {
            line: 8,
            column: 54
          }
        },
        "3": {
          start: {
            line: 11,
            column: 15
          },
          end: {
            line: 11,
            column: 19
          }
        },
        "4": {
          start: {
            line: 20,
            column: 16
          },
          end: {
            line: 33,
            column: 1
          }
        },
        "5": {
          start: {
            line: 21,
            column: 2
          },
          end: {
            line: 31,
            column: 3
          }
        },
        "6": {
          start: {
            line: 22,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        },
        "7": {
          start: {
            line: 23,
            column: 6
          },
          end: {
            line: 23,
            column: 37
          }
        },
        "8": {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        },
        "9": {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 38
          }
        },
        "10": {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        },
        "11": {
          start: {
            line: 29,
            column: 6
          },
          end: {
            line: 29,
            column: 39
          }
        },
        "12": {
          start: {
            line: 32,
            column: 2
          },
          end: {
            line: 32,
            column: 14
          }
        },
        "13": {
          start: {
            line: 43,
            column: 16
          },
          end: {
            line: 59,
            column: 1
          }
        },
        "14": {
          start: {
            line: 44,
            column: 2
          },
          end: {
            line: 57,
            column: 3
          }
        },
        "15": {
          start: {
            line: 45,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        },
        "16": {
          start: {
            line: 46,
            column: 6
          },
          end: {
            line: 46,
            column: 37
          }
        },
        "17": {
          start: {
            line: 47,
            column: 6
          },
          end: {
            line: 47,
            column: 18
          }
        },
        "18": {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        },
        "19": {
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 38
          }
        },
        "20": {
          start: {
            line: 51,
            column: 6
          },
          end: {
            line: 51,
            column: 18
          }
        },
        "21": {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 56,
            column: 5
          }
        },
        "22": {
          start: {
            line: 54,
            column: 6
          },
          end: {
            line: 54,
            column: 39
          }
        },
        "23": {
          start: {
            line: 55,
            column: 6
          },
          end: {
            line: 55,
            column: 18
          }
        },
        "24": {
          start: {
            line: 58,
            column: 2
          },
          end: {
            line: 58,
            column: 15
          }
        },
        "25": {
          start: {
            line: 68,
            column: 19
          },
          end: {
            line: 84,
            column: 1
          }
        },
        "26": {
          start: {
            line: 69,
            column: 2
          },
          end: {
            line: 82,
            column: 3
          }
        },
        "27": {
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 73,
            column: 5
          }
        },
        "28": {
          start: {
            line: 71,
            column: 6
          },
          end: {
            line: 71,
            column: 33
          }
        },
        "29": {
          start: {
            line: 72,
            column: 6
          },
          end: {
            line: 72,
            column: 18
          }
        },
        "30": {
          start: {
            line: 74,
            column: 4
          },
          end: {
            line: 77,
            column: 5
          }
        },
        "31": {
          start: {
            line: 75,
            column: 6
          },
          end: {
            line: 75,
            column: 34
          }
        },
        "32": {
          start: {
            line: 76,
            column: 6
          },
          end: {
            line: 76,
            column: 18
          }
        },
        "33": {
          start: {
            line: 78,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        },
        "34": {
          start: {
            line: 79,
            column: 6
          },
          end: {
            line: 79,
            column: 35
          }
        },
        "35": {
          start: {
            line: 80,
            column: 6
          },
          end: {
            line: 80,
            column: 18
          }
        },
        "36": {
          start: {
            line: 83,
            column: 2
          },
          end: {
            line: 83,
            column: 15
          }
        },
        "37": {
          start: {
            line: 92,
            column: 20
          },
          end: {
            line: 94,
            column: 1
          }
        },
        "38": {
          start: {
            line: 93,
            column: 2
          },
          end: {
            line: 93,
            column: 17
          }
        },
        "39": {
          start: {
            line: 102,
            column: 18
          },
          end: {
            line: 106,
            column: 1
          }
        },
        "40": {
          start: {
            line: 103,
            column: 2
          },
          end: {
            line: 103,
            column: 29
          }
        },
        "41": {
          start: {
            line: 104,
            column: 2
          },
          end: {
            line: 104,
            column: 28
          }
        },
        "42": {
          start: {
            line: 105,
            column: 2
          },
          end: {
            line: 105,
            column: 30
          }
        }
      },
      fnMap: {
        "0": {
          name: "(anonymous_0)",
          decl: {
            start: {
              line: 20,
              column: 16
            },
            end: {
              line: 20,
              column: 17
            }
          },
          loc: {
            start: {
              line: 20,
              column: 25
            },
            end: {
              line: 33,
              column: 1
            }
          },
          line: 20
        },
        "1": {
          name: "(anonymous_1)",
          decl: {
            start: {
              line: 43,
              column: 16
            },
            end: {
              line: 43,
              column: 17
            }
          },
          loc: {
            start: {
              line: 43,
              column: 32
            },
            end: {
              line: 59,
              column: 1
            }
          },
          line: 43
        },
        "2": {
          name: "(anonymous_2)",
          decl: {
            start: {
              line: 68,
              column: 19
            },
            end: {
              line: 68,
              column: 20
            }
          },
          loc: {
            start: {
              line: 68,
              column: 28
            },
            end: {
              line: 84,
              column: 1
            }
          },
          line: 68
        },
        "3": {
          name: "(anonymous_3)",
          decl: {
            start: {
              line: 92,
              column: 20
            },
            end: {
              line: 92,
              column: 21
            }
          },
          loc: {
            start: {
              line: 92,
              column: 29
            },
            end: {
              line: 94,
              column: 1
            }
          },
          line: 92
        },
        "4": {
          name: "(anonymous_4)",
          decl: {
            start: {
              line: 102,
              column: 18
            },
            end: {
              line: 102,
              column: 19
            }
          },
          loc: {
            start: {
              line: 102,
              column: 27
            },
            end: {
              line: 106,
              column: 1
            }
          },
          line: 102
        }
      },
      branchMap: {
        "0": {
          loc: {
            start: {
              line: 22,
              column: 4
            },
            end: {
              line: 24,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 22,
              column: 4
            },
            end: {
              line: 24,
              column: 5
            }
          }, {
            start: {
              line: 22,
              column: 4
            },
            end: {
              line: 24,
              column: 5
            }
          }],
          line: 22
        },
        "1": {
          loc: {
            start: {
              line: 22,
              column: 8
            },
            end: {
              line: 22,
              column: 43
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 22,
              column: 8
            },
            end: {
              line: 22,
              column: 20
            }
          }, {
            start: {
              line: 22,
              column: 24
            },
            end: {
              line: 22,
              column: 43
            }
          }],
          line: 22
        },
        "2": {
          loc: {
            start: {
              line: 25,
              column: 4
            },
            end: {
              line: 27,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 25,
              column: 4
            },
            end: {
              line: 27,
              column: 5
            }
          }, {
            start: {
              line: 25,
              column: 4
            },
            end: {
              line: 27,
              column: 5
            }
          }],
          line: 25
        },
        "3": {
          loc: {
            start: {
              line: 25,
              column: 8
            },
            end: {
              line: 25,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 25,
              column: 8
            },
            end: {
              line: 25,
              column: 20
            }
          }, {
            start: {
              line: 25,
              column: 24
            },
            end: {
              line: 25,
              column: 44
            }
          }],
          line: 25
        },
        "4": {
          loc: {
            start: {
              line: 28,
              column: 4
            },
            end: {
              line: 30,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 28,
              column: 4
            },
            end: {
              line: 30,
              column: 5
            }
          }, {
            start: {
              line: 28,
              column: 4
            },
            end: {
              line: 30,
              column: 5
            }
          }],
          line: 28
        },
        "5": {
          loc: {
            start: {
              line: 28,
              column: 8
            },
            end: {
              line: 28,
              column: 45
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 28,
              column: 8
            },
            end: {
              line: 28,
              column: 20
            }
          }, {
            start: {
              line: 28,
              column: 24
            },
            end: {
              line: 28,
              column: 45
            }
          }],
          line: 28
        },
        "6": {
          loc: {
            start: {
              line: 45,
              column: 4
            },
            end: {
              line: 48,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 45,
              column: 4
            },
            end: {
              line: 48,
              column: 5
            }
          }, {
            start: {
              line: 45,
              column: 4
            },
            end: {
              line: 48,
              column: 5
            }
          }],
          line: 45
        },
        "7": {
          loc: {
            start: {
              line: 45,
              column: 8
            },
            end: {
              line: 45,
              column: 43
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 45,
              column: 8
            },
            end: {
              line: 45,
              column: 20
            }
          }, {
            start: {
              line: 45,
              column: 24
            },
            end: {
              line: 45,
              column: 43
            }
          }],
          line: 45
        },
        "8": {
          loc: {
            start: {
              line: 49,
              column: 4
            },
            end: {
              line: 52,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 49,
              column: 4
            },
            end: {
              line: 52,
              column: 5
            }
          }, {
            start: {
              line: 49,
              column: 4
            },
            end: {
              line: 52,
              column: 5
            }
          }],
          line: 49
        },
        "9": {
          loc: {
            start: {
              line: 49,
              column: 8
            },
            end: {
              line: 49,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 49,
              column: 8
            },
            end: {
              line: 49,
              column: 20
            }
          }, {
            start: {
              line: 49,
              column: 24
            },
            end: {
              line: 49,
              column: 44
            }
          }],
          line: 49
        },
        "10": {
          loc: {
            start: {
              line: 53,
              column: 4
            },
            end: {
              line: 56,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 53,
              column: 4
            },
            end: {
              line: 56,
              column: 5
            }
          }, {
            start: {
              line: 53,
              column: 4
            },
            end: {
              line: 56,
              column: 5
            }
          }],
          line: 53
        },
        "11": {
          loc: {
            start: {
              line: 53,
              column: 8
            },
            end: {
              line: 53,
              column: 45
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 53,
              column: 8
            },
            end: {
              line: 53,
              column: 20
            }
          }, {
            start: {
              line: 53,
              column: 24
            },
            end: {
              line: 53,
              column: 45
            }
          }],
          line: 53
        },
        "12": {
          loc: {
            start: {
              line: 70,
              column: 4
            },
            end: {
              line: 73,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 70,
              column: 4
            },
            end: {
              line: 73,
              column: 5
            }
          }, {
            start: {
              line: 70,
              column: 4
            },
            end: {
              line: 73,
              column: 5
            }
          }],
          line: 70
        },
        "13": {
          loc: {
            start: {
              line: 70,
              column: 8
            },
            end: {
              line: 70,
              column: 43
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 70,
              column: 8
            },
            end: {
              line: 70,
              column: 20
            }
          }, {
            start: {
              line: 70,
              column: 24
            },
            end: {
              line: 70,
              column: 43
            }
          }],
          line: 70
        },
        "14": {
          loc: {
            start: {
              line: 74,
              column: 4
            },
            end: {
              line: 77,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 74,
              column: 4
            },
            end: {
              line: 77,
              column: 5
            }
          }, {
            start: {
              line: 74,
              column: 4
            },
            end: {
              line: 77,
              column: 5
            }
          }],
          line: 74
        },
        "15": {
          loc: {
            start: {
              line: 74,
              column: 8
            },
            end: {
              line: 74,
              column: 44
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 74,
              column: 8
            },
            end: {
              line: 74,
              column: 20
            }
          }, {
            start: {
              line: 74,
              column: 24
            },
            end: {
              line: 74,
              column: 44
            }
          }],
          line: 74
        },
        "16": {
          loc: {
            start: {
              line: 78,
              column: 4
            },
            end: {
              line: 81,
              column: 5
            }
          },
          type: "if",
          locations: [{
            start: {
              line: 78,
              column: 4
            },
            end: {
              line: 81,
              column: 5
            }
          }, {
            start: {
              line: 78,
              column: 4
            },
            end: {
              line: 81,
              column: 5
            }
          }],
          line: 78
        },
        "17": {
          loc: {
            start: {
              line: 78,
              column: 8
            },
            end: {
              line: 78,
              column: 45
            }
          },
          type: "binary-expr",
          locations: [{
            start: {
              line: 78,
              column: 8
            },
            end: {
              line: 78,
              column: 20
            }
          }, {
            start: {
              line: 78,
              column: 24
            },
            end: {
              line: 78,
              column: 45
            }
          }],
          line: 78
        }
      },
      s: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 0,
        "21": 0,
        "22": 0,
        "23": 0,
        "24": 0,
        "25": 0,
        "26": 0,
        "27": 0,
        "28": 0,
        "29": 0,
        "30": 0,
        "31": 0,
        "32": 0,
        "33": 0,
        "34": 0,
        "35": 0,
        "36": 0,
        "37": 0,
        "38": 0,
        "39": 0,
        "40": 0,
        "41": 0,
        "42": 0
      },
      f: {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
      },
      b: {
        "0": [0, 0],
        "1": [0, 0],
        "2": [0, 0],
        "3": [0, 0],
        "4": [0, 0],
        "5": [0, 0],
        "6": [0, 0],
        "7": [0, 0],
        "8": [0, 0],
        "9": [0, 0],
        "10": [0, 0],
        "11": [0, 0],
        "12": [0, 0],
        "13": [0, 0],
        "14": [0, 0],
        "15": [0, 0],
        "16": [0, 0],
        "17": [0, 0]
      },
      _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
      hash: "64f672ce0fc4f06ff94992f1f30b952fad4d45c3"
    };
    var coverage = global[gcv] || (global[gcv] = {});

    if (!coverage[path] || coverage[path].hash !== hash) {
      coverage[path] = coverageData;
    }

    var actualCoverage = coverage[path];
    {
      // @ts-ignore
      cov_1oviqvp1qe = function () {
        return actualCoverage;
      };
    }
    return actualCoverage;
  }

  cov_1oviqvp1qe();

  var cookieStoreIsSupport = (cov_1oviqvp1qe().s[0]++, cookieStore.isSupport());
  var localStoreIsSupport = (cov_1oviqvp1qe().s[1]++, localStore.isSupport());
  var seesionStoreIsSupport = (cov_1oviqvp1qe().s[2]++, seesionStore.isSupport()); // 存储方式优先级

  var priority = (cov_1oviqvp1qe().s[3]++, 'lc');
  /**
   * 获取某个值
   *
   * @param {string} key
   * @return {string}
   * @example obj.getItem('a2')
   */

  cov_1oviqvp1qe().s[4]++;

  var getItem$3 = function getItem(key) {
    cov_1oviqvp1qe().f[0]++;
    cov_1oviqvp1qe().s[5]++;

    var _iterator = _createForOfIteratorHelper(priority),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var type = _step.value;
        cov_1oviqvp1qe().s[6]++;

        if ((cov_1oviqvp1qe().b[1][0]++, type === 'l') && (cov_1oviqvp1qe().b[1][1]++, localStoreIsSupport)) {
          cov_1oviqvp1qe().b[0][0]++;
          cov_1oviqvp1qe().s[7]++;
          return localStore.getItem(key);
        } else {
          cov_1oviqvp1qe().b[0][1]++;
        }

        cov_1oviqvp1qe().s[8]++;

        if ((cov_1oviqvp1qe().b[3][0]++, type === 'c') && (cov_1oviqvp1qe().b[3][1]++, cookieStoreIsSupport)) {
          cov_1oviqvp1qe().b[2][0]++;
          cov_1oviqvp1qe().s[9]++;
          return cookieStore.getItem(key);
        } else {
          cov_1oviqvp1qe().b[2][1]++;
        }

        cov_1oviqvp1qe().s[10]++;

        if ((cov_1oviqvp1qe().b[5][0]++, type === 's') && (cov_1oviqvp1qe().b[5][1]++, seesionStoreIsSupport)) {
          cov_1oviqvp1qe().b[4][0]++;
          cov_1oviqvp1qe().s[11]++;
          return seesionStore.getItem(key);
        } else {
          cov_1oviqvp1qe().b[4][1]++;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    cov_1oviqvp1qe().s[12]++;
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


  cov_1oviqvp1qe().s[13]++;

  var setItem$3 = function setItem(key, value) {
    cov_1oviqvp1qe().f[1]++;
    cov_1oviqvp1qe().s[14]++;

    var _iterator2 = _createForOfIteratorHelper(priority),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var type = _step2.value;
        cov_1oviqvp1qe().s[15]++;

        if ((cov_1oviqvp1qe().b[7][0]++, type === 'l') && (cov_1oviqvp1qe().b[7][1]++, localStoreIsSupport)) {
          cov_1oviqvp1qe().b[6][0]++;
          cov_1oviqvp1qe().s[16]++;
          localStore.setItem(key, value);
          cov_1oviqvp1qe().s[17]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[6][1]++;
        }

        cov_1oviqvp1qe().s[18]++;

        if ((cov_1oviqvp1qe().b[9][0]++, type === 'c') && (cov_1oviqvp1qe().b[9][1]++, cookieStoreIsSupport)) {
          cov_1oviqvp1qe().b[8][0]++;
          cov_1oviqvp1qe().s[19]++;
          cookieStore.setItem(key, value);
          cov_1oviqvp1qe().s[20]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[8][1]++;
        }

        cov_1oviqvp1qe().s[21]++;

        if ((cov_1oviqvp1qe().b[11][0]++, type === 's') && (cov_1oviqvp1qe().b[11][1]++, seesionStoreIsSupport)) {
          cov_1oviqvp1qe().b[10][0]++;
          cov_1oviqvp1qe().s[22]++;
          seesionStore.setItem(key, value);
          cov_1oviqvp1qe().s[23]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[10][1]++;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    cov_1oviqvp1qe().s[24]++;
    return false;
  };
  /**
   * 删除某个键值
   *
   * @param {string} key
   * @return {boolean} 是否删除成功
   * @example obj.removeItem('a2')
   */


  cov_1oviqvp1qe().s[25]++;

  var removeItem$3 = function removeItem(key) {
    cov_1oviqvp1qe().f[2]++;
    cov_1oviqvp1qe().s[26]++;

    var _iterator3 = _createForOfIteratorHelper(priority),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var type = _step3.value;
        cov_1oviqvp1qe().s[27]++;

        if ((cov_1oviqvp1qe().b[13][0]++, type === 'l') && (cov_1oviqvp1qe().b[13][1]++, localStoreIsSupport)) {
          cov_1oviqvp1qe().b[12][0]++;
          cov_1oviqvp1qe().s[28]++;
          localStore.removeItem(key);
          cov_1oviqvp1qe().s[29]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[12][1]++;
        }

        cov_1oviqvp1qe().s[30]++;

        if ((cov_1oviqvp1qe().b[15][0]++, type === 'c') && (cov_1oviqvp1qe().b[15][1]++, cookieStoreIsSupport)) {
          cov_1oviqvp1qe().b[14][0]++;
          cov_1oviqvp1qe().s[31]++;
          cookieStore.removeItem(key);
          cov_1oviqvp1qe().s[32]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[14][1]++;
        }

        cov_1oviqvp1qe().s[33]++;

        if ((cov_1oviqvp1qe().b[17][0]++, type === 's') && (cov_1oviqvp1qe().b[17][1]++, seesionStoreIsSupport)) {
          cov_1oviqvp1qe().b[16][0]++;
          cov_1oviqvp1qe().s[34]++;
          seesionStore.removeItem(key);
          cov_1oviqvp1qe().s[35]++;
          return true;
        } else {
          cov_1oviqvp1qe().b[16][1]++;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    cov_1oviqvp1qe().s[36]++;
    return false;
  };
  /**
   * 设置存储方式优先级
   *
   * @param {string} key
   * @example obj.setPriority('lcs')
   */


  cov_1oviqvp1qe().s[37]++;

  var setPriority = function setPriority(key) {
    cov_1oviqvp1qe().f[3]++;
    cov_1oviqvp1qe().s[38]++;
    priority = key;
  };
  /**
   * 设置键名前缀
   *
   * @param {string} key
   * @example obj.setPreKey('h5-')
   */


  cov_1oviqvp1qe().s[39]++;

  var setPreKey$3 = function setPreKey(key) {
    cov_1oviqvp1qe().f[4]++;
    cov_1oviqvp1qe().s[40]++;
    cookieStore.setPreKey(key);
    cov_1oviqvp1qe().s[41]++;
    localStore.setPreKey(key);
    cov_1oviqvp1qe().s[42]++;
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

  return index;

})));
