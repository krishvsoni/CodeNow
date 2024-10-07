/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef } from 'react';
import { Code, Copy, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce';

const ShareCodePage: React.FC = () => {
    const searchParams = useSearchParams();
    const codeParam = searchParams.get('code');
    const initialCode = codeParam && isValidBase64(codeParam) ? atob(codeParam) : '';
    const [sharedCode, setSharedCode] = useState<string>(initialCode);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const socketRef = useRef<any>(null); // Use a ref to hold the socket instance
    const [isClient, setIsClient] = useState(false); // Track if we are in the client

    useEffect(() => {
        // Set client-side flag
        setIsClient(true);

        // Connect to the socket on mount
        socketRef.current = io('/api/socket');

        // Fetch initial code from local storage or query params
        const storedCode = localStorage.getItem(`sharedCode_${initialCode}`) || initialCode;
        setSharedCode(storedCode);

        socketRef.current.on('codeUpdate', (newCode: string) => {
            console.log("Received code update:", newCode);
            setSharedCode(newCode);
            localStorage.setItem(`sharedCode_${initialCode}`, newCode);
        });

        socketRef.current.emit('message', 'A new user has joined');

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('codeUpdate');
        };
    }, [initialCode]);

    useEffect(() => {
        if (isClient) {
            const shortCode = hashCode(sharedCode); // Generate hash for the current shared code
            localStorage.setItem(`sharedCode_${shortCode}`, sharedCode);
        }
    }, [sharedCode, isClient]);

    const handleCopy = () => {
        navigator.clipboard.writeText(sharedCode);
        setToastMessage("The code has been copied to your clipboard.");
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Simple hash function to create a unique identifier
    const hashCode = (code: string): string => {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            hash = (hash << 5) - hash + code.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36); // Convert hash to a base-36 string
    };

    const handleShare = () => {
        const shortCode = hashCode(sharedCode); // Create a unique identifier for the code
        const url = `${window.location.origin}${window.location.pathname}?code=${shortCode}`;
        
        navigator.clipboard.writeText(url);
        setToastMessage("The shareable link has been copied to your clipboard.");
        setTimeout(() => setToastMessage(null), 3000);
    };

    const debouncedEmitCodeChange = useRef(
        debounce((newCode) => {
            socketRef.current.emit('codeUpdate', newCode);
        }, 500)
    ).current;

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setSharedCode(newCode);
        debouncedEmitCodeChange(newCode);
    };

    const lines = sharedCode.split('\n').map((_, i) => i + 1);

    // Return null or a loading state if we are not on the client yet
    if (!isClient) return null;

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-950 text-gray-100">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
                <Link className="flex items-center justify-center" href="/">
                    <Code className="h-6 w-6 mr-2" />
                    <span className="font-bold text-xl">CodeNow</span>
                </Link>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-2xl font-bold">Shared Code</h1>
                    <div className="border border-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-900 p-2 flex justify-between items-center">
                            <div className="flex space-x-2">
                                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300" onClick={handleCopy}>
                                    <Copy className="h-4 w-4 inline" />
                                    <span className="sr-only">Copy code</span>
                                </button>
                                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300" onClick={handleShare}>
                                    <Share2 className="h-4 w-4 inline" />
                                    <span className="sr-only">Share code</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute top-0 left-0 h-full w-10 bg-gray-900 border-r border-gray-800 flex flex-col items-center pt-4 text-gray-500 text-sm select-none">
                                {lines.map((lineNumber) => (
                                    <div key={lineNumber} className="h-6 w-full text-right pr-2">
                                        {lineNumber}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                ref={textareaRef}
                                className="w-full h-[400px] bg-gray-950 text-gray-100 p-4 pl-12 font-mono text-sm resize-none focus:outline-none"
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
                <p className="text-xs text-gray-400">© 2024 CodeNow. All rights reserved.</p>
                <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">
                    built by krish soni
                </p>
            </footer>
        </div>
    );
};

// Helper function to validate if a string is valid Base64
const isValidBase64 = (str: string) => {
    try {
        // Check if the string matches Base64 pattern and is of correct length
        return /^[A-Za-z0-9+/]+={0,2}$/.test(str) && (str.length % 4 === 0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return false;
    }
};

export default ShareCodePage;
