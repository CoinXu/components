/**
 * Created by Freax on 2016/4/13.
 * @website http://www.myfreax.com
 */

const React = require('react'),
    SelectList = require('./SelectList'),
    SelectTips = require('./SelectTips'),
    classNames = require('classnames');

module.exports = React.createClass({

    propTypes: {
        spread: React.PropTypes.bool,
        selectList: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        isPlaceholderStyle: React.PropTypes.bool,
        formId: React.PropTypes.string,
        tips: React.PropTypes.string,
        classname: React.PropTypes.object
    },

    /**
     * 设置初始化状态
     * @returns {{spread: *, spreadListState: boolean, item: *, isPlaceholderStyle: boolean, isError: boolean}}
     */
    getInitialState: function () {
        var spread = this.props.spread || false;
        var isPlaceholderStyle = this.props.isPlaceholderStyle || true;
        return this.state = {
            spread: spread,  //是否展开列表
            spreadListState: false,      //记录列表是否展开状态
            item: this.props.placeholder, //选中值，默认是占位符的值
            isPlaceholderStyle: isPlaceholderStyle, //是否淡化占位符的样式
            isError: false  //是否展示错误
        };
    },
    /**
     * 组件挂载
     */
    componentDidMount: function () {
        //是否验证 需要分离

        if (typeof  this.props.formId === 'string') {
            document.getElementById(this.props.formId).addEventListener('submit', this.validate, false);
        }

        //绑定点击事件  //需要分离
        document.body.addEventListener('click', this.closeSelectList, false); //存在兼容性问题
    },
    /**
     * 组件将要挂载
     */
    componentWillUnmount: function () {
        document.body.removeEventListener('click', this.closeSelectList, false);    //存在兼容性问题
    },
    /**
     * 是否验证组件
     */
    validate: function () {
        if (this.state.item === this.props.placeholder) {
            this.setState({isError: true});
        }
    },
    /**
     * 关闭select的option列表
     * @param event
     */
    closeSelectList: function (event) {
        if (event.target.nodeName === 'BODY') {
            this.setState({spread: false, spreadListState: false});
        }
    },
    /**
     * 处理点击select时option的状态
     */
    handleIsSelectList: function () {
        this.state.spreadListState ? this.setState({spread: false}) : this.setState({spread: true});
        this.state.spreadListState = this.state.spreadListState ? false : true;
    },
    /**
     * 根据条件是否展示option列表
     * @returns {*}
     */
    isShowSelectList: function () {
        return <SelectList show={this.state.spread} items={this.props.selectList} click={this.handleSelectRow}/>
    },
    /**
     * 设置选择option到select
     * @param event
     */
    handleSelectRow: function (event) {
        this.setState({item: event.target.innerText, isPlaceholderStyle: false, isError: false});
        this.refs.field.value = event.target.innerText;
    },
    /**
     * 根据条件是否展示提示
     * @returns {XML}
     */
    showTips: function () {
        return <SelectTips isShow={this.state.isError} message={this.props.tips}/>
    },
    render: function () {
        /**
         * 设置 class
         */
        var placeholder = classNames({
            'select-view': true,
            'placeholder': this.state.isPlaceholderStyle,
            'myReact': true
        });
        var error = classNames({
            'height-in-sl': true,
            box: true,
            'w-266': true
        });

        return (

            <div className='dropListBox'
                 style={{border: this.state.isError? '1px solid #e4393c': 'none',borderRadius:this.state.isError? '3px' :'none'}}
                 onClick={this.handleIsSelectList}>
                <div className={this.props.classnames} style={{background: this.state.isError? '#fee5e5' : '#fff' }}>
                    <div className={placeholder}>
                        <span style={{color:this.state.isPlaceholderStyle?'#aaaaaa':'black'}}>{this.state.item}</span>

                        <input type="text" name={this.props.fieldName}  hidden="hidden" ref="field"/>

                        <div className="icon-img icon-tran-black-d"></div>
                    </div>
                    {this.isShowSelectList()}
                </div>
                {this.showTips()}
            </div>
        );
    }
});
