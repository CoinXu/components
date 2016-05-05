/**
 * Created by xcp on 2016/3/14.
 */

var React = require('react');
var noop = require('../../com/noop');
var ConditionMixin = require('./ConditionMixin');
var classNames = require('classnames');

var ConditionItem = React.createClass({

    mixins: [ConditionMixin],

    getInitialState: function () {
        return {
            isChecked: false
        }
    },

    getDefaultProps: function () {
        return {
            className: 'cond-item',
            checkedClassName: 'checked',
            children: null,
            value: null,
            onChecked: noop,
            onChange: noop,
            isChecked: false
        }
    },

    componentWillMount: function () {
        this.setState({isChecked: this.props.isChecked})
    },

    // TODO 该组件设计得有点绕，得改
    componentWillReceiveProps: function (nextProps) {
        this.setState({isChecked: nextProps.isChecked})
    },

    onChecked: function () {
        this.setState({isChecked: !this.state.isChecked}, function () {
            this.props.onChecked(this.state.isChecked, this.props.value);
        });
    },

    render: function () {
        var props = this.props;
        var className = {};

        className[props.className] = true;
        className[props.checkedClassName] = props.isChecked;

        return (<span
            className={classNames(className)}
            onClick={this.onChecked}>
            {props.children}
        </span>)
    }

});

module.exports = ConditionItem;