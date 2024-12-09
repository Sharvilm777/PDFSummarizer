'use client';

const ChatInput = ({ 
  isDarkMode, 
  pdfFile, 
  query, 
  setQuery, 
  handleKeyPress, 
  handleSend, 
  isLoading 
}) => {
  return (
    <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
      <div className="max-w-screen-xl mx-auto p-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              className={`w-full p-2 text-sm rounded border ${
                isDarkMode 
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-200 focus:border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                !pdfFile ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder={pdfFile ? "Ask about the PDF..." : "Upload a PDF to start chatting"}
              rows={1}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!pdfFile}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!query.trim() || isLoading}
            className={`p-2 rounded-full ${
              query.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400'
            } disabled:cursor-not-allowed transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
