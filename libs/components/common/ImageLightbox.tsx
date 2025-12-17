import React, { useEffect, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './ImageLightbox.module.scss';

interface ImageLightboxProps {
	images: string[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, isOpen, onClose }) => {
	const [activeIndex, setActiveIndex] = React.useState(initialIndex);

	useEffect(() => {
		setActiveIndex(initialIndex);
	}, [initialIndex]);

	// Handle ESC key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
		document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	// Handle arrow keys
	useEffect(() => {
		const handleArrowKeys = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				handlePrevious();
			} else if (e.key === 'ArrowRight') {
				handleNext();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleArrowKeys);
		}

		return () => {
			document.removeEventListener('keydown', handleArrowKeys);
		};
	}, [isOpen, activeIndex]);

	const handlePrevious = useCallback(() => {
		setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	}, [images.length]);

	const handleNext = useCallback(() => {
		setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	}, [images.length]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<Box className={styles.lightboxOverlay} onClick={handleBackdropClick}>
			<IconButton className={styles.closeBtn} onClick={onClose}>
					<CloseIcon />
				</IconButton>

			{images.length > 1 && (
				<>
					<IconButton className={styles.navBtn + ' ' + styles.prevBtn} onClick={handlePrevious}>
						<ArrowBackIosNewIcon />
					</IconButton>
					<IconButton className={styles.navBtn + ' ' + styles.nextBtn} onClick={handleNext}>
						<ArrowForwardIosIcon />
					</IconButton>
				</>
			)}

			<Box className={styles.imageContainer}>
				<img
					src={images[activeIndex]}
					alt={`Project image ${activeIndex + 1}`}
					className={styles.lightboxImage}
				/>
			</Box>

			{images.length > 1 && (
				<Box className={styles.imageCounter}>
					{activeIndex + 1} / {images.length}
				</Box>
			)}
		</Box>
	);
};

export default ImageLightbox;
