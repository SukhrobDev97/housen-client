import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Stack, Typography, Button, Pagination, Box, IconButton, Rating } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import DailyInspirationBubble from '../../libs/components/common/DailyInspirationBubble';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import Moment from 'react-moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/* ============================================
   COMMUNITY POST CARD (Products Style)
============================================ */
interface PostCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: (e: any, user: any, id: string) => void;
}

const CommunityPostCard = ({ boardArticle, likeArticleHandler }: PostCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	const handleCardClick = () => {
		router.push({
			pathname: '/community/detail',
			query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
		});
	};

	const handleAuthorClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (boardArticle?.memberData?._id === user?._id) {
			router.push('/mypage');
		} else {
			router.push(`/member?memberId=${boardArticle?.memberData?._id}`);
		}
	};

	return (
		<Box className="post-card" onClick={handleCardClick}>
			{/* Image Container */}
			<Box className="post-image-container">
				<img src={imagePath} alt={boardArticle?.articleTitle} className="post-image" />
				
				{/* Date Badge */}
				<Box className="date-badge">
					<Moment className="month" format="MMM">{boardArticle?.createdAt}</Moment>
					<span className="day"><Moment format="DD">{boardArticle?.createdAt}</Moment></span>
				</Box>

				{/* Quick Actions */}
				<Box className="quick-actions">
					<IconButton
						className="action-btn"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							likeArticleHandler(e, user, boardArticle?._id);
						}}
					>
						{boardArticle?.meLiked?.[0]?.myFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</Box>
			</Box>

			{/* Post Info */}
			<Box className="post-info">
				<span className="post-category" onClick={handleAuthorClick}>
					{boardArticle?.memberData?.memberNick}
				</span>
				<Typography className="post-title">{boardArticle?.articleTitle}</Typography>

				{/* Stats Row */}
				<Box className="post-stats">
					<Box className="stat-item">
						<RemoveRedEyeIcon />
						<span>{boardArticle?.articleViews || 0}</span>
					</Box>
					<Box className="stat-item">
						<FavoriteIcon />
						<span>{boardArticle?.articleLikes || 0}</span>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

/* ============================================
   MAIN COMMUNITY PAGE
============================================ */
const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

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
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter?.[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{ pathname: router.pathname, query: { articleCategory: 'FREE' } },
				router.pathname,
				{ shallow: true }
			);
		}
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (value: string) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{ pathname: '/community', query: { articleCategory: value } },
			router.pathname,
			{ shallow: true }
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
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
						<Box className="filter-group">
							<Typography className="filter-label">Category</Typography>
							<Box className="category-pills">
								{tabs.map((tab) => (
									<button
										key={tab.value}
										className={`category-pill ${searchCommunity.search.articleCategory === tab.value ? 'active' : ''}`}
										onClick={() => tabChangeHandler(tab.value)}
									>
										{tab.label}
									</button>
								))}
							</Box>
						</Box>

						{/* Write Button */}
						<Button
							className="write-btn"
							onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
						>
							Write Article
						</Button>
					</div>
				</section>

				{/* Posts Grid Section */}
				<section className="posts-section">
					<div className="posts-container">
						<Box className="section-header">
							<Typography className="section-title">
								{tabs.find(t => t.value === searchCommunity.search.articleCategory)?.label || 'All Posts'}
							</Typography>
							<Typography className="section-count">{totalCount || 0} articles</Typography>
						</Box>

						<Box className="posts-grid">
							{totalCount ? (
								boardArticles?.map((boardArticle: BoardArticle) => (
									<CommunityPostCard
										key={boardArticle?._id}
										boardArticle={boardArticle}
										likeArticleHandler={likeArticleHandler}
									/>
								))
							) : (
								<Box className="no-posts">
									<img src="/img/icons/icoAlert.svg" alt="" />
									<Typography>No articles found</Typography>
								</Box>
							)}
						</Box>
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
