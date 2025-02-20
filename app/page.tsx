'use client';
import { useState } from "react";
import { Users, Zap, Globe, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from "@/components/Navbar";

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleShareCodeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCodeSubmit = () => {
    console.log('code entered', code);
    router.push(`/${code}`);
    handleCloseModal();
  };

  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5} -${189 + i * 6}C-${380 - i * 5} -${189 + i * 6} -${312 - i * 5} ${216 - i * 6} ${152 - i * 5} ${343 - i * 6}C${616 - i * 5} ${470 - i * 6} ${684 - i * 5} ${875 - i * 6} ${684 - i * 5} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="w-full h-full bg-gray-950 text-slate-950 dark:text-white"
            viewBox="0 0 696 316"
            fill="none"
          >
            {paths.map((path) => (
              <motion.path
                key={path.id}
                d={path.d}
                stroke="currentColor"
                strokeWidth={path.width}
                strokeOpacity={0.1 + path.id * 0.03}
                initial={{ pathLength: 0.3, opacity: 0.6 }}
                animate={{
                  pathLength: 1,
                  opacity: [0.3, 0.6, 0.3],
                  pathOffset: [0, 1, 0],
                }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </svg>
        </div>

        <main className="flex-1 flex flex-col justify-center items-center relative z-10">
          <motion.section
            className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                    <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.05 }}
                    >
                      
                    {"Code Together, Anywhere, Anytime".split("").map((char, index) => (
                      <motion.span key={index} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.05, delay: index * 0.05 }}>
                      {char}
                      </motion.span>
                    ))}
                    </motion.h1>
                    <motion.p
                    className="mx-auto max-w-[700px] text-gray-400 md:text-xl font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    >
                    CodeNow is the realtime code sharing platform that brings developers together. Collaborate, learn, and create in perfect sync.
                    </motion.p>
                </div>
                <div className="text-gray-400 md:text-xl  mr-5 text-center font-light">
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    <Code className="h-5 w-5 mr-1" />
                    VS Code Extension
                  </a>
                </div>
                <div className="space-x-4">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-500/50"
                    onClick={handleShareCodeClick}
                  >
                    Share Your Code Now
                  </button>
                  <button
                    className="px-6 mt-4 py-3 border border-gray-700 text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-300"
                    onClick={() => router.push('/v1/compiler')}
                  >
                    Online Compiler
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-80"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Enter Your Code</h2>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your room code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                    onClick={handleCodeSubmit}
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.section
            className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div
                  className="flex flex-col items-center space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="h-10 w-10 text-blue-500" />
                  <h2 className="text-xl font-bold">Realtime Collaboration</h2>
                  <p className="text-gray-400">Code together in real-time with your team, no matter where they are in the world.</p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Globe className="h-10 w-10 text-green-500" />
                  <h2 className="text-xl font-bold">Compiler Support</h2>
                  <p className="text-gray-400">From Lua to Perl, CodeNow supports all major programming languages.</p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Users className="h-10 w-10 text-purple-500" />
                  <h2 className="text-xl font-bold">Team Work</h2>
                  <p className="text-gray-400">Easily manage your team, projects, and code all in one place.</p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container px-4   md:px-8">
              <div className="flex flex-col items-center space-y-6 text-center">
                <Code className="h-16 w-16 text-blue-500" />
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">VS Code Extension</h2>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Enhance your coding experience with our VS Code extension. Share code directly from your editor and collaborate in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=KrishSoni.codenow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center"
                  >
                    <Code className="h-5 w-5 mr-2" />
                    Get the Extension
                  </a>
                  <div className="text-sm text-gray-400 flex items-center">
                    <span className="px-3 py-1 bg-gray-700 font-bold rounded-md font-mono">ext install KrishSoni.codenow</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container px-4  md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">For Inquiries</h2>
                  <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                    Have a question or need assistance? <br></br>
                    Raise an issue on our <br />
                    <a
                      href="https://github.com/krishvsoni/CodeNow/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      GitHub Issues page
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800 relative z-10">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} CodeNow. All rights reserved.</p>
          <p className="text-slate-600 font-mono font-bold hover:text-white transition-colors duration-300">
            built by Krish Soni
          </p>
        </footer>
      </div>
    </>
  );
}


