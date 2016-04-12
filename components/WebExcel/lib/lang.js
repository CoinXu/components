/**
 * @class Marmoset.lang
 * @type {Object}
 * @alternateClassName lang
 * ## 主要弥补 javaScript 语言层面上的不足
 */

"use strict";

var c = module.exports;

/**
 * @type {Function}
 */
var noop = function () {
};
var Constructor = function () {
};

/**
 * @property
 * 版本号
 * @type {string}
 */
c.version = '0.1.0';

var ArrayProto = Array.prototype,
    ObjectProto = Object.prototype;

var
// Array
    nativeIsArray = Array.isArray,
    nativeForEach = Array.prototype.forEach,

// Object
    nativeKeys = Object.keys,
    nativeCreate = Object.create,

// String
    nativeTrim = String.prototype.trim;

// ==========
// If len ≤ +0, return +0.
// If len is +∞, return 253-1.
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * @private
 * @param type
 * @returns {Function}
 */
function _isType(type) {
    return function (obj) {
        return ObjectProto.toString.call(obj) === '[object ' + type + ']';
    };
}

/**
 *
 * @param obj
 * @returns {boolean}
 * @private
 */
function _isArrayLike(obj) {
    var len = obj && obj.length;
    return typeof len === 'number' && len >= 0 && len <= MAX_SAFE_INTEGER;
}

/**
 *
 * @param value
 * @returns {number}
 * @private
 */
function _toInteger(value) {
    var number = Number(value);
    if (isNaN(number)) {
        return 0;
    }
    if (number === 0 || !isFinite(number)) {
        return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
}

/**
 *
 * @param obj
 * @returns {number}
 * @private
 */
function _getLength(obj) {
    return Math.min(Math.max(_toInteger(obj.length), 0), MAX_SAFE_INTEGER);
}

/**
 *
 * @param obj
 * @param iterator
 * @param context
 * @returns {*}
 * @private
 */
function _each(obj, iterator, context) {
    if (!(typeof obj === 'function' || (typeof obj === 'object') && obj)) {
        return obj;
    }

    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        if (iterator.call(context, obj[i], i, obj)) {
            break;
        }
    }
}

/**
 *
 * @param arr
 * @param iterator
 * @param context
 * @param fromIndex
 * @returns {*}
 * @private
 */
function __forEach(arr, iterator, context, fromIndex) {
    if (!_isArrayLike(arr)) {
        return arr;
    }
    iterator = _ensureCallback(iterator);
    for (var i = _toInteger(fromIndex), len = _getLength(arr); i < len; i++) {
        if (iterator.call(context, arr[i], i, arr)) {
            break;
        }
    }
}

/**
 * @param arr
 * @param iterator
 * @param context
 * @private
 */
function _forEach(arr, iterator, context) {
    iterator = _ensureCallback(iterator);
    if (nativeForEach) {
        nativeForEach.call(arr, function () {
            iterator.apply(context, arguments);
        });
    } else {
        __forEach(arr, function (k, v, a) {
            iterator.call(context, k, v, a);
        }, context, 0);
    }
}

/**
 * @param callback
 * @returns {Function}
 * @private
 */
function _ensureCallback(callback) {
    return ObjectProto.toString.call(callback) === '[object Function]' ? callback : noop;
}

/**
 *
 * @param prototype
 * @returns {*}
 * @private
 */
function _create(prototype) {
    if (nativeCreate) {
        return nativeCreate(prototype);
    }

    var result;
    if (!c.isObject(prototype)) {
        return {};
    }
    Constructor.prototype = prototype;
    result = new Constructor();
    Constructor.prototype = null;
    return result;
}

var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

/**
 *
 * @param obj
 * @param keys
 * @private
 */
var _collectNonEnumProps = function (obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = c.isFunction(constructor) && constructor.prototype || ObjectProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (obj.hasOwnProperty(prop) && c.indexOf(keys, prop) === -1) keys.push(prop);

    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] &&
            c.indexOf(keys, prop) === -1) {
            keys.push(prop);
        }
    }
};

/**
 *
 * @param obj
 * @returns {Array}
 * @private
 */
function _keys(obj) {
    if (nativeKeys) {
        return nativeKeys(obj);
    }

    var _keys = [];

    _each(obj, function (v, i) {
        _keys.push(i);
    });

    if (hasEnumBug) {
        _collectNonEnumProps(obj, keys);
    }
    return _keys;
}

/**
 *
 * @param str
 * @returns {*}
 * @private
 */
function _trim(str) {
    if (!c.isString(str)) {
        return str;
    }
    // 凡是ascii码 <= 32 (空白符)，一律认为是空白符
    var start = 0, space = 32, last = str.length - 1, end = last;

    // 左边
    while (str.charCodeAt(start) <= space && start <= end) {
        start++;
    }
    // 右边
    while (str.charCodeAt(end) <= space && end >= start) {
        end--;
    }
    return (start > 0 || end < last) ?
        str.substring(start, end + 1) : str;
}

