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
					<div className={'view-like-box-overlay'}>
						<IconButton 
							color={'default'} 
							size="small"
							sx={{ 
								backgroundColor: 'transparent',
								'&:hover': { backgroundColor: 'transparent' }
							}}
							onClick={(e: T) => {
								e.stopPropagation();
							}}
						>
							<RemoveRedEyeIcon sx={{ fontSize: 16, color: '#ffffff' }} />
						</IconButton>
						<Typography className="view-cnt-overlay">{project?.projectViews || 0}</Typography>
						<IconButton 
							color={'default'} 
							size="small"
							sx={{ 
								backgroundColor: 'transparent',
								'&:hover': { backgroundColor: 'transparent' }
							}}
							onClick={(e: T) => {
								e.stopPropagation();
							}}
						>
							{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: '#ffffff', fontSize: 16 }} />
							) : (
								<FavoriteIcon sx={{ fontSize: 16, color: '#ffffff' }} />
							)}
						</IconButton>
						<Typography className="view-cnt-overlay">{project?.projectLikes || 0}</Typography>
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
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
						<span className={'location'}>{project.projectType || 'Type'}</span>
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

export default TrendProjectCard;
