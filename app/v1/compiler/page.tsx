"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Code } from "lucide-react"
import { motion } from "framer-motion"

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
            onClick={() => (window.location.href = "/")}
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

const CompilerPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
      const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
      setIsMobile(mobile)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
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

        <main className="flex-1 p-4 md:p-6 pt-20 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold mt-5 text-orange-500 font-mono">COMPILER</h1>
            </div>

            <p className="text-gray-400 text-sm font-mono">
              Execute and test code directly in browser environment. Full language support available.
            </p>

            {isMobile && (
              <div className="bg-black border-l-4 border-orange-500 text-white p-4 mb-4 rounded-none flex items-start border-2 border-orange-500/30">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-orange-500" />
                <p className="text-sm font-mono">
                  <span className="text-orange-500 font-bold">WARNING:</span> Desktop environment recommended for
                  optimal compiler performance. Mobile functionality may be limited.
                </p>
              </div>
            )}

            <div className="relative border-2 border-orange-500/50 rounded-none overflow-hidden bg-gray-900/50">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-orange-500 font-mono text-sm">LOADING COMPILER...</span>
                  </div>
                </div>
              )}
              <iframe
                frameBorder="0"
                height="650px"
                src="https://onecompiler.com/embed/"
                width="100%"
                title="Online Compiler"
                onLoad={handleIframeLoad}
                className="bg-black"
              ></iframe>
            </div>

            <div className="bg-black/50 p-6 rounded-none border-2 border-orange-500/30">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 p-3 rounded-none">
                  <Code className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-orange-500 font-mono">COMPILER FEATURES</h3>
                  <ul className="text-gray-400 text-sm font-mono space-y-2">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">■</span>
                      Multi-language support with syntax highlighting and error detection
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">■</span>
                      Real-time code execution with instant output display
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">■</span>
                      Integrated debugging tools and performance monitoring
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t-2 border-orange-500/50 bg-black/80 mt-auto relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 mb-4 sm:mb-0 font-mono">
                © {new Date().getFullYear()} CodeNow. All rights reserved.
              </p>
              <Link
                href="https://onecompiler.com/"
                target="_blank"
                className="text-gray-500 font-mono hover:text-orange-500 transition-colors duration-300"
              >
                Powered By OneCompiler
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default CompilerPage
