'use client';

const HighlightedPages = ({ pages, isDarkMode }) => {
    if (!pages) return null;

    return (
        <div className="flex flex-col gap-4 p-4">
            {Object.entries(pages).map(([pageNum, pageData]) => (
                <div 
                    key={pageNum}
                    className={`rounded-lg p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                    } shadow-lg`}
                >
                    <div className="mb-2">
                        <h3 className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Page {pageNum}
                        </h3>
                        <div className={`mt-2 text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            {pageData.quotes.map((quote, idx) => (
                                <div key={idx} className="mb-2 p-2 rounded bg-opacity-50 border-l-4 border-yellow-400">
                                    "{quote}"
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <img
                            src={`data:image/png;base64,${pageData.highlighted_image}`}
                            alt={`Highlighted content from page ${pageNum}`}
                            className="w-full rounded-lg shadow-md"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HighlightedPages;
