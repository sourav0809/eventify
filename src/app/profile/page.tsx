"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/ui/loader";
import { agent } from "../api/agent";
import { TTier } from "@/types/user";
import { TIERS } from "@/constant/user";
import { Button } from "@/components/common/ui/button";
import { pathNames } from "@/constant/pathname.const";
import { Label } from "@/components/common/ui/label";
import { toast } from "sonner";
import { validateForm } from "@/helpers/validation";
import { updateProfileSchema } from "@/schema/user";
import { Input } from "@/components/common/ui/input";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [selectedTier, setSelectedTier] = useState<TTier>("free");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return <Loader />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return toast.error("User not found");
    }

    const data = {
      userId: user.id,
      firstName: name.firstName,
      lastName: name.lastName,
      tier: selectedTier,
    };

    const result = validateForm(updateProfileSchema, data);
    if (!result.success) {
      return;
    }

    setIsSubmitting(true);

    try {
      await agent.updateProfile(data);
      router.push(pathNames.events);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label className=" text-base font-medium text-gray-700">
              First Name
            </Label>
            <Input
              type="text"
              className="w-full px-4 py-2 h-10.5 border "
              placeholder="John"
              value={name.firstName}
              onChange={(e) =>
                setName((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className=" text-base font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              type="text"
              className="w-full px-4 py-2 h-10.5 border "
              placeholder="Doe"
              value={name.lastName}
              onChange={(e) =>
                setName((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className=" text-base font-medium text-gray-700">
              Choose Your Tier
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {TIERS.map((tier) => (
                <Button
                  type="button"
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    "flex items-center justify-between border rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition cursor-pointer h-10",
                    selectedTier === tier
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="capitalize">{tier}</span>
                  {tier === "platinum" || tier === "gold" ? (
                    <Crown className="w-4 h-4" />
                  ) : selectedTier === tier ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : null}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition h-12 cursor-pointer mt-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
