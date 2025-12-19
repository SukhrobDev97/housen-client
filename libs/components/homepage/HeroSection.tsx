import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import HeaderFilter from './HeaderFilter';

const HeroSection = () => {
	const device = useDeviceDetect();

	// Main hero image - static
	const mainHeroImage = '/img/banner/community.jpeg';

	// Slide images
	const slides = [
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
						<Stack className={'hero-actions mobile'}>
							<Link href={'/property'}>
								<div className={'explore-button mobile'}>
									<span>Explore Properties</span>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
						</Stack>
					</Stack>
					<div className={'hero-image-container'}>
						<div className={'hero-image'}></div>
					</div>
				</Stack>
				{/* Mobile Filter Below Hero */}
				<Stack className={'filter-section mobile'}>
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
					<div className={'hero-container'}>
						<Stack className={'hero-section-inner'}>
							<div className={'hero-image-container'}>
						<div 
							className={'hero-image'}
							style={{ backgroundImage: `url('${mainHeroImage}')` }}
						>
							{/* Reviews Badge */}
							<div className={'hero-reviews-badge'}>
								<div className={'review-avatars'}>
									<img src="/img/banner/user1.jpg" alt="Customer" className={'avatar'} />
									<img src="/img/banner/user2.jpg" alt="Customer" className={'avatar'} />
									<img src="/img/banner/user3.jpg" alt="Customer" className={'avatar'} />
									<img src="/img/banner/user4.jpg" alt="Customer" className={'avatar'} />
								</div>
								<div className={'review-content'}>
									<div className={'stars'}>
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFB800"/>
										</svg>
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFB800"/>
										</svg>
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFB800"/>
										</svg>
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFB800"/>
										</svg>
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FFB800"/>
										</svg>
									</div>
									<span className={'review-text'}>850+ Reviews</span>
								</div>
							</div>
						</div>
					</div>
					{/* Filter Section - Inside hero-section-inner */}
					<div className={'hero-inline-filter'}>
						<HeaderFilter />
					</div>
						</Stack>
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
									transform: `translateX(-${activeSlide * (250 + 20)}px)`
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
								We aim to design contemporary homes whose beauty perishes in the delicate touches of minutiae lines and shapes. Within our plan, we endowed Villa with interestingly high-contrast spatial experiences.
							</p>
						</div>
						<Stack className={'hero-actions'}>
							<Link href={'/property'}>
								<div className={'explore-button'}>
									<span>Explore Projects</span>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</Link>
						</Stack>
					</Stack>
					<Link href={'/agent'}>
						<div className={'circular-text-container'}>
							<div 
								className={'circular-image'}
								style={{ backgroundImage: `url('/img/banner/banner2.jpg')` }}
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
										• Housen Living Solutions • Best Agencies •
										</textPath>
									</text>
								</svg>
							</div>
						</div>
					</Link>
					</div>
				</Stack>
			</>
		);
	}
};

export default HeroSection;
