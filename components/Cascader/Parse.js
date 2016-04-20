/**
 * Created by xcp on 2016/4/19.
 */

module.exports = Parse;

const clone = require('../../com/clone');

function Parse(models, childrenName) {
    this.PARENT_PROP = '__parent';
    this.SIBLINGS_PROP = '__siblings';
    this.CHILDREN_PROP = '__children';
    this.MODELS = clone(models);
    this.CHILDREN_NAME = childrenName || 'children';

    this.firstCascadeIdList = null;
    this.flattenMap = null;
}

Parse.prototype.init = function () {
    this.flattenMap = this.flatten(this.MODELS, this.CHILDREN_NAME);
    console.log(this.flattenMap);
    console.log(this.firstCascadeIdList);
    return this;
};

Parse.prototype.flatten = function (models, name) {
    var SIBLINGS_PROP = this.SIBLINGS_PROP,
        CHILDREN_PROP = this.CHILDREN_PROP,
        PARENT_PROP = this.PARENT_PROP,
        start = 0, recordLen = models.length;

    var cur, children, child,
        _parents, _children, _siblings, _outerSiblings;

    var i, len;

    var result = {};

    this.firstCascadeIdList = _outerSiblings = [];

    while (start < models.length) {
        cur = models[start];
        children = cur[name];

        if (start < recordLen) {
            _outerSiblings.push(cur.id);
            cur[SIBLINGS_PROP] = _outerSiblings;
            cur[PARENT_PROP] = [cur.pid];
        }

        start++;

        if (!(typeof children === 'object' && !!children && children.constructor === Array)) {
            continue;
        }

        _children = cur[CHILDREN_PROP] || [];
        _siblings = [];

        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            _parents = child[PARENT_PROP] || [];

            // 收集父级、子级、同级id
            _parents.push(cur.id);
            _children.push(child.id);
            _siblings.push(child.id);

            // 赋值
            child[PARENT_PROP] = _parents;
            child[SIBLINGS_PROP] = _siblings;

            // 子集数据追加到原始数据上
            models.push(child);
        }

        cur[CHILDREN_PROP] = _children;

        delete cur[name];
        result[cur.id] = cur;
    }

    return result;
};