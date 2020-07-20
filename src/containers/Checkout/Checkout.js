import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom'
import Contact from './Contact/Contact'
import { connect } from 'react-redux'

class Checkout extends Component {
    state = {
        ingredients: {
        },
        price: null
    }
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = null;
        // for (let param of query.entries()) {
        //     // ['salad', '1']
        //     ingredients[param[0]] = +param[1];
        // }
        for (let [key, value] of query.entries()) {
            // ['salad', '1']
            if (key === 'price') {
                price = +value;
            }
            else {
                ingredients[key] = +value;      //this plus is to change the string into integer
            }

        }
        this.setState({ ingredients: ingredients, price: price });
    }
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.props.ingrs}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
                <Route path={this.props.match.url + '/contact-data'}
                    component={Contact} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingrs: state.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);