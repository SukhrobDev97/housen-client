import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Project } from '../../../types/property/property';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { ProjectStatus } from '../../../enums/property.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	style: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENCY',
	},
	{
		id: 'style',
		numeric: false,
		disablePadding: false,
		label: 'STYLE',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, project: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface PropertyPanelListType {
	projects?: Project[];
	anchorEl?: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProjectHandler: any;
	removeProjectHandler: any;
}

export const PropertyPanelList = (props: PropertyPanelListType) => {
	const {
		projects,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateProjectHandler,
		removeProjectHandler,
	} = props;
	const safeProjects: Project[] = Array.isArray(projects) ? projects : [];
	const safeAnchorEl: any[] = Array.isArray(anchorEl) ? anchorEl : [];

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{safeProjects.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{safeProjects.length !== 0 &&
							safeProjects.map((project: Project, index: number) => {
								const imgPath = project?.projectImages?.[0];
								const projectImage = imgPath ? `${REACT_APP_API_URL}/${imgPath}` : '';

								return (
									<TableRow hover key={project?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{project._id}</TableCell>
										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/property/detail?id=${project?._id}`}>
													<div>
														<Avatar alt="Remy Sharp" src={projectImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/property/detail?id=${project?._id}`}>
													<div>{project.projectTitle}</div>
												</Link>
											</Stack>
										</TableCell>
										<TableCell align="center">{project.projectPrice}</TableCell>
										<TableCell align="center">{project.memberData?.memberNick}</TableCell>
										<TableCell align="center">{project.projectStyle}</TableCell>
										<TableCell align="center">{project.projectType}</TableCell>
										<TableCell align="center">
											{project.projectStatus === ProjectStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeProjectHandler(project._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{project.projectStatus === ProjectStatus.COMPLETED && (
												<Button className={'badge warning'}>{project.projectStatus}</Button>
											)}	

											{project.projectStatus === ProjectStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{project.projectStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={safeAnchorEl[index]}
														open={Boolean(safeAnchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(ProjectStatus)
															.filter((ele) => ele !== project.projectStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateProjectHandler({ _id: project._id, projectStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
