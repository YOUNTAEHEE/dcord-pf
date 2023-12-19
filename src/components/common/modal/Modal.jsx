import { useDispatch, useSelector } from 'react-redux';
import './Modal.scss';
//npm i framer-motion@4
import { AnimatePresence, motion } from 'framer-motion';
import * as types from '../../../redux/actionType';
/*
  AnimatePresence: 모션을 적용할 컴포넌트의 wrapping컴포넌트 지정
  - 자식요소의 모션이 끝날때까지 컴포넌트가 언마운트 되는 시점을 hoding처리
  motion: 모션을 걸고 싶은 JSX컴포넌트에 연결해서 initial, animate, exit라는 속성으로 모션수치값을 조절 가능
  -initial: 모션이 일어나기 전 상태값
  -animate: 모션이 일어날때의 상태값
  -eixt: 사라질떄의 상태값
*/

export default function Modal({ children }) {
	const dispatch = useDispatch();
	const Open = useSelector(store => store.modalReducer.modal);
	return (
		<AnimatePresence>
			{Open && (
				<motion.aside
					className='Modal'
					initial={{ opacity: 0, x: '-100%', scale: 0, rotate: -45 }}
					animate={{ opacity: 1, x: '0%', scale: 1, rotate: 0 }}
					exit={{ opacity: 0, y: '100%', scale: 2, rotate: 45, transition: { delay: 0.5 } }}
					transition={{ duration: 1 }}>
					<motion.div
						className='con'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { delay: 0 } }}
						transition={{ duration: 0.5, delay: 1 }}>
						{children}
					</motion.div>
					<span onClick={() => dispatch({ type: types.MODAL.start, payload: false })}>close</span>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
