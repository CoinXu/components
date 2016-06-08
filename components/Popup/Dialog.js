/**
 * Created by xcp on 2016/4/14.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('object-assign');
var noop = require('../../com/noop');
var HideOnBodyClick = require('../HideOnBodyClick');

var Dialog = React.createClass({

    getInitialState: function () {
        return {
            visible: true,
            baseStyle: {
                position: 'fixed',
                left: '50%',
                top: '50%',
                zIndex: 999
            },
            posStyle: {}
        }
    },

    getDefaultProps: function () {
        return {
            style: {backgroundColor: '#fff'},
            className: 'bub-dialog bubble-company-staff',
            refTarget: null,
            visible: true,
            onHide: noop,
            onMount: noop,
            onComponentMount: noop
        }
    },

    componentWillMount: function () {
        this.setState({visible: this.props.visible});
    },

    componentDidMount: function () {
        var wrap = this.refs.wrap;
        this._mountNode = ReactDOM.findDOMNode(this).parentNode;

        // TODO 将要废弃 onComponentMount 属性
        this.props.onComponentMount(this, wrap);
        this.props.onMount(this, wrap);

        this.setState({
            posStyle: {
                marginLeft: `-${wrap.offsetWidth / 2}px`,
                marginTop: `-${wrap.offsetHeight / 2}px`
            }
        })
    },

    onAnimateMount: function (inst) {
        this.__animate = inst.__animate;
    },

    onHidden: function () {
        this.setState({visible: false}, function () {
            ReactDOM.unmountComponentAtNode(this._mountNode);
            this.props.onHide();
        });
    },

    hide: function () {
        if (!this.isMounted()) return false;
        if (this.__animate) {
            this.__animate.backToTheStart(this.onHidden)
        } else {
            this.onHidden()
        }
        return true;
    },

    render: function () {
        var props = this.props;
        var style = assign(
            {},
            props.style,
            this.state.baseStyle,
            this.state.posStyle
        );
        if (!this.state.visible) {
            style = assign(style, {display: 'none'})
        }

        return <HideOnBodyClick
            refTarget={props.refTarget}
            style={style}
            onMount={this.onAnimateMount}
            onHide={this.onHidden}>
            <div className={props.className} ref="wrap"></div>
        </HideOnBodyClick>
    }

});

module.exports = Dialog;