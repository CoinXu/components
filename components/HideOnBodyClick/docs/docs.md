## HideOnBodyClick
该组件在 Body 被点击时，将会卸载。请注意：是卸载，而不是隐藏。  
该组件一般作为书写组件人员内部调用。

### Props
+ component - `String` - 组件 type
+ visible - `Boolean` - 默认是否隐藏。
  <div class="info">
    新属性
  </div>
+ refTarget - `Node` - 当refTarget被点击是，不会触发卸载函数
+ onHide - `Function` - 卸载时调用的函数
+ onAnimateMount - `Function` - 当动画组件完成时调用，
  传入的参数为动画组件的实例对象。
  <div class="error">
     已废弃,请用 `onMount` 代替
  <div>
+ onMount - `Function` - 当动画组件完成时调用，传入的参数为动画组件的实例对象。
  <div class="error">
     已废弃
  <div>
+ triggerHide - `Function` - 每调用卸载函数时，会先调用该函数，
  若该函数返回的值不为真值，则不会触发卸载。
  <div class="error">
    已废弃,请用 `shouldHide` 代替
  </div>
+ shouldHide - `Function` - 每调用卸载函数时，会先调用该函数，
  若该函数返回的值不为真值，则不会触发卸载。
+ onStateChange(entrance) - `Function` - 每次动画出场入场状态交替时触发,
  参数`entrance`表示当前状态是出场`(false)`还是入场`(true)`
  <div class="info">
    新属性
  </div>
+ effect - `Boolean` - `true` - 是否需要动画特效,需要注意的是,就算值为`false`,
  也会触发 `onStateChange` 属性。
  <div class="info">
     新属性
  </div>

## 最简单的调用

1. 引入
```Javascript
var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('react-components').HideOnBodyClick;
```

2. 调用

### 有动画
```Javascript
ReactDOM.render(
    <HideOnBodyClick>
        <span className="widget-bg-text">点body其他地方，我就不见了...Biu~Biu~Biu~</span>
    </HideOnBodyClick>,
    document.getElementById('demo')
);
```

### 无动画
```Javascript
ReactDOM.render(
    <HideOnBodyClick effect={false}>
      <span className="widget-bg-text">这是一个没有动画的HideOnBodyClick</span>
    </HideOnBodyClick>,
    document.getElementById('demo')
);
```