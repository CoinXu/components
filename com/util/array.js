/**
 * Created by xcp on 2016/5/7.
 */

var isArray = Object.isArray || function (any) {
        return any && (typeof any === 'object') && any.constructor === Array;
    };

module.exports = {

    isArray: function (any) {
        return isArray(any)
    },

    index: function (arr, item) {
        return arr.indexOf(item);
    },

    contains: function (arr, item) {
        return this.index(arr, item) !== -1;
    },

    add: function (arr, item) {
        if (!this.contains(arr, item)) {
            arr.push(item)
        }
        return arr;
    },

    remove: function (arr, item) {
        var index = this.index(arr, item);
        if (index !== -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
};