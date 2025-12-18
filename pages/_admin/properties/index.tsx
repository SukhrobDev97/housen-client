import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { PropertyPanelList } from '../../../libs/components/admin/properties/PropertyList';
import { AllProjectsInquiry } from '../../../libs/types/property/property.input';
import { Project } from '../../../libs/types/property/property';
import { ProjectStatus, ProjectStyle,  } from '../../../libs/enums/property.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { ProjectUpdate } from '../../../libs/types/property/property.update';
import { T } from '../../../libs/types/common';
import { REMOVE_PROJECT_BY_ADMIN, UPDATE_PROJET_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS_BY_ADMIN } from '../../../apollo/admin/query';

const AdminProjects: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [projectsInquiry, setProjectsInquiry] = useState<AllProjectsInquiry>(initialInquiry);
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectsTotal, setProjectsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		projectsInquiry?.search?.projectStatus ? projectsInquiry?.search?.projectStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateProjectByAdmin] = useMutation(UPDATE_PROJET_BY_ADMIN);
	const [removeProjectByAdmin] = useMutation(REMOVE_PROJECT_BY_ADMIN);

	const {
		loading: getAllProjectsByAdminLoading,
		data: getAllProjectsByAdminData,
		error: getAllProjectsByAdminError,
		refetch: getAllProjectsByAdminRefetch,
	} = useQuery(GET_ALL_PROJECTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: projectsInquiry,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProjects(data?.getAllProjectsByAdmin?.list);
			setProjectsTotal(data?.getAllProjectsByAdmin?.metaCounter[0]?.total);
		},
	})


	/** LIFECYCLES **/
	useEffect(() => {
				getAllProjectsByAdminRefetch({ inquiry: projectsInquiry  }).then();

	}, [projectsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		projectsInquiry.page = newPage + 1;
		await getAllProjectsByAdminRefetch({ inquiry: projectsInquiry  });
		setProjectsInquiry({ ...projectsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		projectsInquiry.limit = parseInt(event.target.value, 10);
		await getAllProjectsByAdminRefetch({ inquiry: projectsInquiry  });
		projectsInquiry.page = 1;
		setProjectsInquiry({ ...projectsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setProjectsInquiry({ ...projectsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setProjectsInquiry({ ...projectsInquiry, search: { projectStatus: ProjectStatus.ACTIVE } });
				break;
			case 'SOLD':
				setProjectsInquiry({ ...projectsInquiry, search: { projectStatus: ProjectStatus.COMPLETED } });
				break;
			case 'DELETE':
				setProjectsInquiry({ ...projectsInquiry, search: { projectStatus: ProjectStatus.DELETE } });
				break;
			default:
				delete projectsInquiry?.search?.projectStatus;
				setProjectsInquiry({ ...projectsInquiry });
				break;
		}
	};

	const removeProjectHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeProjectByAdmin({
					variables: {
						input: id,
					},
				});
				await getAllProjectsByAdminRefetch({ inquiry: projectsInquiry });
			
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setProjectsInquiry({
					...projectsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...projectsInquiry.search,
						projectStyleList: [newValue as ProjectStyle],
					},
				});
			} else {
				delete projectsInquiry?.search?.projectStyleList;
				setProjectsInquiry({ ...projectsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateProjectHandler = async (updateData: ProjectUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateProjectByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllProjectsByAdminRefetch({ inquiry: projectsInquiry  });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Project List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e:T) => tabChangeHandler(e, 'ALL')}

									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e:T) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e:T) => tabChangeHandler(e, 'COMPLETED')}
									value="COMPLETED"
									className={value === 'COMPLETED' ? 'li on' : 'li'}
								>
									Completed
								</ListItem>
								<ListItem
									onClick={(e:T) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(ProjectStyle).map((style: string) => (
										<MenuItem value={style} onClick={() => searchTypeHandler(style)} key={style}>
											{style}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<PropertyPanelList
							projects={projects}
							anchorEl={anchorEl}	
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateProjectHandler={updateProjectHandler}
							removeProjectHandler={removeProjectHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={projectsTotal}
							rowsPerPage={projectsInquiry?.limit}
							page={projectsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminProjects.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminProjects);
