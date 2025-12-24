import React, { useState, useEffect, useMemo } from 'react';
import { Stack, Box, Typography, Button, Skeleton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Project } from '../../types/property/property';
import { Member } from '../../types/member/member';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { ProjectType, ProjectStyle } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { T } from '../../types/common';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// Type icons mapping
const typeIcons: Record<ProjectType, string> = {
	[ProjectType.RESIDENTIAL]: '🏠',
	[ProjectType.COMMERCIAL]: '🏢',
	[ProjectType.OFFICE]: '💼',
	[ProjectType.ENTERTAINMENT]: '🎭',
};

// Style icons mapping
const styleIcons: Record<ProjectStyle, string> = {
	[ProjectStyle.MODERN]: '✨',
	[ProjectStyle.MINIMAL]: '◻️',
	[ProjectStyle.CLASSIC]: '🏛️',
	[ProjectStyle.TRADITIONAL]: '🏡',
	[ProjectStyle.INDUSTRIAL]: '⚙️',
	[ProjectStyle.SCANDINAVIAN]: '🌿',
};

const GetMatchedSection = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Step management
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
	const [selectedStyle, setSelectedStyle] = useState<ProjectStyle | null>(null);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [suggestedProjects, setSuggestedProjects] = useState<Project[]>([]);
	const [matchedAgency, setMatchedAgency] = useState<Member | null>(null);

	// Build query input: Fetch broad set of projects, filter client-side
	// Removed typeList and projectStyleList to avoid backend AND filtering
	const queryInput = useMemo(() => ({
		page: 1,
		limit: 50, // Increased to ensure enough projects for client-side filtering
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	}), []); // Empty deps - query is constant, filtering happens in onCompleted

	/** APOLLO REQUESTS **/
	const {
		loading: matchingLoading,
		data: matchingData,
		error: matchingError,
	} = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		skip: !selectedType || !selectedStyle,
		onCompleted: (data: T) => {
			console.log('GET_PROJECTS completed:', data);
			const allProjects = data?.getProjects?.list || [];
			console.log('All projects count:', allProjects.length);
			console.log('Selected filters:', { selectedType, selectedStyle });
			
			// Filter projects based on selected type and style
			let filtered = allProjects;
			
			if (selectedType && selectedStyle) {
				// Try exact match first
				filtered = allProjects.filter((p: Project) => 
					p.projectType === selectedType && p.projectStyle === selectedStyle
				);
				console.log('Exact match count:', filtered.length);
				
				// If no exact match, try matching just type
				if (filtered.length === 0) {
					filtered = allProjects.filter((p: Project) => 
						p.projectType === selectedType
					);
					console.log('Type match count:', filtered.length);
				}
				
				// If still no match, try matching just style
				if (filtered.length === 0) {
					filtered = allProjects.filter((p: Project) => 
						p.projectStyle === selectedStyle
					);
					console.log('Style match count:', filtered.length);
				}
				
				// If still nothing, show all available
				if (filtered.length === 0) {
					filtered = allProjects;
					console.log('Showing all projects:', filtered.length);
				}
			}
			
			console.log('Final filtered projects:', filtered.length);
			setSuggestedProjects(filtered.slice(0, 3));
		},
		onError: (error) => {
			console.log('GET_PROJECTS error:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (selectedProject && selectedProject.memberData) {
			setMatchedAgency(selectedProject.memberData);
		}
	}, [selectedProject]);

	/** HANDLERS **/
	const handleTypeSelect = (type: ProjectType) => {
		setSelectedType(type);
		setSelectedStyle(null);
		setSelectedProject(null);
		setMatchedAgency(null);
		setSuggestedProjects([]);
		setCurrentStep(2);
	};

	const handleStyleSelect = (style: ProjectStyle) => {
		setSelectedStyle(style);
		setSelectedProject(null);
		setMatchedAgency(null);
		setCurrentStep(3);
	};

	const handleProjectSelect = (project: Project) => {
		setSelectedProject(project);
		if (project.memberData) {
			setMatchedAgency(project.memberData);
			setCurrentStep(4);
		}
	};

	const handleReset = () => {
		setCurrentStep(1);
		setSelectedType(null);
		setSelectedStyle(null);
		setSelectedProject(null);
		setMatchedAgency(null);
		setSuggestedProjects([]);
	};

	const handleViewAgency = () => {
		if (matchedAgency?._id) {
			router.push(`/agent/detail?agentId=${matchedAgency._id}`);
		}
	};

	// Project Types array
	const projectTypes = Object.values(ProjectType);
	// Project Styles array
	const projectStyles = Object.values(ProjectStyle);

	/** RENDER COMPONENTS **/

	// Step 1: Select Project Type
	const renderTypeSelection = () => (
		<Box className="selection-step">
			<Box className="step-header">
				<Typography className="step-number">Step 1</Typography>
				<Typography className="step-title">What type of space are you designing?</Typography>
				<Typography className="step-desc">Choose the category that best fits your project</Typography>
			</Box>
			<Box className="options-grid type-grid">
				{projectTypes.map((type) => (
					<Box
						key={type}
						className={`option-card ${selectedType === type ? 'selected' : ''}`}
						onClick={() => handleTypeSelect(type)}
					>
						<span className="option-icon">{typeIcons[type]}</span>
						<Typography className="option-label">{type}</Typography>
						{selectedType === type && <CheckCircleIcon className="check-icon" />}
					</Box>
				))}
			</Box>
		</Box>
	);

	// Step 2: Select Project Style
	const renderStyleSelection = () => (
		<Box className="selection-step">
			<Box className="step-header">
				<Typography className="step-number">Step 2</Typography>
				<Typography className="step-title">What's your preferred design style?</Typography>
				<Typography className="step-desc">Select the aesthetic that matches your vision</Typography>
			</Box>
			<Box className="options-grid style-grid">
				{projectStyles.map((style) => (
					<Box
						key={style}
						className={`option-card pill ${selectedStyle === style ? 'selected' : ''}`}
						onClick={() => handleStyleSelect(style)}
					>
						<span className="option-icon">{styleIcons[style]}</span>
						<Typography className="option-label">{style}</Typography>
						{selectedStyle === style && <CheckCircleIcon className="check-icon" />}
					</Box>
				))}
			</Box>
		</Box>
	);

	// Step 3: Project Cards
	const getProjectsDescription = () => {
		const count = suggestedProjects.length;
		if (count === 0) return '';
		if (count === 1) return `Found 1 matching ${selectedType?.toLowerCase()} project in ${selectedStyle?.toLowerCase()} style`;
		return `Found ${count} matching ${selectedType?.toLowerCase()} projects in ${selectedStyle?.toLowerCase()} style`;
	};

	const renderProjectSelection = () => (
		<Box className="selection-step">
			<Box className="step-header">
				<Typography className="step-number">Step 3</Typography>
				<Typography className="step-title">Choose a project that inspires you</Typography>
				{!matchingLoading && suggestedProjects.length > 0 && (
					<Typography className="step-desc">{getProjectsDescription()}</Typography>
				)}
				{matchingLoading && (
					<Typography className="step-desc">Searching for matching projects...</Typography>
				)}
			</Box>

				{matchingLoading ? (
					<Box className="projects-grid">
					{[1, 2, 3].map((i) => (
						<Box key={i} className="project-card skeleton">
								<Skeleton variant="rectangular" className="skeleton-image" />
								<Box className="skeleton-content">
									<Skeleton variant="text" width="80%" height={24} />
								<Skeleton variant="text" width="50%" height={18} />
								</Box>
							</Box>
						))}
					</Box>
			) : suggestedProjects.length === 0 ? (
				<Box className="empty-state">
					<Typography className="empty-title">No matching projects found</Typography>
					<Typography className="empty-desc">Try changing the style or type for more results.</Typography>
					<Button className="reset-btn" onClick={handleReset}>
						Start Over
					</Button>
				</Box>
			) : (
				<Box className={`projects-grid projects-count-${suggestedProjects.length}`}>
						{suggestedProjects.map((project) => (
							<Box
								key={project._id}
								className={`project-card ${selectedProject?._id === project._id ? 'selected' : ''}`}
								onClick={() => handleProjectSelect(project)}
							>
								<Box className="project-image">
									<img
										src={`${REACT_APP_API_URL}/${project.projectImages[0]}`}
										alt={project.projectTitle}
									/>
								<Box className="project-overlay">
									<span className="project-style">{project.projectStyle}</span>
								</Box>
									{selectedProject?._id === project._id && (
									<Box className="selected-badge">
											<CheckCircleIcon />
										</Box>
									)}
								</Box>
								<Box className="project-info">
									<Typography className="project-title">{project.projectTitle}</Typography>
								<Box className="project-stats">
									<span>
										<VisibilityOutlinedIcon /> {project.projectViews || 0}
									</span>
									<span>
										<FavoriteBorderIcon /> {project.projectLikes || 0}
									</span>
								</Box>
								</Box>
							</Box>
						))}
					</Box>
			)}
		</Box>
	);

	// Step 4: Matched Agency
	const renderMatchedAgency = () => {
		if (!matchedAgency) return null;

		return (
			<Box className="matched-agency-section">
				<Box className="step-header">
					<Typography className="step-number">Perfect Match!</Typography>
					<Typography className="step-title">We found your ideal design agency</Typography>
				</Box>

				<Box className="agency-card">
					<Box className="agency-image-wrapper">
						<img
							src={
								matchedAgency.memberImage
									? `${REACT_APP_API_URL}/${matchedAgency.memberImage}`
									: '/img/profile/defaultUser.svg'
							}
							alt={matchedAgency.memberFullName || matchedAgency.memberNick}
							className="agency-image"
						/>
						{matchedAgency.memberRank && matchedAgency.memberRank >= 3 && (
							<Box className="rank-badge">
								<WorkspacePremiumIcon />
								<span>Top Agency</span>
							</Box>
						)}
					</Box>

					<Box className="agency-details">
						<Typography className="agency-name">
							{matchedAgency.memberFullName || matchedAgency.memberNick}
						</Typography>

						{matchedAgency.memberAddress && (
							<Box className="agency-location">
								<LocationOnOutlinedIcon />
								<span>{matchedAgency.memberAddress}</span>
							</Box>
						)}

						{matchedAgency.memberDesc && (
							<Typography className="agency-desc">{matchedAgency.memberDesc}</Typography>
						)}

						<Box className="agency-stats">
							<Box className="stat">
								<BusinessIcon />
								<span>{matchedAgency.memberProjects || 0} Projects</span>
							</Box>
							<Box className="stat">
								<VisibilityOutlinedIcon />
								<span>{matchedAgency.memberViews || 0} Views</span>
							</Box>
							<Box className="stat">
								<FavoriteBorderIcon />
								<span>{matchedAgency.memberLikes || 0} Likes</span>
							</Box>
							{matchedAgency.memberRank && (
								<Box className="stat rank">
									<StarIcon />
									<span>Rank #{matchedAgency.memberRank}</span>
								</Box>
							)}
						</Box>

						<Box className="agency-actions">
							<Button className="view-profile-btn" onClick={handleViewAgency}>
							View Agency Profile
								<ArrowForwardIcon />
							</Button>
							<Button className="reset-btn" onClick={handleReset}>
								Find Another
						</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	};

	// Progress indicator
	const renderProgress = () => (
		<Box className="progress-indicator">
			{[1, 2, 3, 4].map((step) => (
				<Box
					key={step}
					className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
				>
					<span className="step-dot">{currentStep > step ? '✓' : step}</span>
					<span className="step-label">
						{step === 1 && 'Type'}
						{step === 2 && 'Style'}
						{step === 3 && 'Project'}
						{step === 4 && 'Agency'}
					</span>
				</Box>
			))}
		</Box>
	);

	if (device === 'mobile') {
		return (
			<Stack className="get-matched-section">
				<Stack className="container">
					<Box className="section-header">
						<Typography className="section-title">Get Matched</Typography>
						<Typography className="section-subtitle">
							Find your perfect design agency in just 4 steps
						</Typography>
					</Box>

					{renderProgress()}

					<Box className="content-wrapper">
						{currentStep === 1 && renderTypeSelection()}
						{currentStep === 2 && renderStyleSelection()}
						{currentStep === 3 && renderProjectSelection()}
						{currentStep === 4 && renderMatchedAgency()}
					</Box>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="get-matched-section">
			<Stack className="container">
						<Box className="section-header">
					<Box className="header-content">
						<Typography className="section-label">Personalized Matching</Typography>
						<Typography className="section-title">Get Matched with Your Ideal Agency</Typography>
						<Typography className="section-subtitle">
							Tell us about your project preferences, and we'll connect you with the perfect design agency
							</Typography>
						</Box>
							</Box>

				{renderProgress()}

				<Box className="main-content">
					<Box className="steps-container">
						{currentStep === 1 && renderTypeSelection()}
						{currentStep === 2 && renderStyleSelection()}
						{currentStep === 3 && renderProjectSelection()}
						{currentStep === 4 && renderMatchedAgency()}
							</Box>

					{/* Sidebar with selections summary */}
					{currentStep > 1 && currentStep < 4 && (
						<Box className="selections-summary">
							<Typography className="summary-title">Your Selections</Typography>
							{selectedType && (
								<Box className="summary-item">
									<span className="label">Type:</span>
									<span className="value">
										{typeIcons[selectedType]} {selectedType}
									</span>
							</Box>
							)}
							{selectedStyle && (
								<Box className="summary-item">
									<span className="label">Style:</span>
									<span className="value">
										{styleIcons[selectedStyle]} {selectedStyle}
									</span>
							</Box>
							)}
							<Button className="change-btn" onClick={handleReset}>
								Start Over
							</Button>
						</Box>
					)}
				</Box>
			</Stack>
		</Stack>
	);
};

export default GetMatchedSection;
