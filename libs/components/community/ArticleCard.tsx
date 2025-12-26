import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import Moment from 'react-moment';
import styles from './ArticleCard.module.scss';

interface ArticleCardProps {
	article: BoardArticle;
	onLike?: (e: React.MouseEvent, id: string) => void;
	compact?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onLike, compact = false }) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Get article image with priority order: images[0] > thumbnail > articleImage > fallback
	const getArticleImagePath = (article: BoardArticle): string => {
		// Priority 1: article.images[0]
		if (article && 'images' in article && Array.isArray((article as any).images) && (article as any).images.length > 0) {
			const firstImage = (article as any).images[0];
			if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
				return `${REACT_APP_API_URL}/${firstImage.trim()}`;
			}
		}

		// Priority 2: article.thumbnail
		if (article && 'thumbnail' in article) {
			const thumbnail = (article as any).thumbnail;
			if (thumbnail && typeof thumbnail === 'string' && thumbnail.trim() !== '') {
				return `${REACT_APP_API_URL}/${thumbnail.trim()}`;
			}
		}

		// Priority 3: article.articleImage
		if (article?.articleImage && typeof article.articleImage === 'string' && article.articleImage.trim() !== '') {
			return `${REACT_APP_API_URL}/${article.articleImage.trim()}`;
		}

		// Priority 4: fallback image
		return '/img/community/communityImg.png';
	};

	const imagePath = getArticleImagePath(article);

	const authorImage = article?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${article.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';

	const handleCardClick = () => {
		router.push({
			pathname: '/community/detail',
			query: { articleCategory: article?.articleCategory, id: article?._id },
		});
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onLike) {
			onLike(e, article._id);
		}
	};

	const getCategoryLabel = (category: string) => {
		switch (category) {
			case 'FREE': return 'Free Board';
			case 'RECOMMEND': return 'Recommendation';
			case 'NEWS': return 'News';
			case 'HUMOR': return 'Humor';
			default: return category;
		}
	};

	const isLiked = article?.meLiked && article.meLiked[0]?.myFavorite;

	// Compact version for sidebar
	if (compact) {
		return (
			<Stack className={styles.compactCard} onClick={handleCardClick}>
				<Box className={styles.compactImage}>
					<img src={imagePath} alt={article?.articleTitle} />
				</Box>
				<Stack className={styles.compactContent}>
					<Typography className={styles.compactTitle}>
						{article?.articleTitle}
					</Typography>
					<Typography className={styles.compactDate}>
						<Moment fromNow>{article?.createdAt}</Moment>
					</Typography>
				</Stack>
			</Stack>
		);
	}

	// Full card version
	return (
		<Stack className={styles.articleCard} onClick={handleCardClick}>
			{/* Image Header */}
			<Box className={styles.imageWrapper}>
				<img 
					src={imagePath} 
					alt={article?.articleTitle}
					onError={(e: any) => {
						e.target.src = '/img/community/communityImg.png';
					}}
				/>

				{/* Like Button (appears on hover) */}
				<IconButton 
					className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
					onClick={handleLikeClick}
				>
					{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</IconButton>

				{/* Overlay gradient */}
				<Box className={styles.imageOverlay} />
			</Box>

			{/* Content Section */}
			<Stack className={styles.content}>
				{/* TOP META LINE */}
				<Stack className={styles.metaLine} direction="row" spacing={1} alignItems="center">
					<span className={styles.categoryBadge}>
						{getCategoryLabel(article?.articleCategory)}
					</span>
					<span className={styles.metaDot}>•</span>
					<Typography className={styles.postTime}>
						<Moment fromNow>{article?.createdAt}</Moment>
					</Typography>
				</Stack>

				{/* CONTENT CORE */}
				<Typography className={styles.title}>
					{article?.articleTitle}
				</Typography>
				
				<Typography className={styles.excerpt}>
					{article?.articleContent?.replace(/<[^>]*>/g, '').substring(0, 120)}...
				</Typography>
			</Stack>

			{/* FOOTER BAR */}
			<Stack className={styles.footer} direction="row" justifyContent="space-between" alignItems="center">
				{/* LEFT: Author */}
				<Stack className={styles.author} direction="row" spacing={1} alignItems="center">
					<img 
						src={authorImage} 
						alt={article?.memberData?.memberNick || 'Author'} 
						className={styles.authorAvatar}
					/>
					<Typography className={styles.authorName}>
						{article?.memberData?.memberNick || 'Anonymous'}
					</Typography>
				</Stack>

				{/* RIGHT: Stats + Read Link */}
				<Stack className={styles.footerRight} direction="row" spacing={2} alignItems="center">
					<Stack className={styles.stats} direction="row" spacing={1.5}>
						<span className={styles.statItem}>
							<RemoveRedEyeIcon />
							{article?.articleViews || 0}
						</span>
						<span className={styles.statItem}>
							<ChatBubbleOutlineIcon />
							{article?.articleComments || 0}
						</span>
						<span className={styles.statItem}>
							<FavoriteIcon />
							{article?.articleLikes || 0}
						</span>
					</Stack>
					
					<span className={styles.readLink} onClick={(e) => e.stopPropagation()}>
						Read <ArrowForwardIcon />
					</span>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ArticleCard;

