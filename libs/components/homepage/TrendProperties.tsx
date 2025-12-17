import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import TrendProjectCard from './TrendPropertyCard';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PROJECT } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { REACT_APP_API_URL } from '../../config';

interface TrendProjectsProps {
	initialInput: ProjectsInquiry;
}

const TrendProjects = (props: TrendProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProjects, setTrendProjects] = useState<Project[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [isTransitioning, setIsTransitioning] = useState(false);
	
	// Compare feature state
	const [compareList, setCompareList] = useState<Project[]>([]);
	const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

	const ITEMS_PER_PAGE = 6;

	const queryInput = {
		...initialInput,
		limit: 18,
		page: 1,
	};

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT)

	const {
		loading: getProjectssLoading,
		data: getProjectssData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	  } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T ) => {
		  setTrendProjects(data?.getProjects?.list || []);
		},
	  });

	/** LIFECYCLES **/
	useEffect(() => {
		if (trendProjects.length > 0) {
			const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
			const endIndex = startIndex + ITEMS_PER_PAGE;
			setDisplayedProjects(trendProjects.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(trendProjects.length / ITEMS_PER_PAGE));
		}
	}, [trendProjects, currentPage]);

	/** HANDLERS **/
	const likeProjectHandler = async (userId: string, id: string) => {
		try {
		if (!id) return;
		if (!userId) throw new Error(Message.NOT_AUTHENTICATED);
	
		await likeTargetProject({
			variables: { input: id },
		});
	
		await getProjectsRefetch({ input: initialInput });
	
		await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
		console.log('ERROR_LikeProjectHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages && !isTransitioning) {
			setIsTransitioning(true);
			setTimeout(() => {
			setCurrentPage(currentPage + 1);
				setTimeout(() => setIsTransitioning(false), 50);
			}, 300);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1 && !isTransitioning) {
			setIsTransitioning(true);
			setTimeout(() => {
			setCurrentPage(currentPage - 1);
				setTimeout(() => setIsTransitioning(false), 50);
			}, 300);
		}
	};

	// Compare handlers
	const handleCompareToggle = (project: Project) => {
		const isAlreadySelected = compareList.some(p => p._id === project._id);
		
		if (isAlreadySelected) {
			setCompareList(compareList.filter(p => p._id !== project._id));
		} else {
			if (compareList.length >= 3) {
				sweetMixinErrorAlert('You can compare up to 3 projects.');
				return;
			}
			setCompareList([...compareList, project]);
		}
	};

	const handleClearCompare = () => {
		setCompareList([]);
	};

	const handleOpenCompareModal = () => {
		if (compareList.length >= 2) {
			setIsCompareModalOpen(true);
			document.body.style.overflow = 'hidden';
		}
	};

	const handleCloseCompareModal = () => {
		setIsCompareModalOpen(false);
		document.body.style.overflow = '';
	};

	const isProjectSelected = (projectId: string) => {
		return compareList.some(p => p._id === projectId);
	};

	if (trendProjects) console.log('trendProjects:', trendProjects);
	if (!trendProjects || trendProjects.length === 0) return null;

	// Compare Modal Component
	const CompareModal = () => {
		if (!isCompareModalOpen) return null;

		return (
			<Box className="compare-modal-overlay" onClick={handleCloseCompareModal}>
				<Box className="compare-modal" onClick={(e) => e.stopPropagation()}>
					<Box className="compare-modal-header">
						<Typography className="compare-modal-title">Compare Projects</Typography>
						<IconButton className="compare-modal-close" onClick={handleCloseCompareModal}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box className="compare-modal-content">
						<Box className="compare-grid" style={{ gridTemplateColumns: `repeat(${compareList.length}, 1fr)` }}>
							{compareList.map((project) => (
								<Box key={project._id} className="compare-item">
									<Box className="compare-item-image">
										<img 
											src={`${REACT_APP_API_URL}/${project.projectImages[0]}`} 
											alt={project.projectTitle}
										/>
									</Box>
									<Box className="compare-item-details">
										<Box className="compare-row">
											<span className="compare-label">Title</span>
											<span className="compare-value title">{project.projectTitle}</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Category</span>
											<span className="compare-value">{project.projectType}</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Style</span>
											<span className="compare-value">{project.projectStyle}</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Price</span>
											<span className="compare-value price">${project.projectPrice.toLocaleString()}</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Duration</span>
											<span className="compare-value">
												<AccessTimeIcon sx={{ fontSize: 16 }} />
												{project.projectDuration} months
											</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Views</span>
											<span className="compare-value">
												<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
												{project.projectViews || 0}
											</span>
										</Box>
										<Box className="compare-row">
											<span className="compare-label">Likes</span>
											<span className="compare-value">
												<FavoriteIcon sx={{ fontSize: 16, color: '#ff6b6b' }} />
												{project.projectLikes || 0}
											</span>
										</Box>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	};

	// Sticky Compare Bar Component
	const CompareBar = () => {
		if (compareList.length === 0) return null;

		return (
			<Box className={`compare-sticky-bar ${compareList.length > 0 ? 'visible' : ''}`}>
				<Box className="compare-bar-content">
					<Box className="compare-bar-left">
						<CompareArrowsIcon />
						<Typography className="compare-bar-text">
							{compareList.length} project{compareList.length > 1 ? 's' : ''} selected
						</Typography>
					</Box>
					<Box className="compare-bar-actions">
						<Button 
							className="compare-bar-btn primary"
							onClick={handleOpenCompareModal}
							disabled={compareList.length < 2}
						>
							Compare ({compareList.length})
						</Button>
						<Button 
							className="compare-bar-btn secondary"
							onClick={handleClearCompare}
						>
							Clear All
						</Button>
					</Box>
				</Box>
			</Box>
		);
	};

	if (device === 'mobile') {
		return (
			<>
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trending Designs</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendProjects.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trending Projects Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendProjects.map((project: Project) => {
									return (
										<SwiperSlide key={project._id} className={'trend-property-slide'}>
												<TrendProjectCard 
													project={project} 
													likeProjectHandler={likeProjectHandler}
													isCompareSelected={isProjectSelected(project._id)}
													onCompareToggle={handleCompareToggle}
												/>
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
				<CompareBar />
				<CompareModal />
			</>
		);
	} else {
		return (
			<>
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Designs</span>
							<p>Most viewed projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
								{totalPages > 1 && (
							<div className={'pagination-box'}>
								<WestIcon 
									className={'swiper-trend-prev'} 
									onClick={handlePrevPage}
									sx={{ 
												cursor: currentPage > 1 && !isTransitioning ? 'pointer' : 'not-allowed',
										opacity: currentPage > 1 ? 1 : 0.5,
									}}
								/>
								<div className={'swiper-trend-pagination'}>
									<span>{currentPage} / {totalPages}</span>
								</div>
								<EastIcon 
									className={'swiper-trend-next'} 
									onClick={handleNextPage}
									sx={{ 
												cursor: currentPage < totalPages && !isTransitioning ? 'pointer' : 'not-allowed',
										opacity: currentPage < totalPages ? 1 : 0.5,
									}}
								/>
							</div>
								)}
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProjects.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trending Projects Empty
							</Box>
						) : (
								<Box 
									className={`trend-property-grid ${isTransitioning ? 'fade-out' : 'fade-in'}`}
							>
								{displayedProjects.map((project: Project) => {
									return (
											<Box key={project._id} className={'trend-property-slide'}>
												<TrendProjectCard 
													project={project} 
													likeProjectHandler={likeProjectHandler}
													isCompareSelected={isProjectSelected(project._id)}
													onCompareToggle={handleCompareToggle}
												/>
										</Box>
									);
								})}
								</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
				<CompareBar />
				<CompareModal />
			</>
		);
	}
};

TrendProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'projectLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProjects;
