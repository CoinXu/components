### PickerHeader  日历组件 -> 头部
+ 依赖: [moment](https://github.com/moment/moment)，需要手动引入 `/lib/moment`

### Props
+ `wrapClassName` - 外层容器class - 'comp-date-picker'
+ `headerClassName` - PickerHeader class - 'date-header'
+ `disabledClassName` - disabled状态的日期class - 'disabled'
+ `currentClassName` - 当前日期的class - 'curr'
+ `diffMonthClassName` - 同一面板上，标识出特别的日期class - 'diff'
+ `currentTime` - 设定当前时间 - new Date() * 1
+ `format` - 格式化，用于组件内部处理返回日期格式 - 'YYYY-MM-DD HH:mm:ss'
+ `disabledDate` - 禁用的日期 - `function(time){return time.isBefore(new Date(), 'day')}`
+ `diffDate(props.defaultTime, date)` - 确定当前元素是否是标识上diff
```JavaScript
function (defaultTime, date) {
    return !(defaultTime.isSame(date, 'month') && defaultTime.isSame(date, 'year'))
}
```
+ `onChange(current, prev)` - 前后选择发生变化时回调 - noop
+ `onSelect(selected)` - 选择某个日期的回调 - noop
