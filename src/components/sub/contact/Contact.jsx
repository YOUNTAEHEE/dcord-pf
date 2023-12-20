import { useEffect, useRef, useState, useCallback } from 'react';
import Layout from '../../common/layout/Layout';
import './Contact.scss';
import emailjs from '@emailjs/browser';
import { useThrottle } from '../../../hooks/useThrottle';

export default function Contact() {
	const form = useRef();
	const resetForm = () => {
		const elArr = form.current.children;

		Array.from(elArr).forEach(el => {
			console.log(el);
			if (el.name === 'user_name' || el.name === 'user_email' || el.name === 'message') el.value = '';
		});
	};
	const sendEmail = e => {
		e.preventDefault();

		const [user, email] = form.current.querySelectorAll('input');
		const txtArea = form.current.querySelector('textarea');

		if (!user.value || !email.value || !txtArea.value) return alert('이름, 답장받을 이메일주소 문의내용을 모두 입력하세요.');

		emailjs.sendForm('service_ag7z96s', 'template_oh9ajns', form.current, '23g8RepczesqKPoIX').then(
			result => {
				alert('문의 내용이 성공적으로 전송되었습니다.');
				resetForm();
			},
			error => {
				alert('일시적인 장애로 문의 전송에 실패했습니다. 다음의 메일주소로 보내주세요.');
				resetForm();
			}
		);
	};

	const kakao = useRef(window.kakao);

	//화면에 출력될 지도정보 배열의 순번이 담길 state
	const [Index, setIndex] = useState(0);
	const [Traffic, setTraffic] = useState(false);
	const [View, setView] = useState(false);

	//참조객체
	const mapFrame = useRef(null);
	const viewFrame = useRef(null);
	const marker = useRef(null);
	const mapInstance = useRef(null);

	//지점마다 출력할 정보를 개별적인 객체로 묶어서 배열로 그룹화
	const mapInfo = useRef([
		{
			title: '삼성역 코엑스',
			latlng: new kakao.current.maps.LatLng(37.51100661425726, 127.06162026853143),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker1.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) }
		},
		{
			title: '넥슨 본사',
			latlng: new kakao.current.maps.LatLng(37.40211707077346, 127.10344953763003),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker2.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) }
		},
		{
			title: '서울 시청',
			latlng: new kakao.current.maps.LatLng(37.5662952, 126.9779451),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker3.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) }
		}
	]);

	//마커 인스턴스 생성
	marker.current = new kakao.current.maps.Marker({
		position: mapInfo.current[Index].latlng,
		image: new kakao.current.maps.MarkerImage(mapInfo.current[Index].imgSrc, mapInfo.current[Index].imgSize, mapInfo.current[Index].imgOpt)
	});

	//로드뷰 출력함수
	const roadview = useCallback(() => {
		new kakao.current.maps.RoadviewClient().getNearestPanoId(mapInfo.current[Index].latlng, 50, panoId => {
			new kakao.current.maps.Roadview(viewFrame.current).setPanoId(panoId, mapInfo.current[Index].latlng);
		});
	}, [Index]);

	//지도위치 가운데 보정 함수
	const setCenter = useCallback(() => {
		console.log('setCenter');
		mapInstance.current.setCenter(mapInfo.current[Index].latlng);
		//roadview.current();
	}, [Index]);

	//useThrottle로 cetCenter함수를 인수러 넣어서 thottling적용된 새로운 함수로 반환 (hof)
	const throttledSetCenter = useThrottle(setCenter);

	//Index값 변경시마다 지도정보 갱신해서 화면 재랜더링 useEffect
	useEffect(() => {
		//Index값이 변경되는 것은 출력할 맵정보가 변경된다는 의미이므로 기존 프레임 안쪽의 정보를 지워서 초기화
		mapFrame.current.innerHTML = '';
		viewFrame.current.innerHTML = '';
		mapInstance.current = new kakao.current.maps.Map(mapFrame.current, {
			center: mapInfo.current[Index].latlng,
			level: 3
		});
		marker.current.setMap(mapInstance.current);
		setTraffic(false);
		setView(false);

		mapInstance.current.addControl(new kakao.current.maps.MapTypeControl(), kakao.current.maps.ControlPosition.TOPRIGHT);
		mapInstance.current.addControl(new kakao.current.maps.ZoomControl(), kakao.current.maps.ControlPosition.RIGHT);
		mapInstance.current.setZoomable(false);

		//resize이벤트에 throttle적용된 함수를 등록 (이벤트자체는 1초에 60번 발생하지만 핸들러함수는 1초에 2번만 실행됨)
		window.addEventListener('resize', throttledSetCenter);
		return () => window.removeEventListener('resize', throttledSetCenter);
	}, [Index, throttledSetCenter]);

	//Traffic 토글시마다 화면 재랜더링 useEffect
	useEffect(() => {
		Traffic
			? mapInstance.current.addOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC)
			: mapInstance.current.removeOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC);
	}, [Traffic]);

	//View토글시마다 화면 재랜더링 useEffect
	useEffect(() => {
		//view토글시에 무조건 로드뷰정보를 호출하는 것이 아닌 viewFrame안의 내용이 없을때만 호출하고
		//값이 있을때에는 기존데이터를 재활용해서 불필요한 roadview중복호출을 막음으로서 고용량이 이미지 refetching을 방지
		View && viewFrame.current.children.length === 0 && roadview();
	}, [View, roadview]);

	return (
		<Layout title={'Contact'}>
			<div id='mailSection'>
				<form ref={form} onSubmit={sendEmail}>
					<label>Name</label>
					<input type='text' name='user_name' />
					<label>Email</label>
					<input type='email' name='user_email' />
					<label>Message</label>
					<textarea name='message' />
					<input type='submit' value='Send' />
				</form>
			</div>

			<div id='mapSection'>
				<div className='controlBox'>
					<nav className='branch'>
						{mapInfo.current.map((el, idx) =>
							//prettier-ignore
							<button key={idx} onClick={() => setIndex(idx)} className={idx === Index ? 'on' : ''}>{el.title}</button>
						)}
					</nav>

					<nav className='info'>
						<button onClick={() => setTraffic(!Traffic)}>{Traffic ? 'Traffic OFF' : 'Traffic ON'}</button>
						<button onClick={() => setView(!View)}>{View ? 'map' : 'road view'}</button>
						<button onClick={setCenter}>위치 초기화</button>
					</nav>
				</div>
				<section className='tab'>
					<article className={`mapBox ${View ? '' : 'on'}`} ref={mapFrame}></article>
					<article className={`viewBox ${View ? 'on' : ''}`} ref={viewFrame}></article>
				</section>
			</div>
		</Layout>
	);
}