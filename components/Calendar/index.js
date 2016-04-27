/**
 * Created by xcp on 2016/4/27.
 */

const moment = require('moment');
const DropDown = require('../Selectable/DropDown');
const React = require('react');
const noop = require('../../com/noop');
const DatePicker = require('./DatePicker');
const PickerHeader = require('./PickerHeader');

const addTimes = function (baseTime, num, unit) {
    return moment(baseTime).add(num, unit);
};

// 如果日期在当前日期之前，则禁用掉
const disabledDate = function (time) {
    return time.isBefore(new Date(), 'days')
};

// 如果日期不属于同一月，则表示diff
const diffDate = function (base, comp) {
    return !(base.isSame(comp, 'month') && base.isSame(comp, 'year'))
};

const Calendar = React.createClass({

    propTypes: {
        weekDaysMin: React.PropTypes.array
    },

    getInitialState: function () {
        return {
            show: false,
            currentTime: null
        }
    },

    getDefaultProps: function () {
        return {
            wrapClassName: 'comp-date-picker',
            disabledClassName: 'disabled',
            currentClassName: 'curr',
            diffMonthClassName: 'diff',
            disabledDate: disabledDate,
            diffDate: diffDate,
            showToday: true,
            showWeekNumber: true,
            defaultTime: new Date() * 1,
            showDays: 6 * 7,
            weekDaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            startWeek: 0, // [0-6]
            format: 'YYYY-MM-DD HH:mm:ss',
            onChange: noop,
            onSelect: noop
        }
    },

    componentWillMount: function () {
        this.setState({
            currentTime: moment(this.props.defaultTime),
            showDays: this.props.showDays
        })
    },

    nextMonth: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, 1, 'months')})
    },

    previousMonth: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, -1, 'months')})
    },

    nextYear: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, 1, 'years')})
    },

    previousYear: function () {
        this.setState({currentTime: addTimes(this.state.currentTime, -1, 'years')})
    },

    today: function () {
        this.setState({currentTime: moment()})
    },

    _isSameDate: function (base, comp) {
        return base.isSame(comp, 'years') &&
            base.isSame(comp, 'months') &&
            base.isSame(comp, 'days')
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (!this._isSameDate(prevState.currentTime, this.state.currentTime)) {
            this.props.onChange(prevState.currentTime, this.state.currentTime);
        }
    },

    // 如果年月日都相同，则不更新
    shouldComponentUpdate: function (nextProps, nextState) {
        return !this._isSameDate(nextState.currentTime, this.state.currentTime);
    },

    _spliceArray: function (arr, step) {
        var l = arr.length;
        var start = 0;
        var r = [];
        while (start < l) {
            r.push(arr.slice(start, start + step));
            start += step;
        }
        return r;
    },

    onHeaderChange: function (year, month) {
        console.log(year, month)
    },

    onSelect: function (cur) {
        this.setState({currentTime: cur});
        this.props.onSelect(cur);
    },

    render: function () {
        var props = this.props;
        var self = this;

        var m = moment(this.state.currentTime);

        // 获得当前月的第一天
        var firstDay = moment([m.year(), m.month(), 1]);

        // 获得第一天的星期
        var w = firstDay.day();

        // 计算其开始位置的日期
        // 从周日开始[默认为0]
        var start = w > props.startWeek ? firstDay.add(-w, 'days') : firstDay;

        var total = props.showDays;
        var count = 0;

        // 循环生成每一天
        // 日期分成多份，每份长度为一周
        var list = this._spliceArray(new Array(total).fill(true), 7);

        var days = list.map(function (week, index) {
            return <tr key={index}>
                {week.map(function () {
                    return <td key={count}>
                        <DatePicker
                            onSelect={self.onSelect}
                            diffMonthClassName={props.diffMonthClassName}
                            disabledClassName={props.disabledClassName}
                            currentClassName={props.currentClassName}
                            currentTime={m}
                            disabledDate={props.disabledDate}
                            diffDate={props.diffDate}
                            format={props.format}
                            time={start.clone().add(count++, 'days')}/>
                    </td>
                })}
            </tr>
        });

        var week = [];

        total = props.weekDaysMin.length;
        count = props.startWeek;

        while (count < total) {
            week.push(<td key={'week-' + count}><span>{props.weekDaysMin[count++]}</span></td>);
        }

        count = 0;
        total = props.startWeek;

        while (count < total) {
            week.push(<td key={'week-' + count}><span>{props.weekDaysMin[count++]}</span></td>)
        }

        week = <tr>{week}</tr>;

        return <div className={props.wrapClassName}>
            <PickerHeader onChange={this.onHeaderChange}/>
            <table>
                <thead>{week}</thead>
                <tbody>{days}</tbody>
            </table>
        </div>
    }
});

module.exports = Calendar;