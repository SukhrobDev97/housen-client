import React, { useEffect, useState, useMemo } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Checkbox,
	FormControlLabel,
	Box,
	Typography,
	Stack,
	Divider,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ArticleIcon from '@mui/icons-material/Article';
import { useQuery } from '@apollo/client';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_PROJECTS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from '../../../apollo/admin/query';
import { MemberType } from '../../enums/member.enum';

interface StatRowProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	loading: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ icon, label, value, loading }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: '12px',
				padding: '12px 0',
			}}
		>
			<Box
				sx={{
					width: '40px',
					height: '40px',
					borderRadius: '10px',
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
			<Box sx={{ flex: 1 }}>
				<Typography
					sx={{
						fontSize: '14px',
						color: '#6B7280',
						fontWeight: 500,
						marginBottom: '2px',
					}}
				>
					{label}
				</Typography>
				<Typography
					sx={{
						fontSize: '24px',
						fontWeight: 600,
						color: '#111827',
						lineHeight: 1.2,
					}}
				>
					{loading ? '...' : value.toLocaleString()}
				</Typography>
			</Box>
		</Box>
	);
};

const AdminWelcomeModal: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [dontShowAgain, setDontShowAgain] = useState(false);

	// Fetch ALL members, then filter on frontend to count USER type only
	const {
		loading: membersLoading,
		data: membersData,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 1000,
				sort: 'createdAt',
				search: {},
			},
		},
		skip: !open,
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
		skip: !open,
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
		skip: !open,
	});

	// Calculate Users total from members list (count only USER type)
	const usersTotal = useMemo(() => {
		if (membersData?.getAllMembersByAdmin?.list) {
			const membersList = membersData.getAllMembersByAdmin.list;
			return membersList.filter(
				(member: any) => member.memberType === MemberType.USER
			).length;
		}
		return 0;
	}, [membersData]);

	// Extract Projects and Articles totals
	const projectsTotal = projectsData?.getAllProjectsByAdmin?.metaCounter?.[0]?.total ?? 
		projectsData?.getAllProjectsByAdmin?.list?.length ?? 0;
	const articlesTotal = articlesData?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total ?? 
		articlesData?.getAllBoardArticlesByAdmin?.list?.length ?? 0;

	const isLoading = membersLoading || projectsLoading || articlesLoading;

	// Check if modal should be shown on mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const dontShowFlag = localStorage.getItem('dontShowAdminWelcome');
			if (!dontShowFlag) {
				setOpen(true);
			}
		}
	}, []);

	// Handle close
	const handleClose = () => {
		if (dontShowAgain) {
			localStorage.setItem('dontShowAdminWelcome', 'true');
		}
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '16px',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
				},
			}}
		>
			<DialogTitle
				sx={{
					padding: '24px 24px 8px 24px',
					'&.MuiDialogTitle-root': {
						paddingBottom: '8px',
					},
				}}
			>
				<Typography
					variant="h5"
					component="div"
					sx={{
						fontSize: '24px',
						fontWeight: 600,
						color: '#111827',
						marginBottom: '4px',
					}}
				>
					Welcome to Admin Dashboard
				</Typography>
				<Typography
					variant="body2"
					sx={{
						fontSize: '14px',
						color: '#6B7280',
						fontWeight: 400,
					}}
				>
					Quick overview of your platform status
				</Typography>
			</DialogTitle>

			<DialogContent
				sx={{
					padding: '24px',
					paddingTop: '16px',
				}}
			>
				<Stack spacing={0}>
					<StatRow
						icon={<PeopleIcon sx={{ fontSize: 20 }} />}
						label="Total Users"
						value={usersTotal}
						loading={isLoading}
					/>
					<Divider />
					<StatRow
						icon={<HomeWorkIcon sx={{ fontSize: 20 }} />}
						label="Total Projects"
						value={projectsTotal}
						loading={isLoading}
					/>
					<Divider />
					<StatRow
						icon={<ArticleIcon sx={{ fontSize: 20 }} />}
						label="Total Articles"
						value={articlesTotal}
						loading={isLoading}
					/>
				</Stack>
			</DialogContent>

			<DialogActions
				sx={{
					padding: '16px 24px 24px 24px',
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}
			>
				<FormControlLabel
					control={
						<Checkbox
							checked={dontShowAgain}
							onChange={(e) => setDontShowAgain(e.target.checked)}
							sx={{
								color: '#111827',
								'&.Mui-checked': {
									color: '#111827',
								},
							}}
						/>
					}
					label={
						<Typography
							sx={{
								fontSize: '14px',
								color: '#6B7280',
							}}
						>
							Don't show again
						</Typography>
					}
					sx={{
						margin: 0,
					}}
				/>
				<Button
					onClick={handleClose}
					variant="contained"
					sx={{
						background: '#111827',
						color: '#FFFFFF',
						borderRadius: '8px',
						padding: '10px 24px',
						fontSize: '14px',
						fontWeight: 500,
						textTransform: 'none',
						'&:hover': {
							background: '#1F2937',
						},
					}}
				>
					Go to Dashboard
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AdminWelcomeModal;
