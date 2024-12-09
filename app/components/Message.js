
"use client";
const Message = ({ message, isDarkMode, setIsPdfVisible, onAddHighlight }) => {
  if (message.type === 'user') {
    return (
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className={`flex-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <p className={`text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {message.content.answer}
          </p>

          {message.content.highlightText && (
            <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 border-indigo-500`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Found on page {message.content.pageNumber}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() =>{
                onAddHighlight( message.content.pageNumber,message.content.highlightText);
                setIsPdfVisible(true);
              }
              }
              className={`text-xs px-3 py-1 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors inline-flex items-center gap-1`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View in PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