// _isType
var objectTypes = [
    'Arguments', 'Array',
    'Date',
    'Error',
    'Function',
    'Null', 'Number',
    'Object',
    'RegExp',
    'String',
    'Undefined'
];

/**
 * @method isArguments
 * 判断是否是一个 arguments 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isDate
 * 判断是否是一个 Date 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isError
 * 判断是否是一个 Error 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isFunction
 * 判断是否是一个 Function 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isNull
 * 判断是否是一个 Null 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isObject
 * 判断是否是一个 Object 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isRegExp
 * 判断是否是一个 RegExp 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isString
 * 判断是否是一个 String 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

/**
 * @method isUndefined
 * 判断是否是一个 Undefined 对象
 * @param {*} obj
 * @returns {Boolean}
 * @type {Function}
 */

__forEach(objectTypes, function (name) {
    this['is' + name] = _isType(name);
}, c);

/**
 * @method
 * 判断 obj 是否是 NaN
 * @param obj
 * @returns {boolean}
 */
c.isNaN = function (obj) {
    return obj !== obj;
};

var _isNumber = c.isNumber;

/**
 * @method isNumber
 * 判断是否是一个 Number 对象
 * @param {*} num
 * @returns {Boolean}
 */
c.isNumber = function (num) {
    return !c.isNaN(num) && _isNumber(num);
};

/**
 * @method isArray
 * 判断是否是一个 Array 对象
 * {@link Array#static-method-isArray Array.isArray} 的兼容版本
 * @param {*}
 * @returns {Boolean}
 */

c.isArray = nativeIsArray || c.isArray;

//
// util

/**
 * @method
 * 遍历一个 Object，并执行回调
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object|null} context
 * @type {Function}
 */
c.each = _each;

/**
 * @method
 * {@link Array#method-forEach}的兼容版本。
 * 遍历一个 Array，并执行回调
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object|null} context
 * @type {Function}
 */
c.forEach = _forEach;

/**
 * @method
 * 判断传入对象是否是一个类数组对象
 * @param {Object} obj
 * @type {Function}
 * @returns {Boolean}
 */
c.isArrayLike = _isArrayLike;

/**
 * @method
 * 将传入的对象转换成整数
 * @type {Function}
 * @returns {Boolean}
 */
c.toInteger = _toInteger;

/**
 * @method
 * 获取传入对象的 length 属性
 * @type {Function}
 * @returns {Number}
 */
c.getLength = _getLength;

/**
 * @method
 * 扩展一个对象：用 destination 对象上的属性 overwrite target 上的属性
 * @param {Object} target
 * @param {Object} destination
 * @returns {Object} target
 */
c.extend = function (target, destination) {
    _each(destination, function (v, p) {
        this[p] = v;
    }, target);
};

/**
 * @method
 * Child 继承 Super 的属性
 * @param {Function} Super
 * @param {Function} Child
 * @returns {Function} Child
 */
c.inherit = function (Super, Child) {
    if (!(c.isFunction(Super) &&
        c.isFunction(Child))) {
        return Child;
    }

    // 缓存 Child.prototype
    var cachePrototype = Child.prototype;
    // 继承 Super.prototype
    Child.prototype = _create(Super.prototype);
    // 拿回Child.prototype本身的
    c.extend(Child.prototype, cachePrototype);

    return Child;
};

//
// Object

/**
 * @method
 * {@link Object#static-method-create Object.create} 的兼容版本
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 * @param {Object} property
 * @type {Function}
 */
c.create = _create;

/**
 * @method
 * {@link Object#static-method-keys Object.keys} 的兼容版本
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * @param {Object}
 * @type {Function}
 */
c.keys = _keys;

/**
 * @method
 * 如果 target 上没有属性，就用后续传入的对象的属性覆盖，且只覆盖一次。
 * @param {Object...} target
 * @returns {Object} target
 */
c.defaults = function (target) {
    var len = arguments.length;
    if (len < 2 || !c.isObject(target)) {
        return target;
    }
    _forEach(ArrayProto.slice.call(arguments, 1), function (obj) {
        _each(obj, function (val, prop) {
            if (!target.hasOwnProperty(prop) || target[prop] === void 0) {
                target[prop] = val;
            }
        });
    });

    return target;
};

//
// Array

/**
 * @method
 * {@link Array#method-map Array.prototype.every} 的兼容版本
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object|null} thisArg
 * @returns {Array}
 */
