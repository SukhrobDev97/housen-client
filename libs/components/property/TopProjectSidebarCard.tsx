import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { Project } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface TopProjectSidebarCardProps {
	project: Project;
}

const TopProjectSidebarCard = (props: TopProjectSidebarCardProps) => {
	const { project } = props;
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/property/detail?id=${project._id}`);
	};

	return (
		<Stack 
			className={'top-project-sidebar-card'}
			direction={'row'}
			onClick={handleCardClick}
			sx={{ cursor: 'pointer' }}
		>
			<Box 
				component={'div'} 
				className={'card-image'}
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
			/>
			<Box component={'div'} className={'card-info'}>
				<Typography className={'project-title'}>{project?.projectTitle}</Typography>
				<Typography className={'project-type'}>{project?.projectType}</Typography>
				<Typography className={'project-price'}>${project?.projectPrice?.toLocaleString()}</Typography>
			</Box>
		</Stack>
	);
};

export default TopProjectSidebarCard;

