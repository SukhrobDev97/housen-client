import React from 'react';
import { Stack, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EastIcon from '@mui/icons-material/East';
import { useRouter } from 'next/router';

const Services = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	const services = [
		{
			title: 'Property Valuation',
			description: 'All-inclusive real estate services to facilitate the easy and confident purchase, sale, and management of your properties.',
			icon: '/img/icons/dollar.svg',
		},
		{
			title: 'Property Management',
			description: 'All-inclusive real estate services to facilitate the easy and confident purchase, sale, and management of your properties.',
			icon: '/img/icons/house.svg',
		},
		{
			title: 'Invest Opportunities',
			description: 'All-inclusive real estate services to facilitate the easy and confident purchase, sale, and management of your properties.',
			icon: '/img/icons/briefcase.svg',
		},
	];

	const handleBrowseAll = () => {
		router.push('/about');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'services-section'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box component={'div'} className={'section-title'}>
							<h2>Take A Look At Our Services</h2>
							<p>We are a real estate firm with over 20 years of expertise, and our main goal is to provide amazing locations to our partners and clients. Within the luxury real estate market, our agency offers customized solutions.</p>
						</Box>
						<Button className={'browse-btn'} onClick={handleBrowseAll} endIcon={<EastIcon />}>
							Browse All Services
						</Button>
					</Stack>
					<Stack className={'services-content'}>
						<Stack className={'services-list'}>
							{services.map((service, index) => (
								<Box key={index} component={'div'} className={'service-card'}>
									<Box component={'div'} className={'service-header'}>
										<img src={service.icon} alt={service.title} className={'service-icon'} />
										<h3>{service.title}</h3>
									</Box>
									<p>{service.description}</p>
								</Box>
							))}
						</Stack>
						<Box component={'div'} className={'service-image'}>
							<img src="/img/services/services-image.jpg" alt="Services" />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'services-section'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box component={'div'} className={'section-title'}>
							<h2>Take A Look At Our Services</h2>
							<p>We are a real estate firm with over 20 years of expertise, and our main goal is to provide amazing locations to our partners and clients. Within the luxury real estate market, our agency offers customized solutions.</p>
						</Box>
						<Button className={'browse-btn'} onClick={handleBrowseAll} endIcon={<EastIcon />}>
							Browse All Services
						</Button>
					</Stack>
					<Stack className={'services-content'}>
						<Stack className={'services-list'}>
							{services.map((service, index) => (
								<Box key={index} component={'div'} className={'service-card'}>
									<Box component={'div'} className={'service-header'}>
										<img src={service.icon} alt={service.title} className={'service-icon'} />
										<h3>{service.title}</h3>
									</Box>
									<p>{service.description}</p>
								</Box>
							))}
						</Stack>
						<Box component={'div'} className={'service-image'}>
							<img src="/img/services/services-image.jpg" alt="Services" />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Services;

