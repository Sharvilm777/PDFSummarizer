'use client';

import React from 'react';
import '../scroller.css';// Importing custom CSS for scrollbar styles

const Message = ({ message, isDarkMode }) => {
  if (!message || !message.content) {
    return null;
  }

  return (
    <div className={`message ${message.type} ${isDarkMode ? 'dark' : ''} `}>  
      <div className=" h-full">
        {message.type === 'user' ? (
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} shadow-sm`}> 
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-indigo-50'} shadow-sm`}> 
                <p className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{message.content.answer || 'No answer provided'}</p>

                {message.content.pages && Object.entries(message.content.pages).map(([pageNum, pageData]) => (
                  <div key={pageNum} className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border-l-4 border-indigo-500`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Found on page {pageNum}:
                    </p>
                    {pageData.quotes.map((quote, idx) => (
                      <p key={idx} className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} pl-2 border-l-2 border-gray-300`}>
                        "{quote}"
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
