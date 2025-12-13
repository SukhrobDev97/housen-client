import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography, IconButton, Avatar, Chip } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import View360Icon from '@mui/icons-material/ThreeDRotation';
import FloorplanIcon from '@mui/icons-material/Dashboard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { Project } from '../../libs/types/property/property';
import ProjectBigCard from '../../libs/components/common/PropertyBigCard';
import ImageLightbox from '../../libs/components/common/ImageLightbox';
import { GET_COMMENTS, GET_PROJECT, GET_PROJECTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_PROJECT } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProjectDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [project, setProject] = useState<Project | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProjects, setDestinationProjects] = useState<Project[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [projectComments, setProjectComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PROJECT,
		commentContent: '',
		commentRefId: '',
	});
	const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
	const [lightboxInitialIndex, setLightboxInitialIndex] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetProject] = useMutation(LIKE_TARGET_PROJECT);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getProjectLoading,
		data: getProjectData,
		error: getProjectError,
		refetch: getProjectRefetch,
	  } = useQuery(GET_PROJECT, {
		fetchPolicy: 'network-only',
		variables: { input: projectId },
		skip: !projectId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProject) setProject(data?.getProject);
			if (data?.getProject) setSlideImage(data?.getProject?.projectImages[0]);
		},
	  });

	  const {
		loading: getProjectsLoading,
		data: getProjectsData,
		error: getProjectsError,
		refetch: getProjectsRefetch,
		} = useQuery(GET_PROJECTS, {
		fetchPolicy: 'cache-and-network',
		variables: { 
			input: {
				page: 1,
				limit: 6,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					projectStyleList: [project?.projectStyle],
				},
			},
		 },
		skip: !projectId && !project,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProjects.list) setDestinationProjects(data?.getProjects?.list);
		},
		});
		
	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setProjectComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setProjectId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likeProjectHandler = async (user: any, id: string | undefined) => {
		try {
		if (!id) return;
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
	
		await likeTargetProject({
			variables: { input: id },
		});

		await getProjectRefetch({ input: id });
	
		await getProjectsRefetch({ 
			input: {
				page: 1,
					limit: 6,
				sort: 'createdAt',
				direction: Direction.DESC,
					search: {
						projectStyleList: [project?.projectStyle],
					},
				},
		});
	
		await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
		console.log('ERROR_LikeProjectHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
		}
	};

	const createCommentHandler = async (e: any) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await createComment({
				variables: { input: insertCommentData },
			});

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const openLightbox = (index: number) => {
		setLightboxInitialIndex(index);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const handleSaveProject = () => {
		setIsSaved(!isSaved);
		sweetTopSmallSuccessAlert(isSaved ? 'Removed from saved' : 'Saved!', 800);
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		sweetTopSmallSuccessAlert('Link copied!', 800);
	};

	if (getProjectLoading || !project) {
		return (
			<Stack sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<CircularProgress size={'3rem'} sx={{ color: '#3B3F2B' }} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>PROJECT DETAIL PAGE</div>;
	} else {
		return (
			<div id={'project-detail-page'}>
				{/* HERO SECTION */}
				<section className={'hero-section'}>
					<div
						className={'hero-image'}
						style={{
							backgroundImage: `url(${slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/property/bigImage.png'})`,
							cursor: 'pointer',
						}}
						onClick={() => {
							const imageIndex = project?.projectImages?.indexOf(slideImage) ?? 0;
							openLightbox(imageIndex);
						}}
					>
						<div className={'hero-overlay'} />
						<div className={'hero-content'}>
							<div className={'hero-badges'}>
								<Chip
									label={project?.projectType}
									className={'type-badge'}
									icon={<CategoryIcon />}
								/>
								<Chip
									label={project?.projectStyle}
									className={'style-badge'}
									icon={<PaletteIcon />}
								/>
							</div>
							<Typography className={'hero-title'}>{project?.projectTitle}</Typography>
							<Typography className={'hero-price'}>${formatterStr(project?.projectPrice)}</Typography>
							<div className={'hero-actions'}>
								<IconButton className={'action-btn'} onClick={() => likeProjectHandler(user, project?._id)}>
											{project?.meLiked && project?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon sx={{ color: '#ff6b6b' }} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<IconButton className={'action-btn'} onClick={handleSaveProject}>
									{isSaved ? <BookmarkIcon sx={{ color: '#3B3F2B' }} /> : <BookmarkBorderIcon />}
								</IconButton>
								<IconButton className={'action-btn'} onClick={handleShare}>
									<ShareIcon />
								</IconButton>
							</div>
							<div className={'hero-stats'}>
								<span><VisibilityIcon fontSize="small" /> {project?.projectViews} views</span>
								<span><FavoriteIcon fontSize="small" /> {project?.projectLikes} likes</span>
								<span><AccessTimeIcon fontSize="small" /> {moment().diff(project?.createdAt, 'days')} days ago</span>
							</div>
						</div>
					</div>
				</section>

				{/* IMAGE GALLERY */}
				<section className={'gallery-section'}>
					<div className={'gallery-container'}>
						<div className={'gallery-scroll'}>
							{project?.projectImages?.map((img: string, index: number) => (
								<div
									key={index}
									className={`gallery-thumb ${slideImage === img ? 'active' : ''}`}
									onClick={() => {
										changeImageHandler(img);
										openLightbox(index);
									}}
								>
									<img src={`${REACT_APP_API_URL}/${img}`} alt={`Project image ${index + 1}`} />
								</div>
							))}
						</div>
					</div>
				</section>

				{/* MAIN CONTENT */}
				<section className={'content-section'}>
					<div className={'content-container'}>
						{/* LEFT COLUMN */}
						<div className={'left-column'}>
							{/* META BADGES */}
							<div className={'meta-badges'}>
								<div className={'badge-item'}>
									<CategoryIcon />
									<div className={'badge-info'}>
										<span className={'label'}>Type</span>
										<span className={'value'}>{project?.projectType}</span>
									</div>
								</div>
								<div className={'badge-item'}>
									<PaletteIcon />
									<div className={'badge-info'}>
										<span className={'label'}>Style</span>
										<span className={'value'}>{project?.projectStyle}</span>
									</div>
								</div>
								<div className={'badge-item'}>
									<CalendarTodayIcon />
									<div className={'badge-info'}>
										<span className={'label'}>Duration</span>
										<span className={'value'}>{project?.projectDuration} months</span>
									</div>
								</div>
								<div className={'badge-item'}>
									<AttachMoneyIcon />
									<div className={'badge-info'}>
										<span className={'label'}>Price</span>
										<span className={'value'}>${formatterStr(project?.projectPrice)}</span>
									</div>
								</div>
							</div>

							{/* PROJECT DESCRIPTION */}
							<div className={'description-card'}>
								<Typography className={'section-title'}>About This Project</Typography>
								<Typography className={'description-text'}>
									{project?.projectDesc || 'No description available for this project.'}
								</Typography>
								{(project?.projectCollaboration || project?.projectPublic) && (
									<div className={'highlight-list'}>
										<Typography className={'highlight-title'}>Project Highlights</Typography>
										<ul>
											{project?.projectCollaboration && <li>Open for Collaboration</li>}
											{project?.projectPublic && <li>Public Project</li>}
											<li>Professional Design</li>
											<li>High Quality Materials</li>
										</ul>
									</div>
								)}
							</div>

							{/* PROJECT DETAILS CARD */}
							<div className={'details-card'}>
								<Typography className={'section-title'}>Project Details</Typography>
								<div className={'details-grid'}>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Project Type</span>
										<span className={'detail-value'}>{project?.projectType}</span>
									</div>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Project Style</span>
										<span className={'detail-value'}>{project?.projectStyle}</span>
									</div>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Duration</span>
										<span className={'detail-value'}>{project?.projectDuration} months</span>
									</div>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Price</span>
										<span className={'detail-value'}>${formatterStr(project?.projectPrice)}</span>
									</div>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Collaboration</span>
										<span className={'detail-value'}>{project?.projectCollaboration ? 'Yes' : 'No'}</span>
									</div>
									<div className={'detail-item'}>
										<span className={'detail-label'}>Public</span>
										<span className={'detail-value'}>{project?.projectPublic ? 'Yes' : 'No'}</span>
									</div>
								</div>
							</div>

							{/* 360° VIEW PLACEHOLDER */}
							<div className={'panorama-card'}>
								<div className={'panorama-placeholder'}>
									<View360Icon className={'panorama-icon'} />
									<Typography className={'panorama-title'}>360° Virtual Tour</Typography>
									<Typography className={'panorama-subtitle'}>Coming Soon</Typography>
								</div>
							</div>

							{/* FLOOR PLAN PLACEHOLDER */}
							<div className={'floorplan-card'}>
								<Typography className={'section-title'}>Floor Plan</Typography>
								<div className={'floorplan-placeholder'}>
									<FloorplanIcon className={'floorplan-icon'} />
									<Typography className={'floorplan-text'}>Floor plan not available</Typography>
								</div>
							</div>

							{/* COMMENTS SECTION */}
							<div className={'comments-section'}>
								<Typography className={'section-title'}>
									Comments ({commentTotal})
								</Typography>

								{/* Leave Comment */}
								<div className={'comment-form'}>
									<textarea
										placeholder="Share your thoughts about this project..."
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									/>
									<Button
										className={'submit-comment-btn'}
										disabled={insertCommentData.commentContent === '' || !user?._id}
										onClick={createCommentHandler}
									>
										Post Comment
									</Button>
								</div>

								{/* Comments List */}
								{commentTotal > 0 && (
									<div className={'comments-list'}>
										{projectComments?.map((comment: Comment) => (
											<Review comment={comment} key={comment?._id} />
										))}
										{Math.ceil(commentTotal / commentInquiry.limit) > 1 && (
											<Box className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="rounded"
													sx={{
														'& .MuiPaginationItem-root': {
															borderRadius: '8px',
														},
														'& .Mui-selected': {
															backgroundColor: '#3B3F2B !important',
															color: '#fff',
														},
													}}
												/>
											</Box>
										)}
									</div>
								)}
							</div>
						</div>

						{/* RIGHT COLUMN - STICKY SIDEBAR */}
						<div className={'right-column'}>
							{/* DESIGNER CARD */}
							<div className={'designer-card'}>
								<Typography className={'card-title'}>Project Design Agency</Typography>
								<div className={'designer-info'}>
									<Avatar
											src={
												project?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${project?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
										className={'designer-avatar'}
										/>
									<div className={'designer-details'}>
											<Link href={`/member?memberId=${project?.memberData?._id}`}>
											<Typography className={'designer-name'}>
												{project?.memberData?.memberNick}
												<VerifiedIcon className={'verified-icon'} />
											</Typography>
											</Link>
										<Typography className={'designer-role'}>Interior Agency</Typography>
									</div>
								</div>
								<div className={'contact-info'}>
									<div className={'contact-item'}>
										<PhoneIcon />
										<span>{project?.memberData?.memberPhone || 'Not provided'}</span>
									</div>
									<div className={'contact-item'}>
										<EmailIcon />
										<span>Contact via message</span>
									</div>
								</div>
								<Button className={'contact-btn'}>Contact Designer</Button>
							</div>

							{/* INQUIRY FORM */}
							<div className={'inquiry-card'}>
								<Typography className={'card-title'}>Send Inquiry</Typography>
								<div className={'form-group'}>
									<label>Your Name</label>
									<input type="text" placeholder="Enter your name" />
								</div>
								<div className={'form-group'}>
									<label>Phone Number</label>
									<input type="text" placeholder="Enter your phone" />
								</div>
								<div className={'form-group'}>
									<label>Email</label>
									<input type="email" placeholder="Enter your email" />
								</div>
								<div className={'form-group'}>
									<label>Message</label>
									<textarea placeholder="I'm interested in this project..." />
								</div>
								<Button className={'send-btn'}>Send Message</Button>
							</div>
						</div>
					</div>
				</section>

				{/* RELATED PROJECTS */}
				{destinationProjects.length > 0 && (
					<section className={'related-section'}>
						<div className={'related-container'}>
							<div className={'related-header'}>
								<div>
									<Typography className={'related-title'}>Related Projects</Typography>
									<Typography className={'related-subtitle'}>
										Explore similar projects you might like
									</Typography>
								</div>
								<div className={'related-nav'}>
									<IconButton className={'nav-btn swiper-related-prev'}>
										<WestIcon />
									</IconButton>
									<IconButton className={'nav-btn swiper-related-next'}>
										<EastIcon />
									</IconButton>
								</div>
							</div>
									<Swiper
								className={'related-swiper'}
								slidesPerView={3}
								spaceBetween={24}
								modules={[Navigation]}
										navigation={{
									nextEl: '.swiper-related-next',
									prevEl: '.swiper-related-prev',
								}}
							>
								{destinationProjects.map((proj: Project) => (
									<SwiperSlide key={proj._id}>
										<ProjectBigCard project={proj} likeProjectHandler={likeProjectHandler} />
												</SwiperSlide>
								))}
									</Swiper>
						</div>
					</section>
						)}

				{/* IMAGE LIGHTBOX */}
				{project?.projectImages && (
					<ImageLightbox
						images={project.projectImages.map((img: string) => `${REACT_APP_API_URL}/${img}`)}
						initialIndex={lightboxInitialIndex}
						isOpen={lightboxOpen}
						onClose={closeLightbox}
					/>
				)}
			</div>
		);
	}
};

ProjectDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(ProjectDetail);
