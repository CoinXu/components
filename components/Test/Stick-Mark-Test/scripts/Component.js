var lang = require('./lib/lang');

var defaultsAttributes = [
    'afterRender', 'attachToDOM',
    'beforeRender', 'beforeRender',
    'content',
    'height',
    'initialize',
    'model',
    'node',
    'parent',
    'render', 'renderToString',
    'width',
    'x',
    'y'
];
var _defaultsAttributes = [
    'model', 'content', 'node', 'parent',
    'width', 'height', 'x', 'y'
];
var _defaultsObjectAttributes = [
    '_events'
];

function _extend(options) {
    var parent = this;
    var Child = function (options) {
        if (!(this instanceof Child)) {
            throw new Error('Constructor can\'t immediate called');
        }
        parent.apply(this, arguments);
    };

    lang.inherit(parent, Child);
    lang.extend(Child.prototype, options);

    Child.prototype.constructor = Child;
    Child.prototype.__super__ = this.prototype;

    Child.extend = _extend;

    return Child;
}

function Component(options) {
    if (!(this instanceof Component)) {
        throw new Error('Constructor can\'t immediate called');
    }
    this._extendFromOptions(options);
    this.initialize.apply(this, arguments);
}

lang.forEach(_defaultsAttributes, function (prop) {
    this.prototype[prop] = null;
}, Component);

/**
 * 从 `options` 中抽出 `defaultsObjectAttributes` 赋值给 `this`.
 * 外部不要调用
 * @param options
 * @returns {*}
 * @private
 */
Component.prototype._extendFromOptions = function (options) {
    if (!lang.isObject(options)) {
        return options;
    }

    // 非引用属性，可以直接继承
    lang.forEach(defaultsAttributes, function (prop) {
        if (options.hasOwnProperty(prop)) {
            this[prop] = options[prop];
        }
    }, this);

    // 对象属性，需要重写
    lang.forEach(_defaultsObjectAttributes, function (prop) {
        this[prop] = options[prop] || {};
    }, this);

    return options;
};

/**
 * 初始化函数，会将传入 `new Component(options)`
 * 中的 `options` 传给该函数
 * @param {Object} options
 */
Component.prototype.initialize = function (options) {
    // private
};

/**
 * 渲染函数
 * @param {Object} model
 * @returns {HTMLElement}
 */
Component.prototype.render = function (model) {
    this.beforeRender(this.node);
    // todo render
    return this.node;
};

/**
 * 渲染之前调用。如果 `render` 函数被 `override`，则在 `render` 函数体
 * 第一行调用 `this.beforeRender(this.node)`
 * @param {HTMLElement} node
 * @returns {HTMLElement}
 */
Component.prototype.beforeRender = function (node) {
    return node;
};

/**
 * 渲染之后调用。如果 `render` 函数被 `override`，则在 `render` 函数体
 * `return` 之前调用 `this.afterRender(this.node)`
 * @param {HTMLElement} node
 * @returns {HTMLElement}
 */
Component.prototype.afterRender = function (node) {
    return node;
};

/**
 * 将 this.node 添加到 DOM 上
 * @param {HTMLElement} parent
 * @returns {HTMLElement}
 */

Component.prototype.attachToDOM = function (parent) {
    parent = parent || this.parent;
    if (parent && parent.nodeType === 1) {
        parent.appendChild(this.node);
    }
    return this.afterRender(this.node);
};

/**
 * 将组件的节点内容转为字符串；在服务器上需要有不同的实现方法
 * @returns {*|number|string|string}
 */
Component.prototype.renderToString = function () {
    return this.content || (this.content = this.node && this.node.outerHTML || '');
};

/**
 * 向组件注册一个事件
 * @param {String} name
 * @param {Function} callback
 * @param {*} data
 * @param {Object|null} context
 * @returns {Array}
 */
Component.prototype.on = function (name, callback, data, context) {
    var seq = this._events[name] || (this._events[name] = []);
    seq.push({
        fn: callback,
        data: data,
        context: context
    });
    return seq;
};

/**
 * 触发组件的一个事件
 * @param {String} name
 * @returns {Marmoset.Component}
 */
Component.prototype.emit = function (name) {
    var list = this._events[name];
    var args = Array.prototype.slice.call(arguments, 1);
    if (list) {

        lang.forEach(list, function (event) {
            event.fn.apply(event.context,
                args.concat([event.data]));
        }, this);
    }
    return this;
};

Component.extend = _extend;

module.exports = Component;


