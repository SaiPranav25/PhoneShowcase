import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Loader, Sparkles } from 'lucide-react';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your iPhone AI assistant powered by Google Gemini. I can help you with questions about iPhone features, specifications, pricing, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get API key from environment variables
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
      }

    
      const conversationHistory = messages.slice(-4).map(msg => 
        `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}`
      ).join('\n');

      const prompt = `You are an expert iPhone assistant. Help users with iPhone-related questions including features, specifications, pricing, comparisons, and troubleshooting. Be helpful, concise, and friendly. Keep responses to 2-3 sentences unless more detail is requested.

Previous conversation:
${conversationHistory}

User: ${currentInput}

Please respond as the iPhone assistant:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('No response generated');
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.candidates[0].content.parts[0].text,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorText = "I'm sorry, I'm having trouble connecting right now.";
      
      if (error.message.includes('API key')) {
        errorText = "Please configure your Google AI Studio API key in the .env file. Get one free at https://ai.google.dev";
      } else if (error.message.includes('quota')) {
        errorText = "API quota exceeded. Please check your Google AI Studio usage.";
      } else if (error.message.includes('blocked')) {
        errorText = "Response was blocked by safety filters. Please try rephrasing your question.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm your iPhone AI assistant powered by Google Gemini. I can help you with questions about iPhone features, specifications, pricing, and more. What would you like to know?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  const quickQuestions = [
    "What's new in iPhone 16 Pro?",
    "Compare iPhone models",
    "Battery life tips",
    "Camera features",
    "iPhone 16 vs iPhone 15"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Window */}
      <div className="relative w-full max-w-md h-[600px] bg-black/90 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
              <MessageCircle className="w-4 h-4 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">iPhone AI Assistant</h3>
              <p className="text-gray-400 text-xs">Powered by Future Tech</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="text-gray-400 hover:text-white transition-colors p-1 text-xs"
              title="Clear chat"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isBot
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-auto'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-2xl border border-gray-600">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Future Tech is thinking...</span>
                </div>
              </div>
            </div>
          )}


          {messages.length === 1 && !isLoading && (
            <div className="space-y-2">
              <p className="text-gray-400 text-xs px-2">Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="w-full text-left text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all border border-gray-700 hover:border-gray-600"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

      
        <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black">
          <div className="flex space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about iPhone..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-20"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Free tier: 15 requests/min • Powered by Future Tech
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;