/**
 * Created by xcp on 2016/3/12.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Condition = require('../index');

var conditionDemoData = [
    {value: 0, children: 'a'},
    {value: 1, children: 'b'},
    {value: 2, children: 'c'},
    {value: 3, children: 'd'}
];

var log = function () {
    console.info(arguments)
};

ReactDOM.render(
    <Condition
        itemList={conditionDemoData}
        onChecked={function(isChecked, value) {
          log('onChecked');
          log(isChecked, value);
        }}
        onChange={function(prev, current) {
          log('onChange');
          log(prev, current);
        }}
    />,

    document.getElementById('demo')
);

// 某一项可以多次选择的情况
var price = {
    a: {name: 'price', value: 0},
    b: {name: 'price', value: 1}
};

var list = [
    {value: 'a', children: 'a'},
    {
        value: function (cur) {
            var is_a = cur === price.a;
            return {
                // 当前选中的值
                value: is_a ? price.a : price.b,
                // 下一个值
                next: is_a ? price.b : price.a
            };
        },
        children: function (props, state) {
            var className = state.checkedItemValue === price.a ? 'd' : 't';

            return <span>
                Price
                <i className={`icon-img icon-arrow-black-${className}`}/>
            </span>
        }
    },
    {value: 'b', children: 'b'}
];

ReactDOM.render(
    <Condition itemList={list} onChange={log} onSelect={log}/>,
    document.getElementById('demo-multiple')
);