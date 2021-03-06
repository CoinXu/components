/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var noop = require('../../com/noop');
var DOMEvent = require('../../com/DOM/DOMEvent');
var NotAllowSelect = require('../Pagination/NotAllowSelect');
var elementAbsPosition = require('../../com/absolutePosition');
var assign = require('object-assign');

var now = function () {
  return new Date() * 1
};

var Slipper = React.createClass({
  getInitialState: function () {
    return {
      style: {},
      disabled: false,
      pos: 0,
      dir: 'right',
      base: {x: 0, y: 0, w: 200}
    }
  },

  getDefaultProps: function () {
    return {
      style: {},
      type: 'left',
      timeGap: 50,
      min: 0,
      max: 100,
      // step 要能被 min 和 max 整除
      // 否则不能选择左右两个闭区间
      step: 10,
      start: 0,
      base: null,
      disabled: false,
      onMount: noop,
      onMove: noop
    }
  },

  componentWillMount: function () {
    var typeMirror = {
      left: 'right',
      right: 'left'
    };
    this.setState({
      disabled: this.props.disabled,
      pos: this.props.start,
      dir: typeMirror[this.props.type] || 'left',
      base: this.props.base
    })
  },

  componentDidMount: function () {
    this._mouseDown = false;
    this._prevTime = now();
    this.props.onMount(this);
    var self = this;
    var wrap, base;

    if (!this.props.base) {
      wrap = ReactDOM.findDOMNode(this.refs.wrap).parentNode;
      base = elementAbsPosition(wrap);
      base.w = wrap.offsetWidth;
      this.setState({base: base});
    }

    this._onMouseMoveProxy = function (e) {
      self.onMouseMove.call(self, e)
    };

    this._onMouseUpProxy = function (e) {
      self.onMouseUp.call(self, e)
    };

    DOMEvent.on(document.body, 'mousemove', this._onMouseMoveProxy);
    DOMEvent.on(document.body, 'mouseup', this._onMouseUpProxy);
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      pos: nextProps.start,
      disabled: nextProps.disabled,
      style: nextProps.style,
      base: nextProps.base
    })
  },

  componentWillUnmount: function () {
    DOMEvent.off(document.body, 'mousemove', this._onMouseMoveProxy);
    DOMEvent.off(document.body, 'mouseup', this._onMouseUpProxy);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.state.pos !== nextState.pos ||
        Object.keys(nextState.style).length ||
        Object.keys(nextState.base).length
  },

  _abs: function (num) {
    return num > 0 ? num : ~num + 1
  },

  onMouseDown: function () {
    this._mouseDown = true;
  },

  /**
   * 该函数需要绑定到body上面，就算鼠标离开了icon
   * 只要没有mouseUp，也还是可以拖的
   * @param e
   */
  onMouseMove: function (e) {
    if (!this._mouseDown) {
      return;
    }

    var props = this.props;
    var state = this.state;
    var curPos = state.pos;
    var cur = now();

    // 如果时间间距不满足、超出范围
    // 直接返回
    if (cur - this._prevTime < props.timeGap
        || curPos < props.min
        || curPos > props.max) {
      return;
    }

    this._prevTime = cur;

    var pos = {x: e.pageX, y: e.pageY};

    // 当前位置与基础位置距离的百分比
    // 避免0为分母的情况
    var gap = (pos.x - state.base.x) / (state.base.w || 1);
    gap = gap * 100;
    gap = gap - gap % props.step;

    if (gap > props.max) {
      gap = props.max;
    }

    if (gap < props.min) {
      gap = props.min
    }

    if (gap === curPos) {
      return;
    }
    // console.log('base=%s, gap=%s, step=%s',
    //     JSON.stringify(state.base), gap, props.step);

    this.setState({pos: gap});
    this.props.onMove(gap)
  },

  onMouseUp: function () {
    this._mouseDown = false;
  },

  render: function () {

    const state = this.state;
    const props = this.props;

    const slider_style = {position: 'absolute'};

    // 为了避免两个滑动在中间位置重叠
    // 滑块需要转换为向对应位置的距离
    // 比如左边的滑块距离为10%,那么应该转为right:90%
    // 右边也一样
    slider_style[state.dir] = (state.dir === 'left' ?
            state.pos :
            (100 - state.pos)) + '%';

    const style = assign(slider_style, state.style);

    const e_props = {
      ref: 'icon',
      className: "icon-img icon-price-" + state.dir
    };

    if (!this.state.disabled) {
      e_props.onMouseDown = this.onMouseDown;
      e_props.onMouseMove = this.onMouseMove;
      e_props.onMouseUp = this.onMouseUp
    }

    return <NotAllowSelect ref="wrap" style={style}>
      {React.createElement('span', e_props)}
    </NotAllowSelect>
  }
});

module.exports = Slipper;