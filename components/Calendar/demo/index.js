/**
 * Created by xcp on 2016/4/27.
 */

var Calendar = require('../index');
var ReactDOM = require('react-dom');

ReactDOM.render(<Calendar
        onSelect={function(time){console.log(time.format())}}
        onChange={function(p, c){console.log(p.format(), c.format())}}/>,
    document.getElementById('demo')
);