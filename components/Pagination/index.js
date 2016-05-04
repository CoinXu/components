/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var noop = require('../../com/noop');
var NotAllowSelect = require('./NotAllowSelect');
var PageInput = require('./PageInput');
var Selectable = require('../Selectable');

var getContent = function (current) {
    return <div className="comp-area-item util-font-12 color-white-bg util-line-14">
        {current}
        <span className="icon-img icon-tran-black-d"/>
    </div>
};

var getItemContent = function (val, props) {
    var item = <li className="comp-panel-item util-font-12"><strong>{val}</strong></li>;
    return React.cloneElement(item, props);
};

var Pagination = React.createClass({

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
                return <span className={'page-item' + (isCurrent ? ' focus' : '')}>{num}</span>
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

    componentWillMount: function () {
        this._computed(this.props.itemsInOnePage);
        this.setState({
            current: this.props.defaultCurrent,
            itemsInOnePage: this.props.itemsInOnePage
        });
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

    skip: function (num, silent) {
        this.props.onSelect(num, this.state.itemsInOnePage);
        if (num < 1
            || num > this.__computed.pages
            || num === this.state.current)
            return;

        var self = this;
        self.setState({current: num}, function () {
            if (!silent)
                self.props.onChange(num, self.state.itemsInOnePage)
        })
    },

    _getCurrentStart: function (page) {
        // 只需要保持 current 在一个固定位置
        // 即可保证鼠标下一次点击的时候不会点击在同一个 number 上
        // 点击固定位置的右边 -> next
        // 点击因定位置的右边 -> prev
        // 该函数需要根据 page 确认当前页码的开始位置
        var computed = this.__computed;
        var start = page - computed.currentPageOffset;

        // 衡量边界
        return start + computed.showPages >= computed.pages ?
            (computed.pages - computed.showPages + 1) :
            start > this.props.keepPages ? start : 1;
    },

    _getPage: function (num, isCurrent) {
        return React.cloneElement(this.props.getPage(num, isCurrent), {
            onClick: this.onSelect.bind(this, num),
            key: num
        })
    },

    onItemsInOnePageChange: function (num) {
        // 每页显示条数改变后，直接跳转到第1页
        this.setState(
            {
                itemsInOnePage: num,
                current: 1
            },
            this.onSelect.bind(this, 1)
        );

    },

    componentDidMount: function () {
        this.props.onSelect(this.state.current, this.state.itemsInOnePage)
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

    render: function () {
        var props = this.props;
        var computed = this.__computed;
        var current = this.state.current;
        var start = this._getCurrentStart(current);
        var prev, next;

        if (start > props.keepPages) {
            prev = new Array(props.keepPages)
                .fill(1)
                .map(function (v, i) {
                    return this._getPage(i + 1, i + 1 === current);
                }, this)
        }

        var pageItems = new Array(computed.showPages)
            .fill(1)
            .map(function () {
                var num = start++;
                return this._getPage(num, current === num);
            }, this);

        if (start < computed.pages) {
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