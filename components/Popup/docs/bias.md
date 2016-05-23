## Bias 带有方向的汽泡

### Props
+ placement - `String` - 方向 `top` `right` `bottom` `left` 四个方向
+ symbolStyle - `Object` - 小箭头的 style，用于控制位置
+ symbolClass - `Array` - 小箭头的 className
+ closeable - `Boolean` - 是否可关闭
+ style - `Object` - 外层容器 style，一般不用传
+ onComponentMount(warpNode, inst) - `Function` - 组件挂载后回调
  <div class="warning">即将废弃,请用 `onMount` 代替</div>
+ onMount(warpNode, inst) - `Function` - 组件挂载后回调

## 调用方式

1. 引入
```JavaScript
var React = require('react');
var ReactDOM = require('react-dom');
var Bias = require('react-components-s').Bias
```

2. 使用
```JavaScript
ReactDOM.render(
    <Bias 
        placement="top"
        symbolStyle={{}}
        symbolClass={[]}
        style={{}}>
        Bias 内容
    </Bubble>,
    mountNode
);
```

### 可关闭的 Bias
```JavaScript
ReactDOM.render(
    <Bias 
        onMount={log}
        placement="top"
        closeable>
        Bias 内容
    </Bubble>,
    mountNode
);
```