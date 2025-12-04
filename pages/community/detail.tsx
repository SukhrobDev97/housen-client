import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, IconButton, Backdrop, Pagination, Box } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_BOARD_ARTICLES, GET_COMMENTS } from '../../apollo/user/query';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetMixinSuccessAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import { Message } from '../../libs/enums/common.enum';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();
	const [latestArticles, setLatestArticles] = useState<BoardArticle[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	// Fetch latest articles for sidebar
	const { loading: latestLoading } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { 
			input: { 
				page: 1, 
				limit: 2, 
				sort: 'createdAt', 
				direction: 'DESC' 
			} 
		},
		onCompleted(data: any) {
			console.log('Latest articles data:', data);
			if (data?.getBoardArticles?.list) {
				setLatestArticles(data.getBoardArticles.list);
			}
		},
		onError(error: any) {
			console.error('Latest articles error:', error);
		},
	});

	const {
		loading: getBoardArticleLoading,
		data: getBoardArticleData,
		error: getBoardArticleError,
		refetch: getBoardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: articleId,
		},
		skip: !articleId,
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
			}
		},
	});


	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	
	const likeArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Message.NO_DATA_FOUND);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await getBoardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user._id) throw new Error(Message.NO_DATA_FOUND);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await getBoardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Message.NO_DATA_FOUND);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	
	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	// Sidebar handlers
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push({ pathname: '/community', query: { search: searchQuery } });
		}
	};

	const handleCategoryClick = (category: string) => {
		router.push({ pathname: '/community', query: { articleCategory: category } });
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sweetTopSmallSuccessAlert('Message sent successfully!', 1000);
		setContactForm({ name: '', email: '', message: '' });
	};

	const getArticleImage = (article: BoardArticle) => {
		return article?.articleImage
			? `${process.env.REACT_APP_API_URL}/${article.articleImage}`
			: '/img/community/communityImg.png';
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	}

	return (
		<div id="community-detail-page">
			{/* HERO SECTION */}
			<Stack className="community-hero">
				<Box component="div" className="hero-banner">
					<img src="/img/banner/community.jpeg" alt="Community" />
					<Box component="div" className="hero-overlay"></Box>
					<Stack className="hero-content">
						<Stack className="container">
							<Stack className="breadcrumb">
								<Link href="/"><span>Home</span></Link>
								<span className="separator">Community</span>
							</Stack>
							<h1 className="page-title">Community Detail</h1>
						</Stack>
					</Stack>
				</Box>
			</Stack>

			{/* MAIN CONTENT - Piller Two Column Layout */}
			<Stack className="content-wrapper">
				<Stack className="main-container">
					{/* LEFT COLUMN */}
					<Stack className="left-column">
						{/* Title Header - Above Article Section */}
						<Stack className="page-header">
							<Stack className="header-content">
								<Typography className="header-title">{articleCategory} BOARD</Typography>
								<Typography className="header-subtitle">Share your thoughts with the community</Typography>
							</Stack>
							<Button
								className="write-btn"
								onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
							>
								Write
							</Button>
						</Stack>

						{/* Article Content */}
						<Stack className="article-section">
						{/* Featured Image */}
						<Box className="article-featured-image">
							<img
								src={
									boardArticle?.articleImage
										? `${process.env.REACT_APP_API_URL}/${boardArticle.articleImage}`
										: '/img/community/communityImg.png'
								}
								alt={boardArticle?.articleTitle || 'Article'}
							/>
						</Box>

						{/* Meta Info Row */}
						<Stack className="article-meta">
												<img
													src={memberImage}
													alt=""
								className="author-avatar"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
							<Typography className="author-name" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
							<span className="meta-dot">•</span>
							<Moment className="meta-date" format="DD/MM/YYYY">{boardArticle?.createdAt}</Moment>
							<span className="meta-dot">•</span>
							<Typography className="meta-category">{articleCategory}</Typography>
											</Stack>

						{/* Article Title */}
						<Typography className="article-title">{boardArticle?.articleTitle}</Typography>

						{/* Article Content */}
						<Stack className="article-body">
							<ToastViewerComponent markdown={boardArticle?.articleContent} className="ytb_play" />
										</Stack>

						{/* Action Bar */}
						<Stack className="action-bar">
							<Button
								className={`action-btn ${boardArticle?.meLiked?.[0]?.myFavorite ? 'liked' : ''}`}
								onClick={() => likeArticleHandler(user, boardArticle?._id)}
							>
								{boardArticle?.meLiked?.[0]?.myFavorite ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
								<span>{boardArticle?.articleLikes || 0}</span>
							</Button>
							<Stack className="action-btn">
												<VisibilityIcon />
								<span>{boardArticle?.articleViews || 0}</span>
											</Stack>
							<Stack className="action-btn">
													<ChatBubbleOutlineRoundedIcon />
								<span>{total || 0}</span>
											</Stack>
										</Stack>

						{/* Comments Section */}
						<Stack className="comments-section">
							<Typography className="section-title">Comments ({total})</Typography>

							{/* Comment Input */}
							<Stack className="comment-input-box">
										<input
											type="text"
									placeholder="Leave a comment..."
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
								<Stack className="comment-input-footer">
									<Typography className="char-count">{wordsCnt}/100</Typography>
									<Button className="submit-btn" onClick={creteCommentHandler}>Submit</Button>
								</Stack>
									</Stack>

							{/* Comments List */}
							<Stack className="comments-list">
								{comments?.map((commentData) => (
									<Stack className="comment-item" key={commentData?._id}>
										<Stack className="comment-header">
											<img
												src={getCommentMemberImage(commentData?.memberData?.memberImage)}
												alt=""
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
											/>
											<Stack className="comment-author">
												<Typography className="name" onClick={() => goMemberPage(commentData?.memberData?._id as string)}>
													{commentData?.memberData?.memberNick}
															</Typography>
												<Moment className="date" format="DD.MM.YY HH:mm">{commentData?.createdAt}</Moment>
													</Stack>
													{commentData?.memberId === user?._id && (
												<Stack className="comment-actions">
													<IconButton onClick={() => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
													}}>
														<EditIcon />
													</IconButton>
													<IconButton onClick={() => {
														setUpdatedCommentId(commentData?._id);
														updateButtonHandler(commentData?._id, CommentStatus.DELETE);
													}}>
														<DeleteForeverIcon />
															</IconButton>
												</Stack>
											)}
										</Stack>
										<Typography className="comment-text">{commentData?.commentContent}</Typography>
									</Stack>
								))}
							</Stack>

							{/* Pagination */}
							{total > searchFilter.limit && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
						</Stack>
					</Stack>
					</Stack>

					{/* RIGHT: Sidebar (30%) */}
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
										className={`category-btn ${articleCategory === cat ? 'active' : ''}`}
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
										<Stack
											key={article._id}
											className="latest-post-item"
											onClick={() => router.push({
												pathname: '/community/detail',
												query: { articleCategory: article.articleCategory, id: article._id },
											})}
										>
											<img src={getArticleImage(article)} alt={article.articleTitle} />
											<Stack className="post-info">
												<Typography className="post-title">{article.articleTitle}</Typography>
												<Stack className="post-meta">
													<Moment format="DD MMM YYYY">{article.createdAt}</Moment>
													<span>•</span>
													<span>{article.articleViews || 0} views</span>
												</Stack>
											</Stack>
										</Stack>
									))
								) : (
									<Typography className="no-data-text">No articles found</Typography>
								)}
							</Stack>
						</Stack>

						{/* Contact Agency */}
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

			{/* Edit Comment Backdrop */}
			<Backdrop className="edit-backdrop" open={openBackdrop} onClick={cancelButtonHandler}>
				<Stack className="edit-modal" onClick={(e) => e.stopPropagation()}>
					<Typography className="modal-title">Update Comment</Typography>
					<input
						autoFocus
						type="text"
						value={updatedComment}
						onChange={(e) => updateCommentInputHandler(e.target.value)}
						placeholder="Enter your comment..."
					/>
					<Stack className="modal-footer">
						<Typography className="char-count">{updatedCommentWordsCnt}/100</Typography>
						<Stack className="modal-actions">
							<Button className="cancel-btn" onClick={cancelButtonHandler}>Cancel</Button>
							<Button className="update-btn" onClick={() => updateButtonHandler(updatedCommentId, undefined)}>Update</Button>
						</Stack>
					</Stack>
				</Stack>
			</Backdrop>
			</div>
		);
};

CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