c.map = function (arr, callback, thisArg) {
    if (!c.isArray(arr)) {
        return arr;
    }
    var ret = [];
    __forEach(arr, function (v, i, a) {
        ret.push(callback.call(thisArg, v, i, a));
    }, thisArg, 0);

    return ret;
};

/**
 * @method
 * {@link Array#method-every Array.prototype.every} 的兼容版本
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object|null} thisArg
 * @returns {Boolean}
 */
c.every = function (arr, callback, thisArg) {
    var ret = true;
    callback = _ensureCallback(callback);

    __forEach(arr, function (k, v, a) {
        return !(ret = callback.call(thisArg, k, v, a));
    }, thisArg, 0);

    return ret;
};

/**
 * @method
 * {@link Array#method-fill Array.prototype.fill} 的兼容版本
 * @param {Array|Object} arrayLike
 * @param {Object} value
 * @param {Number} start
 * @param {Number} end
 * @returns {Array}
 */
c.fill = function (arrayLike, value, start, end) {
    if (!_isArrayLike(arrayLike) || c.isNaN(value)) {
        return arrayLike;
    }

    var len = _getLength(arrayLike);

    start = _toInteger(start);
    end = _toInteger(end) || len;

    start = start < 0 ?
        Math.max(len + start, 0) :
        Math.min(start, len);

    end = end < 0 ?
        Math.max(len + end, 0) :
        Math.min(end, len);

    for (; start < end; start++) {
        arrayLike[start] = value;
    }
    return arrayLike;
};

/**
 * @method
 * {@link Array#method-filter Array.prototype.filter} 的兼容版本
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object} thisArg
 * @returns {Array}
 */
c.filter = function (arr, callback, thisArg) {
    var ret;
    if (!c.isArray(arr)) {
        return arr;
    }

    ret = [];
    callback = _ensureCallback(callback);

    __forEach(arr, function (v, k, a) {
        if (callback.call(thisArg, v, k, a)) {
            ret.push(v);
        }
    }, null, 0);

    return ret;
};

/**
 * @method
 * {@link Array#method-findIndex Array.prototype.findIndex} 的兼容版本
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object} thisArg
 * @param {Number} fromIndex
 * @returns {Number}
 */
c.findIndex = function (arr, callback, thisArg, fromIndex) {
    var index = -1;
    callback = _ensureCallback(callback);

    __forEach(arr, function (v, k, a) {
        if (callback.call(thisArg, v, k, a)) {
            return (index = k) !== -1;
        }
    }, null, fromIndex);

    return index;
};

/**
 * @method
 * {@link Array#method-some Array.prototype.some} 的兼容版本
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object} thisArg
 * @returns {boolean}
 */
c.some = function (arr, callback, thisArg) {
    return c.findIndex(arr, callback, thisArg, 0) !== -1;
};

/**
 * @method
 * {@link Array#method-indexOf indexOf} 的兼容版本
 * @param arr
 * @param value
 * @param fromIndex
 * @returns {number}
 */
c.indexOf = function (arr, value, fromIndex) {
    return c.findIndex(arr, function (k) {
        return k === value;
    }, null, fromIndex);
};

//
// String

/**
 * @method
 * {@link String#method-trim} String.prototype.trim 的弥补
 * @param {String} str
 * @return {String}
 */
c.trim = nativeTrim ?
    function (str) {
        return nativeTrim.call(str);
    } :
    _trim;

/**
 * @method
 * 数字转为unicode
 * @param integer
 * @returns {string}
 */
c.integerToUnicode = function (integer) {
    integer = _toInteger(integer);
    var c = integer.toString(16);
    while (c.length < 4) {
        c = '0' + c;
    }
    return '\\u' + c;
};

/**
 * @method
 * 字符转为unicode
 * @param str
 * @returns {Array|String}
 */
c.stringToUnicode = function (str) {
    if (!c.isString(str)) {
        return '';
    }

    var r = [], i = 0, l = str.length;
    for (; i < l; i++) {
        r.push(c.integerToUnicode(str.charCodeAt(i)));
    }
    return r.join('');
};

/**
 * @method
 * unicode 转为字符
 * @param unicodeStr
 * @returns {string}
 */
c.unicodeToString = function (unicodeStr) {
    var str = '';
    try {
        str = eval('"' + unicodeStr + '"');
    } catch (e) {
        throw e;
    }
    return str;
};

/**
 * @method
 * char转为字符
 * @param {Number} integer
 * @returns {String}
 */
c.integerToString = function (integer) {
    return c.unicodeToString(c.integerToUnicode(integer));
};

/**
 * @method
 * 整数数组转为字符
 * @param list
 * @returns {string}
 */
c.integerListToString = function (list) {
    var strArr = [];
    try {
        _forEach(list, function (integer) {
            strArr.push(c.integerToString(integer));
        }, c);
    } catch (e) {
        throw e;
    }

    return strArr.join('');
};

