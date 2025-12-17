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

	const imagePath = article?.articleImage
		? `${REACT_APP_API_URL}/${article.articleImage}`
		: '/img/community/communityImg.png';

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
				<img src={imagePath} alt={article?.articleTitle} />
				
				{/* Category Badge */}
				<span className={styles.categoryBadge}>
					{getCategoryLabel(article?.articleCategory)}
				</span>

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
				<Typography className={styles.title}>
					{article?.articleTitle}
				</Typography>
				
				<Typography className={styles.excerpt}>
					{article?.articleContent?.replace(/<[^>]*>/g, '').substring(0, 120)}...
				</Typography>

				{/* Author Info */}
				<Stack className={styles.authorRow}>
					<Stack className={styles.author}>
						<img 
							src={authorImage} 
							alt={article?.memberData?.memberNick || 'Author'} 
							className={styles.authorAvatar}
						/>
						<Stack className={styles.authorInfo}>
							<Typography className={styles.authorName}>
								{article?.memberData?.memberNick || 'Anonymous'}
							</Typography>
							<Typography className={styles.postDate}>
								<Moment fromNow>{article?.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			{/* Footer */}
			<Stack className={styles.footer}>
				<Stack className={styles.stats}>
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
				
				<span className={styles.readMore}>
					Read article <ArrowForwardIcon />
				</span>
			</Stack>
		</Stack>
	);
};

export default ArticleCard;

