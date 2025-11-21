import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import TrendPropertyCard from './TrendPropertyCard';
import TrendProjectCard from './TrendPropertyCard';

interface TrendProjectsProps {
	initialInput: ProjectsInquiry;
}

const TrendProjects = (props: TrendProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProjects, setTrendProjects] = useState<Project[]>([]);

	/** APOLLO REQUESTS **/
	/** HANDLERS **/

	if (trendProjects) console.log('trendProjects:', trendProjects);
	if (!trendProjects) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Projects</span>
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
											<TrendProjectCard project={project} />
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
							<span>Trend Projects</span>
							<p>Most viewed projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
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
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendProjects.map((project: Project) => {
									return (
										<SwiperSlide key={project._id} className={'trend-property-slide'}>
											<TrendProjectCard project={project} />
										</SwiperSlide>
									);
								})}
							</Swiper>
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
		limit: 8,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProjects;
