//useThrottle.js
//debounce vs throttle
//debounce : 이벤트 발생하는 간격시간을 비교해서 일정시간 간격안에 이벤트가 발생중이면 함수호출을 무기한 연기
//throttle : 물리적으로 반복횟수자체를 줄임
//debouce 적용 대표 사례 : 특정 인풋요소 입력을 끝날때까지 fetching함수 호출 자체를 계속 미룰때
//thottle 적용 대표 사례 : window event(scroll, resize) 발생시마다 불필요하게 많이 호출되는 함수의 호출횟수를 줄일떄
import { useRef } from 'react';

export const useThrottle = (func, gap = 500) => {
	const eventBlocker = useRef(null);

	return () => {
		if (eventBlocker.current) return;
		eventBlocker.current = setTimeout(() => {
			func();
			eventBlocker.current = null;
		}, gap);
	};
};