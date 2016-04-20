## Dialog

## Props
+ style - 外层容器style - {backgroundColor: '#fff'}
+ className - 外层容器className - 'bub-dialog bubble-company-staff'
+ refTarget - 依赖节点，点击依赖节点时，不会触发弹层关闭行为 - null
+ isVisible - 是否显示 - true - 暂时不要改动该配置，因为该组件隐藏后会卸载，所以show也show不出来...
+ onHidden - 关闭后的回调 - noop
+ onComponentMount(inst, wrap) - 组件挂载时回调 - noop
  - `inst` 为组件实例
  - `wrap` 为包装容器， 是一个 `Node` 对象，可以往里塞内容，
     比如:`wrap.innerHTML = <h2>123</h2>`，也可以将`angular` compile 之后的内容
     添加到 `wrap` 中
     
## Methods
+ `hide` 关闭弹层，如果关闭成功，返回true，否则返回false。

```JavaScript
var Dialog = require('essa-components').Popup.Dialog;
var MountDialog = React.createClass({
    getInitialState: function () {
<<<<<<< HEAD
        return {show: false, unmounted: false}
    },
    renderDialog: function () {
        this.setState({show: true})
=======
        return {show: false}
    },
    renderDialog: function () {
        // 创建一个顶层节点
        this.__dialogNode = document.createElement('div');
        document.body.appendChild(this.__dialogNode);
        ReactDOM.render(<Dialog
                onComponentMount={this.dialogOnMount}
                onHidden={this.onHidden}/>,
            this.__dialogNode
        );
        this.setState({mounted: false})
>>>>>>> 375ea2754640bc8a3ab3489f679015be66713500
    },
    dialogOnMount: function (inst, wrapNode) {
        wrapNode.innerHTML = '<h2>Dialog Content</h2>';
    },
    onHidden: function () {
<<<<<<< HEAD
        this.setState({unmounted: true})
    },
    render: function () {
        var Component = null;
        if (this.state.show) {
            Component = <Dialog
                onComponentMount={this.dialogOnMount}
                onHidden={this.onHidden}/>
        }
        var text = this.state.show && !this.state.unmounted ?
            '再点我就关了' :
            (!this.state.show && !this.state.unmounted) ?
                '点我显示Dialog' :
                (this.state.unmounted ? '现在点我也没用了' : '');
        return <div>
            <button
                onClick={this.renderDialog}
                className="btn btn-default btn-sm">
                {text}
            </button>
            {Component}
=======
        var self = this;
        this.setState({show: false}, function () {
            // 组件卸载后，移除节点
            document.body.removeChild(self.__dialogNode);
        })
    },
    // 如果下一次的状态是显示，且不与上一次的状态相同
    // 则表明上一次的状态是未显示，也就是未渲染
    // 所以应该渲染Dialog
    componentWillUpdate: function (nextProps, nextState) {
        if (nextState.show !== this.state.show && nextState.show) {
            this.renderDialog()
        }
    },
    toggle: function () {
        this.setState({show: !this.state.show})
    },
    render: function () {
        var text = this.state.show ? '再点我就关了' : '点我显示Dialog';
        return <div>
            <button
                onClick={this.toggle}
                className="btn btn-default btn-sm">
                {text}
            </button>
>>>>>>> 375ea2754640bc8a3ab3489f679015be66713500
        </div>
    }
});
ReactDOM.render(<MountDialog/>, mountNode);
```
<<<<<<< HEAD
=======
### 注：Dialog 隐藏后会直接卸载，所以mountNode需要一个顶层的节点
>>>>>>> 375ea2754640bc8a3ab3489f679015be66713500
