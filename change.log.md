## 2016-05-04 - xcp
1. `DropDown` 组件添加 `disabled` 属性
2. `Importable` 组件在变为 `input` 状态时，`onSelect` 的回调中传入的值
    为上一次选中的有效值，不再是 `props.rejectValue`。
    并将有效值显示在 `input` 元素上。
3. 修复给 `selector` 绑定显示 `panel` 事件的bug。
4. 给所有的 `DropDown` 的 `selector` 内容设置为不可选择（因快速双击时会触发区域内容选择事件）

涉及到的组件包括：`Selectable.Custom` `Selectable.Different` 
`Selectable.DropDown` `Selectable.Importable`

## 2016-04-29 - xcp
1. `Popup` 添加 `baseElement` 属性，详见文档
2. `Popup` 下添加 `PositionBubble` 组件，详见文档

## 2016-04-29 - xcp
`Pagination` 添加可选择每页多少条数据和可输入页码跳转功能，详见文档。

## 2016-04-28 - xcp
添加 `Calendar` 组件，详见文档

## 2016-04-26 —— xcp
1. ContainerMixin 添加 `add` `remove` 两个 props
2. SelectableMixin 添加 `selectorClassName` `selectorStyle` 两个props
受影响的组件包括： `MiniContainer` `Container` `FirstOutContainer`

## 2016-04-25 —— xcp
Bubble\Bias 组件添加 `onComponentMount` 属性，具体看文档

## 2016-04-23 —— xcp
1. Selectable.Importable 添加 `validate` 属性，用于组件变为 input 状态时的验证。
2. Selectable.Importable 添加 `validate` 方法。
以上详情见文档及Demo

## 2016-04-22 —— xcp
1. DropDown 开放自定义弹层容器功能，详见文档`getItemWrap`方法
2. Selectable.Custom 开放自定义弹层容器功能，详见 `DropDown` 文档中 `getItemWrap`
3. Selectable.Custom 开放获取所有`item`函数，详见 `getItemsContent`

## 2016-04-20 —— xcp 
1. 改所有 `onVisible` 函数名为 `onHide`
2. 改变 `HideOnBodyClick` 的动画 `during` 参数的值为 `200`
3. 开放 `Popup` 的 `triggerHide` 配置参数，具体内容参考 `Popup` 文档
4. 由于第2点变化，所有的动画组件动画时间变化。涉及组件包括不限于：
   `Selectable` `DropDown` `Dialog` `Container` `Importable` `Different` `FirstOutContainer`
   `MiniContainer` 
  
