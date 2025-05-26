import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import axios from 'axios';
import '../../styles/components/posts/ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m the Blog AI Assistant. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: 'Create Post', value: 'How do I create a new blog post?' },
    { text: 'Topics', value: 'What topics are available?' },
    { text: 'Features', value: 'What interaction features are available?' },
    { text: 'Account', value: 'How do I manage my account?' },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: inputMessage
    }]);

    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: inputMessage
      });

      if (response.data.answer) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: response.data.answer,
          confidence: response.data.confidence
        }]);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsTyping(false);
      setInputMessage('');
    }
  };

  const handleQuickReply = (value) => {
    setInputMessage(value);
    handleSendMessage();
  };

  return (
    <div className="chatbot-fixed-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
      >
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        <MessageSquare className="w-5 h-5" />
        <span>Help</span>
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Blog Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Replies */}
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply.value)}
                className="quick-reply-button"
              >
                {reply.text}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-container ${message.type === 'user' ? 'user' : 'bot'}`}
              >
                <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                  {message.content}
                  {message.confidence && (
                    <div className="confidence-score">
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-container bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                className="chat-send-button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;