## Animate - 动画组件
+ props
  + entrance: React.PropTypes.bool <div class="info">新属性</div>
  + component `React.PropTypes.string`
  + style `React.PropTypes.object`
  + from `React.PropTypes.object`
  + to `React.PropTypes.object`  
  + during `React.PropTypes.number`
  + delay `React.PropTypes.number`
  + repeat `React.PropTypes.number` 
  + easing `React.PropTypes.func`
  + onComplete(entrance) `React.PropTypes.func` - 每一次动画完成后执行该函数,
    参数 `entrance` 表示当前是入场还是出场动画
  + className `React.PropTypes.string`
  + onMount(inst) `React.PropTypes.string` - 组件挂载后的回调 <div
  class="error">已废弃</div>

## 外部控制出场入场
1. 引入
```JavaScript
const React = require('react');
const ReactDOM = require('react-dom');
const Animate = require('react-components').Animate;
const log = function (mark) {
  return function () {
    console.log.apply(
        console,
        [mark].concat(Array.prototype.slice.call(arguments))
    )
  }
};
```
 
2. 创建一个 `AnimateController`
```JavaScript
const AnimateController = React.createClass({
  getInitialState: function () {
    return {entrance: true}
  },
  toggle: function () {
    this.setState({entrance: !this.state.entrance})
  },
  render(){
    return <div style={{position:'relative'}}>
      <Animate
          from={{left:0}}
          to={{left:400}}
          style={{position:'absolute'}}
          entrance={this.state.entrance}
          onComplete={log('1: is entrance: ')}>
        <div>I'am Animate first child</div>
      </Animate>
      <button
          style={{marginTop:100}}
          onClick={this.toggle}>
        Hover me to toggle
      </button>
    </div>
  }
});
```

3. 调用
```JavaScript
ReactDOM.render(<AnimateController/>, mountNode);
```

## 传入参数
```JavaScript
ReactDOM.render(
    <Animate
        from={{left:0}}
        to={{left:400}}
        style={{position:'absolute'}}
        during={1000}
        repeat={3}
        onComplete={log('2: is entrance: ')}>
      <div>I'am Animate child. I'll repeat triple</div>
    </Animate>,
    mountNode
);
```