"use client";

import Link from 'next/link';
import { Code } from 'lucide-react';

const CompilerPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
        <Link className="flex items-center justify-center" href="/">
          <Code className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">CodeNow</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Compiler</h1>
          <p className="text-gray-400">Use the compiler below to test and run your code directly in the browser.</p>

          {/* IFrame for OneCompiler */}
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <iframe
              frameBorder="0"
              height="650px"
              src="https://onecompiler.com/embed/"
              width="100%"
              title="Online Compiler"
            ></iframe>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 CodeNow. All rights reserved.</p>
        <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">
          built with ♥
        </p>
      </footer>
    </div>
  );
};

export default CompilerPage;
