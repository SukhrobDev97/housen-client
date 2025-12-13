import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField, InputLabel } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { useMutation } from '@apollo/client';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../sweetAlert';
import SendIcon from '@mui/icons-material/Send';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);
	const [articleTitle, setArticleTitle] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	const memoizedValues = useMemo(() => {
		const articleContent = '',
			articleImage = '';

		return { articleContent, articleImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.articleImage = responseImage;

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		setArticleTitle(e.target.value);
	};

	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const articleContent = editor?.getInstance().getHTML() as string;
			memoizedValues.articleContent = articleContent;

			if (articleTitle === '' || memoizedValues.articleContent === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createBoardArticle({
				variables: {
					input: {
						articleTitle,
						articleContent: memoizedValues.articleContent,
						articleImage: memoizedValues.articleImage,
						articleCategory,
					},
				},
			});

			await sweetTopSuccessAlert('Article has been created successfully!', 700);

			await router.push({
				pathname: '/mypage',
				query: { category: 'myArticles' },
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
		}
	};

	return (
		<Stack className="editor-container">
			{/* Form Fields Row */}
			<Stack className="form-fields">
				<Box className="form-group category-group">
					<Typography className="field-label">Category</Typography>
					<FormControl fullWidth className="select-wrapper">
						<Select
							value={articleCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							className="category-select"
						>
							<MenuItem value={BoardArticleCategory.FREE}>Free Board</MenuItem>
							<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
							<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
							<MenuItem value={BoardArticleCategory.RECOMMEND}>Recommendation</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box className="form-group title-group">
					<Typography className="field-label">Article Title</Typography>
					<TextField
						value={articleTitle}
						onChange={articleTitleHandler}
						placeholder="Enter your article title..."
						fullWidth
						className="title-input"
						variant="outlined"
					/>
				</Box>
			</Stack>

			{/* Editor Section */}
			<Stack className="editor-section">
				<Typography className="field-label">Content</Typography>
				<Box className="editor-box">
			<Editor
						initialValue={''}
						placeholder={''}
				previewStyle={'vertical'}
						height={'500px'}
				// @ts-ignore
				initialEditType={'WYSIWYG'}
				toolbarItems={[
					['heading', 'bold', 'italic', 'strike'],
					['image', 'table', 'link'],
					['ul', 'ol', 'task'],
				]}
				ref={editorRef}
				hooks={{
					addImageBlobHook: async (image: any, callback: any) => {
						console.log('image: ', image);
						const uploadedImageURL = await uploadImage(image);
						callback(uploadedImageURL);
						return false;
					},
				}}
				events={{
					load: function (param: any) {},
				}}
			/>
				</Box>
			</Stack>

			{/* Submit Button */}
			<Stack className="submit-section">
				<Button
					variant="contained"
					className="submit-btn"
					onClick={handleRegisterButton}
					endIcon={<SendIcon />}
				>
					Publish Article
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;
