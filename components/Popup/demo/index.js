/**
 * Created by xcp on 2016/3/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Popup = require('../Popup');
var Bubble = require('../Bubble');
var Bias = require('../Bias');
var assign = require('object-assign');
var log = function () {
    console.log(arguments)
};

var __button = function (message) {
    return <button className="btn btn-primary btn-sm">{message}</button>
};

// 根据弹层内容和触发元素位置，定义symbolStyle微调弹层位置
var horizontal = <Bubble symbolStyle={{left:'50%',marginLeft:-10}}>
    <div style={{width:270}}>Popup组件中的元素，在body被点击后，会隐藏</div>
</Bubble>;

var vertical = <Bubble symbolStyle={{top:6}}>
    <div style={{width:270}}>Popup组件中的元素，在body被点击后，会隐藏</div>
</Bubble>;

ReactDOM.render(
    <Popup placement="top" content={horizontal}>
        {__button('靠上的弹层')}
    </Popup>,
    document.getElementById('top')
);

ReactDOM.render(
    <Popup placement="right" content={vertical}>
        {__button('靠右的弹层')}
    </Popup>,
    document.getElementById('right')
);

ReactDOM.render(
    <Popup placement="bottom" content={horizontal}>
        {__button('靠下的弹层')}
    </Popup>,
    document.getElementById('bottom')
);

ReactDOM.render(
    <Popup placement="left" content={vertical}>
        {__button('靠左的弹层')}
    </Popup>,
    document.getElementById('left')
);

// Bias
var biasContent = 'some text for bias';

ReactDOM.render(
    <Popup
        placement="top"
        content={<Bias style={{width:160}}>{biasContent}</Bias>}>
        {__button('不可自关闭的弹层')}
    </Popup>,
    document.getElementById('bias-top-left')
);

ReactDOM.render(
    <Popup
        trigger="hover"
        placement="top"
        content={<Bias style={{width:160}}>{biasContent}</Bias>}>
        {__button('hover显示关闭弹层')}
    </Popup>,
    document.getElementById('bias-top-left-hover')
);


ReactDOM.render(
    <Bias onComponentMount={log} closeable placement="right">{biasContent}</Bias>,
    document.getElementById('bias-right')
);

ReactDOM.render(
    <Bias closeable placement="topRight">{biasContent}</Bias>,
    document.getElementById('bias-top-right')
);

ReactDOM.render(
    <Bias closeable placement="left">{biasContent}</Bias>,
    document.getElementById('bias-left')
);

// 操作弹出面板内容
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

    ReactDOM.render(
        <Popup
            onComponentMount={holdPopup}
            placement="top"
            content={Confirm}>
            <span className="color-link">取消采购</span>
        </Popup>,
        document.getElementById('unmount-with-other')
    );
})();

// 复杂一点的弹出面板内容
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
                onComponentMount={log}
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
            onComponentMount={holdPopup}
            placement="top"
            content={<ComplexPanel/>}>
            <span className="color-link">憋说话，点我！看源码！</span>
        </Popup>,
        document.getElementById('unmount-with-other-complex')
    );

})();


// Dialog
var Dialog = require('../Dialog');
var MountDialog = React.createClass({

    getInitialState: function () {
        return {show: false}
    },

    renderDialog: function () {
        this.__dialogNode = document.createElement('div');
        document.body.appendChild(this.__dialogNode);

        ReactDOM.render(<Dialog
                onComponentMount={this.dialogOnMount}
                onHidden={this.onHidden}/>,
            this.__dialogNode
        );
    },

    dialogOnMount: function (inst, wrapNode) {
        wrapNode.innerHTML = '<h2>Dialog Content</h2>';
    },

    onHidden: function () {
        var self = this;
        this.setState({show: false}, function () {
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
        </div>
    }
});

ReactDOM.render(
    <MountDialog/>,
    document.getElementById('dialog-mount-node')
);


// 指定一个元素，弹出Popup
var baseElement = document.querySelector('#demo-special-position');
var positionBubble = require('../PositionBubble');

baseElement.addEventListener('click', function (e) {
    var onMount = function (wrap, inst) {
        wrap.innerHTML = '<h2>BiuBiu~</h2>';
    };

    var popup = positionBubble(e.target || e.srcElement, onMount);
    popup.show();
    // popup.hide()
}, false);
