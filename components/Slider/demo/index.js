/**
 * Created by xcp on 2016/5/10.
 */


var React = require('react');
var ReactDOM = require('react-dom');
var Slider = require('../index').Slider;
var Slipper = require('../index').Slipper;

ReactDOM.render(
    <Slider onChange={function(left, right, cl, cr){
        console.log('left=%s, right=%s, cl=%s, cr=%s', left, right, cl, cr)
    }}/>,
    document.getElementById('demo')
);

ReactDOM.render(<Slipper
        onMove={function(){console.log(arguments)}}/>,
    document.getElementById('demo-slipper')
);

ReactDOM.render(
    <Slider
        min={1000}
        max={100000}
        onChange={function(left, right, cl, cr){
      console.log('left=%s, right=%s, cl=%s, cr=%s', left, right, cl, cr)
    }}/>,
    document.getElementById('demo-slipper-big')
);