/**
 * Created by xcp on 2016/3/23.
 */

const React = require('react');
const Custom = require('./Custom');
const noop = require('../../com/noop');
const ContainerMixin = require('./ContainerMixin');
const DropDown = require('./DropDown');

const FOContainer = React.createClass({

  mixins: [ContainerMixin],

  _getSelector: function (current) {
    let progressText = 'progress-bar-text';
    let progressClassName = this.getProgressClassName(
        current ? current.percent : 0,
        progressText
    );

    return <div className="comp-select-selector">
      <div className="comp-select-progress">
        <span className={progressClassName}/>
      </div>
      <span className="icon-img icon-tran-black-d"/>
    </div>
  },

  _getItem: function (value, props) {
    let className = this.getProgressClassName(
        value.percent,
        'progress-bar-text'
    );

    let items = <div className="comp-select-progress comp-icon-gap">
      <span className={className}/>
    </div>;

    items = React.cloneElement(items, props);

    return <li className="comp-panel-item" key={value.index}>
      <strong className="comp-icon-gap">{value.index}</strong>
      {items}
      <span className="icon-img icon-close util-v-m"
            onClick={this.props.remove.bind(this, value)}/>
    </li>;
  },

  _getItemContent: function (value, index) {
    return <DropDown.Item
        value={value}
        key={index}
        getItemContent={this._getItem}/>
  },

  _getItems: function (props, state, inst) {
    const Fo = this.props.firstOut;
    const State = this.state;

    const items = State.itemList.filter(function (item) {
      return Fo.indexOf(item) === -1
    });

    const item_list = items.map(this._getItemContent, this);

    const fo_list = Fo.map(this._getItemContent, this);

    this._list = {items: item_list.length, fo: fo_list.length};
    return item_list.concat(fo_list);
  },

  _getWrap: function (items, props, state, inst) {
    const Fo = items.slice(-this._list.fo);
    const Items = items.slice(0, this._list.items);

    return <div className="comp-progress-panel">
      <div className="bub-bd-b">
        <div className="bub-pd-l-lg bub-pd-r-lg">
          <span
              className="color-selection comp-neg-m-l comp-icon-gap">先出货柜</span>
          <span className="icon-img icon-qa-normal util-v-text-t"/>
        </div>
        <div className="bub-pd-b">
          <ol className="comp-select-m-t bub-pd-t">
            {Fo}
          </ol>
        </div>
      </div>
      <ol className="comp-select-m-t bub-pd-t">
        <li className="comp-panel-title util-line-14">
          <span
              className="color-selection comp-neg-m-l comp-icon-gap">其他货柜</span>
          <span className="icon-img icon-qa-normal util-v-text-t"/>
        </li>
        {Items}
        <li className="comp-panel-title util-text-center">
          <span className="icon-img icon-plus util-v-m"
                onClick={this.props.add.bind(this)}/>
        </li>
      </ol>
    </div>
  },

  render: function () {
    return <Custom
        itemList={this.state.itemList}
        onSelect={this.props.onSelect}
        getItemWrap={this._getWrap}
        getSelectorContent={this._getSelector}
        getItemsContent={this._getItems}/>
  }
});

module.exports = FOContainer;