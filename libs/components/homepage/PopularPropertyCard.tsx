import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Project } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularProjectCardProps {
	project: Project;
}

const PopularProjectCard = (props: PopularProjectCardProps) => {
	const { project } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					{project?.projectRank && project?.projectRank >= 50 ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>best</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectType}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project?.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project?.projectDuration} months</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{project?.projectCollaboration ? 'Collaboration' : 'Solo'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					{project?.projectRank && project?.projectRank >= 50 ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>best</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectType}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project?.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project?.projectDuration} months</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{project?.projectCollaboration ? 'Collaboration' : 'Solo'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularProjectCard;
