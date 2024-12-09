'use client';

import { useState } from 'react';

export default function ChatHistorySidebar({ isDarkMode, chatSessions, currentSessionId, onSelectSession, onNewChat }) {
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

            <div className={`flex flex-col h-full ${!isOpen && 'hidden'}`}>
                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={onNewChat}
                        className={`w-full p-3 rounded-lg flex items-center gap-2 ${
                            isDarkMode 
                                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Chat</span>
                    </button>
                </div>

                {/* Chat Sessions List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-1 p-2">
                        {chatSessions.map((session) => {
                            // Get the first message from the session to use as title
                            const firstMessage = session.messages[0]?.content || 'New Chat';
                            const title = firstMessage.length > 30 
                                ? firstMessage.substring(0, 30) + '...' 
                                : firstMessage;

                            return (
                                <button
                                    key={session.id}
                                    onClick={() => onSelectSession(session.id)}
                                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                                        session.id === currentSessionId
                                            ? isDarkMode 
                                                ? 'bg-gray-700 text-white'
                                                : 'bg-gray-200 text-gray-900'
                                            : isDarkMode
                                                ? 'text-gray-300 hover:bg-gray-800'
                                                : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="line-clamp-1">{title}</span>
                                    </div>
                                    <div className={`text-xs mt-1 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {session.messages.length} messages
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
