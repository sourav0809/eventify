"use client";

import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/common/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { pathNames } from "@/constant/pathname.const";
import { MAX_OTP_LENGTH } from "@/constant/auth";

interface VerifyOtpFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  setFormError: (value: string | null) => void;
  signUp: any;
  setActive: (value: any) => Promise<void>;
}

export function VerifyOtpForm({
  isSubmitting,
  setIsSubmitting,
  setFormError,
  signUp,
  setActive,
}: VerifyOtpFormProps) {
  const router = useRouter();

  const [otpCode, setOtpCode] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId! });
        toast.success("Account verified and signed in.");
        router.push(pathNames.profile);
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
    <form onSubmit={handleVerify} className="space-y-6">
      <InputOTP
        maxLength={6}
        value={otpCode}
        onChange={(value) => setOtpCode(value)}
        containerClassName="justify-center mt-10"
        autoFocus
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} className="w-16 h-12 text-base" />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        type="submit"
        disabled={isSubmitting || otpCode.length < MAX_OTP_LENGTH}
        className="mt-8 h-10 w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Verifying...
          </>
        ) : (
          "Verify Account"
        )}
      </Button>
    </form>
  );
}
