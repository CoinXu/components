## Slider 区间滑块

## Props
+ min - 最小值 - 0 - [0-100]左开右开区间
+ max - 最大值 - 100 - [0-100]左开右开区间
+ step - 步长，每移动step个单位时，执行一次UI渲染 - 2。
  step 要能被 ( max - min ) 整除，否则不能精确的选择左右最值。
+ disabled - 是否禁用 - false
+ onChange(left, right, ratio) - 移动过程中的回调，传入参数为当前移动的位置与 base 的百分比 - noop
+ leftValue - 左边滑块的当前值
+ rightValue - 右边滑块的当前值
+ leftStart - 左边滑块的最小值
+ leftEnd - 左边滑块的最大值
+ rightStart - 右边滑块的最小值
+ rightEnd - 右边滑块的最大值
+ precision - 浮点数取值精度
