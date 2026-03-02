"use client";

import React from "react";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const CLIENT_ID = "860cj7r5jnu43g";
const REDIRECT_URI =
  "https://linkdin-devloper-link.vercel.app/auth/linkedin/callback";

export default function LoginPage() {
  const handleLogin = () => {
    // Generate a cryptographically random state for CSRF protection
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("linkedin_oauth_state", state);

    const scope = "openid profile email";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f2ef] p-6 font-sans">
      <div className="w-full max-w-sm mb-6 flex justify-center text-center items-center gap-2">
        <div className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center">
          <FaLinkedin className="text-white text-lg" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-gray-900">
          AuthNode
        </span>
      </div>
      <div className="w-full max-w-sm bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-gray-600 mb-8 text-sm">
          Stay updated on your professional world.
        </p>

        <button
          onClick={handleLogin}
          className="w-full border border-gray-400 text-gray-700 bg-white font-medium py-3 px-4 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <FaLinkedin className="text-[#0a66c2] text-xl" />
          Sign in with LinkedIn
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-[250px] mx-auto">
            By clicking Sign in, you agree to AuthNode&apos;s User Agreement,
            Privacy Policy, and Cookie Policy.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          New to AuthNode?{" "}
          <Link href="/" className="text-[#0a66c2] hover:underline font-medium">
            Join now
          </Link>
        </p>
      </div>
    </div>
  );
}
