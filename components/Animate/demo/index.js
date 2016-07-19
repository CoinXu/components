/**
 * Created by xcp on 2016/3/12.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const Animate = require('../index');
const log = function (mark) {
  return function () {
    console.log.apply(
        console,
        [mark].concat(Array.prototype.slice.call(arguments))
    )
  }
};
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

var TWEEN = require('../../../com/tween');

// 外部控制出场入场
ReactDOM.render(
    <AnimateController/>,
    document.getElementById('demo')
);

// 传入参数
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
    document.getElementById('demo-1')
);
