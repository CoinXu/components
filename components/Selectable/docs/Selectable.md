## Selectable - 可选择组件
该组件生成一个可选择的组件，包括两个部份：
+ selector - 选择结果区域 - 点击该区域时，显示 content。
+ content - 选择区域 - 一个空的样式面板。

该组件做两件事情：
1. 创建一个带有 `selector` 和 `content` 内容的组件。
2. 将 `content` 区域用 [HideOnBodyClick](../../HideOnBodyClick/docs/docs.html "右键新窗口中打开")
   组件包起来。

### Props
+ onSelect - noop -默认给 `content` 中的元素被选中时调用，
  通过将实例传给 `onComponentMount` 实现外部组件调用。
+ onComponentMount - noop - 组件挂载时调用，参数为组件实例。
  <div class="error">将要被废弃,请用 `onMount` 代替</div>
+ onMount - noop - 组件挂载时调用，参数为组件实例。
+ selectorBindEvent - true - 是否给 `selector` 绑定事件(显示组件事件)。
+ selectorContent - null - `selector` 内容。
+ panelContent - null - `conte+++nt` 内容。