/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var noop = require('../../com/noop');
var classNames = require('classnames');
var HideOnBodyClick = require('../HideOnBodyClick');

var Selectable = React.createClass({

    getDefaultProps: function () {
        return {
            wrapClassName: null,
            onSelect: noop,
            onComponentMount: noop,
            selectorBindEvent: true,
            selectorContent: null,
            panelContent: null
        }
    },

    getInitialState: function () {
        return {
            panelStateIsShow: false
        }
    },

    componentDidMount: function () {
        this.props.onComponentMount(this);
    },

    showPanel: function () {
        var self = this;
        self.setState({panelStateIsShow: true}, function () {
            var animate = self.__animate;
            var animateProps = animate.props;
            animate.animate(animateProps.from, animateProps.to)
        })
    },

    onAnimateMount: function (animate) {
        this.__animate = animate;
    },

    onSelect: function (item) {
        var self = this;
        self.props.onSelect(item);
        self.__animate.backToTheStart(function () {
            self.onHide();
        })
    },

    onHide: function () {
        this.setState({panelStateIsShow: false});
    },

    triggerHide: function () {
        return this.state.panelStateIsShow;
    },

    render: function () {
        var props = this.props;
        var className = {
            'comp-custom-select': true,
            'comp-show-panel': this.state.panelStateIsShow
        };

        if (props.wrapClassName) {
            className[props.wrapClassName] = true;
        }

        var selector = null;
        if (props.selectorBindEvent) {
            selector = <div onClick={this.showPanel}>
                {props.selectorContent}
            </div>
        } else {
            selector = props.selectorContent;
        }

        return (<div className={classNames(className)} ref="selectable">
            <div className="comp-select-selector-pd">
                {selector}
            </div>
            <HideOnBodyClick
                refTarget={this.refs.selectable}
                onHide={this.onHide}
                onAnimateMount={this.onAnimateMount}
                triggerHide={this.triggerHide}>
                <div className="comp-select-panel">
                    {props.panelContent}
                </div>
            </HideOnBodyClick>
        </div>)
    }

});

module.exports = Selectable;