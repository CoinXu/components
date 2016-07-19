/**
 * Created by xcp on 2016/4/30.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Bubble = require('./Bubble');
var PopupWrap = require('./PopupWrap');

var noop = require('../../com/noop');
var body = require('../../com/DOM/DOMBody');
var absolutePosition = require('../../com/absolutePosition');
var POPUP_GAP = 5;

var PositionBubble = React.createClass({

  getInitialState: function () {
    return {
      visible: false,
      baseElement: body
    };
  },

  getDefaultProps: function () {
    return {
      visible: false,
      baseElement: body,
      onUnMount: noop,
      onMount: noop,
      getContent: function (props, state, inst) {
        var style = {left: '50%', marginLeft: -10};
        return <Bubble
            placement="top"
            symbolStyle={style}
            onMount={inst.onMount}/>
      }
    };
  },

  componentWillMount: function () {
    this.setState({
      visible: this.props.visible,
      baseElement: this.props.baseElement
    })
  },

  componentDidUpdate: function (prevProps, prevState) {
    this.refs.popupWrap.recompute()
  },

  computePosition: function () {
    var props = this.props;
    var target = this.state.baseElement;
    var pos = absolutePosition(target);
    var placement = props.placement;
    var w = target.offsetWidth;
    var h = target.offsetHeight;

    switch (placement) {
      case "top":
        pos.y = pos.y - POPUP_GAP;
        break;
      case "right":
        pos.x = pos.x + w + POPUP_GAP;
        break;
      case "bottom":
        pos.y = pos.y + h + POPUP_GAP;
        break;
      case "left":
        pos.x = pos.x - POPUP_GAP;
        break;
    }
    return pos;
  },

  shouldHide: function () {
    return false
  },

  update: function (props) {
    this.setState(props)
  },

  updateBaseElement: function (elem) {
    if (elem === this.state.baseElement && this.state.visible)
      return;

    // 先要隐藏原来的元素
    // 然后再更新位置并显示新的元素
    // TODO 如果此处要平滑的过渡,应该想办法延迟 visible:true 的触发形为
    this.setState({visible: false}, function () {
      this.setState({
        visible: true,
        baseElement: elem
      })
    });
  },

  onMount: function (wrap, inst) {
    this.props.onMount(wrap, inst);
  },

  show: function () {
    this.setState({visible: true})
  },

  hide: function () {
    this.setState({visible: false})
  },

  render: function () {
    var props = this.props;
    var pos = this.computePosition();
    var content = props.getContent(props, this.state, this);

    var style = {
      top: pos.y,
      left: pos.x,
      position: 'absolute'
    };
    return <PopupWrap
        onHide={this.onHide}
        ref="popupWrap"
        placement={content.props.placement}
        shouldHide={this.shouldHide}
        style={style}
        baseElement={this.state.baseElement}
        visible={this.state.visible}>
      {content}
    </PopupWrap>
  }

});

module.exports = function (target, props) {
  if (!body) return {};

  props = typeof props === 'object' && props ?
      props : {};

  var _props = {};

  Object.keys(PositionBubble.defaultProps).forEach(function (name) {
    if (props.hasOwnProperty(name))
      _props[name] = props[name]
  });

  var mountNode = document.createElement('div');

  body.appendChild(mountNode);
  var _onUnMount = _props.onUnMount;

  _props.onUnMount = function () {
    _onUnMount && _onUnMount();
    body.removeChild(mountNode)
  };

  _props.baseElement = target;

  return ReactDOM.render(
      React.createElement(PositionBubble, _props),
      mountNode
  );
};
