/**
 * Created by xcp on 2016/3/19.
 */
"use strict";

var runtimeIsNode = require('../../com/runtimeIsNode')();
var noop = require('../../com/noop');
var ReactDOM = require('react-dom');
var Message = require('./Message');
var body = require('../../com/DOM/DOMBody');
var List = require('../../com/util/List');

var objectToString = function (obj, separator) {
    obj = typeof obj === 'object' && obj;
    return Object.keys(obj).map(function (key) {
        return key + ':' + obj[key];
    }).join(separator || ';')
};

var getMax = function (list) {
    var max = Number.MIN_VALUE;
    list.forEach(function (v) {
        if (v > max) {
            max = v;
        }
    });
    return max;
};

var setStyle = function (node, style) {
    if (node && (node.nodeType === 1 || node.nodeType === 9)) {
        Object.keys(style).forEach(function (prop) {
            node.style[prop] = style[prop]
        })
    }
};


if (!runtimeIsNode) {

    var mountNodeWrap = document.createElement('div');
    var baseStyle = {
        position: 'fixed',
        top: '20px',
        left: '50%'
    };

    // 缓存所有的message
    var list = new List();

    var updateStyle = function (style) {
        setStyle(mountNodeWrap, style);
    };

    var getItem = function () {
        return {inst: null, width: 0}
    };

    var getItemsWidth = function () {
        var collection = [];
        list.each(function (item) {
            collection.push(item.width)
        });
        return collection;
    };

    updateStyle(baseStyle);
    body.appendChild(mountNodeWrap);

    module.exports = function (message, callback) {
        var mountNode = document.createElement('div');
        var item = getItem();

        // 加入队列
        list.add(item);

        setStyle(mountNode, {'marginBottom': '10px'});
        mountNodeWrap.appendChild(mountNode);

        var updateWrapStyle = function () {
            updateStyle(Object.assign(
                baseStyle,
                {marginLeft: -parseInt(getMax(getItemsWidth()) / 2) + 'px'}
            ));
        };

        var onUnmout = function () {
            callback && callback();
            // 移除队列
            list.remove(item);
            // 重新计算宽度
            updateWrapStyle();
            mountNodeWrap.removeChild(mountNode);
        };

        var onMount = function () {
            item.width = mountNode.offsetWidth;
            // 重新计算宽度
            updateWrapStyle();
        };

        item.inst = ReactDOM.render(
            <Message
                onMount={onMount}
                message={message}
                onUnmout={onUnmout}/>,
            mountNode
        );

    };
} else {
    module.exports = Message;
}

