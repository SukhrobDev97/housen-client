import React from 'react';
import { Stack, Box, Divider, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Project } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StyleIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EastIcon from '@mui/icons-material/East';
import { REACT_APP_API_URL, topProjectRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ProjectCardType {
	project: Project;
	likeProjectHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProjectCard = (props: ProjectCardType) => {
	const { project, likeProjectHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = project?.projectImages[0]
		? `${REACT_APP_API_URL}/${project?.projectImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PROJECT CARD</div>;
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${imagePath})` }}
					onClick={() => router.push(`/property/detail?id=${project._id}`)}
					sx={{ cursor: 'pointer' }}
				>
					{project && project?.projectRank > topProjectRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>BEST</Typography>
						</Box>
					)}
					{/* Project Type Badge - Always Visible */}
					<div className={'project-type-badge'}>
						<span>{project.projectType || 'Type'}</span>
					</div>
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
							<span><strong>duration:</strong> {project.projectDuration} months</span>
						</div>
					</div>
					<Divider className={'property-details-divider'} />
					<strong className={'title'}>{project.projectTitle}</strong>
					<div className={'price-location'}>
						<span className={'price'}>${project.projectPrice.toLocaleString()}</span>
						<div className={'view-like-box-info'}>
							<IconButton 
								color={'default'} 
								size="small"
								className={'view-like-icon'}
								sx={{ 
									backgroundColor: 'transparent',
									'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
								}}
							>
								<RemoveRedEyeIcon sx={{ fontSize: 18, color: '#666' }} />
							</IconButton>
							<Typography className="view-cnt-info">{project?.projectViews || 0}</Typography>
							{likeProjectHandler && (
								<>
									<IconButton 
										color={'default'} 
										size="small"
										className={'view-like-icon'}
										sx={{ 
											backgroundColor: 'transparent',
											'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
										}}
										onClick={() => likeProjectHandler(user, project._id)}
									>
										{myFavorites || (project?.meLiked && project?.meLiked[0]?.myFavorite) ? (
											<FavoriteIcon style={{ color: '#ff6b6b', fontSize: 18 }} />
										) : (
											<FavoriteIcon sx={{ fontSize: 18, color: '#666' }} />
										)}
									</IconButton>
									<Typography className="view-cnt-info">{project?.projectLikes || 0}</Typography>
								</>
							)}
						</div>
					</div>
					<Button 
						className={'details-btn'} 
						endIcon={<EastIcon sx={{ fontSize: 16 }} />}
						onClick={() => router.push(`/property/detail?id=${project._id}`)}
					>
						Details
					</Button>
				</Box>
			</Stack>
		);
	}
};

export default ProjectCard;
