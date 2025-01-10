"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {  AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const CompilerPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleIframeLoad = () => {
    setLoading(false); 
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col min-h-screen font-sans bg-gray-950 text-gray-100">
     

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Compiler</h1>
          <p className="text-gray-400">Use the compiler below to test and run your code directly in the browser.</p>

          {isMobile && (
            <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 mb-4 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                For the best experience, we recommend using the compiler on a desktop device. Mobile devices may have limited functionality.
              </p>
            </div>
          )}

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
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} CodeNow. All rights reserved.</p>
        <Link href="https://onecompiler.com/" target="_blank" className="text-slate-600 font-mono hover:text-white transition-colors duration-300">
          Powered By OneCompiler
        </Link>
      </footer>
    </div>
    </>
  );
};

export default CompilerPage;

