import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    let inputClasses = [classes.InputElement]

    if (props.invalid && props.touched && props.shouldValidate) {
        inputClasses.push(classes.Invalid)
    }

    

    switch (props.elementType) {
        case ('input'):
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.config}
                value={props.value} onChange={props.changed} />;
            break;

        case ('select'):
            inputElement = (
                <select
                    className={classes.InputElement}
                    value={props.value} onChange={props.changed} >
                    {props.config.options.map(option => (
                        <option key={option.value} value={option.value} >
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.config}
                value={props.value} onChange={props.changed} />;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );

};

export default input;