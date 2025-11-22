import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import HeaderFilter from './HeaderFilter';

const HeroSection = () => {
	const device = useDeviceDetect();

	const slides = [
		'/img/banner/header1.jpg',
		'/img/banner/header2.jpg',
		'/img/banner/header3.jpg',
		'/img/banner/real-estate-6893060.jpg',
		'/img/banner/cafe-5755763_1920.jpg',
		'/img/banner/kitchen1.jpg',
		'/img/banner/scandinavin.jpg',
		'/img/banner/residential.webp',
		'/img/banner/comercial.webp',
		'/img/banner/entertainment.webp',
	];

	const [activeSlide, setActiveSlide] = useState(0);
	const [direction, setDirection] = useState<'next' | 'prev'>('next');
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isContentVisible, setIsContentVisible] = useState(false);

	// Animate hero content on mount
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsContentVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// Auto-play carousel on desktop, looping through slides smoothly
	useEffect(() => {
		if (device === 'mobile') return;

		const intervalId = setInterval(() => {
			if (!isTransitioning) {
				setDirection('next');
				setActiveSlide((prev) => (prev + 1) % slides.length);
			}
		}, 5000);

		return () => clearInterval(intervalId);
	}, [device, slides.length, isTransitioning]);

	const goToNextSlide = () => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setDirection('next');
		setActiveSlide((prev) => (prev + 1) % slides.length);
		setTimeout(() => setIsTransitioning(false), 600);
	};

	const goToPrevSlide = () => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setDirection('prev');
		setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
		setTimeout(() => setIsTransitioning(false), 600);
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
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</Box>
						</Link>
					</Stack>
					<div className={'hero-image-container'}>
						<div className={'hero-image'}></div>
					</div>
				</Stack>
				<Stack className={'filter-section'}>
					<Stack className={'container'}>
						<HeaderFilter />
					</Stack>
				</Stack>
			</>
		);
	} else {
		return (
			<>
				<Stack className={'hero-section'}>
					<div className={'hero-image-container'}>
						<div 
							className={'hero-image'}
							style={{ backgroundImage: `url('${slides[activeSlide]}')` }}
						></div>
					</div>
					<div className={'slide-images-container'}>
						<button
							className={'slide-arrow slide-arrow-left'}
							type={'button'}
							onClick={goToPrevSlide}
							aria-label="Previous slide"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
								<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="#0D0D0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
						<div className={'slide-images'}>
							<div 
								className={'slide-images-wrapper'}
								style={{
									transform: `translateX(-${activeSlide * (306 + 24)}px)`
								}}
							>
								{slides.map((src, index) => {
									const isActive = index === activeSlide;
									
									return (
										<div
											key={index}
											className={`slide-image ${isActive ? 'active' : ''}`}
											style={{ backgroundImage: `url('${src}')` }}
										>
											{isActive && (
												<div className={'slide-number'}>
													{String(activeSlide + 1).padStart(2, '0')}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
						<button
							className={'slide-arrow slide-arrow-right'}
							type={'button'}
							onClick={goToNextSlide}
							aria-label="Next slide"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="#0D0D0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
					<Stack className={`hero-content ${isContentVisible ? 'visible' : ''}`}>
						<div className={'hero-title-section'}>
							<h1 className={'hero-title'}>Discover Quality Living Space</h1>
							<p className={'hero-description'}>
								We aim to build contemporary homes whose beauty perishes in the delicate touches of minutiae lines and shapes. Within our plan, we endowed Villa with interestingly high-contrast spatial experiences.
							</p>
						</div>
						<Link href={'/property'}>
							<Box className={'explore-button'}>
								<span>Explore Properties</span>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</Box>
						</Link>
					</Stack>
					<Link href={'/agent'}>
						<div className={'circular-text-container'}>
							<div 
								className={'circular-image'}
								style={{ backgroundImage: `url('/img/banner/header1.jpg')` }}
							>
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
				<Stack className={'filter-section'}>
					<Stack className={'container'}>
						<HeaderFilter />
					</Stack>
				</Stack>
			</>
		);
	}
};

export default HeroSection;
