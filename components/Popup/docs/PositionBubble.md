## PositionBubble 给定一个元素，弹出一个 Popup
该组件是一个函数，直接调用，不用 `ReactDOM.render` 渲染。
```JavaScript
// 指定一个元素，弹出Popup
var baseElement = document.querySelector('#demo-special-position');
var closeElement = document.querySelector('#demo-special-position-close');
var updateElement = document.querySelector('#demo-special-position-update');
var updateElement1 = document.querySelector('#demo-special-position-update-1');
var unmountElement = document.querySelector('#demo-special-position-unmount');
var positionBubble = require('../PositionBubble');
// 组件挂载后，插入内容
var onMount = function (wrap, inst) {
    wrap.innerHTML = '<h2>BiuBiu~</h2>';
};
var popup = positionBubble(baseElement, {
    onMount: onMount,
    placement: 'left',
    symbolStyle: {top: 6}
});
// 显示
baseElement.addEventListener('click', popup.show, false);
// 关闭
closeElement.addEventListener('click', popup.hide, false);
// 更新位置
updateElement.addEventListener('click', function () {
    popup.updateBaseElement(updateElement)
}, false);
// 更新位置
updateElement1.addEventListener('click', function () {
    popup.updateBaseElement(updateElement1)
}, false);
// 卸载
unmountElement.addEventListener('click', popup.unMount, false);
```

### 内部封装组件,如果有需要,可以开放出所有的属性
### Props
+ visible - 初始化时是否显示 - false
+ baseElement - 定位参照元素 - body
+ onUnMount - 卸载时执行的回调 - noop
+ onMount(wrap, inst) - 挂载后执行回调 - noop
+ getContent(props, state, inst) - 获得弹层内容,如果要获得不同类型的弹层,
  改写该函数即可。
  ```JavaScript
  function (props, state, inst) {
    var style = {left: '50%', marginLeft: -10};
    return <Bubble
        placement="top"
        symbolStyle={style}
        onMount={inst.onMount}/>
  }
  ```
### Methods
+ unMount() - 卸载组件
+ show() - 显示组件
+ hide() - 隐藏不卸载
+ updateBaseElement(elem) - 更新依赖元素, 调用该函数,会重新根据参数`elem`定位位置。