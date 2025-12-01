import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
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

	const queryInput = {
		...initialInput,
		limit: 6,
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
			const startIndex = (currentPage - 1) * 3;
			const endIndex = startIndex + 3;
			setDisplayedProjects(trendProjects.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(trendProjects.length / 3));
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
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (trendProjects) console.log('trendProjects:', trendProjects);
	if (!trendProjects || trendProjects.length === 0) return null;

	if (device === 'mobile') {
		return (
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
											<TrendProjectCard project={project} likeProjectHandler={likeProjectHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Designs</span>
							<p>Most viewed projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon 
									className={'swiper-trend-prev'} 
									onClick={handlePrevPage}
									sx={{ 
										cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
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
										cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
										opacity: currentPage < totalPages ? 1 : 0.5,
									}}
								/>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProjects.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trending Projects Empty
							</Box>
						) : (
							<Stack 
								className={'trend-property-swiper'}
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
										<Box key={project._id} className={'trend-property-slide'} sx={{ flex: '1 1 calc(33.333% - 16px)' }}>
											<TrendProjectCard project={project} likeProjectHandler={likeProjectHandler} />
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
