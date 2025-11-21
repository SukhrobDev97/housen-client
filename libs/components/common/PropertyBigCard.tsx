import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Project } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface ProjectBigCardProps {
	project: Project;
}

const ProjectBigCard = (props: ProjectBigCardProps) => {
	const { project } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goProjectDetatilPage = (projectId: string) => {
		router.push(`/property/detail?id=${projectId}`);
	};

	if (device === 'mobile') {
		return <div>PROJECT BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goProjectDetatilPage(project?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${project?.projectImages?.[0]})` }}
				>
					{project?.projectRank && project?.projectRank >= 50 && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>best</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(project?.projectPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{project?.projectTitle}</strong>
					<p className={'desc'}>{project?.projectDesc}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{project?.projectType} type</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{project?.projectDuration} months</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{project?.projectPublic ? <p>Rent</p> : <span>Public</span>}
							{project?.projectCollaboration ? <p>Barter</p> : <span>Collaboration</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{project?.projectViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: any) => {
									e.stopPropagation();
								}}
							>
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

export default ProjectBigCard;
