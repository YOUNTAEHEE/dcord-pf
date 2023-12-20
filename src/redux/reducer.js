import { combineReducers } from 'redux';
import * as types from './action';

const memberReducer = (state = { members: [] }, action) => {
	switch (action.type) {
		case types.MEMBER.success:
			return { ...state, members: action.payload };
		default:
			return state;
	}
};

const historyReducer = (state = { history: [] }, action) => {
	switch (action.type) {
		case types.HISTORY.success:
			return { ...state, history: action.payload };
		default:
			return state;
	}
};

const youtubeReducer = (state = { youtube: [] }, action) => {
	switch (action.type) {
		case types.YOUTUBE.success:
			return { ...state, youtube: action.payload };
		case types.YOUTUBE.fail:
			return { ...state, youtube: action.payload };
		default:
			return state;
	}
};

const modalReducer = (state = { modal: false }, action) => {
	switch (action.type) {
		case types.MODAL.start:
			return { ...state, modal: action.payload };

		default:
			return state;
	}
};
const menuReducer = (state = { menu: false }, action) => {
	switch (action.type) {
		case types.MENU.start:
			return { ...state, menu: action.payload };
		default:
			return state;
	}
};
const reducers = combineReducers({ memberReducer, historyReducer, youtubeReducer, modalReducer, menuReducer });
export default reducers;
