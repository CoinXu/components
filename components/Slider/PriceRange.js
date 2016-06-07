/**
 * Created by xcp on 5/26/16.
 */

const React = require('react');
const Slider = require('./Slider');
const noop = function () {
};
const NUM_REG = /^\d+$/;

const PriceRange = React.createClass({

    getInitialState: function () {
        return {

            // 实际值
            leftValue: 0,
            rightValue: 100,

            // 是否处于输入状态
            leftTyping: false,
            rightTyping: false
        }
    },

    getDefaultProps: function () {
        return {
            step: 10,

            min: 0,
            max: 100,

            // props 的left与right为实际值
            leftValue: 0,
            rightValue: 100,

            leftStart: 0,
            leftEnd: 50,
            rightStart: 50,
            rightEnd: 100,

            precision: 0,
            disabled: false,
            title: 'Price',
            onChange: noop
        }
    },

    componentWillMount: function () {
        var props = this.props;
        this.setState({
            step: props.step,
            leftValue: props.leftValue,
            rightValue: props.rightValue
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return Object.keys(this.state).some(function (name) {
            return nextState[name] !== this.state[name];
        }, this);
    },

    onChange: function (leftPos, rightPos, leftValue, rightValue) {
        // 如果是从输入框直接输入的内容,则不再次设置
        if (!this._fromInput) {
            this.setState({
                leftValue: leftValue,
                rightValue: rightValue
            });
        }
        this._fromInput = !this._fromInput;
    },

    leftInputOnBlur: function (e) {
        this._fromInput = true;

        var props = this.props;
        var temp = props.min;
        if (NUM_REG.test(e.target.value)) {
            temp = parseInt(e.target.value)
        }

        var state = {leftTyping: false};

        if (temp >= props.leftStart && temp <= this.props.leftEnd) {
            state.leftValue = temp;
        }
        this.setState(state)
    },

    rightInputOnBlur: function (e) {
        this._fromInput = true;

        var props = this.props;
        var temp = props.max;

        if (NUM_REG.test(e.target.value)) {
            temp = parseInt(e.target.value)
        }

        var state = {rightTyping: false};

        if (temp <= props.rightEnd && temp >= props.rightStart) {
            state.rightValue = temp;
        }
        this.setState(state)
    },

    leftInputOnFocus: function () {
        this.setState({leftTyping: true})
    },

    rightInputOnFocus: function () {
        this.setState({rightTyping: true})
    },

    render: function () {
        var state = this.state;
        var props = this.props;

        return <div className="msg-condition ">
            <div className="condition-title">{props.title}</div>
            <div className="condition-padding msg-price">
                <div className="li">
                    <div className="price-left-view">
                        <span className="bifu">￥</span>
                        <input
                            className="input-date price"
                            onFocus={this.leftInputOnFocus}
                            onBlur={this.leftInputOnBlur}
                            onChange={noop}
                            value={state.leftTyping ? null : state.leftValue}/>
                    </div>
                    <div className="price-right-view">
                        <span className="bifu">￥</span>
                        <input
                            className="input-date price"
                            onFocus={this.rightInputOnFocus}
                            onBlur={this.rightInputOnBlur}
                            onChange={noop}
                            value={state.rightTyping ? null: state.rightValue}/>
                    </div>
                </div>
                <div>
                    <Slider
                        disabled={props.disabled}
                        min={props.min} max={props.max} step={state.step}
                        leftValue={state.leftValue}
                        rightValue={state.rightValue}
                        leftStart={props.leftStart} leftEnd={props.leftEnd}
                        rightStart={props.rightStart} rightEnd={props.rightEnd}
                        precision={props.precision}
                        onChange={this.onChange}/>
                </div>
                <div className="price-btn">
                    <div className="btn btn-info btn-xs">OK</div>
                </div>
            </div>
        </div>;
    }
});

module.exports = PriceRange;
