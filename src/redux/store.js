import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {taskReducer, alarmReducer} from './reducers';

const rootReducer = combineReducers({ taskReducer, alarmReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));