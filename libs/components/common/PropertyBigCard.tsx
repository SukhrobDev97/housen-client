import React from 'react';
import { Stack, Box, Divider, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Project } from '../../types/property/property';
import { REACT_APP_API_URL, topProjectRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StyleIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EastIcon from '@mui/icons-material/East';

interface ProjectBigCardProps {
	project: Project;
	likeProjectHandler?: any;
}

const ProjectBigCard = (props: ProjectBigCardProps) => {
	const { project, likeProjectHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const imagePath: string = project?.projectImages?.[0]
		? `${REACT_APP_API_URL}/${project?.projectImages[0]}`
		: '/img/banner/header1.svg';

	/** HANDLERS **/
	const goProjectDetatilPage = (projectId: string) => {
		router.push(`/property/detail?id=${projectId}`);
	};

	if (device === 'mobile') {
		return <div>PROJECT BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${imagePath})` }}
					onClick={() => goProjectDetatilPage(project?._id)}
					sx={{ cursor: 'pointer' }}
				>
					{project?.projectRank && project?.projectRank >= topProjectRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>BEST</Typography>
						</Box>
					)}
					{/* Project Type Badge */}
					<div className={'project-type-badge'}>
						<span>{project?.projectType || 'Type'}</span>
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Property Details */}
					<div className={'property-details'}>
						<div className={'detail-item'}>
							<StyleIcon sx={{ fontSize: 18, color: '#666' }} />
							<span>{project?.projectStyle}</span>
						</div>
						<div className={'detail-item'}>
							<CalendarTodayIcon sx={{ fontSize: 18, color: '#666' }} />
							<span><strong>duration:</strong> {project?.projectDuration} months</span>
						</div>
					</div>
					<Divider className={'property-details-divider'} />
					<strong className={'title'}>{project?.projectTitle}</strong>
					<div className={'price-location'}>
						<span className={'price'}>${project?.projectPrice?.toLocaleString()}</span>
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
										onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
											e.stopPropagation();
											likeProjectHandler(user, project?._id);
										}}
									>
										{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
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
						onClick={() => goProjectDetatilPage(project?._id)}
					>
						Details
					</Button>
				</Box>
			</Stack>
		);
	}
};

export default ProjectBigCard;
