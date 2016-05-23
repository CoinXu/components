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
            trigger: 'click',
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
        this._popup.hide();
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
            placement={props.placement}
            trigger={props.trigger}
            onHide={this._unmount}
            onMount={this.onMount}
            shouldHide={noop}
            baseElement={props.baseElement}
            content={content}/>
    }

});

module.exports = function (target, props) {
    var body = document && document.body;
    if (!body) return {};

    props = typeof props === 'object' && props ?
        props : {};

    var _props = {};

    Object.keys(PositionBubble.defaultProps).forEach(function (name) {
        if (props.hasOwnProperty(name))
            _props[name] = props[name]
    });

    var mountNode = document.createElement('div');

    body.appendChild(mountNode);
    var _onUnMount = _props.onUnMount;

    _props.onUnMount = function () {
        _onUnMount && _onUnMount();
        body.removeChild(mountNode)
    };

    _props.baseElement = target;

    return ReactDOM.render(
        React.createElement(PositionBubble, _props),
        mountNode
    );
};
