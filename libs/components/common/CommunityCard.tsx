import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box, Avatar } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler?: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';
	const memberImage: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				className="community-card"
				onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
			>
				<Box className="card-image">
					<img src={imagePath} alt={boardArticle?.articleTitle} />
					<Box className="image-overlay" />
					<Box className="date-badge">
						<Moment className="month" format="MMM">
							{boardArticle?.createdAt}
						</Moment>
						<Typography className="day">
							<Moment format="DD">{boardArticle?.createdAt}</Moment>
						</Typography>
					</Box>
				</Box>
				<Box className="card-content">
					<Typography className="title">{boardArticle?.articleTitle}</Typography>
					<Box className="card-meta">
						<Box 
							className="author-section"
							onClick={(e: any) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							<Avatar 
								src={memberImage} 
								alt={boardArticle?.memberData?.memberNick}
								className="author-avatar"
							/>
							<Box className="author-info">
								<Typography className="author-name">
									{boardArticle?.memberData?.memberNick}
								</Typography>
								<Typography className="author-date">
									<Moment format="MMM DD, YYYY">{boardArticle?.createdAt}</Moment>
								</Typography>
							</Box>
						</Box>
						<Box className="stats-section">
							<Box className="stat-item">
								<RemoveRedEyeIcon />
								<span>{boardArticle?.articleViews}</span>
							</Box>
							<Box className="stat-item">
								<IconButton
									className="like-btn"
									onClick={(e: any) => {
										e.stopPropagation();
										likeArticleHandler(e, user, boardArticle?._id);
									}}
								>
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon className="liked" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<span>{boardArticle?.articleLikes}</span>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default CommunityCard;
