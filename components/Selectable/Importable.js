/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var DropDown = require('./DropDown');
var noop = require('../../com/noop');

var getSelectorContent = function (props, state, onChange) {
    return function (value) {
        if (state.inputState) {
            return <input
                ref="inputNode"
                onChange={onChange}
                className="input-default"
                style={{width:60}}
                defaultValue={value}/>
        }
        return <div className="comp-select-selector">
            <span className="util-font-12">{value}</span>
            <span className="icon-img icon-tran-black-d"/>
        </div>
    }
};

var getItemContent = function (value, props) {
    var item = <li className="comp-panel-item"><strong>{value}</strong></li>;
    return React.cloneElement(item, props);
};

var getTruth = function () {
    return true;
};

var Importable = React.createClass({

    getInitialState: function () {
        return {
            currentSelectedValue: null,
            fromInput: false,
            disabled: false,
            inputState: false
        }
    },

    getDefaultProps: function () {
        return {
            itemList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'],
            defaultSelectedValue: 1,
            onSelect: noop,
            validate: getTruth,
            getSelectorContent: getSelectorContent,
            getItemContent: getItemContent,
            disabled: false,
            rejectValue: '10+'
        }
    },

    getCurrent: function () {
        return this.state.currentSelectedValue;
    },

    onSelect: function (value) {
        var isReject = value === this.props.rejectValue;
        var next = isReject ?
            this.state.currentSelectedValue :
            value;

        // 如果当前值为 rejectValue，则将上一次选择的值传给回调
        // 同时需要重新 render，以确认是否需要绑定事件
        this.props.onSelect(next);
        this.setState({
            currentSelectedValue: next,
            inputState: isReject
        });
    },

    onChange: function (e) {
        this._inputNode = e.target;
        if (this.props.validate(e.target.value, e.target, this)) {
            this.setState({
                currentSelectedValue: e.target.value,
                fromInput: true
            })
        }
    },

    validate: function () {
        var inputNode = this._inputNode;
        return inputNode ?
            this.props.validate(inputNode.value, inputNode) :
            true;
    },

    componentWillMount: function () {
        this.setState({
            currentSelectedValue: this.props.defaultSelectedValue,
            disabled: this.props.disabled
        })
    },

    // 如果是input的输入值变化，则不需要重新渲染
    shouldComponentUpdate: function (nextProps, nextState) {
        return !nextState.fromInput
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            currentSelectedValue: nextProps.defaultSelectedValue,
            disabled: nextProps.disabled
        })
    },

    queryBindEvent: function () {
        //var value = this.state.currentSelectedValue;
        //return value !== this.props.rejectValue ||
        //    (value && typeof value === 'object' && !value.target)
        return !this.state.disabled && !this.state.inputState
    },

    render: function () {
        var self = this;
        var props = self.props;
        var state = self.state;

        var selectorContent = <DropDown.Selector
            defaultSelectedValue={state.currentSelectedValue}
            getSelectorContent={props.getSelectorContent(props, state, self.onChange)}/>;

        var panelContent = React.Children.map(
            props.itemList,
            function (value, index) {
                return <DropDown.Item
                    value={value}
                    key={index}
                    getItemContent={props.getItemContent}/>;
            });

        return <DropDown
            onSelect={self.onSelect}
            disabled={props.disabled}
            selectorBindEvent={this.queryBindEvent()}
            selectorContent={selectorContent}
            panelContent={panelContent}/>
    }
});

module.exports = Importable;