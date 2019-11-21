import { MOVE_MENU } from '../actions/types';

const INITIAL_STATE = { 
    oClass: null
 };

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case MOVE_MENU:
            return { ...state, oClass: action.payload }
        default:
            return state;
    }
}
