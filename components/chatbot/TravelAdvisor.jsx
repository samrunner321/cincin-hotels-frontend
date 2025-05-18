'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function TravelAdvisor({ initialMessage = "👋 Hi, I'm Cinci, your personal travel advisor. I can help you discover destinations, recommend hotels, or plan your next trip. What can I help you with today?" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
    "Recommend a mountain destination",
    "Best hotels in Swiss Alps?",
    "Family-friendly beach resorts",
    "Romantic getaway ideas"
  ]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Process user message and generate response
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      generateResponse(inputValue);
    }, 1000);
  };

  // Generate AI response based on user input
  const generateResponse = (userInput) => {
    let response;
    const lowerInput = userInput.toLowerCase();
    
    // Simple rule-based responses
    if (lowerInput.includes('mountain') || lowerInput.includes('alps')) {
      response = "The Alps are spectacular any time of year! For summer hiking, I'd recommend visiting Crans-Montana in Switzerland - it offers breathtaking views, excellent trails, and luxury accommodations like the Chetzeron Hotel, perched at 2,112m with panoramic vistas. Would you like more details about mountain destinations?";
    } 
    else if (lowerInput.includes('beach') || lowerInput.includes('sea')) {
      response = "For beach destinations, the Amalfi Coast in Italy offers a perfect blend of stunning coastlines, charming villages, and exquisite cuisine. The Santorini in Greece is another gem with its iconic white-washed buildings and crystal-clear waters. Can I help you explore specific beach properties in our collection?";
    }
    else if (lowerInput.includes('family') || lowerInput.includes('kid')) {
      response = "For families, I recommend our properties in South Tyrol, Italy. They offer spacious accommodations, kid-friendly activities, and are surrounded by nature. Many have dedicated children's programs and family suites. Would you like me to suggest specific family-friendly hotels?";
    }
    else if (lowerInput.includes('romantic') || lowerInput.includes('couple') || lowerInput.includes('honeymoon')) {
      response = "For a romantic getaway, the small boutique hotels in Santorini offer private terraces with breathtaking caldera views. In the Swiss Alps, the LeCrans Hotel & Spa features intimate suites with fireplaces and panoramic mountain vistas. Would you like more romantic destination ideas?";
    }
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      response = "Hello! I'm delighted to help with your travel plans. Are you looking for a specific destination or type of experience?";
    }
    else if (lowerInput.includes('thank')) {
      response = "You're very welcome! I'm always here to help with your travel planning. Is there anything else you'd like to know about our destinations or hotels?";
    }
    else if (lowerInput.includes('food') || lowerInput.includes('restaurant') || lowerInput.includes('culinary')) {
      response = "For culinary experiences, South Tyrol offers an incredible blend of Italian and Alpine cuisine with numerous Michelin-starred restaurants. Paris is always a classic choice for food lovers. Many of our properties feature exceptional dining experiences - would you like recommendations for hotels with outstanding restaurants?";
    }
    else {
      response = "That's a great question about " + userInput.split(' ').slice(0,3).join(' ') + "... Our collection includes unique properties across Europe's most beautiful destinations. Would you like me to suggest some options based on your interests? Or perhaps tell me what kind of experience you're looking for.";
    }

    // Create new suggestions based on conversation flow
    updateSuggestions(lowerInput);

    // Add AI response
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }]);
    
    setIsTyping(false);
  };

  // Update suggested questions based on conversation context
  const updateSuggestions = (userInput) => {
    let newSuggestions = [];
    
    if (userInput.includes('mountain') || userInput.includes('alps')) {
      newSuggestions = [
        "Tell me about luxury mountain hotels",
        "Best time to visit the Alps?",
        "Ski resorts in your collection",
        "Mountain activities in summer"
      ];
    } 
    else if (userInput.includes('beach') || userInput.includes('sea')) {
      newSuggestions = [
        "Show me Mediterranean boutique hotels",
        "Best Italian coastal towns",
        "Beach destinations for autumn",
        "Greek islands in your collection"
      ];
    }
    else if (userInput.includes('family')) {
      newSuggestions = [
        "Hotels with kids' activities",
        "Family suites availability",
        "Child-friendly restaurants",
        "Family excursions in South Tyrol"
      ];
    }
    else if (userInput.includes('food') || userInput.includes('restaurant')) {
      newSuggestions = [
        "Hotels with Michelin-starred dining",
        "Culinary destinations in Europe",
        "Wine regions to visit",
        "Cooking classes at your hotels"
      ];
    }
    else {
      newSuggestions = [
        "Unique hotel experiences",
        "Seasonal travel recommendations",
        "Hotels with exceptional views",
        "Wellness and spa destinations"
      ];
    }
    
    setSuggestions(newSuggestions);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Format time for message timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 bg-brand-olive-400 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-olive-500 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-[90vw] sm:w-[400px] max-w-lg h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Chat Header */}
            <div className="p-4 bg-brand-olive-400 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="CinCin Advisor"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Travel Advisor</h3>
                  <p className="text-xs text-white/80">CinCin Hotels AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user' 
                          ? 'bg-brand-olive-400 text-white rounded-tr-none' 
                          : 'bg-white shadow-sm border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white shadow-sm border border-gray-100 rounded-tl-none">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-300"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-300"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gray-300"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-400/50 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-brand-olive-400 text-white p-2.5 rounded-full disabled:opacity-50"
                  disabled={!inputValue.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Powered by AI • CinCin Hotels Travel Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}