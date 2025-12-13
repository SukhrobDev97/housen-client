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
			description: 'Expert interior solutions combining style, function, and innovation to create elegant spaces.featuring elegant organic shapes',
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
												<svg className={'app-icon'} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
													<path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13.82 6.5C14.32 5.5 15.03 4.16 15.97 3.5C16.13 4.76 15.66 6.03 15.09 6.91C14.5 7.86 13.66 9.15 12.45 9.84C12.32 8.79 12.78 7.76 13.82 6.5Z" fill="#ffffff" fillRule="evenodd" clipRule="evenodd"/>
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
