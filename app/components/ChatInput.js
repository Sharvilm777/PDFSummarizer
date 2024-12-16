'use client';

const ChatInput = ({ 
  query, 
  setQuery, 
  handleSend, 
  isLoading 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto p-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <textarea
              className="w-full p-2 text-sm rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Ask a question..."
              rows={1}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
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
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
