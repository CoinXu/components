/**
 * Created by xcp on 2016/3/24.
 */
var classNames = require('classnames');
var noop = require('../../com/noop');

module.exports = {

  getDefaultProps: function () {
    return {
      itemList: [],
      add: noop,
      remove: noop,
      onSelect: noop
    }
  },

  getInitialState: function () {
    return {
      itemList: []
    }
  },

  componentWillMount: function () {
    this.setState({itemList: this.props.itemList})
  },

  update: function (items) {
    this.setState({itemList: items});
  },

  addOne: function (percent) {
    var index = 0;
    var clone = this.state.itemList.slice();

    clone.forEach(function (item) {
      if (item.index > index)
        index = item.index
    });

    // NaN
    percent = parseInt(percent) || 0;
    percent = percent < 0 ? 0 : percent;

    clone.push({percent: percent, index: index + 1});

    this.update(clone)
  },

  removeOne: function (item) {
    // 删除一条后,要更新其他的item.
    var clone = this.state.itemList.slice();
    var index = clone.indexOf(item);

    if (index !== -1) {
      clone.splice(index, 1);
      clone = clone.map(function (item, i) {
        item.index = i;
        return item;
      });
      this.update(clone)
    }
  },

  getProgressClassName: function () {
    var args = Array.prototype.slice.call(arguments, 1);
    var percent = arguments[0];
    var className = {};

    args.forEach(function (name) {
      className[name] = true
    });

    className['progress-' + parseInt(percent * 100) || 0] = true;
    return classNames(className);
  }
};