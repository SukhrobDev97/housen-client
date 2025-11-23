import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularProjectCard from './PopularPropertyCard';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';

interface PopularProjectsProps {
	initialInput: ProjectsInquiry;
}

const PopularProjects = (props: PopularProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProjects, setPopularProjects] = useState<Project[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);

	const queryInput = {
		...initialInput,
		limit: 6,
		page: 1,
	};

	/** APOLLO REQUESTS **/
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

	/** LIFECYCLES **/
	useEffect(() => {
		if (popularProjects.length > 0) {
			const startIndex = (currentPage - 1) * 2;
			const endIndex = startIndex + 2;
			setDisplayedProjects(popularProjects.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(popularProjects.length / 2));
		}
	}, [popularProjects, currentPage]);

	/** HANDLERS **/
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
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Featured projects</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularProjects.map((project: Project) => {
								return (
									<SwiperSlide key={project._id} className={'popular-property-slide'}>
										<PopularProjectCard project={project} />
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
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Featured projects</span>
							<p> Most viewed projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
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
							</div>
						</Box>
					</Stack>
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
										<Box key={project._id} className={'popular-property-slide'} sx={{ flex: '1 1 calc(50% - 12px)' }}>
											<PopularProjectCard project={project} />
										</Box>
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
