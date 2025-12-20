import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
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

	// Reset when modal opens/closes
	useEffect(() => {
		if (!open) {
			setQuestion('');
			setAnswer('');
			setLoading(false);
		}
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	if (!open) return null;

	return (
		<div className="ai-chat-overlay" onClick={onClose}>
			<div className="ai-chat-modal" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<Box className="ai-chat-header" component="div">
					<h3>Ask AI</h3>
					<button className="ai-chat-close-btn" onClick={onClose} aria-label="Close">
						<CloseIcon />
					</button>
				</Box>

				{/* Answer Area */}
				<Box className="ai-chat-answer" component="div" ref={answerRef}>
					{loading ? (
						<div className="ai-chat-loading">
							<CircularProgress size={24} />
							<span>Thinking...</span>
						</div>
					) : answer ? (
						<div className="ai-chat-text">{answer}</div>
					) : (
						<div className="ai-chat-placeholder">
							Ask anything about interiors, projects, agencies, and more...
						</div>
					)}
				</Box>

				{/* Input Area */}
				<form className="ai-chat-input-area" onSubmit={handleSubmit}>
					<textarea
						className="ai-chat-textarea"
						placeholder="Ask anything about interiors, projects, agencies…"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={3}
						disabled={loading}
					/>
					<button
						type="submit"
						className="ai-chat-send-btn"
						disabled={loading || !question.trim()}
						aria-label="Send message"
					>
						<SendIcon />
					</button>
				</form>
			</div>
		</div>
	);
};

export default AIChat;
