/**
 * Created by xcp on 2016/3/15.
 * PopupWrap 的作用：
 * 1. 确定 popup 的位置
 * 2. 监听 body click 事件，卸载元素
 */

var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('object-assign');
var noop = require('../../com/noop');
var DOMEvent = require('../../com/DOM/DOMEvent');
var HideOnBodyClick = require('../HideOnBodyClick');
var triggerHide = function () {
    return true;
};

var PopupWrap = React.createClass({

    getInitialState: function () {
        return {
            left: 0,
            top: 0
        }
    },

    getDefaultProps: function () {

        return {
            style: {backgroundColor: '#fff'},
            placement: 'top',
            refTarget: null,
            isVisible: false,
            onHide: noop,
            triggerHide: triggerHide,
            onAnimateMount: noop
        }
    },

    componentDidMount: function () {
        var node = ReactDOM.findDOMNode(this.refs.popup);
        var position = {x: node.offsetWidth, y: node.offsetHeight};

        switch (this.props.placement) {
            case "top":
                position.x = -(position.x - this.props.refTarget.offsetWidth) / 2;
                position.y = -position.y;
                break;
            case "bottom":
                position.x = -(position.x - this.props.refTarget.offsetWidth) / 2;
                position.y = 0;
                break;
            case "left":
                position.x = -position.x;
                position.y = 0;
                break;
            default:
                position.x = 0;
                position.y = 0;
        }

        this.setState({left: position.x, top: position.y})
    },

    render: function () {
        var props = this.props;
        var style = {
            top: this.state.top,
            left: this.state.left,
            position: 'absolute'
        };

        if (props.isVisible) {
            style = assign(style, {display: 'none'})
        }

        var children = React.cloneElement(props.children, {
            style: assign(style, props.children.props.style),
            placement: props.placement,
            ref: 'popup'
        });

        return (<HideOnBodyClick
            refTarget={props.refTarget}
            style={props.style}
            triggerHide={props.triggerHide}
            onAnimateMount={props.onAnimateMount}
            onHide={props.onHide}>
            {children}
        </HideOnBodyClick>)
    }
});

module.exports = PopupWrap;