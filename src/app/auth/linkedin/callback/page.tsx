"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef] text-gray-900 font-sans p-6">
      <div className="max-w-md w-full p-8 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center">
        {!error ? (
          <div className="py-6">
            <div className="w-12 h-12 border-4 border-[#eff3f8] border-t-[#0a66c2] rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-xl font-bold mb-2 text-gray-900">{status}</h1>
            <p className="text-gray-500 text-sm">
              Please wait while we establish a secure connection with LinkedIn.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-[#0a66c2] text-white font-medium rounded-full hover:bg-[#004182] transition-colors"
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
