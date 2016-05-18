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

var triggerHide = function () {
    return true;
};

var HideOnBodyClick = React.createClass({

    getInitialState: function () {
        return {
            isVisible: true
        }
    },

    getDefaultProps: function () {
        return {
            component: 'div',
            refTarget: null,
            isVisible: true,
            style: {},
            onHide: noop,
            onAnimateMount: noop,
            triggerHide: triggerHide
        }
    },

    componentDidMount: function () {
        var self = this;

        this.__bodyHandle = function (e) {
            var target = e.target || e.srcElement;
            var mountNode = ReactDOM.findDOMNode(self);
            var props = self.props;

            if (!props.triggerHide()
                || ( props.refTarget
                && contains(props.refTarget, target))
                || contains(mountNode, target)) {
                return
            }

            if (self.__animate && self.__animate.backToTheStart) {
                self.__animate.backToTheStart(function () {
                    props.onHide();
                });
            }
        };

        DOMEvent.on(body, 'click', this.__bodyHandle, false);
    },

    componentWillUnmount: function () {
        DOMEvent.off(body, 'click', this.__bodyHandle, false);
    },

    holdAnimate: function (animate) {
        this.__animate = animate;
        this.props.onAnimateMount(animate);
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
                componentDidMount={this.holdAnimate}>
                {props.children}
            </Animate>
        </Components>
    }
});

module.exports = HideOnBodyClick;