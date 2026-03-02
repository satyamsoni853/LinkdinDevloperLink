"use client";

import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] rounded flex flex-col items-center justify-center">
              <FaLinkedin className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              AuthNode
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Support
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 bg-[#0a66c2] text-white rounded hover:bg-[#004182] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto pb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Enterprise authentication made simple
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Integrate professional LinkedIn OAuth 2.0 directly into your
            applications. Fast, secure, and entirely standards-compliant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3 bg-[#0a66c2] text-white font-medium rounded hover:bg-[#004182] transition-colors shadow-sm text-lg"
            >
              Live Demo
            </Link>
          </div>
        </div>

       
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#0a66c2] rounded flex items-center justify-center">
              <FaLinkedin className="text-white text-xs" />
            </div>
            <span className="font-bold tracking-tight text-gray-900">
              AuthNode
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 AuthNode Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
