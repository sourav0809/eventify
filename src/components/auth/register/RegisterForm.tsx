"use client";

import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateForm } from "@/helpers/validation";
import { registerSchema } from "@/schema/auth";

interface IRegisterFormProps {
  formData: {
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  signUp: any;
  setIsSubmitting: (value: boolean) => void;
  setFormError: (value: string | null) => void;
  setIsOtpSent: (value: boolean) => void;
}

export function RegisterForm({
  formData,
  onChange,
  isSubmitting,
  signUp,
  setIsSubmitting,
  setFormError,
  setIsOtpSent,
}: IRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateForm(registerSchema, formData);

    if (!result.success) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setIsOtpSent(true);
      toast.success("Verification code sent to your email.");
    } catch (error: any) {
      const msg = error?.errors?.[0]?.message || "Something went wrong.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <Label className=" text-base font-medium text-gray-700">
            Enter Your Email
          </Label>
          <Input
            name="email"
            type="email"
            autoFocus
            placeholder="Enter your email"
            value={formData.email}
            onChange={onChange}
            className=" w-full py-2.5 h-10"
          />
        </div>
        <div className="flex flex-col gap-1 relative">
          <Label className="text-base font-medium text-gray-700">
            Enter Your Password
          </Label>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={onChange}
            className="block w-full py-2.5 h-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div id="clerk-captcha"></div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 h-10 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Creating Account ...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
