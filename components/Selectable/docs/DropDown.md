## DropDown 创建下拉菜单
该组件包含两个粒子组件

### DropDown.Item - 包含如下四个属性
+ wrapClassName - 容器class - null
+ selectorBindEvent - 是否给selector绑定显示panel事件 - null
+ value - null - Item的值，在 `onSelect` 执行时会将该属性传入
+ isItem - true - 是否是一个Item，如果是，会绑定对应的事件，如果不是，则不会绑定。
+ disabled - 是否禁用 - `false`
+ getItemContent(value, props, inst) - noop - 获取Item内容函数；组件会优先取用 `props.children` 的内容，
  如果 `props.children` 为null，则使用该函数的返回值。
  该函数会传入两个参数：`value` 、 `{onClick: this.onSelect}`，使用时可以将属性绑定在对应的元素上。
+ onSelect - noop - Item被选择时调用该函数，传入 `value`
  
### DropDown.Selector - 包含如下四个属性
+ defaultSelectedValue - null - 默认选中的值
+ onSelect - noop - 当Item被选中后的回调
+ onComponentMount - noop - 组件挂载后回调，传入参数为组件实例。
  <div class="error">已废弃,请用 `onMount` 代替</div>
+ onMount - noop - 组件挂载后回调，传入参数为组件实例。
+ getSelectorContent - noop - 同 `DropDown.Item` 的 `getItemContent`

## DropDown Props
+ onSelect - noop - 选择时的回调
+ selectorContent - null - 选择器内容
+ selectorBindEvent - true - 是否绑定事件
+ getItemWrap(panel, props, state, inst) - 获取弹层容器函数，
panel 是弹层内容`panelContent`
  - 如果该函数返回的值为undefined，
    则取`<ol className="comp-select-m-t">{panel}</ol>`
+ panelContent - null -面板内容
```
+-----------------------+
|    selector           |  --------> 点击该区域，弹出面板，该区域称之为 selector
+-----------------------+

+-----------------------+
|    item               |
|    item               |
|    item               |  --------> 除 Item 之外的内容，称之为 wrap
|    item               |
|    item               |
|    item               |
+-----------------------+
\                       /
+---- panelContent ----+
```
## 示例
```JavaScript
var DropDown = require('essa-components').DropDown;
// 自定义selector
var getSelector = function(currentSelectedValue){
    return 
}
```