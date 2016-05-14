/**
 * Created by xcp on 2016/5/10.
 */


var React = require('react');
var ReactDOM = require('react-dom');
var Slider = require('../index').Slider;
var Slipper = require('../index').Slipper;
ReactDOM.render(
    <Slider onChange={function(left, right, step){
        console.log('left=%s, right=%s, step=%s', left, right, step)
    }}/>,
    document.getElementById('demo')
);
ReactDOM.render(<Slipper
    onMove={function(){console.log(arguments)}} />,
    document.getElementById('demo-slipper')
);