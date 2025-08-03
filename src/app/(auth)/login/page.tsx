"use client";

import { useSignIn } from "@clerk/nextjs";
import { LoginLeftSideBar } from "@/components/auth/login/LoginLeftSide";
import { LoginForm } from "@/components/auth/login/LoginForm";
import Link from "next/link";
import { pathNames } from "@/constant/pathname.const";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-sm">
          Loading authentication system...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section - Gradient Background (hidden on mobile) */}
      <LoginLeftSideBar />

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-start">
            <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Access your personalized event dashboard
            </p>
          </div>

          <LoginForm setActive={setActive} signIn={signIn} />

          <div className="text-base text-center flex gap-2 items-center justify-center">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link
              href={pathNames.register}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
