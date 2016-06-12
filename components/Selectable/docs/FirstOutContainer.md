## FirstOutContainer 先出货柜

该组件包含了两个Mixin
+ [SelectableMixin](./SelectableMixin.html)
+ [ContainerMixin](./ContainerMixin.html)

### Props
+ firstOut - `React.PropTypes.array`

其他没什么好说的了，具体看调用源码：
```JavaScript
var Selector = require('react-components-s').Selectable;
var ReactDOM = require('react-dom');
var React = require('react');
var log = function () {
    console.info(arguments)
};
```
```JavaScript
var containers = [
    {index: 0, percent: 0.8},
    {index: 1, percent: 0.23},
    {index: 2, percent: 0.23},
    {index: 12, percent: 0.83}
];
ReactDOM.render(
    <Selector.FOContainer
        firstOut={[containers[2]]}
        itemList={containers}
        onSelect={log}/>,
    mountNode
);
```