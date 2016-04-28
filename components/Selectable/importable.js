/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var DropDown = require('./DropDown');
var noop = require('../../com/noop');

var getSelectorContent = function (rejectValue, onChange) {
    return function (value) {
        if (value === rejectValue) {
            return <input
                ref="inputNode"
                onChange={onChange}
                className="input-default"
                style={{width:60}}
                placeholder="请输入..."/>
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
            fromInput: false
        }
    },

    getDefaultProps: function () {
        return {
            itemList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'],
            defaultSelectedValue: 1,
            onSelect: noop,
            validate: getTruth,
            getSelectorContent: getSelectorContent(null),
            getItemContent: getItemContent,
            rejectValue: '10+'
        }
    },

    onSelect: function (value) {
        var self = this;
        self.setState({
            currentSelectedValue: value,
            fromInput: false
        }, function () {
            self.props.onSelect(value);
        });
    },

    onChange: function (e) {
        if (this.props.validate(e.target.value, this.refs.inputNode)) {
            this.setState({
                currentSelectedValue: e.target.value,
                fromInput: true
            })
        }
    },

    validate: function () {
        var inputNode = this.refs.inputNode;
        return inputNode ?
            this.props.validate(inputNode.value, inputNode) :
            true;
    },

    componentWillMount: function () {
        this.setState({currentSelectedValue: this.props.defaultSelectedValue})
    },

    // 如果是input的输入值变化，则不需要重新渲染
    shouldComponentUpdate: function (nextProps, nextState) {
        return !nextState.fromInput
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({currentSelectedValue: nextProps.defaultSelectedValue})
    },

    queryBindEvent: function () {
        var value = this.state.currentSelectedValue;
        return value !== this.props.rejectValue ||
            (value && typeof value === 'object' && !value.target)
    },

    render: function () {
        var self = this;
        var props = self.props;
        var state = self.state;

        var selectorContent = <DropDown.Selector
            onSelect={self.onSelect}
            defaultSelectedValue={state.currentSelectedValue}
            getSelectorContent={getSelectorContent(
                props.rejectValue,
                self.onChange)
            }/>;

        var panelContent = React.Children.map(
            props.itemList,
            function (value, index) {
                return <DropDown.Item
                    value={value}
                    key={index}
                    getItemContent={props.getItemContent}/>;
            });

        return <DropDown
            selectorBindEvent={this.queryBindEvent()}
            selectorContent={selectorContent}
            panelContent={panelContent}/>
    }
});

module.exports = Importable;