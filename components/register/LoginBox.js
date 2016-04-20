/**
 * Created by Freax on 2016/4/18.
 * @website http://www.myfreax.com
 */
module.exports = React.createClass({
    /**
     * 类型检查
     */
    propTypes: {
        loginButtonLanuge: React.PropTypes.string,
        method: React.PropTypes.string,
        register: React.PropTypes.object,
        user: React.PropTypes.object,
        password: React.PropTypes.object,
        forgetPassword: React.PropTypes.object
    },
    /**
     * 初始化状态
     * @returns {{showPasswordError: (*|boolean), showUserError: (*|boolean)}}
     */
    getInitialState: function () {
        return {
            showPasswordError: this.props.password.showPasswordError,
            showUserError: this.props.user.showUserError,
            userErrorMessage:this.props.user.errorMessage[0],
            passwdErrorMessage:this.props.password.errorMessage[0]
        }
    },
    /**
     * 处理登录
     */
    handleLogin: function () {
        this.state.showUserError = this.refs.user.value === '' ? true : false;
        this.state.showPasswordError = this.refs.password.value === '' ? true : false;
        if (!this.state.showUserError && !this.state.showPasswordError){
            this.refs.loginForm.submit();
            return;
        }
        this.setState(this.state);
    },
    /**
     * 当输入关闭错误
     * @param event
     */
    handleInputChange: function (event) {
        if (event.target.attributes.name.value.toString() === this.props.user.placeholder) {
            this.state.showUserError = false;
            this.setState(this.state);

        }

        if (event.target.attributes.name.value.toString() === this.props.password.placeholder) {
            this.state.showPasswordError = false;
            this.setState(this.state);

        }
    },
    render: function () {
        return (
            <form action={this.props.loginURL} method={this.props.method} ref='loginForm'>

                <div className="login-box">
                    <div className="login-module">
                        <strong>{this.props.user.label}</strong>
                        <input className="input-login" type="text" placeholder={this.props.user.placeholder}
                               ref={this.props.user.placeholder} onChange={this.handleInputChange}
                               name={this.props.user.placeholder}/>
                        <div className="primary-tips"
                             style={{display:this.state.showUserError?'block':'none'}}>{this.state.userErrorMessage}</div>
                    </div>

                    <div className="login-module">
                        <strong>{this.props.password.label}<a href={this.props.forgetPassword.forgetPasswordUrl}
                                                              className="a-link">{this.props.forgetPassword.language}</a></strong>
                        <input className="input-login" type="password" placeholder={this.props.password.placeholder}
                               ref={this.props.password.placeholder} onChange={this.handleInputChange}
                               name={this.props.password.placeholder}/>
                        <div className="primary-tips"
                             style={{display:this.state.showPasswordError?'block':'none'}}>{this.state.passwdErrorMessage}</div>
                    </div>


                    <div className="login-module btn-login">
                        <div className="btn btn-primary" onClick={this.handleLogin}>{this.props.loginButtonLanuge}</div>
                        <a href={this.props.register.registerUrl} className="a-link">{this.props.register.language}</a>
                    </div>
                </div>

            </form>
        )

    }
});
