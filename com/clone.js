/**
 * Created by xcp on 2016/4/19.
 */

function cloneWhithModern(obj) {
    var result = null;
    try {
        result = JSON.parse(JSON.stringify(obj));
    } catch (e) {
    }

    return result;
}

function cloneWithCompatible(obj, deep) {
    var type = typeof obj;
    var isObject = type === 'object' && !!obj;
    var isArray = isObject && obj.constructor === Array;

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

}

module.exports = function (obj, deep) {
    if (deep && JSON && JSON.parse) {
        return cloneWhithModern(obj)
    }
    return cloneWithCompatible(obj, deep)
};