/**
 * Created by xcp on 2016/3/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var PopupWrap = require('./PopupWrap');
var absolutePosition = require('../../com/absolutePosition');
var body = require('../../com/DOM/DOMBody');
var noop = require('../../com/noop');
var POPUP_GAP = 5;
var shouldHide = function () {
    return true;
};

var Popup = React.createClass({

    getInitialState: function () {
        return {
            visible: false
        }
    },

    getDefaultProps: function () {
        return {
            animate: {
                from: {opacity: 0},
                to: {opacity: 1},
                during: 500
            },
            trigger: 'click',
            content: null,
            placement: null,
            baseElement: null,
            onHide: noop,
            onChange: noop,
            shouldUpdate: shouldHide,
            shouldHide: shouldHide,
            onComponentMount: noop,
            onMount: noop
        }
    },

    getTrigger: function () {
        return {
                click: 'onClick',
                hover: 'onMouseEnter'
            }[this.props.trigger] || 'onClick'
    },

    componentWillMount: function () {
        this.__popupMountNode = null;
        this.__position = null;
        this.__content = null;
        this.__isUnmount = false;
    },

    // Invoked once, only on the client
    componentDidMount: function () {
        this.__popupMountNode = document.createElement('div');
        body.appendChild(this.__popupMountNode);
        // TODO 将要废弃 onComponentMount 属性
        this.props.onComponentMount(this);
        this.props.onMount(this);
    },

    _createContent: function () {
        var props = this.props;

        if (typeof props.content === 'string')
            props.content = <span>{props.content}</span>;

        this.__content = React.cloneElement(props.content, {
            placement: props.placement
        });
    },

    onHide: function () {
        if (this.__isUnmount) return;
        this.setState({visible: false}, function () {
            ReactDOM.unmountComponentAtNode(this.__popupMountNode);
            this.props.onHide()
        })
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (this.state.visible !== prevState.visible
            && !!this.props.shouldUpdate()) {
            this.renderPopup();
            this.props.onChange();
        }
    },

    hide: function () {
        if (this.__isUnmount) return;
        if (this.__animate) {
            this.__animate.backToTheStart(this.onHide)
        }
    },

    autoVisible: function () {
        this.hide();
    },

    computedPosition: function () {
        var props = this.props;
        var targetNode = props.baseElement || this.refs.targetNode;
        // 左上角的位置
        var pos = absolutePosition(targetNode);
        var placement = props.placement;
        var w = targetNode.offsetWidth;
        var h = targetNode.offsetHeight;

        // 在该组件内，只需将最外层定位到对应位置
        // 不用理会内容的size
        switch (placement) {
            case "top":
                pos.y = pos.y - POPUP_GAP;
                break;
            case "right":
                pos.x = pos.x + w + POPUP_GAP;
                break;
            case "bottom":
                pos.y = pos.y + h + POPUP_GAP;
                break;
            case "left":
                pos.x = pos.x - POPUP_GAP;
                break;
        }

        return this.__position = pos;
    },

    renderPopup: function () {
        if (!this.isMounted()) return;

        this._createContent();
        // 渲染的时候才计算位置
        // 如果提前计算，在页面布局发生变化的情况下
        // 计算的位置是错误的
        this.computedPosition();

        var props = this.props;
        var style = {
            position: 'absolute',
            left: this.__position.x,
            top: this.__position.y
        };
        ReactDOM.render(
            <PopupWrap
                baseElement={props.baseElement}
                onMount={this.onAnimateMount}
                style={style}
                placement={props.placement}
                visible={this.state.visible}
                onHide={this.onHide}
                shouldHide={props.shouldHide}
                refTarget={this.refs.targetNode}>
                {this.__content}
            </PopupWrap>,
            this.__popupMountNode
        );
    },

    showPopup: function () {
        this.setState({visible: true});
    },

    onAnimateMount: function (inst) {
        this.__animate = inst.__animate;
    },

    componentWillUnmount: function () {
        this.__isUnmount = true;
        try {
            body.removeChild(this.__popupMountNode);
        } catch (e) {
        }
    },

    render: function () {
        var props = {ref: 'targetNode'};
        props[this.getTrigger()] = this.showPopup;
        if (props.onMouseEnter) {
            props.onMouseLeave = this.hide
        }

        return React.cloneElement(
            this.props.children || <span style={{display:'none'}}/>,
            props
        );
    }
});

module.exports = Popup;