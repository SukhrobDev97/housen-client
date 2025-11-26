import React, { useState, useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [allArticles, setAllArticles] = useState<BoardArticle[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedArticles, setDisplayedArticles] = useState<BoardArticle[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);

	const queryInput = {
		page: 1,
		limit: 20,
		sort: 'articleViews',
		direction: 'DESC' as const,
		search: {},
	};

	/** APOLLO REQUESTS **/
	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	  } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
		  setAllArticles(data?.getBoardArticles?.list || []);
		},
	  });

	/** LIFECYCLES **/
	useEffect(() => {
		if (allArticles.length > 0) {
			const startIndex = (currentPage - 1) * 4;
			const endIndex = startIndex + 4;
			setDisplayedArticles(allArticles.slice(startIndex, endIndex));
			setTotalPages(Math.ceil(allArticles.length / 4));
		}
	}, [allArticles, currentPage]);

	/** HANDLERS **/
	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		if (!allArticles || allArticles.length === 0) return null;

		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Community Board</span>
							<p>Latest community highlights</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon 
									className={'swiper-community-prev'} 
									onClick={handlePrevPage}
									sx={{ 
										cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
										opacity: currentPage > 1 ? 1 : 0.5,
									}}
								/>
								<div className={'swiper-community-pagination'}>
									<span>{currentPage} / {totalPages}</span>
								</div>
								<EastIcon 
									className={'swiper-community-next'} 
									onClick={handleNextPage}
									sx={{ 
										cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
										opacity: currentPage < totalPages ? 1 : 0.5,
									}}
								/>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{allArticles.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Community Articles Empty
							</Box>
						) : (
							<Stack 
								className={'community-article-swiper'}
								direction={'row'}
								spacing={3}
								sx={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									gap: '24px',
								}}
							>
								{displayedArticles.map((article: BoardArticle) => {
									return (
										<Box key={article._id} className={'community-article-slide'} sx={{ flex: '1 1 calc(25% - 18px)' }}>
											<CommunityCard article={article} />
										</Box>
									);
								})}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
