import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Project } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface ProjectCardType {
	project: Project;
	likeProjectHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProjectCard = (props: ProjectCardType) => {
	const { project, likeProjectHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = project?.projectImages[0]
		? `${REACT_APP_API_URL}/${project?.projectImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>PROJECTCARD CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: project?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{project && project?.projectRank > 0 && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>BEST</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(project?.projectPrice)}</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/property/detail',
									query: { id: project?._id },
								}}
							>
								<Typography>{project.projectTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{project.projectStyle}, {project.projectStyle}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<img src="/img/icons/bed.svg" alt="" /> <Typography>{project.projectDuration} duration</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/room.svg" alt="" /> <Typography>{project.projectPrice} price</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={project.projectPublic ? '' : 'disabled-type'}
							>
								public
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={project.projectCollaboration ? '' : 'disabled-type'}
							>
								collaboration
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{project?.projectViews}</Typography>
								<IconButton color={'default'} onClick={() => likeProjectHandler(user, project?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : project?.meLiked && project?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{project?.projectLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProjectCard;
