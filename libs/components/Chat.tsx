import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CloseIcon from '@mui/icons-material/Close';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import AIChat from './AIChat';

// NewMessage component removed - not used anymore

interface MessagePayload {
	event: string;
	text: string;
	senderId?: string | null;
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
		if (typeof window === 'undefined') return;
		if (!socket) return;
		
		const handleMessage = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);
				console.log('Received data:', data);
				switch (data.event) {
					case "info": 
						const newInfo: InfoPayload = data;
						setOnlineUsers(newInfo.totalClients);
						break;
					case "getMessages": 
						const list: MessagePayload[] = data.list || [];
						setMessagesList(list);
						break;
					case "message": 
						const newMessage: MessagePayload = data;
						setMessagesList(prev => [...prev, newMessage]);
						break;
				}
			} catch (err) {
				console.error('Error parsing message:', err);
			}
		};
		
		socket.onmessage = handleMessage;
		
		return () => {
			if (socket.onmessage === handleMessage) {
				socket.onmessage = null;
			}
		};
	}, [socket]);

	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [messagesList]);

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

	const getInputMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageInput(e.target.value);
	};

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
		if (!messageInput.trim()) {
			sweetErrorAlert(Messages.error4);
			return;
		}

		if (!socket || socket.readyState !== WebSocket.OPEN) {
			sweetErrorAlert('WebSocket connection is not ready');
			return;
		}

		// Remove optimistic update - wait for backend response to avoid duplicates
		socket.send(messageInput);
		setMessageInput('');
	};

	const [isMinimized, setIsMinimized] = useState(false);

	return (
		<Stack className="chatting">
			{openButton && !open ? (
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
							<path 
								d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
								fill="white"
							/>
							<g opacity="0.95">
								<circle cx="17" cy="5" r="0.8" fill="white"/>
								<path d="M17 4L17 6M16 5L18 5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
							</g>
							<g opacity="0.85">
								<circle cx="7" cy="8" r="0.6" fill="white"/>
								<path d="M7 7.5L7 8.5M6.5 8L7.5 8" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
							</g>
						</svg>
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
			
			{open && (
				<Box className={`premium-chat-container ${isMinimized ? 'minimized' : ''}`}>
					{/* Header */}
					<Box className="premium-chat-header">
						<Box className="premium-chat-header-left">
							<Box className="premium-chat-header-title">
								Housen Support
							</Box>
							<Box className="premium-chat-online-status">
								<Box className="premium-chat-online-dot" />
								<Box className="premium-chat-online-text">
									Online
								</Box>
							</Box>
						</Box>
						<Box className="premium-chat-header-actions">
							<IconButton
								size="small"
								onClick={() => setIsMinimized(!isMinimized)}
								className="premium-chat-icon-btn"
							>
								<MinimizeIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => {
									setOpen(false);
									setIsMinimized(false);
								}}
								className="premium-chat-icon-btn"
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</Box>
					</Box>

					{!isMinimized && (
						<>
							{/* Messages Content */}
							<Box ref={chatContentRef} className="premium-chat-messages">
								<ScrollableFeed>
									{/* Welcome Message */}
									<Box className="premium-chat-welcome-message">
										<Box className="premium-chat-welcome-bubble">
											Hi 👋 Welcome to Housen messanger!
										</Box>
									</Box>

									{/* Messages List */}
									{messagesList.map((ele: MessagePayload, index: number) => {
										const { text, senderId, memberData } = ele;
										const isOwnMessage = senderId === user?._id || memberData?._id === user?._id;
										const memberImage = memberData?.memberImage
											? `${REACT_APP_API_URL}/${memberData.memberImage}`
											: '/img/profile/defaultUser.svg';

										return (
											<Box
												key={index}
												className={`premium-chat-message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'}`}
											>
												{!isOwnMessage && (
													<Avatar
														src={memberImage}
														alt={memberData?.memberNick || 'User'}
														className="premium-chat-message-avatar"
													/>
												)}
												<Box className={`premium-chat-message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
													{text}
												</Box>
											</Box>
										);
									})}
								</ScrollableFeed>
							</Box>

							{/* Input Area */}
							<Box className="premium-chat-input-area">
								<input
									type="text"
									className="premium-chat-input"
									placeholder="write a message…"
									value={messageInput}
									onChange={getInputMessageHandler}
									onKeyDown={getKeyHandler}
								/>
								<button
									onClick={onClickHandler}
									disabled={!messageInput.trim()}
									className="premium-chat-send-btn"
									type="button"
								>
									<SendIcon fontSize="small" />
								</button>
							</Box>
						</>
					)}
				</Box>
			)}
			<AIChat open={showAIChat} onClose={() => setShowAIChat(false)} />
		</Stack>
	);
};

export default Chat;
