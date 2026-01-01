import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Slide,
  Divider,
  Chip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useThemeContext } from '../context/ThemeContext';

// Extend Window interface for Puter.js
declare global {
  interface Window {
    puter?: {
      ai?: {
        chat: (message: string, options?: { model?: string; stream?: boolean }) => Promise<any>;
      };
    };
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const { isDarkMode, colors } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Helper function to extract text from various response formats
  const extractTextFromResponse = (response: any): string => {
    if (typeof response === 'string') {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return 'I apologize, but I couldn\'t process that request. Please try again.';
    }

    // Handle Puter.js format: {index, message: {role, content, refusal, annotations}, finish_reason, usage, via_ai_chat_service}
    if (response.message && typeof response.message === 'object') {
      if (response.message.content) {
        // Content is a string
        if (typeof response.message.content === 'string') {
          return response.message.content;
        }
        // Content is an array (common in chat APIs)
        if (Array.isArray(response.message.content)) {
          // Extract text from array items
          const textParts = response.message.content
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                return item.text || item.content || item.type || '';
              }
              return String(item);
            })
            .filter((text: string) => text.trim().length > 0);
          return textParts.join(' ').trim();
        }
        // Content is an object
        if (typeof response.message.content === 'object') {
          return response.message.content.text || response.message.content.content || JSON.stringify(response.message.content);
        }
        // Fallback
        return String(response.message.content);
      }
    }

    // Handle direct content format: {role, content, refusal, annotations}
    if (response.content !== undefined && response.content !== null) {
      // Content is a string
      if (typeof response.content === 'string') {
        return response.content;
      }
      // Content is an array (common in chat APIs)
      if (Array.isArray(response.content)) {
        // Extract text from array items
        const textParts = response.content
          .map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              return item.text || item.content || item.type || '';
            }
            return String(item);
          })
          .filter((text: string) => text.trim().length > 0);
        return textParts.join(' ').trim();
      }
      // Content is an object
      if (typeof response.content === 'object') {
        return response.content.text || response.content.content || response.content.message || JSON.stringify(response.content);
      }
      // Fallback
      return String(response.content);
    }

    // Try other common formats
    if (response.text && typeof response.text === 'string') {
      return response.text;
    }
    if (response.message && typeof response.message === 'string') {
      return response.message;
    }
    if (response.choices && Array.isArray(response.choices) && response.choices.length > 0) {
      const choice = response.choices[0];
      if (choice.message && choice.message.content) {
        return typeof choice.message.content === 'string' 
          ? choice.message.content 
          : extractTextFromResponse(choice.message.content);
      }
      if (choice.text) {
        return choice.text;
      }
    }

    // Last resort
    console.warn('Could not extract text from response:', JSON.stringify(response, null, 2));
    return 'I received an unexpected response format. Please try again.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if Puter.js is loaded
      if (!window.puter || !window.puter.ai) {
        throw new Error('Puter.js is not loaded. Please refresh the page.');
      }

      // Create a context-aware prompt for coffee shop
      const contextPrompt = `You are a helpful AI assistant for Cafert, a coffee shop. 
      Help customers with questions about our menu, orders, reservations, and general inquiries.
      Be friendly, concise, and helpful. Here's the user's question: ${userMessage.text}`;

      // Call Puter AI
      const response = await window.puter.ai.chat(contextPrompt, {
        model: 'gpt-5.2-chat',
      });

      console.log('Puter.js response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');

      // Extract text from response using helper function
      let responseText = extractTextFromResponse(response);
      
      // Ensure responseText is always a string and not empty
      if (typeof responseText !== 'string') {
        console.error('Response text is not a string:', responseText);
        responseText = 'I apologize, but I couldn\'t process that request. Please try again.';
      }
      
      // Clean up the response text
      responseText = responseText.trim();
      if (!responseText) {
        responseText = 'I apologize, but I received an empty response. Please try again.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // Handle different error types
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (error.message) {
        const errorMsg = error.message.toLowerCase();
        
        // Rate limit errors
        if (errorMsg.includes('rate limit') || errorMsg.includes('too many requests') || errorMsg.includes('quota')) {
          setIsRateLimited(true);
          errorMessage = 'You\'ve reached the message limit. Please try again in a few minutes.';
          setRateLimitMessage('Message limit reached. Please wait a few minutes before trying again.');
          
          // Auto-reset rate limit after 5 minutes
          setTimeout(() => {
            setIsRateLimited(false);
            setRateLimitMessage('');
          }, 5 * 60 * 1000); // 5 minutes
        }
        // Authentication errors
        else if (errorMsg.includes('auth') || errorMsg.includes('login') || errorMsg.includes('unauthorized')) {
          errorMessage = 'Authentication required. Please refresh the page and try again.';
        }
        // Network errors
        else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        // Puter.js not loaded
        else if (errorMsg.includes('puter') && errorMsg.includes('not loaded')) {
          errorMessage = 'AI service is not available. Please refresh the page.';
        }
        // Use the actual error message if it's user-friendly
        else if (error.message.length < 100) {
          errorMessage = error.message;
        }
      }
      
      // Check response status codes
      if (error.response) {
        const status = error.response.status;
        if (status === 429) {
          setIsRateLimited(true);
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          setRateLimitMessage('Rate limit reached. Please wait a few minutes before trying again.');
          
          // Auto-reset rate limit after 5 minutes
          setTimeout(() => {
            setIsRateLimited(false);
            setRateLimitMessage('');
          }, 5 * 60 * 1000); // 5 minutes
        } else if (status === 401 || status === 403) {
          errorMessage = 'Authentication required. Please refresh the page.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: isOpen ? '420px' : '24px',
          right: '24px',
          zIndex: 1000,
          transition: 'bottom 0.3s ease',
        }}
      >
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: colors.accent,
            color: '#fff',
            boxShadow: `0 4px 20px ${colors.shadow}`,
            '&:hover': {
              backgroundColor: colors.accentDark,
              boxShadow: `0 6px 25px ${colors.shadow}`,
            },
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </motion.div>

      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 400 },
            height: 450,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            backgroundColor: isDarkMode ? colors.surface : colors.paper,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: colors.accent,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#fff',
                  color: colors.accent,
                }}
              >
                <BotIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI Assistant
              </Typography>
            </Box>
            <Chip
              label={isRateLimited ? "Limited" : "Online"}
              size="small"
              sx={{
                backgroundColor: isRateLimited 
                  ? 'rgba(255, 152, 0, 0.8)' 
                  : 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '0.7rem',
              }}
            />
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              backgroundColor: isDarkMode ? colors.background : colors.surface,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: isDarkMode ? colors.surface : colors.background,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: colors.border,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: colors.accent,
                },
              },
            }}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor:
                        message.sender === 'user'
                          ? colors.accent
                          : isDarkMode
                          ? colors.surface
                          : colors.paper,
                      color: '#fff',
                      boxShadow: `0 2px 8px ${colors.shadowLight}`,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-word',
                        color: '#fff !important',
                      }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.65rem',
                        color: '#fff !important',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: isDarkMode ? colors.surface : colors.paper,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} sx={{ color: colors.accent }} />
                  <Typography variant="caption" sx={{ color: '#fff' }}>
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Rate Limit Warning */}
          {isRateLimited && rateLimitMessage && (
            <Box
              sx={{
                p: 1.5,
                mx: 2,
                mb: 1,
                backgroundColor: colors.warning + '20',
                border: `1px solid ${colors.warning}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: '#fff', flex: 1 }}>
                ⚠️ {rateLimitMessage}
              </Typography>
            </Box>
          )}

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              backgroundColor: isDarkMode ? colors.surface : colors.paper,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={3}
              placeholder={isRateLimited ? "Message limit reached. Please wait..." : "Type your message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isRateLimited}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? colors.background : colors.surface,
                  color: colors.text,
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.accent,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  opacity: 1,
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isRateLimited}
              sx={{
                backgroundColor: colors.accent,
                color: '#fff',
                '&:hover': {
                  backgroundColor: colors.accentDark,
                },
                '&:disabled': {
                  backgroundColor: colors.border,
                  color: colors.textSecondary,
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default AIChatbot;

