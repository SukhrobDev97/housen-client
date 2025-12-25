import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	IconButton,
	Typography,
	Box,
	Stack,
	Button,
	TextField,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	CircularProgress,
	Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { CartItem } from '../../context/CartContext';

interface CheckoutModalProps {
	open: boolean;
	onClose: () => void;
	cartItems: CartItem[];
	total: number;
	onClearCart: () => void;
}

type CheckoutStep = 'summary' | 'payment' | 'processing' | 'success' | 'error';

interface PaymentFormData {
	cardNumber: string;
	expiryDate: string;
	cvc: string;
	cardholderName: string;
	paymentMethod: 'card' | 'apple' | 'bank';
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
	open,
	onClose,
	cartItems,
	total,
	onClearCart,
}) => {
	const [step, setStep] = useState<CheckoutStep>('summary');
	const [paymentData, setPaymentData] = useState<PaymentFormData>({
		cardNumber: '',
		expiryDate: '',
		cvc: '',
		cardholderName: '',
		paymentMethod: 'card',
	});
	const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
	const [orderId, setOrderId] = useState<string>('');

	const handleClose = () => {
		if (step === 'processing') return;
		setStep('summary');
		setPaymentData({
			cardNumber: '',
			expiryDate: '',
			cvc: '',
			cardholderName: '',
			paymentMethod: 'card',
		});
		setErrors({});
		onClose();
	};

	const handleEditCart = () => {
		handleClose();
	};

	const validatePaymentForm = (): boolean => {
		const newErrors: Partial<PaymentFormData> = {};

		if (!paymentData.cardNumber.trim()) {
			newErrors.cardNumber = 'Card number is required';
		} else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
			newErrors.cardNumber = 'Card number must be 16 digits';
		}

		if (!paymentData.expiryDate.trim()) {
			newErrors.expiryDate = 'Expiry date is required';
		} else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
			newErrors.expiryDate = 'Format: MM/YY';
		}

		if (!paymentData.cvc.trim()) {
			newErrors.cvc = 'CVC is required';
		} else if (!/^\d{3,4}$/.test(paymentData.cvc)) {
			newErrors.cvc = 'CVC must be 3-4 digits';
		}

		if (!paymentData.cardholderName.trim()) {
			newErrors.cardholderName = 'Cardholder name is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const formatCardNumber = (value: string) => {
		const numbers = value.replace(/\s/g, '').replace(/\D/g, '');
		const groups = numbers.match(/.{1,4}/g) || [];
		return groups.join(' ').slice(0, 19);
	};

	const formatExpiryDate = (value: string) => {
		const numbers = value.replace(/\D/g, '').slice(0, 4);
		if (numbers.length >= 2) {
			return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
		}
		return numbers;
	};

	const handlePaymentSubmit = async () => {
		if (!validatePaymentForm()) return;

		setStep('processing');

		// Simulate payment processing
		const shouldFail = Math.random() < 0.15; // 15% failure rate
		const delay = 2000 + Math.random() * 1000; // 2000-3000ms

		setTimeout(() => {
			if (shouldFail) {
				setStep('error');
			} else {
				const timestamp = Date.now();
				setOrderId(`HSN-${timestamp}`);
				setStep('success');
			}
		}, delay);
	};

	const handleContinueShopping = () => {
		onClearCart();
		setStep('summary');
		setPaymentData({
			cardNumber: '',
			expiryDate: '',
			cvc: '',
			cardholderName: '',
			paymentMethod: 'card',
		});
		setErrors({});
		handleClose();
	};

	const subtotal = total;
	const shipping = 0;
	const finalTotal = subtotal + shipping;

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: { xs: '20px 20px 0 0', sm: '20px' },
					maxHeight: { xs: '90vh', sm: '90vh' },
					m: { xs: 0, sm: 3 },
					position: { xs: 'fixed', sm: 'relative' },
					bottom: { xs: 0, sm: 'auto' },
					height: { xs: '90vh', sm: 'auto' },
				},
			}}
			sx={{
				backdropFilter: 'blur(8px)',
				'& .MuiBackdrop-root': {
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
				},
			}}
		>
			<DialogContent sx={{ p: 0, position: 'relative' }}>
				{/* Header */}
				<Box
					sx={{
						position: 'sticky',
						top: 0,
						zIndex: 10,
						background: 'white',
						borderBottom: '1px solid #f0f0f0',
						px: 3,
						py: 2,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant="h5" sx={{ fontWeight: 700, fontSize: '24px' }}>
						{step === 'summary' && 'Checkout'}
						{step === 'payment' && 'Payment Method'}
						{step === 'processing' && 'Processing Payment'}
						{step === 'success' && 'Payment Successful'}
						{step === 'error' && 'Payment Failed'}
					</Typography>
					{step !== 'processing' && (
						<IconButton
							onClick={handleClose}
							sx={{
								color: '#666',
								'&:hover': { backgroundColor: '#f5f5f5' },
							}}
						>
							<CloseIcon />
						</IconButton>
					)}
				</Box>

				<Box sx={{ overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
					{/* Step 1: Order Summary */}
					{step === 'summary' && (
						<Box sx={{ p: 3 }}>
							<Stack spacing={3}>
								<Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
									Order Summary
								</Typography>

								{/* Cart Items */}
								<Stack spacing={2}>
									{cartItems.map((item) => (
										<Box
											key={item.product.id}
											sx={{
												display: 'flex',
												gap: 2,
												p: 2,
												borderRadius: '12px',
												backgroundColor: '#fafafa',
											}}
										>
											<Box
												component="img"
												src={item.product.image}
												alt={item.product.name}
												sx={{
													width: 80,
													height: 80,
													objectFit: 'cover',
													borderRadius: '8px',
												}}
											/>
											<Box sx={{ flex: 1 }}>
												<Typography
													variant="body1"
													sx={{ fontWeight: 600, mb: 0.5 }}
												>
													{item.product.name}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: '#666', mb: 1 }}
												>
													Quantity: {item.quantity}
												</Typography>
												<Typography variant="h6" sx={{ fontWeight: 700 }}>
													${(item.product.price * item.quantity).toLocaleString()}
												</Typography>
											</Box>
										</Box>
									))}
								</Stack>

								<Divider />

								{/* Summary */}
								<Stack spacing={1.5}>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="body1" sx={{ color: '#666' }}>
											Subtotal
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											${subtotal.toLocaleString()}
										</Typography>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="body1" sx={{ color: '#666' }}>
											Shipping
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
											Free
										</Typography>
									</Box>
									<Divider />
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px' }}>
											Total
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px' }}>
											${finalTotal.toLocaleString()}
										</Typography>
									</Box>
								</Stack>

								<Button
									variant="outlined"
									onClick={handleEditCart}
									sx={{
										mt: 2,
										borderColor: '#ddd',
										color: '#666',
										'&:hover': {
											borderColor: '#999',
											backgroundColor: '#f5f5f5',
										},
									}}
								>
									Edit cart
								</Button>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={() => setStep('payment')}
									sx={{
										mt: 2,
										py: 1.5,
										borderRadius: '12px',
										fontSize: '16px',
										fontWeight: 600,
										textTransform: 'none',
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										'&:hover': {
											background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
										},
									}}
								>
									Continue to Payment
								</Button>
							</Stack>
						</Box>
					)}

					{/* Step 2: Payment Form */}
					{step === 'payment' && (
						<Box sx={{ p: 3 }}>
							<Stack spacing={3}>
								<FormControl component="fieldset">
									<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
										Select Payment Method
									</Typography>
									<RadioGroup
										value={paymentData.paymentMethod}
										onChange={(e) =>
											setPaymentData({
												...paymentData,
												paymentMethod: e.target.value as 'card' | 'apple' | 'bank',
											})
										}
									>
										<FormControlLabel
											value="card"
											control={<Radio />}
											label={
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<CreditCardIcon sx={{ fontSize: 20 }} />
													<Typography>Credit / Debit Card</Typography>
												</Box>
											}
										/>
										<FormControlLabel
											value="apple"
											control={<Radio disabled />}
											label={
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Typography sx={{ color: '#999' }}>
														Apple Pay
														<Typography
															component="span"
															sx={{ ml: 1, fontSize: '12px', color: '#999' }}
														>
															(Coming soon)
														</Typography>
													</Typography>
												</Box>
											}
										/>
										<FormControlLabel
											value="bank"
											control={<Radio disabled />}
											label={
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Typography sx={{ color: '#999' }}>
														Bank Transfer
														<Typography
															component="span"
															sx={{ ml: 1, fontSize: '12px', color: '#999' }}
														>
															(Available soon)
														</Typography>
													</Typography>
												</Box>
											}
										/>
									</RadioGroup>
								</FormControl>

								{paymentData.paymentMethod === 'card' && (
									<>
										<TextField
											fullWidth
											label="Card Number"
											placeholder="1234 5678 9012 3456"
											value={paymentData.cardNumber}
											onChange={(e) =>
												setPaymentData({
													...paymentData,
													cardNumber: formatCardNumber(e.target.value),
												})
											}
											error={!!errors.cardNumber}
											helperText={errors.cardNumber}
											inputProps={{ maxLength: 19 }}
										/>

										<Box sx={{ display: 'flex', gap: 2 }}>
											<TextField
												fullWidth
												label="Expiry Date"
												placeholder="MM/YY"
												value={paymentData.expiryDate}
												onChange={(e) =>
													setPaymentData({
														...paymentData,
														expiryDate: formatExpiryDate(e.target.value),
													})
												}
												error={!!errors.expiryDate}
												helperText={errors.expiryDate}
												inputProps={{ maxLength: 5 }}
											/>
											<TextField
												fullWidth
												label="CVC"
												placeholder="123"
												value={paymentData.cvc}
												onChange={(e) =>
													setPaymentData({
														...paymentData,
														cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
													})
												}
												error={!!errors.cvc}
												helperText={errors.cvc}
												inputProps={{ maxLength: 4 }}
											/>
										</Box>

										<TextField
											fullWidth
											label="Cardholder Name"
											placeholder="John Doe"
											value={paymentData.cardholderName}
											onChange={(e) =>
												setPaymentData({
													...paymentData,
													cardholderName: e.target.value,
												})
											}
											error={!!errors.cardholderName}
											helperText={errors.cardholderName}
										/>

										<Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
											Payments are securely processed using industry-standard encryption.
										</Typography>
									</>
								)}

								<Stack direction="row" spacing={2}>
									<Button
										variant="outlined"
										fullWidth
										onClick={() => setStep('summary')}
										sx={{
											py: 1.5,
											borderRadius: '12px',
											borderColor: '#ddd',
											color: '#666',
											textTransform: 'none',
										}}
									>
										Back
									</Button>
									<Button
										variant="contained"
										fullWidth
										size="large"
										onClick={handlePaymentSubmit}
										sx={{
											py: 1.5,
											borderRadius: '12px',
											fontSize: '16px',
											fontWeight: 600,
											textTransform: 'none',
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											'&:hover': {
												background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
											},
										}}
									>
										Pay ${finalTotal.toLocaleString()}
									</Button>
								</Stack>
							</Stack>
						</Box>
					)}

					{/* Step 3: Processing */}
					{step === 'processing' && (
						<Box
							sx={{
								p: 6,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								minHeight: '400px',
							}}
						>
							<CircularProgress size={64} sx={{ mb: 3, color: '#667eea' }} />
							<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
								Processing your payment…
							</Typography>
							<Typography variant="body2" sx={{ color: '#666' }}>
								Please do not refresh the page.
							</Typography>
						</Box>
					)}

					{/* Success State */}
					{step === 'success' && (
						<Box sx={{ p: 6 }}>
							<Stack spacing={3} alignItems="center">
								<Box
									sx={{
										width: 80,
										height: 80,
										borderRadius: '50%',
										backgroundColor: '#4caf50',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
								</Box>

								<Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
									Payment Successful!
								</Typography>

								<Typography variant="body1" sx={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>
									Thank you for your order. Your purchase has been confirmed.
								</Typography>

								<Box
									sx={{
										width: '100%',
										p: 3,
										borderRadius: '12px',
										backgroundColor: '#f5f5f5',
										textAlign: 'center',
									}}
								>
									<Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
										Order ID
									</Typography>
									<Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
										{orderId}
									</Typography>
									<Typography variant="caption" sx={{ color: '#2e7d32', mt: 1, display: 'block' }}>
										Confirmation email sent
									</Typography>
								</Box>

								<Stack direction="row" spacing={2} sx={{ width: '100%', mt: 2 }}>
									<Button
										variant="outlined"
										fullWidth
										onClick={handleContinueShopping}
										sx={{
											py: 1.5,
											borderRadius: '12px',
											borderColor: '#ddd',
											color: '#666',
											textTransform: 'none',
										}}
									>
										Continue Shopping
									</Button>
									<Button
										variant="contained"
										fullWidth
										size="large"
										onClick={handleClose}
										sx={{
											py: 1.5,
											borderRadius: '12px',
											fontSize: '16px',
											fontWeight: 600,
											textTransform: 'none',
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											'&:hover': {
												background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
											},
										}}
									>
										View Order Details
									</Button>
								</Stack>
							</Stack>
						</Box>
					)}

					{/* Error State */}
					{step === 'error' && (
						<Box sx={{ p: 6 }}>
							<Stack spacing={3} alignItems="center">
								<Box
									sx={{
										width: 80,
										height: 80,
										borderRadius: '50%',
										backgroundColor: '#f44336',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<ErrorOutlineIcon sx={{ fontSize: 48, color: 'white' }} />
								</Box>

								<Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
									Payment Failed
								</Typography>

								<Typography variant="body1" sx={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>
									Payment failed. Please try again.
								</Typography>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={() => setStep('payment')}
									sx={{
										mt: 2,
										py: 1.5,
										borderRadius: '12px',
										fontSize: '16px',
										fontWeight: 600,
										textTransform: 'none',
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										'&:hover': {
											background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
										},
									}}
								>
									Retry Payment
								</Button>
							</Stack>
						</Box>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default CheckoutModal;
