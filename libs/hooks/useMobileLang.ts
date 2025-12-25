import { useState, useEffect } from 'react';

export type MobileLang = 'en' | 'ko';

export const useMobileLang = (): MobileLang => {
	const [lang, setLang] = useState<MobileLang>('en');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const loadLang = () => {
				const savedLang = localStorage.getItem('mobileLang') as MobileLang | null;
				if (savedLang === 'en' || savedLang === 'ko') {
					setLang(savedLang);
				} else {
					setLang('en');
					localStorage.setItem('mobileLang', 'en');
				}
			};

			// Initial load
			loadLang();

			// Listen for storage changes (when language changes in another component)
			const handleStorageChange = () => {
				loadLang();
			};

			window.addEventListener('storage', handleStorageChange);
			// Also listen for custom event for same-tab updates
			window.addEventListener('mobileLangChanged', handleStorageChange);

			return () => {
				window.removeEventListener('storage', handleStorageChange);
				window.removeEventListener('mobileLangChanged', handleStorageChange);
			};
		}
	}, []);

	return lang;
};
