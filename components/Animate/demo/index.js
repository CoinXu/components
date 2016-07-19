/**
 * Created by xcp on 2016/3/12.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const Animate = require('../index');
const AnimateController = React.createClass({

  getInitialState: function () {
    return {entrance: true}
  },

  entry: function () {
    this.setState({entrance: true})
  },

  leave: function () {
    this.setState({entrance: false})
  },

  render(){
    return <div style={{position:'relative'}}>
      <Animate
          from={{left:0}}
          to={{left:400}}
          style={{position:'absolute'}}
          entrance={this.state.entrance}>
        <div>I'am Animate first child</div>
      </Animate>
      <button
          style={{marginTop:100}}
          onMouseLeave={this.leave}
          onMouseEnter={this.entry}>
        Hover me to toggle
      </button>
    </div>
  }
});

var TWEEN = require('../../../com/tween');

// 最简单的调用
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
        during={200}
        repeat={3}>
      <div>I'am Animate first child. I'll repeat triple</div>
    </Animate>,
    document.getElementById('demo-1')
);
