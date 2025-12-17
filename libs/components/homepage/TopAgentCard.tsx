import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Button, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import EastIcon from '@mui/icons-material/East';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopAgencyProps {
	agency: Member;
	subscribeHandler?: (id: string) => void;
	unsubscribeHandler?: (id: string) => void;
}
const TopAgencyCard = (props: TopAgencyProps) => {
	const { agency, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [isFollowing, setIsFollowing] = useState(agency?.meFollowed?.[0]?.myFollowing ?? false);
	
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

	const handleFollowToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!user?._id) {
			router.push('/account/join');
			return;
		}
		
		if (isFollowing) {
			unsubscribeHandler && unsubscribeHandler(agency._id);
			setIsFollowing(false);
		} else {
			subscribeHandler && subscribeHandler(agency._id);
			setIsFollowing(true);
		}
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
			<Stack className="top-agent-card" onClick={handleViewProfile}>
				<Box className="agent-image-container">
					<img src={agencyImage} alt={agency?.memberNick || 'Agency'} />
					{/* Hover Follow Button */}
					<Box 
						className={`follow-overlay ${isFollowing ? 'following' : ''}`}
						onClick={handleFollowToggle}
					>
						<Box className="follow-btn-hover">
							{isFollowing ? (
								<>
									<CheckIcon />
									<span>Following</span>
								</>
							) : (
								<>
									<PersonAddIcon />
									<span>Follow</span>
								</>
							)}
						</Box>
					</Box>
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
