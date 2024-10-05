'use client';
import { useState } from "react";
import { Code, Users, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter

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
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Code className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">CodeNow</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center">
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
                <button className="px-4 py-2 border border-gray-700 text-white font-medium rounded hover:bg-gray-800">
                  Github Repository
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for entering code */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
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
            </div>
          </div>
        )}

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Zap className="h-10 w-10 text-blue-500" />
                <h2 className="text-xl font-bold">Realtime Collaboration</h2>
                <p className="text-gray-400">Code together in real-time with your team, no matter where they are in the world.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Globe className="h-10 w-10 text-green-500" />
                <h2 className="text-xl font-bold">Multi-language Support</h2>
                <p className="text-gray-400">From Python to JavaScript, CodeNow supports all major programming languages.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Users className="h-10 w-10 text-purple-500" />
                <h2 className="text-xl font-bold">Team Management</h2>
                <p className="text-gray-400">Easily manage your team, projects, and permissions all in one place.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">For Inquiries</h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Have a question or need help? Contact us at{" "}
                  <a href="mailto:" className="text-blue-500 hover:underline" />
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="max-w-lg flex-1 bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 CodeNow. All rights reserved.</p>
      </footer>
    </div>
  );
}
