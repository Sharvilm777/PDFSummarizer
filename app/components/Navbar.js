'use client';

const Navbar = ({ isDarkMode, setIsDarkMode, isUploading, handleFileChange, fileName, error, setIsSidebarVisible }) => {
  return (
    <div className={`fixed top-0 w-full z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Hover trigger area */}
            <div 
              className="group relative"
              onMouseEnter={() => setIsSidebarVisible(true)}
            >
              {/* Invisible extended hover area */}
              <div className="absolute -left-4 -top-4 w-[300px] h-24 z-40" 
                   onMouseEnter={() => setIsSidebarVisible(true)} />
              
              <div className="flex items-center gap-3">
                <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} cursor-pointer group-hover:text-indigo-600 transition-colors`}>
                  PDF Summarizer
                </span>
              </div>
            </div>
            <label className={`relative cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
              }`}>
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {fileName}
              </span>
            )}
            {error && (
              <span className="text-sm text-red-500">
                {error}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
