/**
 * Created by xcp on 2016/5/10.
 */


var React = require('react');
var ReactDOM = require('react-dom');
var Slider = require('../index').Slider;
var Slipper = require('../index').Slipper;
var PriceRange = require('../PriceRange');

ReactDOM.render(
    <Slider onChange={function(left, right, cl, cr){
        console.log('left=%s, right=%s, cl=%s, cr=%s', left, right, cl, cr)
    }}/>,
    document.getElementById('demo')
);

ReactDOM.render(
    <PriceRange
        min={0}
        max={1000}
        step={10}
        leftValue={100}
        rightValue={1000}
        leftStart={0}
        leftEnd={500}
        rightStart={500}
        rightEnd={1000}
        onChange={function(left, right, cl, cr){
        console.log('left=%s, right=%s, cl=%s, cr=%s', left, right, cl, cr)
    }}/>,
    document.getElementById('demo-price')
);

ReactDOM.render(<Slipper onMove={function(){console.log(arguments)}}/>,
    document.getElementById('demo-slipper')
);

ReactDOM.render(
    <Slider
        min={1000}
        max={100000}
        leftValue={1000}
        rightValue={100000}
        leftStart={0}
        leftEnd={5000}
        rightStart={5000}
        rightEnd={100000}
        onChange={function(left, right, cl, cr){
      console.log('left=%s, right=%s, cl=%s, cr=%s', left, right, cl, cr)
    }}/>,
    document.getElementById('demo-slipper-big')
);