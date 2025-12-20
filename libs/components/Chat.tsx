import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Badge from '@mui/material/Badge';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import AIChat from './AIChat';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<Box
				component={'div'}
				flexDirection={'row'}
				style={{ display: 'flex' }}
				alignItems={'flex-end'}
				justifyContent={'flex-end'}
				sx={{ m: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</Box>
		);
	} else {
		return (
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg-left'}></div>
			</Box>
		);
	}
};

interface MessagePayload {
	event: string;
	text: string;
	memberData?: Member | null;
  }
  
  interface InfoPayload {
	event: string;
	totalClients: number;
	memberData?: Member | null;
	action: string;
  }

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(4);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showAIChat, setShowAIChat] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar)
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!socket) return;
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			console.log('Received data:', data);
			switch (data.event) {
				case "info": 
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case "getMessages": 
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case "message": 
					const newMessage: MessagePayload = data;
					messagesList.push(newMessage);
					setMessagesList([...messagesList]);
					break;
			}
		}
	}, [socket, messagesList]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDropdown]);

	/** HANDLERS **/
	const handleButtonClick = () => {
		setShowDropdown((prev: boolean) => !prev);
	};

	const handleOnlineMessage = () => {
		setShowDropdown(false);
		setOpen(true);
	};

	const handleAskAI = () => {
		setShowDropdown(false);
		setShowAIChat(true);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if(!messageInput) sweetErrorAlert(Messages.error4);
		else{
			socket?.send(JSON.stringify({event: 'message', data: messageInput}));
			setMessageInput('');	
		}
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<div className="chat-button-wrapper" ref={dropdownRef}>
					<button className="chat-button" onClick={handleButtonClick} aria-label="AI Assistant">
						<svg 
							className="ai-chat-icon" 
							width="26" 
							height="26" 
							viewBox="0 0 24 24" 
							fill="none" 
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* Chat bubble */}
							<path 
								d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
								fill="white"
							/>
							{/* Sparkle 1 - top right */}
							<g opacity="0.95">
								<circle cx="17" cy="5" r="0.8" fill="white"/>
								<path d="M17 4L17 6M16 5L18 5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
							</g>
							{/* Sparkle 2 - small accent */}
							<g opacity="0.85">
								<circle cx="7" cy="8" r="0.6" fill="white"/>
								<path d="M7 7.5L7 8.5M6.5 8L7.5 8" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
							</g>
						</svg>
						{/* Online indicator dot */}
						<span className="chat-button-online-dot"></span>
					</button>
					{showDropdown && (
						<div className="chat-dropdown">
							<button className="chat-dropdown-item" onClick={handleOnlineMessage}>
								<MarkChatUnreadIcon />
								<span>Online Message</span>
							</button>
							<button className="chat-dropdown-item" onClick={handleAskAI}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
								</svg>
								<span>Ask AI</span>
							</button>
						</div>
					)}
				</div>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
						<span>Online Chat</span>
						<button 
							onClick={() => setOpen(false)} 
							style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
							aria-label="Close chat"
						>
							<CloseFullscreenIcon />
						</button>
					</div>
					<RippleBadge style={{margin: "-18px 0 0 21px"}} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
					<RippleBadge style={{margin: "-18px 0 0 21px"}} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</Box>
							{messagesList.map((ele: MessagePayload) =>{
								const {text, memberData} = ele;
								const memberImage = memberData?.memberImage 
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';

								return memberData?._id === user._id ? (
									<Box
									component={'div'}
									flexDirection={'row'}
									style={{ display: 'flex' }}
									alignItems={'flex-end'}
									justifyContent={'flex-end'}
									sx={{ m: '10px 0px' }}
								>
									<div className={'msg-right'}>{text}</div>
								</Box>
								) : (
									<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
									<Avatar alt={'jonik'} src={memberImage} />
									<div className={'msg-left'}>{text}</div>
								</Box>
								)
							})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
			<AIChat open={showAIChat} onClose={() => setShowAIChat(false)} />
		</Stack>
	);
};

export default Chat;
