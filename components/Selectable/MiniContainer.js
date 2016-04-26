/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('../HideOnBodyClick');
var classNames = require('classnames');

var SelectableMixin = require('./SelectableMixin');
var ContainerMixin = require('./ContainerMixin');

var MiniContainer = React.createClass({

    mixins: [SelectableMixin, ContainerMixin],

    reRender: function (itemList) {
        var mountNode = ReactDOM.findDOMNode(this).parentNode;
        ReactDOM.render(<MiniContainer
                itemList={itemList}
                onSelect={this.props.onSelect}
                defaultSelectedValue={this.props.defaultSelectedValue}/>,
            mountNode)
    },

    render: function () {
        var props = this.props;
        var panelClassName = {
            'comp-custom-select': true,
            'comp-show-panel': this.state.panelStateIsShow
        };

        var progressClassName = this.getProgressClassName(
            this.state.currentSelectedValue ?
                this.state.currentSelectedValue.percent :
                0,
            'progress-bar-text'
        );

        var itemList = this.props.itemList.map(function (item) {
            return (<div className="col-xs-4" key={item.index}>
                <div className="comp-mini-item" onClick={this.onSelect.bind(this, item)}>
                    <div className="row">
                        <strong className="col-xs-4 util-text-right">{item.index}</strong>
                        <div className="col-xs-8">
                            <span className={this.getProgressClassName(item.percent)}/>
                        </div>
                    </div>
                </div>
            </div>);
        }, this);

        return (<div className={classNames(panelClassName)} ref="selectable">
            <div
                className={"comp-select-selector-pd" + (props.selectorClassName ? (' ' + props.selectorClassName) : '')}
                style={props.selectorStyle}>
                <div
                    className='comp-select-selector'
                    onClick={this.showPanel}>
                    <div className="comp-select-progress">
                        <span className={progressClassName}/>
                    </div>
                    <span className="icon-img icon-tran-black-d"/>
                </div>
            </div>
            <HideOnBodyClick
                refTarget={this.refs.selectable}
                onHide={this.onHide}
                onAnimateMount={this.onAnimateMount}
                triggerHide={this.triggerHide}>
                <div className="comp-select-panel comp-progress-panel comp-mini-progress">
                    <div className="comp-select-m-t">
                        <div className="row">
                            {itemList}
                            <div className="comp-panel-title util-text-center col-xs-12">
                                <span className="icon-img icon-plus util-v-m" onClick={props.add}/>
                            </div>
                        </div>
                    </div>
                </div>
            </HideOnBodyClick>
        </div>)
    }
});

module.exports = MiniContainer;