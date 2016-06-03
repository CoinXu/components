/**
 * Created by xcp on 2016/3/18.
 * 全局提示信息，会自动隐藏掉
 * 如果有多个信息同时出现，则依次排成一列
 */

var React = require('react');
var Animate = require('../Animate');
var AutoUnmountMixin = require('./AutoUnmountMixin');
var noop = require('../../com/noop');

var Message = React.createClass({

    mixins: [AutoUnmountMixin],

    onMount: function (animation) {
        this.animateDidMount(animation);
        animation.startAnimate(this.props.closeable ?
            noop :
            this.autoUnmount)
    },

    render: function () {
        var props = this.props;

        return <Animate
            component={props.animate.component}
            from={props.animate.from}
            to={props.animate.to}
            during={props.animate.during}
            onMount={this.onMount}>
            <div className="inline-block">
                <div className="bub-bill">
                    <div className="util-bill-pd">{props.message}</div>
                </div>
            </div>
        </Animate>
    }
});

module.exports = Message;