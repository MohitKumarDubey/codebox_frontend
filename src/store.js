// store.js
import { createStore } from 'redux';

const initialState = { fileData: {content:'', path:null} };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILE_DATA':
            return { ...state, fileData: action.payload };
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;
