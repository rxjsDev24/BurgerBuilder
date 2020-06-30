import React from 'react';
import classes from './Layout.css';
import Aux from '../../hoc/Aux'

const Layout = (props) => (
    <Aux>
        <div >Toolbar,sidedrawer,backdrop</div>
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>

)

export default Layout;