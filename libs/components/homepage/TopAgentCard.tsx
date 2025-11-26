import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Button, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import EastIcon from '@mui/icons-material/East';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { REACT_APP_API_URL } from '../../config';

interface TopAgencyProps {
	agency: Member;
}
const TopAgencyCard = (props: TopAgencyProps) => {
	const { agency } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	
	const agencyImage = agency?.memberImage
		? `${REACT_APP_API_URL}/${agency?.memberImage}`
		: '/img/profile/defaultUser.svg';

	// Generate random rating between 4.2 and 5.0
	const rating = useMemo(() => {
		return (Math.random() * (5 - 4.2) + 4.2).toFixed(1);
	}, [agency._id]);

	/** HANDLERS **/
	const handleViewProfile = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/agent/detail?agencyId=${agency._id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<Box className="agent-image-container">
					<img src={agencyImage} alt={agency?.memberNick || 'Agency'} />
				</Box>
				<Box className="agent-content">
					<Typography className="agent-name">
						{agency?.memberFullName ?? agency?.memberNick}
					</Typography>
					<Box className="agent-verified">
						<CheckCircleIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
						<Typography className="verified-text">Verified</Typography>
					</Box>
					<Typography className="agent-rating">
						⭐ {rating} rating
					</Typography>
					<Button 
						className="view-profile-btn"
						endIcon={<EastIcon sx={{ fontSize: 16 }} />}
						onClick={handleViewProfile}
					>
						View Profile
					</Button>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<Box className="agent-image-container">
					<img src={agencyImage} alt={agency?.memberNick || 'Agency'} />
				</Box>
				<Box className="agent-content">
					<Typography className="agent-name">
						{agency?.memberFullName ?? agency?.memberNick}
					</Typography>
					<Box className="agent-verified">
						<CheckCircleIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
						<Typography className="verified-text">Verified</Typography>
					</Box>
					<Typography className="agent-rating">
						⭐ {rating} rating
					</Typography>
					<Button 
						className="view-profile-btn"
						endIcon={<EastIcon sx={{ fontSize: 16 }} />}
						onClick={handleViewProfile}
					>
						View Profile
					</Button>
				</Box>
			</Stack>
		);
	}
};

export default TopAgencyCard;
