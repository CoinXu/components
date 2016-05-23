## SelectableMixin
包含了 [Selectable](./Selectable.html) 的公共部份。

### Methods
+ `getInitialState` - 初始State
+ `getDefaultProps` - 初始Props
+ `onSelect` - 当Item被选中时，该方法会被调用：执行 `props.onSelect` 并隐藏面板。
+ `onHide` - 关闭面板后的回调
+ `triggerHide` - 确定当前状态下面板是否可隐藏，如果返回的值不是真值，面板不会隐藏。
   <div class="error">已废弃,已用 `shouldHide` 代替</div>
+ `shouldHide` - 确定当前状态下面板是否可隐藏，如果返回的值不是真值，面板不会隐藏
+ `onAnimateMount` - [Selectable](./Selectable.html) 中包含了一个 
  [HideOnBodyClick](../../HideOnBodyClick/docs/docs.html)，为了在组件中可以控制动画，
  所以使用该函数将动画实例导出来。
+ `showPanel` - 显示面板函数
+ `hidePanel` - 关闭面板函数

### Props
+ `itemList` - 数据列表 -  `[]`
+ `selectorClassName` - 选择器元素ClassName  `''`
+ `selectorStyle` - 选择器元素style - `{}`
+ `defaultSelectedValue` - 默认选中的值 - `itemList[0]`
+ `onSelect` - 选择后的回调 - `noop`
+ `onSelect` - 选择后的回调 - `noop`
+ `shouldHide` - 确定当前状态下面板是否可隐藏，如果返回的值不是真值，面板不会隐藏
