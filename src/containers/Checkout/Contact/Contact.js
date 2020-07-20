import React, { Component } from 'react';
import Input from '../../../components/UI/Input/Input'
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './Contact.css';
import axios from '../../../axios-orders';
import { connect } from 'react-redux'


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
                    maxLength: 6
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
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props)
        this.setState({ loading: true });

        const formData = {}
        for (let formElementLabel in this.state.orderForm) {
            formData[formElementLabel] = this.state.orderForm[formElementLabel].value;
        }
        const order = {
            ingredients: this.props.ingrs,
            price: this.props.prc,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false });
            });

    }

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangeHandler = (event, key) => {
        const updatedForm = { ...this.state.orderForm };
        /*
           ->this doesnt copy all the elements deeply
            
           updatedForm[key].value = event.target.value;
            console.log(updatedForm);
            this.setState({ orderForm: updatedForm })
        */

        const updatedFormElement = { ...updatedForm[key] }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = updatedFormElement.validation ? this.checkValidity(updatedFormElement.value, updatedFormElement.validation) : true;
        updatedFormElement.touched = true;
        updatedForm[key] = updatedFormElement;

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
        if (this.state.loading)
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
        ingrs: state.ingredients,
        prc: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);