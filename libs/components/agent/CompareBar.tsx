import React from 'react';
import { Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface CompareBarProps {
	compareList: Member[];
	onRemove: (agencyId: string) => void;
	onCompare: () => void;
}

const CompareBar = ({ compareList, onRemove, onCompare }: CompareBarProps) => {
	if (compareList.length === 0) return null;

	const getImagePath = (agency: Member) => {
		return agency?.memberImage
			? `${REACT_APP_API_URL}/${agency.memberImage}`
			: '/img/profile/defaultUser.svg';
	};

	return (
		<Box className="compare-bar">
			<Box className="compare-content">
				<Box className="compare-items">
					{compareList.map((agency) => (
						<Box key={agency._id} className="compare-item">
							<img src={getImagePath(agency)} alt={agency.memberNick} />
							<span>{agency.memberNick}</span>
							<button className="remove-btn" onClick={() => onRemove(agency._id)}>
								<CloseIcon />
							</button>
						</Box>
					))}
					{compareList.length === 1 && (
						<Box className="compare-placeholder">
							<span>+ Select one more</span>
						</Box>
					)}
				</Box>
				<Button
					className="compare-btn"
					disabled={compareList.length < 2}
					startIcon={<CompareArrowsIcon />}
					onClick={onCompare}
				>
					Compare {compareList.length}/2
				</Button>
			</Box>
		</Box>
	);
};

export default CompareBar;

