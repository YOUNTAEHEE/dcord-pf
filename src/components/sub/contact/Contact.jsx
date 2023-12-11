import { useEffect, useRef, useState } from 'react';
import Layout from '../../common/layout/Layout';
import './Contact.scss';

export default function Contact() {
	//get CDN Object
	const kakao = useRef(window.kakao);

	//states
	const [Index, setIndex] = useState(0);
	const [Traffic, setTraffic] = useState(false);
	const [View, setView] = useState(false);

	//refs
	const mapFrame = useRef(null);
	const viewFrame = useRef(null);
	const marker = useRef(null);
	const mapInstance = useRef(null);

	//branch info
	const mapInfo = useRef([
		{
			title: '삼성역 코엑스',
			latlng: new kakao.current.maps.LatLng(37.51100661425726, 127.06162026853143),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker1.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) },
		},
		{
			title: '넥슨 본사',
			latlng: new kakao.current.maps.LatLng(37.40211707077346, 127.10344953763003),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker2.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) },
		},
		{
			title: '서울 시청',
			latlng: new kakao.current.maps.LatLng(37.5662952, 126.9779451),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker3.png`,
			imgSize: new kakao.current.maps.Size(232, 99),
			imgPos: { offset: new kakao.current.maps.Point(116, 99) },
		},
	]);

	//marker instance
	marker.current = new kakao.current.maps.Marker({
		position: mapInfo.current[Index].latlng,
		image: new kakao.current.maps.MarkerImage(mapInfo.current[Index].imgSrc, mapInfo.current[Index].imgSize, mapInfo.current[Index].imgOpt),
	});

	//roadview instance
	const roadview = () => {
		new kakao.current.maps.RoadviewClient().getNearestPanoId(mapInfo.current[Index].latlng, 50, (panoId) => {
			new kakao.current.maps.Roadview(viewFrame.current).setPanoId(panoId, mapInfo.current[Index].latlng);
		});
	};

	//set map pos init
	const setCenter = () => {
		mapInstance.current.setCenter(mapInfo.current[Index].latlng);
		roadview();
	};

	//init Map Render with Index
	useEffect(() => {
		mapFrame.current.innerHTML = '';
		mapInstance.current = new kakao.current.maps.Map(mapFrame.current, { center: mapInfo.current[Index].latlng });
		marker.current.setMap(mapInstance.current);
		setTraffic(false);
		setView(false);
		roadview();

		mapInstance.current.addControl(new kakao.current.maps.MapTypeControl(), kakao.current.maps.ControlPosition.TOPRIGHT);
		mapInstance.current.addControl(new kakao.current.maps.ZoomControl(), kakao.current.maps.ControlPosition.RIGHT);
		mapInstance.current.setZoomable(false);

		window.addEventListener('resize', setCenter);
		return () => window.removeEventListener('resize', setCenter);
	}, [Index]);

	//toggle with Traffic
	useEffect(() => {
		Traffic
			? mapInstance.current.addOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC)
			: mapInstance.current.removeOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC);
	}, [Traffic]);

	return (
		<Layout title={'Contact'}>
			<div className='controlBox'>
				<nav className='branch'>
					{mapInfo.current.map((el, idx) => (
						<button key={idx} onClick={() => setIndex(idx)} className={idx === Index ? 'on' : ''}>
							{el.title}
						</button>
					))}
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
		</Layout>
	);
}
