import { useEffect, useCallback, useRef } from 'react';
import './Menu.scss';
import { useGlobalData } from '../../../hooks/useGlobalData';

export default function Menu() {
	const { MenuOpen, setMenuOpen } = useGlobalData();
	const closeMenu = useCallback(() => {
		window.innerWidth >= 1000 && setMenuOpen(false);
	}, [setMenuOpen]);

	useEffect(() => {
		window.addEventListener('resize', closeMenu);
		return () => window.removeEventListener('resize', closeMenu);
	}, [closeMenu]);

	return (
		<>
			{MenuOpen && (
				<aside className='Menu' onClick={() => setMenuOpen(false)}>
					<h1>Mobile Menu</h1>
				</aside>
			)}
		</>
	);
}