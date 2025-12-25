import React, { useState } from 'react';
import { Stack, Box, Divider, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Project } from '../../types/property/property';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StyleIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EastIcon from '@mui/icons-material/East';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface PopularProjectCardProps {
	project: Project;
	likeProjectHandler?: any;
}

const PopularProjectCard = (props: PopularProjectCardProps) => {
	const { project, likeProjectHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Independent states for Like and Save
	const [isSaved, setIsSaved] = useState(false);
	const isLiked = project?.meLiked && project?.meLiked[0]?.myFavorite;

	/** HANDLERS **/
	const pushDetailHandler = async (projectId: string) => {
		console.log('CLICKED_PROPERTY_ID:', projectId);
		await router.push({pathname: '/property/detail', query: { id : projectId}});
	}

	if (device === 'mobile') {
		const isHomePage = router.pathname === '/';
		
		// Homepage Mobile - Match TrendProjects style with desktop icons
		if (isHomePage) {
			return (
				<Stack className="popular-card-box homepage-mobile-popular-card">
					<Box
						component={'div'}
						className={'card-img homepage-mobile-popular-card-img'}
						style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
						onClick={() => pushDetailHandler(project._id)}
					>
						{/* Desktop-style Icons on Image - Top Right */}
						<Box className="homepage-mobile-popular-card-icons">
							<Box 
								className={`homepage-icon-btn homepage-like-btn ${isLiked ? 'active' : ''}`}
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									if (user?._id && likeProjectHandler) {
										likeProjectHandler(user, project._id);
									}
								}}
							>
								{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</Box>
							<Box 
								className={`homepage-icon-btn homepage-save-btn ${isSaved ? 'active' : ''}`}
								onClick={async (e: React.MouseEvent) => {
									e.stopPropagation();
									const newSavedState = !isSaved;
									setIsSaved(newSavedState);
									await sweetTopSmallSuccessAlert(newSavedState ? 'Saved!' : 'Removed from saved', 800);
								}}
							>
								{isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
							</Box>
						</Box>
						
						{/* Project Type Badge - Bottom Left */}
						<div className={'homepage-popular-type-badge'}>
							<span>{project.projectType || 'Type'}</span>
						</div>
						
						{/* Hot Badge - Top Left */}
						<div className={'homepage-hot-badge'}>Hot</div>
					</Box>
					<Box component={'div'} className={'info homepage-mobile-popular-card-content'}>
						<Typography className={'homepage-popular-card-title'} onClick={() => pushDetailHandler(project._id)}>
							{project.projectTitle}
						</Typography>
						<Typography className={'homepage-popular-card-subtext'}>
							{project.projectType}
						</Typography>
						<Typography className={'homepage-popular-card-price'}>
							${project.projectPrice.toLocaleString()}
						</Typography>
					</Box>
				</Stack>
			);
		}

		// Other Mobile Pages - Original Layout
		return (
				<Stack className="popular-card-box">
					<Box
						component={'div'}
						className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
						onClick={() => pushDetailHandler(project._id)}
					>
					{/* Hot Badge */}
					<div className={'hot-badge'}>Hot</div>

						<div className={'price'}>${project.projectPrice}</div>
					</Box>
					<Box component={'div'} className={'info'}>
						<strong 
							className={'title'} 
							onClick={() => pushDetailHandler(project._id)}
						>
							{project.projectTitle}
						</strong>
						<p className={'desc'}>{project.projectType}</p>
						<div className={'options'}>
							<div>
								<img src="/img/icons/bed.svg" alt="" />
								<span>{project?.projectStyle} style</span>
							</div>
							<div>
								<img src="/img/icons/room.svg" alt="" />
								<span>{project?.projectDuration} {project?.projectDuration === 1 ? 'month' : 'months'}</span>
							</div>
						</div>
						<Divider sx={{ mt: '15px', mb: '17px' }} />
						<div className={'bott'}>
							<p>{project?.projectCollaboration ? 'Collaboration' : 'Solo'}</p>
						</div>
					</Box>
				</Stack>
		);
	} else {
		return (
				<Stack 
					className="popular-card-box"
				>
					<Box
						component={'div'}
						className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
						sx={{ cursor: 'pointer' }}
						onClick={() => pushDetailHandler(project._id)}
					>
					{/* Hot Badge */}
					<div className={'hot-badge'}>Hot</div>
					
						{/* Project Type Badge - Always Visible */}
						<div className={'project-type-badge'}>
							<span>{project.projectType || 'Type'}</span>
						</div>
						
						{/* Hover Icons - Top Right */}
						<Box className="hover-icons">
							<Box 
								className={`icon-btn like-btn ${isLiked ? 'active' : ''}`}
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									likeProjectHandler && likeProjectHandler(user, project?._id);
								}}
							>
								{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</Box>
							<Box 
								className={`icon-btn save-btn ${isSaved ? 'active' : ''}`}
								onClick={async (e: React.MouseEvent) => {
									e.stopPropagation();
									const newSavedState = !isSaved;
									setIsSaved(newSavedState);
									await sweetTopSmallSuccessAlert(newSavedState ? 'Saved!' : 'Removed from saved', 800);
								}}
							>
								{isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
							</Box>
						</Box>
					</Box>
				<Box component={'div'} className={'info'}>
					{/* Always visible */}
					<div className={'property-details'}>
						<div className={'detail-item'}>
							<StyleIcon sx={{ fontSize: 18, color: '#666' }} />
							<span>{project.projectStyle}</span>
						</div>
						<div className={'detail-item'}>
							<CalendarTodayIcon sx={{ fontSize: 18, color: '#666' }} />
							<span>duration: {project.projectDuration} {project.projectDuration === 1 ? 'month' : 'months'}</span>
						</div>
					</div>
					<Divider className={'property-details-divider'} />
					<strong className={'title'} onClick={() => pushDetailHandler(project._id)}>{project.projectTitle}</strong>
					<div className={'price-location'}>
						<span className={'price'}>${project.projectPrice.toLocaleString()}</span>
						<Button 
							className={'details-btn'} 
							endIcon={<EastIcon sx={{ fontSize: 16 }} />}
							onClick={() => router.push(`/property/detail?id=${project._id}`)}
						>
							Details
						</Button>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularProjectCard;

