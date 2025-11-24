import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button, Checkbox } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ProjectStyle, ProjectType } from '../../enums/property.enum';
import { ProjectsInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: ProjectsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<ProjectsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const priceRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openStyle, setOpenStyle] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openPrice, setOpenPrice] = useState(false);
	const [projectStyle, setProjectStyle] = useState<ProjectStyle[]>(Object.values(ProjectStyle));
	const [projectType, setProjectType] = useState<ProjectType[]>(Object.values(ProjectType));
	
	const priceRanges = [
		{ label: 'Any Price', start: 0, end: 2000000 },
		{ label: '$0 - $100K', start: 0, end: 100000 },
		{ label: '$100K - $300K', start: 100000, end: 300000 },
		{ label: '$300K - $500K', start: 300000, end: 500000 },
		{ label: '$500K - $750K', start: 500000, end: 750000 },
		{ label: '$750K - $1M', start: 750000, end: 1000000 },
		{ label: '$1M+', start: 1000000, end: 2000000 },
	];

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenStyle(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!priceRef?.current?.contains(event.target)) {
				setOpenPrice(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/

	const styleStateChangeHandler = () => {
		setOpenStyle((prev) => !prev);
		setOpenType(false);
		setOpenPrice(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenStyle(false);
		setOpenPrice(false);
	};

	const priceStateChangeHandler = () => {
		setOpenPrice((prev) => !prev);
		setOpenStyle(false);
		setOpenType(false);
	};

	const disableAllStateHandler = () => {
		setOpenType(false);
		setOpenStyle(false);
		setOpenPrice(false);
	};

	


	const projectStyleSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						projectStyleList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, projectStyleSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const projectTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				
			} catch (err: any) {
				console.log('ERROR, projectTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const priceRangeSelectHandler = useCallback(
		async (start: number, end: number) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: {
							start,
							end,
						},
					},
				});
				setOpenPrice(false);
			} catch (err: any) {
				console.log('ERROR, priceRangeSelectHandler:', err);
			}
		},
		[searchFilter],
	);


	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.projectStyleList?.length == 0) {
				delete searchFilter.search.projectStyleList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (!searchFilter?.search?.pricesRange) {
				searchFilter.search.pricesRange = { start: 0, end: 2000000 };
			}

			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openStyle ? 'on' : ''}`} onClick={styleStateChangeHandler}>
							<span>{searchFilter?.search?.projectStyleList ? searchFilter?.search?.projectStyleList[0] : t('Project style')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Project type')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openPrice ? 'on' : ''}`} onClick={priceStateChangeHandler}>
							<span>
								{searchFilter?.search?.pricesRange?.start === 0 && searchFilter?.search?.pricesRange?.end === 2000000
									? 'Price Range'
									: searchFilter?.search?.pricesRange?.end === 2000000
									? `$${(searchFilter?.search?.pricesRange?.start / 1000).toFixed(0)}K+`
									: `$${(searchFilter?.search?.pricesRange?.start / 1000).toFixed(0)}K - $${(searchFilter?.search?.pricesRange?.end / 1000).toFixed(0)}K`}
							</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'search-btn white-btn'} onClick={pushSearchHandler}>
							<span>Search</span>
							<img src="/img/icons/rightup.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openStyle ? 'on' : ''}`} ref={locationRef}>
						{projectStyle.map((location: ProjectStyle) => {
							const isSelected = searchFilter?.search?.projectStyleList?.some((item: ProjectStyle) => item === location);
							return (
								<div 
									className={`filter-option ${isSelected ? 'selected' : ''}`}
									onClick={() => projectStyleSelectHandler(location)} 
									key={location}
								>
									<Checkbox
										checked={isSelected}
										icon={<RadioButtonUncheckedIcon sx={{ color: '#999', fontSize: 20 }} />}
										checkedIcon={<CheckCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />}
										sx={{ 
											padding: '4px',
											'&:hover': { backgroundColor: 'transparent' }
										}}
									/>
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{projectType.map((type: ProjectType) => {
							const isSelected = searchFilter?.search?.typeList?.some((item: ProjectType) => item === type);
							return (
								<div
									className={`filter-option ${isSelected ? 'selected' : ''}`}
									onClick={() => projectTypeSelectHandler(type)}
									key={type}
								>
									<Checkbox
										checked={isSelected}
										icon={<RadioButtonUncheckedIcon sx={{ color: '#999', fontSize: 20 }} />}
										checkedIcon={<CheckCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />}
										sx={{ 
											padding: '4px',
											'&:hover': { backgroundColor: 'transparent' }
										}}
									/>
									<span>{type}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-price ${openPrice ? 'on' : ''}`} ref={priceRef}>
						{priceRanges.map((range, index) => {
							const isSelected = 
								searchFilter?.search?.pricesRange?.start === range.start && 
								searchFilter?.search?.pricesRange?.end === range.end;
							return (
								<div
									className={`filter-option ${isSelected ? 'selected' : ''}`}
									onClick={() => priceRangeSelectHandler(range.start, range.end)}
									key={index}
								>
									<Checkbox
										checked={isSelected}
										icon={<RadioButtonUncheckedIcon sx={{ color: '#999', fontSize: 20 }} />}
										checkedIcon={<CheckCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />}
										sx={{ 
											padding: '4px',
											'&:hover': { backgroundColor: 'transparent' }
										}}
									/>
									<span>{range.label}</span>
								</div>
							);
						})}
					</div>

				</Stack>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
