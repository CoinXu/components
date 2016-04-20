/**
 * Created by Freax on 2016/4/13.
 * @website http://www.myfreax.com
 */
const React = require('react'),
    SelectRow = require('./SelectRow'),
    animateMixin = require('./AnimateMixin');
module.exports = React.createClass({
    mixins: [animateMixin],

    /**
     * 初始化状态
     * @returns {{show: boolean}}
     */
    getInitialState: function () {
        return {show: false};
    },

    /**
     * 获取默认props属性
     * @returns {{show: boolean}}
     */
    getDefaultProps: function () {
        return {
            show: false
        }
    },

    /**
     * 组件将要挂载
     */
    componentWillMount: function () {
        this.setState({show: this.props.show});
    },

    /**
     * 组件将要接收新属性值
     * @param nextProps
     */
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.show) {
            this.show()
        } else {
            this.hide()
        }
    },

    /**
     * 展示列表组件
     */
    show: function () {
        var self = this;
        this.animation(this.refs.selectList, 0, 1, 200, function () {
            self.setState({show: true})
        });
    },

    /**
     * 隐藏组件
     */
    hide: function () {
        var self = this;
        this.animation(this.refs.selectList, 1, 0, 500, function () {
            self.setState({show: false});
        })
    },
    render: function () {
        var selectRows = [];

        for (var i = 0, length = this.props.items.length; i < length; i++) {
            selectRows.push(<SelectRow item={this.props.items[i]} key={this.props.items[i]} click={this.props.click}/>)
        }

        return (
            <div style={{display:this.state.show ? 'block' : 'none'}} className="pop-box-select" ref="selectList">
                <ul className="selectList">
                    {selectRows}
                </ul>
            </div>
        );
    }
});
