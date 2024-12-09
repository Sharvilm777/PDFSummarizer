'use client';

import { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Message from './components/Message';
import Navbar from './components/Navbar';
import PDFViewer from './components/PDFViewer';
import ChatInput from './components/ChatInput';
import ChatHistorySidebar from './components/ChatHistorySidebar';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isPdfVisible, setIsPdfVisible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    }
  }, [isDarkMode, mounted]);

  useEffect(() => {
    return () => {
      if (pdfFile) {
        fetch('http://localhost:5000/api/cleanup', {
          method: 'POST'
        }).catch(console.error);
      }
    };
  }, [pdfFile]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file ? {
      name: file.name,
      type: file.type,
      size: file.size
    } : 'No file');

    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setError(null);
      
      console.log('Preparing to upload PDF file...');
      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Making API request to /api/upload...');
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);
        if (!response.ok) throw new Error('Failed to upload PDF');

        const data = await response.json();
        console.log('Upload response data:', data);

        setPdfFile(URL.createObjectURL(file));
        setFileName(file.name);
        setIsUploading(false);
        console.log('File upload completed successfully');
      } catch (err) {
        console.error('Error in handleFileChange:', err);
        setError('Failed to upload PDF: ' + err.message);
        setIsUploading(false);
      }
    } else if (file) {
      console.warn('Invalid file type:', file.type);
    }
  };

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    console.log('Sending query:', query);
    const newMessage = { type: 'user', content: query };
    setChatHistory([...chatHistory, newMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      console.log('Making API request to /api/question...');
      const response = await fetch('http://localhost:5000/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      console.log('API Response status:', response.status);
      if (!response.ok) throw new Error('Failed to get answer');

      const data = await response.json();
      console.log('API Response data:', data);
      
      const aiMessage = {
        type: 'ai',
        content: {
          answer: data.answer,
          highlightText: data.matches[0]?.text,
          pageNumber: data.matches[0]?.pageNumber
        }
      };
      console.log('Formatted AI message:', aiMessage);

      setChatHistory(prev => [...prev, aiMessage]);
      if (data?.highlightText && data?.pageNumber) {
        console.log('Setting highlights with:', {
          pageNumber: data?.pageNumber,
          text: data?.highlightText
        });
        setHighlights([{
          pageNumber: data.matches[0]?.pageNumber,
          text: data.matches[0]?.highlightText,
          position: {
            top: 0,
            left: 0,
            width: '100%',
            height: '30px'
          }
        }]);
      }
    } catch (err) {
      console.error('Error in handleSend:', err);
      setError('Failed to get answer: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddHighlight = (pageNumber, text) => {

    setHighlights((prev) => [
      ...prev,
      {
        pageNumber,
        text,
        position: null, // Optional: You can calculate or provide specific position details if needed.
      },
    ]);

    console.log(highlights)
  };
  

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isUploading={isUploading}
        handleFileChange={handleFileChange}
        fileName={fileName}
        error={error}
      />

      <div className="flex pt-16 h-screen">
        {/* Chat History Sidebar */}
        <ChatHistorySidebar 
          isDarkMode={isDarkMode}
          chatHistory={chatHistory}
          onSelectChat={(index) => {
            // You can implement chat selection functionality here
            console.log('Selected chat:', index);
          }}
        />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Section - Chat Interface */}
          <div className={`${isPdfVisible ? 'w-1/2' : 'w-full'} transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col relative`}>
            {/* Toggle PDF Button */}
            <button
              onClick={() => setIsPdfVisible(!isPdfVisible)}
              className={`absolute right-4 top-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg z-10`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isPdfVisible ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>

            {/* Chat Section */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {error && (
                <div className={`p-3 rounded ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-500'}`}>
                  {error}
                </div>
              )}
              {chatHistory.map((message, index) => (
                <Message 
                  key={index} 
                  message={message} 
                  isDarkMode={isDarkMode}
                  setIsPdfVisible={setIsPdfVisible}
                  onAddHighlight={handleAddHighlight}
                />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                  </div>
                  <div className="flex-1 p-2 rounded bg-gray-50">
                    <div className="animate-pulse flex space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ChatInput 
              isDarkMode={isDarkMode}
              pdfFile={pdfFile}
              query={query}
              setQuery={setQuery}
              handleKeyPress={handleKeyPress}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </div>
              
          <PDFViewer 
            pdfFile={pdfFile}
            isPdfVisible={isPdfVisible}
            isDarkMode={isDarkMode}
            setNumPages={setNumPages}
            highlights={highlights}
          />
        </div>
      </div>
    </div>
  );
}
