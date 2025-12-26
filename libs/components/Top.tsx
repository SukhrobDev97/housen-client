import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, IconButton, Dialog, DialogContent, Typography, Backdrop, Popover, List, ListItemButton, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { sweetTopSmallSuccessAlert } from '../sweetAlert';
import UserMenu from './UserMenu';
import CheckoutModal from './checkout/CheckoutModal';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<'access' | 'services'>('access');
	const notificationRef = useRef<HTMLDivElement>(null);
	const [cartOpen, setCartOpen] = useState<boolean>(false);
	const cartRef = useRef<HTMLDivElement>(null);
	const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
	const { directCheckoutItems, checkoutOpen, setCheckoutOpen, setDirectCheckoutItems } = useCheckout();
	const [comingSoonModalOpen, setComingSoonModalOpen] = useState<boolean>(false);
	const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileLang, setMobileLang] = useState<'en' | 'ko'>('en');

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}

		// Load mobile language preference from localStorage
		const savedMobileLang = localStorage.getItem('mobileLang') as 'en' | 'ko' | null;
		if (savedMobileLang === 'en' || savedMobileLang === 'ko') {
			setMobileLang(savedMobileLang);
		} else {
			setMobileLang('en');
			localStorage.setItem('mobileLang', 'en');
		}

		// Load theme from localStorage
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.setAttribute('data-theme', savedTheme);
		} else {
			setTheme('light');
			document.documentElement.setAttribute('data-theme', 'light');
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
				closeNotification();
			}
		};

		if (notificationOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [notificationOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
				closeCart();
			}
		};

		if (cartOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [cartOpen]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setMobileMenuOpen(false);
	};

	const handleMenuClick = (path: string) => {
		if (path === '/') {
			closeMobileMenu();
			router.push('/');
		} else {
			closeMobileMenu();
			setComingSoonModalOpen(true);
		}
	};

	const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
		setLangAnchorEl(event.currentTarget);
	};

	const handleLangClose = () => {
		setLangAnchorEl(null);
	};

	const handleLangSelect = (selectedLang: 'en' | 'ko') => {
		setMobileLang(selectedLang);
		localStorage.setItem('mobileLang', selectedLang);
		// Dispatch custom event to notify other components
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('mobileLangChanged'));
		}
		handleLangClose();
	};

	const langOpen = Boolean(langAnchorEl);

	const toggleNotification = () => {
		setNotificationOpen(!notificationOpen);
		setCartOpen(false);
	};

	const closeNotification = () => {
		setNotificationOpen(false);
	};

	const toggleCart = () => {
		setCartOpen(!cartOpen);
		setNotificationOpen(false);
	};

	const closeCart = () => {
		setCartOpen(false);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		const isHomePage = router.pathname === '/';

		if (isHomePage) {
			return (
				<Stack className={'navbar mobile-navbar homepage-mobile-navbar'}>
					<Stack className={'navbar-main mobile homepage-mobile'}>
						<Stack className={'container'}>
							<IconButton
								className={'homepage-burger'}
								onClick={toggleMobileMenu}
								sx={{
									padding: '8px',
									color: '#222',
								}}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									<line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</IconButton>

							<Box
								component="input"
								type="text"
								placeholder={mobileLang === 'ko' ? '프로젝트 또는 에이전시 검색' : 'Search projects or agencies'}
								className={'homepage-search-input'}
								onClick={() => router.push('/property')}
							/>

							<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
								<IconButton
									className={'homepage-icon-btn'}
									onClick={handleLangClick}
									sx={{
										padding: '8px',
										color: '#222',
									}}
								>
									<span style={{ fontSize: '20px' }}>🌐</span>
								</IconButton>

								{/* Language Dropdown */}
								<Popover
									open={langOpen}
									anchorEl={langAnchorEl}
									onClose={handleLangClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									PaperProps={{
										sx: {
											mt: 1,
											borderRadius: '12px',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
											minWidth: 120,
											backgroundColor: '#FFFFFF',
										},
									}}
								>
									<List sx={{ p: 0 }}>
										<ListItemButton
											selected={mobileLang === 'en'}
											onClick={() => handleLangSelect('en')}
											sx={{
												py: 1.5,
												px: 2,
												'&.Mui-selected': {
													backgroundColor: '#F3F4F6',
												},
											}}
										>
											<ListItemText primary="English" />
										</ListItemButton>
										<ListItemButton
											selected={mobileLang === 'ko'}
											onClick={() => handleLangSelect('ko')}
											sx={{
												py: 1.5,
												px: 2,
												'&.Mui-selected': {
													backgroundColor: '#F3F4F6',
												},
											}}
										>
											<ListItemText primary="한국어" />
										</ListItemButton>
									</List>
								</Popover>
								{!user?._id && (
									<IconButton
										className={'homepage-icon-btn'}
										onClick={() => setComingSoonModalOpen(true)}
										sx={{
											padding: '8px',
											color: '#222',
										}}
									>
										<AccountCircleOutlinedIcon />
									</IconButton>
								)}
							</Stack>
						</Stack>
					</Stack>

					{/* Backdrop */}
					{mobileMenuOpen && (
						<Backdrop
							open={mobileMenuOpen}
							onClick={closeMobileMenu}
							sx={{
								position: 'fixed',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: 'rgba(0, 0, 0, 0.15)',
								zIndex: 1300,
							}}
						/>
					)}

					{/* Mobile Menu Container */}
					{mobileMenuOpen && (
						<Box className="mobile-burger-menu-container">
							{/* Header */}
							<Box className="mobile-burger-menu-header">
								<Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
									<svg width="32" height="28" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#111827"/>
									</svg>
									<Typography className="mobile-burger-menu-brand">HOUSEN</Typography>
								</Stack>
								<IconButton
									onClick={closeMobileMenu}
									sx={{
										padding: '4px',
										color: '#111827',
									}}
								>
									<CloseIcon />
								</IconButton>
							</Box>

							{/* Menu Items */}
							<Box className="mobile-burger-menu-items">
								<div className="mobile-burger-menu-item" onClick={() => handleMenuClick('/')}>
									<span>{mobileLang === 'ko' ? '홈' : 'Home'}</span>
								</div>
								<div className="mobile-burger-menu-item" onClick={() => handleMenuClick('/about')}>
									<span>{mobileLang === 'ko' ? '서비스' : 'Services'}</span>
								</div>
								<div className="mobile-burger-menu-item" onClick={() => handleMenuClick('/property')}>
									<span>{mobileLang === 'ko' ? '프로젝트' : 'Projects'}</span>
								</div>
								<div className="mobile-burger-menu-item" onClick={() => handleMenuClick('/agent')}>
									<span>{mobileLang === 'ko' ? '에이전시' : 'Agencies'}</span>
								</div>
								<div className="mobile-burger-menu-item" onClick={() => handleMenuClick('/community')}>
									<span>{mobileLang === 'ko' ? '커뮤니티' : 'Community'}</span>
								</div>
							</Box>
						</Box>
					)}

					{/* Coming Soon Modal */}
					<Dialog
						open={comingSoonModalOpen}
						onClose={() => setComingSoonModalOpen(false)}
						PaperProps={{
							sx: {
								borderRadius: '16px',
								maxWidth: '300px',
								width: '90%',
								boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
							},
						}}
					>
						<DialogContent sx={{ padding: '20px', textAlign: 'center' }}>
							<Box sx={{ marginBottom: '16px' }}>
								<span style={{ fontSize: '48px' }}>🛠️</span>
							</Box>
							<Typography
								sx={{
									fontFamily: "'Inter', sans-serif",
									fontSize: '20px',
									fontWeight: 600,
									color: '#111827',
									marginBottom: '12px',
								}}
							>
								Coming Soon
							</Typography>
							<Typography
								sx={{
									fontFamily: "'Inter', sans-serif",
									fontSize: '14px',
									fontWeight: 400,
									color: '#6B7280',
									marginBottom: '24px',
									lineHeight: '1.5',
								}}
							>
								This page is under development.
								<br />
								We'll launch it very soon.
							</Typography>
							<Button
								fullWidth
								onClick={() => setComingSoonModalOpen(false)}
								sx={{
									height: '40px',
									borderRadius: '10px',
									backgroundColor: '#111827',
									color: '#FFFFFF',
									fontFamily: "'Inter', sans-serif",
									fontSize: '14px',
									fontWeight: 500,
									textTransform: 'none',
									'&:hover': {
										backgroundColor: '#1F2937',
									},
								}}
							>
								Got it
							</Button>
						</DialogContent>
					</Dialog>
				</Stack>
			);
		}

		return (
			<Stack className={'navbar mobile-navbar'}>
				<Stack className={'navbar-main mobile'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'} onClick={closeMobileMenu}>
								<div className={'logo-container'}>
									<svg className={'logo-icon'} width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#0D0D0C"/>
									</svg>
									<div className={'logo-text-container'}>
										<span className={'logo-text'}>Housen</span>
										<span className={'logo-subtitle'}>LIVING SOLUTIONS</span>
									</div>
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'mobile-actions'}>
							{!user?._id && (
								<Link href={'/account/join'}>
									<div className={'auth-button mobile'}>
										<AccountCircleOutlinedIcon className={'auth-icon'} />
									</div>
								</Link>
							)}
							<button className={'side-menu-toggle'} onClick={toggleMobileMenu}>
								<svg width="32" height="21" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
									<line x1="0" y1="0.5" x2="32" y2="0.5" stroke="white" strokeWidth="1"/>
									<line x1="6" y1="10.5" x2="26" y2="10.5" stroke="white" strokeWidth="1"/>
									<line x1="0" y1="20.5" x2="32" y2="20.5" stroke="white" strokeWidth="1"/>
								</svg>
							</button>
						</Box>
					</Stack>
				</Stack>
				{mobileMenuOpen && (
					<Stack className={'mobile-menu'}>
						<Link href={'/'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>{t('Home')}</span>
							</div>
						</Link>
						<Link href={'/about'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Services</span>
							</div>
						</Link>
						<Link href={'/property'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Projects</span>
							</div>
						</Link>
						<Link href={'/products'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Products</span>
							</div>
						</Link>
						<Link href={'/agent'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Agencies</span>
							</div>
						</Link>
						<Link href={'/community?articleCategory=FREE'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Community</span>
							</div>
						</Link>
						{user?._id && (
							<Link href={'/mypage'} onClick={closeMobileMenu}>
								<div className={'mobile-menu-item'}>
									<span>Profile</span>
								</div>
							</Link>
						)}
						{user?._id ? (
							<div className={'mobile-menu-item'} onClick={(event: any) => {
								setLogoutAnchor(event.currentTarget);
								closeMobileMenu();
							}}>
								<span>Logout</span>
							</div>
						) : (
							<Link href={'/account/join'} onClick={closeMobileMenu}>
								<div className={'mobile-menu-item auth-button-mobile'}>
									<AccountCircleOutlinedIcon className={'auth-icon'} />
									<span>{t('Login')} / {t('Register')}</span>
								</div>
							</Link>
						)}
					</Stack>
				)}
				<Menu
					id="basic-menu"
					anchorEl={logoutAnchor}
					open={logoutOpen}
					onClose={() => {
						setLogoutAnchor(null);
					}}
					sx={{ mt: '5px' }}
				>
					<MenuItem onClick={() => logOut()}>
						<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
						Logout
					</MenuItem>
				</Menu>
			</Stack>
		);
	} else {
		return (
			<>
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<div className={'logo-container'}>
									<svg className={'logo-icon'} width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#0D0D0C"/>
									</svg>
									<div className={'logo-text-container'}>
										<span className={'logo-text'}>Housen</span>
										<span className={'logo-subtitle'}>LIVING SOLUTIONS</span>
									</div>
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={'menu-item'}>
									<span>{t('Home')}</span>
								</div>
							</Link>
							<Link href={'/about'}>
								<div className={'menu-item'}>
									<span>{t('Services')}</span>
								</div>
							</Link>
							<Link href={'/property'}>
								<div className={'menu-item'}>
									<span>{t('Projects')}</span>
								</div>
							</Link>
							<Link href={'/products'}>
								<div className={'menu-item'}>
									<span>{t('Products')}</span>
								</div>
							</Link>
							<Link href={'/agent'}>
								<div className={'menu-item'}>
									<span>{t('Agencies')}</span>
								</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={'menu-item'}>
									<span>{t('Community')}</span>
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							<div className={'utility-box'}>
								{/* Theme Toggle */}
								<button className={'theme-toggle-button'} onClick={toggleTheme} aria-label="Toggle theme">
									{theme === 'light' ? (
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M12 2V4M12 20V22M22 12H20M4 12H2M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									) : (
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									)}
								</button>

								{/* Notification Bell */}
								<div className={'notification-container'} ref={notificationRef}>
									<button className={'notification-bell-button'} onClick={toggleNotification} aria-label="Notifications">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span className={'notification-badge'}>3</span>
									</button>

									{/* Notification Dropdown Panel */}
									{notificationOpen && (
										<div className={'notification-panel'}>
											<div className={'notification-header'}>
												<h3>Notifications</h3>
												<button className={'close-btn'} onClick={closeNotification}>
													<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
													</svg>
												</button>
											</div>

											<div className={'notification-tabs'}>
												<button 
													className={`tab ${activeTab === 'access' ? 'active' : ''}`}
													onClick={() => setActiveTab('access')}
												>
													Access
												</button>
												<button 
													className={`tab ${activeTab === 'services' ? 'active' : ''}`}
													onClick={() => setActiveTab('services')}
												>
													Services
												</button>
											</div>

											<div className={'notification-content'}>
												{activeTab === 'access' ? (
													<>
														<div className={'notification-item'}>
															<div className={'notification-icon'}>🏡</div>
															<div className={'notification-text'}>
																<h4>New Property Match</h4>
																<p>3 new properties match your search criteria in Downtown area.</p>
																<span className={'notification-time'}>2 hours ago</span>
															</div>
														</div>
														<div className={'notification-item'}>
															<div className={'notification-icon'}>💰</div>
															<div className={'notification-text'}>
																<h4>Price Drop Alert</h4>
																<p>Property on Main Street reduced by $50,000</p>
																<span className={'notification-time'}>5 hours ago</span>
															</div>
														</div>
														<div className={'notification-item'}>
															<div className={'notification-icon'}>⭐</div>
															<div className={'notification-text'}>
																<h4>Welcome to Housen</h4>
																<p>Start exploring premium properties and find your dream home today!</p>
																<span className={'notification-time'}>1 day ago</span>
															</div>
														</div>
													</>
												) : (
													<>
														<div className={'notification-item'}>
															<div className={'notification-icon'}>📅</div>
															<div className={'notification-text'}>
																<h4>Viewing Scheduled</h4>
																<p>Your property viewing is confirmed for tomorrow at 2 PM</p>
																<span className={'notification-time'}>1 hour ago</span>
															</div>
														</div>
														<div className={'notification-item'}>
															<div className={'notification-icon'}>💬</div>
															<div className={'notification-text'}>
																<h4>New Message</h4>
																<p>Agent John replied to your inquiry</p>
																<span className={'notification-time'}>3 hours ago</span>
															</div>
														</div>
													</>
												)}
											</div>
										</div>
									)}
								</div>

								{/* Cart */}
								<div className={'cart-container'} ref={cartRef}>
									<button className={'cart-button'} onClick={toggleCart} aria-label="Cart">
										<ShoppingCartOutlinedIcon />
										{getCartCount() > 0 && (
											<span className={'cart-badge'}>{getCartCount()}</span>
										)}
									</button>

									{/* Cart Dropdown Panel */}
									{cartOpen && (
										<div className={'cart-panel'}>
											<div className={'cart-header'}>
												<h3>Shopping Cart</h3>
												<button className={'close-btn'} onClick={closeCart}>
													<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
													</svg>
												</button>
											</div>

											<div className={'cart-content'}>
												{cartItems.length === 0 ? (
													<div className={'cart-empty'}>
														<ShoppingCartOutlinedIcon />
														<p>Your cart is empty</p>
													</div>
												) : (
													<>
														{cartItems.map((item) => (
															<div key={item.product.id} className={'cart-item'}>
																<img src={item.product.image} alt={item.product.name} />
																<div className={'cart-item-info'}>
																	<h4>{item.product.name}</h4>
																	<span className={'cart-item-price'}>${item.product.price}</span>
																</div>
																<div className={'cart-item-actions'}>
																	<div className={'quantity-controls'}>
																		<IconButton 
																			size="small" 
																			onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
																		>
																			<RemoveIcon fontSize="small" />
																		</IconButton>
																		<span>{item.quantity}</span>
																		<IconButton 
																			size="small" 
																			onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
																		>
																			<AddIcon fontSize="small" />
																		</IconButton>
																	</div>
																	<IconButton 
																		size="small" 
																		className={'delete-btn'}
																		onClick={() => removeFromCart(item.product.id)}
																	>
																		<DeleteOutlineIcon fontSize="small" />
																	</IconButton>
																</div>
															</div>
														))}
													</>
												)}
											</div>

											{cartItems.length > 0 && (
												<div className={'cart-footer'}>
													<div className={'cart-total'}>
														<span>Total:</span>
														<strong>${getCartTotal().toLocaleString()}</strong>
													</div>
													<button 
														className={'checkout-btn'}
														onClick={() => {
															setCartOpen(false);
															setDirectCheckoutItems(null);
															setCheckoutOpen(true);
														}}
													>
														Order
													</button>
												</div>
											)}
										</div>
									)}
								</div>
							</div>

							{/* Airbnb-style User Menu */}
							<UserMenu />
						</Box>
					</Stack>
				</Stack>
			</Stack>

			<CheckoutModal
				open={checkoutOpen}
				onClose={() => {
					setCheckoutOpen(false);
					setDirectCheckoutItems(null);
				}}
				cartItems={directCheckoutItems || cartItems}
				total={directCheckoutItems 
					? directCheckoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
					: getCartTotal()}
				onClearCart={() => {
					if (directCheckoutItems) {
						setDirectCheckoutItems(null);
					} else {
						clearCart();
					}
				}}
			/>
			</>
		);
	}
};

export default withRouter(Top);
