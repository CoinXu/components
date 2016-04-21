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
        <div className="bubble-nav">
            {items}
        </div>
    </div>
};

var getContent = function (props, state, models, inst) {
    // 一级类目
    // 二级类目及下属类目
    return [getFirstLevel(props, state, models, inst)]
        .concat(models.map(function (second, index) {
            return getSecondLevel(props, state, second[props.children], index, second)
        }));
};

var getFirstLevel = function (props, state, models, inst) {
    var className;
    var getItem = function (item, i) {
        className = state.defaultValue.indexOf(item.id) !== -1 ? 'curr' : '';
        return <Cascader.Node
            value={item}
            key={i}
            trigger={inst.change}>
            <li className={className} title={item.name}>
                {item.name}
                <i className="icon-img icon-arrow-nav-a"/>
            </li>
        </Cascader.Node>
    };
    return <ul className="nav-lg" key={1}>
        {models.map(getItem)}
    </ul>
};

var getSecondLevel = function (props, state, models, index, parent) {

    var getChildren = function (children, j) {
        return <ul className="view" key={'s-s-s-' + j}>
            {children.map(function (child, i) {
                return <li key={j + '-' + i}><a href={child.id}>{child.name}</a></li>
            })}
        </ul>
    };

    var getItem = function (item, i) {
        var children = item[props.children];
        var hasChildren = children && children.length > 0;
        var title = null;

        if (hasChildren) {
            title = <strong><a href={item.id}>{item.name}</a></strong>
        }

        return <div className="ul" key={'s-s-s-'+ i}>
            {title}
            {hasChildren ? getChildren(children, i) : getChildren([item], i)}
        </div>
    };

    var moduleItem = function (models, i) {
        return <div className="module" key={'s-s-'+ i}>
            {models.map(getItem)}
        </div>
    };

    // 两个子类压入一个.module里

    // models 每两个拆成一组
    // ui 上是这样设计的....
    var len = models.length;
    var start = 0;
    var r = [];

    while (start < len) {
        r.push(models.slice(start, start += 2))
    }

    var style = {};
    if (state.defaultValue.indexOf(parent.id) === -1) {
        style.display = 'none'
    }
    return <div className="nav-sm" key={'s-' + index} style={style}>
        {r.map(moduleItem)}
        <a href="" className="more a-link">查看更多</a>
    </div>
};

var Cascader = React.createClass({

    getInitialState: function () {
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

    componentWillMount: function () {
        this.setState({defaultValue: this.props.defaultValue})
    },

    renderOne: function (model, level) {
        var children = model[this.props.children];
        if (children && children.length > 0 && level === 0) {
            return this.renderOne(children, level + 1)
        }
        return this.props.getContent(this.props, this.state, model, level)
    },

    change: function (item) {
        this.setState({defaultValue: item ? [item.id] : this.props.defaultValue})
    },

    hide: function () {
        this.setState({defaultValue: []})
    },

    render: function () {
        var items = this.props.getContent(
            this.props,
            this.state,
            this.props.topLevelItems,
            this
        );
        return this.props.getWrap(this.props, this.state, items)
    }
});

Cascader.Node = React.createClass({
    getDefaultProps: function () {
        return {
            onSelect: noop,
            getContent: noop,
            trigger: noop,
            disabled: false,
            value: null
        }
    },

    getInitializeState: function () {
        return {disabled: false}
    },

    trigger: function () {
        this.props.trigger(this.props.value)
    },

    cancel: function () {
        this.props.trigger(null)
    },

    render: function () {
        return React.cloneElement(this.props.children, {
            onMouseEnter: this.trigger,
            onMouseLeave: this.cancel
        })
    }
});

module.exports = Cascader;
