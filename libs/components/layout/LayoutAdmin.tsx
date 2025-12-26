import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import Link from 'next/link';
import AdminStats from '../admin/AdminStats';
import AdminWelcomeModal from '../admin/AdminWelcomeModal';
import AdminCalendar from '../admin/AdminCalendar';
const drawerWidth = 280;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [openMenu, setOpenMenu] = useState(false);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		return (
			<main id="pc-wrap" className="admin">
				<AdminWelcomeModal />
				<Box component={'div'} sx={{ display: 'flex' }}>
					<AppBar
						position="fixed"
						sx={{
							width: `calc(100% - ${drawerWidth}px)`,
							ml: `${drawerWidth}px`,
							boxShadow: 'rgb(100 116 139 / 12%) 0px 1px 4px',
							background: 'none',
						}}
					>
						<Toolbar sx={{ justifyContent: 'flex-end' }}>
							<Button
								onClick={logoutHandler}
								startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
								sx={{
									color: '#6B7280',
									fontSize: '14px',
									fontWeight: 500,
									textTransform: 'none',
									padding: '8px 16px',
									borderRadius: '8px',
									'&:hover': {
										background: 'rgba(239, 68, 68, 0.1)',
										color: '#EF4444',
									},
								}}
							>
								Logout
							</Button>
						</Toolbar>
					</AppBar>

					<Drawer
						sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
								display: 'flex',
								flexDirection: 'column',
							},
						}}
						variant="permanent"
						anchor="left"
						className="aside"
					>
						<Toolbar sx={{ flexDirection: 'column', alignItems: 'flexStart' }}>
							<Stack className={'logo-box'}>
								<Link href={'/'} className={'admin-logo-link'}>
									<div className={'admin-logo-container'}>
										<svg
											className={'admin-logo-icon'}
											width="62"
											height="56"
											viewBox="0 0 62 56"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z"
												fill="currentColor"
											/>
										</svg>
										<div className={'admin-logo-text'}>
											<span className={'admin-logo-title'}>HOUSEN</span>
											<span className={'admin-logo-subtitle'}>LIVING SOLUTIONS</span>
										</div>
									</div>
								</Link>
							</Stack>

							<Stack
								className="user"
								direction={'row'}
								alignItems={'center'}
								sx={{
									bgcolor: openMenu ? 'rgba(255, 255, 255, 0.04)' : 'none',
									borderRadius: '8px',
									px: '24px',
									py: '11px',
								}}
							>
								<Avatar
									src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
								/>
								<Typography variant={'body2'} p={1} ml={1}>
									{user?.memberNick} <br />
									{user?.memberPhone}
								</Typography>
							</Stack>
						</Toolbar>

						<Divider />

						<Box
							sx={{
								padding: '16px',
							}}
						>
							<AdminCalendar />
						</Box>

						<Divider />

						<Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
							<MenuList />
						</Box>
					</Drawer>

					<Box component={'div'} id="bunker" sx={{ flexGrow: 1 }}>
						<Box component={'div'} className="admin-stats-wrapper">
							<AdminStats />
						</Box>
						{/*@ts-ignore*/}
						<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
					</Box>
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
