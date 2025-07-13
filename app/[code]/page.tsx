"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Copy, Share2, Code, Terminal, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { io } from "socket.io-client"
import debounce from "lodash.debounce"
import LZString from "lz-string"
import { motion, AnimatePresence } from "framer-motion"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { nanoid } from "nanoid"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

const UFO = ({ className }: { className?: string }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    animate={{ y: [0, -5, 0] }}
    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
  >
    <ellipse cx="12" cy="14" rx="8" ry="3" fill="#ff6b35" opacity="0.8" />
    <ellipse cx="12" cy="10" rx="6" ry="4" fill="#ff6b35" />
    <circle cx="9" cy="10" r="1" fill="#ffffff" opacity="0.6" />
    <circle cx="12" cy="9" r="1" fill="#ffffff" opacity="0.6" />
    <circle cx="15" cy="10" r="1" fill="#ffffff" opacity="0.6" />
    <path d="M6 14 L4 16 M18 14 L20 16 M12 14 L12 16" stroke="#ff6b35" strokeWidth="1" opacity="0.4" />
  </motion.svg>
)

const Spaceship = ({ className }: { className?: string }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
  >
    <path d="M12 2 L16 8 L12 6 L8 8 Z" fill="#ffffff" />
    <ellipse cx="12" cy="10" rx="4" ry="2" fill="#ff6b35" />
    <rect x="10" y="12" width="4" height="6" fill="#ff6b35" />
    <circle cx="10" cy="10" r="0.5" fill="#ffffff" />
    <circle cx="14" cy="10" r="0.5" fill="#ffffff" />
    <path d="M10 18 L8 22 M14 18 L16 22 M12 18 L12 22" stroke="#ff6b35" strokeWidth="1" opacity="0.6" />
  </motion.svg>
)

const CyberpunkNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-orange-500/50">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-none flex items-center justify-center">
            <Code className="w-5 h-5 text-black" />
          </div>
          <span
            className="text-xl font-bold text-white font-mono cursor-pointer"
            onClick={() => (window.location.pathname = "/")}
          >
            codenow
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 font-mono">
            Features
          </a>
          <a href="#extension" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 font-mono">
            Extension
          </a>
          <a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 font-mono">
            Contact
          </a>
        </div>
      </div>
    </div>
  </nav>
)

