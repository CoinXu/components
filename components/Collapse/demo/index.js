/**
 * Created by xcp on 2016/5/5.
 */

var Panel = require('../Panel');
var ReactDOM = require('react-dom');
var Collapse = require('../index');
var Node = Collapse.Panel;

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
    <Collapse>
        <Node title={<span>panel title 1</span>}>
            <div>
                <h4>Panel content 1</h4>
                <h4>Panel content 1</h4>
                <h4>Panel content 1</h4>
            </div>
        </Node>
        <Node title={<span>panel title 2</span>}>
            <div>
                <h4>Panel content 2</h4>
                <h4>Panel content 2</h4>
                <h4>Panel content 2</h4>
            </div>
        </Node>
        <Node title={<span>panel title 3</span>}>
            <div>
                <h4>Panel content 3</h4>
                <h4>Panel content 3</h4>
                <h4>Panel content 3</h4>
            </div>
        </Node>
    </Collapse>,
    document.getElementById('demo-collapse')
);
