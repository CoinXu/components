/**
 * Created by xcp on 2016/5/5.
 */

var Panel = require('../Panel');
var ReactDOM = require('react-dom');
var Collapse = require('../index');
var Node = Collapse.Node;

var content = <div>
  <p>Panel content</p>
  <p>Panel content</p>
  <p>Panel content</p>
  <p>Panel content</p>
</div>;

var inst1 = ReactDOM.render(<Panel
        collapse={true}
        title={<h3 onClick={function(){inst1.toggle()}}>Panel title</h3>}>
      {content}
    </Panel>,
    document.getElementById('demo')
);

var inst2 = ReactDOM.render(<Panel
        collapse={false}
        title={<h3 onClick={function(){inst2.toggle()}}>Panel title</h3>}>
      {content}
    </Panel>,
    document.getElementById('demo-expand')
);

// Collapse
ReactDOM.render(
    <Collapse expandKeys={["2"]}>
      <Node title={<span>panel title 1</span>} key="1">
        {content}
      </Node>
      <Node title={<span>panel title 2</span>} key="2">
        {content}
      </Node>
      <Node title={<span>panel title 3</span>} key="3">
        {content}
      </Node>
    </Collapse>,
    document.getElementById('demo-collapse')
);

// accordion
ReactDOM.render(
    <Collapse expandKeys={["2"]} accordion={true}>
      <Node title={<span>panel title 1</span>} key="1">
        {content}
      </Node>
      <Node title={<span>panel title 2</span>} key="2">
        {content}
      </Node>
      <Node title={<span>panel title 3</span>} key="3">
        <Node title={<span>panel title 3-1</span>} key="3_1">
          <Node title={<span>panel title 3-1-1</span>} key="3_1_1">
            {content}
          </Node>
          <Node title={<span>panel title 3-1-2</span>} key="3_1_2">
            {content}
          </Node>
        </Node>
        <Node title={<span>panel title 3-2</span>} key="3_2">
          {content}
        </Node>
      </Node>
    </Collapse>,
    document.getElementById('demo-collapse-accordion')
);
