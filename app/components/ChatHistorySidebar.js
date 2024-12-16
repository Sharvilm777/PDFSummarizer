'use client';

import { useState, useEffect } from 'react';
import '../scroller.css'; // Importing custom CSS for scrollbar styles

export default function ChatHistorySidebar({ 
    isDarkMode, 
    chatSessions, 
    currentSessionId, 
    onSelectSession, 
    onNewChat, 
    isSidebarVisible, 
    setIsSidebarVisible 
}) {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-16 left-0 h-[85%] transform transition-transform duration-300 m-1 ease-in-out z-50 ${
                    isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
                }`}
                onMouseEnter={() => setIsSidebarVisible(true)}
                onMouseLeave={() => setIsSidebarVisible(false)}
            >
                <div className={`w-50 sm:w-64 h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg flex flex-col custom-scrollbar overflow-y-auto`}>
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onNewChat}
                            className={`w-full px-4 py-2 rounded-lg ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                        >
                            New Chat
                        </button>
                    </div>

                    {/* Chat Sessions */}
                    <div className="flex-1 custom-scrollbar overflow-y-auto h-full">
                        {chatSessions?.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                    session.id === currentSessionId
                                        ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                                        : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                                }`}
                            >
                                <div className="truncate">
                                    {session.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invisible overlay to close sidebar when clicking outside */}
            {isSidebarVisible && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarVisible(false)}
                />
            )}
        </>
    );
}
