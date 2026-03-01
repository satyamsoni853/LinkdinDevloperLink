"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Authenticating...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = localStorage.getItem("linkedin_oauth_state");

    // Validate the authorization code exists
    if (!code) {
      setError("No authorization code received from LinkedIn.");
      return;
    }

    // CSRF protection: validate state parameter
    if (state !== storedState) {
      setError("Invalid state parameter. Possible CSRF attack.");
      return;
    }

    // Clean up stored state
    localStorage.removeItem("linkedin_oauth_state");

    // Start the OAuth flow
    handleOAuthFlow(code);
  }, [searchParams]);

  const handleOAuthFlow = async (code: string) => {
    try {
      // ──────────────────────────────────────────────────────
      // STEP 1: Send code to backend → get access_token back
      // (client_secret stays secure on the backend)
      // ──────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────
      // STEP 2: Send access token to backend to fetch profile
      // from LinkedIn (server-side) and save to database.
      // This avoids CORS issues with LinkedIn's API.
      // ──────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────
      // STEP 3: Store in Redux and redirect to profile
      // ──────────────────────────────────────────────────────
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
        {!error ? (
          <>
            <div className="mb-6 relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse blur-sm opacity-50"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              {status}
            </h1>
            <p className="mt-3 text-slate-400">
              Please wait while we establish a secure connection with LinkedIn.
            </p>
            {/* Progress Steps */}
            <div className="mt-8 space-y-3 text-left">
              <div
                className={`flex items-center gap-3 text-sm ${status.includes("Exchanging") ? "text-blue-400" : status.includes("Fetching") || status.includes("Saving") || status.includes("Success") ? "text-green-400" : "text-slate-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${status.includes("Exchanging") ? "bg-blue-400 animate-pulse" : status.includes("Fetching") || status.includes("Saving") || status.includes("Success") ? "bg-green-400" : "bg-slate-700"}`}
                ></div>
                Exchange authorization code
              </div>
              <div
                className={`flex items-center gap-3 text-sm ${status.includes("Fetching") ? "text-blue-400" : status.includes("Saving") || status.includes("Success") ? "text-green-400" : "text-slate-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${status.includes("Fetching") ? "bg-blue-400 animate-pulse" : status.includes("Saving") || status.includes("Success") ? "bg-green-400" : "bg-slate-700"}`}
                ></div>
                Fetch profile from LinkedIn API
              </div>
              <div
                className={`flex items-center gap-3 text-sm ${status.includes("Saving") ? "text-blue-400" : status.includes("Success") ? "text-green-400" : "text-slate-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${status.includes("Saving") ? "bg-blue-400 animate-pulse" : status.includes("Success") ? "bg-green-400" : "bg-slate-700"}`}
                ></div>
                Save to backend
              </div>
              <div
                className={`flex items-center gap-3 text-sm ${status.includes("Success") ? "text-green-400" : "text-slate-600"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${status.includes("Success") ? "bg-green-400 animate-pulse" : "bg-slate-700"}`}
                ></div>
                Redirect to profile
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
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
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-red-500">
              Authentication Failed
            </h1>
            <p className="mt-3 text-slate-400">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all duration-200 font-medium"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          Loading...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
