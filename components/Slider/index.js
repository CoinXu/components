/**
 * Created by xcp on 2016/5/10.
 */

var React = require('react');
var noop = require('../../com/noop');

var Slider = React.createClass({
    getInitialState: function () {
        return {
            currentValue: 0,
            disabled: false
        }
    },

    getDefaultProps: function () {
        return {
            range: true,
            min: 0,
            max: 20,
            defaultValue: 0,
            disabled: false,
            onChange: noop
        }
    },

    componentWillMount: function () {
        this.setState({
            disabled: this.props.disabled,
            currentValue: this.props.defaultValue
        })
    },

    render: function () {

    }
});

module.exports = Slider;