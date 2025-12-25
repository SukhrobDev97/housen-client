import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container mobile-footer-minimal'}>
				{/* Brand Row */}
				<Box className={'mobile-footer-brand'}>
					<svg className={'mobile-footer-logo'} width="32" height="28" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#111827"/>
					</svg>
					<span className={'mobile-footer-brand-text'}>HOUSEN</span>
				</Box>

				{/* Main Links */}
				<Box className={'mobile-footer-links'}>
					<Link href="/" className={'mobile-footer-link'}>Home</Link>
					<span className={'mobile-footer-link-separator'}>·</span>
					<Link href="/property" className={'mobile-footer-link'}>Projects</Link>
					<span className={'mobile-footer-link-separator'}>·</span>
					<Link href="/agent" className={'mobile-footer-link'}>Agencies</Link>
					<span className={'mobile-footer-link-separator'}>·</span>
					<Link href="/community" className={'mobile-footer-link'}>Community</Link>
				</Box>

				{/* Social Icons */}
				<Box className={'mobile-footer-social'}>
					<FacebookOutlinedIcon className={'mobile-footer-social-icon'} />
					<TwitterIcon className={'mobile-footer-social-icon'} />
					<LinkedInIcon className={'mobile-footer-social-icon'} />
					<InstagramIcon className={'mobile-footer-social-icon'} />
				</Box>

				{/* Copyright */}
				<Box className={'mobile-footer-copyright'}>
					<span>© {moment().year()} Housen</span>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Box component={'div'} className={'newsletter-section'}>
					<h2 className={'newsletter-title'}>Newsletter to get updated the latest news</h2>
					<div className={'newsletter-form'}>
						<input type="email" placeholder="Enter Email" className={'newsletter-input'} />
						<button className={'newsletter-button'}>
							<span>Subscribe Now</span>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.5 12L21.5 12M21.5 12L15.5 6M21.5 12L15.5 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
				</Box>
				<div className={'footer-divider'}></div>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-logo-section'}>
							<div className={'logo-wrapper'}>
								<svg className={'logo-icon'} width="62" height="56" viewBox="0 0 62 56" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M26.5484 33.3874L29.6755 31.1775V55.9973H26.5484V33.3874ZM46.9149 26.2033V14.3923L26.5484 0V25.848L23.0738 28.3028V14.4004L0 30.7065V56H3.1271V32.2461L19.944 20.3624V30.518L9.97059 37.5648V56H23.0711V35.8448L19.944 38.0547V52.9692H13.0977V39.1017L29.6755 27.3876V5.96203L43.785 15.9319V23.9935L34.0896 17.1432V55.9973H37.2167V23.1025L58.8701 38.4019V52.9665H46.9121V33.74L43.785 31.5328V55.9973H62V36.865L46.9149 26.2033Z" fill="#0D0D0C"/>
								</svg>
								<div className={'logo-text-wrapper'}>
									<span className={'logo-text'}>HOUSEN</span>
									<span className={'logo-subtitle'}>LIVING SOLUTIONS</span>
								</div>
							</div>
							<p className={'footer-description'}>
								Rapidiously myocardinate cross-platform intellectual capital model. Appropriately create interactive infrastructures
							</p>
							<div className={'social-media-box'}>
								<FacebookOutlinedIcon className={'social-icon'} />
								<TwitterIcon className={'social-icon'} />
								<LinkedInIcon className={'social-icon'} />
								<YouTubeIcon className={'social-icon'} />
								<InstagramIcon className={'social-icon'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'footer-links-section'}>
							<div className={'footer-link-group'}>
								<h3 className={'footer-link-title'}>Get In Touch</h3>
								<div className={'contact-info'}>
									<div className={'contact-item'}>
										<svg className={'contact-icon'} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect width="40" height="40" rx="8" fill="#1C2D37"/>
											<path d="M20 10C15.58 10 12 13.58 12 18C12 23.5 20 30 20 30C20 30 28 23.5 28 18C28 13.58 24.42 10 20 10ZM20 21C17.79 21 16 19.21 16 17C16 14.79 17.79 13 20 13C22.21 13 24 14.79 24 17C24 19.21 22.21 21 20 21Z" fill="#FFFFFF"/>
										</svg>
										<span className={'contact-text'}>Seoul Gangnam</span>
									</div>
									<div className={'contact-item'}>
										<svg className={'contact-icon'} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect width="40" height="40" rx="8" fill="#1C2D37"/>
											<path d="M24 10H16C14.8954 10 14 10.8954 14 12V28C14 29.1046 14.8954 30 16 30H24C25.1046 30 26 29.1046 26 28V12C26 10.8954 25.1046 10 24 10Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
											<path d="M18 12H22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
											<path d="M20 26V26.01" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
										</svg>
										<span className={'contact-text'}>062-7788-8877</span>
									</div>
									<div className={'contact-item'}>
										<svg className={'contact-icon'} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect width="40" height="40" rx="8" fill="#1C2D37"/>
											<path d="M28 14L20 20L12 14V28H28V14Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
										</svg>
										<div className={'contact-text-wrapper'}>
											<span className={'contact-text'}>mailinfo00@housen.com</span>
											<span className={'contact-text'}>support24@housen.com</span>
										</div>
									</div>
								</div>
							</div>
							<div className={'footer-link-group'}>
								<h3 className={'footer-link-title'}>Useful Link</h3>
								<div className={'link-list'}>
									<Link href="/about" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>About us</span>
									</Link>
									<Link href="/properties" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Featured Properties</span>
									</Link>
									<Link href="/services" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Our Best Services</span>
									</Link>
									<Link href="/visit" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Request Visit</span>
									</Link>
									<Link href="/faq" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>FAQ</span>
									</Link>
								</div>
							</div>
							<div className={'footer-link-group'}>
								<h3 className={'footer-link-title'}>Explore</h3>
								<div className={'link-list'}>
									<Link href="/properties" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>All Properties</span>
									</Link>
									<Link href="/agents" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Our Agents</span>
									</Link>
									<Link href="/projects" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>All Projects</span>
									</Link>
									<Link href="/process" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Our Process</span>
									</Link>
									<Link href="/neighborhood" className={'footer-link'}>
										<svg className={'link-arrow'} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.5 5L12.5 10L7.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Neighborhood</span>
									</Link>
							</div>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span className={'copyright-text'}>Copyright © {moment().year()} Housen, All rights reserved.</span>
					<div className={'footer-bottom-links'}>
						<Link href="/terms" className={'bottom-link'}>Terms of service</Link>
						<Link href="/privacy" className={'bottom-link'}>Privacy policy</Link>
						<Link href="/cookies" className={'bottom-link'}>cookies</Link>
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
