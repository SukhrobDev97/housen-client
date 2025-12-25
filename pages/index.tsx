import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import BeforeAfterTestimonials from '../libs/components/homepage/BeforeAfterTestimonials';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
import GetMatchedSection from '../libs/components/homepage/GetMatchedSection';
import SmartOffers from '../libs/components/homepage/SmartOffers';
import { Stack, Box, Skeleton } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Force dynamic rendering to prevent static generation and UI flash
export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
	revalidate: 1, // Revalidate every second to prevent stale static generation
});

// Mobile HomePage Skeleton Component (Issue 3)
const MobileHomePageSkeleton = () => {
	return (
		<Stack className={'home-page'} spacing={0} sx={{ margin: 0, padding: 0, gap: '24px' }}>
			{/* Hero Skeleton */}
			<Box sx={{ padding: '32px 16px', width: '100%' }}>
				<Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
				<Skeleton variant="text" width="80%" height={40} />
			</Box>

			{/* Trend Properties Skeleton */}
			<Box sx={{ padding: '0 16px', width: '100%' }}>
				<Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
				<Box sx={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
				</Box>
			</Box>

			{/* Get Matched Section Skeleton */}
			<Box sx={{ padding: '0 16px', width: '100%' }}>
				<Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '16px' }} />
			</Box>

			{/* Popular Properties Skeleton */}
			<Box sx={{ padding: '0 16px', width: '100%' }}>
				<Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
				<Box sx={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
				</Box>
			</Box>

			{/* Top Properties Skeleton */}
			<Box sx={{ padding: '0 16px', width: '100%' }}>
				<Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
				<Box sx={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={240} sx={{ borderRadius: '14px' }} />
				</Box>
			</Box>

			{/* Top Agents Skeleton */}
			<Box sx={{ padding: '0 16px', width: '100%' }}>
				<Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
				<Box sx={{ display: 'flex', gap: '12px', overflow: 'hidden' }}>
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={200} sx={{ borderRadius: '16px' }} />
					<Skeleton variant="rectangular" width="calc(50% - 6px)" height={200} sx={{ borderRadius: '16px' }} />
				</Box>
			</Box>
		</Stack>
	);
};

const Home: NextPage = () => {
	const device = useDeviceDetect();
	const [mounted, setMounted] = useState(false);

	// Prevent UI flash on page load - wait for client-side hydration
	useEffect(() => {
		setMounted(true);
	}, []);

	if (device === 'mobile') {
		// Show skeleton until component is fully mounted to prevent hydration mismatch
		if (typeof window === 'undefined' || !mounted) {
			return <MobileHomePageSkeleton />;
		}

		return (
			<Stack className={'home-page'} spacing={0} sx={{ margin: 0, padding: 0 }}>
				<TrendProperties />
				<GetMatchedSection />
				<PopularProperties />
				<BeforeAfterTestimonials />
				<TopProperties />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<SmartOffers />
				<TrendProperties />
				<GetMatchedSection />
				<PopularProperties />
				<BeforeAfterTestimonials />
				<TopProperties />
				<TopAgents />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
