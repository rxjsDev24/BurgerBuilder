import React from 'react';
import classes from './Order.css'

const order = (props) => {
    const ingredientsDetail = [];
    for (let ingredients in props.ingredients) {
        ingredientsDetail.push({
            name: ingredients,
            amount: props.ingredients[ingredients]
        })
    }

    const showIngredients = (
        ingredientsDetail.map(igkey => {
            return <span key={igkey.name}
                style={{
                    textTransform: 'capitalize',
                    display: 'inline-block',
                    boxShadow: '0 2px 3px #8F5C2C',
                    margin: '0 5px',
                    padding: '5px',
                    border: '1px solid #fff'
                }}>{igkey.name} ({igkey.amount})</span>
        })
    )

    return (
        <div className={classes.Order}>
            <p>Ingredients: {showIngredients}</p>
            <p>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    )
}
export default order;