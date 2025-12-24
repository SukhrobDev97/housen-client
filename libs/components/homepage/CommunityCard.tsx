import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Button } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import EastIcon from '@mui/icons-material/East';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { T } from '../../types/common';

interface CommunityCardProps {
	article: BoardArticle;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	
	const articleImage = article?.articleImage
		? `${REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/community/communityImg.png';

	const getCategoryLabel = (category: string) => {
		switch (category) {
			case BoardArticleCategory.NEWS:
				return 'News';
			case BoardArticleCategory.FREE:
				return 'Free';
			case BoardArticleCategory.RECOMMEND:
				return 'Recommend';
			case BoardArticleCategory.HUMOR:
				return 'Humor';
			default:
				return category;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case BoardArticleCategory.NEWS:
				return '#1976d2';
			case BoardArticleCategory.FREE:
				return '#4CAF50';
			case BoardArticleCategory.RECOMMEND:
				return '#FF9800';
			case BoardArticleCategory.HUMOR:
				return '#9C27B0';
			default:
				return '#666';
		}
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Stack 
				className="community-card" 
				onClick={() => router.push(`/community/detail?articleCategory=${article?.articleCategory}&id=${article._id}`)}
			>
				<div className="card-image">
					<div 
						className="card-img-bg"
						style={{ backgroundImage: `url(${articleImage})` }}
					/>
					<Box className={'category-badge'} sx={{ backgroundColor: getCategoryColor(article?.articleCategory || '') }}>
						<Typography className={'category-text'}>
							{getCategoryLabel(article?.articleCategory || '')}
						</Typography>
					</Box>
				</div>
				<div className="card-content">
					<strong className={'title'}>{article?.articleTitle}</strong>
				</div>
				<div className="card-footer">
					<div className={'meta-info'}>
						<Typography className={'date'}>
							<Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
						</Typography>
						<Box className={'views'} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
							<RemoveRedEyeIcon sx={{ fontSize: 16, color: '#666' }} />
							<Typography sx={{ margin: 0, color: '#666', fontSize: '13px' }}>
								{article?.articleViews || 0} views
							</Typography>
						</Box>
					</div>
					<Button 
						className={'read-more-btn'} 
						endIcon={<EastIcon sx={{ fontSize: 16 }} />}
						onClick={(e: T) => {
							e.stopPropagation();
							router.push(`/community/detail?articleCategory=${article?.articleCategory}&id=${article._id}`);
						}}
					>
						Read More
					</Button>
				</div>
			</Stack>
		);
	}
};

export default CommunityCard;