const ShareCodePage: React.FC = () => {
  const searchParams = useSearchParams()
  const initialCode = LZString.decompressFromEncodedURIComponent(searchParams.get("code") || "") || ""
  const [sharedCode, setSharedCode] = useState(initialCode || "")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const shortId = window.location.pathname.substring(1)
    if (shortId) {
      const fetchCode = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getCode/${shortId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.code) {
              const decompressedCode = LZString.decompressFromEncodedURIComponent(data.code)
              setSharedCode(decompressedCode || "")
            }
          } else {
            console.error("Code not found for the given short ID.")
            showToast("Share your code now.")
          }
        } catch (error) {
          console.error("Error fetching code:", error)
          showToast("Failed to fetch code.")
        }
      }
      fetchCode()
    }

    const handleCodeUpdate = (newCode: string) => setSharedCode(newCode || "")
    const handleMessage = (message: string) => console.log(message)

    socket.on("codeUpdate", handleCodeUpdate)
    socket.on("message", handleMessage)

    return () => {
      socket.off("codeUpdate", handleCodeUpdate)
      socket.off("message", handleMessage)
    }
  }, [])

  useEffect(() => {
    const handleSocketConnect = () => {
      socket.emit("join", {
        url: window.location.href,
        currentCode: sharedCode || "",
      })
    }

    socket.on("connect", handleSocketConnect)

    if (socket.connected && sharedCode) {
      handleSocketConnect()
    }

    return () => {
      socket.off("connect", handleSocketConnect)
    }
  }, [sharedCode])

  const handleCursorUpdate = () => {
    if (!textareaRef.current || !sharedCode) return
    const textarea = textareaRef.current
    const cursorIndex = textarea.selectionStart
    const textBeforeCursor = sharedCode.substring(0, cursorIndex)
    const lines = textBeforeCursor.split("\n")
    const currentLine = lines.length
    const currentColumn = lines[lines.length - 1].length + 1
    setCursorPosition({ line: currentLine, column: currentColumn })
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedCode)
    showToast("Code copied to clipboard.")
  }

  const handleShare = async () => {
    try {
      const compressedCode = LZString.compressToEncodedURIComponent(sharedCode)
      const shortId = nanoid(8)
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/saveCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shortId, code: compressedCode }),
      })
      const shortUrl = `${window.location.origin}/${shortId}`
      await navigator.clipboard.writeText(shortUrl)
      showToast("Share link copied to clipboard!")
    } catch (err) {
      console.error("Error:", err)
      showToast("Failed to create share link.")
    }
  }

  const debouncedEmitCodeChange = useRef(
    debounce((newCode: string) => {
      socket.emit("codeChange", { newCode, url: window.location.href })
      localStorage.setItem("sharedCode", newCode)
    }, 500),
  ).current

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setSharedCode(newCode)
    debouncedEmitCodeChange(newCode)
    const textarea = e.target
    const cursorIndex = textarea.selectionStart
    const textBeforeCursor = newCode.substring(0, cursorIndex)
    const lines = textBeforeCursor.split("\n")
    const currentLine = lines.length
    const currentColumn = lines[lines.length - 1].length + 1
    setCursorPosition({ line: currentLine, column: currentColumn })
  }

  const lines = (sharedCode || "").split("\n")

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <UFO className="absolute top-20 left-10" />
        <Spaceship className="absolute top-40 right-20" />
        <UFO className="absolute bottom-40 left-20" />
        <Spaceship className="absolute bottom-20 right-10" />
      </div>

      <CyberpunkNavbar />

      <div className="flex flex-col min-h-screen relative z-10">
        <main className="flex-1 p-4 md:p-6 overflow-hidden pt-20">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-orange-500 mt-5 font-mono">SHARED CODE</h1>
              <div className="flex items-center text-gray-400 text-sm font-mono">
                <Terminal className="h-4 w-4 mr-2" />
                <span>
                  Line: {cursorPosition.line}, Column: {cursorPosition.column}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="border-2 border-orange-500/50 rounded-none overflow-hidden bg-gray-900/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/80 p-3 flex flex-wrap justify-between items-center gap-2 border-b-2 border-orange-500/30">
                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 bg-black border-2 border-white/30 hover:border-white text-white transition-colors duration-200 flex items-center rounded-none font-mono"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    <span className="text-sm">COPY</span>
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black transition-colors duration-200 flex items-center rounded-none font-mono font-bold"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    <span className="text-sm">SHARE</span>
                  </button>
                </div>
                <div className="flex items-center text-gray-400 font-mono">
                  <Code className="h-5 w-5 mr-2 text-orange-500" />
                  <span className="text-sm">REALTIME SYNC</span>
                </div>
              </div>

              <div className="relative bg-black text-gray-100 font-mono text-sm overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gray-900/50 border-r-2 border-orange-500/30 flex flex-col items-end pt-4 text-gray-500 select-none">
                  {lines.map((_, index) => (
                    <div key={index} className="h-6 w-12 pr-2 text-right">
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomOneDark}
                    customStyle={{
                      margin: 0,
                      padding: "1rem 1rem 1rem 4rem",
                      background: "transparent",
                      minHeight: "600px",
                    }}
                  >
                    {sharedCode}
                  </SyntaxHighlighter>
                  <textarea
                    ref={textareaRef}
                    className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-orange-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 p-4 pl-16"
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

            <motion.div
              className="bg-black/50 p-6 rounded-none border-2 border-orange-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 p-3 rounded-none">
                  <Code className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-orange-500 font-mono">COLLABORATION PROTOCOL</h3>
                  <ul className="text-gray-400 text-sm font-mono space-y-2">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">■</span>
                      Share URL with team members for realtime collaboration. All changes sync automatically across
                      connected devices.
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">■</span>
                      Use SHARE button to generate permanent link for code access and distribution.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="fixed bottom-4 right-4 bg-orange-500 text-black p-4 rounded-none font-mono font-bold border-2 border-white/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="ml-4 text-black hover:text-gray-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="py-6 border-t-2 border-orange-500/50 bg-black/80 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 mb-4 sm:mb-0 font-mono">
                © {new Date().getFullYear()} CodeNow. All rights reserved.
              </p>
              <p className="text-gray-500 font-mono hover:text-orange-500 transition-colors duration-300">
                Built by Krish Soni
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ShareCodePage
