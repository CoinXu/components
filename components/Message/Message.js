/**
 * Created by xcp on 2016/3/18.
 * 全局提示信息，会自动隐藏掉
 * 如果有多个信息同时出现，则依次排成一列
 */

var React = require('react');
var Animate = require('../Animate');
var noop = require('../../com/noop');

var Message = React.createClass({

  getInitialState: function () {
    return {entrance: true}
  },

  getDefaultProps: function () {
    return {
      message: '',
      during: 3000,
      closeable: false,
      onMount: noop,
      onUnmout: noop,
      animate: {
        component: 'span',
        from: {opacity: 0},
        to: {opacity: 1},
        during: 500
      }
    }
  },

  componentDidMount: function () {
    this.props.onMount(this)
  },

  unmount: function () {
    this.setState({entrance: false})
  },

  autoUnmount: function () {
    setTimeout(this.unmount, this.props.during)
  },

  onComplete: function (entrance) {
    if (entrance && !this.props.closeable) {
      this.autoUnmount()
    }
  },

  render: function () {
    var props = this.props;

    return <Animate
        entrance={this.state.entrance}
        onComplete={this.onComplete}
        component={props.animate.component}
        from={props.animate.from}
        to={props.animate.to}
        during={props.animate.during}>
      <div className="inline-block">
        <div className="bub-bill">
          <div className="util-bill-pd">{props.message}</div>
        </div>
      </div>
    </Animate>
  }
});

module.exports = Message;