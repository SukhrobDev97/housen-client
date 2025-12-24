import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Modal, Divider, Button, Checkbox } from '@mui/material';
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
	const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
	const [projectStyle, setProjectStyle] = useState<ProjectStyle[]>(Object.values(ProjectStyle));
	const [projectType, setProjectType] = useState<ProjectType[]>(Object.values(ProjectType));
	
	const priceRanges = [
		{ label: 'Any Price', start: 0, end: 2000000 },
		{ label: '$0 - $100K', start: 0, end: 100000 },
		{ label: '$100K - $300K', start: 100000, end: 300000 },
		{ label: '$300K - $500K', start: 300000, end: 500000 },
		{ label: '$500K - $750K', start: 500000, end: 750000 },
		
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
				setOpenStyle(false);
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
				setOpenType(false);
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
			const updatedFilter = { ...searchFilter };
			
			// Ensure search object exists
			if (!updatedFilter.search) {
				updatedFilter.search = {};
			}
			
			// Clean up empty arrays
			if (updatedFilter.search.projectStyleList && updatedFilter.search.projectStyleList.length === 0) {
				delete updatedFilter.search.projectStyleList;
			}
			if (updatedFilter.search.typeList && updatedFilter.search.typeList.length === 0) {
				delete updatedFilter.search.typeList;
			}

			// Ensure pricesRange exists
			if (!updatedFilter.search.pricesRange) {
				updatedFilter.search.pricesRange = { start: 0, end: 2000000 };
			}

			// Add options based on listingType
			if (!updatedFilter.search.options) {
				updatedFilter.search.options = [];
			}
			// Remove existing options first
			updatedFilter.search.options = updatedFilter.search.options.filter(
				opt => opt !== 'projectPublic' && opt !== 'projectCollaboration'
			);
			// Add the selected option
			if (listingType === 'sale') {
				updatedFilter.search.options.push('projectPublic');
			} else if (listingType === 'rent') {
				updatedFilter.search.options.push('projectCollaboration');
			}
			// Remove if empty
			if (updatedFilter.search.options.length === 0) {
				delete updatedFilter.search.options;
			}

			await router.push(
				`/property?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`,
				`/property?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`,
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
				<Stack className={'premium-filter-card'}>
					{/* Toggle Buttons */}
					<Stack className={'filter-toggles'}>
						<button 
							className={`toggle-btn ${listingType === 'sale' ? 'active' : ''}`}
							onClick={() => setListingType('sale')}
							type="button"
						>
							<span>Public</span>
						</button>
						<button 
							className={`toggle-btn ${listingType === 'rent' ? 'active' : ''}`}
							onClick={() => setListingType('rent')}
							type="button"
						>
							<span>Collaboration</span>
						</button>
					</Stack>

					{/* Filter Dropdowns */}
					<Stack className={'filter-dropdowns'}>
						<div className={'filter-dropdown-group'}>
							<button type="button" className={`filter-dropdown-btn ${openStyle ? 'active' : ''}`} onClick={styleStateChangeHandler}>
								<span className={'filter-label'}>Style</span>
								<span className={'filter-value'}>
									{searchFilter?.search?.projectStyleList?.length ? searchFilter?.search?.projectStyleList[0] : 'All Styles'}
								</span>
								<ExpandMoreIcon className={`expand-icon ${openStyle ? 'rotated' : ''}`} />
							</button>
							
							{/* Dropdown Menu */}
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
												checkedIcon={<CheckCircleIcon sx={{ color: '#364440', fontSize: 20 }} />}
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
						</div>

						<div className={'filter-dropdown-group'}>
							<button type="button" className={`filter-dropdown-btn ${openType ? 'active' : ''}`} onClick={typeStateChangeHandler}>
								<span className={'filter-label'}>Type</span>
								<span className={'filter-value'}>
									{searchFilter?.search?.typeList?.length ? searchFilter?.search?.typeList[0] : 'All Types'}
								</span>
								<ExpandMoreIcon className={`expand-icon ${openType ? 'rotated' : ''}`} />
							</button>
							
							{/* Dropdown Menu */}
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
												checkedIcon={<CheckCircleIcon sx={{ color: '#364440', fontSize: 20 }} />}
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
						</div>

						<div className={'filter-dropdown-group'}>
							<button type="button" className={`filter-dropdown-btn ${openPrice ? 'active' : ''}`} onClick={priceStateChangeHandler}>
								<span className={'filter-label'}>Price</span>
								<span className={'filter-value'}>
									{(() => {
										const priceStart = searchFilter?.search?.pricesRange?.start;
										const priceEnd = searchFilter?.search?.pricesRange?.end;
										
										if (priceStart === undefined || priceEnd === undefined) {
											return 'Any Price';
										}
										
										if (priceStart === 0 && priceEnd === 2000000) {
											return 'All Prices';
										}
										
										if (priceEnd === 2000000) {
											return `$${(priceStart / 1000).toFixed(0)}K+`;
										}
										
										return `$${(priceStart / 1000).toFixed(0)}K - $${(priceEnd / 1000).toFixed(0)}K`;
									})()}
								</span>
								<ExpandMoreIcon className={`expand-icon ${openPrice ? 'rotated' : ''}`} />
							</button>
							
							{/* Dropdown Menu */}
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
												checkedIcon={<CheckCircleIcon sx={{ color: '#364440', fontSize: 20 }} />}
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
						</div>

						{/* Search Button */}
						<button type="button" className={'filter-search-btn'} onClick={pushSearchHandler}>
							<span>Search</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
								<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
							</svg>
						</button>
					</Stack>
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
