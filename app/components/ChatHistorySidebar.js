'use client';

import { useState } from 'react';

export default function ChatHistorySidebar({ isDarkMode, chatHistory, onSelectChat }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div 
            className={`${
                isOpen ? 'w-64' : 'w-16'
            } transition-all duration-300 border-r ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } h-full relative flex flex-col`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute -right-3 top-4 p-1.5 rounded-full shadow-lg ${
                    isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
                }`}
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                    />
                </svg>
            </button>

            {/* Header */}
            <div className={`p-4 ${!isOpen && 'hidden'}`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Chat History
                </h2>
            </div>

            {/* Chat List */}
            <div className={`flex-1 overflow-y-auto ${!isOpen && 'hidden'}`}>
                <div className="space-y-2 p-3">
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            onClick={() => onSelectChat && onSelectChat(index)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                isDarkMode 
                                    ? 'hover:bg-gray-800 text-gray-300' 
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <p className="text-sm line-clamp-2">
                                {chat.type === 'user' ? chat.content : 'AI Response'}
                            </p>
                            <span className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
