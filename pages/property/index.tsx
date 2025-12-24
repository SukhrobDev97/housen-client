import React, { ChangeEvent, MouseEvent, useEffect, useState, useMemo, useRef } from 'react';
import { NextPage } from 'next';
import { Box, Button, Pagination, Stack, Typography, IconButton, Rating } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Project } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ProjectsInquiry } from '../../libs/types/property/property.input';
import ProjectCard from '../../libs/components/property/PropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_PROJECTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PROJECT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { products, Product } from '../../libs/data/productsData';
import { useCart } from '../../libs/context/CartContext';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProjectList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	// Parse initial filter from URL (handles both encoded JSON and individual query params)
	const parseInitialFilter = (): ProjectsInquiry => {
		// First, try to parse from 'input' query parameter (JSON format)
		if (router?.query?.input) {
			try {
				let inputStr = router.query.input as string;
				// Try to decode if encoded
				try {
					inputStr = decodeURIComponent(inputStr);
				} catch (e) {
					// Already decoded or raw JSON, use as-is
				}
				return JSON.parse(inputStr);
			} catch (error) {
				console.error('Error parsing initial filter from URL (input param):', error);
			}
		}
		
		// Fallback: Parse from individual query parameters (legacy format)
		if (router?.query) {
			const query = router.query;
			const filter: ProjectsInquiry = {
				page: query.page ? parseInt(query.page as string) : 1,
				limit: query.limit ? parseInt(query.limit as string) : 9,
				search: {},
			};
			
			// Parse projectStyleList
			if (query.projectStyleList) {
				const styles = Array.isArray(query.projectStyleList) 
					? query.projectStyleList 
					: [query.projectStyleList];
				filter.search.projectStyleList = styles as any[];
			}
			
			// Parse typeList
			if (query.typeList) {
				const types = Array.isArray(query.typeList) 
					? query.typeList 
					: [query.typeList];
				filter.search.typeList = types as any[];
			}
			
			// Parse budget/price range
			if (query.budget) {
				const budget = query.budget as string;
				const [start, end] = budget.split('-').map(Number);
				if (!isNaN(start) && !isNaN(end)) {
					filter.search.pricesRange = { start, end };
				}
			}
			
			// Parse options
			if (query.options) {
				const options = Array.isArray(query.options) 
					? query.options 
					: [query.options];
				filter.search.options = options as string[];
			}
			
			// Parse text
			if (query.text) {
				filter.search.text = query.text as string;
			}
			
			// Parse sort and direction
			if (query.sort) filter.sort = query.sort as string;
			if (query.direction) filter.direction = query.direction as any;
			
			// Only return if we found some filters
			if (Object.keys(filter.search).length > 0 || filter.sort || filter.direction) {
				return filter;
			}
		}
		
		return initialInput;
	};

	const [searchFilter, setSearchFilter] = useState<ProjectsInquiry>(parseInitialFilter());
	const [projects, setProjects] = useState<Project[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [activeSortOption, setActiveSortOption] = useState<string>('new');
	const [productFavorites, setProductFavorites] = useState<number[]>([]);

	// Recommended products (4 items)
	const recommendedProducts = products.slice(0, 4);

	// Clean filter: remove empty arrays and default price range before sending to API
	const cleanFilterForAPI = (filter: ProjectsInquiry): ProjectsInquiry => {
		const cleaned: ProjectsInquiry = {
			page: filter.page || 1,
			limit: filter.limit || 9,
			search: {},
		};
		
		if (filter.sort) cleaned.sort = filter.sort;
		if (filter.direction) cleaned.direction = filter.direction;
		
		const search = filter.search || {};
		
		// Only include arrays if they have items (empty arrays = zero results)
		if (search.projectStyleList && search.projectStyleList.length > 0) {
			cleaned.search.projectStyleList = search.projectStyleList;
			console.log('[DEBUG] Sending projectStyleList:', search.projectStyleList);
		}
		if (search.typeList && search.typeList.length > 0) {
			cleaned.search.typeList = search.typeList;
		}
		if (search.options && search.options.length > 0) {
			cleaned.search.options = search.options;
		}
		// Remove default price range (0-2000000) - DO NOT include if it's default
		if (search.pricesRange) {
			const isDefault = search.pricesRange.start === 0 && search.pricesRange.end === 2000000;
			if (!isDefault) {
				cleaned.search.pricesRange = search.pricesRange;
			}
		}
		if (search.text && search.text.trim()) {
			cleaned.search.text = search.text.trim();
		}
		if (search.memberId) {
			cleaned.search.memberId = search.memberId;
		}
		
		// If search object is empty, don't include it
		if (Object.keys(cleaned.search).length === 0) {
			cleaned.search = {};
		}
		
		return cleaned;
	};

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT)

	// Clean filter for API call - memoize to prevent unnecessary recalculations
	const cleanedFilter = useMemo(() => {
		const cleaned = cleanFilterForAPI(searchFilter);
		console.log('[DEBUG] searchFilter:', searchFilter);
		console.log('[DEBUG] cleanedFilter:', cleaned);
		console.log('[DEBUG] Apollo variables:', JSON.stringify(cleaned));
		console.log('[DEBUG] projectStyleList in cleaned:', cleaned.search.projectStyleList);
		console.log('[DEBUG] typeList in cleaned:', cleaned.search.typeList);
		return cleaned;
	}, [searchFilter]);

	// Track if this is initial mount to avoid double fetch
	const isInitialMount = useRef(true);

	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	  } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',
		variables: { input: cleanedFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T ) => {
		  console.log('[DEBUG] Apollo completed - Full data:', JSON.stringify(data, null, 2));
		  console.log('[DEBUG] Apollo completed - getProjects:', data?.getProjects);
		  console.log('[DEBUG] Apollo completed - list:', data?.getProjects?.list);
		  console.log('[DEBUG] Apollo completed - list length:', data?.getProjects?.list?.length);
		  console.log('[DEBUG] Apollo completed - metaCounter:', data?.getProjects?.metaCounter);
		  console.log('[DEBUG] Apollo completed - metaCounter[0]:', data?.getProjects?.metaCounter?.[0]);
		  console.log('[DEBUG] Apollo completed - total:', data?.getProjects?.metaCounter?.[0]?.total);
		  
		  const projectsList = data?.getProjects?.list || [];
		  const totalCount = data?.getProjects?.metaCounter?.[0]?.total || 0;
		  
		  console.log('[DEBUG] Setting projects:', projectsList);
		  console.log('[DEBUG] Setting total:', totalCount);
		  
		  setProjects(projectsList);
		  setTotal(totalCount);
		},
	  });

	// Refetch when searchFilter changes (but skip initial mount)
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		console.log('[DEBUG] searchFilter changed, refetching...');
		getProjectsRefetch({ input: cleanedFilter });
	}, [searchFilter, cleanedFilter, getProjectsRefetch]);

	/** LIFECYCLES **/
	// Update state from Apollo data hook (fallback if onCompleted doesn't fire)
	useEffect(() => {
		if (getProjectsData?.getProjects) {
			console.log('[DEBUG] useEffect - Updating from hook data:', getProjectsData);
			const projectsList = getProjectsData.getProjects.list || [];
			const totalCount = getProjectsData.getProjects.metaCounter?.[0]?.total || 0;
			console.log('[DEBUG] useEffect - Setting projects:', projectsList);
			console.log('[DEBUG] useEffect - Setting total:', totalCount);
			setProjects(projectsList);
			setTotal(totalCount);
		}
	}, [getProjectsData]);

	// Debug: Also log data from hook return when it changes
	useEffect(() => {
		console.log('[DEBUG] Apollo hook - loading:', getProjectsLoading);
		console.log('[DEBUG] Apollo hook - error:', getProjectsError);
		console.log('[DEBUG] Apollo hook - data:', getProjectsData);
		console.log('[DEBUG] Apollo hook - projects state:', projects);
		console.log('[DEBUG] Apollo hook - total state:', total);
	}, [getProjectsLoading, getProjectsError, getProjectsData, projects, total]);

	// Sync URL -> State when router.query changes (handles back/forward navigation)
	useEffect(() => {
		const parsed = parseInitialFilter();
		if (parsed) {
			console.log('[DEBUG] URL -> State sync:', parsed);
			setSearchFilter(parsed);
			setCurrentPage(parsed.page || 1);
		} else {
			setCurrentPage(searchFilter.page || 1);
		}
	}, [router.query]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		// Create new filter object (no mutation)
		const updatedFilter = { ...searchFilter, page: value };
		setSearchFilter(updatedFilter);
		setCurrentPage(value);
		// Update URL (pagination is one of the allowed router.push cases)
		await router.push(
			`/property?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`,
			`/property?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`,
			{
				scroll: false,
			},
		);
	};


	const likeProjectHandler = async (userId: string, id: string) => {
		try {
		if (!id) return;
		if (!userId) throw new Error(Message.NOT_AUTHENTICATED);
	
		await likeTargetProject({
			variables: { input: id },
		});
	
		await getProjectsRefetch({ input: initialInput });
	
		await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
		console.log('ERROR_LikePropertyHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingHandler = (sortOption: string) => {
		setActiveSortOption(sortOption);
		
		let sort: string = 'createdAt';
		let direction: Direction = Direction.DESC;
		
		switch (sortOption) {
			case 'new':
				sort = 'createdAt';
				direction = Direction.DESC;
				break;
			case 'lowest':
				sort = 'projectPrice';
				direction = Direction.ASC;
				break;
			case 'highest':
				sort = 'projectPrice';
				direction = Direction.DESC;
				break;
		}
		
		// Create new filter object (no mutation), reset page to 1
		// Only update state (no router.push - only Search button and Pagination call router.push)
		const updatedFilter = {
			...searchFilter,
			page: 1,
			sort,
			direction,
		};
		setSearchFilter(updatedFilter);
		setCurrentPage(1);
	};

	// Product handlers
	const handleProductFavorite = (id: number) => {
		setProductFavorites(prev => 
			prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
		);
	};

	const handleAddToCart = (product: Product) => {
		if (!user?._id) {
			sweetMixinErrorAlert('Please login to add items to cart');
			router.push('/account/join');
			return;
		}
		addToCart(product);
		sweetTopSmallSuccessAlert('Added to cart!', 800);
	};

	if (device === 'mobile') {
		return <h1>PROJECTS MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				{/* Hero Banner Section */}
				<Stack className={'property-hero'}>
					<Box component={'div'} className={'hero-banner'}>
						<img src="/img/projectsPage/banner.jpeg" alt="Projects Banner" />
						<Box component={'div'} className={'hero-overlay'}></Box>
						<Stack className={'hero-content'}>
							<Stack className={'container'}>
								<Stack className={'breadcrumb'}>
									<Link href={'/'}>
										<span>Home</span>
									</Link>
									<span className={'separator'}>Projects</span>
								</Stack>
								<h1 className={'page-title'}>Projects</h1>
							</Stack>
						</Stack>
					</Box>
				</Stack>

				<div className="container">
					<Box component={'div'} className={'sort-bar'}>
						<span className={'sort-label'}>Sort by:</span>
						<Box component={'div'} className={'sort-options'}>
							<button 
								className={`sort-pill ${activeSortOption === 'new' ? 'active' : ''}`}
								onClick={() => sortingHandler('new')}
								>
									New
							</button>
							<button 
								className={`sort-pill ${activeSortOption === 'lowest' ? 'active' : ''}`}
								onClick={() => sortingHandler('lowest')}
								>
									Lowest Price
							</button>
							<button 
								className={`sort-pill ${activeSortOption === 'highest' ? 'active' : ''}`}
								onClick={() => sortingHandler('highest')}
								>
									Highest Price
							</button>
						</Box>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{getProjectsLoading ? (
									<div className={'no-data'}>
										<p>Loading projects...</p>
									</div>
								) : projects?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Projects found!</p>
									</div>
								) : (
									projects.map((project: Project) => {
										return <ProjectCard project={project} likeProjectHandler={likeProjectHandler} key={project?._id} />;
									})
								)}
							</Stack>
							{projects.length !== 0 && (
								<Box className="pagination-section">
									<Box className="pagination-info">
										<Typography className="results-text">
											Showing <span className="highlight">{projects.length}</span> of <span className="highlight">{total}</span> projects
										</Typography>
									</Box>
									<Box className="pagination-controls">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="rounded"
											color="primary"
											className="custom-pagination"
										/>
									</Box>
								</Box>
							)}
						</Stack>
					</Stack>
				</div>

				{/* Things You May Like Section */}
				<Stack className="things-you-may-like">
					<Box className="section-header">
						<Typography className="section-title">Things You May Like</Typography>
						<Link href="/products">
							<Button className="view-all-btn">
								View All
								<ArrowForwardIcon />
							</Button>
						</Link>
					</Box>
					
					<Box className="products-grid">
						{recommendedProducts.map((product) => (
							<Box 
								key={product.id} 
								className="product-card"
								onClick={() => router.push('/products')}
							>
								<Box className="card-image">
									<img src={product.image} alt={product.name} />
									<Box className="card-overlay" />
									{product.tag && (
										<span className={`product-tag tag-${product.tag.toLowerCase()}`}>
											{product.tag}
										</span>
									)}
								</Box>
								<Box className="card-content">
									<Typography className="product-name">{product.name}</Typography>
									<Typography className="product-category">{product.category}</Typography>
									<Box className="card-stats">
										<span>${product.price}</span>
										<Box className="rating">
											<StarIcon />
											<span>{product.rating}</span>
										</Box>
									</Box>
								</Box>
							</Box>
						))}
					</Box>
				</Stack>
			</div>
		);
	}
};

ProjectList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(ProjectList);
