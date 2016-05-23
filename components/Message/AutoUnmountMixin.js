/**
 * Created by xcp on 2016/3/18.
 */

var ReactDOM = require('react-dom');
var noop = require('../../com/noop');

module.exports = {

    getInitialState: function () {
        return {visible: true}
    },

    getDefaultProps: function () {
        this.__backToTheStart = noop;
        return {
            message: '',
            during: 3000,
            closeable: false,
            onMount: noop,
            onUnmout: noop,
            animate: {
                component: 'span',
                from: {opacity: 0},
                to: {opacity: 1},
                during: 500
            }
        }
    },

    // export animate
    animateDidMount: function (animate) {
        this.__backToTheStart = animate.backToTheStart;
    },

    componentDidMount: function () {
        this.props.onMount(this)
    },

    unmount: function () {
        var mountNode = ReactDOM.findDOMNode(this).parentNode;
        if (typeof this.__backToTheStart === 'function') {
            this.__backToTheStart(function () {
                ReactDOM.unmountComponentAtNode(mountNode);
            })
        } else {
            ReactDOM.unmountComponentAtNode(mountNode)
        }
        this.props.onUnmout();
    },

    autoUnmount: function () {
        setTimeout(this.unmount, this.props.during)
    }
};