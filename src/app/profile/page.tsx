"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import {
  FaLinkedin,
  FaSignOutAlt,
  FaEnvelope,
  FaIdBadge,
} from "react-icons/fa";
import Image from "next/image";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/login");
    }
  }, [user.isLoggedIn, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!user.isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] rounded flex flex-col items-center justify-center">
              <FaLinkedin className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              AuthNode
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-[#e8e6df] relative"></div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                <Image
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 font-medium">
                  Verified LinkedIn Professional
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Authorized via AuthNode Integration
                </p>
              </div>
              <div className="hidden sm:block">
                <button className="px-4 py-1.5 bg-[#0a66c2] text-white font-medium rounded-full hover:bg-[#004182] transition-colors">
                  Edit profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#eff3f8] text-[#0a66c2] rounded flex items-center justify-center shrink-0">
                <FaEnvelope className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Primary Email
                </p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
              <div className="w-10 h-10 bg-[#eff3f8] text-[#0a66c2] rounded flex items-center justify-center shrink-0">
                <FaIdBadge className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  LinkedIn ID
                </p>
                <p className="text-gray-600 font-mono text-sm break-all">
                  {user.linkedinId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
