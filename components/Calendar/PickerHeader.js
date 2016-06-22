/**
 * Created by xcp on 2016/4/27.
 */

const React = require('react');
const moment = require('moment');
const Selectable = require('../Selectable');
const noop = require('../../com/noop');
const assert = require('../../com/assert');

const getItemContent = function (value, props) {
    var item = <li className="comp-panel-item">{value.year()}</li>;
    return React.cloneElement(item, props);
};

const getSelectorContent = function (value) {
    return <div className="comp-select-selector">
        <span className="util-font-12">{value.year()}</span>
        <span className="icon-img icon-tran-black-d"/>
    </div>
};

const PickerHeader = React.createClass({

    getInitialState: function () {
        return {
            currentTime: null,
            monthList: []
        }
    },

    getDefaultProps: function () {
        return {
            className: '',
            currentTime: moment(),
            startTime: [2010, 0, 1],
            endTime: [2020, 0, 1],
            onChange: noop
        }
    },

    getMonth: function (time) {
        var currentMonth = time.month() + 1;
        var props = this.props;
        var year = time.year();
        var startTimeYear = props.startTime[0];
        var endTimeYear = props.endTime[0];
        var startTimeMonth = props.startTime[1] + 1;
        var endTimeMonth = props.endTime[1] + 1;

        var monthList = new Array(12)
            .fill(1)
            .map(function (v, i) {
                return i + 1
            });

        // 生成每一年的月份的时候,该月需要大于start,小于end
        var list = monthList.filter(function (v) {
            // 当前年和开始年相同
            // 则判断月份是否相同
            if (year === startTimeYear) {
                return v >= startTimeMonth
            } else if (year === endTimeYear) {
                return v <= endTimeMonth
            }
            return true;
        });

        // 如果当前年 + 上一次时间月份超出了endTime
        // 则将endTime的月份设置为合法的第一个月
        var month = currentMonth;
        // 如果当前月小于月份的最小值,则取最小值
        // 如果当前月份大于月份的最大值,则取最大值

        if (currentMonth < list[0]) {
            month = list[0]
        }
        else if (currentMonth > list[list.length - 1]) {
            month = list[list.length - 1]
        }

        return {
            month: month - 1,
            monthList: list
        }
    },

    setTime: function (time) {
        this.setState({currentTime: time})
    },

    // 确定 time 是否在 startTime 和 endTime 范围内
    timeInRange: function (time) {
        var cur = time.valueOf();
        var start = moment(this.props.startTime).valueOf();
        var end = moment(this.props.endTime).valueOf();
        return cur <= end && cur >= start;
    },

    setYear: function (time) {
        var currentMonth = this.state.currentTime.month();
        var month = this.getMonth(time.clone().month(currentMonth));
        this.setState({
            currentTime: time.clone().month(month.month),
            monthList: month.monthList
        });
    },

    setMonth: function (month) {
        this.setTime(this.state.currentTime.clone().month(month - 1))
    },

    nextMonth: function () {
        var nextTime = this.state.currentTime.clone().add(1, 'month');
        if (this.timeInRange(nextTime)) {
            var month = this.getMonth(nextTime);
            this.setState({
                currentTime: nextTime.clone().month(month.month),
                monthList: month.monthList
            });
        }
    },

    previousMonth: function () {
        var nextTime = this.state.currentTime.clone().add(-1, 'month');
        if (this.timeInRange(nextTime)) {
            var month = this.getMonth(nextTime);
            this.setState({
                currentTime: nextTime.clone().month(month.month),
                monthList: month.monthList
            });
        }
    },

    nextYear: function () {
        this.setTime(this.state.currentTime.clone().add(1, 'year'))
    },

    previousYear: function () {
        this.setTime(this.state.currentTime.clone().add(-1, 'year'))
    },

    componentWillMount: function () {
        var props = this.props;
        var start = moment(props.startTime).month(props.currentTime.month());
        var end = moment(props.endTime);

        var sl = start.year();
        var el = end.year();

        assert(
            start.valueOf() <= end.valueOf(),
            'start year need to be less than end year'
        );

        // 年间距
        var yearList = [];
        var s = 0, l = el - sl;
        while (s <= l) {
            yearList.push(start.clone().add(s++, 'year'))
        }

        this.__yearList = yearList;

        var month = this.getMonth(moment(props.currentTime));

        this.setState({
            currentTime: this.props.currentTime,
            monthList: month.monthList
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        if (nextState.currentTime.year() !== this.state.currentTime.year() ||
            nextState.currentTime.month() !== this.state.currentTime.month()) {
            this.props.onChange(
                nextState.currentTime.year(),
                nextState.currentTime.month()
            );
            return true;
        }
        return false;
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({currentTime: nextProps.currentTime})
    },

    render: function () {
        var iconStyle = {cursor: 'pointer'};

        return <div className={this.props.className}>

            <Selectable.Custom
                defaultSelectedValue={this.state.currentTime}
                getSelectorContent={getSelectorContent}
                getItemContent={getItemContent}
                onSelect={this.setYear}
                itemList={this.__yearList}/>
            <Selectable.Importable
                defaultSelectedValue={this.state.currentTime.month() + 1}
                onSelect={this.setMonth}
                itemList={this.state.monthList}/>

            <span style={iconStyle}
                  className="icon-img icon-img icon-tran-black-l util-v-m comp-icon-gap"
                  onClick={this.previousMonth}/>
            <span style={iconStyle}
                  className="icon-img icon-img icon-tran-black-r util-v-m"
                  onClick={this.nextMonth}/>
        </div>
    }

});

module.exports = PickerHeader;