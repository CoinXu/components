/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var DropDown = require('./DropDown');
var noop = require('../../com/noop');


var Custom = React.createClass({

    getInitialState: function () {
        return {
            currentSelectedValue: null
        }
    },

    getDefaultProps: function () {
        return {
            itemList: [],
            wrapClassName: null,
            defaultSelectedValue: null,
            onSelect: noop,
            getSelectorContent: noop,
            getItemContent: noop
        }
    },

    onSelect: function (value) {
        var self = this;
        if (typeof value === 'object' && value.target) {
            self.props.onSelect(value.target.value);
        } else {
            self.setState({currentSelectedValue: value}, function () {
                self.props.onSelect(value);
            });
        }
    },

    componentWillMount: function () {
        this.setState({
            currentSelectedValue: this.props.defaultSelectedValue === null ?
                this.props.itemList[0] :
                this.props.defaultSelectedValue
        })
    },

    ensureEvent: function () {
        var value = this.state.currentSelectedValue;
        return value !== this.props.rejectValue ||
            (value && typeof value === 'object' && !value.target)
    },

    render: function () {
        var self = this;
        var props = self.props;

        var selectorContent = <DropDown.Selector
            onSelect={self.onSelect}
            defaultSelectedValue={self.state.currentSelectedValue}
            getSelectorContent={props.getSelectorContent}/>;

        var panelContent = props.itemList.map(function (value, index) {
            return <DropDown.Item
                value={value}
                key={index}
                getItemContent={props.getItemContent}/>;
        });

        return <DropDown
            wrapClassName={props.wrapClassName}
            selectorBindEvent={this.ensureEvent()}
            selectorContent={selectorContent}
            panelContent={panelContent}/>
    }
});

module.exports = Custom;