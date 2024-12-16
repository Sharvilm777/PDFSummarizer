'use client';

const Navbar = ({ isDarkMode, setIsDarkMode, setIsSidebarVisible }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div 
            className="group relative flex items-center"
            onMouseEnter={() => setIsSidebarVisible(true)}
            onMouseLeave={() => setIsSidebarVisible(false)}
          >
            {/* Invisible extended hover area */}
            <div className="absolute -left-4 -top-4 w-[300px] h-24 z-40" />
            
            <span className={`text-xl font-semibold text-gray-800 dark:text-white cursor-pointer group-hover:text-indigo-600 transition-colors`}>
              PDF Summarizer
            </span>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
