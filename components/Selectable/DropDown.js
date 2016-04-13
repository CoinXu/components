/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var noop = require('../../com/noop');
var Selectable = require('./Selectable');

var DropDown = React.createClass({

    getDefaultProps: function () {
        return {
            onSelect: noop,
            wrapClassName: null,
            selectorContent: null,
            selectorBindEvent: true,
            panelContent: null
        }
    },

    getInitialState: function () {
        return {
            currentSelectedValue: null
        }
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

        var panelContent = <ol className="comp-select-m-t">
            {items}
        </ol>;

        var selectorContent = React.cloneElement(props.selectorContent, {
            onComponentMount: this.onSelectorMount
        });

        return <Selectable
            wrapClassName={props.wrapClassName}
            selectorBindEvent={props.selectorBindEvent}
            onComponentMount={this.onSelectableMount}
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
            this.props.getItemContent(this.props.value, {onClick: this.onSelect});
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
            onComponentMount: noop,
            getSelectorContent: noop
        }
    },

    componentDidMount: function () {
        this.props.onComponentMount(this);
    },

    componentWillMount: function () {
        this.setState({currentSelectedValue: this.props.defaultSelectedValue})
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