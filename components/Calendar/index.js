/**
 * Created by xcp on 2016/4/27.
 */

var moment = require('moment');
var DropDown = require('../Selectable/DropDown');
var React = require('react');
var noop = require('../../com/noop');

var Calenadar = React.createClass({
    getInitialState: function () {
        return {
            show: false,
            currentValue: null
        }
    },

    getDefaultProps: function () {
        return {
            disabledDate: noop,
            showToday: true,
            showWeekNumber: true,
            defaultValue: new Date().getTime(),
            onChange: noop,
            onSelect: noop
        }
    },

    componentWillMount: function () {
        this.setState({currentValue: this.props.defaultValue})
    },

    nextMonth: function () {
        this.setState({currentValue: this.props.defaultValue})
    },

    previousMonth: function () {

    },

    nextYear: function () {

    },

    previousYear: function () {

    },

    render: function () {

    }
});
