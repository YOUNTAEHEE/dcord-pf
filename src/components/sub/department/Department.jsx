import { useEffect, useRef, useState } from 'react';
import Layout from '../../common/layout/Layout';
import './Department.scss';
import { useCustomText } from '../../../hooks/useText';

export default function Department() {
	const combinedTitle = useCustomText('combined');
	const path = useRef(process.env.PUBLIC_URL);
	const [MemberTit, setMemberTit] = useState('');
	const [MemberData, setMemberData] = useState([]);
	const [HistoryTit, setHistoryTit] = useState('');
	const [HistoryData, setHistoryData] = useState([]);

	const fetchDepartment = () => {
		fetch(`${path.current}/DB/department.json`)
			.then((data) => data.json())
			.then((json) => {
				setMemberTit(Object.keys(json)[0]);
				setMemberData(Object.values(json)[0]);
			});
	};

	const fetchHistory = () => {
		fetch(`${path.current}/DB/history.json`)
			.then((data) => data.json())
			.then((json) => {
				setHistoryTit(Object.keys(json)[0]);
				setHistoryData(Object.values(json)[0]);
			});
	};

	useEffect(() => {
		fetchDepartment();
		fetchHistory();
	}, []);

	return (
		<Layout title={'Department'}>
			<section className='historyBox'>
				<h2>{combinedTitle(HistoryTit)}</h2>
				<div className='con'>
					{/* 
						HistoryData 구조
						[
							{2016: [txt1, txt2,txt]}
							{2018: [txt1, txt2,txt]}
							{2020: [txt1, txt2,txt]}
						] 
					*/}
					{HistoryData.map((history, idx) => {
						console.log(history); // {2016: [txt1, txt2,txt]}
						console.log(Object.keys(history)[0]); // [2016] -> 0번째 배열값 뽑아서 문자열 '2016';
						console.log(Object.values(history)[0]); //[[txt1,txt2,txt3]] -> 0번째 배열값 뽑아서 [txt1,txt2,txt3]

						return (
							<article key={history + idx}>
								{/* 현재 반복돌고 있는 객체의 key값을 뽑아서 h3로 출력 :2016 */}
								<h3>{Object.keys(history)[0]}</h3>
								<ul>
									{/* 현재 반복돌고 있는 객체의 value을 뽑아서 li로 반복출력 [txt1, txt2, txt3]  */}
									{Object.values(history)[0].map((list, idx) => {
										return <li key={list + idx}>{list}</li>;
									})}
								</ul>
							</article>
						);
					})}
				</div>
			</section>

			<section className='memberBox'>
				<h2>{combinedTitle(MemberTit)}</h2>

				<div className='con'>
					{MemberData.map((member, idx) => {
						return (
							<article key={member + idx}>
								<div className='pic'>
									<img src={`${path.current}/img/${member.pic}`} alt={member.name} />
								</div>
								<h3>{member.name}</h3>
								<p>{member.position}</p>
							</article>
						);
					})}
				</div>
			</section>
		</Layout>
	);
}
