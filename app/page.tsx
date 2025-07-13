"use client"

import type React from "react"
import { useState } from "react"
import { Users, Zap, Globe, Code, ArrowRight, ExternalLink, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const AnimatedLaptop = () => (
  <motion.svg
    width="100%"
    height="100%"
    viewBox="0 0 250 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-8 w-[150px] sm:w-[200px] md:w-[250px]"
  >
    <motion.rect
      x="25"
      y="15"
      width="200"
      height="130"
      rx="5"
      fill="#1a1a1a"
      stroke="#ff6b35"
      strokeWidth="2"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
    <motion.rect
      x="40"
      y="30"
      width="170"
      height="100"
      rx="2"
      fill="#000000"
      stroke="#ff6b35"
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />
    <motion.path
      d="M10 150H240L250 180H0L10 150Z"
      fill="#1a1a1a"
      stroke="#ff6b35"
      strokeWidth="1"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
    />
    <motion.rect
      x="105"
      y="160"
      width="40"
      height="5"
      rx="2.5"
      fill="#ff6b35"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
    />
  </motion.svg>
)

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
          <span className="text-xl font-bold text-white font-mono">codenow</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 ">
            Features
          </a>
          <a href="#extension" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 ">
            Extension
          </a>
          <a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 ">
            Contact
          </a>
        </div>
      </div>
    </div>
  </nav>
)

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleShareCodeClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCodeSubmit = () => {
    console.log("code entered", code)
    router.push(`/${code}`)
    handleCloseModal()
  }

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

      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-500/5 to-transparent pointer-events-none"></div>

      <CyberpunkNavbar />

      <div className="relative">
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
              <AnimatedLaptop />

              <motion.h1
                className="text-5xl md:text-8xl font-bold mb-8 "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-orange-500">CODE</span>
                <span className="text-white">NOW</span>
              </motion.h1>

              <motion.div
                className="mb-8 p-6 border-2 border-orange-500/50 rounded-none bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl  leading-relaxed">
                  <span className="text-orange-500"></span> Realtime code sharing platform for professionals
                  <br />
                  <span className="text-orange-500"></span> Collaborate with precision and efficiency
                  <br />
                  <span className="text-orange-500"></span> Built for serious developers
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-none transition-colors duration-300"
                  onClick={handleShareCodeClick}
                >
                  <span className="flex items-center justify-center">
                    SHARE CODE
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </button>

                <button
                  className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-none transition-all duration-300 "
                  onClick={() => router.push("/v1/compiler")}
                >
                  <span className="flex items-center justify-center">
                    COMPILER
                    <Code className="ml-2 h-5 w-5" />
                  </span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border-2 border-white/30 rounded-none p-4 bg-black/50"
              >
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white hover:text-orange-500 transition-colors"
                >
                  <Code className="h-6 w-6 mr-3" />
                  <span>VS Code Extension</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/5 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-orange-500">SYSTEM</span>
                <span className="text-white ml-4">FEATURES</span>
              </h2>
              <div className="w-32 h-1 bg-orange-500 mx-auto mb-6"></div>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">Professional tools for modern development teams</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-12 w-12 text-orange-500" />}
                title="REALTIME SYNC"
                description="Instant synchronization across all connected clients. No delays, no conflicts, just seamless collaboration."
                delay={0}
              />
              <FeatureCard
                icon={<Globe className="h-12 w-12 text-orange-500" />}
                title="UNIVERSAL SUPPORT"
                description="Complete language support from C to Rust. Every major programming language is fully supported."
                delay={0.1}
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-orange-500" />}
                title="TEAM MANAGEMENT"
                description="Advanced project organization with role-based permissions and secure team collaboration."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        <section id="extension" className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="bg-gray-900/50 border-2 border-orange-500/50 rounded-none overflow-hidden">
              <div className="p-8 md:p-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="relative">
                    <div className="w-32 h-32 bg-orange-500 rounded-none flex items-center justify-center">
                      <Code className="h-16 w-16 text-black" />
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                      <span className="text-orange-500">VS CODE</span>
                      <span className="text-white ml-4">EXTENSION</span>
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl text-lg leading-relaxed">
                      Integrate directly with your development environment. Share code instantly from VS Code with full
                      syntax highlighting and real-time collaboration features.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <a
                        href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-none transition-colors duration-300"
                      >
                        <Code className="h-6 w-6 mr-3" />
                        INSTALL EXTENSION
                      </a>

                      <div className="flex items-center space-x-3">
                        <div className="px-4 py-2 bg-black border-2 border-orange-500/30 rounded-none font-mono text-orange-500 text-sm">
                          ext install KrishSoni.codenow
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/5 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="text-orange-500">SUPPORT</span>
                <span className="text-white ml-4">CENTER</span>
              </h2>
              <div className="w-32 h-1 bg-orange-500 mx-auto mb-8"></div>
              <p className="text-gray-300 mb-12 text-lg">
                Professional support for development teams. Report issues, request features, or get technical assistance
                through our GitHub repository.
              </p>

              <a
                href="https://github.com/krishvsoni/CodeNow/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 hover:bg-orange-500 hover:text-black text-orange-500 font-bold rounded-none transition-all duration-300"
              >
                GITHUB ISSUES
                <ExternalLink className="ml-3 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t-2 border-orange-500/50 bg-black/80">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 sm:mb-0">© {new Date().getFullYear()} CodeNow. All rights reserved.</p>
              <p className="text-gray-500 hover:text-orange-500 transition-colors duration-300">Built by Krish Soni</p>
            </div>
          </div>
        </footer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-black border-2 border-orange-500/50 rounded-none shadow-2xl w-full max-w-md mx-4"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-500">CREATE ROOM</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">Enter room code to establish connection</p>

              <input
                type="text"
                className="w-full px-4 py-4 bg-black border-2 border-orange-500/30 rounded-none text-white font-mono focus:outline-none focus:border-orange-500 transition-colors duration-300 placeholder-gray-500"
                placeholder="room code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded-none transition-colors duration-300"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCodeSubmit}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-none transition-colors duration-300"
                >
                  CONNECT
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-black/50 rounded-none p-8 border-2 border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:bg-gray-900/30"
    >
      <div className="bg-black/80 p-4 rounded-none inline-block mb-6 border border-orange-500/30">{icon}</div>

      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}
