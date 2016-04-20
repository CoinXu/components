/**
 * Created by Freax on 2016/4/14.
 * @website http://www.myfreax.com
 */
const React = require('react');
module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            isShow: false
        }
    },
    render: function () {
        return (
            <div className="primary-tips"
                 style={{ display: this.props.isShow? 'block' : 'none' }}>{this.props.message}</div>
        );
    }
});
