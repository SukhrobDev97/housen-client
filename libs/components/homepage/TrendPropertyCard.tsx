import React from 'react';
import { Stack, Box, Divider, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Project } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EastIcon from '@mui/icons-material/East';
import StyleIcon from '@mui/icons-material/Palette';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface TrendProjectCardProps {
	project: Project;
}

const TrendProjectCard = (props: TrendProjectCardProps) => {
	const { project } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={project._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					<div>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project.projectDuration} months</span>
						</div>
						
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{project.projectCollaboration ? 'Collaboration' : ''} {project.projectCollaboration && project.projectPublic && '/'}{' '}
							{project.projectPublic ? 'Public' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
							<IconButton color={'default'}>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{project?.projectLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={project._id} onClick={() => router.push(`/property/detail?id=${project._id}`)}>
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
					{/* Hidden by default, shown on hover */}
					<div className={'property-details hover-content'}>
						<div className={'detail-item'}>
							<StyleIcon sx={{ fontSize: 18, color: '#ffffff' }} />
							<span>{project.projectStyle}</span>
						</div>
						<div className={'detail-item'}>
							<CalendarTodayIcon sx={{ fontSize: 18, color: '#ffffff' }} />
							<span><strong>duration:</strong> {project.projectDuration} months</span>
						</div>
					</div>
					<Divider className={'property-details-divider hover-content'} />
					<strong className={'title hover-content'}>{project.projectTitle}</strong>
					<div className={'price-location'}>
						<span className={'price hover-content'}>${project.projectPrice.toLocaleString()}</span>
						<div className={'view-like-box-info hover-content'}>
							<IconButton 
								color={'default'} 
								size="small"
								className={'view-like-icon'}
								sx={{ 
									backgroundColor: 'transparent',
									'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
								}}
								onClick={(e: T) => {
									e.stopPropagation();
								}}
							>
								<RemoveRedEyeIcon sx={{ fontSize: 18, color: '#ffffff' }} />
							</IconButton>
							<Typography className="view-cnt-info">{project?.projectViews || 0}</Typography>
							<IconButton 
								color={'default'} 
								size="small"
								className={'view-like-icon'}
								sx={{ 
									backgroundColor: 'transparent',
									'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
								}}
								onClick={(e: T) => {
									e.stopPropagation();
								}}
							>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: '#ff6b6b', fontSize: 18 }} />
								) : (
									<FavoriteIcon sx={{ fontSize: 18, color: '#ffffff' }} />
								)}
							</IconButton>
							<Typography className="view-cnt-info">{project?.projectLikes || 0}</Typography>
						</div>
						<Button 
							className={'details-btn hover-content'} 
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

export default TrendProjectCard;
