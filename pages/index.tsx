import { NextPage } from 'next';
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
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<SmartOffers />
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
