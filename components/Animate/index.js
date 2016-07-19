"use strict";

const React = require('react');
const assert = require('../../com/assert');
const TweenEvents = ['Start', 'Update', 'Complete', 'Stop'];
const noop = require('../../com/noop');
const TWEEN = require('../../com/tween');
const Tween = TWEEN.Tween;
const requestAnimation = require('../../com/requestAnimationFrame');
const requestAnimationFrame = requestAnimation.requestAnimationFrame;
const cancelAnimationFrame = requestAnimation.cancelAnimationFrame;
const assign = require('object-assign');

const Animate = React.createClass({

  propTypes: {
    entrance: React.PropTypes.bool,
    component: React.PropTypes.string,
    style: React.PropTypes.object,
    from: React.PropTypes.object,
    to: React.PropTypes.object,
    during: React.PropTypes.number,
    delay: React.PropTypes.number,
    repeat: React.PropTypes.number,
    easing: React.PropTypes.func,
    className: React.PropTypes.string
  },

  getInitialState: function () {
    return {to: {}}
  },

  getDefaultProps: function () {
    let props = {};

    TweenEvents.forEach(function (name) {
      props['on' + name] = noop;
    });

    return assign(props, {
      // 是否是入场状态
      //
      entrance: true,
      className: '',
      component: 'span',
      styleProps: {position: 'absolute'},
      from: {},
      to: {},
      during: 1000,
      delay: 0,
      repeat: 0,
      onComplete: noop,
      onMount: noop,
      getContent: noop,
      easing: TWEEN.Easing.Linear.None
    });
  },

  _currentProps: function () {
    return assign({}, this.state.to, this.props.style);
  },

  _onUpdate: function (result) {
    this.setState({to: result})
  },

  _onComplete: function () {
    this._tween = null;
    this._running = false;
  },

  _onStart: function (tween) {
    this._tween = tween;
    this._running = true;
  },

  _onStop: function () {
    this._onComplete()
  },

  _leave: function (callback) {
    this._animate(this.props.to, this.props.from, callback);
  },

  _entrance: function (callback) {
    this._animate(this.props.from, this.props.to, callback);
  },

  _animate: function (from, to, callback) {
    var self = this;
    var id = null;
    var props = this.props;
    var animate = null;
    var cancelAnimate = null;

    from = assign({}, from);
    to = assign({}, to);

    var tween = new Tween(from)
        .to(to, props.during)
        .delay(props.delay)
        .repeat(props.repeat)
        .easing(props.easing);

    tween.onStart(function () {
      self._onStart(tween);
      props.onStart.call(self);
    });

    tween.onUpdate(function () {
      // this 为 tween 中的 props 对象
      // 所以可以直接传递给函数
      self._onUpdate.call(self, this);
      props.onUpdate.call(self, this);
    });

    tween.onComplete(function () {
      typeof callback === 'function' && callback(props.entrance);
      cancelAnimate();
      self._onComplete();
    });

    tween.onStop(function () {
      cancelAnimate();
      self._onStop();
      props.onStop.call(this);
    });

    tween.start();

    cancelAnimate = function () {
      if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
      }
    };

    animate = function (time) {
      id = requestAnimationFrame(animate);
      TWEEN.update(time);
    };

    animate();

    return tween;
  },

  _begin: function (props) {

    // TODO 此处是等待完成,还是直接stop?
    // stop 是比较简单的,如果等待完成的话,就需要追加回调
    // 追加回调有点麻烦
    if (this._running) this.stop();

    this[`_${props.entrance ? 'entrance' : 'leave'}`](props.onComplete)
  },

  stop: function () {
    this._tween.stop();
  },

  componentWillMount: function () {
    this._tween = null;
    this._running = false;
  },

  componentDidMount: function () {
    this._begin(this.props);
    this.props.onMount(this);
  },

  componentDidUpdate: function (prevProps, prevState) {
    let props = this.props;

    if (prevProps.entrance !== props.entrance) {
      this._begin(props)
    }
  },

  // 遭遇外部暴力卸载时,停止动画
  componentWillUnmount: function () {
    if (this._running) this.stop()
  },

  render: function () {
    const self = this;
    const props = self.props;
    const Components = props.component;
    let children = props.children;
    let ret = props.getContent(props, this.state, self);

    if (ret === undefined) {
      ret = <Components
          className={props.className}
          style={this._currentProps()}>
        {children}
      </Components>
    }

    return ret
  }

});

module.exports = Animate;