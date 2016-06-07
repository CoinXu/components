/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var noop = require('../../com/noop');
var Slipper = require('./Slipper');
var elementAbsPosition = require('../../com/absolutePosition');

var Slider = React.createClass({
    getInitialState: function () {
        return {
            disabled: false,
            step: 1,

            leftPos: 0,             // left position
            rightPos: 100,          // right position

            leftStart: 0,           // left range
            leftEnd: 50,
            rightStart: 0,          // right range
            rightEnd: 100,

            base: {x: 0, y: 0, w: 0},
            rightStyle: {}
        }
    },

    getDefaultProps: function () {
        return {
            min: 0,
            max: 100,
            step: 1,

            disabled: false,

            leftValue: 0,           // left value
            rightValue: 100,        // right value

            leftStart: 0,           // left range
            leftEnd: 50,
            rightStart: 50,          // right range
            rightEnd: 100,

            precision: 2,           // float number precision
            onChange: noop
        }
    },

    copyProps: function (props) {
        var nextState = {};
        var hasOwn = nextState.hasOwnProperty;
        var s = this.state;

        Object.keys(props).forEach(function (name) {
            if (hasOwn.call(s, name))
                nextState[name] = props[name]
        });
        return nextState;
    },

    transPropsToState: function (props) {
        var p = this.parseFloat;
        var r = function (s) {
            return s - props.min;
        };
        var state = this.copyProps(props);
        // 将最大值和最小值的区间数均分为100份
        var step = this._step = p(r(props.max) / 100);
        // 计算props.step约为多少份
        // 将真实step转为滑动器step
        // 滑动器一直取两位有效小数
        state.step = p(props.step / step, 2) || 1;
        // 将初始数据转换为滑块的位置
        state.leftPos = p(r(props.leftValue) / step);
        state.rightPos = p(r(props.rightValue) / step);

        // 将左右滑块的取值范围转为位置
        state.leftStart = p(r(props.leftStart) / step);
        state.leftEnd = p(r(props.leftEnd) / step);
        state.rightStart = p(r(props.rightStart) / step);
        state.rightEnd = p(r(props.rightEnd) / step);

        return state;
    },

    componentWillMount: function () {
        this.setState(this.transPropsToState(this.props));
    },

    parseFloat: function (num, f) {
        return parseFloat(num.toFixed(f !== undefined ? f : this.props.precision))
    },

    componentDidMount: function () {
        var base = this.refs.wrap;
        var pos = elementAbsPosition(base);
        pos.w = base.offsetWidth;

        // 将值转换为0~100区间
        var right = ReactDOM.findDOMNode(this.refs.right);

        this.setState({
            base: pos,
            // 右边的元素不能超出窗口范围
            rightStyle: {marginLeft: -right.clientWidth}
        });
    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state;
        var props = this.props;
        var p = this.parseFloat;

        // 边界的值可能会损失精度
        var left = state.leftPos === state.leftStart ?
            props.leftStart :
            state.leftPos === state.leftEnd ?
                props.leftEnd :
                p(state.leftPos * this._step + props.min);

        var right = state.rightPos === state.rightStart ?
            props.rightStart :
            state.rightPos === state.rightEnd ?
                props.rightEnd :
                p(state.rightPos * this._step + props.min);

        if (prevState.leftPos !== state.leftPos ||
            prevState.rightPos !== state.rightPos) {
            props.onChange(
                state.leftPos,
                state.rightPos,
                left,
                right
            );
        }
    },

    componentWillReceiveProps: function (props) {
        this.setState(this.transPropsToState(props))
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return Object.keys(this.state).some(function (name) {
            return nextState[name] !== this.state[name];
        }, this);
    },

    onLeftMove: function (pos) {
        this.setState({leftPos: pos})
    },

    onRightMove: function (pos) {
        this.setState({rightPos: pos})
    },

    render: function () {
        var state = this.state;
        var rangeStyle = {
            width: (state.rightPos - state.leftPos) + '%',
            left: state.leftPos + '%'
        };

        return <div className="li">
            <div className="price-move" ref="wrap">
                <div className="move-bg" style={rangeStyle}></div>
                <Slipper
                    base={state.base}
                    type="left"
                    min={state.leftStart}
                    max={state.leftEnd}
                    start={state.leftPos}
                    step={state.step}
                    onMove={this.onLeftMove}/>
                <Slipper
                    style={state.rightStyle}
                    base={state.base}
                    ref="right"
                    type="right"
                    min={state.rightStart}
                    max={state.rightEnd}
                    start={state.rightPos}
                    step={state.step}
                    onMove={this.onRightMove}/>
            </div>
        </div>
    }
});

module.exports = Slider;