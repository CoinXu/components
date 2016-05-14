## Slipper 单个滑块

## Props
+ type - 滑块方向 - 'left'
+ timeGap - 间隔多久滑一次 - 50(ms)
+ min - 最小值 - 0 - [0-100]左开右开区间
+ max - 最大值 - 100 - [0-100]左开右开区间
+ step - 步长，每移动step个单位时，执行一次UI渲染 - 10。
  step 要能被 min 和 max 整除，否则不能选择左右两个闭区间。
+ base - 依赖位置，决定了滑块在UI上的滑动区间 - null。
  参数示例 `{x:0, y:0, w:100}`，三个属性必须同时存在。
  该值不为真值，则会取该组件的 `parentNode` 元素的位置作为 base。
+ disabled - 是否禁用 - false
+ onMount(inst) - 挂载后回调 - noop
+ onMove(pos) - 移动过程中的回调，传入参数为当前移动的位置与 base 的百分比 - noop