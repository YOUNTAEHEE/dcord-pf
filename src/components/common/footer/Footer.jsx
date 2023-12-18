import './Footer.scss';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Footer() {
	//순서5 - 전역 store값을 useSelector바로 호출 가능
	const MemberData = useSelector(store => store.memberReducer.members);

	return (
		<footer className='Footer'>
			<h1>Dcodelab</h1>

			<p>2023 Dcodelab &copy; All Rights Reserved.</p>
			<p>
				{MemberData[0]?.position}:{MemberData[0]?.name}
			</p>

			<ul>
				<li>
					<FaFacebookF />
				</li>
				<li>
					<FaTwitter />
				</li>
				<li>
					<FaYoutube />
				</li>
			</ul>
		</footer>
	);
}
