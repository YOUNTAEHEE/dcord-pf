import { useState, useEffect } from 'react';

const useScript = (url, name) => {
	const [Lib, setLib] = useState(null);

	useEffect(() => {
		const script = document.createElement('script');
		script.async = true;
		script.src = url;
		script.onload = () => setLib({ [name]: window[name] });

		document.head.appendChild(script);
		return () => document.head.removeCHild(script);
	}, [url, name]);
	return Lib;
};

export default useScript;
