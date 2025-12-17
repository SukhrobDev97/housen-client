import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import styles from '../../../scss/pc/homepage/SmartOffers.module.scss';

interface OfferCard {
	icon: React.ReactNode;
	title: string;
	description: string;
	cta: string;
	link: string;
}

const SmartOffers = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const isAgency = user?.memberType === 'AGENCY';

	// Icons as SVG
	const budgetIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	const agencyIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M9 7H15M9 11H15M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	const designIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	const createIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	const topIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	const exploreIcon = (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	);

	// Regular user offers
	const userOffers: OfferCard[] = [
		{
			icon: budgetIcon,
			title: 'Find projects within your budget',
			description: 'Hand-picked projects that match popular budgets and styles',
			cta: 'Visit →',
			link: '/property',
		},
		{
			icon: agencyIcon,
			title: 'Get inspired by top agencies',
			description: 'Discover agencies delivering high-quality interior projects',
			cta: 'Visit →',
			link: '/agent',
		},
		{
			icon: designIcon,
			title: 'Start with popular designs',
			description: 'Explore the hottest interior projects in this year',
			cta: 'Popular Projects →',
			link: '#popular-properties',
		},
	];

	// Agency user offers
	const agencyOffers: OfferCard[] = [
		{
			icon: createIcon,
			title: 'Create a new project',
			description: 'Showcase your work and attract new clients',
			cta: 'Create Project →',
			link: '/mypage?category=addProject',
		},
		{
			icon: topIcon,
			title: 'See top performing agencies',
			description: 'Learn from the best agencies in the industry',
			cta: 'Top Agencies →',
			link: '#top-agents',
		},
		{
			icon: exploreIcon,
			title: 'Explore top projects',
			description: 'Get inspired by top-rated projects',
			cta: 'Top Projects →',
			link: '#top-properties',
		},
	];

	const offers = isAgency ? agencyOffers : userOffers;

	const handleCardClick = (link: string) => {
		if (link.startsWith('#')) {
			// Scroll to section on homepage
			const sectionId = link.substring(1);
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		} else {
			router.push(link);
		}
	};

	return (
		<Stack className={styles.smartOffers}>
			<Stack className={styles.container}>
				<Box className={styles.header}>
					<Typography className={styles.title}>Smart Offers</Typography>
					<Typography className={styles.subtitle}>
						Curated opportunities to start your project faster
					</Typography>
				</Box>

				<Box className={styles.cardsGrid}>
					{offers.map((offer, index) => (
						<Box
							key={index}
							className={styles.offerCard}
							onClick={() => handleCardClick(offer.link)}
						>
							<Box className={styles.cardIcon}>{offer.icon}</Box>
							<Typography className={styles.cardTitle}>{offer.title}</Typography>
							<Typography className={styles.cardDescription}>{offer.description}</Typography>
							<Box className={styles.cardCta}>
								<span>{offer.cta}</span>
							</Box>
						</Box>
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default SmartOffers;

