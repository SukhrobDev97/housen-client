import React from 'react';
import { Box, Typography } from '@mui/material';

const AdminCalendar: React.FC = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	// Get first day of month (0 = Sunday, we want Monday = 0)
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	// Convert to Monday-first week (Monday = 0)
	const firstDayMonday = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

	// Get number of days in month
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// Generate calendar days
	const calendarDays: (number | null)[] = [];
	
	// Add empty cells for days before month starts
	for (let i = 0; i < firstDayMonday; i++) {
		calendarDays.push(null);
	}

	// Add days of the month
	for (let i = 1; i <= daysInMonth; i++) {
		calendarDays.push(i);
	}

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const isToday = (day: number | null) => {
		if (day === null) return false;
		const date = new Date(year, month, day);
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	return (
		<Box
			sx={{
				width: '100%',
				background: '#FFFFFF',
				borderRadius: '12px',
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
			}}
		>
			{/* Month and Year Header */}
			<Typography
				sx={{
					fontSize: '14px',
					fontWeight: 600,
					color: '#111827',
					marginBottom: '12px',
					textAlign: 'center',
					fontFamily: 'Inter, sans-serif',
				}}
			>
				{monthNames[month]} {year}
			</Typography>

			{/* Week Days Header */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(7, 1fr)',
					gap: '4px',
					marginBottom: '8px',
				}}
			>
				{weekDays.map((day) => (
					<Typography
						key={day}
						sx={{
							fontSize: '11px',
							fontWeight: 500,
							color: '#6B7280',
							textAlign: 'center',
							padding: '4px 0',
							fontFamily: 'Inter, sans-serif',
						}}
					>
						{day}
					</Typography>
				))}
			</Box>

			{/* Calendar Grid */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(7, 1fr)',
					gap: '4px',
				}}
			>
				{calendarDays.map((day, index) => {
					if (day === null) {
						return <Box key={index} sx={{ aspectRatio: '1', padding: '4px' }} />;
					}

					const todayFlag = isToday(day);

					return (
						<Box
							key={index}
							sx={{
								aspectRatio: '1',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '6px',
								background: todayFlag ? '#111827' : 'transparent',
								cursor: 'default',
							}}
						>
							<Typography
								sx={{
									fontSize: '12px',
									fontWeight: todayFlag ? 600 : 400,
									color: todayFlag ? '#FFFFFF' : '#111827',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								{day}
							</Typography>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default AdminCalendar;
