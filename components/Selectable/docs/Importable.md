## Importable - 可选择后输入的组件
该组件是对 [DropDown](./DropDown.html) 的一个封装，选择某一个固定项时， `selector` 区域变为一个 `input`。

### Props
+ itemList - 选项值列表 - `[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+']`
+ defaultSelectedValue - 默认选中的值 - `1`
+ onSelect - 选择某个Item时的回调 - noop
+ rejectValue - 触发`selector`变为`input`的值 - '10+'
+ disabled - 是否禁用 - `false`
+ validate(inputValue, inputNode) - 
  验证函数，当组件变为input时，input `onChange` 事件触发，
  如果该函数返回的值不为真，那么当前的 `inputValue` 不会设置为组件的当前值；
  如果返回真，则设置。
  - `function(){return true;}`

### Props
+ validate - 验证`input`的输入值，在该函数中会调用 `props.validate` 函数来作为判断依据。
  只有在组件变为 `input` 时有效，其余情况一律返回true。

### 调用
```JavaScript
var Selector = require('react-components-s').Selectable;
var ReactDOM = require('react-dom');
var React = require('react');
var log = function () {
    console.info(arguments)
};
```
1. 默认Props、传入验证函数
```JavaScript
var validation = function (val, input) {
    if (!/^[0-9]+$/.test(val)) {
        alert('请输入数字');
        return false;
    }
    return true;
};
ReactDOM.render(
    <Selector.Importable
        validate={validation}
        onSelect={log}/>,
    mountNode
);
```
2. 传入Props
```JavaScript
var itemList = ['全部时间', '3天内', '7天内', '30天内', '其他'];
ReactDOM.render(
    <Selector.Importable
        onSelect={log}
        itemList={itemList}
        defaultSelectedValue={itemList[0]}
        rejectValue={itemList[itemList.length - 1]}/>,
    mountNode
);
```