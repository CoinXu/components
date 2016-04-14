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
        return {show: false, unmounted: false}
    },
    renderDialog: function () {
        this.setState({show: true})
    },
    dialogOnMount: function (inst, wrapNode) {
        wrapNode.innerHTML = '<h2>Dialog Content</h2>';
    },
    onHidden: function () {
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
        </div>
    }
});
ReactDOM.render(<MountDialog/>, mountNode);
```
