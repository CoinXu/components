## MiniContainer mini货柜

该组件包含了两个Mixin
+ [SelectableMixin](./SelectableMixin.html)
+ [ContainerMixin](./ContainerMixin.html)

```JavaScript
var Selector = require('react-components-s').Selectable;
var ReactDOM = require('react-dom');
var React = require('react');
var log = function () {
    console.info(arguments)
};
```

```JavaScript
ReactDOM.render(
    <Selector.MiniContainer
        itemList={containers}
        onSelect={log}/>,
    mountNode
);
```