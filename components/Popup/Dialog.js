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
            isVisible: true,
            baseStyle: {
                position: 'fixed',
                left: '50%',
                top: '50%'
            },
            posStyle: {}
        }
    },

    getDefaultProps: function () {
        return {
            style: {backgroundColor: '#fff'},
            className: 'bub-dialog bubble-company-staff',
            refTarget: null,
            isVisible: true,
            onHidden: noop,
            onComponentMount: noop
        }
    },

    componentWillMount: function () {
        this.setState({isVisible: this.props.isVisible});
    },

    componentDidMount: function () {
        var wrap = this.refs.wrap;
        this._mountNode = ReactDOM.findDOMNode(this).parentNode;
        this.props.onComponentMount(this, wrap);
        this.setState({
            posStyle: {
                marginLeft: `-${wrap.offsetWidth / 2}px`,
                marginTop: `-${wrap.offsetTop / 2}px`
            }
        })
    },

    onAnimateMount: function (animate) {
        this.__animate = animate;
    },

    onHidden: function () {
        var self = this;
        self.setState({isVisible: false}, function () {
            ReactDOM.unmountComponentAtNode(self._mountNode);
            self.props.onHidden();
        });
    },

    hide: function () {
        if (!this.isMounted()) return false;
        var self = this;
        if (self.__animate) {
            self.__animate.backToTheStart(function () {
                self.onHidden()
            })
        } else {
            self.onHidden()
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
        if (!this.state.isVisible) {
            style = assign(style, {display: 'none'})
        }

        return <HideOnBodyClick
            refTarget={props.refTarget}
            style={style}
            onAnimateMount={this.onAnimateMount}
            onVisible={this.onHidden}>
            <div className={props.className} ref="wrap"></div>
        </HideOnBodyClick>
    }

});

module.exports = Dialog;