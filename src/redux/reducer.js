import { combineReducers } from 'redux';

//순서1 - 리듀서함수 호출되면서 빈배열로 멤버 데이터가 저장될 state값 초기화
const memberReducer = (state = [], action) => {
	switch (action.type) {
		case 'SET_MEMBERS':
			return { ...state, members: action.payload };
		default:
			return state;
	}
};

const reducers = combineReducers({ memberReducer });
export default reducers;
