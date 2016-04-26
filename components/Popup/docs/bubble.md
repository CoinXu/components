## Bubble 带有方向的汽泡

### Props
+ placement - `String` - 方向 `top` `right` `bottom` `left` 四个方向
+ symbolStyle - `Object` - 小箭头的 style，用于控制位置
+ symbolClass - `Array` - 小箭头的 className
+ style - `Object` - 外层容器 style，一般不用传
+ onComponentMount(warpNode, inst) - `Function` - 组件挂载后回调

## 调用方式
该组件不单独调用，一般用与 [Popup](./docs.html) 配合使用。

1. 引入
```JavaScript
var React = require('react');
var ReactDOM = require('react-dom');
var Bubble = require('react-components-s').Bubble
```

2. 使用
```JavaScript
ReactDOM.render(
    <Bubble 
        onComponentMount={log}
        placement="top"
        symbolStyle={{}}
        symbolClass={[]}
        style={{}}>
        Bubble 内容
    </Bubble>,
    mountNode
);
```