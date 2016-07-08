## Pagination 分页

### Props
+ defaultCurrent - `React.PropTypes.number` - 默认选中页码 - 1
+ total - `React.PropTypes.number` - 总共多少条数据 - 0
+ pageSize - `React.PropTypes.number` - 总共显示多少个可选择按钮 - 5
+ itemsInOnePage - `React.PropTypes.number` - 每一个页码生管理多少条数据 - 10
+ keepPages - `React.PropTypes.number` - 2
  > 如果当前显示的按钮之前或者之后还有页码不能完全显示出来。
    则会显示最前面和最后面的页码，该参数设置最前和最后显示的页码数。
+ onChange(pageNo, itemsInOnePage) - `React.PropTypes.func` - 页码变化时的回调 - noop
  > 传入一个参数 `num`，为当前页码编号
+ onSelect(pageNo, itemsInOnePage) - `React.PropTypes.func` - 某一页码选中后的回调 - noop
  > 传入一个参数 `num`，为当前页码编号
+ getPage - `React.PropTypes.fun` - 自定义页码内容函数
    ```JavaScript
    // 默认值如下
    function (num, isCurrent) {
        return <span className={'page-item' + (isCurrent ? ' focus' : '')}>{num}</span>
    }
    // 生成页码时调用，传入两个参数：
    // `num` - 当前页码数
    // `isCurrent` - 当前页码是否被选中
    ```
+ importable - 是否可输入页码 - true
+ itemsConfigurable - 是否可选择每一页包含多少条数据 - true
+ configurableList - `itemsConfigurable` 可选择的值 - [200, 100, 60]

## 最简单的调用

1. 引入
```Javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Pagination = require('react-components-s').Pagination;
```

2. 调用
```JavaScript
ReactDOM.render(<Pagination defaultCurrent={10} total={1000} />, mountNode);
```

## 传入参数，改变 keepPages 的值
```JavaScript
ReactDOM.render(
    <Pagination
        defaultCurrent={3}
        total={1000}
        keepPages={1}
        pageSize={6}
        onChange={onChange}/>,
    mountNode
);
```

## 传入参数，改变 itemsInOnePage 的值
```JavaScript
ReactDOM.render(
    <Pagination
        total={20}
        pageSize={9}
        itemsInOnePage={5}
        onChange={onChange}/>,
    mountNode
);
```
