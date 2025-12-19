import React from 'react';
import { Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

// Minimal interface to avoid complex union type inference
interface CompareItem {
	_id: string;
	memberImage?: string;
	memberNick: string;
}

interface CompareBarProps {
	compareList: Member[];
	onRemove: (agencyId: string) => void;
	onCompare: () => void;
}

const CompareBar = ({ compareList, onRemove, onCompare }: CompareBarProps) => {
	if (compareList.length === 0) return null;

	// Narrow type to avoid complex union inference
	const safeCompareList: CompareItem[] = compareList.map((item) => ({
		_id: item._id,
		memberImage: item.memberImage,
		memberNick: item.memberNick,
	}));

	const getImagePath = (agency: CompareItem): string => {
		return agency?.memberImage
			? `${REACT_APP_API_URL}/${agency.memberImage}`
			: '/img/profile/defaultUser.svg';
	};

	return (
		<Box component="div" className="compare-bar">
			<Box component="div" className="compare-content">
				<Box component="div" className="compare-items">
					{safeCompareList.map((agency: CompareItem) => (
						<Box key={agency._id} component="div" className="compare-item">
							<img src={getImagePath(agency)} alt={agency.memberNick} />
							<span>{agency.memberNick}</span>
							<button className="remove-btn" onClick={() => onRemove(agency._id)}>
								<CloseIcon />
							</button>
						</Box>
					))}
					{safeCompareList.length === 1 && (
						<Box component="div" className="compare-placeholder">
							<span>+ Select one more</span>
						</Box>
					)}
				</Box>
				<Button
					className="compare-btn"
					disabled={safeCompareList.length < 2}
					startIcon={<CompareArrowsIcon />}
					onClick={onCompare}
				>
					Compare {safeCompareList.length}/2
				</Button>
			</Box>
		</Box>
	);
};

export default CompareBar;

