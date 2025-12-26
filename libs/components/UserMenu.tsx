import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { logOut } from '../auth';
import { REACT_APP_API_URL } from '../config';
import { useTranslation } from 'next-i18next';

const UserMenu = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [menuOpen, setMenuOpen] = useState(false);
	const [langMenuOpen, setLangMenuOpen] = useState(false);
	const [currentLang, setCurrentLang] = useState<string>('en');
	const menuRef = useRef<HTMLDivElement>(null);

	// Initialize language from localStorage
	useEffect(() => {
		const savedLang = localStorage.getItem('locale');
		if (savedLang) {
			setCurrentLang(savedLang);
		}
	}, []);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};

		if (menuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [menuOpen]);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
		setLangMenuOpen(false);
	};

	const closeMenu = () => {
		setMenuOpen(false);
		setLangMenuOpen(false);
	};

	const toggleLangMenu = () => {
		setLangMenuOpen(!langMenuOpen);
	};

	const handleLangChange = useCallback(
		async (langCode: string) => {
			setCurrentLang(langCode);
			localStorage.setItem('locale', langCode);
			closeMenu();
			await router.push(router.asPath, router.asPath, { locale: langCode });
		},
		[router],
	);

	const getLangDisplay = (code: string) => {
		switch (code) {
			case 'en':
				return 'English';
			case 'kr':
				return '한국어';
			case 'ru':
				return 'Русский';
			default:
				return 'English';
		}
	};

	const handleLogout = () => {
		closeMenu();
		logOut();
	};

	const handleAvatarClick = () => {
		if (user?._id) {
			router.push('/mypage');
		}
	};

	return (
		<div className="user-menu-container" ref={menuRef}>
			{/* Avatar - Clickable to Profile */}
			<div className="avatar-wrapper" onClick={handleAvatarClick}>
				{user?._id ? (
					<img
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt="User avatar"
						className="user-avatar"
					/>
				) : (
					<Link href="/account/join">
						<div className="default-avatar">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</Link>
				)}
			</div>

			{/* Hamburger Menu Button - Separate */}
			<button className="hamburger-btn" onClick={toggleMenu} aria-label="User menu">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="3" cy="3" r="1.5" fill="currentColor"/>
					<circle cx="9" cy="3" r="1.5" fill="currentColor"/>
					<circle cx="15" cy="3" r="1.5" fill="currentColor"/>
					<circle cx="3" cy="9" r="1.5" fill="currentColor"/>
					<circle cx="9" cy="9" r="1.5" fill="currentColor"/>
					<circle cx="15" cy="9" r="1.5" fill="currentColor"/>
					<circle cx="3" cy="15" r="1.5" fill="currentColor"/>
					<circle cx="9" cy="15" r="1.5" fill="currentColor"/>
					<circle cx="15" cy="15" r="1.5" fill="currentColor"/>
				</svg>
			</button>

			{/* Dropdown Menu */}
			{menuOpen && (
				<div className="user-menu-dropdown">
					{user?._id ? (
						<>
							{/* Authenticated Menu Items */}
							<Link href="/mypage?category=myFavorites" onClick={closeMenu}>
								<div className="menu-item">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>{t('userMenu.myFavorites')}</span>
								</div>
							</Link>

							<Link href="/mypage" onClick={closeMenu}>
								<div className="menu-item">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>{t('userMenu.profile')}</span>
								</div>
							</Link>

							<div className="menu-divider"></div>

							<div className="menu-item-with-submenu">
								<div className={`menu-item ${langMenuOpen ? 'active' : ''}`} onClick={toggleLangMenu}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>Language</span>
									<span className="current-lang">{getLangDisplay(currentLang)}</span>
									<svg className={`chevron ${langMenuOpen ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								{langMenuOpen && (
									<div className="lang-submenu">
										<div 
											className={`lang-option ${currentLang === 'en' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('en')}
										>
											<span>🇺🇸</span>
											<span>English</span>
											{currentLang === 'en' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
										<div 
											className={`lang-option ${currentLang === 'kr' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('kr')}
										>
											<span>🇰🇷</span>
											<span>한국어</span>
											{currentLang === 'kr' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
										<div 
											className={`lang-option ${currentLang === 'ru' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('ru')}
										>
											<span>🇷🇺</span>
											<span>Русский</span>
											{currentLang === 'ru' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
									</div>
								)}
							</div>

							<Link href="/cs" onClick={closeMenu}>
								<div className="menu-item">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>{t('userMenu.helpCenter')}</span>
								</div>
							</Link>

							<div className="menu-item disabled" onClick={closeMenu}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<span>{t('userMenu.pricing')}</span>
								<span className="coming-soon">Soon</span>
							</div>

							<div className="menu-divider"></div>

							<div className="menu-item logout" onClick={handleLogout}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<span>{t('userMenu.logout')}</span>
							</div>
						</>
					) : (
						<>
							{/* Unauthenticated Menu Items */}
							<Link href="/cs" onClick={closeMenu}>
								<div className="menu-item">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>{t('userMenu.helpCenter')}</span>
								</div>
							</Link>

							<div className="menu-item-with-submenu">
								<div className={`menu-item ${langMenuOpen ? 'active' : ''}`} onClick={toggleLangMenu}>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>{t('userMenu.language')}</span>
									<span className="current-lang">{getLangDisplay(currentLang)}</span>
									<svg className={`chevron ${langMenuOpen ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								{langMenuOpen && (
									<div className="lang-submenu">
										<div 
											className={`lang-option ${currentLang === 'en' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('en')}
										>
											<span>🇺🇸</span>
											<span>English</span>
											{currentLang === 'en' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
										<div 
											className={`lang-option ${currentLang === 'kr' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('kr')}
										>
											<span>🇰🇷</span>
											<span>한국어</span>
											{currentLang === 'kr' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
										<div 
											className={`lang-option ${currentLang === 'ru' ? 'selected' : ''}`} 
											onClick={() => handleLangChange('ru')}
										>
											<span>🇷🇺</span>
											<span>Русский</span>
											{currentLang === 'ru' && (
												<svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											)}
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default UserMenu;

