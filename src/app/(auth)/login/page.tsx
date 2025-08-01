"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  BarChart2,
  PieChart,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoginFormData, loginSchema } from "@/schema/auth";
import { pathNames } from "@/constant/pathname.const";
import { validateForm } from "@/helpers/validation";
import { useSignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-sm">
          Loading authentication system...
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validateForm(loginSchema, formData);

    if (!validationResult.success) {
      setValidationErrors(validationResult.errors || {});
      return;
    }

    if (!isLoaded || !signIn) {
      setFormError("Auth system not ready. Please wait.");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationErrors({});
      setFormError(null);

      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Successfully logged in!");
        router.push(pathNames.events);
      } else {
        setFormError("Login not complete. Please check your credentials.");
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || "Login failed";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section - Gradient Background (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-white space-y-8 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Transform Your Business with Trackify
            </h1>
            <p className="text-xl text-blue-100">
              Make data-driven decisions with our powerful sales dashboard
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">Real-time Analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">Visual Reports</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">Growth Insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your analytics dashboard
            </p>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      validationErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-600">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href={pathNames.register}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
