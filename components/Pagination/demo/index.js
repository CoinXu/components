/**
 * Created by xcp on 2016/3/23.
 */

var Pagination = require('../index');
var React = require('react');
var ReactDOM = require('react-dom');

var onChange = function () {
  console.log(arguments)
};

ReactDOM.render(
    <Pagination
        keepPages={2}
        defaultCurrent={10}
        total={1000}
        onSelect={onChange}
        onChange={onChange}/>,
    document.getElementById('demo')
);


ReactDOM.render(
    <Pagination
        defaultCurrent={3}
        total={2000}
        keepPages={1}
        pageSize={6}
        onChange={onChange}/>,
    document.getElementById('demo-1')
);

ReactDOM.render(
    <Pagination
        total={500}
        pageSize={9}
        onChange={onChange}/>,
    document.getElementById('demo-2')
);