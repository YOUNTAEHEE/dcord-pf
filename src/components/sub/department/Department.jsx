import { useEffect, useState } from 'react';
import Layout from '../../common/layout/Layout';
import './Department.scss';

export default function Department() {
	const [MemberTit, setMemberTit] = useState('');

	const [MemberData, setMemberData] = useState([]);
	const path = process.env.PUBLIC_URL; //public폴더까지의 경로를 구하는 구문

	const fetchDepartment = () => {
		fetch(`${path}/DB/department.json`)
			.then((data) => data.json())
			.then((json) => {
				//console.log(json);
				//console.log('key', Object.keys(json)[0]); //객체를 반복돌며 key값만 배열로 반환
				//console.log('value', Object.values(json)[0]); //객체를 반복돌며 value값만 배열로 반환
				setMemberTit(Object.keys(json)[0]);
				setMemberData(Object.values(json)[0]);
			});
	};

	useEffect(() => {
		fetchDepartment();
	}, []);

	return (
		<Layout title={'Deparment'}>
			<section className='memberBox'>
				<h2>{MemberTit}</h2>
				{MemberData.map((member, idx) => {
					return (
						<article key={member + idx}>
							<div className='pic'>
								<img src={`${path}/img/${member.pic}`} alt={member.name} />
							</div>
							<h2>{member.name}</h2>
							<p>{member.position}</p>
						</article>
					);
				})}
			</section>
		</Layout>
	);
}

/*
	React에서 외부데이터를 가져와서 화면에 동적으로 출력하는 순서
	1. 외부 가져와서 담을 빈 State추가 (보통 빈배열로 초기화)
	2. fetch문을 이용해서 특정 URL의 데이터를 가져온뒤 동기적으로 배열로 뽑은 뒤 state에 담아주는 함수 정의
	3. 위에서 만든 함수를 의존성 배열이 비어있는 useEffect문 안쪽에서 호출 
	4. State에 담겨있는 Data 배열값을 map으로 반복돌면서 JSX구문 생성

	객체의 property에서 key, value값 반복도는 방법
	const student = {name: 'David', age:20}
	//key반복 돌면서 배열반환
	Object.keys(student); ['name','age'];
	Object.values(student); ['David',20];
*/
