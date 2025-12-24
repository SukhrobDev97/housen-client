import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack, IconButton, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

interface AIChatProps {
	open: boolean;
	onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ open, onClose }) => {
	const [question, setQuestion] = useState<string>('');
	const [answer, setAnswer] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const answerRef = useRef<HTMLDivElement>(null);

	// Reset when panel opens/closes and prevent body scroll
	useEffect(() => {
		if (open) {
			// Prevent body scroll when panel is open
			document.body.style.overflow = 'hidden';
		} else {
			// Restore body scroll when panel is closed
			document.body.style.overflow = '';
			setQuestion('');
			setAnswer('');
			setLoading(false);
		}
		
		return () => {
			// Cleanup: restore body scroll on unmount
			document.body.style.overflow = '';
		};
	}, [open]);

	// Auto-scroll answer area when answer updates
	useEffect(() => {
		if (answer && answerRef.current) {
			answerRef.current.scrollTop = answerRef.current.scrollHeight;
		}
	}, [answer]);

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		
		if (!question.trim()) return;

		setLoading(true);
		setAnswer('');

		try {
			const response = await fetch('http://localhost:4000/api/ask-ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ question: question.trim() }),
			});

			if (!response.ok) {
				throw new Error('Failed to get AI response');
			}

			const data = await response.json();
			setAnswer(data.answer || data.response || 'No response received');
		} catch (error) {
			console.error('AI Chat Error:', error);
			setAnswer('Sorry, I encountered an error. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleSuggestedPrompt = (prompt: string) => {
		setQuestion(prompt);
		// Auto-submit - use the prompt directly to avoid async state issues
		setLoading(true);
		setAnswer('');
		
		fetch('http://localhost:4000/api/ask-ai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ question: prompt.trim() }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to get AI response');
				}
				return response.json();
			})
			.then((data) => {
				setAnswer(data.answer || data.response || 'No response received');
			})
			.catch((error) => {
				console.error('AI Chat Error:', error);
				setAnswer('Sorry, I encountered an error. Please try again later.');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	if (!open) return null;

	const suggestedPrompts = [
		'Modern living room ideas',
		'Best agencies for offices',
		'Interior trends 2025',
	];

	return (
		<>
			{/* Backdrop */}
			<Box onClick={onClose} className="ai-chat-backdrop" />

			{/* AI Panel */}
			<Box onClick={(e: any) => e.stopPropagation()} className="ai-chat-panel">
				{/* Header */}
				<Box className="ai-chat-header">
					<Box>
						<Box className="ai-chat-header-title">Ask Housen AI</Box>
						<Box className="ai-chat-header-subtitle">Interior design assistant</Box>
					</Box>
					<IconButton onClick={onClose} size="small" className="ai-chat-close-btn">
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				{/* Content Area */}
				<Box ref={answerRef} className="ai-chat-content">
					{loading ? (
						<Box className="ai-chat-loading">
							<CircularProgress size={32} className="ai-chat-spinner" />
							<Box className="ai-chat-loading-text">Thinking...</Box>
						</Box>
					) : answer ? (
						<Box className="ai-chat-answer">{answer}</Box>
					) : (
						<Box className="ai-chat-empty-state">
							{/* Empty State Message */}
							<Box className="ai-chat-empty-message">
								Hi 👋 I'm Housen AI. Ask me anything about interiors, projects, or agencies.
							</Box>

							{/* Suggested Prompts */}
							<Box>
								<Box className="ai-chat-suggested-label">Try asking</Box>
								<Stack direction="column" spacing={1}>
									{suggestedPrompts.map((prompt, index) => (
										<Chip
											key={index}
											label={prompt}
											onClick={() => handleSuggestedPrompt(prompt)}
											className="ai-chat-prompt-chip"
										/>
									))}
								</Stack>
							</Box>
						</Box>
					)}
				</Box>

				{/* Input Area - Sticky at bottom */}
				<Box component="form" onSubmit={handleSubmit} className="ai-chat-input-area">
					<Box className="ai-chat-input-wrapper">
						<input
							type="text"
							className="ai-chat-input"
							placeholder="Ask about interiors, agencies, pricing…"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading || !question.trim()}
							className={`ai-chat-send-btn ${question.trim() && !loading ? 'active' : ''}`}
						>
							<SendIcon fontSize="small" />
						</button>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default AIChat;
