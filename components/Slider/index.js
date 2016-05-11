/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var noop = require('../../com/noop');
var Slipper = require('./Slipper');
var elementAbsPosition = require('../../com/absolutePosition');

var Slider = React.createClass({
    getInitialState: function () {
        return {
            currentValue: 0,
            disabled: false,
            left: 0,
            right: 100,
            median: 50,
            min: 0,
            max: 100,
            base: {x: 0, y: 0, w: 0}
        }
    },

    getDefaultProps: function () {
        return {
            range: true,
            min: 0,
            max: 200,
            step: 2,
            defaultValue: 0,
            disabled: false,
            onChange: noop
        }
    },

    componentWillMount: function () {
        var props = this.props;
        this.setState({
            disabled: props.disabled,
            currentValue: props.defaultValue
        });
    },

    componentDidMount: function () {
        var base = this.refs.wrap;
        var pos = elementAbsPosition(base);
        pos.w = base.offsetWidth;

        // 将值转换为0~100区间
        var props = this.props;
        var step = (props.max - props.min) / 100;

        this.setState({
            base: pos,
            min: props.min / step,
            max: props.max / step,
            median: 50
        });
    },

    componentDidUpdate: function () {
        this.props.onChange(this.state.left, this.state.right)
    },

    leftMove: function (pos) {
        this.setState({left: pos})
    },

    rightMove: function (pos) {
        this.setState({right: pos})
    },

    render: function () {
        var state = this.state;
        var props = this.props;
        var rangeStyle = {width: (state.right - state.left) + '%', left: state.left + '%'};

        return <div className="li">
            <div className="price-move" ref="wrap">
                <div className="move-bg" style={rangeStyle}></div>
                <Slipper
                    base={state.base}
                    type="left"
                    min={state.min}
                    max={state.median}
                    start={state.left}
                    step={props.step}
                    onMove={this.leftMove}/>
                <Slipper
                    base={state.base}
                    type="right"
                    min={state.median}
                    max={state.max}
                    start={state.right}
                    step={props.step}
                    onMove={this.rightMove}/>
            </div>
        </div>
    }
});

module.exports = Slider;