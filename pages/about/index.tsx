import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';

const About: NextPage = () => {
	const device = useDeviceDetect();

	const services = [
		{
			id: 1,
			image: '/img/service/service1.jpg',
			title: 'Personalized Living Interior',
			description: 'Modern minimalist interior design featuring elegant organic shapes harmonizing comfort with style in neutral tones.',
			features: [
				'Space Blueprint',
				'Wall Finishes',
				'Fabric & Tile Options',
				'User-Centric Layout',
				'Circulation Mapping',
				'Furniture Positioning'
			]
		},
		{
			id: 2,
			image: '/img/service/service2.jpeg',
			title: ' Interior Solutions',
			description: 'Expert interior solutions combining style, function, and innovation to create elegant spaces.',
			features: [
				'Floor Layout Plan',
				'Color & Wallpaper Selection',
				'Material & Texture Samples',
				'Functional Zoning',
				'Smooth Flow Paths',
				'Furniture Scaling'
			]
		},
		{
			id: 3,
			image: '/img/service/service3.jpeg',
			title: 'Luxury & High-End Design',
			description: 'Opulent interiors with bespoke finishes and refined design, offering sophistication and timeless elegance.',
			features: [
				'Room Planning',
				'Paint & Texture Samples',
				'Surface Finishing Options',
				'Daily Use Focus',
				'Space Navigation',
				'Stylish Layout Setup'
			]
		}
	];

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page service-listing-page'}>
				{/* Hero Section */}
				<Stack className={'service-hero'}>
					<Box component={'div'} className={'hero-banner'}>
						<img src="/img/banner/header3.jpg" alt="Service Listing Banner" />
						<Box component={'div'} className={'hero-overlay'}></Box>
						<Stack className={'hero-content'}>
					<Stack className={'container'}>
								<Stack className={'breadcrumb'}>
									<Link href={'/'}>
										<span>Home</span>
									</Link>
									<span className={'separator'}>Service Listing</span>
						</Stack>
								<h1 className={'page-title'}>Service Listing</h1>
							</Stack>
						</Stack>
							</Box>
				</Stack>

				{/* Introduction Section */}
				<Stack className={'intro-section'}>
					<Stack className={'container'}>
						<h2 className={'intro-label'}>Quality Services</h2>
						<h3 className={'intro-title'}>We Offer Multiple Interior Design Solutions</h3>
					</Stack>
				</Stack>

				{/* Services Section */}
				<Stack className={'services-section'}>
					<Stack className={'container'}>
						<Stack className={'services-grid'}>
							{services.map((service) => (
								<Box key={service.id} component={'div'} className={'service-card'}>
									<Box component={'div'} className={'service-image'}>
										<img src={service.image} alt={service.title} />
									</Box>
									<Box component={'div'} className={'service-content'}>
										<h3 className={'service-title'}>{service.title}</h3>
										<p className={'service-description'}>{service.description}</p>
										<ul className={'service-features'}>
											{service.features.map((feature, index) => (
												<li key={index}>{feature}</li>
											))}
										</ul>
										<Link href={'#'}>
											<Box component={'div'} className={'service-details-btn'}>
												See Details
											</Box>
										</Link>
									</Box>
								</Box>
							))}
						</Stack>
					</Stack>
				</Stack>

				{/* Trusted Partners Section */}
				<Stack className={'partners'}>
					<Box component={'div'} className={'partners-background'}></Box>
					<Stack className={'container'}>
						<span className={'partners-title'}>Trusted by the world's best</span>
						<Stack className={'partners-wrap'}>
							<img src="/img/icons/brands/amazon.svg" alt="Amazon" />
							<img src="/img/icons/brands/amd.svg" alt="AMD" />
							<img src="/img/icons/brands/cisco.svg" alt="Cisco" />
							<img src="/img/icons/brands/dropcam.svg" alt="Dropcam" />
							<img src="/img/icons/brands/spotify.svg" alt="Spotify" />
						</Stack>
					</Stack>
				</Stack>

				{/* Download Mobile App Section */}
				<Stack className={'download-app-section'}>
					<Stack className={'container'}>
						{/* Header */}
						<Box component={'div'} className={'download-header'}>
							<span className={'header-line'}></span>
							<h2 className={'header-title'}>Download APP </h2>
							<span className={'header-line'}></span>
						</Box>

						{/* Main Content Wrapper */}
						<Stack className={'download-content'}>
							{/* Left Side - People Images */}
							<Box component={'div'} className={'download-left'}>
								<Box component={'div'} className={'people-images'}>
									<Box component={'div'} className={'person-image person-top-left'}>
										<img src="/img/service/person1.jpeg" alt="Person 1" />
									</Box>
									<Box component={'div'} className={'person-image person-top-right'}>
										<img src="/img/service/person2.jpeg" alt="Person 2" />
									</Box>
									<Box component={'div'} className={'person-image person-bottom-left'}>
										<img src="/img/service/person3.jpeg" alt="Person 3" />
									</Box>
									<Box component={'div'} className={'person-image person-bottom-right'}>
										<img src="/img/banner/user1.jpg" alt="Person 4" />
									</Box>
								</Box>
							</Box>

							{/* Center - Text Content */}
							<Box component={'div'} className={'download-center'}>
								<h3 className={'download-headline'}>Scan QR for download Housen mobile app </h3>
								<p className={'download-description'}>Simply scan the QR code on the right with your phone's camera, then click the prompt to open the app download page.</p>
							</Box>

							{/* Right Side - Download Buttons with QR Codes */}
							<Box component={'div'} className={'download-right'}>
								<Stack className={'download-buttons-with-qr'}>
									<Box component={'div'} className={'download-button-qr'}>
										<a 
											href="https://play.google.com/store/apps/details?id=com.housen" 
											target="_blank" 
											rel="noopener noreferrer"
											className={'download-btn google-play'}
										>
											<Box component={'div'} className={'app-icon-wrapper'}>
												<svg className={'app-icon'} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#ffffff"/>
												</svg>
											</Box>
											<Box component={'div'} className={'btn-content'}>
												<span className={'btn-label'}>GET IT ON</span>
												<span className={'btn-name'}>Google Play</span>
											</Box>
										</a>
										<Box component={'div'} className={'qr-code'}>
											<img src="/img/service/qrCode.jpeg" alt="QR Code" />
										</Box>
									</Box>

									<Box component={'div'} className={'download-button-qr'}>
										<a 
											href="https://apps.apple.com/app/housen" 
											target="_blank" 
											rel="noopener noreferrer"
											className={'download-btn app-store'}
										>
											<Box component={'div'} className={'app-icon-wrapper'}>
												<svg className={'app-icon'} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M17.05 20.28C16.07 21.05 15 20.78 14.12 20.18C13.23 19.57 12.53 19.47 11.41 20.09C10.29 20.7 9.62 20.51 8.83 19.87C7.92 19.13 6.71 18.93 5.66 19.73C4.35 20.72 3.79 20.36 2.93 19.25C1.92 17.93 1.07 15.11 2.83 13.08C3.81 11.98 5.08 11.38 6.25 11.44C7.15 11.49 7.8 11.9 8.5 11.93C9.18 11.97 9.73 11.6 10.73 11.6C11.7 11.6 12.18 11.93 12.93 11.97C13.66 12.01 14.22 11.49 14.99 11.45C15.82 11.41 16.44 11.84 16.9 12.29C15.29 13.31 14.66 15.17 15.36 16.75C16.04 18.28 17.29 19.14 18.64 19.13C18.49 19.79 18.19 20.41 17.76 20.93C17.5 21.22 17.28 21.47 17.05 20.28ZM13.33 7.37C13.62 6.63 13.78 5.72 13.65 4.84C14.89 4.97 15.92 5.57 16.5 6.27C16.2 7.05 15.65 7.79 14.95 8.17C14.25 8.55 13.47 8.61 13.33 7.37Z" fill="#ffffff"/>
												</svg>
											</Box>
											<Box component={'div'} className={'btn-content'}>
												<span className={'btn-label'}>Download on the</span>
												<span className={'btn-name'}>App Store</span>
											</Box>
										</a>
										<Box component={'div'} className={'qr-code'}>
											<img src="/img/service/qrCode.jpeg" alt="QR Code" />
										</Box>
									</Box>
								</Stack>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
