import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Skeleton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArticleIcon from '@mui/icons-material/Article';
import { useQuery } from '@apollo/client';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_PROJECTS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from '../../../apollo/admin/query';
import { MemberType } from '../../enums/member.enum';

interface StatCardProps {
	icon: React.ReactNode;
	value: number;
	label: string;
	loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, loading }) => {
	return (
		<Box
			component="div"
			className="admin-stat-card"
			sx={{
				width: '100%',
				maxWidth: '320px',
				background: '#FFFFFF',
				borderRadius: '14px',
				padding: '24px',
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '12px',
				}}
			>
				<Box
					sx={{
						width: '48px',
						height: '48px',
						borderRadius: '12px',
						background: '#F3F4F6',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#111827',
						flexShrink: 0,
					}}
				>
					{icon}
				</Box>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					{loading ? (
						<Skeleton variant="text" width={60} height={40} sx={{ mb: '4px' }} />
					) : (
						<Typography
							variant="h3"
							component="div"
							sx={{
								fontSize: '32px',
								fontWeight: 600,
								color: '#111827',
								lineHeight: 1.2,
								margin: 0,
								fontFamily: 'Inter, sans-serif',
							}}
						>
							{value.toLocaleString()}
						</Typography>
					)}
					<Typography
						variant="body2"
						sx={{
							fontSize: '14px',
							color: '#6B7280',
							fontWeight: 500,
							marginTop: '4px',
							fontFamily: 'Inter, sans-serif',
						}}
					>
						{label}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

const AdminStats: React.FC = () => {
	const [usersTotal, setUsersTotal] = useState<number | null>(null);
	const [projectsTotal, setProjectsTotal] = useState<number | null>(null);
	const [articlesTotal, setArticlesTotal] = useState<number | null>(null);

	// Fetch ALL members, then filter on frontend to count USER type only
	const {
		loading: membersLoading,
		data: membersData,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: {
			input: {
				page: 1,
				limit: 1000, // Fetch enough to count accurately
				sort: 'createdAt',
				search: {},
			},
		},
	});

	// Fetch Projects Total
	const {
		loading: projectsLoading,
		data: projectsData,
	} = useQuery(GET_ALL_PROJECTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 1,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
	});

	// Fetch Articles Total
	const {
		loading: articlesLoading,
		data: articlesData,
	} = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 1,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
	});

	// Calculate Users total from members list (count only USER type)
	useEffect(() => {
		if (membersData?.getAllMembersByAdmin?.list) {
			const membersList = membersData.getAllMembersByAdmin.list;
			const userCount = membersList.filter(
				(member: any) => member.memberType === MemberType.USER
			).length;
			setUsersTotal(userCount);
		}
	}, [membersData]);

	// Extract Projects total
	useEffect(() => {
		if (projectsData?.getAllProjectsByAdmin) {
			const total = projectsData.getAllProjectsByAdmin.metaCounter?.[0]?.total;
			if (total !== undefined && total !== null) {
				setProjectsTotal(total);
			} else {
				// Fallback to list length
				const listLength = projectsData.getAllProjectsByAdmin.list?.length ?? 0;
				if (listLength > 0) {
					setProjectsTotal(listLength);
				}
			}
		}
	}, [projectsData]);

	// Extract Articles total
	useEffect(() => {
		if (articlesData?.getAllBoardArticlesByAdmin) {
			const total = articlesData.getAllBoardArticlesByAdmin.metaCounter?.[0]?.total;
			if (total !== undefined && total !== null) {
				setArticlesTotal(total);
			} else {
				// Fallback to list length
				const listLength = articlesData.getAllBoardArticlesByAdmin.list?.length ?? 0;
				if (listLength > 0) {
					setArticlesTotal(listLength);
				}
			}
		}
	}, [articlesData]);

	return (
		<Box
			component="div"
			className="admin-stats-section"
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				marginBottom: '32px',
			}}
		>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: 'repeat(2, 1fr)',
						md: 'repeat(3, 1fr)',
					},
					gap: '20px',
					width: '100%',
					maxWidth: '1200px',
					justifyContent: 'center',
				}}
			>
				<StatCard
					icon={<PeopleIcon sx={{ fontSize: 28 }} />}
					value={usersTotal ?? 0}
					label="Total Users"
					loading={membersLoading || usersTotal === null}
				/>
				<StatCard
					icon={<HomeWorkIcon sx={{ fontSize: 28 }} />}
					value={projectsTotal ?? 0}
					label="Total Projects"
					loading={projectsLoading || projectsTotal === null}
				/>
				<StatCard
					icon={<ArticleIcon sx={{ fontSize: 28 }} />}
					value={articlesTotal ?? 0}
					label="Total Articles"
					loading={articlesLoading || articlesTotal === null}
				/>
			</Stack>
		</Box>
	);
};

export default AdminStats;
