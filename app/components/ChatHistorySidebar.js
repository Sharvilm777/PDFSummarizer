'use client';

import { useState, useEffect } from 'react';

export default function ChatHistorySidebar({ isDarkMode, chatSessions, currentSessionId, onSelectSession, onNewChat, isSidebarVisible, setIsSidebarVisible }) {
    return (
        <div 
            className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-500 ease-in-out border-r ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} w-[200px] shadow-lg`}
            onMouseLeave={() => setIsSidebarVisible(false)}
        >
            {/* Add top spacing to account for navbar */}
            <div className="h-16 w-full flex items-center justify-center text-lg font-semibold">Chat History</div>
            
            <div className="flex flex-col h-[calc(100%-4rem)] overflow-hidden">
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
