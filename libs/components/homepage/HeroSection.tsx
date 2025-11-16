import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const HeroSection = () => {
	const device = useDeviceDetect();

	const slides = [
		'/img/banner/header1.svg',
		'/img/banner/header2.svg',
		'/img/banner/header3.svg',
		'/img/banner/header1.svg',
		'/img/banner/header2.svg',
	];

	const [activeSlide, setActiveSlide] = useState(0);

	// Auto-play carousel on desktop, looping through slides smoothly
	useEffect(() => {
		if (device === 'mobile') return;

		const intervalId = setInterval(() => {
			setActiveSlide((prev) => (prev + 1) % slides.length);
		}, 8000); // ozgina tezlatildi, lekin hanuz smooth

		return () => clearInterval(intervalId);
	}, [device, slides.length]);

	const goToNextSlide = () => {
		setActiveSlide((prev) => (prev + 1) % slides.length);
	};

	const goToPrevSlide = () => {
		setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	if (device === 'mobile') {
		return (
			<>
				<Stack className={'hero-section mobile'}>
					<Stack className={'hero-content mobile'}>
						<h1 className={'hero-title'}>Discover Quality Living Space</h1>
						<p className={'hero-description'}>
							We aim to build contemporary homes whose beauty perishes in the delicate touches of minutiae lines and shapes. Within our plan, we endowed Villa with interestingly high-contrast spatial experiences.
						</p>
						<Link href={'/property'}>
							<Box className={'explore-button mobile'}>
								<span>Explore Properties</span>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 12L10 8L6 4" stroke="#0D0D0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Box>
						</Link>
					</Stack>
					<div className={'hero-image-container'}>
						<div className={'hero-image'}></div>
					</div>
				</Stack>
				<Stack className={'hero-stats-wrapper mobile'}>
					<Box className={'hero-stats-bg'}>
						<Stack className={'hero-stats'}>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>20+</span>
								<span className={'stat-label'}>Years of Experiences</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>270+</span>
								<span className={'stat-label'}>Projects</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>85+</span>
								<span className={'stat-label'}>Team Members</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>1200+</span>
								<span className={'stat-label'}>Satisfied Clients</span>
							</Box>
						</Stack>
					</Box>
				</Stack>
			</>
		);
	} else {
		return (
			<>
				<Stack className={'hero-section'}>
					<div className={'hero-image-container'}>
						<div className={'hero-image'}></div>
					</div>
					<div className={'slide-images'}>
						<button
							className={'slide-arrow slide-arrow-left'}
							type={'button'}
							onClick={goToPrevSlide}
							aria-label="Previous slide"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M10 4L6 8L10 12"
									stroke="#0D0D0C"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
						{[0, 1, 2].map((offset) => {
							const index = (activeSlide + offset) % slides.length;
							const src = slides[index];
							return (
								<div
									key={index}
									className={`slide-image ${index === activeSlide ? 'active' : ''}`}
									style={{ backgroundImage: `url('${src}')` }}
								/>
							);
						})}
						<button
							className={'slide-arrow slide-arrow-right'}
							type={'button'}
							onClick={goToNextSlide}
							aria-label="Next slide"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M6 4L10 8L6 12"
									stroke="#0D0D0C"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
					<Stack className={'hero-content'}>
						<div className={'hero-title-section'}>
							<h1 className={'hero-title'}>Discover Quality Living Space</h1>
							<p className={'hero-description'}>
								We aim to build contemporary homes whose beauty perishes in the delicate touches of minutiae lines and shapes. Within our plan, we endowed Villa with interestingly high-contrast spatial experiences.
							</p>
						</div>
						<Link href={'/property'}>
							<Box className={'explore-button'}>
								<span>Explore Properties</span>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 12L10 8L6 4" stroke="#0D0D0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Box>
						</Link>
					</Stack>
					<Link href={'/agent'}>
						<div className={'circular-text-container'}>
							<div className={'circular-image'}>
								<div className={'circular-star-icon'}>
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7 0L8.63 5.26L14 5.26L9.68 8.51L11.32 13.77L7 10.51L2.68 13.77L4.32 8.51L0 5.26L5.37 5.26L7 0Z" fill="#FFFFFF" />
									</svg>
								</div>
							</div>
							<div className={'circular-text-wrapper'}>
								<svg className={'circular-text-svg'} viewBox="0 0 260 260">
									<defs>
										<path id="circularPath" d="M 130, 130 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0" fill="none" />
									</defs>
									<text className={'circular-text-path'}>
										<textPath href="#circularPath" startOffset="50%">
											Housen Living Solutions • Best Agencies •
										</textPath>
									</text>
								</svg>
							</div>
						</div>
					</Link>
				</Stack>
				<Stack className={'hero-stats-wrapper'}>
					<Box className={'hero-stats-bg'}>
						<Stack className={'hero-stats'}>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>20+</span>
								<span className={'stat-label'}>Years of Experiences</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>270+</span>
								<span className={'stat-label'}>Projects</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>85+</span>
								<span className={'stat-label'}>Team Members</span>
							</Box>
							<Box className={'stat-item'}>
								<span className={'stat-number'}>1200+</span>
								<span className={'stat-label'}>Satisfied Clients</span>
							</Box>
						</Stack>
					</Box>
				</Stack>
			</>
		);
	}
};

export default HeroSection;
