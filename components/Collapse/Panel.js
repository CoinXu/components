/**
 * Created by xcp on 2016/5/5.
 */

const React = require('react');
const Animate = require('../Animate');
const noop = require('../../com/noop');
const assign = require('object-assign');
const util = require('../../com/util/array');

const Panel = React.createClass({

  getInitialState: function () {
    return {
      collapse: true,
      wrapStyle: {},
      from: {height: 0},
      to: {}
    }
  },

  getDefaultProps: function () {
    return {
      isPanel: true,
      components: 'div',
      className: 'module',
      title: null,
      collapse: true,
      onMount: noop,
      onChange: noop,
      getContent: noop
    }
  },

  _setState: function (state) {
    this.setState(assign({}, state, {
      wrapStyle: {},
      // 高度在子元素变化的情况下会变化
      to: {height: this.refs.wrap.offsetHeight}
    }))
  },

  expand: function () {
    this._setState({collapse: false})
  },

  collapse: function () {
    this._setState({collapse: true})
  },

  toggle: function () {
    this._setState({collapse: !this.state.collapse})
  },

  componentWillMount: function () {
    this.setState({collapse: this.props.collapse})
  },

  componentDidMount: function () {
    this._setState({});
    this.props.onMount(this);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.collapse !== this.state.collapse) {
      this.props.onChange(this.state.collapse);
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.collapse !== this.state.collapse) {
      this._setState({collapse: nextProps.collapse})
    }
  },

  onComplete: function () {
    this.setState({
      wrapStyle: {
        height: this.state.collapse ? 0 : 'auto'
      }
    })
  },

  render: function () {
    const props = this.props;
    const state = this.state;
    const Components = props.components;

    let ret = props.getContent(props, this.state, this);
    let style = {overflow: 'hidden'};

    return <Components className={props.className} ref="wrap">
      {React.cloneElement(props.title)}
      <Animate
          style={assign(style, state.wrapStyle)}
          component="div"
          entrance={!state.collapse}
          from={state.from}
          to={state.to}
          during={200}
          onComplete={this.onComplete}>
        {ret || props.children}
      </Animate>
    </Components>;
  }
});

module.exports = Panel;