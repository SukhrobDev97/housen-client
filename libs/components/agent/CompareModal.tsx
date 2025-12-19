import React from 'react';
import { Typography, IconButton } from '@mui/material';
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
			<div className="compare-card">
				{/* Card Header with Image */}
				<div className="card-header">
					<div className="image-wrapper">
						<img src={getImagePath(agency)} alt={agency.memberNick} />
						<div className="image-overlay" />
					</div>
					{isTrusted && (
						<div className="trusted-badge">
							<WorkspacePremiumIcon />
							<span>Trusted</span>
						</div>
					)}
				</div>

				{/* Card Body */}
				<div className="card-body">
					{/* Name & Type */}
					<div className="info-section name-section">
						<Typography className="agency-name">
							{agency?.memberFullName ?? agency?.memberNick}
							{isTrusted && <VerifiedIcon className="verified-icon" />}
						</Typography>
						<Typography className="agency-type">
							<BusinessIcon />
							Design Agency
						</Typography>
					</div>

					{/* Stats */}
					<div className="info-section stats-section">
						<Typography className="section-title">Statistics</Typography>
						<div className="stats-grid">
							<div className="stat-item">
								<div className="stat-icon projects">
									<WorkspacePremiumIcon />
								</div>
								<div className="stat-content">
									<span className="stat-value">{agency?.memberProjects || 0}</span>
									<span className="stat-label">Projects</span>
								</div>
							</div>
							<div className="stat-item">
								<div className="stat-icon views">
									<RemoveRedEyeIcon />
								</div>
								<div className="stat-content">
									<span className="stat-value">{agency?.memberViews || 0}</span>
									<span className="stat-label">Views</span>
								</div>
							</div>
							<div className="stat-item">
								<div className="stat-icon likes">
									<FavoriteIcon />
								</div>
								<div className="stat-content">
									<span className="stat-value">{agency?.memberLikes || 0}</span>
									<span className="stat-label">Likes</span>
								</div>
							</div>
						</div>
					</div>

					{/* Location */}
					<div className="info-section location-section">
						<Typography className="section-title">Location</Typography>
						<div className="location-content">
							<LocationOnIcon />
							<span>{agency?.memberAddress || 'Seoul, South Korea'}</span>
						</div>
					</div>

					{/* Description */}
					<div className="info-section description-section">
						<Typography className="section-title">About</Typography>
						<Typography className="description-text">
							{agency?.memberDesc || 'A professional design agency specializing in modern interior and architectural solutions. Committed to delivering exceptional results.'}
						</Typography>
					</div>

					{/* Contact Info */}
					<div className="info-section contact-section">
						<Typography className="section-title">Contact</Typography>
						<div className="contact-items">
							<div className="contact-item">
								<EmailIcon />
								<span>{'contact@agency.com'}</span>
							</div>
							<div className="contact-item">
								<PhoneIcon />
								<span>{agency?.memberPhone || '+82 10-1234-5678'}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={`compare-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
			<div className="compare-modal" onClick={(e) => e.stopPropagation()}>
				{/* Modal Header */}
				<div className="modal-header">
					<div className="header-content">
						<Typography className="modal-title">Compare Agencies</Typography>
						<Typography className="modal-subtitle">Side-by-side comparison</Typography>
					</div>
					<IconButton className="close-btn" onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</div>

				{/* Modal Body - Comparison Grid */}
				<div className="modal-body">
					<div className="compare-grid">
						{agencies.map((agency) => (
							<CompareCard key={agency._id} agency={agency} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompareModal;

