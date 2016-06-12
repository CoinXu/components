/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var noop = require('../../com/noop');
var Selectable = require('./Selectable');

var DropDown = React.createClass({

    getDefaultProps: function () {
        return {
            wrapClassName: null,
            selectorContent: null,
            selectorBindEvent: true,
            onSelect: noop,
            getItemWrap: noop,
            disabled: false,
            panelContent: null
        }
    },

    getInitialState: function () {
        return {
            disabled: false,
            currentSelectedValue: null
        }
    },

    componentWillMount: function () {
        this.setState({disabled: this.props.disabled})
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({disabled: nextProps.disabled})
    },

    onSelect: function (value) {
        this.props.onSelect(value);
        this.__selector.onSelect(value);
        if (this.__selectable) {
            this.__selectable.onSelect(value)
        }
    },

    onSelectableMount: function (selectable) {
        this.__selectable = selectable;
    },

    onSelectorMount: function (selector) {
        this.__selector = selector;
    },

    render: function () {
        var props = this.props;

        var items = props.panelContent.map(function (item, index) {
            var _props = {key: index};
            if (item.props.isItem) {
                _props.onSelect = this.onSelect
            }
            return React.cloneElement(item, _props)
        }, this);

        var panelContent = props.getItemWrap(items, props, this.state, this) ||
            <ol className="comp-select-m-t">
                {items}
            </ol>;

        var selectorContent = React.cloneElement(props.selectorContent, {
            onMount: this.onSelectorMount
        });

        return <Selectable
            disabled={this.state.disabled}
            wrapClassName={props.wrapClassName}
            selectorBindEvent={props.selectorBindEvent}
            onMount={this.onSelectableMount}
            selectorContent={selectorContent}
            panelContent={panelContent}/>
    }

});

DropDown.Item = React.createClass({

    getDefaultProps: function () {
        return {
            value: null,
            isItem: true,
            getItemContent: noop,
            onSelect: noop
        }
    },

    onSelect: function () {
        this.props.onSelect(this.props.value)
    },

    render: function () {
        return this.props.children ?
            React.cloneElement(this.props.children, {onClick: this.onSelect}) :
            this.props.getItemContent(this.props.value, {onClick: this.onSelect}, this);
    }
});

DropDown.Selector = React.createClass({

    getInitialState: function () {
        return {
            panelStateIsShow: false,
            currentSelectedValue: null
        }
    },

    getDefaultProps: function () {
        return {
            defaultSelectedValue: null,
            onSelect: noop,
            onMount: noop,
            getSelectorContent: noop
        }
    },

    componentDidMount: function () {
        this.props.onMount(this);
    },

    componentWillMount: function () {
        this.setState({currentSelectedValue: this.props.defaultSelectedValue})
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({currentSelectedValue: nextProps.defaultSelectedValue})
    },

    onSelect: function (value) {
        var self = this;
        this.setState({currentSelectedValue: value}, function () {
            self.props.onSelect(value);
        });
    },

    render: function () {
        return this.props.children ?
            this.props.children :
            this.props.getSelectorContent(this.state.currentSelectedValue)
    }
});

module.exports = DropDown;