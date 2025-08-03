import { TIERS } from "@/constant/user";

export type TUpdateProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  tier: string;
};

export type TTier = (typeof TIERS)[number];
