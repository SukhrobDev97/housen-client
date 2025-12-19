import React, { useState, useEffect } from 'react';
import { Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/* Interior design tips data */
const TIPS = [
	"Warm LED lights make your living room feel 20% cozier.",
	"Natural wood textures instantly add warmth to minimal interiors.",
	"Use vertical storage to make small spaces look bigger.",
	"Soft neutral colors create a peaceful and high-end look.",
	"Add one bold decor piece to create a focal point in the room.",
	"Mixing round shapes with straight lines keeps interiors balanced.",
	"Use mirrors to visually expand tight rooms."
];

const STORAGE_KEY = 'housen_inspiration_closed';

const DailyInspirationBubble = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [tip, setTip] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		// Only run on client side
		if (typeof window === 'undefined') return;

		// Check if already closed this session
		const wasClosed = localStorage.getItem(STORAGE_KEY);
		if (wasClosed) return;

		// Select random tip
		const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
		setTip(randomTip);

		// Check window size for responsive styles
		const checkSize = () => {
			const width = window.innerWidth;
			setIsMobile(width < 600);
			setIsDesktop(width >= 900);
		};
		checkSize();
		const resizeListener = () => checkSize();
		window.addEventListener('resize', resizeListener);

		// Trigger fade-in animation after mount
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 400);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		// Save to localStorage after animation
		setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, 'true');
		}, 400);
	};

	// Don't render if no tip or closed
	if (!tip) return null;
	
	return (
		<div
			style={{
				position: 'fixed',
				bottom: isDesktop ? '180px' : '120px',
				right: isMobile ? '16px' : '28px',
				width: isMobile ? 'calc(100% - 32px)' : '300px',
				maxWidth: '300px',
				padding: '18px 20px',
				background: 'rgba(255, 252, 248, 0.96)',
				backdropFilter: 'blur(12px)',
				borderRadius: '14px',
				boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
				border: '1px solid rgba(212, 163, 115, 0.15)',
				zIndex: 99,
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
				transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				pointerEvents: isVisible ? 'auto' : 'none',
			}}
		>
			{/* Close Button */}
			<IconButton
				onClick={handleClose}
				size="small"
				aria-label="Close tip"
				sx={{
					position: 'absolute',
					top: '8px',
					right: '8px',
					width: '26px',
					height: '26px',
					background: 'rgba(0, 0, 0, 0.04)',
					transition: 'all 0.2s ease',
					'&:hover': {
						background: 'rgba(0, 0, 0, 0.08)',
					},
				}}
			>
				<CloseIcon sx={{ fontSize: '14px', color: '#888' }} />
			</IconButton>

			{/* Content */}
			<div style={{ paddingRight: '20px' }}>
				<Typography
					sx={{
						fontFamily: '"Poppins", sans-serif',
						fontSize: '12px',
						fontWeight: 600,
						color: '#3B3F2B',
						marginBottom: '8px',
						display: 'flex',
						alignItems: 'center',
						gap: '5px',
						letterSpacing: '0.3px',
					}}
				>
					<span style={{ fontSize: '14px' }}>✨</span>
					Today's Interior Tip
				</Typography>
				<Typography
					sx={{
						fontFamily: '"Poppins", sans-serif',
						fontSize: '13px',
						fontWeight: 400,
						color: '#4a4a4a',
						lineHeight: 1.55,
						fontStyle: 'italic',
					}}
				>
					"{tip}"
				</Typography>
			</div>
		</div>
	);
};

export default DailyInspirationBubble;

