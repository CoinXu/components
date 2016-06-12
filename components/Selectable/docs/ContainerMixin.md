## ContainerMixin 货柜公共部份

### Methods
+ addOne - 添加一个新的货柜
+ removeOne(item) - 移除一个货柜
+ getProgressClassName(percent, ...classNames) - 转换货柜 className。
  percent 为货柜装量百分比，classNames 为其需要附加的 className。
  
### Props
+ add - 点击添加按钮的事件 - noop
+ remove - 点击删除按钮的事件 - noop