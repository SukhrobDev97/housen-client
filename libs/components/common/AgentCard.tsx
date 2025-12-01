import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Typography, Checkbox } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgencyCardProps {
	agency: any;
	likeMemberHandler?: any;
	onCompareToggle?: (agency: any) => void;
	isCompareSelected?: boolean;
	index?: number;
}

const AgencyCard = (props: AgencyCardProps) => {
	const { agency, likeMemberHandler, onCompareToggle, isCompareSelected, index = 0 } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agency?.memberImage
		? `${REACT_APP_API_URL}/${agency?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const isTrusted = agency?.memberProjects >= 2;
	const isVerified = agency?.memberProjects >= 2;

	if (device === 'mobile') {
		return <div>AGENCY CARD</div>;
	} else {
		return (
			<Box 
				className={`agency-card ${isCompareSelected ? 'compare-selected' : ''}`}
				style={{ 
					animationDelay: `${index * 0.08}s`,
				}}
			>
				{/* Compare Checkbox */}
				<Box className="compare-checkbox">
					<Checkbox
						checked={isCompareSelected}
						onChange={() => onCompareToggle && onCompareToggle(agency)}
						size="small"
					/>
					<span className="compare-label">Compare</span>
				</Box>

				{/* Trusted Badge */}
				{isTrusted && (
					<Box className="trusted-badge">
						<WorkspacePremiumIcon />
						<span>Trusted</span>
					</Box>
				)}

				{/* Card Image */}
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agencyId: agency?._id },
					}}
				>
					<Box className="card-image">
						<img src={imagePath} alt={agency?.memberNick} />
						<Box className="image-overlay" />
						<Box className="project-count">
							<span>{agency?.memberProjects || 0}</span>
							<small>Projects</small>
						</Box>
					</Box>
				</Link>

				{/* Card Content */}
				<Box className="card-content">
					{/* Agency Info */}
					<Box className="agency-info">
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agencyId: agency?._id },
							}}
						>
							<Typography className="agency-name">
								{agency?.memberFullName ?? agency?.memberNick}
								{isVerified && <VerifiedIcon className="verified-icon" />}
							</Typography>
						</Link>
						<Typography className="agency-type">Design Agency</Typography>
					</Box>

					{/* Stats Bar */}
					<Box className="stats-bar">
						<Box className="stat-item">
							<LocationOnIcon />
							<span>{agency?.memberAddress || 'Seoul, KR'}</span>
						</Box>
					</Box>

					{/* Action Bar */}
					<Box className="action-bar">
						<Box className="stats">
							<Box className="stat">
								<IconButton size="small">
							<RemoveRedEyeIcon />
						</IconButton>
								<span>{agency?.memberViews || 0}</span>
							</Box>
							<Box className="stat">
								<IconButton 
									size="small"
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										e.stopPropagation();
										likeMemberHandler && likeMemberHandler(user, agency?._id);
									}}
								>
							{agency?.meLiked && agency?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon className="liked" />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
								<span>{agency?.memberLikes || 0}</span>
							</Box>
						</Box>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agencyId: agency?._id },
							}}
						>
							<button className="view-btn">View Profile</button>
						</Link>
					</Box>
				</Box>
			</Box>
		);
	}
};

export default AgencyCard;
