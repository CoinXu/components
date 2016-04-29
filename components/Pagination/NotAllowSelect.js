/**
 * Created by xcp on 2016/4/29.
 */

var React = require('react');
var NotAllowSelect = React.createClass({
    render: function () {
        return <div onSelect={function(){return false;}}
                    style={{MozUserSelect:'none',WebkitUserSelect:'none',msUserSelect:'none',userSelect:'none'}}>
            {this.props.children}
        </div>
    }
});
module.exports = NotAllowSelect;
