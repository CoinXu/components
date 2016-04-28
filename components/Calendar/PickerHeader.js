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
            currentTime: null
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

    setTime: function (time) {
        this.setState({currentTime: time})
    },

    setYear: function (time) {
        this.setTime(time.clone().month(this.state.currentTime.month()))
    },

    setMonth: function (month) {
        this.setTime(this.state.currentTime.clone().month(month - 1))
    },

    nextMonth: function () {
        this.setTime(this.state.currentTime.clone().add(1, 'month'))
    },

    previousMonth: function () {
        this.setTime(this.state.currentTime.clone().add(-1, 'month'))
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

        assert(sl >= el, 'start year need less than end year');

        // 年间距
        var yearList = [];
        var s = 0, l = el - sl;
        while (s <= l) {
            yearList.push(start.clone().add(s++, 'year'))
        }

        var monthList = new Array(12).fill(1).map(function (v, i) {
            return i + 1
        });

        this.__yearList = yearList;
        this.__monthList = monthList;

        this.setState({
            currentTime: this.props.currentTime
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        if (nextState.currentTime.year() !== this.state.currentTime.year() ||
            nextState.currentTime.month() !== this.state.currentTime.month()) {
            this.props.onChange(nextState.currentTime.year(), nextState.currentTime.month());
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
                itemList={this.__monthList}/>

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