import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckIcon from '@mui/icons-material/Check';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Project } from '../../types/property/property';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProjectCardProps {
	project: Project;
	likeProjectHandler: any;
	isCompareSelected?: boolean;
	onCompareToggle?: (project: Project) => void;
}

const TrendProjectCard = (props: TrendProjectCardProps) => {
	const { project, likeProjectHandler, isCompareSelected = false, onCompareToggle } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (projectId: string) => {
		// Disable navigation on mobile homepage
		if (device === 'mobile' && router.pathname === '/') {
			return;
		}
		console.log('CLICKED_PROPERTY_ID:', projectId);
		await router.push({pathname: '/property/detail', query: { id : projectId}});
	}

	const handleCompareClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onCompareToggle) {
			onCompareToggle(project);
		}
	}

	if (device === 'mobile') {
		return (
			<Stack className={`trend-card-box homepage-mobile-trend-card ${isCompareSelected ? 'compare-selected' : ''}`} key={project._id} data-project-id={project._id}>
				<Box
					component={'div'}
					className={'card-img homepage-mobile-card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
					onClick={() => pushDetailHandler(project._id)}
				>
					{/* Desktop-style Icons on Image - Top Right */}
					<Box className="homepage-mobile-card-icons">
						<Box 
							className={`homepage-icon-btn homepage-like-btn ${project?.meLiked && project?.meLiked[0]?.myFavorite ? 'active' : ''}`}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								if (user?._id) {
									likeProjectHandler(user, project._id);
								}
							}}
						>
							{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon />
							) : (
								<FavoriteBorderIcon />
							)}
						</Box>
						{onCompareToggle && (
							<Box 
								className={`homepage-icon-btn homepage-compare-btn ${isCompareSelected ? 'active' : ''}`}
								onClick={handleCompareClick}
							>
								{isCompareSelected ? <CheckIcon /> : <CompareArrowsIcon />}
							</Box>
						)}
					</Box>
					
					{/* Category Badge - Bottom Left */}
					<span className="homepage-category-badge">{project.projectType}</span>
				</Box>
				<Box
					component={'div'} 
					className={'card-content homepage-mobile-card-content'} 
					onClick={() => pushDetailHandler(project._id)}
				>
					<Typography className={'homepage-card-title'}>{project.projectTitle}</Typography>
					<Typography className={'homepage-card-subtext'}>{project.projectStyle || project.projectType}</Typography>
					<Typography className={'homepage-card-price'}>${project.projectPrice.toLocaleString()}</Typography>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={`trend-card-box ${isCompareSelected ? 'compare-selected' : ''}`} key={project._id} data-project-id={project._id}>
					{/* Image Section */}
					<Box
						component={'div'}
						className={'card-img'}
						onClick={() => router.push(`/property/detail?id=${project._id}`)}
					>
						<img 
						src={`${REACT_APP_API_URL}/${project?.projectImages[0]}`} 
							alt={project.projectTitle}
							className="card-image"
						/>
						
						{/* Soft gradient overlay */}
						<Box className="image-overlay" />
						
						{/* Hover Icons - Top Right */}
						<Box className="hover-icons">
							<Box 
								className={`icon-btn like-btn ${project?.meLiked && project?.meLiked[0]?.myFavorite ? 'active' : ''}`}
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									likeProjectHandler(user, project._id);
								}}
							>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon />
								) : (
									<FavoriteBorderIcon />
								)}
							</Box>
							{onCompareToggle && (
								<Box 
									className={`icon-btn compare-btn ${isCompareSelected ? 'active' : ''}`}
									onClick={handleCompareClick}
								>
									{isCompareSelected ? <CheckIcon /> : <CompareArrowsIcon />}
								</Box>
							)}
						</Box>
						
						{/* Category Badge - Bottom Left */}
						<span className="category-badge">{project.projectType}</span>
					</Box>
					
					{/* Content Section */}
					<Box className={'card-content'}>
						<Box className="content-top">
							<Typography className={'card-title'}>{project.projectTitle}</Typography>
							<Typography className={'card-style'}>{project.projectStyle}</Typography>
							<Typography className={'card-duration'}>
								duration: {project.projectDuration} {project.projectDuration === 1 ? 'month' : 'months'}
							</Typography>
						</Box>
						
						<Box className="content-bottom">
							<Typography className={'card-price'}>${project.projectPrice.toLocaleString()}</Typography>
							<Button 
								className={'details-btn'}
								onClick={() => router.push(`/property/detail?id=${project._id}`)}
							>
								Details
								<ArrowForwardIcon />
							</Button>
						</Box>
					</Box>
				</Stack>
		);
	}
};

export default TrendProjectCard;
