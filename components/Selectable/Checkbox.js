/**
 * Created by xcp on 2016/4/10.
 */

var React = require('react');
var noop = require('../../com/noop');

var Checkbox = React.createClass({

    getInitialState: function () {
        return {checkedList: []}
    },

    getDefaultProps: function () {
        return {
            wrapClassName: 'list',
            checkedList: [],
            itemList: [],
            allowMulti: true,
            onComponentMount: noop,
            onChange: noop,
            getContent: function (item, index, inst) {
                return <label key={index}>
                    <Checkbox.Checkbox
                        checked={inst.state.checkedList.indexOf(item) !== -1}
                        onComponentMount={inst.recordCheckbox}
                        onChange={inst.onChange}
                        value={item}/>
                    <Checkbox.Label content={item.content}/>
                </label>
            }
        }
    },

    onChange: function (checked, item) {
        var checkedList = this.state.checkedList;
        var index = checkedList.indexOf(item);

        // copy checkedList
        var nextCheckedList = checkedList.slice(0, checkedList.length);

        // 单选
        if (!this.props.allowMulti) {
            nextCheckedList = checked ? [item] : []
        }
        // 多选
        else {
            // 取消选中时
            // 如果已经选中，则删除
            // 未选中，则忽略
            if (!checked && index !== -1) {
                nextCheckedList.splice(index, 1);
            }

            else if (index === -1) {
                nextCheckedList.push(item);
            }
        }

        this.updateCheckedList(nextCheckedList);
    },

    updateCheckedList: function (checkedList) {
        this.setState({checkedList: checkedList})
    },

    cleanup: function () {
        this.updateCheckedList([])
    },

    checkAll: function () {
        this.updateCheckedList(this._checkbox)
    },

    recordCheckbox: function (checkboxInst) {
        this._checkbox.push(checkboxInst);
    },

    componentWillMount: function () {
        this._checkbox = [];
        if (this.props.checkedList.length > 0) {
            this.updateCheckedList(this.props.checkedList)
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        // 如果下一次要更新checkbox与上一次一样，则不用更新
        return nextState.checkedList.length !== this.state.checkedList ||
            nextState.checkedList.some(function (item) {
                return this.state.checkedList.indexOf(item) === -1
            }, this)
    },

    render: function () {
        var items = this.props.itemList.map(function (item, index) {
            return this.props.getContent(item, index, this)
        }, this);

        return <div className={this.props.wrapClassName}>{items}</div>
    }
});

Checkbox.Label = React.createClass({
    getDefaultProps: function () {
        return {
            content: null,
            getContent: function (content) {
                content = content || {};
                content = typeof content === 'object' ? content : {};
                return <span>
                    {content.name}
                    <em>{content.widget}</em>
                </span>
            }
        }
    },

    render: function () {
        return this.props.getContent(this.props.content);
    }
});

Checkbox.Checkbox = React.createClass({

    getInitialState: function () {
        return {checked: false}
    },

    getDefaultProps: function () {
        return {
            checked: false,
            checkedClassName: 'icon-img icon-checkbox-b',
            uncheckedClassName: 'icon-img icon-checkbox-a',
            value: null,
            onComponentMount: noop,
            onChange: noop,
            getContent: function (inst) {
                var className = inst.state.checked ?
                    inst.props.checkedClassName :
                    inst.props.uncheckedClassName;
                return <i className={className} onClick={inst.toggleChecked}/>
            }
        }
    },

    isChecked: function () {
        return this.state.checked
    },

    getValue: function () {
        return this.props.value;
    },

    toggleChecked: function () {
        this.props.onChange(!this.state.checked, this.props.value)
    },

    componentWillMount: function () {
        this.setState({checked: this.props.checked});
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({checked: nextProps.checked})
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.checked !== this.state.checked
    },

    render: function () {
        return this.props.getContent(this);
    }
});

module.exports = Checkbox;