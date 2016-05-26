/**
 * Created by xcp on 2016/4/29.
 */

var React = require('react');
var assign = require('object-assign');
var returnFalse = function () {
    return false
};
var NotAllowSelect = React.createClass({
    getDefaultProps: function () {
        return {
            style: {}
        }
    },

    componentWillMount: function () {
        this.style = {
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none'
        }
    },

    render: function () {
        return React.cloneElement(this.props.children, {
            onSelect: returnFalse,
            style: assign({}, this.style, this.props.style)
        });
    }
});
module.exports = NotAllowSelect;
