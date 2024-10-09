'use client';
import { useState, useEffect, useRef } from 'react';
import { Code, Copy, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce';
import LZString from 'lz-string';

const socket = io('https://codenow-server.onrender.com');

const ShareCodePage: React.FC = () => {
    const searchParams = useSearchParams();
    const initialCode = LZString.decompressFromEncodedURIComponent(searchParams.get('code') || '') || '';
    const [sharedCode, setSharedCode] = useState(initialCode);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (initialCode) setSharedCode(initialCode);

        const handleCodeUpdate = (newCode: string) => setSharedCode(newCode);
        const handleMessage = (message: string) => console.log(message);

        socket.on('codeUpdate', handleCodeUpdate);
        socket.on('message', handleMessage);

        return () => {
            socket.off('codeUpdate', handleCodeUpdate);
            socket.off('message', handleMessage);
        };
    }, [initialCode]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(sharedCode);
        showToast("The code has been copied to your clipboard.");
    };

    const handleShare = () => {
        const compressedCode = LZString.compressToEncodedURIComponent(sharedCode);
        navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?code=${compressedCode}`);
        showToast("The shareable link has been copied to your clipboard.");
    };

    const debouncedEmitCodeChange = useRef(debounce((newCode: string) => {
        socket.emit('codeChange', { newCode, url: window.location.href });
        localStorage.setItem('sharedCode', newCode);
    }, 500)).current;

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setSharedCode(newCode);
        debouncedEmitCodeChange(newCode);
    };

    const lines = textareaRef.current ? Array.from({ length: textareaRef.current.value.split('\n').length }, (_, i) => i + 1) : [];

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-950 text-gray-100">
            <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
                <Link className="flex items-center justify-center" href="/">
                    <Code className="h-6 w-6 mr-2" />
                    <span className="font-bold text-xl">CodeNow</span>
                </Link>
                <a
                    href="https://github.com/krishvsoni/CodeNow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline"
                >
                    <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" clipRule="evenodd" />
                    </svg>
                    CodeNow
                </a>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="w-full max-w-4xl lg:max-w-full mx-auto space-y-4">
                    <h1 className="text-2xl font-bold">Shared Code</h1>
                    <div className="border border-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-900 p-2 flex justify-between items-center">
                            <div className="flex space-x-2">
                                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300" onClick={handleCopy}>
                                    <Copy className="h-4 w-4 inline" /> <span className="sr-only">Copy code</span>
                                </button>
                                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300" onClick={handleShare}>
                                    <Share2 className="h-4 w-4 inline" /> <span className="sr-only">Share code</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute top-0 left-0 h-[600px] bg-gray-900 border-r border-gray-800 flex flex-col items-center pt-4 text-gray-500 text-sm select-none">
                                {lines.map((lineNumber) => (
                                    <div key={lineNumber} className="h-6 w-full text-right pr-2">{lineNumber}</div>
                                ))}
                            </div>
                            <textarea
                                ref={textareaRef}
                                className="w-full h-[600px] bg-gray-950 text-gray-100 p-4 pl-12 font-mono text-sm resize-none focus:outline-none"
                                value={sharedCode}
                                onChange={handleTextareaChange}
                                spellCheck="false"
                                placeholder="Your code will appear here..."
                            />
                        </div>
                    </div>
                </div>
            </main>

            {toastMessage && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-gray-100 p-3 rounded shadow-lg">
                    {toastMessage}
                </div>
            )}

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
                <p className="text-sm text-gray-400">© 2024 CodeNow. All rights reserved.</p>
                <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">built by Krish Soni</p>
            </footer>
        </div>
    );
};

export default ShareCodePage;
