'use client';
import { useState } from "react";
import { Code, Users, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter
import { motion } from 'framer-motion'; // Import motion

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter(); // Initialize router

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

      <main className="flex-1 flex flex-col justify-center items-center">
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Code Together, Anywhere, Anytime
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  CodeNow is the realtime code sharing platform that brings developers together. Collaborate, learn, and create in perfect sync.
                </p>
              </div>
              <div className="space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
                  onClick={handleShareCodeClick}
                >
                  Share Your Code Now
                </button>
                <button
                  className="px-4 py-2 border border-gray-700 text-white font-medium rounded hover:bg-gray-800"
                  onClick={() => router.push('/compiler')}
                >
                  Online Compiler
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Modal for entering code */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Enter Your Code</h2>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded mb-4"
                placeholder="Enter code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleCodeSubmit}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 flex justify-center items-center"
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
                <h2 className="text-xl font-bold">Team Management</h2>
                <p className="text-gray-400">Easily manage your team, projects, and permissions all in one place.</p>
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
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">For Inquiries</h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Have a question or need assistance? Raise an issue on our <br />
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

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-sm text-gray-400">© 2024 CodeNow. All rights reserved.</p>
        <p className="text-slate-600 font-mono hover:text-white transition-colors duration-300">
          built by Krish Soni 🚀
        </p>
      </footer>
    </div>
  );
}