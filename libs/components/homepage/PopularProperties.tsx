import React, { useState, useEffect, useMemo } from 'react';
import { Stack, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMobileLang } from '../../hooks/useMobileLang';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PopularProjectCard from './PopularPropertyCard';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PROJECT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { ProjectType } from '../../enums/property.enum';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface PopularProjectsProps {
	initialInput: ProjectsInquiry;
}

const PopularProjects = (props: PopularProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const mobileLang = useMobileLang();
	const isHomePage = router.pathname === '/';
	const user = useReactiveVar(userVar);
	const [popularProjects, setPopularProjects] = useState<Project[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [selectedType, setSelectedType] = useState<ProjectType | null>(null);

	const queryInput = {
		...initialInput,
		limit: 6,
		page: 1,
	};

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT);

	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	  } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T ) => {
			setPopularProjects(data?.getProjects?.list || []);
		},
	  });

	const likeProjectHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProject({
				variables: { input: id },
			});

			await getProjectsRefetch({ input: queryInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR_LikeProjectHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** FILTERED PROJECTS **/
	const filteredProjects = useMemo(() => {
		if (selectedType === null) {
			return popularProjects;
		}
		return popularProjects.filter((project) => project.projectType === selectedType);
	}, [popularProjects, selectedType]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (filteredProjects.length > 0) {
			const startIndex = (currentPage - 1) * 3;
			const endIndex = startIndex + 3;
			setDisplayedProjects(filteredProjects.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(filteredProjects.length / 3));
		} else {
			setDisplayedProjects([]);
			setTotalPages(1);
		}
	}, [filteredProjects, currentPage]);

	/** HANDLERS **/
	const handleExploreProjects = () => {
		router.push('/property');
	};

	const handleTypeFilter = (type: ProjectType | null) => {
		setSelectedType(type);
		setCurrentPage(1);
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (!popularProjects || popularProjects.length === 0) return null;

	if (device === 'mobile') {
		// Homepage Mobile - Airbnb Style Layout
		if (isHomePage) {
			return (
				<Stack id="popular-properties" className={'popular-properties homepage-mobile-popular-properties'}>
					<Stack className={'container'}>
						<Stack className={'info-box homepage-mobile-info-box'}>
							<span>{mobileLang === 'ko' ? '추천 프로젝트' : 'Featured projects'}</span>
						</Stack>
						{/* Horizontal Scrollable Pill Filter */}
						<Box className={'homepage-mobile-category-filters'}>
							<Button 
								className={`homepage-filter-pill ${selectedType === null ? 'active' : ''}`}
								onClick={() => handleTypeFilter(null)}
							>
								ALL
							</Button>
							{Object.values(ProjectType).map((type) => (
								<Button
									key={type}
									className={`homepage-filter-pill ${selectedType === type ? 'active' : ''}`}
									onClick={() => handleTypeFilter(type)}
								>
									{type}
								</Button>
							))}
						</Box>
						{/* Horizontal Scroll Cards */}
						<Box className={'homepage-mobile-popular-scroll-container'}>
							{filteredProjects.length === 0 ? (
								<Box component={'div'} className={'empty-list'}>
									Popular Projects Empty
								</Box>
							) : (
								<Box className={'homepage-mobile-popular-scroll'}>
									{filteredProjects.map((project: Project) => {
										return (
											<Box key={project._id} className={'homepage-mobile-popular-card-wrapper'}>
												<PopularProjectCard project={project} likeProjectHandler={likeProjectHandler} />
											</Box>
										);
									})}
								</Box>
							)}
						</Box>
					</Stack>
				</Stack>
			);
		}

		// Other Mobile Pages - Original Layout
		return (
			<Stack id="popular-properties" className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Featured projects</span>
					</Stack>
					{/* Category Filter Buttons */}
					<Box className={'category-filter-buttons'}>
						<Button 
							className={`category-btn ${selectedType === null ? 'active' : ''}`}
							onClick={() => handleTypeFilter(null)}
						>
							ALL
						</Button>
						{Object.values(ProjectType).map((type) => (
							<Button
								key={type}
								className={`category-btn ${selectedType === type ? 'active' : ''}`}
								onClick={() => handleTypeFilter(type)}
							>
								{type}
							</Button>
						))}
					</Box>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{filteredProjects.map((project: Project) => {
								return (
									<SwiperSlide key={project._id} className={'popular-property-slide'}>
										<PopularProjectCard project={project} likeProjectHandler={likeProjectHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					{/* Category Filter Buttons */}
					<Box className={'category-filter-buttons'}>
						<Button 
							className={`category-btn ${selectedType === null ? 'active' : ''}`}
							onClick={() => handleTypeFilter(null)}
						>
							ALL
						</Button>
						{Object.values(ProjectType).map((type) => (
							<Button
								key={type}
								className={`category-btn ${selectedType === type ? 'active' : ''}`}
								onClick={() => handleTypeFilter(type)}
							>
								{type}
							</Button>
						))}
					</Box>
					
					{/* Centered Title Section */}
					<Box className={'popular-title-section'}>
						<p className={'popular-collections-text'}>our popular collections</p>
						<h2 className={'hot-title'}>Hot This Year</h2>
					</Box>
					
					{/* Cards Section */}
					<Stack className={'card-box'}>
						{displayedProjects.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Popular Projects Empty
							</Box>
						) : (
							<Stack 
								className={'popular-property-swiper'}
								direction={'row'}
								spacing={3}
								sx={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									gap: '24px',
								}}
							>
								{displayedProjects.map((project: Project) => {
									return (
										<Box key={project._id} className={'popular-property-slide'} sx={{ flex: '1 1 calc(33.333% - 16px)' }}>
											<PopularProjectCard project={project} likeProjectHandler={likeProjectHandler} />
										</Box>
									);
								})}
							</Stack>
						)}
					</Stack>
					
					{/* Pagination */}
					{totalPages > 1 && (
						<Box className={'pagination-controls'}>
							<WestIcon 
								className={'swiper-popular-prev'} 
								onClick={handlePrevPage}
								sx={{ 
									cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
									opacity: currentPage > 1 ? 1 : 0.5,
								}}
							/>
							<div className={'swiper-popular-pagination'}>
								<span>{currentPage} / {totalPages}</span>
							</div>
							<EastIcon 
								className={'swiper-popular-next'} 
								onClick={handleNextPage}
								sx={{ 
									cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
									opacity: currentPage < totalPages ? 1 : 0.5,
								}}
							/>
						</Box>
					)}
					
					{/* Explore Collections Button */}
					<Box className={'explore-collections-btn-wrapper'}>
						<Button 
							className={'explore-collections-btn'}
							onClick={handleExploreProjects}
							endIcon={<ArrowForwardIcon />}
						>
							Explore Collections
						</Button>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

PopularProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'projectViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProjects;
