/**
 * Created by xcp on 2016/4/12.
 */

var Component = require('./Component');
var query = require('./lib/query');
var dom = require('./lib/dom');

module.exports = Component.extend({

  /**
   * @property 单元格状态
   * * 1：无状态
   * * 2：失去焦点
   * * 3：获得焦点
   * * 4：编辑状态
   * @type {Object}
   */
  STATUS: {
    NORMAL: 1,
    BLUR: 2,
    FOCUS: 3,
    EDIT: 4
  },

  /**
   * @property 单元格 model
   * > model 简单的设置为一个引用对象，
   *   单元格在修改值的时候，会直接修改引用对象上的值。
   *   这意味着当前单元格中的值是与 model 同步的。
   */
  model: {prop: 'val', name: 'prop'},

  nodeAttr: {},

  /**
   * 生成内容的勾子函数,可不传
   */
  contentHooks: null,

  doc: document,

  /**
   * @override
   * 初始化时，创建 `this.node` `this.cellNode` 等必要属性。
   * 同时设置 `this.status = this.STATUS.NORMAL`
   * @param options
   */
  initialize: function (options) {

    this.name = options.name;
    this.contentHooks = options.contentHooks;
    this.inputNode = null;
    this.textNode = null;
    this._preveText = null;

    this.cellNode = dom.DOM.div({
      className: 'cell-con'
    });
    this.node = dom.DOM.div(options.nodeAttr || this.nodeAttr);

    this.node.appendChild(this.cellNode);

    this.$node = query(this.node);
    this.$cellNode = query(this.cellNode);

    this.status = this.STATUS.NORMAL;
  },

  /**
   * @override
   * 渲染单元格
   * @returns {string}
   */
  render: function () {
    this.$cellNode.empty();
    if (!this.contentHooks) {
      var text = this._preveText = this.model[this.name];
      this.textNode = dom.DOM.text(text);
      this.cellNode.appendChild(this.textNode);
    } else {
      this.$cellNode.html(this.contentHooks.get(
          this.model,
          this.name,
          this.x,
          this.y
      ));
    }

    this.emit('cellRender', this);
    return this;
  },

  /**
   * 更新单元格的值
   * @param val
   * @returns {*}
   */
  replaceToValue: function (val) {

    this.setModelValue(val);

    if (this.contentHooks) {
      this.$cellNode.html(this.contentHooks.set(
          this.model,
          this.name,
          this.x,
          this.y
      ))
    } else {
      this.cellNode.removeChild(this.inputNode);
      this.cellNode.appendChild(this.textNode);
    }

    return val;
  },

  /**
   * 选择状态更新model
   * @param val
   * @param silent
   * @returns {string}
   */
  setModelValue: function (val, silent) {

    if (val !== this._preveText) {
      this.textNode.nodeValue = val;
      if (!silent) {
        this.emit('change', this._preveText, val, this);
      }

      this._preveText = val;
      this.model[this.name] = val;
    }

    return this;
  },

  /**
   * 单元格处于编辑状态时
   * @returns {string}
   */
  onEdit: function () {
    if (!this.inputNode) {
      this.inputNode = dom.DOM.input({className: 'cell-input'});
    }
    this.inputNode.setAttribute('value', this.model[this.name]);
    // 如果没有处于焦点状态
    // 不可直接编辑
    if (this.status < this.STATUS.BLUR) {
      return this;
    }
    // 获得焦点
    this.onFocus();
    // 操作DOM
    this.cellNode.removeChild(this.textNode);
    this.cellNode.appendChild(this.inputNode);
    this.inputNode.focus();
    this.status = this.STATUS.EDIT;
  },

  /**
   * 单元格获得焦点时:
   * 1. 变为可编辑模式
   * 2. 样式变化
   */
  onFocus: function () {
    this.status = this.STATUS.FOCUS;
    this.$node.addClass('on-focus');
  },

  /**
   * 单无格失去焦点时:
   * 1.将单元格的值保存
   * 2.变为不可输入状态
   * @param val
   * @returns {*}
   */
  onBlur: function (val) {
    val = val || (this.inputNode && this.inputNode.value);
    this.$node.removeClass('on-focus');

    if (this.status < this.STATUS.EDIT) {
      return this;
    }

    var prev = '' + this.model[this.name];
    this.model[this.name] = val;
    this.replaceToValue(val);
    this.status = this.STATUS.BLUR;

    if (prev !== val) {
      this.emit('onCellChange', val, this)
    }

    return val;
  },

  /**
   * @override
   * @returns {number|string|*}
   */
  renderToString: function () {
    return this.content = this.node.outerHTML;
  }
});
