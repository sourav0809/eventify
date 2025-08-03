import { TIERS } from "@/constant/user";
import z from "zod";

export const updateProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  tier: z.enum(TIERS),
});

export type updateProfileSchema = z.infer<typeof updateProfileSchema>;
