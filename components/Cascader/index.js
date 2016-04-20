/**
 * Created by xcp on 2016/4/19.
 */

var React = require('react');
var noop = require('../../com/noop');

var getWrap = function (props, state, items) {
    var style = {
        display: state.defaultValue.length > 0 ? 'block' : 'none',
        top: 50, left: 0
    };

    return <div className="bub-head" style={style}>
        <i className="icon-img icon-arrow-up-lg"/>
        {items}
    </div>
};

var getContent = function (props, state, models, level) {
    // 一级类目

};

var Cascader = React.createClass({

    getInitializeState: function () {
        return {
            defaultValue: []
        }
    },

    getDefaultProps: function () {
        return {
            defaultValue: [],
            // 子集数据键名
            children: 'children',
            topLevelItems: [],
            maps: {},
            onSelect: noop,
            getWrap: getWrap,
            getContent: getContent
        }
    },

    onSelect: function (value) {
        console.log(value);
    },

    renderOne: function (model, level) {
        var children = models[this.props.children];
        if (children) {
            return this.renderOne(children, level + 1)
        }
        return this.props.getContent(this.props, this.state, model, level)
    },

    render: function () {
        var items = this.props.topLevelItems.map(this.props.renderOne, this);
        return this.props.getWrap(this.props, this.state, items)
    }
});

Cascader.Node = React.createClass({
    getDefaultProps: function () {
        return {
            onSelect: noop,
            getContent: noop,
            disabled: false,
            value: null
        }
    },

    getInitializeState: function () {
        return {disabled: false}
    },

    onSelect: function () {
        this.props.onSelect(this.props.value)
    },

    render: function () {
        if (this.props.children) {
            return React.cloneElement(this.props.children, {onClick: this.onSelect})
        }
        return this.props.getContent(this.props, this.state, this)
    }
});

module.exports = Cascader;