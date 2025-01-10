"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

const CompilerPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    setLoading(false); 
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-950 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-800">
        <Link className="flex items-center justify-center" href="/">
          <Terminal className="h-6 w-6 mr-2 text-blue-500" />
          <span className="font-bold text-xl">CodeNow</span>
        </Link>
        <a
          href="https://github.com/krishvsoni/CodeNow" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-blue-500 hover:text-blue-400 transition-colors"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
              clipRule="evenodd"
            />
          </svg>
          CodeNow
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Compiler</h1>
          <p className="text-gray-400">Use the compiler below to test and run your code directly in the browser.</p>

          <div className="relative border border-gray-800 rounded-lg overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950 opacity-75">
                <div className="w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <iframe
              frameBorder="0"
              height="650px"
              src="https://onecompiler.com/embed/"
              width="100%"
              title="Online Compiler"
              onLoad={handleIframeLoad} 
            ></iframe>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-sm text-gray-400">© 2024 CodeNow. All rights reserved.</p>
        <Link href="https://onecompiler.com/" target="_blank" className="text-slate-600 font-mono hover:text-white transition-colors duration-300">
          Powered By OneCompiler
        </Link>
      </footer>
    </div>
  );
};

export default CompilerPage;
