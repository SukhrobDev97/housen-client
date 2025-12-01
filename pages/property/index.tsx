import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography, IconButton, Rating } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Project } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
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
	const [searchFilter, setSearchFilter] = useState<ProjectsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [projects, setProjects] = useState<Project[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [productFavorites, setProductFavorites] = useState<number[]>([]);

	// Recommended products (4 items)
	const recommendedProducts = products.slice(0, 4);

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT)

	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	  } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T ) => {
		  setProjects(data?.getProjects?.list);
		  setTotal(data?.getProjects?.metaCounter[0].total);
		},
	  });

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log("searchFilter:", searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/property?input=${JSON.stringify(searchFilter)}`,
			`/property?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
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
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'projectPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'projectPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
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
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{projects?.length === 0 ? (
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
