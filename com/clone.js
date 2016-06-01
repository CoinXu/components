/**
 * Created by xcp on 2016/4/19.
 */

var toString = Object.prototype.toString;
var OBJECT_TYPE = '[object Object]';
var ARRAY_TYPE = '[object Array]';

var _isObject = function (obj) {
    return toString.call(obj) === OBJECT_TYPE
};
var _isArray = Object.isArray || function (obj) {
        return toString.call(obj) === ARRAY_TYPE;
    };

function cloneWithModern(obj) {
    var result = null;
    try {
        result = JSON.parse(JSON.stringify(obj));
    } catch (e) {
    }

    return result;
}

function cloneWithCompatible(obj, deep) {
    var isObject = _isObject(obj);
    var isArray = _isArray(obj);

    if (!(isArray || isObject)) {
        return obj;
    }

    var n = isArray ? [] : {};
    var cur, k;
    if (isArray) {
        for (k = 0; (cur = obj[k++]);) {
            n[k] = deep ? clone(cur, deep) : cur;
        }
    } else if (isObject) {
        for (k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            n[k] = deep ? clone(obj[k], deep) : obj[k]
        }
    }
    return n;
}

function clone(obj, deep) {
    // 使用JSON.parse,如果内容中有DOM对象就惨了
    // 所以还是用递归吧
    // if (deep && JSON && JSON.parse) {
    //     return cloneWithModern(obj)
    // }
    return cloneWithCompatible(obj, deep)
}

module.exports = clone;