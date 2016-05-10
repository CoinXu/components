## Collapse 可折叠面板
下属两个子组件：
+ [Panel](./Panel.html)
+ [Collapse.Node](./Node.html)

### Collapse 不能与 Collapse 嵌套使用！！至少在目前还不能！！

## Props
+ expandKeys - 需要展开的元素的key - `[]`
+ className - 包装容器的className - ''
+ accordion - 是否是手风琴形式[该形式同时只会有一个节点展开] - `false`

## 调用
### Collapse 同时可以展开多个
```JavaScript
var Collapse = require('../index');
var Node = Collapse.Node;
var content = <div>
    <p>Panel content</p>
    <p>Panel content</p>
    <p>Panel content</p>
    <p>Panel content</p>
</div>;
ReactDOM.render(
    <Collapse expandKeys={["2"]}>
        <Node title={<span>panel title 1</span>} key="1">
            {content}
        </Node>
        <Node title={<span>panel title 2</span>} key="2">
            {content}
        </Node>
        <Node title={<span>panel title 3</span>} key="3">
            {content}
        </Node>
    </Collapse>,
    document.getElementById('demo-collapse')
);
```

### Accordion 同时只能展开一个
```JavaScript
ReactDOM.render(
    <Collapse expandKeys={["2"]} accordion={true}>
        <Node title={<span>panel title 1</span>} key="1">
            {content}
        </Node>
        <Node title={<span>panel title 2</span>} key="2">
            {content}
        </Node>
        <Node title={<span>panel title 3</span>} key="3">
            {content}
        </Node>
    </Collapse>,
    document.getElementById('demo-collapse-accordion')
);
```
