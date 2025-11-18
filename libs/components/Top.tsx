import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

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

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
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
								<span>About Us</span>
							</div>
						</Link>
						<Link href={'/property'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>{t('Properties')}</span>
							</div>
						</Link>
						<Link href={'/agent'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>{t('Agents')}</span>
							</div>
						</Link>
						<Link href={'/community?articleCategory=FREE'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item'}>
								<span>Pages</span>
							</div>
						</Link>
						{user?._id && (
							<Link href={'/mypage'} onClick={closeMobileMenu}>
								<div className={'mobile-menu-item'}>
									<span>Blog</span>
								</div>
							</Link>
						)}
						<Link href={'/cs'} onClick={closeMobileMenu}>
							<div className={'mobile-menu-item contact-button'}>
								<span>Contact Us</span>
							</div>
						</Link>
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
									<svg className={'down-arrow'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
							<Link href={'/about'}>
								<div className={'menu-item no-arrow'}>
									<span>About Us</span>
								</div>
							</Link>
							<Link href={'/property'}>
								<div className={'menu-item'}>
									<span>{t('Properties')}</span>
									<svg className={'down-arrow'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
							<Link href={'/agent'}>
								<div className={'menu-item'}>
									<span>{t('Agents')}</span>
									<svg className={'down-arrow'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={'menu-item'}>
									<span>Pages</span>
									<svg className={'down-arrow'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div className={'menu-item'}>
										<span>Blog</span>
										<svg className={'down-arrow'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
								</Link>
							)}
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<Link href={'/cs'}>
										<div className={'contact-us-button'}>
											<span>Contact Us</span>
											<svg className={'right-arrow'} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</Link>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

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
								</>
							) : (
								<>
									<Link href={'/cs'}>
										<div className={'contact-us-button'}>
											<span>Contact Us</span>
											<svg className={'right-arrow'} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</Link>
									<Link href={'/account/join'}>
										<div className={'auth-button'}>
											<AccountCircleOutlinedIcon className={'auth-icon'} />
											<span className={'auth-text'}>
												{t('Login')} / {t('Register')}
											</span>
										</div>
									</Link>
								</>
							)}

							<div className={'lan-box'}>
								{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'lang-text'}>
										{lang === 'en' ? 'EN' : lang === 'ru' ? 'RU' : lang === 'kr' ? 'KOR' : 'EN'}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
