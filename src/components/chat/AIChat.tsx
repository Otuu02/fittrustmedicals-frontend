// src/components/chat/AIChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Clock,
  CheckCheck,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
}

// AI Response templates
const aiResponses = {
  greeting: "Hello! 👋 I'm your AI assistant. How can I help you with medical equipment today?",
  products: "We have a wide range of medical equipment including diagnostic tools, PPE, hospital furniture, and lab equipment. What specific product are you looking for?",
  shipping: "We offer free shipping on orders over ₦50,000. Delivery takes 3-5 business days for standard shipping, or 1-2 days for express delivery in major cities.",
  returns: "We have a 7-day return policy for unused items in original packaging. Would you like to initiate a return?",
  payment: "We accept credit/debit cards, bank transfers, and pay on delivery in selected locations.",
  support: "Our support team is available 24/7. You can also email us at support@fittrustmedical.com or call +234 123 456 7890.",
  order: "You can track your order in the 'My Orders' section after logging into your account.",
  price: "Our prices are competitive and we offer volume discounts for bulk purchases. Contact our sales team for special pricing.",
  warranty: "Most of our products come with manufacturer warranty. Check the product specifications for warranty details.",
  default: "Thank you for your question. Our team will get back to you shortly. For urgent matters, please call our support line."
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: aiResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return aiResponses.greeting;
    }
    if (lowerMsg.includes('product') || lowerMsg.includes('equipment') || lowerMsg.includes('item')) {
      return aiResponses.products;
    }
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery') || lowerMsg.includes('deliver')) {
      return aiResponses.shipping;
    }
    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return aiResponses.returns;
    }
    if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('card')) {
      return aiResponses.payment;
    }
    if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
      return aiResponses.order;
    }
    if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      return aiResponses.price;
    }
    if (lowerMsg.includes('warranty')) {
      return aiResponses.warranty;
    }
    if (lowerMsg.includes('support') || lowerMsg.includes('help')) {
      return aiResponses.support;
    }
    
    return aiResponses.default;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px',
              width: isMinimized ? '300px' : '380px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 ${
              isMinimized ? 'h-auto' : 'h-[500px]'
            } w-[380px]`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Support Assistant</h3>
                  <p className="text-xs text-blue-100">Online • 24/7</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded transition"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[380px] bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'bot' && (
                            <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.sender === 'user' && message.status === 'sent' && (
                                <CheckCheck className="w-3 h-3 opacity-70" />
                              )}
                            </div>
                          </div>
                          {message.sender === 'user' && (
                            <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Buttons */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['Products', 'Shipping', 'Returns', 'Payment', 'Track Order'].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setInputText(`Tell me about ${topic.toLowerCase()}`);
                          setTimeout(() => sendMessage(), 100);
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition whitespace-nowrap"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Powered by AI • Responses are automated
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}