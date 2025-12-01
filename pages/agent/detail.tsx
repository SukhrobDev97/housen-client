import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography, Slider, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ChairIcon from '@mui/icons-material/Chair';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BusinessIcon from '@mui/icons-material/Business';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Project } from '../../libs/types/property/property';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { ProjectsInquiry } from '../../libs/types/property/property.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProjectBigCard from '../../libs/components/common/PropertyBigCard';
import { CREATE_COMMENT, LIKE_TARGET_PROJECT } from '../../apollo/user/mutation';
import { GET_AGENCIES, GET_COMMENTS, GET_MEMBER, GET_PROJECTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Services data
const agencyServices = [
	{ icon: <ArchitectureIcon />, name: 'Architecture Design', desc: 'Custom architectural solutions' },
	{ icon: <DesignServicesIcon />, name: 'Interior Design', desc: 'Luxury interior concepts' },
	{ icon: <ChairIcon />, name: 'Furniture Selection', desc: 'Curated furniture pieces' },
	{ icon: <LightbulbIcon />, name: 'Lighting Design', desc: 'Ambient lighting solutions' },
	{ icon: <HomeWorkIcon />, name: 'Residential Projects', desc: 'Dream home creation' },
	{ icon: <BusinessIcon />, name: 'Commercial Spaces', desc: 'Office & retail design' },
];


const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agencyId, setAgencyId] = useState<string | null>(null);
	const [agency, setAgency] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<ProjectsInquiry>(initialInput);
	const [agencyProjects, setAgencyProjects] = useState<Project[]>([]);
	const [projectTotal, setProjectTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agencyComments, setAgencyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [relatedAgencies, setRelatedAgencies] = useState<Member[]>([]);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	// Filter states
	const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
	const [sortBy, setSortBy] = useState<string>('newest');
	const [filterCategory, setFilterCategory] = useState<string>('all');

	// Contact form states
	const [contactForm, setContactForm] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agencyId },
		skip: !agencyId,
		onCompleted: (data: T) => {
			setAgency(data?.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});

			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});

			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
	  } = useQuery(GET_PROJECTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
		  setAgencyProjects(data?.getProjects?.list);
		  setProjectTotal(data?.getProjects?.metaCounter[0]?.total ?? 0);
		},
	  });
	  
	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgencyComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total);
		},
	});

	const {
		loading: getAgenciesLoading,
		data: getAgenciesData,
	} = useQuery(GET_AGENCIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 4, sort: 'createdAt', direction: 'DESC', search: {} } },
		onCompleted: (data: T) => {
			const filtered = data?.getAgencies?.list?.filter((a: Member) => a._id !== agencyId) || [];
			setRelatedAgencies(filtered.slice(0, 4));
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agencyId) setAgencyId(router.query.agencyId as string);
	}, [router]);

	/** HANDLERS **/
	const projectPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agencyId) throw new Error('Cannot write a review for yourself');
		
			await createComment({
			  variables: {
				input: insertCommentData,
			  },
			});
		
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
			sweetTopSmallSuccessAlert('Review submitted!', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	 
	const likeProjectHandler = async (user: any, id: string) => {
		try {
		  if (!id) return;
		  if (!user._id) throw new Error(Messages.error2);
	  
		  await likeTargetProject({
			variables: {
			  input: id,
			},
		  });
	  
		  await getProjectsRefetch({ input: searchFilter });
		  await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
		  console.log('ERROR, likePropertyHandler:', err.message);
		  sweetMixinErrorAlert(err.message).then();
		}
	  };

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: agency?.memberFullName || agency?.memberNick,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			sweetTopSmallSuccessAlert('Link copied!', 800);
		}
	};

	const handleContactSubmit = () => {
		if (!contactForm.name || !contactForm.email || !contactForm.message) {
			sweetMixinErrorAlert('Please fill all required fields');
			return;
		}
		sweetTopSmallSuccessAlert('Message sent successfully!', 1200);
		setContactForm({ name: '', email: '', phone: '', message: '' });
	};

	// Loading state
	if (getMemberLoading || !agency) {
		return (
			<Stack className="agency-detail-page" sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
				<CircularProgress sx={{ color: '#2c3e2f' }} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>AGENCY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'agency-detail-page'}>
				{/* ==========================================
					1) HERO SECTION
				========================================== */}
				<Stack className={'hero-section'}>
					<Box className={'hero-banner'}>
						<img src="/img/banner/agencyDetail.jpeg" alt="Agency Banner" />
						<Box className={'hero-overlay'} />
						<Stack className={'hero-content'}>
							<Box className={'agency-avatar'}>
								<img
									src={agency?.memberImage ? `${REACT_APP_API_URL}/${agency.memberImage}` : '/img/profile/defaultUser.svg'}
									alt={agency?.memberNick}
								/>
							</Box>
							<Typography className={'agency-name'}>
								{agency?.memberFullName ?? agency?.memberNick}
							</Typography>
							<Typography className={'agency-subtitle'}>
								{agency?.memberDesc || 'Premium Interior Design & Architecture Agency'}
							</Typography>

							<Stack className={'contact-row'}>
								{agency?.memberPhone && (
									<Box className={'contact-item'}>
										<PhoneIcon />
										<span>{agency.memberPhone}</span>
									</Box>
								)}
								{agency?.memberAddress && (
									<Box className={'contact-item'}>
										<LocationOnIcon />
										<span>{agency.memberAddress}</span>
									</Box>
								)}
								<Box className={'contact-item share'} onClick={handleShare}>
									<ShareIcon />
									<span>Share</span>
								</Box>
							</Stack>

							{/* Social Links */}
							<Box className={'social-links'}>
								<a href="#" target="_blank" rel="noopener noreferrer"><FacebookIcon /></a>
								<a href="#" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
								<a href="#" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
								<a href="#" target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
							</Box>
						</Stack>
					</Box>
				</Stack>

				<Stack className={'main-content'}>
					{/* ==========================================
						2) ABOUT AGENCY
					========================================== */}
					<Stack className={'about-section'}>
						<Box className={'about-card'}>
							<Typography className={'section-title'}>About the Agency</Typography>
							<Typography className={'about-text'}>
								{agency?.memberDesc ||
									`Welcome to ${agency?.memberFullName || agency?.memberNick}, a leading interior design and architecture agency dedicated to transforming spaces into extraordinary experiences. With years of expertise in residential and commercial design, we bring creativity, precision, and passion to every project. Our team of skilled designers and architects work closely with clients to understand their vision and deliver exceptional results that exceed expectations.`}
							</Typography>
						</Box>
					</Stack>

					{/* ==========================================
						3) QUICK STATS
					========================================== */}
					<Stack className={'stats-section'}>
						<Box className={'stat-card'}>
							<WorkspacePremiumIcon className={'stat-icon'} />
							<Typography className={'stat-number'}>{agency?.memberProjects || 0}</Typography>
							<Typography className={'stat-label'}>Projects Completed</Typography>
						</Box>
						<Box className={'stat-card'}>
							<RemoveRedEyeIcon className={'stat-icon'} />
							<Typography className={'stat-number'}>{agency?.memberViews || 0}</Typography>
							<Typography className={'stat-label'}>Profile Views</Typography>
						</Box>
						<Box className={'stat-card'}>
							<FavoriteIcon className={'stat-icon'} />
							<Typography className={'stat-number'}>{agency?.memberLikes || 0}</Typography>
							<Typography className={'stat-label'}>Total Likes</Typography>
						</Box>
						<Box className={'stat-card'}>
							<StarIcon className={'stat-icon'} />
							<Typography className={'stat-number'}>{commentTotal || 0}</Typography>
							<Typography className={'stat-label'}>Client Reviews</Typography>
						</Box>
					</Stack>

					{/* ==========================================
						4) SERVICES THEY OFFER
					========================================== */}
					<Stack className={'services-section'}>
						<Typography className={'section-title'}>Services We Offer</Typography>
						<Box className={'services-grid'}>
							{agencyServices.map((service, index) => (
								<Box key={index} className={'service-card'}>
									<Box className={'service-icon'}>{service.icon}</Box>
									<Typography className={'service-name'}>{service.name}</Typography>
									<Typography className={'service-desc'}>{service.desc}</Typography>
								</Box>
							))}
						</Box>
					</Stack>

					{/* ==========================================
						5) PORTFOLIO + FILTER SECTION
					========================================== */}
					<Stack className={'portfolio-section'}>
						<Typography className={'section-title'}>Our Portfolio</Typography>
						<Stack className={'portfolio-layout'}>
							{/* Left - Sticky Filter */}
							<Box className={'filter-sidebar'}>
								<Box className={'filter-card'}>
									<Typography className={'filter-title'}>Filter Projects</Typography>

									<Box className={'filter-group'}>
										<Typography className={'filter-label'}>Category</Typography>
										<FormControl fullWidth size="small">
											<Select
												value={filterCategory}
												onChange={(e) => setFilterCategory(e.target.value)}
											>
												<MenuItem value="all">All Categories</MenuItem>
												<MenuItem value="residential">Residential</MenuItem>
												<MenuItem value="commercial">Commercial</MenuItem>
												<MenuItem value="entertainment">Entertainment</MenuItem>
											</Select>
										</FormControl>
									</Box>

									<Box className={'filter-group'}>
										<Typography className={'filter-label'}>Price Range</Typography>
										<Slider
											value={priceRange}
											onChange={(_: Event, newValue: number | number[]) => setPriceRange(newValue as number[])}
											valueLabelDisplay="auto"
											min={0}
											max={2000000}
											sx={{ color: '#2c3e2f' }}
										/>
										<Box className={'price-labels'}>
											<span>${priceRange[0].toLocaleString()}</span>
											<span>${priceRange[1].toLocaleString()}</span>
										</Box>
									</Box>

									<Box className={'filter-group'}>
										<Typography className={'filter-label'}>Sort By</Typography>
										<FormControl fullWidth size="small">
											<Select
												value={sortBy}
												onChange={(e) => setSortBy(e.target.value)}
											>
												<MenuItem value="newest">Newest First</MenuItem>
												<MenuItem value="oldest">Oldest First</MenuItem>
												<MenuItem value="likes">Most Liked</MenuItem>
												<MenuItem value="views">Most Viewed</MenuItem>
											</Select>
										</FormControl>
									</Box>

									<Button className={'apply-filter-btn'}>
										Apply Filters
									</Button>
								</Box>
							</Box>

							{/* Right - Portfolio Grid */}
							<Box className={'portfolio-grid'}>
								{agencyProjects.length === 0 ? (
									<Box className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No projects available yet</p>
									</Box>
								) : (
									<>
										<Box className={'projects-grid'}>
											{agencyProjects.map((project: Project) => (
												<Box className={'project-wrap'} key={project?._id}>
													<ProjectBigCard
														project={project}
														likeProjectHandler={likeProjectHandler}
													/>
												</Box>
											))}
										</Box>
										{projectTotal > searchFilter.limit && (
											<Stack className={'pagination-box'}>
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(projectTotal / searchFilter.limit) || 1}
											onChange={projectPaginationChangeHandler}
													shape="rounded"
										/>
												<Typography className={'total-text'}>
													Showing {agencyProjects.length} of {projectTotal} projects
												</Typography>
									</Stack>
										)}
								</>
							)}
							</Box>
						</Stack>
					</Stack>


					{/* ==========================================
						7) CLIENT REVIEWS
					========================================== */}
					<Stack className={'reviews-section'}>
						<Typography className={'section-title'}>Client Reviews</Typography>
						{commentTotal !== 0 && (
							<Stack className={'reviews-wrap'}>
								<Box className={'reviews-header'}>
									<StarIcon />
									<span>{commentTotal} review{commentTotal > 1 ? 's' : ''}</span>
								</Box>
								<Box className={'reviews-list'}>
									{agencyComments?.map((comment: Comment) => (
										<ReviewCard comment={comment} key={comment?._id} />
									))}
								</Box>
								{commentTotal > commentInquiry.limit && (
									<Box className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
											shape="rounded"
									/>
								</Box>
								)}
							</Stack>
						)}

						<Stack className={'leave-review'}>
							<Typography className={'review-form-title'}>Leave A Review</Typography>
							<textarea
								placeholder="Write your review here..."
								onChange={({ target: { value } }) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							/>
								<Button
								className={'submit-review-btn'}
								disabled={insertCommentData.commentContent === '' || !user?._id}
									onClick={createCommentHandler}
								>
								Submit Review
								<EastIcon />
							</Button>
						</Stack>
					</Stack>

					{/* ==========================================
						8) CONTACT / INQUIRY FORM
					========================================== */}
					<Stack className={'contact-section'}>
						<Typography className={'section-title'}>Get In Touch</Typography>
						<Stack className={'contact-layout'}>
							<Box className={'contact-form-card'}>
								<Typography className={'form-title'}>Send us a message</Typography>
								<Box className={'form-group'}>
									<input
										type="text"
										placeholder="Your Name *"
										value={contactForm.name}
										onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
									/>
								</Box>
								<Box className={'form-group'}>
									<input
										type="email"
										placeholder="Your Email *"
										value={contactForm.email}
										onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
									/>
								</Box>
								<Box className={'form-group'}>
									<input
										type="tel"
										placeholder="Your Phone"
										value={contactForm.phone}
										onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
									/>
								</Box>
								<Box className={'form-group'}>
									<textarea
										placeholder="Your Message *"
										rows={5}
										value={contactForm.message}
										onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
									/>
								</Box>
								<Button className={'submit-contact-btn'} onClick={handleContactSubmit}>
									Send Message
									<EastIcon />
								</Button>
							</Box>

							<Box className={'map-card'}>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2skr!4v1635000000000!5m2!1sen!2skr"
									width="100%"
									height="100%"
									style={{ border: 0, borderRadius: '16px' }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</Box>
						</Stack>
					</Stack>

					{/* ==========================================
						9) RELATED AGENCIES
					========================================== */}
					{relatedAgencies.length > 0 && (
						<Stack className={'related-section'}>
							<Box className={'section-header'}>
								<Typography className={'section-title'}>You May Also Like</Typography>
								<Link href="/agent">
									<Button className={'view-all-btn'}>
										View All
										<EastIcon />
									</Button>
								</Link>
							</Box>
							<Box className={'related-grid'}>
								{relatedAgencies.map((relAgency: Member) => (
									<Box
										key={relAgency._id}
										className={'related-card'}
										onClick={() => router.push(`/agent/detail?agencyId=${relAgency._id}`)}
									>
										<Box className={'card-image'}>
											<img
												src={relAgency?.memberImage ? `${REACT_APP_API_URL}/${relAgency.memberImage}` : '/img/profile/defaultUser.svg'}
												alt={relAgency.memberNick}
											/>
											<Box className={'card-overlay'} />
										</Box>
										<Box className={'card-content'}>
											<Typography className={'agency-name'}>
												{relAgency?.memberFullName ?? relAgency?.memberNick}
											</Typography>
											<Typography className={'agency-type'}>Design Agency</Typography>
											<Box className={'card-stats'}>
												<span>{relAgency?.memberProjects || 0} Projects</span>
												<span>{relAgency?.memberLikes || 0} Likes</span>
											</Box>
										</Box>
									</Box>
								))}
							</Box>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);

