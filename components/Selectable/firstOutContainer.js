/**
 * Created by xcp on 2016/3/23.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var HideOnBodyClick = require('../HideOnBodyClick');
var classNames = require('classnames');
var noop = require('../../com/noop');

var SelectableMixin = require('./SelectableMixin');
var ContainerMixin = require('./ContainerMixin');

var FOContainer = React.createClass({

    propTypes: {
        firstOut: React.PropTypes.array
    },

    mixins: [SelectableMixin, ContainerMixin],

    getDefaultProps: function () {
        return {firstOut: []}
    },

    reRender: function (itemList) {
        var mountNode = ReactDOM.findDOMNode(this).parentNode;
        ReactDOM.render(<FOContainer
                itemList={itemList}
                firstOut={this.props.firstOut}
                onSelect={this.props.onSelect}
                defaultSelectedValue={this.props.defaultSelectedValue}/>,
            mountNode)
    },

    getItemElement: function (item) {
        return (<li className="comp-panel-item" key={item.index}>
            <strong className="comp-icon-gap">{item.index}</strong>
            <div className="comp-select-progress comp-icon-gap"
                 onClick={this.onSelect.bind(this, item)}>
                <span className={this.getProgressClassName(item.percent, 'progress-bar-text')}/>
            </div>
            <span className="icon-img icon-close util-v-m" onClick={this.props.remove.bind(this, item)}/>
        </li>)
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

        var props = this.props;

        var itemList = props.itemList
            .filter(function (item) {
                return props.firstOut.indexOf(item) === -1
            }, this)
            .map(this.getItemElement, this);

        var firstOutList = props.firstOut.map(this.getItemElement, this);

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
                    <div className="bub-bd-b">
                        <div className="bub-pd-l-lg bub-pd-r-lg">
                            <span className="color-selection comp-neg-m-l comp-icon-gap">先出货柜</span>
                            <span className="icon-img icon-qa-normal util-v-text-t"/>
                        </div>
                        <div className="bub-pd-b">
                            <ol className="comp-select-m-t bub-pd-t">
                                {firstOutList}
                            </ol>
                        </div>
                    </div>
                    <ol className="comp-select-m-t bub-pd-t">
                        <li className="comp-panel-title util-line-14">
                            <span className="color-selection comp-neg-m-l comp-icon-gap">其他货柜</span>
                            <span className="icon-img icon-qa-normal util-v-text-t"/>
                        </li>
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

module.exports = FOContainer;