import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
/*
	actionType.js
	--문자열인 액션타입명을 재활용하기 편하게 객체형태로 미리 정의한 액션타입 모음집

	store.js
	-- 전역객체 생성, saga미들웨어 추가

	reducer.js
	-- 전역 데이터 변경함수 (기존 리듀서에 비해 pending, fullfiled, rejected에 대한 추가 분기작업)

	api.js
	-- fetching함수를 모아놓은 파일 (컴포넌트 외부에서 비동기데이터 호출함수를 한번에 관리하기 위함)

	saga.js
	-- 리듀서에 전달되는 초기 action타입을 캐치해서 saga자체적으로 데이터호출 및 비동기데이터 상태에따른 액션객체를 만들어서 리듀서에 재 전달


	redux vs redux-saga작업 흐름비교
	redux
	component (api호출 및 비동기 데이터 반환) 
	-> reducer (비동기 데이터 받아서 전역객체 생성) 
	-> store (전역객체 저장)

	redux-saga
	component (데이터요청 액션초기 타입만 전달) 
	-> reducer (초기요청을 받은뒤 saga에게 작업전달)
	-> saga (api호출 및 비동기 데이터 반환후 새로운 액션객체 생성후 리듀서전달)
	-> reducer (saga로부터 받은 액션객체를 통해서 전역객체 생성) 
	-> store (전역객체 저장)
*/