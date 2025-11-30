import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	Box,
	Pagination,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { ProjectsInquiry } from '../../types/property/property.input';
import { ProjectStyle, ProjectType } from '../../enums/property.enum';
import { Project } from '../../types/property/property';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import TopProjectSidebarCard from './TopProjectSidebarCard';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: ProjectsInquiry;
	setSearchFilter: any;
	initialInput: ProjectsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [projectStyle, setProjectStyle] = useState<ProjectStyle[]>(Object.values(ProjectStyle));
	const [projectType, setProjectType] = useState<ProjectType[]>(Object.values(ProjectType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);
	const [openStyle, setOpenStyle] = useState<boolean>(false);
	const [openType, setOpenType] = useState<boolean>(false);
	const [openOptions, setOpenOptions] = useState<boolean>(false);
	const [topProjects, setTopProjects] = useState<Project[]>([]);
	const [displayedTopProjects, setDisplayedTopProjects] = useState<Project[]>([]);
	const [topProjectsPage, setTopProjectsPage] = useState<number>(1);
	const [topProjectsPerPage] = useState<number>(3);
	const [totalTopProjectsPages, setTotalTopProjectsPages] = useState<number>(1);

	const topProjectsQueryInput = {
		page: 1,
		limit: 9,
		sort: 'projectRank',
		direction: 'DESC',
		search: {},
	};

	const {
		loading: getTopProjectsLoading,
		data: getTopProjectsData,
		error: getTopProjectsError,
	} = useQuery(GET_PROJECTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: topProjectsQueryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopProjects(data?.getProjects?.list || []);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (topProjects.length > 0) {
			const startIndex = (topProjectsPage - 1) * topProjectsPerPage;
			const endIndex = startIndex + topProjectsPerPage;
			setDisplayedTopProjects(topProjects.slice(startIndex, endIndex));
			setTotalTopProjectsPages(Math.ceil(topProjects.length / topProjectsPerPage));
		}
	}, [topProjects, topProjectsPage, topProjectsPerPage]);

	useEffect(() => {

		if (searchFilter?.search?.projectStyleList?.length == 0) {
			delete searchFilter.search.projectStyleList;
			setShowMore(false);
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.projectStyleList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const projectStyleSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, projectStyleList: [...(searchFilter?.search?.projectStyleList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, projectStyleList: [...(searchFilter?.search?.projectStyleList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.projectStyleList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								projectStyleList: searchFilter?.search?.projectStyleList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								projectStyleList: searchFilter?.search?.projectStyleList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('projectStyleSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, projectStyleSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const projectTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('projectTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const projectOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('projectOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, projectOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const projectPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	const handleTopProjectsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setTopProjectsPage(value);
	};

	if (device === 'mobile') {
		return <div>PROJECTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Design</Typography>
					<Stack className={'search-input-wrapper'}>
						<Box component={'div'} className={'search-input-container'}>
							<Box component={'div'} className={'search-icon-wrapper'}>
								<img src={'/img/icons/search_icon.png'} alt={'search'} className={'search-icon'} />
							</Box>
							<OutlinedInput
								value={searchText}
								type={'text'}
								className={'search-input'}
								placeholder={'Search...'}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
								startAdornment={null}
								endAdornment={null}
							/>
						</Box>
						<Button
							className={'clear-all-button'}
							onClick={refreshHandler}
							variant="text"
						>
							Clear all
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Stack 
						className={'filter-section-header'} 
						onClick={() => setOpenStyle(!openStyle)}
						sx={{ cursor: 'pointer', userSelect: 'none' }}
					>
						<Typography className={'title'}>Project Style</Typography>
						{openStyle ? (
							<KeyboardArrowUpRoundedIcon className={'toggle-icon'} />
						) : (
							<KeyboardArrowDownRoundedIcon className={'toggle-icon'} />
						)}
					</Stack>
					<Stack
						className={`property-location ${openStyle ? 'open' : 'closed'}`}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.projectStyleList) {
								setShowMore(false);
							}
						}}
					>
						{projectStyle.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.projectStyleList || []).includes(location as ProjectStyle)}
										onChange={projectStyleSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Stack 
						className={'filter-section-header'} 
						onClick={() => setOpenType(!openType)}
						sx={{ cursor: 'pointer', userSelect: 'none' }}
					>
						<Typography className={'title'}>Project Type</Typography>
						{openType ? (
							<KeyboardArrowUpRoundedIcon className={'toggle-icon'} />
						) : (
							<KeyboardArrowDownRoundedIcon className={'toggle-icon'} />
						)}
					</Stack>
					<Stack
						className={`filter-section-content ${openType ? 'open' : 'closed'}`}
					>
						{projectType.map((type: string) => (
							<Stack className={'input-box'} key={type}>
								<Checkbox
									id={type}
									className="property-checkbox"
									color="default"
									size="small"
									value={type}
									onChange={projectTypeSelectHandler}
									checked={(searchFilter?.search?.typeList || []).includes(type as ProjectType)}
								/>
								<label style={{ cursor: 'pointer' }}>
									<Typography className="property_type">{type}</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Stack 
						className={'filter-section-header'} 
						onClick={() => setOpenOptions(!openOptions)}
						sx={{ cursor: 'pointer', userSelect: 'none' }}
					>
						<Typography className={'title'}>Options</Typography>
						{openOptions ? (
							<KeyboardArrowUpRoundedIcon className={'toggle-icon'} />
						) : (
							<KeyboardArrowDownRoundedIcon className={'toggle-icon'} />
						)}
					</Stack>
					<Stack
						className={`filter-section-content ${openOptions ? 'open' : 'closed'}`}
					>
						<Stack className={'input-box'}>
							<Checkbox
								id={'Barter'}
								className="property-checkbox"
								color="default"
								size="small"
								value={'projectCollaboration'}
								checked={(searchFilter?.search?.options || []).includes('projectCollaboration')}
								onChange={projectOptionSelectHandler}
							/>
							<label htmlFor={'Barter'} style={{ cursor: 'pointer' }}>
								<Typography className="propert-type">Collaboration</Typography>
							</label>
						</Stack>
						<Stack className={'input-box'}>
							<Checkbox
								id={'Rent'}
								className="property-checkbox"
								color="default"
								size="small"
								value={'projectPublic'}
								checked={(searchFilter?.search?.options || []).includes('projectPublic')}
								onChange={projectOptionSelectHandler}
							/>
							<label htmlFor={'Rent'} style={{ cursor: 'pointer' }}>
								<Typography className="propert-type">Public</Typography>
							</label>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									projectPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									projectPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>

				{/* Top Rated Projects Section */}
				<Stack className={'find-your-home'} sx={{ marginTop: '30px' }}>
					<Typography className={'title'} sx={{ marginBottom: '16px' }}>Top Rated Projects</Typography>
					<Stack className={'top-projects-sidebar'}>
						{displayedTopProjects.length > 0 ? (
							<>
								{displayedTopProjects.map((project: Project) => (
									<TopProjectSidebarCard key={project._id} project={project} />
								))}
								{totalTopProjectsPages > 1 && (
									<Box className={'top-projects-pagination'}>
										<Pagination
											count={totalTopProjectsPages}
											page={topProjectsPage}
											onChange={handleTopProjectsPageChange}
											size="small"
											sx={{
												'& .MuiPaginationItem-root': {
													fontSize: '12px',
												},
											}}
										/>
									</Box>
								)}
							</>
						) : (
							<Typography sx={{ fontSize: '14px', color: '#666', textAlign: 'center', padding: '20px' }}>
								No top projects available
							</Typography>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;

