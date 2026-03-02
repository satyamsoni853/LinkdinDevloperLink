"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { FaLinkedin } from "react-icons/fa";
// for for 
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Authenticating...");
  const [error, setError] = useState<string | null>(null);

  const handleOAuthFlow = useCallback(
    async (code: string) => {
      try {
        setStatus("Exchanging authorization code...");
        const tokenResponse = await fetch(
          "https://developerlinkdin2-7.onrender.com/api/auth/linkedin/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          },
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(
            errorData.error || "Failed to exchange authorization code",
          );
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
          throw new Error("No access token returned from server");
        }

        setStatus("Fetching your LinkedIn profile...");
        const profileResponse = await fetch(
          "https://developerlinkdin2-7.onrender.com/api/auth/linkedin/userinfo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: accessToken }),
          },
        );

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }

        const savedUser = await profileResponse.json();

        dispatch(
          setUser({
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            profilePicture: savedUser.profilePicture,
            linkedinId: savedUser.linkedinId,
          }),
        );

        setStatus("Success! Redirecting to your profile...");
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } catch (err: any) {
        console.error("OAuth Error:", err);
        setError(
          err.message || "An unexpected error occurred during authentication.",
        );
      }
    },
    [dispatch, router],
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = localStorage.getItem("linkedin_oauth_state");

    if (!code) {
      setError("No authorization code received from LinkedIn.");
      return;
    }

    if (state !== storedState) {
      setError("Invalid state parameter. Possible CSRF attack.");
      return;
    }

    localStorage.removeItem("linkedin_oauth_state");

    handleOAuthFlow(code);
  }, [searchParams, handleOAuthFlow]);

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
      <div className="w-full max-w-sm bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 text-center">
        {!error ? (
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{status}</h1>
            <p className="text-gray-600 text-sm">
              Please wait while we establish a secure connection with LinkedIn.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full border border-gray-400 text-gray-700 bg-white font-medium py-3 px-4 rounded-full hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef] text-gray-900 font-sans">
          Loading...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
