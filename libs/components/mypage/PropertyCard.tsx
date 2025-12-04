import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Project } from '../../types/property/property';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { ProjectStatus } from '../../enums/property.enum';

interface ProjectCardProps {
	project: Project;
	deleteProjectHandler?: any;
	memberPage?: boolean;
	updateProjectHandler?: any;
}

export const ProjectCard = (props: ProjectCardProps) => {
	const { project, deleteProjectHandler, memberPage, updateProjectHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProject = async (id: string) => {
		console.log('+pushEditProject: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addProject', projectId: id },
		});
	};

	const pushProjectDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/property/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE PROJECT CARD</div>;
	} else
		return (
			<Stack className="property-card-box">
				<Stack className="image-box" onClick={() => pushProjectDetail(project?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${project.projectImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushProjectDetail(project?._id)}>
					<Typography className="name">{project.projectTitle}</Typography>
					<Typography className="address">{project.projectStyle}</Typography>
					<Typography className="price">
						<strong>${formatterStr(project?.projectPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{project.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{project.projectStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && project.projectStatus !== 'COMPLETED' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{project.projectStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateProjectHandler(ProjectStatus.COMPLETED, project?._id);
									}}
								>
									Completed
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{project.projectViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && project.projectStatus === ProjectStatus.ACTIVE &&  (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditProject(project._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteProjectHandler(project._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
