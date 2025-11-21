import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Project } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProjectCardProps {
	project: Project;
}

const TrendProjectCard = (props: TrendProjectCardProps) => {
	const { project } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={project._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					<div>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project.projectDuration} months</span>
						</div>
						
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{project.projectCollaboration ? 'Collaboration' : ''} {project.projectCollaboration && project.projectPublic && '/'}{' '}
							{project.projectPublic ? 'Public' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
							<IconButton color={'default'}>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{project?.projectLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={project._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages[0]})` }}
				>
					<div>${project.projectPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project.projectTitle}</strong>
					<p className={'desc'}>{project.projectDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project.projectStyle} style</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project.projectDuration} months</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{project.projectCollaboration ? 'Collaboration' : ''} {project.projectCollaboration && project.projectPublic && '/'}{' '}
							{project.projectPublic ? 'Public' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
							<IconButton color={'default'}>
								{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{project?.projectLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendProjectCard;
