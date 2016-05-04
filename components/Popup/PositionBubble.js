/**
 * Created by xcp on 2016/4/30.
 * 参数
 * target
 * onMount
 *
 * 返回对象
 * hide
 * open
 * show
 */

var React = require('react');
var ReactDOM = require('react-dom');
var noop = require('../../com/noop');
var Popup = require('./Popup');
var Bubble = require('./Bubble');

var PositionBubble = React.createClass({

    getDefaultProps: function () {
        return {
            placement: 'top',
            bubbleStyle: {},
            symbolStyle: {left: '50%', marginLeft: -10},
            baseElement: null,
            onUnMount: noop,
            onMount: noop
        }
    },

    getInitialState: function () {
        return {
            bubbleStyle: null,
            symbolStyle: null
        }
    },

    componentWillMount: function () {
        this.setState({
            bubbleStyle: this.props.bubbleStyle,
            symbolStyle: this.props.symbolStyle
        })
    },

    unMount: function () {
        this._popup.autoVisible();
    },

    show: function () {
        if (this.isMounted()) {
            this._popup.showPopup();
        }
    },

    onMount: function (inst) {
        this._popup = inst;
    },

    onBubbleMount: function (wrap, inst) {
        this.props.onMount(wrap, inst);
    },

    componentWillUnmount: function () {
        this.props.onUnMount()
    },

    _unmount: function () {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode)
    },

    render: function () {
        var props = this.props;
        var state = this.state;
        var content = <Bubble
            symbolStyle={state.symbolStyle}
            style={state.bubbleStyle}
            onComponentMount={this.onBubbleMount}/>;
        return <Popup
            onHide={this._unmount}
            placement={props.placement}
            onComponentMount={this.onMount}
            triggerHide={noop}
            baseElement={props.baseElement}
            content={content}/>
    }

});

module.exports = function (target, onMount) {
    var body = document && document.body;
    if (!body) return {};

    var mountNode = document.createElement('div');
    body.appendChild(mountNode);
    var onUnMount = function () {
        body.removeChild(mountNode)
    };

    return ReactDOM.render(
        <PositionBubble
            onUnMount={onUnMount}
            baseElement={target}
            onMount={onMount}/>,
        mountNode
    )
};
