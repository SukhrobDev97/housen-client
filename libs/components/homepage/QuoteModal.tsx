import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { sweetMixinSuccessAlert } from '../../sweetAlert';
import styles from './QuoteModal.module.scss';

interface QuoteModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface QuoteFormData {
	type: string;
	budget: string;
	city: string;
	contact: string;
}

const QuoteModal = ({ isOpen, onClose }: QuoteModalProps) => {
	const [formData, setFormData] = useState<QuoteFormData>({
		type: '',
		budget: '',
		city: '',
		contact: '',
	});

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);

	const handleInputChange = (field: keyof QuoteFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Quote Form Data:', formData);
		await sweetMixinSuccessAlert('Quote request submitted successfully!');
		onClose();
		setFormData({
			type: '',
			budget: '',
			city: '',
			contact: '',
		});
	};

	if (!isOpen) return null;

	return (
		<Box className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
			<Box className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<Box className={styles.header}>
					<Typography className={styles.title}>Quick Quote</Typography>
					<IconButton className={styles.closeBtn} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				<Box className={styles.body}>
					<form onSubmit={handleSubmit} className={styles.form}>
						<Box className={styles.formGroup}>
							<label className={styles.label}>Type</label>
							<select
								className={styles.select}
								value={formData.type}
								onChange={(e) => handleInputChange('type', e.target.value)}
								required
							>
								<option value="">Select Type</option>
								<option value="Residential">Residential</option>
								<option value="Office">Office</option>
								<option value="Commercial">Commercial</option>
								<option value="Entertainment">Entertainment</option>
							</select>
						</Box>

						<Box className={styles.formGroup}>
							<label className={styles.label}>Budget</label>
							<select
								className={styles.select}
								value={formData.budget}
								onChange={(e) => handleInputChange('budget', e.target.value)}
								required
							>
								<option value="">Select Budget</option>
								<option value="$10k–$20k">$10k–$20k</option>
								<option value="$20k–$50k">$20k–$50k</option>
								<option value="$50k–$100k">$50k–$100k</option>
								<option value="$100k+">$100k+</option>
							</select>
						</Box>

						<Box className={styles.formGroup}>
							<label className={styles.label}>City</label>
							<select
								className={styles.select}
								value={formData.city}
								onChange={(e) => handleInputChange('city', e.target.value)}
								required
							>
								<option value="">Select City</option>
								<option value="Seoul">Seoul</option>
								<option value="Busan">Busan</option>
								<option value="Incheon">Incheon</option>
								<option value="Gwangju">Gwangju</option>
							</select>
						</Box>

						<Box className={styles.formGroup}>
							<label className={styles.label}>Contact</label>
							<select
								className={styles.select}
								value={formData.contact}
								onChange={(e) => handleInputChange('contact', e.target.value)}
								required
							>
								<option value="">Select Contact Method</option>
								<option value="Phone">Phone</option>
								<option value="Telegram">Telegram</option>
							</select>
						</Box>

						<button type="submit" className={styles.submitBtn}>
							Submit
						</button>
					</form>
				</Box>
			</Box>
		</Box>
	);
};

export default QuoteModal;
