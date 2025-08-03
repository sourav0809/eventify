"use client";

import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LoginFormData, loginSchema } from "@/schema/auth";
import { useRouter } from "next/navigation";
import { pathNames } from "@/constant/pathname.const";
import { validateForm } from "@/helpers/validation";

interface ILoginFormProps {
  signIn: any;
  setActive: any;
}

export function LoginForm({ signIn, setActive }: ILoginFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateForm(loginSchema, formData);

    if (!result.success) {
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
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
    <>
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {formError}
        </div>
      )}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="block w-full py-2.5 h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
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
              Just a Sec ...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </>
  );
}
