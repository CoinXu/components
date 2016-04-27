/**
 * Created by xcp on 2016/4/27.
 */

const moment = require('moment');
const React = require('react');
const noop = require('../../com/noop');
const classnames = require('classnames');

const DatePicker = React.createClass({

    getDefaultProps: function () {
        return {
            disabledClassName: 'disabled',
            currentClassName: 'curr',
            diffMonthClassName: 'diff',
            currentTime: moment(),
            time: moment(),
            format: 'YYYY-MM-DD HH:mm:ss',
            onSelect: noop,
            disabledDate: noop,
            diffDate: noop
        }
    },

    onSelect: function () {
        this.props.onSelect(this.props.time)
    },


    render: function () {
        var props = this.props;
        var disabled = props.disabledDate(props.time);
        var className = {};

        className[props.disabledClassName] = disabled;
        className[props.currentClassName] =
            props.currentTime.isSame(props.time, 'day');
        className[props.diffMonthClassName] =
            props.diffDate(props.currentTime, props.time);

        return <span
            className={classnames(className)}
            onClick={disabled ? noop : this.onSelect}>
            {props.time.date()}
        </span>
    }
});

module.exports = DatePicker;