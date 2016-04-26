/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var DropDown = require('./DropDown');
var noop = require('../../com/noop');

var getSelectorContent = function (item) {
    return <div className="comp-select-selector">
        <span className="util-font-12">{item.text}</span>
        <span className="icon-img icon-tran-black-d"/>
    </div>

};

var getItemContent = function (item, props) {
    var elem = (<DropDown.Item isItem={!!item.value} value={item}>
        {item.value ?
            <li className="comp-panel-item"><strong>{item.text}</strong></li> :
            <li className="comp-panel-title"><span className="color-remind">{item.text}</span></li>
        }
    </DropDown.Item>);
    return React.cloneElement(elem, props);
};

var Diff = React.createClass({

    getInitialState: function () {
        return {
            currentSelectedValue: null
        }
    },

    getDefaultProps: function () {
        var itemList = [
            {value: 0, text: '筛选异常原因'},
            {value: 1, text: '全部'},
            {value: 2, text: '编号重复'},
            {value: 3, text: '编号不存在'},
            {value: 4, text: '已下架'}
        ];

        return {
            itemList: itemList,
            defaultSelectedValue: itemList[0],
            rejectValue: null,
            onSelect: noop,
            getSelectorContent: getSelectorContent,
            getItemContent: getItemContent
        }
    },

    onSelect: function (value) {
        var self = this;
        self.setState({currentSelectedValue: value}, function () {
            self.props.onSelect(value);
        });
    },

    ensureEvent: function () {
        return this.state.currentSelectedValue !== this.props.rejectValue
    },

    render: function () {
        var self = this;
        var props = self.props;
        var panelContent = props.itemList.map(props.getItemContent);
        var selector = <DropDown.Selector
            onSelect={self.onSelect}
            defaultSelectedValue={props.defaultSelectedValue}
            getSelectorContent={props.getSelectorContent}/>;

        return <DropDown
            selectorContent={selector}
            panelContent={panelContent}/>
    }
});

module.exports = Diff;