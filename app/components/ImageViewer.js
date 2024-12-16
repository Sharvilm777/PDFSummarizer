'use client';
import '../scroller.css';
import { useState, useEffect } from 'react';

const ImageViewer = ({ images, currentIndex, setCurrentIndex }) => {
    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
    };

    return (
        <div className="relative h-full overflow-y-auto bg-white dark:bg-gray-900 custom-scrollbar">
            {images.length > 0 && (
                <>
                    <div className="flex items-center justify-center p-4">
                        <img 
                            src={images[currentIndex]} 
                            alt={`Highlighted content ${currentIndex + 1}`}
                            className=" object-contain"
                        />
                    </div>
                    
                    {/* Navigation Controls */}
                    <div className="relative bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 bg-black/50 px-4 py-2 rounded-full z-10">
                            <button 
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    currentIndex === 0 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-white/10 hover:scale-110'
                                }`}
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            <span className="text-white text-sm min-w-[4rem] text-center">
                                {currentIndex + 1} / {images.length}
                            </span>
                            
                            <button 
                                onClick={handleNext}
                                disabled={currentIndex === images.length - 1}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    currentIndex === images.length - 1 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-white/10 hover:scale-110'
                                }`}
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                </>
            )}
            
            {images.length === 0 && (
                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                    Ask a question to see highlighted content
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
