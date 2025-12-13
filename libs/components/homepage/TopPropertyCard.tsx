import React, { useRef, useCallback } from 'react';
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
	
	// Refs for parallax effect
	const cardRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const rafRef = useRef<number | null>(null);

	/** HANDLERS **/
	const pushDetailHandler = async (projectId: string) => {
		console.log('CLICKED_PROPERTY_ID:', projectId);
		await router.push({pathname: '/property/detail', query: { id : projectId}});
	}

	// Parallax mouse move handler
	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current || !imageRef.current) return;
		
		// Cancel any pending animation frame
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}
		
		rafRef.current = requestAnimationFrame(() => {
			if (!cardRef.current || !imageRef.current) return;
			
			const rect = cardRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			
			// Calculate offset from center (inverted for opposite direction movement)
			const x = (centerX - e.clientX) / 25;
			const y = (centerY - e.clientY) / 25;
			
			imageRef.current.style.transform = `scale(1.04) translate(${x}px, ${y}px)`;
		});
	}, []);

	// Reset parallax on mouse leave
	const handleMouseLeave = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}
		
		if (imageRef.current) {
			imageRef.current.style.transform = 'scale(1) translate(0, 0)';
		}
	}, []);

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box" key={project._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
					onClick={() => pushDetailHandler(project._id)}
				>
					{/* Top Rated Badge */}
					<div className={'top-rated-badge'}>Top Rated</div>
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
				ref={cardRef}
				onClick={() => router.push(`/property/detail?id=${project._id}`)}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{/* Image Layer */}
				<Box className="card-img">
					{/* Top Rated Badge */}
					<div className={'top-rated-badge'}>Top Rated</div>
					
					<img 
						ref={imageRef}
						src={`${REACT_APP_API_URL}/${project?.projectImages[0]}`} 
						alt={project.projectTitle}
						className="card-image"
						onClick={() => pushDetailHandler(project._id)}
					/>
					<Box className="image-gradient" />
					{/* Hover Gradient Overlay */}
					<Box className="hover-gradient-overlay" />
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
