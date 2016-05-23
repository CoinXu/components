/**
 * Created by xcp on 2016/3/22.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var Animate = require('../Animate');
var contains = require('../../com/DOM/contains');
var DOMEvent = require('../../com/DOM/DOMEvent');
var body = require('../../com/DOM/DOMBody');
var noop = require('../../com/noop');
var assert = require('../../com/assert');

var shouldHide = function () {
    return true;
};

var HideOnBodyClick = React.createClass({

    getInitialState: function () {
        return {
            visible: true
        }
    },

    getDefaultProps: function () {
        return {
            component: 'div',
            refTarget: null,
            style: {},
            visible: true,
            onHide: noop,
            onMount: noop,
            shouldHide: shouldHide
        }
    },

    componentDidMount: function () {

        this.__bodyHandle = function (e) {
            var target = e.target || e.srcElement;
            var mountNode = ReactDOM.findDOMNode(this);
            var props = this.props;

            if (!props.shouldHide()
                || ( props.refTarget
                && contains(props.refTarget, target))
                || contains(mountNode, target)) {
                return
            }

            if (this.__animate && this.__animate.backToTheStart) {
                this.__animate.backToTheStart(this.onHide);
            }
        }.bind(this);

        DOMEvent.on(body, 'click', this.__bodyHandle, false);
    },

    componentWillUnmount: function () {
        DOMEvent.off(body, 'click', this.__bodyHandle, false);
    },

    onHide: function () {
        this.props.onHide()
    },

    onMount: function (animate) {
        this.__animate = animate;
        this.props.onMount(this);
    },

    render: function () {
        var props = this.props;
        var Components = props.component;
        assert(props.children, 'children required in HideOnBodyClick');

        return <Components style={{background: '#fff'}}>
            <Animate
                style={props.style}
                component={props.component}
                from={{opacity:0}}
                to={{opacity:1}}
                during={200}
                onMount={this.onMount}>
                {props.children}
            </Animate>
        </Components>
    }
});

module.exports = HideOnBodyClick;