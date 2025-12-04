import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import EditNoteIcon from '@mui/icons-material/EditNote';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="write-article-page">
				{/* Page Header */}
				<Stack className="page-header">
					<Box className="header-icon">
						<EditNoteIcon />
					</Box>
					<Stack className="header-text">
						<Typography className="main-title">Write an Article</Typography>
						<Typography className="sub-title">
							Feel free to write your ideas! Share your thoughts with the Housen community.
						</Typography>
					</Stack>
				</Stack>

				{/* Editor Container */}
				<Stack className="editor-wrapper">
					<TuiEditor />
				</Stack>

				{/* Tips Section */}
				<Stack className="tips-section">
					<Typography className="tips-title">Writing Tips</Typography>
					<Stack className="tips-list">
						<Box className="tip-item">
							<span className="tip-number">01</span>
							<Typography className="tip-text">Use clear and descriptive titles</Typography>
						</Box>
						<Box className="tip-item">
							<span className="tip-number">02</span>
							<Typography className="tip-text">Add images to make content engaging</Typography>
						</Box>
						<Box className="tip-item">
							<span className="tip-number">03</span>
							<Typography className="tip-text">Choose the right category for visibility</Typography>
						</Box>
					</Stack>
				</Stack>
			</div>
		);
};

export default WriteArticle;
