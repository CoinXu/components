/**
 * Created by xcp on 2016/3/22.
 */

var Selector = require('../index');
var DropDown = require('../DropDown');
var Checkbox = require('../Checkbox');

var React = require('react');
var ReactDOM = require('react-dom');

var log = function () {
    console.info(arguments)
};

// 自定义属性值
// 自定义selector
var getSelector = function (currentSelectedValue) {
    return <div className="comp-select-selector">
        <span className="util-font-12">{currentSelectedValue.text}</span>
        <span className="icon-img icon-tran-black-d"/>
    </div>
};

var getItem = function (value, props) {
    var item = <li className="comp-panel-item" key={value.code}>
        <strong>{value.text}</strong>
    </li>;
    return React.cloneElement(item, props);
};

ReactDOM.render(
    <Selector.Custom
        itemList={[{text:1, code:1},{text:2, code:2},{text:3, code:3}]}
        getItemContent={getItem}
        getSelectorContent={getSelector}
        onSelect={log}/>,
    document.getElementById('custom-dropdown')
);

// 输入内容验证
var validation = function (val, input) {
    if (!/^[0-9]+$/.test(val)) {
        alert('请输入数字');
        return false;
    }
    return true;
};

ReactDOM.render(
    <Selector.Importable
        validate={validation}
        onSelect={log}/>,
    document.getElementById('demo')
);


// 自定义内容
var itemList = ['全部时间', '3天内', '7天内', '30天内', '其他'];
ReactDOM.render(
    <Selector.Importable
        onSelect={log}
        itemList={itemList}
        defaultSelectedValue={itemList[0]}
        rejectValue={itemList[itemList.length - 1]}/>,
    document.getElementById('time')
);

// itemList:
// [{value:0, text: '筛选异常原因'}]
// 凡value不为真的item，全部会设置为不可选择项
ReactDOM.render(
    <Selector.Diff onSelect={log}/>,
    document.getElementById('diff')
);

// 自定义下拉菜单-货柜详情列表
ReactDOM.render(
    <Selector.Container
        itemList={[{index:0, percent:0.8},{index:1, percent:0.23}]}
        onSelect={log}/>,
    document.getElementById('wrap-container')
);

// 自定义下拉菜单-先出货柜
var containers = [
    {index: 0, percent: 0.8},
    {index: 1, percent: 0.23},
    {index: 2, percent: 0.23},
    {index: 12, percent: 0.83}
];

ReactDOM.render(
    <Selector.FOContainer
        firstOut={[containers[2]]}
        itemList={containers}
        onSelect={log}/>,
    document.getElementById('fo-container')
);

ReactDOM.render(
    <Selector.MiniContainer
        selectorStyle={{padding:0}}
        itemList={containers}
        onSelect={log}/>,
    document.getElementById('mini-container')
);

// Checkbox
// 模拟搜索列表中的选项

var checkboxItemList = function () {
    return new Array(10).fill(1).map(function (v, i) {
        return {value: i, content: {name: 'name-' + i, widget: '(123' + i + ')'}}
    })
}();


// 多选
var CheckWrap = React.createClass({

    getDefaultProps: function () {
        return {
            maxChecked: 1
        }
    },

    holdCheckbox: function (checkbox) {
        this._checkbox = checkbox;
    },

    cleanup: function () {
        this._checkbox.cleanup()
    },

    checkAll: function () {
        this._checkbox.checkAll()
    },

    getCheckedValue: function () {
        console.log(this._checkbox.getCheckedValue())
    },

    render: function () {
        return <div className="msg-condition">
            <div className="condition-title">
                <a className="color-green" onClick={this.checkAll}>All</a>
                <a className="a-link" onClick={this.cleanup}>Clear</a>
            </div>
            <div className="condition-padding msg-common-checkbox">
                <Checkbox
                    maxChecked={this.props.maxChecked}
                    itemList={checkboxItemList}
                    onComponentMount={this.holdCheckbox}
                    onOutOfBounds={log}
                    onChange={log}
                    checkedList={[checkboxItemList[0], checkboxItemList[1]]}/>
            </div>
            <button className="btn btn-default btn-xs" onClick={this.getCheckedValue}>
                点击log当前选中的值
            </button>
        </div>
    }
});

// 可全选
ReactDOM.render(
    <CheckWrap maxChecked={checkboxItemList.length}/>,
    document.getElementById('multi-checkbox')
);
// 单选
ReactDOM.render(
    <CheckWrap maxChecked={1}/>,
    document.getElementById('single-checkbox')
);

// 最多选3个
ReactDOM.render(
    <CheckWrap maxChecked={3}/>,
    document.getElementById('extra-checkbox')
);

