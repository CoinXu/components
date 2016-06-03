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
            left: 0,
            right: 100,
            median: 50,
            min: 0,
            max: 100,
            base: {x: 0, y: 0, w: 0},
            rightStyle: {}
        }
    },

    getDefaultProps: function () {
        return {
            min: 0,
            max: 100,
            step: 2,
            left: 0,
            right: 100,
            disabled: false,
            onChange: noop
        }
    },

    componentWillMount: function () {
        var props = this.props;
        // 将最大值和最小值的区间数均分为100份
        this._step = (props.max - props.min) / 100;
        // 计算props.step约为多少份
        var _step = parseInt(props.step / this._step) || 1;
        this.setState({
            disabled: props.disabled,
            step: _step,
            left: props.left,
            right: props.right
        });
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
            rightStyle: {marginLeft: -parseInt(right.clientWidth / 2)}
        });

    },

    componentDidUpdate: function (prevProps, prevState) {
        var state = this.state;
        if (prevState.left !== this.state.left
            || prevState.right !== this.state.right) {
            this.props.onChange(
                state.left,
                state.right,
                (state.left || 1) * this._step,
                (state.right || 1) * this._step
            );
        }
    },

    leftMove: function (pos) {
        this.setState({left: pos})
    },

    rightMove: function (pos) {
        this.setState({right: pos})
    },

    render: function () {
        var state = this.state;
        var rangeStyle = {
            width: (state.right - state.left) + '%',
            left: state.left + '%'
        };

        return <div className="li">
            <div className="price-move" ref="wrap">
                <div className="move-bg" style={rangeStyle}></div>
                <Slipper
                    base={state.base}
                    type="left"
                    min={state.min}
                    max={state.median}
                    start={state.left}
                    step={state.step}
                    onMove={this.leftMove}/>
                <Slipper
                    style={state.rightStyle}
                    base={state.base}
                    ref="right"
                    type="right"
                    min={state.median}
                    max={state.max}
                    start={state.right}
                    step={state.step}
                    onMove={this.rightMove}/>
            </div>
        </div>
    }
});

module.exports = Slider;