import React, {Component} from 'react'
import {Button, Form, Message, Grid} from 'semantic-ui-react'
import InputComponent from 'components/common/InputComponent'
import {isRequired, maxSize, latin, noSpace, composition} from 'api/validate'

export default class LoginComponent extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        username: '',
        password: '',
        btn_loading: false,
        invalid: {},
        form: [
            {
                validate: composition([isRequired, maxSize(36), latin, noSpace]),
                value: '',
                placeholder: 'Email or Username',
                type: 'text',
                name: 'username',
                labelText: 'Your username'
            }, {
                validate: composition([isRequired, maxSize(36), noSpace]),
                value: '',
                placeholder: 'Password',
                type: 'password',
                name: 'password',
                labelText: 'Your password'
            }
        ]
    }

    static propTypes = {
        login: React.PropTypes.func,
        forgetPassword: React.PropTypes.func,
        register: React.PropTypes.func,
        componentState: React.PropTypes.object
    }

    invalidExists() {
        for (let key in this.state.invalid) {
            if (this.state.invalid[key]) {
                return true
            }
        }
        return false
    }

    async login(e) {
        e.preventDefault()
        let {login} = this.props
        let {username, password} = this.state
        let data = {username, password}
        // set loading state
        this.setState({
            btn_loading: true
        })
        // make request
        let result = await login(data)
        console.log(result)
        if (result.error) {
            //  reset loading state
            this.setState({
                btn_loading: false
            })
        }
    }

    getPrettyError() {
        // will be fired twice
        // first render - result of LOGIN_AUTH,
        // second - change btn_loading state

        // we must return formatted error from server,
        // but it's just a boilerplate
        return {
            header: 'Invalid credentials',
            content: 'Please, check your credentials'
        }
    }

    connectInputToParent (inputReceivedState) {
        let {state} = this // current state before receiving child state
        let {name, error, value} = inputReceivedState // receive child state
        state.invalid[name] = error // get child error
        state[name] = value // get child value
        this.setState(state) // update state
    }

    render() {
        let {btn_loading} = this.state
        let {componentState} = this.props

        // error from server
        let {loginError} = componentState

        // props for form
        let loginFormProps = {error: !!loginError}

        // login form error message
        let prettyLoginError = this.getPrettyError(loginError)

        // submit btn props
        let loginBtnProps = {
            disabled: this.invalidExists(),
            content: 'Login',
            icon: 'sign in',
            loading: btn_loading
        }


        let inputComponents = this.state.form.map((a, i) => {
            let inputName = a.name
            let error = loginError[inputName] ? loginError[inputName][0] : null

            let inputComponentProps = {
                ...a,
                error,
                key: i,
                connectToParent: ::this.connectInputToParent
            }
            return <InputComponent {...inputComponentProps}/>
        })

        return (
            <Grid verticalAlign='middle' centered columns={1}>
                <Grid.Column tablet={10} mobile={16} computer={6}>
                    <Form onSubmit={::this.login} {...loginFormProps}>
                        {prettyLoginError && <Message error header={prettyLoginError.header} content={prettyLoginError.content}/>}
                        {inputComponents}
                        <div className='form-actions'>
                            <Button {...loginBtnProps}/>
                        </div>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}
