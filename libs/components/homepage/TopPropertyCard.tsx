import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Project } from '../../types/property/property';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopProjectCardProps {
	project: Project;
	likeProjectHandler: any;
}

const TopProjectCard = (props: TopProjectCardProps) => {
	const { project, likeProjectHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (projectId: string) => {
		console.log('CLICKED_PROPERTY_ID:', projectId);
		await router.push({pathname: '/property/detail', query: { id : projectId}});
	}

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box" key={project._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
					onClick={() => pushDetailHandler(project._id)}
				>
					<span className="category-badge">{project.projectType}</span>
				</Box>
				<Box 
					component={'div'} className={'card-content'} 
					onClick={() => pushDetailHandler(project._id)}
				>
					<Typography className={'card-title'}>{project.projectTitle}</Typography>
					<Typography className={'card-price'}>${project.projectPrice.toLocaleString()}</Typography>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack 
				className="top-card-box"
				onClick={() => router.push(`/property/detail?id=${project._id}`)}
			>
				{/* Image Layer */}
				<Box className="card-img">
					<img 
						src={`${REACT_APP_API_URL}/${project?.projectImages[0]}`} 
						alt={project.projectTitle}
						className="card-image"
						onClick={() => pushDetailHandler(project._id)}
					/>
					<Box className="image-gradient" />
				</Box>
				
				{/* Glass Overlay Info Section */}
				<Box className="glass-info">
					{/* Top Info Row - Icons */}
					<Box className="info-icons">
						<Box className="icon-item">
							<AutoAwesomeOutlinedIcon />
							<span>{project.projectStyle}</span>
						</Box>
						<Box className="icon-item">
							<AccessTimeOutlinedIcon />
							<span>{project.projectDuration} months</span>
						</Box>
					</Box>
					
					{/* Title */}
					<Typography 
						className="card-title"
						onClick={() => pushDetailHandler(project._id)}
					>
						{project.projectTitle}
					</Typography>
					
					{/* Bottom Row: Stats + CTA */}
					<Box className="bottom-row">
						{/* Stats */}
						<Box className="stats-row">
							<Box className="stat-item">
								<VisibilityOutlinedIcon />
								<span>{project?.projectViews || 0}</span>
							</Box>
							<Box 
								className="stat-item clickable"
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									likeProjectHandler(user, project._id);
								}}
							>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon className="liked" />
								) : (
									<FavoriteBorderIcon />
								)}
								<span>{project?.projectLikes || 0}</span>
							</Box>
						</Box>
						
						{/* Ghost CTA Button */}
						<Button className="ghost-btn">
							<span>Explore</span>
							<ArrowOutwardIcon />
						</Button>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default TopProjectCard;