/**
 * @method
 * 字符转整数
 * @param str
 * @returns {*}
 */
c.stringToInteger = function (str) {
    if (!c.isString(str)) {
        return NaN;
    }
    var arr = ArrayProto.slice.call(str);
    arr = c.map(arr, function (v) {
        return v.charCodeAt(0);
    }, null);
    return arr.length === 1 ? arr[0] : arr;
};

c.isUnicode = function (unicode) {

};

var UNICODE_REG = /(?:^\\[uU][A-Fa-f\d]{4}$)+/;
var UNICODE_PREFIX = /^(?:\\[uU])/;
var UNICODE_MAP = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15,
    'p0': Math.pow(16, 0), 'p1': Math.pow(16, 1), 'p2': Math.pow(16, 2), 'p3': Math.pow(16, 3)
};

/**
 * @method
 * unicode 转整数
 * @param unicode
 * @returns {Number}
 */
c.unicodeToInteger = function (unicode) {
    if (!UNICODE_REG.test(unicode)) {
        return NaN;
    }
    unicode = unicode.replace(UNICODE_PREFIX, '');
    var integer = 0;
    var cur, i, len = unicode.length - 1;

    for (i = 0; i <= len; i++) {
        cur = UNICODE_MAP[unicode[i]];
        integer = integer + cur * UNICODE_MAP['p' + (len - i)];
    }

    return integer;
};

//
// Number

/**
 * 生成指定个数、指定范围的随机数
 * @param length
 * @param min
 * @param max
 * @returns {Array}
 */
c.randomRange = function (length, min, max) {
    length = _toInteger(length);
    min = _toInteger(min);
    max = _toInteger(max);

    length = length < 1 ? 1 : length;

    if (min < 0) {
        min = 0;
    }

    // 任何一个整数数[异或]另一个整数之后得到一个结果
    // 可以用这个结果再去[异或]另一个数得到原来的值
    // x = x ^ y 后，可用 x = x ^ y 得到 x 的原来值

    // 如果min > max 交换两个的值
    if (min > max) {
        min = min ^ max;
        max = min ^ max;
        min = max ^ min;
    }

    // 如果 min 到 max 之前没有的足够的数用于生成随机数
    // 则将 max 后移到恰当的位置
    max = max - min < length ?
    max + (length - (max - min)) :
        max;

    var list = [];
    var record = {};
    var random = null;


    while (list.length < length) {
        random = c.range(max, min);
        if (record[random] !== 'c') {
            list.push(random);
            record[random] = 'c';
        }
    }

    return list;
};

/**
 * 生成一个指定范围的随机数
 * @param min
 * @param max
 * @returns {Number}
 */
c.range = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
};

//
/**
 * 返回当前时间的毫秒数
 * @returns {number}
 */
c.now = function () {
    return new Date() * 1;
};

/**
 * @method
 * 日志的容错版本
 * @param {*} args
 */
c.log = function () {
    if (console && console.log) {
        Function.prototype.apply.call(console.log, console, arguments);
    }
};

/**
 * @method
 * clone 一个对象
 * @param {Object|Array} obj
 * @param {Boolean} isDeep 是否深度 clone
 * @returns {Object|Array}
 */
c.clone = function (obj, isDeep) {
    if (!(c.isArray(obj) || c.isObject(obj))) {
        return obj;
    }

    var result = null;
    try {
        result = JSON.parse(JSON.stringify(obj))
    } catch (e) {
        var each;

        if (c.isArray(obj)) {
            each = _forEach;
            result = [];
        } else {
            each = _each;
            result = {};
        }

        each(obj, function (val, prop) {
            result[prop] = (isDeep && (c.isArray(val) || c.isObject(val))) ?
                c.clone(val, isDeep) :
                val;
        })
    }
    return result;
};

c.toArray = function () {
    // http://blog.csdn.net/fmddlmyy/article/details/372148
    // https://en.wikibooks.org/wiki/Unicode/Character_reference/D000-DFFF
    // https://linux.cn/article-3759-1.html?page=1

    var symbol = /[\ud800-\udbff][\udc00-\udfff]|[\s\S]/g;

    return function (obj) {
        if (!obj) {
            return obj;
        }
        if (c.isArray(obj)) {
            return ArrayProto.slice.call(obj);
        }
        if (c.isString(obj)) {
            return obj.match(symbol);
        }
        if (_isArrayLike(obj)) {
            var ret = [], len = _getLength(obj), start = 0;

            _each(obj, function (item) {
                ret.push(item);
                start++;
                if (start >= len) {
                    return true;
                }
            });
            return ret;
        }
        return c.map(c.keys(obj), function (key) {
            return obj[key];
        }, null);
    };
}();

