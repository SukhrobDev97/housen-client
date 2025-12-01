import React, { ChangeEvent, MouseEvent, useEffect, useState, useCallback } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import AgencyCard from '../../libs/components/common/AgentCard';
import CompareBar from '../../libs/components/agent/CompareBar';
import CompareModal from '../../libs/components/agent/CompareModal';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_AGENCIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgencyList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agencies, setAgencies] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	
	// Compare state - maintained across scroll/sort
	const [compareList, setCompareList] = useState<Member[]>([]);
	const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	
	const {
		loading: getAgenciesLoading,
		data: getAgenciesData,
		error: getAgenciesError,
		refetch: getAgenciesRefetch,
	} = useQuery(GET_AGENCIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgencies(data?.getAgencies?.list);
			setTotal(data?.getAgencies?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
		  if (!id) return;
		  if (!user._id) throw new Error(Messages.error2);
	  
		  await likeTargetMember({
			variables: {
			  input: id,
			},
		  });
	  
		  await getAgenciesRefetch({ input: searchFilter });
		  await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
		  console.log('ERROR, likeProjectHandler:', err.message);
		  sweetMixinErrorAlert(err.message).then();
		}
	  };
	  
	// Compare handlers - memoized to maintain state
	const handleCompareToggle = useCallback((agency: Member) => {
		setCompareList(prev => {
			const isSelected = prev.find(a => a._id === agency._id);
			if (isSelected) {
				return prev.filter(a => a._id !== agency._id);
			} else if (prev.length < 2) {
				return [...prev, agency];
			}
			return prev;
		});
	}, []);

	const removeFromCompare = useCallback((agencyId: string) => {
		setCompareList(prev => prev.filter(a => a._id !== agencyId));
	}, []);

	const openCompareModal = useCallback(() => {
		if (compareList.length === 2) {
			setIsCompareModalOpen(true);
		}
	}, [compareList.length]);

	const closeCompareModal = useCallback(() => {
		setIsCompareModalOpen(false);
	}, []);

	if (device === 'mobile') {
		return <h1>AGENCIES PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				{/* Hero Section */}
				<Stack className={'agency-hero'}>
					<Box component={'div'} className={'hero-banner'}>
						<img src="/img/banner/agencyPage.jpeg" alt="Agencies Banner" />
						<Box component={'div'} className={'hero-overlay'}></Box>
						<Stack className={'hero-content'}>
							<Stack className={'container'}>
								<Stack className={'breadcrumb'}>
									<Link href={'/'}>
										<span>Home</span>
									</Link>
									<span className={'separator'}>Agencies</span>
								</Stack>
								<h1 className={'page-title'}>Our Trusted Agencies</h1>
								<p className={'page-subtitle'}>Find the perfect partner for your dream project</p>
							</Stack>
						</Stack>
					</Box>
				</Stack>

				<Stack className={'container'}>
					{/* Filter Bar */}
					<Stack className={'filter-bar'}>
						<Box component={'div'} className={'search-box'}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<input
								type="text"
								placeholder={'Search agencies...'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
							/>
						</Box>
						<Box component={'div'} className={'sort-box'}>
							<span>Sort by</span>
								<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{filterSortName}
								</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
								<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>Recent</MenuItem>
								<MenuItem onClick={sortingHandler} id={'old'} disableRipple>Oldest</MenuItem>
								<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>Likes</MenuItem>
								<MenuItem onClick={sortingHandler} id={'views'} disableRipple>Views</MenuItem>
								</Menu>
						</Box>
					</Stack>

					{/* Agency Grid */}
					<Stack className={'agency-grid'}>
						{agencies?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Agencies available!</p>
							</div>
						) : (
							agencies.map((agency: Member, index: number) => {
								return (
									<AgencyCard 
										agency={agency} 
										key={agency._id}  
										likeMemberHandler={likeMemberHandler}
										onCompareToggle={handleCompareToggle}
										isCompareSelected={!!compareList.find(a => a._id === agency._id)}
										index={index}
									/>
								);
							})
						)}
					</Stack>

					{/* Pagination */}
					<Stack className={'pagination-section'}>
							{agencies.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
								shape="rounded"
									/>
							)}
						{agencies.length !== 0 && (
							<span className="total-count">
								Showing {agencies.length} of {total} agencies
							</span>
						)}
					</Stack>
				</Stack>

				{/* Compare Bar - Sticky */}
				<CompareBar
					compareList={compareList}
					onRemove={removeFromCompare}
					onCompare={openCompareModal}
				/>

				{/* Compare Modal */}
				<CompareModal
					agencies={compareList}
					isOpen={isCompareModalOpen}
					onClose={closeCompareModal}
				/>
			</Stack>
		);
	}
};

AgencyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgencyList);
