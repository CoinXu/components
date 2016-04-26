## Bias

1. 引入
```JavaScript
var React = require('react');
var ReactDOM = require('react-dom');
var Popup = require('react-components-s');
var Bubble = Popup.Bubble;
var Bias = Popup.Bias;
var assign = require('object-assign');
```

2. 调用

### 不可自关闭的弹层
```JavaScript
ReactDOM.render(
    <Popup
        placement="top"
        content={<Bias style={{width:160}}>{biasContent}</Bias>}>
        <button className="btn btn-primary btn-sm">不可自关闭的弹层</button>
    </Popup>,
    mountNode
);
```

### hover显示关闭弹层
```JavaScript
ReactDOM.render(
    <Popup
        trigger="hover"
        placement="top"
        content={<Bias style={{width:160}}>{biasContent}</Bias>}>
        <button className="btn btn-primary btn-sm">hover显示关闭弹层</button>
    </Popup>,
    document.getElementById('bias-top-left-hover')
);
```

### 可关闭的弹层，各种方向
```JavaScript
ReactDOM.render(
    <Bias 
        onComponentMount={log} 
        closeable 
        placement="right">{biasContent}</Bias>,
    mountNode
);
```