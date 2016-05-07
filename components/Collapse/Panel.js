/**
 * Created by xcp on 2016/5/5.
 */

var React = require('react');
var Animate = require('../Animate');
var noop = require('../../com/noop');
var assign = require('object-assign');

var Panel = React.createClass({

    getInitialState: function () {
        return {
            collapse: true,
            isInitial: true,
            from: {},
            to: {}
        }
    },

    getDefaultProps: function () {
        return {
            isPanel: true,
            components: 'div',
            className: 'module',
            title: null,
            collapse: true,
            onMount: noop,
            onChange: noop,
            getContent: noop
        }
    },

    _toggleUIState: function (collapse) {
        this.__animate[collapse ? 'backToTheStart' : 'startAnimate']();
    },

    onAnimateMount: function (inst) {
        this.__animate = inst;
    },

    expand: function () {
        this.setState({collapse: false})
    },

    collapse: function () {
        this.setState({collapse: true})
    },

    toggle: function () {
        this.setState({collapse: !this.state.collapse})
    },

    componentWillMount: function () {
        this.setState({collapse: this.props.collapse})
    },

    componentDidMount: function () {
        var height = this.__animate.refs.wrap.offsetHeight;
        this.setState({
            from: {height: 0},
            to: {height: height},
            isInitial: false
        });
        this.props.onMount(this);
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (prevState.collapse !== this.state.collapse) {
            this._toggleUIState(this.state.collapse);
            this.props.onChange(this.state.collapse);
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.collapse !== this.state.collapse) {
            this.setState({collapse: nextProps.collapse})
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.collapse !== this.state.collapse
    },

    render: function () {
        var props = this.props;
        var state = this.state;
        var ret = props.getContent(props, this.state, this);
        var Components = props.components;

        var style = {overflow: 'hidden'};

        // 如果初始状态为展开 -> collapse = false
        // 那么容器高度就不用理会
        // 如果是折叠状态 -> collapse = true
        // 那么高度就需要设置为0
        // 如果不是初始状态呢？
        // 也就是说要加上一个初始状态判断？

        if (state.collapse && state.isInitial) {
            style.height = 0
        }

        var getContent = function (p, s, inst) {
            return <div style={inst.styleProps()}>
                {React.cloneElement(ret || props.children, {ref: 'wrap'})}
            </div>
        };

        return <Components className={props.className}>
            {React.cloneElement(props.title)}
            <div style={style}>
                <Animate
                    componentDidMount={this.onAnimateMount}
                    from={state.from}
                    to={state.to}
                    during={200}
                    getContent={getContent}/>
            </div>
        </Components>;
    }
});

module.exports = Panel;