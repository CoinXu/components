/**
 * Created by xcp on 2016/3/22.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const Animate = require('../Animate');
const contains = require('../../com/DOM/contains');
const DOMEvent = require('../../com/DOM/DOMEvent');
const body = require('../../com/DOM/DOMBody');
const noop = require('../../com/noop');
const assert = require('../../com/assert');

const shouldHide = function () {
  return true;
};

const HideOnBodyClick = React.createClass({

  getInitialState: function () {
    return {
      visible: true
    }
  },

  getDefaultProps: function () {
    return {
      component: 'div',
      refTarget: null,
      style: {},
      visible: true,
      effect: true,
      onStateChange: noop,
      shouldHide: shouldHide
    }
  },

  componentWillMount: function () {
    this.setState({visible: this.props.visible})
  },

  componentDidMount: function () {

    this.__bodyHandle = function (e) {
      let target = e.target || e.srcElement;
      let mountNode = ReactDOM.findDOMNode(this);
      let props = this.props;

      if (!props.shouldHide()
          || (props.refTarget && contains(props.refTarget, target))
          || contains(mountNode, target)) {
        return
      }

      this.setState({visible: false})

    }.bind(this);

    DOMEvent.on(body, 'click', this.__bodyHandle, false);
  },

  componentWillReceiveProps: function (props) {
    this.setState({visible: props.visible})
  },

  componentWillUnmount: function () {
    DOMEvent.off(body, 'click', this.__bodyHandle, false);
  },

  onComplete: function (entrance) {
    this.props.onStateChange(entrance);
  },

  render: function () {
    const props = this.props;
    const Components = props.component;
    assert(props.children, 'children required in HideOnBodyClick');

    return <Components style={{background: '#fff'}}>
      <Animate
          entrance={this.state.visible}
          style={props.style}
          component={props.component}
          from={{opacity:0}}
          to={{opacity:1}}
          during={props.effect ? 200 : 0}
          onComplete={this.onComplete}>
        {props.children}
      </Animate>
    </Components>
  }
});

module.exports = HideOnBodyClick;