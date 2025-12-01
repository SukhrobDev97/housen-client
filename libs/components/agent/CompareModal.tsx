import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface CompareModalProps {
	agencies: Member[];
	isOpen: boolean;
	onClose: () => void;
}

const CompareModal = ({ agencies, isOpen, onClose }: CompareModalProps) => {
	if (!isOpen || agencies.length < 2) return null;

	const getImagePath = (agency: Member) => {
		return agency?.memberImage
			? `${REACT_APP_API_URL}/${agency.memberImage}`
			: '/img/profile/defaultUser.svg';
	};

	const CompareCard = ({ agency }: { agency: Member }) => {
		const isTrusted = (agency?.memberProjects || 0) >= 2;

		return (
			<Box className="compare-card">
				{/* Card Header with Image */}
				<Box className="card-header">
					<Box className="image-wrapper">
						<img src={getImagePath(agency)} alt={agency.memberNick} />
						<Box className="image-overlay" />
					</Box>
					{isTrusted && (
						<Box className="trusted-badge">
							<WorkspacePremiumIcon />
							<span>Trusted</span>
						</Box>
					)}
				</Box>

				{/* Card Body */}
				<Box className="card-body">
					{/* Name & Type */}
					<Box className="info-section name-section">
						<Typography className="agency-name">
							{agency?.memberFullName ?? agency?.memberNick}
							{isTrusted && <VerifiedIcon className="verified-icon" />}
						</Typography>
						<Typography className="agency-type">
							<BusinessIcon />
							Design Agency
						</Typography>
					</Box>

					{/* Stats */}
					<Box className="info-section stats-section">
						<Typography className="section-title">Statistics</Typography>
						<Box className="stats-grid">
							<Box className="stat-item">
								<Box className="stat-icon projects">
									<WorkspacePremiumIcon />
								</Box>
								<Box className="stat-content">
									<span className="stat-value">{agency?.memberProjects || 0}</span>
									<span className="stat-label">Projects</span>
								</Box>
							</Box>
							<Box className="stat-item">
								<Box className="stat-icon views">
									<RemoveRedEyeIcon />
								</Box>
								<Box className="stat-content">
									<span className="stat-value">{agency?.memberViews || 0}</span>
									<span className="stat-label">Views</span>
								</Box>
							</Box>
							<Box className="stat-item">
								<Box className="stat-icon likes">
									<FavoriteIcon />
								</Box>
								<Box className="stat-content">
									<span className="stat-value">{agency?.memberLikes || 0}</span>
									<span className="stat-label">Likes</span>
								</Box>
							</Box>
						</Box>
					</Box>

					{/* Location */}
					<Box className="info-section location-section">
						<Typography className="section-title">Location</Typography>
						<Box className="location-content">
							<LocationOnIcon />
							<span>{agency?.memberAddress || 'Seoul, South Korea'}</span>
						</Box>
					</Box>

					{/* Description */}
					<Box className="info-section description-section">
						<Typography className="section-title">About</Typography>
						<Typography className="description-text">
							{agency?.memberDesc || 'A professional design agency specializing in modern interior and architectural solutions. Committed to delivering exceptional results.'}
						</Typography>
					</Box>

					{/* Contact Info */}
					<Box className="info-section contact-section">
						<Typography className="section-title">Contact</Typography>
						<Box className="contact-items">
							<Box className="contact-item">
								<EmailIcon />
								<span>{agency?.memberEmail || 'contact@agency.com'}</span>
							</Box>
							<Box className="contact-item">
								<PhoneIcon />
								<span>{agency?.memberPhone || '+82 10-1234-5678'}</span>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	};

	return (
		<Box className={`compare-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
			<Box className="compare-modal" onClick={(e) => e.stopPropagation()}>
				{/* Modal Header */}
				<Box className="modal-header">
					<Box className="header-content">
						<Typography className="modal-title">Compare Agencies</Typography>
						<Typography className="modal-subtitle">Side-by-side comparison</Typography>
					</Box>
					<IconButton className="close-btn" onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Modal Body - Comparison Grid */}
				<Box className="modal-body">
					<Box className="compare-grid">
						{agencies.map((agency) => (
							<CompareCard key={agency._id} agency={agency} />
						))}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default CompareModal;

