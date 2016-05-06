/**
 * Created by xcp on 2016/5/5.
 * 折叠面板，提供展开和折叠功能
 * <Collapse>
 *   <Panel title={content} key="1">
 *     <h2>1</h2>
 *   </Panel>
 *   <Panel title={content} key="2">
 *     <h2>1</h2>
 *   </Panel>
 * </Collapse>
 *
 * var right = <span class="icon-img icon-tran-black-t"/>;
 * var left = <span class="icon-img icon-tran-black-d"/>;
 */

var React = require('react');
var Animate = require('../Animate');
var Panel = require('./Panel');
var noop = require('../../com/noop');

var Collapse = React.createClass({

    getInitialState: function () {
        return {
            expandKeys: []
        }
    },

    getDefaultProps: function () {
        return {
            expandKeys: []
        }
    },

    componentWillMount: function () {
        this.setState({expandKeys: this.props.expandKeys})
    },

    render: function () {
        var expandKeys = this.state.expandKeys;
        return <div className="util-shadow util-diff-bd util-def-pd">
            {
                React.Children.map(this.props.children, function (child) {
                    return React.cloneElement(child, {
                        collapse: expandKeys.indexOf(child.props.key) === -1
                    })
                }, this)
            }
        </div>
    }
});

Collapse.Panel = React.createClass({

    getInitialState: function () {
        return {collapse: true}
    },

    getDefaultProps: function () {
        return {
            key: null,
            title: null,
            collapse: true
        }
    },

    componentWillMount: function () {
        this.setState({collapse: this.props.collapse})
    },

    onMount: function (inst) {
        this._panel = inst;
    },

    toggle: function () {
        this.setState({collapse: !this.state.collapse});
        this._panel && this._panel.toggle();
    },

    render: function () {
        var props = this.props;
        var dir = this.state.collapse ? 't' : 'd';

        var title = <span>
            {props.title}
            <span
                style={{marginLeft:10,cursor:'pointer'}}
                onClick={this.toggle}
                className={"inline-block icon-img icon-tran-black-" + dir}/>
        </span>;

        return <div>
            <Panel
                collapse={this.state.collapse}
                title={title}
                onMount={this.onMount}>
                {props.children}
            </Panel>

        </div>
    }
});

module.exports = Collapse;
