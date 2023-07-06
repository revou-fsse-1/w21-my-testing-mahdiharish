import { combineReducers } from 'redux';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from './actions';

interface AuthState {
  token: string | null;
  error: string | null;
}

const initialAuthState: AuthState = {
  token: null,
  error: null,
};

const authReducer = (state = initialAuthState, action: any) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload,
        error: null,
      };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        token: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  auth: authReducer,
});
