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

ReactDOM.render(
    <Selector.Importable onSelect={log}/>,
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

ReactDOM.render(
    <Checkbox
        itemList={checkboxItemList}
        onchange={log}
        checkedList={[checkboxItemList[0], checkboxItemList[1]]}/>,
    document.getElementById('checkbox-box')
);

// 单选
ReactDOM.render(
    <Checkbox
        allowMulti={false}
        itemList={checkboxItemList}
        onchange={log}
        checkedList={[checkboxItemList[0]]}/>,
    document.getElementById('checkbox-box-single')
);

