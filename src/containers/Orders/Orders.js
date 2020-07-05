import React, { Component } from 'react';
import Order from '../../components/Order/Order'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: false
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get('/orders.json')
            .then(response => {
                this.setState({ loading: false });
                const fetchedOrders = []
                for (let key in response.data) {
                    fetchedOrders.push({
                        ...response.data[key],
                        id: key
                    })
                }
                this.setState({ orders: fetchedOrders });
            }).catch(error => {
                this.setState({ loading: false });
            })

    }

    render() {
        if (this.state.loading)
            return <Spinner />
        return (
            this.state.orders.map(order => (
                <Order key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            )
            )
        )
    }
}
export default withErrorHandler(Orders, axios);