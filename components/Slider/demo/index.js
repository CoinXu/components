/**
 * Created by xcp on 2016/5/10.
 */

var Slipper = require('../Slipper');
var Slider = require('../index');
var React = require('react');
var ReactDOM = require('react-dom');
ReactDOM.render(
    <Slider onChange={function(left, right){
        console.log('left=%s, right=%s', left, right)
    }}/>,
    document.getElementById('demo')
);
ReactDOM.render(<Slipper />, document.getElementById('demo-slipper'));