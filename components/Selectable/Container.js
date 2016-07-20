/**
 * Created by xcp on 2016/3/23.
 */

const React = require('react');
const Custom = require('./Custom');
const noop = require('../../com/noop');
const ContainerMixin = require('./ContainerMixin');

const Container = React.createClass({

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

  _getWrap: function (panel, props, state, inst) {
    return <ol className="comp-select-m-t">
      {panel}
      <li className="comp-panel-title util-text-center">
        <span className="icon-img icon-plus util-v-m"
              onClick={this.props.add.bind(this)}/>
      </li>
    </ol>
  },

  render: function () {
    return <Custom
        itemList={this.state.itemList}
        onSelect={this.props.onSelect}
        getItemWrap={this._getWrap}
        getSelectorContent={this._getSelector}
        getItemContent={this._getItem}/>
  }
});

module.exports = Container;