'use client';
import { useState, useEffect, useRef } from 'react';
import { Copy, Share2, Code } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce';
import LZString from 'lz-string';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { nanoid } from 'nanoid';
import { Navbar } from '@/components/Navbar';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

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
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getCode/${shortId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.code) {
                            const decompressedCode = LZString.decompressFromEncodedURIComponent(data.code);
                            setSharedCode(decompressedCode);
                        }
                    } else {
                        console.error("Code not found for the given short ID.");
                        showToast("Share your code now.");
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


    const handleCursorUpdate = () => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const cursorIndex = textarea.selectionStart;
        const textBeforeCursor = sharedCode.substring(0, cursorIndex);
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines.length;
        const currentColumn = lines[lines.length - 1].length + 1;

        setCursorPosition({ line: currentLine, column: currentColumn });
    };


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

            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/saveCode`, {
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
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen  bg-gray-950 text-gray-100">

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
                                        <span className="text-sm">Share Snippet</span>
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
                                        onClick={handleCursorUpdate}
                                        onKeyUp={handleCursorUpdate}
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
                <p className="text-sm text-gray-400">© {new Date().getFullYear()} CodeNow. All rights reserved.</p>
                <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">built by Krish Soni</p>
                </footer>
            </div>
        </>
    );
};

export default ShareCodePage;