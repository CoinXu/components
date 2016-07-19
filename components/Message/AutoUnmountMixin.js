/**
 * Created by xcp on 2016/3/18.
 */

var ReactDOM = require('react-dom');
var noop = require('../../com/noop');

module.exports = {

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
    this.setState({visisble: false})
  },

  autoUnmount: function () {
    setTimeout(this.unmount, this.props.during)
  }
};