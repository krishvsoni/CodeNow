/* eslint-disable react/no-children-prop */
"use client"
import { useState } from "react"
import { Users, Zap, Globe, Code, ArrowRight, ExternalLink, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision"

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
      fill="#B0C4DE"
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
      fill="#3E8EDE"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />
    <motion.path
      d="M10 150H240L250 180H0L10 150Z"
      fill="#B0C4DE"
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
      fill="#3E8EDE"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
    />
  </motion.svg>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Navbar />

      <div className="relative overflow-hidden">
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 z-0">
            <BackgroundBeamsWithCollision children={undefined} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <AnimatedLaptop />

              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Code Together, Anywhere, Anytime
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Realtime code sharing platform that brings developers together. Collaborate, learn, and create in
                perfect sync.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium rounded-md transition-colors duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center"
                  onClick={handleShareCodeClick}
                >
                  Share Your Code Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                <button
                  className="px-6 py-3 border border-gray-700 hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center"
                  onClick={() => router.push("/v1/compiler")}
                >
                  Online Compiler
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Code className="h-5 w-5 mr-2" />
                  VS Code Extension
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CodeNow?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Powerful features designed to enhance your coding experience and team collaboration
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-cyan-500" />}
                title="Realtime Collaboration"
                description="Code together in real-time with your team, no matter where they are in the world."
                delay={0}
              />

              <FeatureCard
                icon={<Globe className="h-10 w-10 text-emerald-500" />}
                title="Compiler Support"
                description="From Lua to Perl, CodeNow supports all major programming languages."
                delay={0.1}
              />

              <FeatureCard
                icon={<Users className="h-10 w-10 text-teal-500" />}
                title="Team Work"
                description="Easily manage your team, projects, and code all in one place."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-gray-800/50 p-6 rounded-full">
                    <Code className="h-16 w-16 text-blue-500" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4">VS Code Extension</h2>
                    <p className="text-gray-300 mb-6 max-w-2xl">
                      Enhance your coding experience with our VS Code extension. Share code directly from your editor
                      and collaborate in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <a
                        href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium rounded-md transition-colors duration-300 shadow-lg"
                      >
                        <Code className="h-5 w-5 mr-2" />
                        Get the Extension
                      </a>

                      <div className="text-sm text-gray-400 flex items-center">
                        <span className="px-3 py-1 bg-gray-800 font-bold rounded-md font-mono">
                          ext install KrishSoni.codenow
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">For Inquiries</h2>
              <p className="text-gray-300 mb-8">
                Have a question or need assistance? Raise an issue on our GitHub repository.
              </p>

              <a
                href="https://github.com/krishvsoni/CodeNow/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-300"
              >
                GitHub Issues
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 sm:mb-0">© {new Date().getFullYear()} CodeNow. All rights reserved.</p>
              <p className="text-gray-500 font-mono hover:text-white transition-colors duration-300">
                built by Krish Soni
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Dialog (using pure Tailwind) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Create Room</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-400 mb-4">Enter a room code to start collaborating</p>

            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-6"
              placeholder="your room code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-700 text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCodeSubmit}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <div className="bg-gray-900/50 p-4 rounded-lg inline-block mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
