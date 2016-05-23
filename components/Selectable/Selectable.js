/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var noop = require('../../com/noop');
var classNames = require('classnames');
var HideOnBodyClick = require('../HideOnBodyClick');
var NotAllowSelect = require('../Pagination/NotAllowSelect');

var Selectable = React.createClass({

    getDefaultProps: function () {
        return {
            wrapClassName: null,
            onSelect: noop,
            onComponentMount: noop,
            onMount: noop,
            selectorBindEvent: true,
            selectorContent: null,
            disabled: false,
            panelContent: null
        }
    },

    getInitialState: function () {
        return {
            disabled: false,
            visible: false
        }
    },

    componentWillMount: function () {
        this.setState({disabled: this.props.disabled})
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({disabled: nextProps.disabled})
    },

    componentDidMount: function () {
        // TODO 废弃属性,用onMount代替
        this.props.onComponentMount(this);
        this.props.onMount(this);
    },

    showPanel: function () {
        this.setState({visible: true}, function () {
            var animate = this.__animate;
            var animateProps = animate.props;
            animate.animate(animateProps.from, animateProps.to)
        })
    },

    onAnimateMount: function (inst) {
        this.__animate = inst.__animate;
    },

    onSelect: function (item) {
        this.props.onSelect(item);
        this.__animate.backToTheStart(this.onHide)
    },

    onHide: function () {
        this.setState({visible: false});
    },

    shouldHide: function () {
        return this.state.visible;
    },

    render: function () {
        var props = this.props;
        var state = this.state;

        var className = {
            'comp-custom-select': true,
            'disabled': state.disabled,
            'comp-show-panel': state.visible
        };

        if (props.wrapClassName) {
            className[props.wrapClassName] = true;
        }

        var selector = null;
        if (props.selectorBindEvent && !state.disabled) {
            selector = <div onClick={this.showPanel}>
                {props.selectorContent}
            </div>
        } else {
            selector = props.selectorContent;
        }

        return (<div className={classNames(className)} ref="selectable">
            <div className="comp-select-selector-pd">
                <NotAllowSelect>
                    {selector}
                </NotAllowSelect>
            </div>
            <HideOnBodyClick
                refTarget={this.refs.selectable}
                onHide={this.onHide}
                onMount={this.onAnimateMount}
                shouldHide={this.shouldHide}>
                <div className="comp-select-panel">
                    {props.panelContent}
                </div>
            </HideOnBodyClick>
        </div>)
    }

});

module.exports = Selectable;