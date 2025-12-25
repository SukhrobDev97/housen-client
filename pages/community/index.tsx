import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Stack, Typography, Button, Pagination, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DailyInspirationBubble from '../../libs/components/common/DailyInspirationBubble';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ArticleCard from '../../libs/components/community/ArticleCard';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/* ============================================
   MAIN COMMUNITY PAGE
============================================ */
const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { query } = router;
	const articleCategory = (query?.articleCategory as string) || 'FREE';
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>({
		...initialInput,
		search: {
			...initialInput.search,
			articleCategory: (articleCategory as BoardArticleCategory) || initialInput.search.articleCategory,
		},
	});
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [latestArticles, setLatestArticles] = useState<BoardArticle[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list || []);
			setTotalCount(data?.getBoardArticles?.metaCounter?.[0]?.total || 0);
		},
	});

	// Fetch latest articles for sidebar (all categories)
	const { loading: latestLoading } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { 
			input: { 
				page: 1, 
				limit: 3, 
				sort: 'createdAt', 
				direction: 'DESC',
				search: {
					articleCategory: 'FREE' as BoardArticleCategory, // Default category for latest posts
				}
			} 
		},
		onCompleted(data: T) {
			if (data?.getBoardArticles?.list) {
				setLatestArticles(data.getBoardArticles.list);
			}
		},
		onError(error: any) {
			console.error('Latest articles error:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{ pathname: router.pathname, query: { articleCategory: 'FREE' } },
				undefined,
				{ shallow: true }
			);
		}
	}, []);

	// Sync articleCategory from URL to searchCommunity state
	useEffect(() => {
		if (articleCategory) {
			setSearchCommunity((prev) => ({
				...prev,
				page: 1,
				search: {
					...prev.search,
					articleCategory: articleCategory as BoardArticleCategory,
				},
			}));
		}
	}, [articleCategory]);

	/** HANDLERS **/
	const tabChangeHandler = async (value: string) => {
		const newSearch = {
			...searchCommunity,
			page: 1,
			search: {
				...searchCommunity.search,
				articleCategory: value as BoardArticleCategory,
			},
		};
		setSearchCommunity(newSearch);
		await router.push(
			{ pathname: '/community', query: { articleCategory: value } },
			undefined,
			{ shallow: true }
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: React.MouseEvent, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({ variables: { input: { id } } });
			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR_likeArticleHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Sidebar handlers
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push({ pathname: '/community', query: { search: searchQuery } });
		}
	};

	const handleCategoryClick = (category: string) => {
		const newSearch = {
			...searchCommunity,
			page: 1,
			search: {
				...searchCommunity.search,
				articleCategory: category as BoardArticleCategory,
			},
		};
		setSearchCommunity(newSearch);
		router.push({ pathname: '/community', query: { articleCategory: category } }, undefined, { shallow: true });
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle contact form submission
		sweetTopSmallSuccessAlert('Message sent!', 800);
		setContactForm({ name: '', email: '', message: '' });
	};

	// Tab items
	const tabs = [
		{ value: 'FREE', label: 'Free Board' },
		{ value: 'RECOMMEND', label: 'Recommendation' },
		{ value: 'NEWS', label: 'News' },
		{ value: 'HUMOR', label: 'Humor' },
	];

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
				{/* Hero Section */}
				<Stack className="community-hero">
					<Box component="div" className="hero-banner">
						<img src="/img/banner/community.jpeg" alt="Community Banner" />
						<Box component="div" className="hero-overlay" />
						<Box component="div" className="hero-content">
							<Stack className="container">
								<Stack className="breadcrumb">
									<Link href="/"><span>Home</span></Link>
									<span className="separator">Community</span>
								</Stack>
								<Typography className="page-title">Community</Typography>
								<Typography className="page-subtitle">
									Your space to share, inspire, and connect with the Housen interior community.
								</Typography>
							</Stack>
						</Box>
					</Box>
				</Stack>

				{/* Filter Section (Products Style) */}
				<section className="filter-section">
					<div className="filter-container">
					{/* Category Tabs */}
					<div className="filter-group">
						<span className="filter-label">Category</span>
						<div className="category-pills">
							{tabs.map((tab) => (
								<button
									key={tab.value}
									className={`category-pill ${searchCommunity.search.articleCategory === tab.value ? 'active' : ''}`}
									onClick={() => tabChangeHandler(tab.value)}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>

						{/* Write Button */}
						<Button
							className="write-btn"
							onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
						>
							Write Article
						</Button>
					</div>
				</section>

				{/* Main Content with Sidebar */}
				<Stack className="content-wrapper">
					<Stack className="main-container">
						{/* Left Column - Articles */}
						<Stack className="left-column">
				{/* Posts Grid Section */}
				<section className="posts-section">
					<div className="posts-container">
						<div className="section-header">
							<div className="section-title">
								{tabs.find(t => t.value === searchCommunity.search.articleCategory)?.label || 'All Posts'}
							</div>
							<div className="section-count">{totalCount || 0} articles</div>
						</div>

					<div className="posts-grid">
						{totalCount ? (
										boardArticles?.map((article: BoardArticle) => (
											<ArticleCard
												key={article?._id}
												article={article}
												onLike={likeArticleHandler}
								/>
							))
						) : (
							<div className="no-posts">
								<img src="/img/icons/icoAlert.svg" alt="" />
								<div>No articles found</div>
							</div>
						)}
					</div>
					</div>
				</section>

				{/* Pagination */}
				{totalCount > 0 && (
					<section className="pagination-section">
						<div className="pagination-container">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="rounded"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="total-count">
								Total {totalCount} article{totalCount > 1 ? 's' : ''} available
							</Typography>
						</div>
					</section>
				)}
						</Stack>

						{/* Right Sidebar */}
						<Stack className="sidebar">
							{/* Search */}
							<Stack className="sidebar-section">
								<Typography className="sidebar-title">Search</Typography>
								<form onSubmit={handleSearchSubmit} className="search-form">
									<input
										type="text"
										placeholder="Search articles..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<IconButton type="submit"><SearchIcon /></IconButton>
								</form>
							</Stack>

							{/* Categories */}
							<Stack className="sidebar-section">
								<Typography className="sidebar-title">Categories</Typography>
								<Stack className="categories-list">
									{['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'].map((cat) => (
										<Button
											key={cat}
											className={`category-btn ${searchCommunity.search.articleCategory === cat ? 'active' : ''}`}
											onClick={() => handleCategoryClick(cat)}
										>
											{cat === 'FREE' ? 'Free Board' : cat === 'RECOMMEND' ? 'Recommendation' : cat === 'NEWS' ? 'News' : 'Humor'}
										</Button>
									))}
								</Stack>
							</Stack>

							{/* Latest Posts */}
							<Stack className="sidebar-section">
								<Typography className="sidebar-title">Latest Posts</Typography>
								<Stack className="latest-posts">
									{latestLoading ? (
										<Typography className="loading-text">Loading...</Typography>
									) : latestArticles.length > 0 ? (
										latestArticles.map((article) => (
											<ArticleCard
												key={article._id}
												article={article}
												compact={true}
											/>
										))
									) : (
										<Typography className="no-data-text">No articles yet</Typography>
									)}
								</Stack>
							</Stack>

							{/* Contact */}
							<Stack className="sidebar-section contact-section">
								<Typography className="sidebar-title">Message the Author</Typography>
								<form onSubmit={handleContactSubmit} className="contact-form">
									<input
										type="text"
										placeholder="Your Name"
										value={contactForm.name}
										onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
										required
									/>
									<input
										type="email"
										placeholder="Your Email"
										value={contactForm.email}
										onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
										required
									/>
									<textarea
										placeholder="Your Message"
										rows={4}
										value={contactForm.message}
										onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
										required
									/>
									<Button type="submit" className="contact-btn">Send Message</Button>
								</form>
							</Stack>

							{/* Promo Card */}
							<Stack className="sidebar-section promo-section">
								<img src="/img/community/communityImg.png" alt="Community" className="promo-image" />
								<Typography className="promo-title">Join our Interior Living Community</Typography>
								<Typography className="promo-text">Connect with interior design enthusiasts and share your ideas</Typography>
								<Button
									className="promo-btn"
									onClick={() => router.push('/community')}
								>
									Join Community
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				{/* Daily Inspiration Bubble */}
				<DailyInspirationBubble />
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'ASC',
		search: { articleCategory: 'FREE' },
	},
};

export default withLayoutBasic(Community);
