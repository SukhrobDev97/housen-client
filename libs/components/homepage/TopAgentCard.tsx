import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgencyProps {
	agency: Member;
}
const TopAgencyCard = (props: TopAgencyProps) => {
	const { agency } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agencyImage = agency?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agency?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agencyImage} alt="" />

				<strong>{agency?.memberNick}</strong>
				<span>{agency?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<img src={agencyImage} alt="" />

				<strong>{agency?.memberNick}</strong>
				<span>{agency?.memberType}</span>
			</Stack>
		);
	}
};

export default TopAgencyCard;
