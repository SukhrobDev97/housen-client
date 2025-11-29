import React, { useState, useRef } from 'react';
import { Stack, Box, Typography, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import 'swiper/css';
import 'swiper/css/navigation';

interface Testimonial {
	quote: string;
	description: string;
	name: string;
	role: string;
	image: string;
}

interface BeforeAfterItem {
	id: string;
	beforeImage: string;
	afterImage: string;
	title: string;
	testimonial: Testimonial;
}

const BeforeAfterTestimonials = () => {
	const device = useDeviceDetect();
	const [activeIndex, setActiveIndex] = useState(0);
	const [showAfter, setShowAfter] = useState(true);
	const swiperRef = useRef<SwiperType | null>(null);

	const beforeAfterItems: BeforeAfterItem[] = [
		{
			id: 'cafe',
			beforeImage: '/img/beforeAfter/cafeBefore.jpeg',
			afterImage: '/img/beforeAfter/cafeAfter.jpeg',
			title: 'Modern Cafe Transformation',
			testimonial: {
				quote: 'The Wall Paneling',
				description: 'Absolutely transformative! The wall paneling has elevated the look and feel of our space.',
				name: 'Mr. Steven Colgan',
				role: 'Client',
				image: '/img/profile/defaultUser.svg',
			},
		},
		{
			id: 'office',
			beforeImage: '/img/beforeAfter/officeBefore.jpeg',
			afterImage: '/img/beforeAfter/officeAfter.jpeg',
			title: 'Contemporary Office Design',
			testimonial: {
				quote: 'Amazing Design Results',
				description: 'The design results are simply amazing! Every detail exceeded our expectations.',
				name: 'Mrs. Gladys Halter',
				role: 'Project Owner',
				image: '/img/profile/defaultUser.svg',
			},
		},
		{
			id: 'livingRoom',
			beforeImage: '/img/beforeAfter/livingRoomBefore.jpeg',
			afterImage: '/img/beforeAfter/livingRoomAfter.jpeg',
			title: 'Luxury Living Room Makeover',
			testimonial: {
				quote: 'Vase Focal Points',
				description: 'The vase arrangements have become the perfect focal point in our room!',
				name: 'Mr. Edward Malone',
				role: 'Design Seeker',
				image: '/img/profile/defaultUser.svg',
			},
		},
	];

	const currentItem = beforeAfterItems[activeIndex];
	const currentImage = showAfter ? currentItem.afterImage : currentItem.beforeImage;

	const handlePrev = () => {
		const newIndex = activeIndex > 0 ? activeIndex - 1 : beforeAfterItems.length - 1;
		setActiveIndex(newIndex);
		setShowAfter(true);
	};

	const handleNext = () => {
		const newIndex = activeIndex < beforeAfterItems.length - 1 ? activeIndex + 1 : 0;
		setActiveIndex(newIndex);
		setShowAfter(true);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'before-after-testimonials'}>
				<Stack className={'container'}>
					<Box className={'section-header-mobile'}>
						<Typography className={'section-label'}>BEFORE / AFTER DESIGN</Typography>
						<Typography className={'section-title'}>Our Interior Design Completed Projects</Typography>
					</Box>

					<Box className={'toggle-button-wrapper'}>
						<Button
							className={`toggle-btn ${!showAfter ? 'active' : ''}`}
							onClick={() => setShowAfter(false)}
						>
							Before
						</Button>
						<Button
							className={`toggle-btn ${showAfter ? 'active' : ''}`}
							onClick={() => setShowAfter(true)}
						>
							After
						</Button>
					</Box>

					<Box className={'image-section-mobile'}>
						<Box
							className={'main-image-mobile'}
							style={{ backgroundImage: `url(${currentImage})` }}
						/>
					</Box>

					<Box className={'testimonial-card-mobile'}>
						<Typography className={'testimonial-quote'}>"{currentItem.testimonial.quote}"</Typography>
						<Typography className={'testimonial-description'}>{currentItem.testimonial.description}</Typography>
						<Box className={'testimonial-author'}>
							<img src={currentItem.testimonial.image} alt={currentItem.testimonial.name} />
							<Box>
								<Typography className={'author-name'}>{currentItem.testimonial.name}</Typography>
								<Typography className={'author-role'}>{currentItem.testimonial.role}</Typography>
							</Box>
						</Box>
					</Box>

					<Box className={'navigation-mobile'}>
						<IconButton onClick={handlePrev} className={'nav-btn'}>
							<WestIcon />
						</IconButton>
						<Typography className={'pagination-text'}>{activeIndex + 1} / {beforeAfterItems.length}</Typography>
						<IconButton onClick={handleNext} className={'nav-btn'}>
							<EastIcon />
						</IconButton>
					</Box>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'before-after-testimonials'}>
				<Stack className={'container'}>
					<Box className={'before-after-content-wrapper'}>
						{/* Left Content Section */}
						<Box className={'left-content-section'}>
							<Typography className={'section-label'}>BEFORE / AFTER DESIGN</Typography>
							<Typography className={'section-title'}>
								Our <span className={'highlight'}>Interior Design</span> Completed Projects
							</Typography>
							<Box className={'toggle-button-wrapper'}>
								<Button
									className={`toggle-btn ${!showAfter ? 'active' : ''}`}
									onClick={() => setShowAfter(false)}
								>
									Before
								</Button>
								<Button
									className={`toggle-btn ${showAfter ? 'active' : ''}`}
									onClick={() => setShowAfter(true)}
								>
									After
								</Button>
							</Box>
						</Box>

						{/* Image Section */}
						<Box className={'image-section'}>
							<Box
								className={'main-image'}
								style={{ backgroundImage: `url(${currentImage})` }}
							>
								{/* Navigation Arrows */}
								<Box className={'navigation-arrows'}>
									<IconButton onClick={handlePrev} className={'nav-btn prev'}>
										<WestIcon />
									</IconButton>
									<IconButton onClick={handleNext} className={'nav-btn next'}>
										<EastIcon />
									</IconButton>
								</Box>

								{/* Testimonial Card */}
								<Box className={'testimonial-card'}>
									<Typography className={'testimonial-quote'}>"{currentItem.testimonial.quote}"</Typography>
									<Typography className={'testimonial-description'}>{currentItem.testimonial.description}</Typography>
									<Box className={'testimonial-author'}>
										<img src={currentItem.testimonial.image} alt={currentItem.testimonial.name} />
										<Box>
											<Typography className={'author-name'}>{currentItem.testimonial.name}</Typography>
											<Typography className={'author-role'}>{currentItem.testimonial.role}</Typography>
										</Box>
									</Box>
									<Button className={'watch-review-btn'}>
										<PlayCircleOutlineIcon />
										Watch My Review
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default BeforeAfterTestimonials;
