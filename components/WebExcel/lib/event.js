/**
 * @class Marmoset.core.event
 * ### event 对象，用于持有 event 方法的对象
 * @type { Object }
 */

var lang = require('./lang');

// 所有的方法，先不做兼容
var event = {};

// 现在验证三种选择器
// id, class, tagName
var cssSelectorType = {
    ID: /(?:^#\w+$)/,
    // .a 或 .a.b..
    CLASS: /(?:\.\w+)+/,
    // tagName
    TAG: /(?:[a-zA-z]+)/
};

var doc = document,
    body = doc.body;

/**
 * selector 验证勾子对象
 * @private
 * @type {{type: c.type, isSelector: c.isSelector, hooks: {ID: c.hooks.ID, CLASS: c.hooks.CLASS, TAG: c.hooks.TAG}}}
 */
var c = {
    type: function (selector) {
        var type = null;
        lang.each(cssSelectorType, function (r, t) {
            return r.test(selector) && (type = t);
        });
        return type;
    },

    isSelector: function (node, selector) {
        if (!selector) {
            return true;
        }
        var handle = this.hooks[this.type(selector)];
        return lang.isFunction(handle) ?
            handle(node, selector) :
            true;
    },

    hooks: {
        /**
         * @private
         * @return {boolean}
         */
        ID: function (node, str) {
            return node.getAttribute('id') === str;
        },

        /**
         * @private
         * @return {boolean}
         */
        CLASS: function (node, str) {
            var styleNames = node.classList ||
                node.getAttribute('class').split(' ');
            var matchStyleName = str.split('.').splice(1);
            var match = true;

            lang.forEach(matchStyleName, function (v) {
                match = lang.indexOf(styleNames, v) !== -1;
            });

            return match;
        },

        /**
         * @private
         * @return {boolean}
         */
        TAG: function (node, str) {
            return node.tagName.toLocaleLowerCase() ===
                str.toLocaleLowerCase();
        }
    }
};

function on(node, type, handle, capture) {
    node.addEventListener(type, handle, capture);
    return node;
}

function off(node, type, handle, capture) {
    node.removeListener(type, handle, capture);
    return node;
}

function noop() {
}

/**
 * 绑定事件
 * @param type
 * @param selector
 * @param handle
 * @param data
 * @returns {event}
 */
event.on = function (type, selector, handle, data) {
    var node = this[0];

    if (!this._listener) {
        this._listener = {};
    }

    var listener = this._listener[type] || (this._listener[type] = []);

    listener.push(handle);

    on(node, type, function (e) {
        var target = event.closest(e.target, selector);
        if (target) {
            handle.call(target, e, target, data);
        }
    }, false);

    return this;
};

event.off = function (type, handle) {
    var node = this[0];

    // off()
    if (arguments.length === 0) {
        type = handle = null;
    }
    // off('click')
    else if (arguments.length === 1) {
        handle = null;
    }

    if (type === null) {
        lang.each(this._listener, function (_type, handles) {
            lang.forEach(handles, function (_handle) {
                off(node, _type, _handle, false);
            });
        });
    } else {
        if (handle === null) {
            handle = this._listener[type];
        } else {
            handle = lang.isArray(handle) ? handle : [handle];
        }

        lang.forEach(handle, function (handle) {
            off(node, type, handle, false);
        });
    }

    return this;
};

/**
 * 查找节 node最近的匹配 selector 的父节点
 * @param {HTMLElement|null} node
 * @param {String|HTMLElement} selector
 * @returns {HTMLElement}
 */
event.closest = function (node, selector) {
    if (arguments.length === 1) {
        selector = node;
        node = this[0];
    }

    if (!selector) {
        return node;
    }
    if (node.closest) {
        return node.closest(selector);
    }

    while (node && !c.isSelector(node, selector)) {
        node = node.parentNode;
    }

    return node;
};

/**
 * 绑定拖动事件
 * 拖动一定距离才算拖动
 * @param {String} selector
 * @param {Function} mouseDown  mouseDown 时的 handle
 * @param {Function} mouseMove mouseMove 时的 handle
 * @param {Function} mouseUp mouseUp 时的 handle
 * @param {*} data
 * @param {Number} gap 移动多少距离才触发，
 */

event.onDrag = function (selector, mouseDown,
                         mouseMove, mouseUp,
                         data, gap) {

    var start = {}, end = {}, isDown, prevTime, now;

    gap = gap || 10;
    mouseDown = mouseDown || noop;
    mouseMove = mouseMove || noop;
    mouseUp = mouseUp || noop;

    function abs(num) {
        return num < 0 ? ~num + 1 : num;
    }

    this.on('mousedown', selector, function (e, d) {
        isDown = true;
        prevTime = lang.now();
        start.x = e.pageX;
        start.y = e.pageY;
        mouseDown.call(null, e, d);
    }, data);

    this.on('mousemove', selector, function (e, d) {
        now = lang.now();

        if (now - prevTime < 20 || !isDown) {
            return null;
        }

        if (abs(start.x - e.pageX) > gap ||
            abs(start.y - e.pageY) > gap) {

            mouseMove.call(null, e, d);

            prevTime = now;
            start.x = e.pageX;
            start.y = e.pageY;
        }

    }, data);

    this.on('mouseup', selector, function (e, d) {
        isDown = false;
        mouseUp.call(null, e, d);
    }, data);
};

module.exports = event;
