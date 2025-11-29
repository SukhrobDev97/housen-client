import React from 'react';
import { Stack, Box, Divider, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Project } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import StyleIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EastIcon from '@mui/icons-material/East';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface PopularProjectCardProps {
	project: Project;
}

const PopularProjectCard = (props: PopularProjectCardProps) => {
	const { project } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					{project?.projectRank && project?.projectRank >= 50 ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>best</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectType}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project?.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project?.projectDuration} months</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{project?.projectCollaboration ? 'Collaboration' : 'Solo'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack 
				className="popular-card-box" 
				onClick={() => router.push(`/property/detail?id=${project._id}`)}
				sx={{ cursor: 'pointer' }}
			>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
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
								onClick={(e: T) => {
									e.stopPropagation();
								}}
							>
								<RemoveRedEyeIcon sx={{ fontSize: 18, color: '#666' }} />
							</IconButton>
							<Typography className="view-cnt-info">{project?.projectViews || 0}</Typography>
							<IconButton 
								color={'default'} 
								size="small"
								className={'view-like-icon'}
								sx={{ 
									backgroundColor: 'transparent',
									'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
								}}
								onClick={(e: T) => {
									e.stopPropagation();
								}}
							>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: '#ff6b6b', fontSize: 18 }} />
								) : (
									<FavoriteIcon sx={{ fontSize: 18, color: '#666' }} />
								)}
							</IconButton>
							<Typography className="view-cnt-info">{project?.projectLikes || 0}</Typography>
						</div>
						<Button 
							className={'details-btn'} 
							endIcon={<EastIcon sx={{ fontSize: 16 }} />}
							onClick={(e: T) => {
								e.stopPropagation();
								router.push(`/property/detail?id=${project._id}`);
							}}
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

