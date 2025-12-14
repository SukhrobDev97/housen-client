import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './RecommendedSection.module.scss';

interface RecommendedSectionProps {
	initialInput?: ProjectsInquiry;
}

const RecommendedSection = (props: RecommendedSectionProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);

	const queryInput: ProjectsInquiry = {
		page: 1,
		limit: 4,
		sort: 'projectViews',
		direction: 'DESC',
		search: {},
		...initialInput,
	};

	/** APOLLO REQUESTS **/
	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	} = useQuery(GET_PROJECTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecommendedProjects(data?.getProjects?.list || []);
		},
	});

	/** HANDLERS **/
	const handleViewProject = (projectId: string) => {
		router.push(`/property/detail?id=${projectId}`);
	};

	if (!recommendedProjects || recommendedProjects.length === 0) return null;

	// Compact Card Component for Recommended Section
	const RecommendCard = ({ project }: { project: Project }) => {
		const imagePath = project?.projectImages?.[0]
			? `${REACT_APP_API_URL}/${project.projectImages[0]}`
			: '/img/banner/header1.svg';

		return (
			<Box className={styles.recommendCard} onClick={() => handleViewProject(project._id)}>
				<Box
					className={styles.cardImage}
					style={{ backgroundImage: `url(${imagePath})` }}
				/>
				<Box className={styles.cardContent}>
					<Typography className={styles.cardTitle}>{project.projectTitle}</Typography>
					<Box className={styles.cardMeta}>
						<span className={styles.metaItem}>
							<PaletteIcon />
							{project.projectStyle}
						</span>
					</Box>
					<Box className={styles.cardFooter}>
						<Typography className={styles.cardPrice}>
							${project.projectPrice?.toLocaleString()}
						</Typography>
						<button className={styles.viewBtn}>
							View <ArrowForwardIcon />
						</button>
					</Box>
				</Box>
			</Box>
		);
	};

	if (device === 'mobile') {
		return (
			<Box className={styles.recommendedSection}>
				<Box className={styles.sectionHeader}>
					<Typography className={styles.sectionTitle}>Recommended for you</Typography>
				</Box>
				<Box className={styles.cardsContainerMobile}>
					{recommendedProjects.map((project: Project) => (
						<RecommendCard key={project._id} project={project} />
					))}
				</Box>
			</Box>
		);
	} else {
		return (
			<Box className={styles.recommendedSection}>
				<Box className={styles.sectionHeader}>
					<Typography className={styles.sectionTitle}>Recommended for you</Typography>
					<Typography className={styles.sectionSubtitle}>Projects you might be interested in</Typography>
				</Box>
				<Box className={styles.cardsGrid}>
					{recommendedProjects.map((project: Project) => (
						<RecommendCard key={project._id} project={project} />
					))}
				</Box>
			</Box>
		);
	}
};

export default RecommendedSection;
