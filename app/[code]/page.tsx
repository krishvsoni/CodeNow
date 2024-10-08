'use client';
import { useState, useEffect, useRef } from 'react';
import { Code, Copy, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce'; 

const socket = io('https://codenow-server.onrender.com'); 
// const socket = io(process.env.SOCKET_URL); 

const ShareCodePage: React.FC = () => {
    const searchParams = useSearchParams();
    const initialCode = searchParams.get('code') || '';
    const [sharedCode, setSharedCode] = useState<string>(initialCode);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (initialCode) {
            setSharedCode(initialCode);
        }

        socket.on('codeUpdate', (newCode: string) => {
            console.log('Received code update:', newCode); 
            setSharedCode(newCode);
        });

        socket.on('message', (message: string) => {
            console.log(message);
        });

        return () => {
            socket.off('codeUpdate');
            socket.off('message');
        };
    }, [initialCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(sharedCode);
        setToastMessage("The code has been copied to your clipboard.");
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(sharedCode)}`;
        navigator.clipboard.writeText(url);
        setToastMessage("The shareable link has been copied to your clipboard.");
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Debounced function to emit codeChange with URL
    const debouncedEmitCodeChange = useRef(
        debounce((newCode) => {
            const url = window.location.href; // Capture the current URL
            console.log('Emitting Code Change:', { newCode, url }); // Debugging line
            socket.emit('codeChange', { newCode, url }); // Emit both the new code and the URL
            localStorage.setItem('sharedCode', newCode); 
        }, 500) 
    ).current;

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        console.log('New Code:', newCode);  // Debugging line
        setSharedCode(newCode);
        debouncedEmitCodeChange(newCode);
    };

    const calculateLineNumbers = () => {
        if (textareaRef.current) {
            const lineCount = textareaRef.current.value.split('\n').length;
            return Array.from({ length: lineCount }, (_, i) => i + 1);
        }
        return [];
    };

    const lines = calculateLineNumbers();

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
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Shared Code</h1>
                    </div>
                    <div className="border border-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-900 p-2 flex justify-between items-center">
                            <span className="text-sm font-medium"></span>
                            <div className="flex space-x-2">
                                <button
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4 inline" />
                                    <span className="sr-only">Copy code</span>
                                </button>
                                <button
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                                    onClick={handleShare}
                                >
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
            </footer>
        </div>
    );
};

export default ShareCodePage;
