"use client";

import { useState } from "react";
import { Mail, Lock, BarChart2, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { pathNames } from "@/constant/pathname.const";

interface RegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-sm">
          Loading authentication system...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsOtpSent(true);
      toast.success("Verification code sent to your email.");
    } catch (error: any) {
      console.error("SignUp error:", JSON.stringify(error, null, 2));
      const msg = error?.errors?.[0]?.message || "Something went wrong.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId! });
        toast.success("Account verified and signed in.");
        router.push(pathNames.events);
      } else {
        setFormError("Verification incomplete.");
      }
    } catch (error: any) {
      console.error("Verify error:", JSON.stringify(error, null, 2));
      const msg = error?.errors?.[0]?.message || "Invalid or expired code.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-white space-y-8 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Unlock the Power of Trackify
            </h1>
            <p className="text-xl text-blue-100">
              Join thousands of teams growing smarter with real-time insights
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[BarChart2, PieChart, TrendingUp].map((Icon, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-blue-100">
                    {
                      [
                        "Real-time Analytics",
                        "Visual Reports",
                        "Growth Insights",
                      ][i]
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              Start your analytics journey today
            </p>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {formError}
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {[
                  { label: "Email", name: "email", type: "email", icon: Mail },
                  {
                    label: "Password",
                    name: "password",
                    type: "password",
                    icon: Lock,
                  },
                ].map(({ label, name, type, icon: Icon }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name={name}
                        type={type}
                        value={formData[name as keyof RegisterFormData]}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div id="clerk-captcha"></div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                  placeholder="Enter OTP sent to your email"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? "Verifying..." : "Verify & Sign In"}
              </button>
            </form>
          )}

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href={pathNames.login}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
