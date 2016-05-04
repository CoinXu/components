## PositionBubble 给定一个元素，弹出一个 Popup
该组件是一个函数，直接调用，不用 `ReactDOM.render` 渲染。
```JavaScript
// 指定一个元素，弹出Popup
var baseElement = document.querySelector('#demo-special-position');
var closeElement = document.querySelector('#demo-special-position-close');
var positionBubble = require('../PositionBubble');
// 组件挂载后，插入内容
var onMount = function (wrap, inst) {
    wrap.innerHTML = '<h2>BiuBiu~</h2>';
};
var popup = positionBubble(baseElement, onMount);
// 显示
baseElement.addEventListener('click', popup.show, false);
// 关闭
closeElement.addEventListener('click', popup.unMount, false);
```

### 内部封装组件
### Props
+ placement - `String` - 方向 `top` `right` `bottom` `left` 四个方向
+ symbolStyle - `{left: '50%', marginLeft: -10}` - 小箭头的 style，用于控制位置
+ baseElement - `HTMLElement` - 定位依赖元素
+ style - `Object` - 外层容器 style，一般不用传
+ onMount(warpNode, inst) - `Function` - 组件挂载后回调
+ onUnMount() - `Function` - 组件挂载后回调

### Methods
+ unMount()
+ show()