"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { pathNames } from "@/constant/pathname.const";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { RegisterLeftSideBar } from "@/components/auth/register/RegisterLeftSideBar";
import { VerifyOtpForm } from "@/components/auth/register/VerifyOtp";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import Loader from "@/components/common/ui/loader";

interface IRegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState<IRegisterFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  if (!isLoaded) {
    return <Loader />;
  }

  const handleBack = () => {
    setIsOtpSent(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      <RegisterLeftSideBar />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-xl space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-start flex flex-col gap-2">
              <h2 className="text-4xl font-bold text-gray-800">
                {isOtpSent ? "Verify Otp" : "  Create Account"}
              </h2>
              <p className=" text-gray-600">
                {isOtpSent
                  ? `Enter the  6 digit verification code sent on ${formData.email}`
                  : "Discover events that matter to you"}
              </p>
            </div>

            {isOtpSent && (
              <Button
                type="button"
                onClick={handleBack}
                className="flex items-center text-sm text-muted-foreground gap-2 bg-transparent hover:bg-transparent border cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {formError}
            </div>
          )}

          {!isOtpSent ? (
            <RegisterForm
              formData={formData}
              onChange={handleChange}
              isSubmitting={isSubmitting}
              signUp={signUp}
              setIsSubmitting={setIsSubmitting}
              setFormError={setFormError}
              setIsOtpSent={setIsOtpSent}
            />
          ) : (
            <VerifyOtpForm
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setFormError={setFormError}
              signUp={signUp}
              setActive={setActive}
            />
          )}

          <div className="text-base text-center flex gap-2 items-center justify-center">
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
