'use client';
import { useState } from 'react';

export default function ChatHistory() {
    const [isOpen, setIsOpen] = useState(true);
    const [chatHistory, setChatHistory] = useState([
        { id: 1, question: "What is the main idea of this PDF?", timestamp: "2 mins ago" },
        { id: 2, question: "Can you summarize chapter 3?", timestamp: "5 mins ago" },
        // Add more mock data as needed
    ]);

    return (
        <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-72' : 'w-12'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-[-12px] top-4 bg-white border border-gray-200 rounded-full p-2 z-10"
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                    />
                </svg>
            </button>
            
            <div className={`h-full overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Chat History</h2>
                    <div className="space-y-3">
                        {chatHistory.map((chat) => (
                            <div
                                key={chat.id}
                                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                    {chat.question}
                                </p>
                                <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
