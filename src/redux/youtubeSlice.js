import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//createAsyncThunk: 내부에 fetching함수를 넣어서 알아서 데이터상태에서 action객체 생성 함수
//createSlice: AscynThunk함수가 내보내주는 action객체를 자동으로 받아서 해당 액션의 타입 [pending, fullfiled, rejected]에 따라서 자동으로 전역데이터 변경해서 내보냄

//비동기 서버통신으로 데이터를 받아서 내부적으로 promise객체의 상태에 따라 자동 액션객체 생성후 반환
export const fetchYoutube = createAsyncThunk('youtube/requestYoutube', async () => {
	const api_key = process.env.REACT_APP_YOUTUBE_API;
	const pid = process.env.REACT_APP_YOUTUBE_LIST;
	const num = 10;
	const baseURL = `https://www.googleapis.com/youtube/v3/playlistItems?key=${api_key}&part=snippet&playlistId=${pid}&maxResults=${num}`;

	const data = await fetch(baseURL);
	const json = await data.json();
	return json.items;
});

//fetchYoutube가 반환하는 액션객체의 promise인스턴스 상태값에 따라 자동액션타입을 생성하고
//액션타입에 따른 전역데이터 변경을 자동 처리
const youtubeSlice = createSlice({
	name: 'youtube',
	initialState: {
		data: [],
		isLoading: false
	},
	extraReducers: {
		[fetchYoutube.pending]: state => {
			state.isLoading = true;
		},
		[fetchYoutube.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		},
		[fetchYoutube.rejected]: (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		}
	}
});

//youtubeSlice라는 리듀서가 변경한 전역데이터 객체를 내보냄
export default youtubeSlice.reducer;