/**
 * Created by Freax on 2016/4/13.
 * @website http://www.myfreax.com
 */
const React = require('react');
module.exports = React.createClass({
    render: function () {
        return (
            <li className="selectRow" onClick={this.props.click}>
                {this.props.item}
            </li>
        );
    }
});
