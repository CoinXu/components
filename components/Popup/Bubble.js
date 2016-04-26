/**
 * Created by xcp on 2016/3/15.
 */

var React = require('react');
var noop = require('../../com/noop');
var Bubble = React.createClass({

    propTypes: {
        symBolClass: React.PropTypes.array
    },

    getDefaultProps: function () {
        return {
            placement: 'top',
            symbolStyle: {},
            symbolClass: [],
            onComponentMount: noop,
            style: {}
        }
    },

    getClassName: function () {
        var dir = {
                top: 'd',
                right: 'l',
                bottom: 't',
                left: 'r'
            }[this.props.placement] || 'd';

        return {
            wrapperClass: 'bub bub-dir-' + dir,
            symbolClass: 'bub-symbol icon-img icon-arrow-blue-' + dir
        }
    },

    componentDidMount: function () {
        this.props.onComponentMount(this.refs.wrap, this);
    },

    render: function () {

        var classNames = this.getClassName();
        var symbolClassName = this.props.symbolClass.length > 0 ?
            (' ' + this.props.symbolClass.join(' ')) :
            '';

        return (<div className={classNames.wrapperClass} style={this.props.style}>
            <span className={classNames.symbolClass + symbolClassName}
                  style={this.props.symbolStyle}/>
            <div className="bub-con" ref="wrap">
                {this.props.children}
            </div>
        </div>)
    }
});

module.exports = Bubble;