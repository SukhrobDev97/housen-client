import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckIcon from '@mui/icons-material/Check';
import { Project } from '../../types/property/property';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
			<Stack className={`trend-card-box ${isCompareSelected ? 'compare-selected' : ''}`} key={project._id} data-project-id={project._id}>
					<Box
						component={'div'}
						className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
						onClick={() => pushDetailHandler(project._id)}
					>
						<span className="category-badge">{project.projectType}</span>
					{/* Compare Checkbox */}
					{onCompareToggle && (
						<Box 
							className={`compare-checkbox ${isCompareSelected ? 'active' : ''}`}
							onClick={handleCompareClick}
						>
							{isCompareSelected && <CheckIcon />}
						</Box>
					)}
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
						
					{/* Compare Checkbox */}
					{onCompareToggle && (
						<Box 
							className={`compare-checkbox ${isCompareSelected ? 'active' : ''}`}
							onClick={handleCompareClick}
						>
							{isCompareSelected && <CheckIcon />}
						</Box>
					)}
						
						{/* Category Badge - Bottom Left */}
						<span className="category-badge">{project.projectType}</span>
						
						{/* Stats - Bottom Right on Image */}
						<Box className="image-stats">
							<Box className="stat-chip">
								<VisibilityOutlinedIcon />
								<span>{project?.projectViews || 0}</span>
							</Box>
							<Box 
								className="stat-chip"
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
							<Box className="stat-chip">
								<AccessTimeIcon />
								<span>{project.projectDuration}mo</span>
							</Box>
						</Box>
					</Box>
					
					{/* Content Section */}
					<Box className={'card-content'}>
						<Box className="content-top">
							<Typography className={'card-title'}>{project.projectTitle}</Typography>
							<Typography className={'card-style'}>{project.projectStyle}</Typography>
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
