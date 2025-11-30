import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** MEMOIZED VALUES **/
		const memoizedValues = useMemo(() => {
			let title = 'Housen';
			let desc = 'Home';
			let bgImage = '/img/banner/header1.jpg';

			switch (router.pathname) {
				case '/about':
					title = 'Service Listing';
					desc = 'Home / Service Listing';
					bgImage = '/img/banner/header3.jpg';
					break;
				case '/property':
					title = 'Projects';
					desc = 'Home / Projects';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/agent':
					title = 'Agent';
					desc = 'Home / Agent';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/member':
					title = 'Member';
					desc = 'Home / Member';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / Community';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/cs':
					title = 'CS Center';
					desc = 'Home / CS Center';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/account/join':
					title = 'Join';
					desc = 'Home / Join';
					bgImage = '/img/banner/header1.jpg';
					break;
				case '/mypage':
					title = 'My Page';
					desc = 'Home / My Page';
					bgImage = '/img/banner/header1.jpg';
					break;
				default:
					title = 'Housen';
					desc = 'Home';
					bgImage = '/img/banner/header1.jpg';
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>{memoizedValues.title}</title>
						<meta name={'title'} content={memoizedValues.title} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>{memoizedValues.title}</title>
						<meta name={'title'} content={memoizedValues.title} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{router.pathname !== '/about' && router.pathname !== '/property' && (
							<Box component={'div'} className={'header-basic'} style={{ backgroundImage: `url(${memoizedValues.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
								<Stack className={'container'}>
									<strong>{memoizedValues.title}</strong>
									<span>{memoizedValues.desc}</span>
								</Stack>
							</Box>
						)}

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;