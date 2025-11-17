import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const BookConsultation = () => {
	const device = useDeviceDetect();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		serviceType: '',
		message: '',
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Check if all required fields are filled
		if (!formData.name.trim() || !formData.email.trim() || !formData.serviceType.trim() || !formData.message.trim()) {
			alert('Please insert all inputs');
			return;
		}
		
		// If all fields are filled, show success message
		alert('Thank you! Your message is sent!');
		
		// Reset form
		setFormData({
			name: '',
			email: '',
			serviceType: '',
			message: '',
		});
		
		console.log('Form submitted:', formData);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'book-consultation-section mobile'}>
				<div className={'book-consultation-bg mobile'}></div>
				<div className={'book-consultation-content mobile'}>
					<h2 className={'book-consultation-title mobile'}>Book a consultation</h2>
					<form className={'consultation-form mobile'} onSubmit={handleSubmit}>
						<div className={'form-row mobile'}>
							<div className={'form-input mobile'}>
								<input
									type="text"
									placeholder="Your Name*"
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
								/>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M8 8C9.47276 8 10.6667 6.80609 10.6667 5.33333C10.6667 3.86058 9.47276 2.66667 8 2.66667C6.52724 2.66667 5.33333 3.86058 5.33333 5.33333C5.33333 6.80609 6.52724 8 8 8Z"
										fill="#FFFFFF"
									/>
									<path
										d="M8 9.33333C5.60933 9.33333 3.66667 11.276 3.66667 13.6667V14.6667C3.66667 15.0347 3.96533 15.3333 4.33333 15.3333H11.6667C12.0347 15.3333 12.3333 15.0347 12.3333 14.6667V13.6667C12.3333 11.276 10.3907 9.33333 8 9.33333Z"
										fill="#FFFFFF"
									/>
								</svg>
							</div>
							<div className={'form-input mobile'}>
								<input
									type="email"
									placeholder="Your Email*"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
								/>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M2.66667 3.33333H13.3333C14.0697 3.33333 14.6667 3.93033 14.6667 4.66667V11.3333C14.6667 12.0697 14.0697 12.6667 13.3333 12.6667H2.66667C1.93033 12.6667 1.33333 12.0697 1.33333 11.3333V4.66667C1.33333 3.93033 1.93033 3.33333 2.66667 3.33333Z"
										stroke="#FFFFFF"
										strokeWidth="1.33"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path d="M14.6667 4.66667L8 9.33333L1.33333 4.66667" stroke="#FFFFFF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						</div>
						<div className={'form-input mobile'}>
							<select
								value={formData.serviceType}
								onChange={(e) => handleInputChange('serviceType', e.target.value)}
							>
								<option value="">Select Service Type</option>
								<option value="property-valuation">Property Valuation</option>
								<option value="property-management">Property Management</option>
								<option value="invest-opportunities">Invest Opportunities</option>
							</select>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 6L8 10L12 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<div className={'form-input mobile'}>
							<textarea
								placeholder="Type Your Message"
								value={formData.message}
								onChange={(e) => handleInputChange('message', e.target.value)}
								rows={6}
							></textarea>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1.33333 1.33333H14.6667C15.403 1.33333 16 1.93033 16 2.66667V13.3333C16 14.0697 15.403 14.6667 14.6667 14.6667H1.33333C0.596667 14.6667 0 14.0697 0 13.3333V2.66667C0 1.93033 0.596667 1.33333 1.33333 1.33333Z"
									stroke="#FFFFFF"
									strokeWidth="1.33"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path d="M3.33333 4.66667H12.6667" stroke="#FFFFFF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3.33333 8H12.6667" stroke="#FFFFFF" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<button type="submit" className={'submit-button mobile'}>
							<span>Submit Message</span>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1.66667 8L14.3333 8M14.3333 8L9.66667 3.33333M14.3333 8L9.66667 12.6667"
									stroke="#0D0D0C"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</form>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className={'book-consultation-section'}>
				<div className={'book-consultation-bg'}></div>
				<div className={'book-consultation-content'}>
					<h2 className={'book-consultation-title'}>Book a consultation</h2>
					<form className={'consultation-form'} onSubmit={handleSubmit}>
					<div className={'form-inputs'}>
						<div className={'form-row'}>
							<div className={'form-input'}>
								<input
									type="text"
									placeholder="Your Name*"
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
								/>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M8 8C9.47276 8 10.6667 6.80609 10.6667 5.33333C10.6667 3.86058 9.47276 2.66667 8 2.66667C6.52724 2.66667 5.33333 3.86058 5.33333 5.33333C5.33333 6.80609 6.52724 8 8 8Z"
										fill="#666666"
									/>
									<path
										d="M8 9.33333C5.60933 9.33333 3.66667 11.276 3.66667 13.6667V14.6667C3.66667 15.0347 3.96533 15.3333 4.33333 15.3333H11.6667C12.0347 15.3333 12.3333 15.0347 12.3333 14.6667V13.6667C12.3333 11.276 10.3907 9.33333 8 9.33333Z"
										fill="#666666"
									/>
								</svg>
							</div>
							<div className={'form-input'}>
								<input
									type="email"
									placeholder="Your Email*"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
								/>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M2.66667 3.33333H13.3333C14.0697 3.33333 14.6667 3.93033 14.6667 4.66667V11.3333C14.6667 12.0697 14.0697 12.6667 13.3333 12.6667H2.66667C1.93033 12.6667 1.33333 12.0697 1.33333 11.3333V4.66667C1.33333 3.93033 1.93033 3.33333 2.66667 3.33333Z"
										stroke="#666666"
										strokeWidth="1.33"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path d="M14.6667 4.66667L8 9.33333L1.33333 4.66667" stroke="#666666" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						</div>
						<div className={'form-input'}>
							<select
								value={formData.serviceType}
								onChange={(e) => handleInputChange('serviceType', e.target.value)}
							>
								<option value="">Select Service Type</option>
								<option value="property-valuation">Property Valuation</option>
								<option value="property-management">Property Management</option>
								<option value="invest-opportunities">Invest Opportunities</option>
							</select>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 6L8 10L12 6" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<div className={'form-input'}>
							<textarea
								placeholder="Type Your Message"
								value={formData.message}
								onChange={(e) => handleInputChange('message', e.target.value)}
								rows={8}
							></textarea>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1.33333 1.33333H14.6667C15.403 1.33333 16 1.93033 16 2.66667V13.3333C16 14.0697 15.403 14.6667 14.6667 14.6667H1.33333C0.596667 14.6667 0 14.0697 0 13.3333V2.66667C0 1.93033 0.596667 1.33333 1.33333 1.33333Z"
									stroke="#666666"
									strokeWidth="1.33"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path d="M3.33333 4.66667H12.6667" stroke="#666666" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3.33333 8H12.6667" stroke="#666666" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					</div>
					<button type="submit" className={'submit-button'}>
						<span>Submit Message</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1.66667 8L14.3333 8M14.3333 8L9.66667 3.33333M14.3333 8L9.66667 12.6667"
								stroke="#0D0D0C"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					</form>
				</div>
				<div className={'book-consultation-image'}>
					<div className={'image-container'}>
						<img 
							src="/img/property/bigImage.png" 
							alt="Property" 
							className={'property-image'}
						/>
						<div 
							className={'video-play-button'}
							onClick={() => window.open('https://www.youtube.com', '_blank')}
						>
							<div className={'play-button-circle'}></div>
							<div className={'play-button-circle play-button-circle-2'}></div>
							<div className={'play-button-circle play-button-circle-3'}></div>
							<div className={'play-button-inner'}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8 5V19L19 12L8 5Z" fill="#FFFFFF"/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</Stack>
		);
	}
};

export default BookConsultation;

