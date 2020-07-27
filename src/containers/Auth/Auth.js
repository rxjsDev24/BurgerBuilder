import React, { Component } from 'react';
import classes from './Auth.css'
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility'

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Email Address',
                    type: 'email',
                    required: true
                },
                validation: {
                    isEmail: true
                },
                value: '',
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    required: true
                },
                value: '',
                validation: {
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onAuthRedirect();
        }
    }


    inputChangeHandler = (event, controlName) => {
        const updatedElement = updateObject(this.state.controls[controlName], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
            touched: true
        });

        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updatedElement
        });

        this.setState({ controls: updatedControls })
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)

    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isSignUp: !prevState.isSignUp }
        })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(element => {
            return <Input key={element.id}
                elementType={element.config.elementType}
                config={element.config.elementConfig}
                value={element.config.value}
                invalid={!element.config.valid}
                touched={element.config.touched}
                shouldValidate={element.config.validation}
                changed={(event) => this.inputChangeHandler(event, element.id)} />
        });

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p className={classes.Error}>{this.props.error.message}</p>;
        }

        let redirectAfterAuthenticate = null;
        if (this.props.isAuthenticated) {
            redirectAfterAuthenticate = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.Auth}>
                {redirectAfterAuthenticate}
                <form onSubmit={this.submitHandler} >
                    {form}
                    {errorMessage}
                    <Button btnType="Success">{this.state.isSignUp ? 'SIGN UP' : 'LOGIN'}</Button>
                </form>
                <Button
                    btnType="SignIn"
                    clicked={this.switchModeHandler}>
                    {this.state.isSignUp ? 'Already have an Account? Sign In' : 'Don\'t have an account! SIGN UP'}</Button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onAuthRedirect: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);