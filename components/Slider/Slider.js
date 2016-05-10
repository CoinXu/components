/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var noop = require('../../com/noop');
var now = function () {
    return new Date() * 1
};

var Slider = React.createClass({
    getInitialState: function () {
        return {
            disabled: false,
            pos: 0
        }
    },

    getDefaultProps: function () {
        return {
            dir: 'left',
            timeGap: 10,
            min: 0,
            max: 20,
            step: 1,
            onMount: noop,
            onMove: noop
        }
    },

    componentDidMount: function () {
        this._mouseDown = false;
        this._prevTime = now();
        this.props.onMount(this)
    },

    onMouseDown: function (e) {
        this._mouseDown = true;
        this._prevStart = {x: e.pageX, y: e.pageY}
    },

    /**
     * TODO 该函数需要绑定到body上面，就算鼠标离开了icon
     * TODO 只要没有mouseUp，也还是可以拖的
     * @param e
     */
    onMouseMove: function (e) {
        var cur = now();
        var pos = {x: e.pageX, y: e.pageY};
        var props = this.props;

        if (!this._mouseDown
            || cur - this._prevTime < props.timeGap) {
            return;
        }

        var gap = this.state.pos + pos.x - this._prevStart.x;

        console.log(this._prevStart.x, pos.x);
        this._prevTime = cur;
        this._prevStart = pos;
        this.setState({pos: gap});
        this.props.onMove(gap)
    },

    onMouseOut: function () {
        this._mouseDown = false;
    },

    onMouseUp: function () {
        this._mouseDown = false;
    },

    render: function () {
        var style = {position: 'absolute'};
        style[this.props.dir] = this.state.pos;
        return <div
            ref="icon"
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseOut={this.onMouseOut}
            onMouseUp={this.onMouseUp}
            className={"icon-img icon-price-" + this.props.dir}
            style={style}></div>
    }
});

module.exports = Slider;