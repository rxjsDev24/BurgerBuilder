import * as actionTypes from './actionTypes'
import axios from 'axios'
import { apiKey } from '../../config'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkoutAuthTime = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey;
        if (!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey;
        }
        axios.post(url, authData)
            .then(response => {
                const date = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', date);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkoutAuthTime(response.data.expiresIn));
                console.log(response.data.expiresIn)
            })
            .catch(err => {

                dispatch(authFail(err.response.data.error));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}
export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                dispatch(authSuccess(token, localStorage.getItem('userId')));
                dispatch(checkoutAuthTime((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logout())
            }
        }
    }
}