/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var noop = require('../../com/noop');
var DOMEvent = require('../../com/DOM/DOMEvent');

var now = function () {
    return new Date() * 1
};

var Slipper = React.createClass({
    getInitialState: function () {
        return {
            disabled: false,
            pos: 0,
            dir: 'right',
            base: {x: 0, y: 0, w: 200}
        }
    },

    getDefaultProps: function () {
        return {
            type: 'left',
            timeGap: 50,
            min: 0,
            max: 100,
            // step 要能被 min 和 max 整除
            // 否则不能选择左右两个闭区间
            step: 10,
            start: 0,
            base: {x: 0, y: 0, w: 200},
            disabled: false,
            onMount: noop,
            onMove: noop
        }
    },

    componentWillMount: function () {
        var typeMirror = {
            left: 'right',
            right: 'left'
        };
        this.setState({
            disabled: this.props.disabled,
            pos: this.props.start,
            dir: typeMirror[this.props.type] || 'left'
        })
    },

    componentDidMount: function () {
        this._mouseDown = false;
        this._prevTime = now();
        this.props.onMount(this);
        var self = this;

        this._onMouseMoveProxy = function (e) {
            self.onMouseMove.call(self, e)
        };

        this._onMouseUpProxy = function (e) {
            self.onMouseUp.call(self, e)
        };

        DOMEvent.on(document.body, 'mousemove', this._onMouseMoveProxy);
        DOMEvent.on(document.body, 'mouseup', this._onMouseUpProxy);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({pos: nextProps.start, base: nextProps.base})
    },

    componentWillUnmount: function () {
        DOMEvent.off(document.body, 'mousemove', this._onMouseMoveProxy);
        DOMEvent.off(document.body, 'mouseup', this._onMouseUpProxy);
    },

    _abs: function (num) {
        return num > 0 ? num : ~num + 1
    },

    onMouseDown: function () {
        this._mouseDown = true;
    },

    /**
     * 该函数需要绑定到body上面，就算鼠标离开了icon
     * 只要没有mouseUp，也还是可以拖的
     * @param e
     */
    onMouseMove: function (e) {
        if (!this._mouseDown) {
            return;
        }

        var props = this.props;
        var curPos = this.state.pos;
        var cur = now();

        // 如果时间间距不满足、超出范围
        // 直接返回
        if (cur - this._prevTime < props.timeGap
            || curPos < props.min
            || curPos > props.max) {
            return;
        }

        this._prevTime = cur;

        var pos = {x: e.pageX, y: e.pageY};

        // 当前位置与基础位置距离的百分比
        var gap = (pos.x - props.base.x) / props.base.w;
        gap = gap * 100;
        gap = gap - gap % props.step;

        if (gap > props.max) {
            gap = props.max;
        }

        if (gap < props.min) {
            gap = props.min
        }

        if (gap === curPos) {
            return;
        }

        this.setState({pos: gap});
        this.props.onMove(gap)
    },

    onMouseUp: function () {
        this._mouseDown = false;
    },

    render: function () {
        var props = {
            ref: 'icon',
            style: {
                position: 'absolute',
                left: this.state.pos + '%'
            },
            className: "icon-img icon-price-" + this.state.dir
        };

        if (!this.state.disabled) {
            props.onMouseDown = this.onMouseDown;
            props.onMouseMove = this.onMouseMove;
            props.onMouseUp = this.onMouseUp
        }

        return React.createElement('span', props);
    }
});

module.exports = Slipper;