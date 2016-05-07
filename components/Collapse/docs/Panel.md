## Panel 可折叠面板

## Props
+ `isPanel` - 是否是panel，用于扩展，调用者不用传参数 - true
+ `components` - 容器类型 - 'div'
+ `className` - 容器class - 'module'
+ `title` - 标题 - null
+ `collapse` - 是否折叠 - true
+ `onMount(inst)` - 挂载后回调 - noop
+ `onChange(collapse)` - 组件状态改变时回调，传入参数为当前的状态是否是折叠状态 - noop
+ `getContent(props, state, inst)` - 获取组件内容，如果返回值为假，则取 `props.children` - noop

## Methods
+ toggle - 切换UI状态
+ expand - 展开
+ collapse - 折叠

## 使用
```JavaScript
var content = <div>
    <p>Panel content</p>
    <p>Panel content</p>
    <p>Panel content</p>
    <p>Panel content</p>
</div>;
```
### 折叠
```JavaScript
var inst1 = ReactDOM.render(<Panel
        collapse={true}
        title={<h3 onClick={function(){inst1.toggle()}}>Panel title</h3>}>
        {content}
    </Panel>,
    document.getElementById('demo')
);
```
### 展开
```JavaScript
var inst2 = ReactDOM.render(<Panel
        collapse={false}
        title={<h3 onClick={function(){inst2.toggle()}}>Panel title</h3>}>
        {content}
    </Panel>,
    document.getElementById('demo-expand')
);
```
