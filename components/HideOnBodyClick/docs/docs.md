## HideOnBodyClick
该组件在 Body 被点击时，将会卸载。请注意：是卸载，而不是隐藏。  
该组件一般作为书写组件人员内部调用。

### Props
+ component - `String` - 组件 type
+ isVisible - `Boolean` - 默认是否隐藏
+ refTarget - `Node` - 当refTarget被点击是，不会触发卸载函数
+ onHide - `Function` - 卸载时调用的函数
+ onAnimateMount - `Function` - 当动画组件完成时调用，传入的参数为动画组件的实例对象
+ triggerHide - `Function` - 每调用卸载函数时，会先调用该函数，若该函数返回的值不为真值，则不会触发卸载。

## 最简单的调用

1. 引入
```Javascript
var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('react-components-s').HideOnBodyClick;
```

2. 调用
```Javascript
ReactDOM.render(
    <HideOnBodyClick>
        <span className="widget-bg-text">点body其他地方，我就不见了...Biu~Biu~Biu~</span>
    </HideOnBodyClick>,
    document.getElementById('demo')
);
```