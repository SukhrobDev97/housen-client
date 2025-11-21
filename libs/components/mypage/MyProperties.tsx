import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { Project } from '../../types/property/property';
import { AgencyProjectsInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { ProjectStatus } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { ProjectCard } from './PropertyCard';

const MyProjects: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgencyProjectsInquiry>(initialInput);
	const [agencyProjects, setAgencyProjects] = useState<Project[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProjectStatus) => {
		setSearchFilter({ ...searchFilter, search: { projectStatus: value } });
	};

	const deleteProjectHandler = async (id: string) => {};

	const updateProjectHandler = async (status: string, id: string) => {};

	if (user?.memberType !== 'AGENCY') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>HOUSEN PROJECTS MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Projects</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ProjectStatus.ACTIVE)}
							className={searchFilter.search.projectStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Processing
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProjectStatus.COMPLETED)}
							className={searchFilter.search.projectStatus === 'COMPLETED' ? 'active-tab-name' : 'tab-name'}
						>
							Completed
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							<Typography className="title-text">Action</Typography>
						</Stack>

						{agencyProjects?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Project available!</p>
							</div>
						) : (
							agencyProjects.map((project: Project) => {
								return (
									<ProjectCard
										project={project}
										deleteProjectHandler={deleteProjectHandler}
										updateProjectHandler={updateProjectHandler}
									/>
								);
							})
						)}

						{agencyProjects.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} project exist</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			projectStatus: 'ACTIVE',
		},
	},
};

export default MyProjects;
