/**
 * Created by xcp on 5/23/16.
 */

var array = require('./array');

function List(initialize) {
    this._list = array.isArray(initialize) ?
        initialize.slice() :
        [];
}

List.prototype.add = function (item) {
    array.add(this._list, item)
};

List.prototype.addAll = function (list) {
    list = array.isArray(list) ? list : [];
    list.forEach(function (v) {
        this.add(v)
    }, this)
};

List.prototype.remove = function (item) {
    array.remove(this._list, item)
};

List.prototype.removeAll = function () {
    this._list = [];
};

List.prototype.contains = function (item) {
    array.contains(this._list, item)
};

List.prototype.get = function (index) {
    return this._list[index] || null;
};

List.prototype.each = function (fn, scope) {
    if (typeof fn === 'function') {
        this._list.forEach(function () {
            fn.apply(scope, arguments)
        })
    }
};

List.prototype.size = function () {
    return this._list.length
};

List.prototype.toString = function () {
    return '[object List]'
};

module.exports = List;
