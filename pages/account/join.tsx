import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Stack, Typography, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

type AuthStep = 'role-selection' | 'auth-form';
type UserRole = 'USER' | 'AGENCY' | null;
type AuthMode = 'login' | 'signup';

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [authStep, setAuthStep] = useState<AuthStep>('role-selection');
	const [selectedRole, setSelectedRole] = useState<UserRole>(null);
	const [authMode, setAuthMode] = useState<AuthMode>('login');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [input, setInput] = useState({ 
		nick: '', 
		password: '', 
		phone: '', 
		email: '',
		type: 'USER' as UserRole 
	});

	/** HANDLERS **/
	const handleRoleSelect = useCallback((role: UserRole) => {
		setSelectedRole(role);
		setInput((prev) => ({ ...prev, type: role }));
		setAuthStep('auth-form');
	}, []);

	const handleInput = useCallback((name: string, value: string) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: AuthMode) => {
		setAuthMode(newValue);
		// Reset inputs when switching modes
		setInput((prev) => ({ 
			...prev, 
			password: '',
			phone: '',
			email: '' 
		}));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, selectedRole || 'USER');
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, selectedRole, router]);

	const isFormValid = () => {
		if (authMode === 'login') {
			return input.nick !== '' && input.password !== '';
		} else {
			// Email is optional for Agency (UI only, backend doesn't require it)
			return input.nick !== '' && input.password !== '' && input.phone !== '';
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && isFormValid()) {
			if (authMode === 'login') {
				doLogin();
			} else {
				doSignUp();
			}
		}
	};

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	}

	// STEP 1: Role Selection
	if (authStep === 'role-selection') {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							<Box className={'welcome-section'}>
								<Typography className={'welcome-title'}>Welcome to Housen</Typography>
								<Typography className={'welcome-subtitle'}>Choose how you'd like to use Housen</Typography>
							</Box>
							<Stack className={'role-cards'}>
								<Box 
									className={'role-card role-card-user'}
									onClick={() => handleRoleSelect('USER')}
								>
									<HomeIcon className={'role-icon'} />
									<Typography className={'role-title'}>I'm a Client</Typography>
									<Typography className={'role-subtitle'}>Browse & save designs</Typography>
								</Box>
								<Box 
									className={'role-card role-card-agency'}
									onClick={() => handleRoleSelect('AGENCY')}
								>
									<BusinessIcon className={'role-icon'} />
									<Typography className={'role-title'}>I'm an Agency</Typography>
									<Typography className={'role-subtitle'}>Create projects & get clients</Typography>
								</Box>
							</Stack>
						</Stack>
						<Stack className={'right'}></Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	// STEP 2: Login / Signup Form
	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						{selectedRole !== 'AGENCY' && (
							<Box className={'logo'}>
								<div className={'logo-wrapper'}>
									<svg className={'logo-icon'} width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#0D0D0C"/>
									</svg>
									<div className={'logo-text-wrapper'}>
										<span className={'logo-text'}>HOUSEN</span>
										<span className={'logo-subtitle'}>LIVING SOLUTIONS</span>
									</div>
								</div>
							</Box>
						)}
						
						{/* Tabs */}
						<Box className={'auth-tabs'}>
							<Tabs 
								value={authMode} 
								onChange={handleTabChange}
								className={'tabs'}
								indicatorColor="primary"
								textColor="primary"
							>
								<Tab label="Login" value="login" />
								<Tab label="Sign up" value="signup" />
							</Tabs>
							</Box>

						<Box className={'form-card'}>
							<Box className={`input-wrap ${authMode === 'signup' && selectedRole === 'AGENCY' ? 'agency-form-grid' : ''}`}>
								{/* Email field for Agency Signup */}
								{authMode === 'signup' && selectedRole === 'AGENCY' && (
									<div className={'input-box'}>
										<label>Email</label>
										<input
											type="email"
											placeholder={'Enter Email'}
											value={input.email}
											onChange={(e) => handleInput('email', e.target.value)}
											onKeyDown={handleKeyDown}
										/>
									</div>
								)}

								{/* Nickname */}
								<div className={'input-box'}>
									<label>Agency Name</label>
									<input
										type="text"
										placeholder={'Enter Agency Name'}
										value={input.nick}
										onChange={(e) => handleInput('nick', e.target.value)}
										onKeyDown={handleKeyDown}
										required
									/>
								</div>

								{/* Password */}
								<div className={'input-box password-input-box'}>
									<label>Password</label>
									<div className={'password-wrapper'}>
									<input
											type={showPassword ? 'text' : 'password'}
										placeholder={'Enter Password'}
											value={input.password}
										onChange={(e) => handleInput('password', e.target.value)}
											onKeyDown={handleKeyDown}
											required
											className={'password-input'}
										/>
										<button
											type="button"
											className={'password-toggle'}
											onClick={() => setShowPassword(!showPassword)}
											aria-label={showPassword ? 'Hide password' : 'Show password'}
										>
											{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</button>
									</div>
									{authMode === 'signup' && (
										<span className={'password-helper'}>At least 3 characters</span>
									)}
								</div>

								{/* Phone for Signup */}
								{authMode === 'signup' && (
									<div className={`input-box ${selectedRole === 'USER' ? 'phone-user-spacing' : ''}`}>
										<label>Phone</label>
										<input
											type="tel"
											placeholder={'Enter Phone'}
											value={input.phone}
											onChange={(e) => handleInput('phone', e.target.value)}
											onKeyDown={handleKeyDown}
											required
										/>
									</div>
								)}
							</Box>

							{/* Remember me for Login */}
							{authMode === 'login' && (
								<Box className={'remember-info'}>
									<label className={'checkbox-label'}>
										<input type="checkbox" defaultChecked />
										<span>Remember me</span>
									</label>
									<a className={'forgot-link'}>Forgot password?</a>
								</Box>
							)}

							{/* Submit Button */}
									<Button
										variant="contained"
								className={'submit-btn'}
								disabled={!isFormValid()}
								onClick={authMode === 'login' ? doLogin : doSignUp}
								fullWidth
							>
								{authMode === 'login' ? 'Login' : 'Create Account'}
									</Button>

							{/* Social Signup Section (Signup only) */}
							{authMode === 'signup' && (
								<Box className={'social-signup-section'}>
									<div className={'divider-with-text'}>
										<span className={'divider-line'}></span>
										<span className={'divider-text'}>OR</span>
										<span className={'divider-line'}></span>
									</div>
									<Typography className={'social-text'}>Sign up with</Typography>
									<Box className={'social-buttons'}>
										<button className={'social-btn social-btn-google'} type="button">
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z" fill="#4285F4"/>
												<path d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z" fill="#34A853"/>
												<path d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z" fill="#FBBC05"/>
												<path d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335"/>
											</svg>
											<span>Google</span>
										</button>
										<button className={'social-btn social-btn-kakao'} type="button">
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M12 3C6.48 3 2 6.36 2 10.5C2 13.12 3.9 15.36 6.64 16.67L5.64 21L10.55 18.19C11.23 18.28 11.91 18.33 12.6 18.33C18.12 18.33 22.6 14.97 22.6 10.83C22.6 6.69 18.12 3.33 12.6 3.33L12 3Z" fill="#000000"/>
											</svg>
											<span>KakaoTalk</span>
										</button>
										<button className={'social-btn social-btn-telegram'} type="button">
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM14.64 6.8L13.22 14.68C13.09 15.26 12.71 15.43 12.22 15.15L9.74 13.34L8.5 14.51C8.35 14.66 8.22 14.79 7.95 14.79L8.14 12.22L13.51 7.43C13.77 7.2 13.45 7.07 13.1 7.3L6.67 11.46L4.13 10.64C3.55 10.47 3.54 10.04 4.24 9.76L14.02 6.24C14.49 6.06 14.9 6.34 14.64 6.8Z" fill="#FFFFFF"/>
											</svg>
											<span>Telegram</span>
										</button>
									</Box>
								</Box>
								)}
							</Box>

						{/* Switch Text */}
						<Box className={'switch-text'}>
							{authMode === 'login' ? (
								<Typography component="p">
									Not registered yet?{' '}
									<a onClick={() => setAuthMode('signup')} className={'switch-link'}>
										Sign Up
									</a>
								</Typography>
							) : (
								<Typography component="p">
									Already have an account?{' '}
									<a onClick={() => setAuthMode('login')} className={'switch-link'}>
										Login
									</a>
								</Typography>
								)}
							</Box>

						<Box className={'back-link'}>
							<a onClick={() => setAuthStep('role-selection')}>← Back to role selection</a>
						</Box>
						</Stack>
						<Stack className={'right'}></Stack>
					</Stack>
				</Stack>
			</Stack>
		);
};

export default withLayoutBasic(Join);
