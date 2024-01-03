import './Visual.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useCustomText } from '../../../hooks/useText';

//Visual parent component
export default function Visual() {
	const { youtube } = useSelector(store => store.youtubeReducer);
	const shortenText = useCustomText('shorten');
	const swiperRef = useRef(null);

	const swiperOption = useRef({
		modules: [Pagination, Autoplay],
		pagination: {
			clickable: true,
			renderBullet: (index, className) => `<span class=${className}>${index + 1}</span>`
		},
		autoplay: { delay: 2000, disableOnInteraction: true },
		loop: true
	});

	return (
		<figure className='Visual'>
			<Swiper {...swiperOption.current}>
				{youtube.map((vid, idx) => {
					if (idx >= 5) return null;

					return (
						<SwiperSlide key={vid.id}>
							<div className='inner'>
								<div className='picBox'>
									<p>
										<img src={vid.snippet.thumbnails.standard.url} alt={vid.snippet.title} />
									</p>
									<p>
										<img src={vid.snippet.thumbnails.standard.url} alt={vid.snippet.title} />
									</p>
								</div>
								<div className='txtBox'>
									<h2>{shortenText(vid.snippet.title, 50)}</h2>

									<Link
										to={`/detail/${vid.id}`}
										onMouseEnter={swiperRef.current?.autoplay?.stop}
										onMouseLeave={swiperRef.current?.autoplay?.start}>
										<span></span>View Detail
									</Link>
								</div>
							</div>
						</SwiperSlide>
					);
				})}

				<Btns swiperRef={swiperRef} />
			</Swiper>
		</figure>
	);
}

//Swiper control child component
function Btns({ swiperRef }) {
	swiperRef.current = useSwiper();
	const [Rolling, setRolling] = useState(true);
	console.log(Rolling);

	const startRolling = () => {
		swiperRef.current.slideNext(300);
		swiperRef.current.autoplay.start();
		setRolling(true);
	};

	const stopRolling = () => {
		swiperRef.current.autoplay.stop();
		setRolling(false);
	};

	//Btns컴포넌트에서 인스턴스의 이벤트문을 활용해서
	useEffect(() => {
		//slide가 바뀔때마다 현재 롤링유무에 따라 Rolling state값 변경
		swiperRef.current.on('click', () => {
			swiperRef.current.autoplay.running ? setRolling(true) : setRolling(false);
		});
	}, [swiperRef]);

	return (
		<nav className='swiperController'>
			{/* Rolling state값에 따라서 버튼 활성화 처리 */}
			{Rolling ? (
				<button onClick={stopRolling}>stop</button>
			) : (
				<button onClick={startRolling}>start</button>
			)}
		</nav>
	);
}

//중요 정리 내용
//1.swiper 컴포넌트의 기본 사용법
//2.useSwiper라는 전용 hook을 이용해서 swiper 인스턴스를 생성하기 위해서는 Swiper안쪽에 자식 컴포넌트 호출뒤 해당 컴포넌트에 인스턴스 복사
//3.부모컴포넌트에서 자식 컴포넌트에서 생성된 인스턴스 객체를 활용하기 위해서 빈참조객체를 자식 컴포넌트에 전달해서 역으로 인스턴스를 자식 컴포넌트로부터 전달받음
//4.Swiper 컴포넌트 안쪽에 지저분한 props들은 컴포넌트 외부에 객체로 만들어서 전개연산자로 연결가능

//JSX를 커스텀해서 만드는 리액트 전용메서드
//React.createElement('태그명', {...props}, children)
//Reaact.createElement('p',{className:'abc'},'text') --> <p className='abc'>text</p>