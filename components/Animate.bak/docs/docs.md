## Animate - 动画组件
+ props
  + component `React.PropTypes.string`
  + style `React.PropTypes.object`
  + from `React.PropTypes.object`
  + to `React.PropTypes.object`  
  + during `React.PropTypes.number`
  + delay `React.PropTypes.number`
  + repeat `React.PropTypes.number` 
  + easing `React.PropTypes.func`
  + className `React.PropTypes.string`
  + onMount(inst) `React.PropTypes.string` - 组件挂载后的回调

## 最简单的调用
1. 引入
```JavaScript
var React = require('react');
var ReactDOM = require('react-dom');
var Animate = require('react-components-s').Animate;
```
 
2. 创建一个 `AnimateChild`
```JavaScript
var AnimateChild = React.createClass({
    render(){
        var parent = this.props.parent;
        return (
            <div>
                <p>{this.props.name}</p>
                <button onClick={parent.backToTheStart.bind(parent, null)}>出场</button>
            </div>
        )
    }
});
```
当然也可以直接写 `React.Element` 作为 `child`，这里只是为了演示 `animate.backToTheStart` 方法
 
3. 调用
```JavaScript
ReactDOM.render(
    <Animate
        from={{left:0}}
        to={{left:400}}
        style={{position:'absolute', background: 'red'}}>
        <AnimateChild name="Animate Child" key="animate-child"/>
    </Animate>,
    mountNode
);
```

## 传入参数
```JavaScript
ReactDOM.render(
    <Animate
        from={{left:0}}
        during={500}
        repeat={2}
        delay={300}
        component="div"
        to={{left:400}}
        easing={TWEEN.Easing.Back.InOut}
        style={{position:'absolute', background: 'red', overflow: 'hidden', top: 50}}>
        <AnimateChild name="Animate Child 1" key="animate-child-1-1"/>
    </Animate>,
    mountNode
);
```