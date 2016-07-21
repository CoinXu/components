/**
 * Created by xcp on 2016/5/5.
 * 折叠面板，提供展开和折叠功能
 * <Collapse>
 *   <Panel title={content} key="1">
 *     <h2>1</h2>
 *   </Panel>
 *   <Panel title={content} key="2">
 *     <h2>1</h2>
 *   </Panel>
 * </Collapse>
 *
 * var right = <span class="icon-img icon-tran-black-t"/>;
 * var left = <span class="icon-img icon-tran-black-d"/>;
 */

var React = require('react');
var Animate = require('../Animate');
var Panel = require('./Panel');
var noop = require('../../com/noop');
var util = require('../../com/util/array');

var Collapse = React.createClass({

  getInitialState: function () {
    return {
      expandKeys: []
    }
  },

  getDefaultProps: function () {
    return {
      expandKeys: [],
      className: '',
      accordion: false
    }
  },

  componentWillMount: function () {
    this._childrenMap = {};
    this.setExpandKeys(this.props.expandKeys);
    this._allKeys = React.Children.map(this.props.children, function (child) {
      return child.key
    });
  },

  setExpandKeys: function (keys) {
    this.setState({expandKeys: this.props.accordion ? keys.slice(0, 1) : keys});
  },

  _findParent: function (key) {
    for (let k in this._childrenMap) {
      if (!this._childrenMap.hasOwnProperty(k)) continue;
      let key_arr = this._childrenMap[k];
      if (key_arr && util.contains(key_arr, key)) {
        return k;
      }
    }
    return null;
  },

  _findAllParent: function (key) {
    const parents = [];
    let parent_key = null;
    while (parent_key = this._findParent(key)) {
      key = parent_key;
      parents.push(parent_key);
    }
    return parents;
  },

  addOne: function (key) {
    // 如果key被展开,那么key的所有父元素需要被展开
    const parents = this._findAllParent(key);
    const next = [key].concat(this.state.expandKeys);
    parents.forEach(function (k) {
      util.add(next, k)
    }, this);

    this.setExpandKeys(next);
  },

  removeOne: function (key) {
    // TODO 如果子元素全都折叠了
    // 父元素也应该被折叠
    this.setExpandKeys(util.remove(this.state.expandKeys, key));
  },

  expand: function () {
    this.setState({expandKeys: this._allKeys})
  },

  collapse: function () {
    this.setState({expandKeys: []})
  },

  onChange: function (key, collapse) {
    if (this.props.accordion) {
      this.setState({
            expandKeys: collapse ?
                [] :
                [key].concat(this._findAllParent(key))
          }
      );
    } else {
      this[(collapse ? 'remove' : 'add') + 'One'](key)
    }
  },

  _ergodic: function (children, cb) {
    const S = this;

    if (util.isArray(children)) {
      return children.map(function (child) {
        return S._ergodic(child, cb)
      })
    }

    // 如果子元素还有子元素
    // 并且是一个合法的 React.Element 或者 Array
    // 就遍历子元素

    let Children = children.props.children;

    if (util.isArray(Children)) {
      children = React.cloneElement(children, {
        children: S._ergodic(Children, cb)
      });
    }

    return cb(children)
  },

  _clone: function (elem) {
    if (elem.props.isNode) {
      let child_keys = [];
      let children = elem.props.children;

      // 统计所有Node子元素的key
      children = util.isArray(children) ? children : [children];
      children.forEach(function (c) {
        if (c.props && c.props.isNode)
          child_keys.push(c.key)
      });

      this._childrenMap[elem.key] = child_keys;
      return React.cloneElement(elem, {
        mark: elem.key,
        onChange: this.onChange,
        collapse: this.state.expandKeys.indexOf(elem.key) === -1
      })
    }
    return elem;
  },

  render: function () {
    const props = this.props;
    const trans = this._ergodic(props.children, this._clone);
    return <div className={props.className}>
      {trans}
    </div>
  }
});

const getTitle = function (props, state, inst) {
  var dir = state.collapse ? 't' : 'd';
  return <span>{props.title}
            <em style={{marginLeft:10,cursor:'pointer'}}
                onClick={inst.toggle}
                className={"inline-block icon-img icon-tran-black-" + dir}/>
        </span>;
};

Collapse.Node = React.createClass({

  getInitialState: function () {
    return {collapse: true}
  },

  getDefaultProps: function () {
    return {
      isNode: true,
      mark: null,
      title: null,
      collapse: true,
      component: 'div',
      onChange: noop,
      getTitle: getTitle
    }
  },

  componentWillMount: function () {
    this.setState({collapse: this.props.collapse})
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.collapse !== this.state.collapse) {
      this.setState({collapse: nextProps.collapse})
    }
  },

  toggle: function () {
    this.props.onChange(this.props.mark, !this.state.collapse);
  },

  onChange: function () {

  },

  render: function () {
    var Component = this.props.component;
    return <Component>
      <Panel
          collapse={this.state.collapse}
          title={this.props.getTitle(this.props, this.state, this)}
          onChange={this.onChange}>
        {this.props.children}
      </Panel>
    </Component>
  }
});

module.exports = Collapse;
