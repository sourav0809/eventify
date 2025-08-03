import { TTier, TUpdateProfile } from "@/types/user";

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}

export const agent = {
  updateProfile: (data: TUpdateProfile) =>
    request<void>("/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  upgradeTier: (data: { userId: string; tier: TTier }) =>
    request<void>("/api/upgrade-tier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
