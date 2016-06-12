## Container 货柜
生成一个货柜选择组件；包含了两个Mixin。
+ [SelectableMixin](./SelectableMixin.html)
+ [ContainerMixin](./ContainerMixin.html)

`Container` 生成的选择组件包含了三个功能。
1. 选择货柜时，将货柜装量显示到 `selector` 上
2. 创建一个 `+` 按钮，点击新增一条空货柜，并调用 `reRender` 方法重新渲染。
3. 每一个货柜后有一个 `X` 按钮，点击删除该条货柜，目前没有提示，直接删除。

```JavaScript
var Selector = require('react-components-s').Selectable;
var DropDown = Selector.DropDown;
var ReactDOM = require('react-dom');
var React = require('react');
var log = function () {
    console.info(arguments)
};
ReactDOM.render(
    <Selector.Container
        itemList={[{index:0, percent:0.8},{index:1, percent:0.23}]}
        onSelect={log}/>,
    mountNode
);
```