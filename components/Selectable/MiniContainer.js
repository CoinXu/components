/**
 * Created by xcp on 2016/3/23.
 */

const React = require('react');
const Custom = require('./Custom');
const noop = require('../../com/noop');
const ContainerMixin = require('./ContainerMixin');


var MiniContainer = React.createClass({

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
    let items = <div className="col-xs-4" key={value.index}>
      <div className="comp-mini-item">
        <div className="row">
          <strong className="col-xs-4 util-text-right">{value.index}</strong>
          <div className="col-xs-8">
            <span className={this.getProgressClassName(value.percent)}/>
          </div>
        </div>
      </div>
    </div>;

    return React.cloneElement(items, props);
  },

  _getWrap: function (panel, props, state, inst) {
    return <div
        className="comp-progress-panel comp-mini-progress">
      <div className="comp-select-m-t">
        <div className="row">
          {panel}
          <div className="comp-panel-title util-text-center col-xs-12">
            <span className="icon-img icon-plus util-v-m"
                  onClick={this.props.add.bind(this)}/>
          </div>
        </div>
      </div>
    </div>
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

module.exports = MiniContainer;