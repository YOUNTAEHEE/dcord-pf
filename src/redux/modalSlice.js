import { createSlice } from '@reduxjs/toolkit';

//서버사이드 데이터를 관리하지 않기 때문에 createAsyncThunk함수 불필요
const modalSlice = createSlice({
	name: 'modal',
	initialState: { open: false },
	//extraReducers: [pending, fulfilled, rejected] 상태관리를 리듀서
	reducers: {
		modalOpen: state => {
			state.open = true;
		},
		modalClose: state => {
			state.open = false;
		}
	}
});

//slice함수 호출시 modalSlice라는 객체반환
//const {reducer: 변경된 전역객체, actions: reducer에 등록된 action객체 생성함수} = createSlice()

//아래 action객체 생성함수는 추후 컴포넌트에서 호출해서 반환된 action객체를 dispatch로 전달
export const { modalOpen, modalClose } = modalSlice.actions;

//아래 reducer객체는 index에서 store에 담김
export default modalSlice.reducer;