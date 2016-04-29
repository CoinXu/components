/**
 * Created by xcp on 2016/4/29.
 */

var React = require('react');
var noop = require('../../com/noop');
var intReg = /^\d+$/;
var getTruth = function () {
    return true;
};

var PageInput = React.createClass({

    getInitialState: function () {
        return {current: 1}
    },

    getDefaultProps: function () {
        return {
            onSearch: noop,
            validate: getTruth,
            current: 1,
            max: Math.MAX_VALUE,
            min: 0,
            validateFailedMark: -1
        }
    },

    componentWillMount: function () {
        this.setState({current: this.props.current})
    },

    componentWillReceiveProps: function (nextProps, nextState) {
        this.setState({current: nextProps.current})
    },

    _validate: function (str) {
        var mark = this.props.validateFailedMark;
        if (str.length === 0
            || !intReg.test(str)
            || !this.props.validate(str)) {
            return mark;
        }

        var num = parseInt(str);
        return num >= this.props.min && num <= this.props.max ?
            num : mark;
    },

    onChange: function () {
        var val = this.refs.page.value;

        if (val) {
            var result = this._validate(val);

            if (result === this.props.validateFailedMark) {
                return this.refs.page.value = this.state.current;
            }

            if (result !== this.state.current) {
                this.setState({current: result})
            }
        }
    },

    onSearch: function () {
        this.props.onSearch(this.state.current)
    },

    render: function () {
        return <span>
              <input
                  onChange={this.onChange}
                  ref="page"
                  type="number"
                  style={{padding:0}}
                  className="input-default page-item"
                  placeholder={this.state.current}/>
                  <div className="page-item comp-search" onClick={this.onSearch}>
                      <div className="icon-img icon-search util-v-m"></div>
                  </div>
          </span>
    }
});

module.exports = PageInput;