import React, { useRef, useCallback, useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Project } from '../../types/property/property';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopProjectCardProps {
	project: Project;
	likeProjectHandler: any;
}

const TopProjectCard = (props: TopProjectCardProps) => {
	const { project, likeProjectHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Independent states for Like and Save
	const [isSaved, setIsSaved] = useState(false);
	const isLiked = project?.meLiked && project?.meLiked[0]?.myFavorite;
	
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
		const isHomePage = router.pathname === '/';
		
		// Homepage Mobile - Match TrendProjects style with desktop icons
		if (isHomePage) {
			return (
				<Stack className="top-card-box homepage-mobile-top-card" key={project._id}>
					<Box
						component={'div'}
						className={'card-img homepage-mobile-top-card-img'}
						style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
						onClick={() => pushDetailHandler(project._id)}
					>
						{/* Desktop-style Icons on Image - Top Right */}
						<Box className="homepage-mobile-top-card-icons">
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
						
						{/* Top Rated Badge - Top Left */}
						<div className={'homepage-top-rated-badge'}>Top Rated</div>
						
						{/* Category Badge - Bottom Left */}
						<span className="homepage-top-category-badge">{project.projectType}</span>
					</Box>
					<Box 
						component={'div'} 
						className={'card-content homepage-mobile-top-card-content'} 
						onClick={() => pushDetailHandler(project._id)}
					>
						<Typography className={'homepage-top-card-title'}>{project.projectTitle}</Typography>
						<Typography className={'homepage-top-card-subtext'}>{project.projectType}</Typography>
						<Typography className={'homepage-top-card-price'}>${project.projectPrice.toLocaleString()}</Typography>
					</Box>
				</Stack>
			);
		}

		// Other Mobile Pages - Original Layout (fallback for non-homepage)
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
					
					{/* Hover Icons - Top Right (below badge) */}
					<Box className="hover-icons">
						<Box 
							className={`icon-btn like-btn ${isLiked ? 'active' : ''}`}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								likeProjectHandler(user, project._id);
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
				
				{/* Glass Overlay Info Section */}
				<Box className="glass-info">
					{/* Title */}
					<Typography 
						className="card-title"
						onClick={() => pushDetailHandler(project._id)}
					>
						{project.projectTitle}
					</Typography>
					
					{/* Style + Duration Info */}
					<Typography className="card-meta">
						{project.projectStyle} • duration: {project.projectDuration} {project.projectDuration === 1 ? 'month' : 'months'}
					</Typography>
					
					{/* Bottom Row: Price + CTA */}
					<Box className="bottom-row">
						<Typography className="card-price">
							${project.projectPrice.toLocaleString()}
						</Typography>
						
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
