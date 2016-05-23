## 其他组件操作Popup
```JavaScript
(function () {
    var popup = null;
    var holdPopup = function (popupInstance) {
        popup = popupInstance
    };
    var unmountPopup = function () {
        if (popup) {
            popup.autoVisible && popup.autoVisible()
        }
    };
    var Confirm = <Bubble style={{width:210}} symbolStyle={{left:'50%',marginLeft:-10}}>
        <button className="btn btn-sm btn-primary" onClick={unmountPopup}>删除</button>
        <span className="bub-text-gap-lg">确定删除该贴纸吗?</span>
    </Bubble>;
    // 注意 onComponentMount 属性，该属性的值为一个函数
    // 当 Popup 组件挂载完成时调用，传将 Popup 实例传入
    // 所以可以通过一个变量持有该实例
    ReactDOM.render(
        <Popup
            onMount={holdPopup}
            placement="top"
            content={Confirm}>
            <span className="color-link">取消采购</span>
        </Popup>,
        mountNode
    );
})();
```
## 复杂一点的弹出面板内容
```JavaScript
(function () {
    var popup = null;
    var holdPopup = function (popupInstance) {
        popup = popupInstance
    };
    // 再复杂的操作，与 <Popup/> 本身无关
    // 只是弹层中的操作可能会使用到 Popup 的某个方法
    // 所以要想办法将 Popup 的实例引入到弹层的实例中
    var ComplexPanel = React.createClass({
        unmountPopup: function () {
            if (popup) {
                popup.autoVisible && popup.autoVisible()
            }
        },
        componentDidMount: function () {
            // refs.content is standardized DOM
            // content can accept children that from other for example angular
            console.log(this.refs.content)
        },
        render: function () {
            // 需要继承父级传入的 style
            // 用于指定绝对位置
            return <Bubble
                onMount={log}
                style={assign(this.props.style, {width:210})}
                symbolStyle={{left:'50%',marginLeft:-10}}>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={this.unmountPopup}>删除
                </button>
                <span className="bub-text-gap-lg" ref="content">确定删除该贴纸吗?</span>
            </Bubble>
        }
    });
    ReactDOM.render(
        <Popup
            onMount={holdPopup}
            placement="top"
            content={<ComplexPanel/>}>
            <span className="color-link">憋说话，点我！看源码！</span>
        </Popup>,
        mountNode
    );
})();
```