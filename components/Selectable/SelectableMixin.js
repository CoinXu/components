/**
 * Created by xcp on 2016/3/24.
 */
var React = require('react');
var noop = require('../../com/noop');

module.exports = {

    propTypes: {
        itemList: React.PropTypes.array,
        defaultSelectedValue: React.PropTypes.any,
        onSelect: React.PropTypes.func
    },

    getInitialState: function () {
        return {
            panelStateIsShow: false,
            currentSelectedValue: null
        }
    },

    getDefaultProps: function () {
        var itemList = [];
        return {
            itemList: itemList,
            defaultSelectedValue: itemList[0],
            onSelect: noop
        }
    },

    onSelect: function (value) {
        var self = this;
        self.setState({currentSelectedValue: value}, function () {
            self.props.onSelect(value);
        });
        self.__animate.backToTheStart(function () {
            self.onVisible()
        })
    },

    onVisible: function () {
        this.setState({panelStateIsShow: false});
    },

    triggerHide: function () {
        return this.state.panelStateIsShow;
    },

    onAnimateMount: function (animate) {
        this.__animate = animate;
    },

    showPanel: function () {
        var self = this;
        self.setState({panelStateIsShow: true}, function () {
            var animate = self.__animate;
            var animateProps = animate.props;
            animate.animate(animateProps.from, animateProps.to)
        })
    },

    componentWillMount: function () {
        this.setState({currentSelectedValue: this.props.defaultSelectedValue});

    }
};