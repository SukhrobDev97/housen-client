import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { ProjectType, ProjectStyle } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMobileLang } from '../../hooks/useMobileLang';
import { Stack, Typography, Box } from '@mui/material';
import styles from '../../../scss/pc/homepage/Hero.module.scss';

interface FilterState {
	style: string;
	type: string;
	budget: string;
	duration: string;
}

const Hero = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const mobileLang = useMobileLang();
	const isHomePage = router.pathname === '/';
	const [filters, setFilters] = useState<FilterState>({
		style: '',
		type: '',
		budget: '',
		duration: '',
	});

	const handleFilterChange = (field: keyof FilterState, value: string) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	const handleFilterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Filter Search:', filters);
		router.push({
			pathname: '/property',
			query: {
				...(filters.style && { projectStyleList: filters.style }),
				...(filters.type && { typeList: filters.type }),
				...(filters.budget && { budget: filters.budget }),
				...(filters.duration && { duration: filters.duration }),
			},
		});
	};

	const handleCreateProject = async () => {
		if (user?.memberType === 'AGENCY') {
			await router.push({
				pathname: '/mypage',
				query: { category: 'addProject' },
			});
		} else {
			await sweetMixinErrorAlert('Only Agencies can create projects!');
		}
	};

	if (device === 'mobile' && isHomePage) {
		return (
			<Stack className={'homepage-mobile-hero'}>
				<Box className={'homepage-mobile-hero-content'}>
					<Typography className={'homepage-mobile-hero-small-title'}>
						{mobileLang === 'ko' ? '프로젝트 둘러보기' : 'Discover Projects'}
					</Typography>
					<Typography className={'homepage-mobile-hero-title'}>
						{mobileLang === 'ko' ? '나에게 딱 맞는 인테리어 찾기' : 'Find Your Perfect Interior Match'}
					</Typography>
				</Box>
			</Stack>
		);
	}

	return (
		<>
			<section className={styles.hero}>
				<div className={styles.heroContainer}>
					<div className={styles.heroGrid}>
						{/* Left Column - Text */}
						<div className={styles.heroText}>
							<span className={styles.heroLabel}>PREMIUM INTERIOR PLATFORM</span>
							<h1 className={styles.heroHeadline}>
								Discover Spaces<br />
								That Define Your Lifestyle
							</h1>
							<p className={styles.heroDescription}>
								We connect you with top designers and verified agencies to build timeless interiors that reflect your unique vision and elevate everyday living.
							</p>
							<div className={styles.heroActions}>
								<button
									className={styles.btnPrimary}
									onClick={() => router.push('/property')}
								>
									Explore Projects
								</button>
								<div className={styles.createProjectWrapper}>
									<span className={styles.agencyHint}>Agency?</span>
									<button
										className={styles.btnSecondary}
										onClick={handleCreateProject}
									>
										Create Project
									</button>
								</div>
							</div>
							{/* How It Works */}
							<div className={styles.howItWorks}>
								<div className={styles.step}>
									<span className={styles.stepNumber}>1</span>
									<span className={styles.stepText}>Choose style</span>
								</div>
								<svg className={styles.stepArrow} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<div className={styles.step}>
									<span className={styles.stepNumber}>2</span>
									<span className={styles.stepText}>Pick project</span>
								</div>
								<svg className={styles.stepArrow} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<div className={styles.step}>
									<span className={styles.stepNumber}>3</span>
									<span className={styles.stepText}>Match with agency</span>
								</div>
							</div>
						</div>

						{/* Right Column - Image */}
						<div className={styles.heroImageWrapper}>
							<div className={styles.heroImage}>
								<img
									src="/img/banner/community.jpeg"
									alt="Premium Interior Design"
								/>
								{/* Live Project Badge */}
								<div className={styles.liveBadge}>
									<span className={styles.liveDot}></span>
									<span className={styles.liveText}>Live projects</span>
								</div>
								<span className={styles.watermark}>Housen Curated</span>
							</div>
						</div>
					</div>

					{/* Floating Glass Filter */}
					<form className={styles.filterPanel} onSubmit={handleFilterSubmit}>
						<div className={styles.filterField}>
							<label>Style</label>
							<select
								value={filters.style}
								onChange={(e) => handleFilterChange('style', e.target.value)}
							>
								<option value="">Any Style</option>
								<option value={ProjectStyle.MODERN}>Modern</option>
								<option value={ProjectStyle.MINIMAL}>Minimal</option>
								<option value={ProjectStyle.CLASSIC}>Classic</option>
								<option value={ProjectStyle.TRADITIONAL}>Traditional</option>
								<option value={ProjectStyle.INDUSTRIAL}>Industrial</option>
								<option value={ProjectStyle.SCANDINAVIAN}>Scandinavian</option>
							</select>
						</div>

						<div className={styles.filterField}>
							<label>Type</label>
							<select
								value={filters.type}
								onChange={(e) => handleFilterChange('type', e.target.value)}
							>
								<option value="">Any Type</option>
								<option value={ProjectType.RESIDENTIAL}>Residential</option>
								<option value={ProjectType.COMMERCIAL}>Commercial</option>
								<option value={ProjectType.OFFICE}>Office</option>
								<option value={ProjectType.ENTERTAINMENT}>Entertainment</option>
							</select>
						</div>

						<div className={styles.filterField}>
							<label>Budget</label>
							<select
								value={filters.budget}
								onChange={(e) => handleFilterChange('budget', e.target.value)}
							>
								<option value="">Any Budget</option>
								<option value="0-10000">Under $10k</option>
								<option value="10000-50000">$10k – $50k</option>
								<option value="50000-100000">$50k – $100k</option>
								<option value="100000-250000">$100k – $250k</option>
								<option value="250000-500000">$250k – $500k</option>
								<option value="500000-1000000">$500k – $1M</option>
								<option value="1000000+">$1M+</option>
							</select>
						</div>

						<div className={styles.filterField}>
							<label>Duration</label>
							<select
								value={filters.duration}
								onChange={(e) => handleFilterChange('duration', e.target.value)}
							>
								<option value="">Any Duration</option>
								<option value="1-3">1 – 3 months</option>
								<option value="3-6">3 – 6 months</option>
								<option value="6-12">6 – 12 months</option>
								<option value="12+">12+ months</option>
							</select>
						</div>

						<button type="submit" className={styles.filterBtn}>
							Search Projects
						</button>
					</form>
				</div>
			</section>
		</>
	);
};

export default Hero;
