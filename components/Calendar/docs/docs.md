### Calendar 日历组件
+ 依赖: [moment](https://github.com/moment/moment)，需要手动引入 `/com/moment`
+ 目前下属两个子元素
  - [DatePicker](./DatePicker.html)
  - [PickerHeader](./PickerHeader.html)

### Props
+ `wrapClassName` - 外层容器class - 'comp-date-picker'
+ `headerClassName` - PickerHeader class - 'date-header'
+ `disabledClassName` - disabled状态的日期class - 'disabled'
+ `currentClassName` - 当前日期的class - 'curr'
+ `diffMonthClassName` - 同一面板上，标识出特别的日期class - 'diff'
+ `startTime` - 开始时间 - [2010, 1, 1]
+ `endTime` - 结束时间 - [2020, 1, 1]
+ `defaultTime` - 默认选中时间 - new Date() * 1
+ `showDays` - 显示多少个日期 - 6 * 7
+ `weekDaysMin` - 星期的简写，多语言处理时传不同的参数 - ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
+ `startWeek` - 日期列表从星期几开始排 - 0 - [0-6]
+ `format` - 格式化，用于组件内部处理返回日期格式 - 'YYYY-MM-DD HH:mm:ss'
+ `onlyShowMonth` - 只显示年、月选择器 - false
+ `disabledDate` - 禁用的日期 - `function(time){return time.isBefore(new Date(), 'day')}`
+ `diffDate` - 外层容器class 
```JavaScript
function (base, comp) {
    return !(base.isSame(comp, 'month') && base.isSame(comp, 'year'))
}
```
+ `onChange(current, prev)` - 前后选择发生变化时回调 - noop
+ `onSelect(selected)` - 选择某个日期的回调 - noop

### Methods
+ `today` - 设置选中的日期为当前系统时间



### 简单的渲染
```JavaScript
var Calendar = require('../index');
var ReactDOM = require('react-dom');
var noop = function(){};
var moment = require('moment');
// 全部使用默认值渲染
ReactDOM.render(<Calendar
        onSelect={function(time){console.log(time.format())}}
        onChange={function(c, p){console.log(c.format(), p.format())}}/>,
    document.getElementById('demo')
);
```

### 不要日期，只要年月
```JavaScript
ReactDOM.render(<Calendar
        onlyShowMonth
        onSelect={function(time){console.log(time.format())}}
        onChange={function(c, p){console.log(c.format(), p.format())}}/>,
    document.getElementById('demo-only-show-month')
);
```

### 使用Popup包装
```JavaScript
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
        this.setState({currentTime: this.props.defaultTime})
    },
    onChange: function (cur, prev) {
        this.setState({currentTime: cur});
        this.props.onChange(cur, prev);
    },
    render: function () {
        var state = this.state;
        var props = this.props;
        var content = <Calendar
            defaultTime={props.defaultTime}
            onSelect={props.onSelect}
            onChange={this.onChange}/>;
        return <Popup
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
// 渲染
ReactDOM.render(
    <WrapCalendar />,
    document.getElementById('demo-wrap')
);
```