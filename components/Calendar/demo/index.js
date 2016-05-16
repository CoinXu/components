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
//
//// 不要日期，只要年月
//ReactDOM.render(<Calendar
//        onlyShowMonth
//        onSelect={function(time){console.log(time.format())}}
//        onChange={function(c, p){console.log(c.format(), p.format())}}/>,
//    document.getElementById('demo-only-show-month')
//);

// 用Popup包装弹出
const Popup = require('../../Popup').Popup;
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
        this._prevTime = this.props.defaultTime;
        this.setState({currentTime: this.props.defaultTime});
    },
    componentWillUpdate: function (nextProps, nextState) {
        this._prevTime = this.state.currentTime
    },
    onChange: function (cur, prev) {
        this.setState({currentTime: cur});
        this.props.onChange(cur, prev);
    },
    shouldUpdate: function () {
        return this._prevTime.valueOf() !== this.state.currentTime.valueOf();
    },
    render: function () {
        var state = this.state;
        var props = this.props;
        var content = <Calendar
            shouldUpdate={this.shouldUpdate}
            defaultTime={state.currentTime}
            onSelect={props.onSelect}
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