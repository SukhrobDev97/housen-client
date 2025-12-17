import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Project } from '../../types/property/property';
import { ProjectsInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';

const MemberProjects: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ProjectsInquiry>({ ...initialInput });
	const [agencyProjects, setAgencyProjects] = useState<Project[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	} = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgencyProjects(data?.getProjects?.list);
			setTotal(data?.getProjects?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getProjectsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const pushProjectDetail = async (id: string) => {
		await router.push({
			pathname: '/property/detail',
			query: { id: id },
		});
	};

	// Get status class for styling
	const getStatusClass = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'status-active';
			case 'COMPLETED':
				return 'status-completed';
			case 'SOLD':
				return 'status-sold';
			default:
				return 'status-default';
		}
	};

	if (device === 'mobile') {
		return <div>HOUSEN PROJECTS MOBILE</div>;
	} else {
		return (
			<div id="member-properties-page">
				{/* Header */}
				<Stack className="main-title-box">
					<Typography className="main-title">Projects</Typography>
					<Typography className="total-count">{total} project{total !== 1 ? 's' : ''}</Typography>
				</Stack>

				{/* Projects List */}
				<Stack className="projects-list">
					{/* Table Header */}
					{agencyProjects?.length > 0 && (
						<Stack className="list-header">
							<Typography className="header-text col-project">Project</Typography>
							<Typography className="header-text col-date">Published</Typography>
							<Typography className="header-text col-status">Status</Typography>
							<Typography className="header-text col-views">Views</Typography>
						</Stack>
					)}

					{/* Empty State */}
					{agencyProjects?.length === 0 && (
						<Stack className="empty-state">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography className="empty-title">No projects yet</Typography>
							<Typography className="empty-text">This member hasn't published any projects yet.</Typography>
						</Stack>
					)}

					{/* Project Rows */}
					{agencyProjects?.map((project: Project) => (
						<Stack
							key={project?._id}
							className="project-row"
							onClick={() => pushProjectDetail(project?._id)}
						>
							{/* Thumbnail */}
							<Stack className="col-project">
								<div className="project-thumbnail">
									<img
										src={`${REACT_APP_API_URL}/${project?.projectImages?.[0]}`}
										alt={project?.projectTitle}
									/>
								</div>
								<Stack className="project-info">
									<Typography className="project-title">{project?.projectTitle}</Typography>
									<Typography className="project-style">{project?.projectStyle}</Typography>
									<Typography className="project-price">${formatterStr(project?.projectPrice)}</Typography>
								</Stack>
							</Stack>

							{/* Date */}
							<Stack className="col-date">
								<Typography className="date-text">
									<Moment format="DD MMM, YYYY">{project?.createdAt}</Moment>
								</Typography>
							</Stack>

							{/* Status */}
							<Stack className="col-status">
								<span className={`status-badge ${getStatusClass(project?.projectStatus)}`}>
									{project?.projectStatus}
								</span>
							</Stack>

							{/* Views */}
							<Stack className="col-views">
								<VisibilityIcon />
								<Typography className="views-count">{project?.projectViews || 0}</Typography>
							</Stack>
						</Stack>
					))}

					{/* Pagination */}
					{agencyProjects?.length > 0 && (
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFilter.limit)}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="pagination-text">
								{total} project{total !== 1 ? 's' : ''} available
							</Typography>
						</Stack>
					)}
				</Stack>
			</div>
		);
	}
};

MemberProjects.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MemberProjects;
