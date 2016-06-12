## Custom 自定义下拉
+ itemList - 数据列表 - []
+ wrapClassName - 外包装窗口 - null
+ defaultSelectedValue - 默认选中的值，如果不传，默认选择`itemList[0]` - null
+ disabled - 是否禁用 - `false`
+ onSelect - 选择事件回调 - noop
+ getItemWrap(panel, props, state, inst) - 
  获取弹层容器函数，panel `getItemContent` 返回的所有的内容
+ getSelectorContent(currentSelectedValue) - 获取Selector区域内容函数 - noop
+ getItemContent(value, props) - 获取Item内容函数 - noop 
+ getItemsContent(props, state, inst) - 获取所有Item的函数，
  如果该函数返回值为`undefined`，则根据`itemList`循环调用`getItemContent` - noop 

## 示例
```JavaScript
// 获取Selector区域内容函数
var getSelector = function (currentSelectedValue) {
    return <div className="comp-select-selector">
        <span className="util-font-12">{currentSelectedValue.text}</span>
        <span className="icon-img icon-tran-black-d"/>
    </div>
};
// 获取Item内容函数
var getItem = function (value, props) {
    var item = <li className="comp-panel-item" key={value.code}>
        <strong>{value.text}</strong>
    </li>;
    return React.cloneElement(item, props);
};
// 渲染
ReactDOM.render(
    <Selector.Custom
        itemList={[{text:1, code:1},{text:2, code:2},{text:3, code:3}]}
        getItemContent={getItem}
        getSelectorContent={getSelector}
        onSelect={log}/>,
    mountNode
);
```