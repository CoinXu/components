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
var util = require('../../com/util/array');

var Collapse = React.createClass({

    getInitialState: function () {
        return {
            expandKeys: []
        }
    },

    getDefaultProps: function () {
        return {
            expandKeys: [],
            className: '',
            accordion: false
        }
    },

    componentWillMount: function () {
        this.setExpandKeys(this.props.expandKeys);
        this._allKeys = React.Children.map(this.props.children, function (child) {
            return child.key
        });
    },

    setExpandKeys: function (keys) {
        this.setState({expandKeys: this.props.accordion ? keys.slice(0, 1) : keys});
    },

    addOne: function (key) {
        this.setExpandKeys(util.add(this.state.expandKeys, key));
    },

    removeOne: function (key) {
        this.setExpandKeys(util.remove(this.state.expandKeys, key));
    },

    expand: function () {
        this.setState({expandKeys: this._allKeys})
    },

    collapse: function () {
        this.setState({expandKeys: []})
    },

    onChange: function (key, collapse) {
        if (this.props.accordion) {
            this.setState({expandKeys: collapse ? [] : [key]});
        } else {
            this[(collapse ? 'remove' : 'add') + 'One'](key)
        }
    },

    render: function () {
        var self = this;
        var expandKeys = self.state.expandKeys;
        var props = self.props;

        return <div className={props.className}>
            {
                React.Children.map(props.children, function (child) {
                    return React.cloneElement(child, {
                        mark: child.key,
                        onChange: self.onChange,
                        collapse: expandKeys.indexOf(child.key) === -1
                    })
                })
            }
        </div>
    }
});

Collapse.Node = React.createClass({

    getInitialState: function () {
        return {collapse: true}
    },

    getDefaultProps: function () {
        return {
            mark: null,
            title: null,
            collapse: true,
            onChange: noop
        }
    },

    componentWillMount: function () {
        this.setState({collapse: this.props.collapse})
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.collapse !== this.state.collapse) {
            this.setState({collapse: nextProps.collapse})
        }
    },

    toggle: function () {
        this.props.onChange(this.props.mark, !this.state.collapse);
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
                onChange={this.onChange}>
                {props.children}
            </Panel>
        </div>
    }
});

module.exports = Collapse;
