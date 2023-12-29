import { useRef, useState } from 'react';
import './CookieModal.scss';
import { useCookie } from '../../../hooks/useCookie';

export default function CookieModal({ wid, ht, children }) {
	//커스텀 훅으로부터 쿠키확인, 쿠키생성함수 가져옴
	const { isCookie, setCookie } = useCookie();
	//체크박스요소를 담을 참조객체 생성
	const checkEl = useRef(null);
	//Close의 초기값으로 isCookie의 리턴값 담음 Close(true:쿠키잆음,팝업안보임) Close(false:쿠키없음,팝업보임)
	const [Close, setClose] = useState(isCookie('today=done'));

	//닫기 버튼 클릭시 실행될 함수
	const handleClose = () => {
		const isChecked = checkEl.current.checked;
		//함수호출시 체크가되어 있으면 쿠키생성
		if (isChecked) setCookie('today', 'done', 20);
		//미체크시 쿠키생성무시하고 그냥 팝업만 닫기
		setClose(true);
	};

	return (
		<>
			{/* Close값이 false 이면 팝업보임처리 */}
			{!Close && (
				<aside className='CookieModal' style={{ width: wid, height: ht, marginLeft: -wid / 2, marginTop: -ht / 2 }}>
					<div className='content'>{children}</div>

					<div className='controls'>
						<nav>
							<input ref={checkEl} type='checkbox' />
							<span>오늘하루 팝업보지 않기</span>
						</nav>

						<span onClick={handleClose}>close</span>
					</div>
				</aside>
			)}
		</>
	);
}

/*
  작업흐름
  1.해당 컴포넌트에 특정 state값에 따라 보이고 안보이고 처리
  2.닫기 이벤트 발생시 팝업 안보이도록 state값 변경처리
  3.체크박스 체크한뒤 닫기 버튼 클릭시 특정 쿠키 생성
  4.해당 컴포넌트 마운트시 특정 쿠키값 있으면 무조건 안보이게
*/