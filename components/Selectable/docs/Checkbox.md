## CheckBox 选择框

### Props
+ wrapClassName - 包装容器className -  'list'
+ checkedList - 已选中的值 -  []
+ itemList - 列表值 -  []
+ maxChecked - 最多可选择多少个 -  true
+ onOutOfBounds(nextCheckedList) - 选择数量越界 -  noop
+ onComponentMount(inst) - 组件挂载后回调 -  noop
+ onChange(prevCheckedList, nextCheckedList) - 选择变化后回调 -  noop 
+ getContent(item, index, inst) - 返回内容函数，详情见代码

### Methods
+ cleanup() - 清除所选
+ checkAll() - 全选
+ getCheckedValue() - 获取所选项

## 示例
1.创建
```JavaScript
var Checkbox = require('essa-components').Checkbox;
var CheckWrap = React.createClass({
    getDefaultProps: function () {
        return {
            maxChecked: 1
        }
    },
    holdCheckbox: function (checkbox) {
        this._checkbox = checkbox;
    },
    cleanup: function () {
        this._checkbox.cleanup()
    },
    checkAll: function () {
        this._checkbox.checkAll()
    },
    getCheckedValue: function () {
        console.log(this._checkbox.getCheckedValue())
    },
    render: function () {
        return <div className="msg-condition">
            <div className="condition-title">
                <a className="color-green" onClick={this.checkAll}>All</a>
                <a className="a-link" onClick={this.cleanup}>Clear</a>
            </div>
            <div className="condition-padding msg-common-checkbox">
                <Checkbox
                    maxChecked={this.props.maxChecked}
                    itemList={checkboxItemList}
                    onComponentMount={this.holdCheckbox}
                    onOutOfBounds={log}
                    onchange={log}
                    checkedList={[checkboxItemList[0], checkboxItemList[1]]}/>
            </div>
            <button className="btn btn-default btn-xs" onClick={this.getCheckedValue}>
                点击log当前选中的值
            </button>
        </div>
    }
});
```

1. 声明listItem
```JavaScript
var checkboxItemList = function () {
    return new Array(10).fill(1).map(function (v, i) {
        return {value: i, content: {name: 'name-' + i, widget: '(123' + i + ')'}}
    })
}();
```
2. 全选
```JavaScript
ReactDOM.render(
    <CheckWrap maxChecked={checkboxItemList.length}/>,
    document.getElementById('multi-checkbox')
);
```

3. 单选
```JavaScript
ReactDOM.render(
    <CheckWrap maxChecked={1}/>,
    document.getElementById('single-checkbox')
);
```

4. 可选3个
```JavaScript
ReactDOM.render(
    <CheckWrap maxChecked={3}/>,
    document.getElementById('extra-checkbox')
);
```

