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
            currentYear: null,
            currentMonth: null
        }
    },

    getDefaultProps: function () {
        return {
            className: '',
            currentTime: moment(),
            startTime: [2010, 1, 1],
            endTime: [2020, 1, 1],
            onChange: noop
        }
    },

    setYear: function (year) {
        this.setState({currentYear: year})
    },

    setMonth: function (month) {
        this.setState({currentMonth: month})
    },

    componentWillMount: function () {
        var props = this.props;
        var start = moment(props.startTime);
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
            currentYear: yearList[0],
            currentMonth: monthList[0]
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        if (nextState.currentYear.year() !== this.state.currentYear.year() ||
            nextState.currentMonth !== this.state.currentMonth) {
            this.props.onChange(nextState.currentYear.year(), nextState.currentMonth)
        }
        return false;
    },

    render: function () {
        return <div className={this.props.className}>
            <Selectable.Custom
                defaultSelectedValue={this.state.currentYear}
                getSelectorContent={getSelectorContent}
                getItemContent={getItemContent}
                onSelect={this.setYear}
                itemList={this.__yearList}/>
            <Selectable.Importable
                defaultSelectedValue={this.state.currentMonth}
                onSelect={this.setMonth}
                itemList={this.__monthList}/>
        </div>
    }

});

module.exports = PickerHeader;