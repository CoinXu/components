/**
 * Created by xcp on 2016/4/27.
 */

var Calendar = require('../index');
var ReactDOM = require('react-dom');
var noop = function () {
};
var moment = require('moment');

// 全部使用默认值渲染
ReactDOM.render(<Calendar
        onSelect={function(time){console.log(time.format())}}
        onChange={function(c, p){console.log(c.format(), p.format())}}/>,
    document.getElementById('demo')
);

// 不要日期，只要年月
ReactDOM.render(<Calendar
        onlyShowMonth
        onSelect={function(time){console.log(time.format())}}
        onChange={function(c, p){console.log(c.format(), p.format())}}/>,
    document.getElementById('demo-only-show-month')
);

// 用Popup包装弹出
const Popup = require('../../Popup').Popup;
const baseDate = moment(new Date());
const WrapCalendar = React.createClass({
    getInitialState: function () {
        return {currentTime: null}
    },
    getDefaultProps: function () {
        return {
            defaultTime: moment(new Date()),
            onSelect: noop,
            onChange: noop
        }
    },
    componentWillMount: function () {
        this._prevTime = null;
        this._useableTime = this.props.defaultTime;
        this.setState({currentTime: this.props.defaultTime});
    },
    componentDidUpdate: function (prevProps, prevState) {
        this._prevTime = prevState.currentTime;
    },
    onChange: function (cur, prev) {
        // 前日期的月份与上一次缓存的可用日期年月相同，则将当前日期设置为上一次缓存的日期
        if (cur.month() === this._useableTime.month() &&
            cur.year() === this._useableTime.year()) {
            this.setState({currentTime: this._useableTime})
        }
        this.props.onChange(cur, prev);
    },
    onSelect: function (cur) {
        if (cur.valueOf() >= baseDate.valueOf()) {
            this._useableTime = cur;
            this.setState({currentTime: cur})
        }
        this.props.onSelect(cur);
    },
    shouldUpdate: function () {
        return !this._prevTime || this._prevTime.valueOf() !== this.state.currentTime.valueOf();
    },
    render: function () {
        var state = this.state;
        var content = <Calendar
            shouldUpdate={this.shouldUpdate}
            defaultTime={state.currentTime}
            onSelect={this.onSelect}
            onChange={this.onChange}/>;
        return <Popup
            shouldUpdate={this.shouldUpdate}
            content={content}
            placement="bottom">
            <div className="comp-custom-select">
                <div className="comp-select-selector-pd">
                    <div className="comp-select-selector">
                        <span className="util-font-12">
                            {state.currentTime.format('YYYY-MM-DD')}
                        </span>
                        <span className="icon-img icon-tran-black-d"/>
                    </div>
                </div>
            </div>
        </Popup>
    }
});

ReactDOM.render(
    <WrapCalendar />,
    document.getElementById('demo-wrap')
);