import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularProjectCard from './PopularPropertyCard';
import { Project } from '../../types/property/property';
import Link from 'next/link';
import { ProjectsInquiry } from '../../types/property/property.input';

interface PopularProjectsProps {
	initialInput: ProjectsInquiry;
}

const PopularProjects = (props: PopularProjectsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProjects, setPopularProjects] = useState<Project[]>([]);

	/** APOLLO REQUESTS **/
	/** HANDLERS **/

	if (!popularProjects) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular projects</span>
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
							<span>Popular projects</span>
							<p> Most viewed projects</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>Explore more projects</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
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
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'projectViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProjects;
