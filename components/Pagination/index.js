/**
 * Created by xcp on 2016/3/23.
 */

const React = require('react');
const noop = require('../../com/noop');
const NotAllowSelect = require('./NotAllowSelect');
const PageInput = require('./PageInput');
const Selectable = require('../Selectable');
const assert = require('../../com/assert');

const getContent = function (current) {
  return <div
      className="comp-area-item util-font-12 color-white-bg util-line-14">
    {current}
    <span className="icon-img icon-tran-black-d"/>
  </div>
};

const getItemContent = function (val, props) {
  var item = <li className="comp-panel-item util-font-12">
    <strong>{val}</strong></li>;
  return React.cloneElement(item, props);
};

const Pagination = React.createClass({

  propTypes: {
    defaultCurrent: React.PropTypes.number,
    total: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    itemsInOnePage: React.PropTypes.number,
    keepPages: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    getPage: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      // current page
      current: 1,
      itemsInOnePage: 60
    }
  },

  getDefaultProps: function () {
    return {
      // default page
      defaultCurrent: 1,
      // item total
      total: 0,
      itemsInOnePage: 60,
      // pages in one item
      pageSize: 5,
      keepPages: 2,
      // 可输入页码
      importable: true,
      // 可配置 itemsInOnePage
      itemsConfigurable: true,
      configurableList: [200, 100, 60],
      // invoke when page number changed
      onChange: noop,
      onSelect: noop,
      getPage: function (num, isCurrent) {
        return <span
            className={'page-item' + (isCurrent ? ' focus' : '')}>{num}</span>
      }
    }
  },

  _computed: function (itemsInOnePage) {
    var props = this.props;
    var pages = Math.ceil(props.total / itemsInOnePage);
    var showPages = pages > props.pageSize ? props.pageSize : pages;

    this.__computed = {
      pages: pages,
      showPages: showPages,
      currentPageOffset: Math.ceil(showPages / 2) - 1
    };
  },

  onSelect: function (num) {
    this.skip(num);
  },

  prev: function () {
    this.skip(this.state.current - 1)
  },

  next: function () {
    this.skip(this.state.current + 1)
  },

  skip: function (num) {
    this.props.onSelect(num, this.state.itemsInOnePage);

    if (num < 1
        || num > this.__computed.pages
        || num === this.state.current)
      return;

    this.setState({current: num})
  },

  _getCurrentStart: function (page) {
    // 只需要保持 current 在一个固定位置
    // 即可保证鼠标下一次点击的时候不会点击在同一个 number 上
    // 点击固定位置的右边 -> next
    // 点击因定位置的右边 -> prev
    // 该函数需要根据 page 确认当前页码的开始位置
    const computed = this.__computed;
    const props = this.props;
    const start = page - computed.currentPageOffset;

    const pages = computed.pages;
    const showPages = computed.showPages;
    const keepPages = props.keepPages;

    // 衡量边界
    const re_compute = start + showPages >= pages ?
        (pages - showPages + 1) :
        start > keepPages ? start : 1;

    const prev = re_compute > keepPages + 1;
    const next = re_compute + showPages + keepPages < pages;
    const end = next ? re_compute + showPages : pages;

    return {
      prev: prev,
      next: next,
      start: prev ? re_compute : 1,
      end: end
    }
  },

  _getPage: function (num, isCurrent) {
    return React.cloneElement(this.props.getPage(num, isCurrent), {
      onClick: this.onSelect.bind(this, num),
      key: num
    })
  },

  onItemsInOnePageChange: function (num) {
    // 每页显示条数改变后，直接跳转到第1页
    this.setState({itemsInOnePage: num, current: 1});
  },

  componentWillMount: function () {
    const props = this.props;
    this._computed(props.itemsInOnePage);
    const computed = this.__computed;
    assert(
        computed.showPages - computed.currentPageOffset > props.keepPages,
        'props.keepPages must greater than `Math.ceil(props.showPages / 2)- 1 + props.keepPages`'
    );
    this.setState({
      current: this.props.defaultCurrent,
      itemsInOnePage: this.props.itemsInOnePage
    });
  },

  componentDidMount: function () {
    // 经讨论,初始化时不执行onSelect
    // this.props.onSelect(this.state.current, this.state.itemsInOnePage)
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.itemsInOnePage !== this.state.itemsInOnePage) {
      this._computed(nextState.itemsInOnePage)
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var cur = this.state;
    return cur.current !== nextState.current ||
        cur.itemsInOnePage !== nextState.itemsInOnePage
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.current !== this.state.current ||
        prevState.itemsInOnePage !== this.state.itemsInOnePage) {
      this.props.onChange(this.state.current, this.state.itemsInOnePage)
    }
  },

  render: function () {
    var props = this.props;
    var computed = this.__computed;
    var current = this.state.current;
    var command = this._getCurrentStart(current);
    var start = command.start;
    var prev, next;

    if (command.prev) {
      prev = new Array(props.keepPages)
          .fill(1)
          .map(function (v, i) {
            return this._getPage(i + 1, i + 1 === current);
          }, this)
    }

    var pageItems = new Array(command.end - start + 1)
        .fill(1)
        .map(function () {
          var num = start++;
          return this._getPage(num, current === num);
        }, this);

    if (command.next) {
      next = new Array(props.keepPages)
          .fill(1)
          .map(function (v, i) {
            var num = computed.pages - props.keepPages + i + 1;
            return this._getPage(num, current === num)
          }, this)
    }

    var configurable = null;
    if (props.itemsConfigurable)
      configurable = <Selectable.Custom
          getSelectorContent={getContent}
          getItemContent={getItemContent}
          onSelect={this.onItemsInOnePageChange}
          itemList={props.configurableList}
          defaultSelectedValue={this.state.itemsInOnePage}/>;

    var importable = null;
    var nextPage = null;
    if (props.importable) {
      nextPage = current + 1;
      nextPage = nextPage > computed.pages ? computed.pages : nextPage;
      importable = <PageInput
          current={nextPage}
          min={1}
          max={computed.pages}
          onSearch={this.skip}/>;
    }
    return <NotAllowSelect>
      <div className="pagination">
        {configurable}
        {prev}
        {prev ? <span className="page-item default"/> : null}
        {pageItems}
        {next ? <span className="page-item default"/> : null}
        {next}
        {importable}
      </div>
    </NotAllowSelect>
  }
});

module.exports = Pagination;