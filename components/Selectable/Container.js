/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('../HideOnBodyClick');
var classNames = require('classnames');

var SelectableMixin = require('./SelectableMixin');
var ContainerMixin = require('./ContainerMixin');

var Container = React.createClass({

    mixins: [SelectableMixin, ContainerMixin],

    reRender: function (itemList) {
        var mountNode = ReactDOM.findDOMNode(this).parentNode;
        ReactDOM.render(<Container
                itemList={itemList}
                onSelect={this.props.onSelect}
                defaultSelectedValue={this.props.defaultSelectedValue}/>,
            mountNode)
    },

    render: function () {
        var panelClassName = {
            'comp-custom-select': true,
            'comp-show-panel': this.state.panelStateIsShow
        };

        var progressText = 'progress-bar-text';

        var progressClassName = this.getProgressClassName(
            this.state.currentSelectedValue ?
                this.state.currentSelectedValue.percent :
                0,
            progressText
        );

        var itemList = this.props.itemList.map(function (item) {
            return <li className="comp-panel-item" key={item.index}>
                <strong className="comp-icon-gap">{item.index}</strong>
                <div className="comp-select-progress comp-icon-gap"
                     onClick={this.onSelect.bind(this, item)}>
                    <span className={this.getProgressClassName(item.percent, progressText)}/>
                </div>
                <span
                    className="icon-img icon-close util-v-m"
                    onClick={this.props.remove.bind(this, item)}/>
            </li>
        }, this);

        return (<div className={classNames(panelClassName)} ref="selectable">
            <div className="comp-select-selector-pd">
                <div className="comp-select-selector" onClick={this.showPanel}>
                    <div className="comp-select-progress">
                        <span className={progressClassName}/>
                    </div>
                    <span className="icon-img icon-tran-black-d"/>
                </div>
            </div>
            <HideOnBodyClick
                refTarget={this.refs.selectable}
                onHide={this.onHide}
                onMount={this.onAnimateMount}
                shouldHide={this.shouldHide}>
                <div className="comp-select-panel comp-progress-panel">
                    <ol className="comp-select-m-t">
                        {itemList}
                        <li className="comp-panel-title util-text-center">
                            <span className="icon-img icon-plus util-v-m" onClick={this.props.add}/>
                        </li>
                    </ol>
                </div>
            </HideOnBodyClick>
        </div>)
    }
});

module.exports = Container;