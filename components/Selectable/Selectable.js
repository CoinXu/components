/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var noop = require('../../com/noop');
var classNames = require('classnames');
var HideOnBodyClick = require('../HideOnBodyClick');
var NotAllowSelect = require('../Pagination/NotAllowSelect');

var Selectable = React.createClass({

  getDefaultProps: function () {
    return {
      wrapClassName: null,
      onSelect: noop,
      selectorBindEvent: true,
      selectorContent: null,
      disabled: false,
      panelContent: null
    }
  },

  getInitialState: function () {
    return {
      disabled: false,
      visible: false,
      current: null,
      selected: false
    }
  },

  componentWillMount: function () {
    this.setState({disabled: this.props.disabled})
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({disabled: nextProps.disabled})
  },

  show: function () {
    this.setState({visible: true, selected: false})
  },

  hide: function () {
    this.setState({visible: false, selected: false})
  },

  onSelect: function (item) {
    this.setState({visible: false, current: item, selected: true})
  },

  shouldHide: function () {
    return this.state.visible;
  },

  onStateChange: function (entrance) {
    if (!entrance) {
      // 如果由选择行为触发动画,则调用onSelect
      if (this.state.selected)
        this.props.onSelect(this.state.current);

      // 隐藏面板,以免触发选择面板的点击事件
      this.hide();
    }
  },

  render: function () {
    var props = this.props;
    var state = this.state;

    var className = {
      'comp-custom-select': true,
      'disabled': state.disabled,
      // 如果是选择事件触发的行为,则不隐藏面板
      // 待隐藏动画执行完后再隐藏
      // 其他情况看 state.visible 的状态
      'comp-show-panel': state.selected || state.visible
    };

    if (props.wrapClassName) {
      className[props.wrapClassName] = true;
    }

    className = classNames(className);

    var selector = null;
    if (props.selectorBindEvent && !state.disabled) {
      selector = <div onClick={this.show}>
        {props.selectorContent}
      </div>
    } else {
      selector = props.selectorContent;
    }

    return (<div className={className} ref="wrap">
      <div className="comp-select-selector-pd">
        <NotAllowSelect>
          {selector}
        </NotAllowSelect>
      </div>
      <HideOnBodyClick
          visible={state.visible}
          refTarget={this.refs.wrap}
          onStateChange={this.onStateChange}
          shouldHide={this.shouldHide}>
        <div className="comp-select-panel util-text-clamp">
          {props.panelContent}
        </div>
      </HideOnBodyClick>
    </div>)
  }

});

module.exports = Selectable;