/**
 * Created by xcp on 2016/3/14.
 */

var React = require('react');
var assert = require('../../com/assert');
var noop = require('../../com/noop');
var ConditionItem = require('./ConditionItem');
var ConditionMixin = require('./ConditionMixin');

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
        this.setState({checkedItemValue: def !== null ? def : this.props.itemList[0].value});
    },

    render: function () {
        var props = this.props;

        var items = props.itemList.map(function (item) {
            return (<ConditionItem
                key={item.value}
                isChecked={this.state.checkedItemValue === item.value}
                onChecked={this.onChecked}
                value={item.value}>
                {item.children}
            </ConditionItem>);
        }, this);

        return (<div className={props.className}>
            {items}
        </div>)
    }
});

module.exports = Conditional;
