import { useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-component';
import Layout from '../../common/layout/Layout';
import './Gallery.scss';
import { LuSearch } from 'react-icons/lu';
import Modal from '../../common/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { modalOpen } from '../../../redux/modalSlice';
import { fetchFlickr } from '../../../redux/flickrSlice';

export default function Gallery() {
	const dispatch = useDispatch();
	const Pics = useSelector(store => store.flickr.data);
	const myID = useRef('197119297@N02');
	const isUser = useRef(myID.current);
	const refNav = useRef(null);
	const refFrameWrap = useRef(null);
	const searched = useRef(false);
	const gap = useRef(20);

	const [Open, setOpen] = useState(false);
	const [Index, setIndex] = useState(0);

	const activateBtn = e => {
		const btns = refNav.current.querySelectorAll('button');
		btns.forEach(btn => btn.classList.remove('on'));
		e && e.target.classList.add('on');
	};
	const handleInterest = e => {
		if (e.target.classList.contains('on')) return;
		isUser.current = '';
		activateBtn(e);
		dispatch(fetchFlickr({ type: 'interest' }));
	};
	const handleMine = e => {
		if (e.target.classList.contains('on') || isUser.current === myID.current) return;
		isUser.current = myID.current;
		activateBtn(e);
		dispatch(fetchFlickr({ type: 'user', id: myID.current }));
	};
	const handleUser = e => {
		if (isUser.current) return;
		isUser.current = e.target.innerText;
		activateBtn();
		dispatch(fetchFlickr({ type: 'user', id: e.target.innerText }));
	};
	const handleSearch = e => {
		e.preventDefault();
		isUser.current = '';
		activateBtn();
		const keyword = e.target.children[0].value;
		if (!keyword.trim()) return;
		e.target.children[0].value = '';
		dispatch(fetchFlickr({ type: 'search', keyword: keyword }));
		searched.current = true;
	};

	useEffect(() => {
		refFrameWrap.current.style.setProperty('--gap', gap.current + 'px');
	}, []);

	return (
		<>
			<Layout title={'Gallery'}>
				<article className='controls'>
					<nav className='btnSet' ref={refNav}>
						<button onClick={handleInterest}>Interest Gallery</button>
						<button className='on' onClick={handleMine}>
							My Gallery
						</button>
					</nav>

					<form onSubmit={handleSearch}>
						<input type='text' placeholder='Search' />

						<button className='btnSearch'>
							<LuSearch />
						</button>
					</form>
				</article>

				<section className='frameWrap' ref={refFrameWrap}>
					<Masonry className={'frame'} options={{ transitionDuration: '0.5s', gutter: gap.current }}>
						{searched.current && Pics.length === 0 ? (
							<h2>해당 키워드에 대한 검색 결과가 없습니다.</h2>
						) : (
							Pics.map((pic, idx) => {
								return (
									<article key={pic.id}>
										<div
											className='pic'
											onClick={() => {
												dispatch(modalOpen());
												setIndex(idx);
											}}>
											<img src={`https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_m.jpg`} alt={pic.title} />
										</div>
										<h2>{pic.title}</h2>

										<div className='profile'>
											<img
												src={`http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg`}
												alt='사용자 프로필 이미지'
												onError={e => e.target.setAttribute('src', 'https://www.flickr.com/images/buddyicon.gif')}
											/>
											<span onClick={handleUser}>{pic.owner}</span>
										</div>
									</article>
								);
							})
						)}
					</Masonry>
				</section>
			</Layout>

			<Modal Open={Open} setOpen={setOpen}>
				{Pics.length !== 0 && (
					<img src={`https://live.staticflickr.com/${Pics[Index].server}/${Pics[Index].id}_${Pics[Index].secret}_b.jpg`} alt={Pics[Index].title} />
				)}
			</Modal>
		</>
	);
}

/*
	순서1.일반 동적 데이터를 제외한 일반 정적인 컨텐츠가 렌더링됨 (참조객체에 20 상수값을 미리 담아놓음)
	순서2.정적인 JSX가 요소 일단은 브라우저에 렌더링완료되었기 때문에 useEffect실행가능해짐
	순서3.useEffect안쪽에서 미리 참조객체에 연결해놓은 refFrameWrap에 접근 가능 (이때 refFrameWrap에 --gap변수에 20이라는 값을 강제 적용 이때부터는 sass파일에 --gap이란 변수가 없더라도 리액트에서 동적으로 gap이라는 변수값을 넣었기 때문에 활용가능)
	순서4-리액트에 동적으로 변수값을 적용해서 돔을생성하고 나면 그 이후 scss가 해당 변수값을 읽어서 화면 스타일링


	순서1-처음에 gap이라는 참조객체값을 해석
	순서2-2번째 렌더링타임에 useEffect가 실행되면서 참조객체에 담겨있는 section요소에 강제로 gap변수값을 적용
	순서3-3번째 렌더링 타임에 fecthing데이터에 의한 동적 요소가 출력되면서 그때 비로서 변수값이 적용된 sass styling 적용 (paint)
*/