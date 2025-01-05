'use client';
import { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Share2, Code } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce';
import LZString from 'lz-string';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { nanoid } from 'nanoid';

const socket = io('https://codenow-server-cfdhbwfbhad2hmb9.centralindia-01.azurewebsites.net');

const ShareCodePage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCode = LZString.decompressFromEncodedURIComponent(searchParams.get('code') || '') || '';
  const [sharedCode, setSharedCode] = useState(initialCode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const shortId = window.location.pathname.substring(1); 
    if (shortId) {
      const fetchCode = async () => {
        try {
          const response = await fetch(`https://codenow-server-cfdhbwfbhad2hmb9.centralindia-01.azurewebsites.net/api/getCode/${shortId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.code) {
              const decompressedCode = LZString.decompressFromEncodedURIComponent(data.code);
              setSharedCode(decompressedCode); // Set code in sharedCode state
            }
          } else {
            console.error("Code not found for the given short ID.");
            showToast("Code not found.");
          }
        } catch (error) {
          console.error('Error fetching code:', error);
          showToast("Failed to fetch code.");
        }
      };

      fetchCode();
    }

    const handleCodeUpdate = (newCode: string) => setSharedCode(newCode);
    const handleMessage = (message: string) => console.log(message);

    socket.on('codeUpdate', handleCodeUpdate);
    socket.on('message', handleMessage);

    return () => {
      socket.off('codeUpdate', handleCodeUpdate);
      socket.off('message', handleMessage);
    };
  }, []); 

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedCode);
    showToast("The code has been copied to your clipboard.");
  };

  const handleShare = async () => {
    try {
      const compressedCode = LZString.compressToEncodedURIComponent(sharedCode);

      const shortId = nanoid(8);

      await fetch('https://codenow-server-cfdhbwfbhad2hmb9.centralindia-01.azurewebsites.net/api/saveCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shortId, code: compressedCode }),
      });

      const shortUrl = `${window.location.origin}/${shortId}`;

      await navigator.clipboard.writeText(shortUrl);
      showToast('Share link copied to clipboard!');
    } catch (err) {
      console.error('Error:', err);
      showToast('Failed to create share link.');
    }
  };

  const debouncedEmitCodeChange = useRef(debounce((newCode: string) => {
    socket.emit('codeChange', { newCode, url: window.location.href });
    localStorage.setItem('sharedCode', newCode);
  }, 500)).current;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setSharedCode(newCode);
    debouncedEmitCodeChange(newCode);

    const textarea = e.target;
    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = newCode.substring(0, cursorIndex);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length + 1;

    setCursorPosition({ line: currentLine, column: currentColumn });
  };

  const lines = sharedCode.split('\n');
    return (
        <div className="flex flex-col min-h-screen  bg-gray-950 text-gray-100">
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

            <main className="flex-1 p-4 md:p-6 overflow-hidden">
                <div className="w-full max-w-6xl mx-auto space-y-4">
                    <motion.h1
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Shared Code
                    </motion.h1>
                    <motion.div
                        className="border border-gray-800 rounded-lg overflow-hidden shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-900 p-3 flex flex-wrap justify-between items-center gap-2">
                            <div className="flex space-x-2">
                                <motion.button
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors duration-200 flex items-center"
                                    onClick={handleCopy}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Copy</span>
                                </motion.button>
                                <motion.button
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors duration-200 flex items-center"
                                    onClick={handleShare}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Share</span>
                                </motion.button>
                            </div>
                            <div className="flex items-center font-bold space-x-4">
                                <div className="flex items-center text-gray-400">
                                    <Code className="h-5 w-5 mr-2" />
                                    <span className="text-sm">Real-time collaboration</span>
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Line: {cursorPosition.line}, Column: {cursorPosition.column}
                                </div>
                            </div>
                        </div>
                        <div className="relative bg-gray-950 text-gray-100 font-mono text-sm overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-gray-900 border-r border-gray-800 flex flex-col items-end pt-4 text-gray-500 select-none">
                                {lines.map((_, index) => (
                                    <div key={index} className="h-6 w-12 pr-2 text-right">{index + 1}</div>
                                ))}
                            </div>
                            <div className="relative">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={atomOneDark}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1rem 1rem 1rem 4rem',
                                        background: 'transparent',
                                        minHeight: '600px',
                                    }}
                                >
                                    {sharedCode}
                                </SyntaxHighlighter>
                                <textarea
                                    ref={textareaRef}
                                    className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-white resize-none focus:outline-none p-4 pl-16"
                                    value={sharedCode}
                                    onChange={handleTextareaChange}
                                    spellCheck="false"
                                    style={{ tabSize: 4 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className="fixed bottom-4 right-4 bg-gray-800 text-gray-100 p-3 rounded shadow-lg"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
                <p className="text-sm text-gray-400">© 2024 CodeNow. All rights reserved.</p>
                <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">built by Krish Soni</p>
            </footer>
        </div>
    );
};

export default ShareCodePage;

