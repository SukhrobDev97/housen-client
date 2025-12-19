import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';

// Icons
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);
	const isAdmin = user?.memberType === 'ADMIN';

	const goToAdminPage = async () => {
		if (!isAdmin) return;
		await router.push('/_admin/users');
	};

	const handleProfileKeyDown = async (event: React.KeyboardEvent) => {
		if (!isAdmin) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			await goToAdminPage();
		}
	};

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	// Menu items configuration
	const agencyMenuItems = [
		{ key: 'addProject', label: 'Add Project', icon: <AddBusinessOutlinedIcon />, agencyOnly: true },
		{ key: 'myProjects', label: 'My Projects', icon: <HomeWorkOutlinedIcon />, agencyOnly: true },
	];

	const listingsMenuItems = [
		{ key: 'myFavorites', label: 'My Favorites', icon: <FavoriteBorderOutlinedIcon /> },
		{ key: 'recentlyVisited', label: 'Recently Visited', icon: <HistoryOutlinedIcon /> },
		{ key: 'followers', label: 'My Followers', icon: <PeopleAltOutlinedIcon /> },
		{ key: 'followings', label: 'My Followings', icon: <PersonAddAltOutlinedIcon /> },
	];

	const communityMenuItems = [
		{ key: 'myArticles', label: 'Articles', icon: <ArticleOutlinedIcon /> },
		{ key: 'writeArticle', label: 'Write Article', icon: <EditNoteOutlinedIcon /> },
	];

	const accountMenuItems = [
		{ key: 'myProfile', label: 'My Profile', icon: <PersonOutlineOutlinedIcon /> },
	];

	const renderMenuItem = (item: any) => (
		<ListItem 
			key={item.key}
			className={`menu-item ${pathname === item.key ? 'active' : ''}`}
		>
			<Link
				href={{
					pathname: '/mypage',
					query: { category: item.key },
				}}
				scroll={false}
			>
				<Box className="menu-content">
					<span className="menu-icon">{item.icon}</span>
					<Typography className="menu-label">{item.label}</Typography>
				</Box>
			</Link>
		</ListItem>
	);

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		return (
			<Stack className="sidebar-container">
				{/* Sidebar Header */}
				<Typography className="sidebar-title">My Account</Typography>

				{/* Profile Section */}
				<Box
					className={`profile-section ${isAdmin ? 'admin-clickable' : ''}`}
					role={isAdmin ? 'button' : undefined}
					tabIndex={isAdmin ? 0 : undefined}
					onClick={goToAdminPage}
					onKeyDown={handleProfileKeyDown}
				>
					<Box className="avatar-wrapper">
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt="Profile"
							className="avatar-image"
						/>
						<Box className={`status-indicator ${user?.memberStatus === 'ACTIVE' ? 'online' : ''}`} />
					</Box>
					<Stack className="user-details">
						<Typography className="user-name">{user?.memberNick || 'User'}</Typography>
						{user?.memberPhone && (
							<Typography className="user-phone">{user?.memberPhone}</Typography>
						)}
						<Box className={`role-badge ${user?.memberType?.toLowerCase()}`}>
							{user?.memberType}
						</Box>
					</Stack>
				</Box>

				<Divider className="section-divider" />

				{/* Menu Sections */}
				<Stack className="menu-sections">
					{/* Agency Menu (Only for AGENCY type) */}
					{user?.memberType === 'AGENCY' && (
						<Box className="menu-group">
							<Typography className="group-title">Projects</Typography>
							<List className="menu-list">
								{agencyMenuItems.map(renderMenuItem)}
							</List>
						</Box>
					)}

					{/* Listings Menu */}
					<Box className="menu-group">
						<Typography className="group-title">Manage Listings</Typography>
						<List className="menu-list">
							{listingsMenuItems.map(renderMenuItem)}
						</List>
					</Box>

					{/* Community Menu */}
					<Box className="menu-group">
						<Typography className="group-title">Community</Typography>
						<List className="menu-list">
							{communityMenuItems.map(renderMenuItem)}
							</List>
					</Box>

					{/* Account Menu */}
					<Box className="menu-group">
						<Typography className="group-title">Account</Typography>
						<List className="menu-list">
							{accountMenuItems.map(renderMenuItem)}
							<ListItem className="menu-item logout-item" onClick={logoutHandler}>
								<Box className="menu-content">
									<span className="menu-icon"><LogoutOutlinedIcon /></span>
									<Typography className="menu-label">Logout</Typography>
								</Box>
							</ListItem>
						</List>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;
