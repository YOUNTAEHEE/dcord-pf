import './Visual.scss';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';

export default function Visual() {
	const Vids = useSelector(store => store.youtube.data);

	const swiperOpt = useRef({
		modules: [Autoplay],
		autoplay: { delay: 2000, disableOnInteraction: true },
		loop: true,
		slidesPerView: 1,
		centeredSlides: true,
		breakpoints: {
			1000: { slidesPerView: 3 }
		},
		onSwiper: swiper => {
			swiper.slideNext(300);
		}
	});

	return (
		<figure className='Visual'>
			<Swiper {...swiperOpt.current}>
				{Vids.map((data, idx) => {
					if (idx >= 5) return null;
					return (
						<SwiperSlide key={data.id}>
							<div className='inner'>
								<div className='picBox'>
									<p>
										<img src={data.snippet.thumbnails.standard.url} alt={data.snippet.title} />
									</p>
									<p>
										<img src={data.snippet.thumbnails.standard.url} alt={data.snippet.title} />
									</p>
								</div>
								<div className='txtBox'>
									<h2>{data.snippet.title}</h2>
								</div>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</figure>
	);
}

/*
	Swiper의 props를 통해서 UI 구조가 변경되면 해당 내용은 스크립트를 통해서 동적제어 되고 있기 때문에
	일반 css로 반응형 처리 불가
	- breakpoints를 이용해서 브라우저 폭에 따라서 swiper의 option값 변경 
	- 초기값으로 모바일 버전 옵션설정하고 breakpoinst로 브라우저가 늘어나는 구간마다 옵션값 변경
*/