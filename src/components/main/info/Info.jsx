import { useCustomText } from '../../../hooks/useText';
import './Info.scss';
import postData from './dummyPosts.json';
import { useEffect, useState } from 'react';

export default function Info() {
	const changeText = useCustomText('combined');

	const getLocalData = () => {
		const data = localStorage.getItem('post');
		if (data) return JSON.parse(data);
		else return postData.dummyPosts;
	};
	const [Post] = useState(getLocalData());

	useEffect(() => {
		localStorage.setItem('post', JSON.stringify(Post));
	}, [Post]);

	return (
		<section className='Info'>
			<div className='showBox'>
				{Post.map((el, idx) => {
					const date = JSON.stringify(el.date);
					const strDate = changeText(date.split('T')[0].slice(1), '.');

					if (idx >= 4) return null;
					return (
						<article key={el + idx}>
							<div className='txt'>
								<h2>{el.title}</h2>
								<p>{el.content}</p>
								<span>{strDate}</span>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
