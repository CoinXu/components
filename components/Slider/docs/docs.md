## 滑动器
该目录内包含两个组件
+ [Slipper](./Slipper.html)
+ [Slider](./Slider.html)

## 调用
1. 引入
```JavaScript
 var React = require('react');
 var ReactDOM = require('react-dom');
 var Slipper = require('Slider').Slipper;
 var Slider = require('Slider').Slider;
 var log = function(){
    console.info(arguments)
 };
```

2. Slider
```JavaScript
ReactDOM.render(<Slider onChange={log}/>, mountNode);
```

3. Slipper
```JavaScript
ReactDOM.render(<Slipper onMove={log} />, mountNode);
```