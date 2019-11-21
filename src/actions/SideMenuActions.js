import { MOVE_MENU } from './types';
import { Actions } from 'react-native-router-flux';

export const menuTo = (oClass) => {
    return (dispatch) => {
    dispatch ({
        type: MOVE_MENU,
        payload: oClass
    })
    Actions.drawer();
    }
};
