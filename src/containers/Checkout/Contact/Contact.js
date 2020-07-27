import React, { Component } from 'react';
import Input from '../../../components/UI/Input/Input'
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './Contact.css';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';


class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Your Name (Minimum 3 Characters)',
                    type: 'text',
                    required: true
                },
                validation: {
                    minLength: 3
                },
                value: '',
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Street',
                    type: 'text',
                    required: true
                },
                value: '',
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'ZipCode (Must be 6 digit)',
                    type: 'number',
                    required: true,
                },
                validation: {
                    minLength: 6,
                    maxLength: 6,
                    isNumeric: true
                },
                value: '',
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Country',
                    type: 'text',
                    required: true
                },
                value: '',
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    placeholder: 'Email Address',
                    type: 'email',
                    required: true
                },
                value: '',
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'standard', displayValue: 'Standard' },
                        { value: 'fastest', displayValue: 'Fastest' }
                    ],

                },
                value: 'standard',
                valid: true
            }
        },
        formIsValid: false,
    }

    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props)


        const formData = {}
        for (let formElementLabel in this.state.orderForm) {
            formData[formElementLabel] = this.state.orderForm[formElementLabel].value;
        }
        const order = {
            ingredients: this.props.ingrs,
            price: this.props.prc,
            orderData: formData,
            userId: this.props.userId

        }

        this.props.onBurgerOrder(order, this.props.token);
    }

    inputChangeHandler = (event, key) => {

        const updatedFormElement = updateObject(this.state.orderForm[key], {
            value: event.target.value,
            valid: this.state.orderForm[key].validation ?
                checkValidity(event.target.value, this.state.orderForm[key].validation) : true,
            touched: true
        })
        const updatedForm = updateObject(this.state.orderForm, {
            [key]: updatedFormElement
        });

        let formValidity = true;
        for (let formIdentifier in updatedForm) {
            formValidity = updatedForm[formIdentifier].valid && formValidity;
        }

        this.setState({ orderForm: updatedForm, formIsValid: formValidity })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        const inputElement = formElementsArray.map(element => {
            return <Input key={element.id}
                elementType={element.config.elementType}
                config={element.config.elementConfig}
                value={element.config.value}
                invalid={!element.config.valid}
                touched={element.config.touched}
                shouldValidate={element.config.validation}
                changed={(event) => this.inputChangeHandler(event, element.id)} />
        }
        )

        let form = (
            <form onSubmit={this.orderHandler} >
                {inputElement}
                <Button disabled={!this.state.formIsValid} btnType="Success">ORDER</Button>
            </form>
        );
        if (this.props.loading)
            form = (<Spinner />)

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingrs: state.burgerBuilder.ingredients,
        prc: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}
const mapDispatchToprops = dispatch => {
    return {
        onBurgerOrder: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}


export default connect(mapStateToProps, mapDispatchToprops)(withErrorHandler(ContactData, axios));