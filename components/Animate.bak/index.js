"use strict";

var React = require('react');
var AnimateMixin = require('./AnimateMixin');
var assert = require('../../com/assert');

var Animate = React.createClass({

    mixins: [AnimateMixin],

    render: function () {
        var self = this;
        var props = self.props;
        var children = props.children;
        var Components = props.component;
        var ret = props.getContent(props, this.state, self);

        if (ret === undefined) {
            children = children && children.constructor === Array ?
                children :
                [children];

            assert(children.length, "children is required");

            children = React.Children.map(children, function (child) {
                return React.cloneElement(child, {parent: self});
            });

            ret = <Components
                className={props.className}
                style={this.styleProps()}>
                {children}
            </Components>
        }

        return ret
    }

});

module.exports = Animate;