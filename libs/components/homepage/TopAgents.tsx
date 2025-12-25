import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Button, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMobileLang } from '../../hooks/useMobileLang';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgencyCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgenciesInquiry } from '../../types/member/member.input';
import { GET_AGENCIES } from '../../../apollo/user/query';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopAgenciesProps {
	initialInput: AgenciesInquiry;
}

const TopAgencies = (props: TopAgenciesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const mobileLang = useMobileLang();
	const isHomePage = router.pathname === '/';
	const user = useReactiveVar(userVar);
	const [topAgencies, setTopAgencies] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getAgenciesLoading,
		data: getAgenciesData,
		error: getAgenciesError,
		refetch: getAgenciesRefetch,
	  } = useQuery(GET_AGENCIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T ) => {
			setTopAgencies(data?.getAgencies?.list);
		},
	  });

	/** HANDLERS **/
	const subscribeHandler = async (id: string) => {
		try {
			if (!user?._id) {
				router.push('/account/join');
				return;
			}
			await subscribe({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Followed!', 800);
			await getAgenciesRefetch();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const unsubscribeHandler = async (id: string) => {
		try {
			if (!user?._id) {
				router.push('/account/join');
				return;
			}
			await unsubscribe({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
			await getAgenciesRefetch();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		// Homepage Mobile - Airbnb Style Layout
		if (isHomePage) {
			return (
				<Stack id="top-agents" className={'top-agents homepage-mobile-top-agents'} spacing={0} sx={{ margin: 0, padding: 0 }}>
					<Stack className={'container'} spacing={0} sx={{ margin: 0, padding: 0 }}>
						{/* Header */}
						<Box className={'homepage-mobile-agents-header'}>
							<Typography className={'homepage-agents-title'}>
								{mobileLang === 'ko' ? '인기 인테리어 에이전시' : 'Top Interior Agencies'}
							</Typography>
							<Typography className={'homepage-agents-subtitle'}>
								{mobileLang === 'ko' ? '신뢰할 수 있는 검증된 전문가들' : 'Trusted & verified professionals'}
							</Typography>
						</Box>
						{/* Horizontal Scroll Cards */}
						<Box className={'homepage-mobile-agents-scroll-container'}>
							{topAgencies.length === 0 ? (
								<Box component={'div'} className={'empty-list'}>
									Top Agencies Empty
								</Box>
							) : (
								<Box className={'homepage-mobile-agents-scroll'}>
									{topAgencies.map((agency: Member) => {
										return (
											<Box key={agency._id} className={'homepage-mobile-agent-card-wrapper'}>
												<TopAgencyCard 
													agency={agency} 
													subscribeHandler={subscribeHandler}
													unsubscribeHandler={unsubscribeHandler}
												/>
											</Box>
										);
									})}
								</Box>
							)}
						</Box>
					</Stack>
				</Stack>
			);
		}

		// Other Mobile Pages - Original Layout
		return (
			<Stack id="top-agents" className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>High Rated Interior Agencies</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topAgencies.map((agency: Member) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={agency?._id}>
										<TopAgencyCard 
											agency={agency} 
											key={agency?.memberNick}
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Interior Agencies</span>
							<p>Discover premium interior design agencies trusted by thousands</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Button 
								className={'explore-agencies-btn'}
								endIcon={<img src="/img/icons/rightup.svg" alt="" style={{ width: '16px', height: '16px' }} />}
								onClick={() => router.push('/agent')}
							>
								Explore All Agencies
							</Button>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-agents-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-agents-next',
									prevEl: '.swiper-agents-prev',
								}}
							>
								{topAgencies.map((agency: Member) => {
									return (
										<SwiperSlide className={'top-agents-slide'} key={agency?._id}>
											<TopAgencyCard agency={agency} key={agency?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-agents-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgencies.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgencies;
