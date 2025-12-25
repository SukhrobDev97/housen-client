import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMobileLang } from '../../hooks/useMobileLang';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { ProjectsInquiry } from '../../types/property/property.input';
import { Project } from '../../types/property/property';
import TopProjectCard from './TopPropertyCard';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PROJECT } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopProjectsProps {
	initialInput: ProjectsInquiry;
}

const TopProjects = (props: TopProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const mobileLang = useMobileLang();
	const isHomePage = router.pathname === '/';
	const [topProjects, setTopProjects] = useState<Project[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);

	const queryInput = {
		...initialInput,
		limit: 8,
		page: 1,
	};

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT)
		
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
			setTopProjects(data?.getProjects?.list || []);
		},
	  });

	/** LIFECYCLES **/
	useEffect(() => {
		if (topProjects.length > 0) {
			const startIndex = (currentPage - 1) * 4;
			const endIndex = startIndex + 4;
			setDisplayedProjects(topProjects.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(topProjects.length / 4));
		}
	}, [topProjects, currentPage]);

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
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (device === 'mobile') {
		// Homepage Mobile - Airbnb Style Layout
		if (isHomePage) {
			return (
				<Stack id="top-properties" className={'top-properties homepage-mobile-top-properties'} spacing={0} sx={{ margin: 0, padding: 0 }}>
					<Stack className={'container'} spacing={0} sx={{ margin: 0, padding: 0 }}>
						<Stack className={'info-box homepage-mobile-info-box'} spacing={0} sx={{ margin: 0, padding: 0 }}>
							<span>{mobileLang === 'ko' ? '인기 프로젝트' : 'Top Projects'}</span>
						</Stack>
						{/* Horizontal Scroll Cards */}
						<Box className={'homepage-mobile-top-scroll-container'} sx={{ margin: 0, padding: 0 }}>
							{topProjects.length === 0 ? (
								<Box component={'div'} className={'empty-list'}>
									Top Projects Empty
								</Box>
							) : (
								<Box className={'homepage-mobile-top-scroll'}>
									{topProjects.map((project: Project) => {
										return (
											<Box key={project._id} className={'homepage-mobile-top-card-wrapper'}>
												<TopProjectCard project={project} likeProjectHandler={likeProjectHandler} />
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
			<Stack id="top-properties" className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Projects</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topProjects.map((project: Project) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={project?._id}>
										<TopProjectCard project={project} likeProjectHandler={likeProjectHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		if (!topProjects || topProjects.length === 0) return null;

		return (
			<Stack id="top-properties" className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<div className={'left'}>
							<span>Leading projects</span>
							<p>Explore our leading project designs</p>
						</div>
						<div className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon 
									className={'swiper-top-prev'} 
									onClick={handlePrevPage}
									sx={{ 
										cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
										opacity: currentPage > 1 ? 1 : 0.5,
									}}
								/>
								<div className={'swiper-top-pagination'}>
									<span>{currentPage} / {totalPages}</span>
								</div>
								<EastIcon 
									className={'swiper-top-next'} 
									onClick={handleNextPage}
									sx={{ 
										cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
										opacity: currentPage < totalPages ? 1 : 0.5,
									}}
								/>
							</div>
						</div>
					</Stack>
					<Stack className={'card-box'}>
						{displayedProjects.length === 0 ? (
							<div className={'empty-list'}>
								Top Projects Empty
							</div>
						) : (
							<Stack 
								className={'top-property-swiper'}
								direction={'row'}
								sx={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									gap: '24px',
								}}
							>
								{displayedProjects.map((project: Project) => {
										return (
										<div key={project._id} className={'top-property-slide'} style={{ flex: '1 1 calc(25% - 18px)' }}>
												<TopProjectCard project={project} likeProjectHandler={likeProjectHandler} />
											</div>
										);
									})}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'projectRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProjects;
