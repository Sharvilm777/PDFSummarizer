'use client';

import { useState, useEffect, useRef } from 'react';
import Message from './components/Message';
import Navbar from './components/Navbar';
import ChatInput from './components/ChatInput';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import ImageViewer from './components/ImageViewer';
import "./scroller.css";

export default function Home() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Initialize with a new session
    handleNewChat();
  }, []);

  const handleImageUpdate = (imageUrl) => {
    setImages(prev => [...prev, imageUrl]);
    setCurrentImageIndex(prev => prev + 1);
    if (!isContentVisible) {
      setIsContentVisible(true);
    }
  };

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      name: 'New Chat'
    };
    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setChatHistory([]);
    setImages([]);
    setCurrentImageIndex(0);
  };

  const handleSelectSession = (sessionId) => {
    if (!sessionId) return;
    setCurrentSessionId(sessionId);
    setChatHistory([]);
    setImages([]);
    setCurrentImageIndex(0);
  };

  const handleSend = async () => {
    if (!query.trim() || !currentSessionId) return;

    const newMessage = { type: 'user', content: query };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('http://164.52.214.201:8000/query-pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: query
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Get all quotes from the pages
      const allQuotes = [];
      if (data.pages) {
        Object.values(data.pages).forEach(page => {
          if (page.quotes && Array.isArray(page.quotes)) {
            allQuotes.push(...page.quotes);
          }
        });
      }
      console.log(data.pages);
      
      // Update chat history with AI response
      const aiMessage = {
        type: 'ai',
        content: {
          answer: data.response,
          pageNumber: data.page_number,
          highlightText: allQuotes.join('\n')
        }
      };
      
      setChatHistory([...updatedHistory, aiMessage]);
      
      // Handle multiple highlighted images
      if (data.pages) {
        Object.values(data.pages).forEach(page => {
          if (page.highlighted_image) {
            const imageUrl = `data:image/png;base64,${page.highlighted_image}`;
            setImages(prevImages => [...prevImages, imageUrl]);
            // Set current index to the newly added image
            setCurrentImageIndex(images.length);
          }
        });
      }
      
      // Update sessions if needed
      if (data.sessions) {
        setChatSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error:', error);
      setChatHistory([
        ...updatedHistory,
        { 
          type: 'ai', 
          content: { 
            answer: 'Sorry, there was an error processing your request.' 
          } 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <ChatHistorySidebar 
        isDarkMode={isDarkMode}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      <div className="flex-1 flex flex-col">
        <Navbar 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsSidebarVisible={setIsSidebarVisible}
        />

        <div className="flex-1 flex overflow-hidden pt-16 relative">
          {/* Chat Messages Section */}
          <div className={`flex flex-col ${isContentVisible ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {chatHistory && chatHistory.map((message, index) => (
                <Message 
                  key={index}
                  message={message}
                  isDarkMode={isDarkMode}
                />
              ))}
              {isLoading && (
                <div className="flex justify-center items-center p-4">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ChatInput 
                query={query}
                setQuery={setQuery}
                handleSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Image Display Section */}
          <div className={`${isContentVisible ? 'w-1/2' : 'w-0'} transition-all duration-300 relative h-[calc(100vh-4rem)]`}>
            {/* Toggle Button for Image Section */}
            <button
              onClick={() => setIsContentVisible(!isContentVisible)}
              className={`absolute -left-10 top-2 z-10 p-2 rounded-full shadow-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110`}
            >
              <svg 
                className={`w-5 h-5 text-gray-600 dark:text-gray-200 transform transition-transform duration-300 ${
                  isContentVisible ? 'rotate-0' : 'rotate-180'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {isContentVisible && (
              <div className="absolute inset-0 border-l border-gray-200 dark:border-gray-700">
                <ImageViewer 
                  images={images}
                  currentIndex={currentImageIndex}
                  setCurrentIndex={setCurrentImageIndex}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
