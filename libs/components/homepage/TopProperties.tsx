import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { ProjectsInquiry } from '../../types/property/property.input';
import { Project } from '../../types/property/property';
import TopProjectCard from './TopPropertyCard';

interface TopProjectsProps {
	initialInput: ProjectsInquiry;
}

const TopProjects = (props: TopProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topProjects, setTopProjects] = useState<Project[]>([]);

	/** APOLLO REQUESTS **/
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
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
										<TopProjectCard project={project} />
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
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top projects</span>
							<p>Check out our Top Projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topProjects.map((project: Project) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={project?._id}>
										<TopProjectCard project={project} />
									</SwiperSlide>
								);
							})}
						</Swiper>
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
