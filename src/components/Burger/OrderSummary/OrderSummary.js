import React from 'react';
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI//Button/Button'

const OrderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {props.ingredients[igKey]}
                </li>);
        });

    return (
        <Aux>
            <h3>Order Summary</h3>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Amount to be Paid: {props.price}</strong></p>
            <p>Continue to Checkout?</p>
            <Button btnType="Danger" clicked={props.purchaseCanceled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>

        </Aux>
    )
}

export default OrderSummary;