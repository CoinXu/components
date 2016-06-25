/**
 * Created by xcp on 2016/3/14.
 */

var React = require('react');
var assert = require('../../com/assert');
var noop = require('../../com/noop');
var ConditionItem = require('./ConditionItem');
var ConditionMixin = require('./ConditionMixin');
var isFunction = function (any) {
    return Object.prototype.toString.call(any) === '[object Function]'
};

var Conditional = React.createClass({

    mixins: [ConditionMixin],

    getInitialState: function () {
        return {
            checkedItemValue: null
        }
    },

    getDefaultProps: function () {
        return {
            itemList: [],
            onChecked: noop,
            onChange: noop,
            getChildren: noop,
            className: 'conditional',
            itemClassName: 'cond-item',
            checkedClassName: 'checked',
            defaultChecked: null
        }
    },

    onChecked: function (isChecked, currentValue) {
        var prev = this.state.checkedItemValue;

        // 无论何时都有一个项被选中
        //this.setState({checkedItemValue: isChecked ? currentValue : null});
        this.setState({checkedItemValue: currentValue});
        this.props.onChecked(isChecked, currentValue);
        if (isChecked && prev !== currentValue) {
            this.props.onChange(prev, currentValue)
        }
    },

    componentWillMount: function () {
        var def = this.props.defaultChecked;
        var next = def;
        var first = null;

        if (def === null) {
            first = this.props.itemList[0];
            next = isFunction(first.value) ?
                first.value(this.state.checkedItemValue) :
                first.value;
        }

        this.setState({
            checkedItemValue: next
        });
    },

    render: function () {
        var props = this.props;
        var state = this.state;
        var value = null;
        var next = null;
        var temp = null;

        var items = props.itemList.map(function (item, index) {
            if (isFunction(item.value)) {
                temp = item.value(state.checkedItemValue);
                value = temp.value;
                next = temp.next;
            } else {
                value = next = item.value
            }

            return (<ConditionItem
                key={index}
                isChecked={this.state.checkedItemValue === value}
                onChecked={this.onChecked}
                value={next}>
                {isFunction(item.children) ?
                    item.children(props, this.state) :
                    item.children}
            </ConditionItem>);
        }, this);

        return (<div className={props.className}>
            {items}
        </div>)
    }
});

module.exports = Conditional;
