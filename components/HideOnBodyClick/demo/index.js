/**
 * Created by xcp on 2016/3/22.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('../index');

ReactDOM.render(
    <HideOnBodyClick>
      <span className="widget-bg-text">点body其他地方，我就不见了...Biu~Biu~Biu~</span>
    </HideOnBodyClick>,
    document.getElementById('demo-effect')
);

ReactDOM.render(
    <HideOnBodyClick effect={false}>
      <span className="widget-bg-text">这是一个没有动画的HideOnBodyClick</span>
    </HideOnBodyClick>,
    document.getElementById('demo')
);