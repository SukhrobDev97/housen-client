import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import Hero from '../homepage/Hero';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
				<Stack id="mobile-wrap" spacing={0} sx={{ margin: 0, padding: 0 }}>
					<Stack id={'top'} spacing={0} sx={{ margin: 0, padding: 0 }}>
						<Top />
					</Stack>

					<Stack className={'header-main'} spacing={0} sx={{ margin: 0, padding: 0 }}>
						<Hero />
					</Stack>

					<Stack id={'main'} spacing={0} sx={{ margin: 0, padding: 0, minHeight: 'auto', height: 'auto' }}>
						<Component {...props} />
					</Stack>

					<Stack id={'footer'} spacing={0} sx={{ margin: 0, padding: 0 }}>
						<Footer />
					</Stack>
				</Stack>
				</>
			);
		} else {
			return (
				<>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

					<Stack className={'header-main'}>
						<Hero />
					</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
