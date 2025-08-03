"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = ["free", "silver", "gold", "platinum"] as const;
type Tier = (typeof tiers)[number];

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [selectedTier, setSelectedTier] = useState<Tier>("free");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: name.firstName,
          lastName: name.lastName,
          tier: selectedTier,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      router.push("/events");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John"
              value={name.firstName}
              onChange={(e) =>
                setName((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Doe"
              value={name.lastName}
              onChange={(e) =>
                setName((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Tier
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tiers.map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    "flex items-center justify-between border rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition",
                    selectedTier === tier
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="capitalize">{tier}</span>
                  {tier === "platinum" || tier === "gold" ? (
                    <Crown className="w-4 h-4" />
                  ) : selectedTier === tier ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {isSubmitting ? "Saving..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
