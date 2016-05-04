## Different 带有不可选择项的下拉菜单。

### Props
+ itemList - 选项值列表 - 默认值如下：
  ```JavaScript
  var itemList = [
      {value: 0, text: '筛选异常原因'},
      {value: 1, text: '全部'},
      {value: 2, text: '编号重复'},
      {value: 3, text: '编号不存在'},
      {value: 4, text: '已下架'}
  ]
  ```
+ disabled - 是否禁用 - `false`
+ defaultSelectedValue - 默认选中的值 - `itemList[0]`
+ rejectValue - 使选择框变为输入框的值 - `null`
+ onSelect - 选择某个Item时（如果变为input，则为input.onchange事件的回调）的回调 - noop
+ getSelectorContent(currentItem) - 获取Selector的内容 - noop
+ getItemContent(item, props) - 获取item的内容 - noop

### 注：
`props.itemList` 中的值必须是 `{value:value, text: value}` 这样的形式。
目前的设置是： 
#### `value` 的值不为真值，则认为其是一个不可选择的项。
```JavaScript
var Selector = require('react-components-s').Selectable;
var ReactDOM = require('react-dom');
var React = require('react');
var log = function () {
    console.info(arguments)
};
ReactDOM.render(<Selector.Diff onSelect={log}/>, mountNode);
```