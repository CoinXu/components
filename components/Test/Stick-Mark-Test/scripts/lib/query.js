/**
 * @class Marmoset.core.dom.query
 * ## 返回一个带DOM操作函数的 query 对象，类似于jquery。
 *
 * @mixins  Marmoset.core.dom.dom
 * @mixins  Marmoset.core.event
 *
 * @requires Marmoset.core.event
 * @requires Marmoset.lang
 * @requires Marmoset.core.dom.dom
 */

var lang = require('./lang');
var event = require('./event');
var dom = require('./dom');

var doc = document;
var version = '0.1.0';
var arr = [];

/**
 * @param selector
 * @param context
 * @returns {query.fn.init}
 */
var query = function (selector, context) {
    return new query.fn.init(selector, context);
};

query.fn = query.prototype = {

    /**
     * @property
     */
    length: 0,

    /**
     * @property
     */
    version: version,

    /**
     * @property
     */
    constructor: query,

    /**
     * 查找DOM
     * @param selector
     * @param context
     * @returns {Node[]}
     */
    query: function (selector, context) {
        return this.isNode(selector) ?
            [selector] :
        this.ensureContext(context)
            .querySelectorAll(selector) || [];
    },

    /**
     * 确定查找的context
     * @param context
     * @returns {*|HTMLDocument}
     */
    ensureContext: function (context) {
        return this.isNode(context) ? context : doc;
    },

    /**
     * 判断是否是一个 Node
     * @param node
     * @returns {*|boolean}
     */
    isNode: function (node) {
        return node && node.nodeType === 1;
    },

    push: arr.push,
    sort: arr.sort,
    splice: arr.splice
};

query.fn.init = function (selector, context) {
    if (!selector) {
        return this;
    }
    return query.merge(query(null), this.query(selector, context));
};

query.fn.init.prototype = query.fn;

/**
 * @static
 * 以length属性为基准合并两个对象
 * @param first
 * @param second
 * @returns {*}
 */
query.merge = function (first, second) {
    var i = first.length,
        len = second.length,
        j = 0;

    for (; j < len; j++) {
        first[i++] = second[j];
    }
    first.length = i;
    return first;
};

// 将 event 方法扩展给 query
lang.extend(query.prototype, event);
// 扩展dom
lang.extend(query.prototype, dom);

module.exports = query;
