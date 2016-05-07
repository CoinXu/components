/**
 * Created by xcp on 2016/5/7.
 */

module.exports = {

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