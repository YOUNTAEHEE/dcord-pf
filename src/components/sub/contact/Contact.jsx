import { useEffect, useRef, useState } from 'react';
import Layout from '../../common/layout/Layout';
import './Contact.scss';

export default function Contact() {
	console.log('contact');
	//get CDN Object
	const kakao = useRef(window.kakao);

	//states
	const [Info, setInfo] = useState([]);
	const [Index, setIndex] = useState(0);
	const [Traffic, setTraffic] = useState(false);
	const [View, setView] = useState(false);

	//refs
	const mapFrame = useRef(null);
	const viewFrame = useRef(null);
	const map = useRef(null);
	const marker = useRef(null);

	//get fetch data func
	const getData = async () => {
		const data = await fetch(process.env.PUBLIC_URL + '/DB/mapInfo.json');
		const json = await data.json();

		setInfo(
			json.mapInfo.map(el => ({
				title: el.title,
				latlng: new kakao.current.maps.LatLng(...el.latlng),
				imgSrc: `${process.env.PUBLIC_URL}/img/${el.imgSrc}`,
				imgSize: new kakao.current.maps.Size(...el.imgSize),
				imgPos: { offset: new kakao.current.maps.Point(...el.imgPos) }
			}))
		);
	};

	//create mapInstance func
	const createMap = () => {
		//set ref, map, marker
		map.current = new kakao.current.maps.Map(mapFrame.current, { center: Info[Index].latlng });
		marker.current = new kakao.current.maps.Marker({
			position: Info[Index].latlng,
			image: new kakao.current.maps.MarkerImage(Info[Index].imgSrc, Info[Index].imgSize, Info[Index].imgPos)
		});
		marker.current.setMap(map.current);

		//add controller
		map.current.addControl(new kakao.current.maps.MapTypeControl(), kakao.current.maps.ControlPosition.TOPRIGHT);
		map.current.addControl(new kakao.current.maps.ZoomControl(), kakao.current.maps.ControlPosition.RIGHT);
		map.current.setZoomable(false);

		//window event
		window.addEventListener('resize', setCenter);
		return () => window.removeEventListener('resize', setCenter);
	};

	//get roadview func
	const roadview = () => {
		new kakao.current.maps.RoadviewClient().getNearestPanoId(Info[Index].latlng, 50, panoId => {
			new kakao.current.maps.Roadview(viewFrame.current).setPanoId(panoId, Info[Index].latlng);
		});
	};

	//init map pos func
	const setCenter = () => {
		map.current.setCenter(Info[Index].latlng);
		roadview();
	};

	//fetch data once
	useEffect(() => getData(), []);

	//init render with fetched data
	useEffect(() => Info[Index] && createMap(), [Info]);

	//re-render with Index
	useEffect(() => {
		if (!Info[Index]) return;
		mapFrame.current.innerHTML = '';
		createMap();
		setTraffic(false);
		setView(false);
		roadview();
	}, [Index]);

	//re-render with Traffic
	useEffect(() => {
		Traffic
			? map.current?.addOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC)
			: map.current?.removeOverlayMapTypeId(kakao.current.maps.MapTypeId.TRAFFIC);
	}, [Traffic]);

	return (
		<Layout title={'Contact'}>
			<div className='controlBox'>
				<nav className='branch'>
					{Info.map((el, idx) =>
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
		</Layout>
	);
}
