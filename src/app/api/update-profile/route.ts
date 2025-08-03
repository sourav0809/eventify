import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Log the request body for debugging
  const body = await request.json();
  console.log("Request body:", body);

  // Verify authentication
  const { userId: authUserId } = getAuth(request);
  if (!authUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate inputs
  const { userId, firstName, lastName, tier } = body;
  if (!userId || !tier) {
    return NextResponse.json(
      { error: "Missing required fields: userId and tier are required" },
      { status: 400 }
    );
  }
  if (userId !== authUserId) {
    return NextResponse.json(
      { error: "Forbidden: Cannot update another user's profile" },
      { status: 403 }
    );
  }
  const validTiers = ["free", "silver", "gold", "platinum"];
  if (!validTiers.includes(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${validTiers.join(", ")}` },
      { status: 400 }
    );
  }
  if (firstName && typeof firstName !== "string") {
    return NextResponse.json(
      { error: "firstName must be a string" },
      { status: 400 }
    );
  }
  if (lastName && typeof lastName !== "string") {
    return NextResponse.json(
      { error: "lastName must be a string" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await clerkClient.users.updateUser(userId, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      publicMetadata: { tier },
    });

    return NextResponse.json({
      message: "Profile updated",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        tier: updatedUser.publicMetadata.tier,
      },
    });
  } catch (error: any) {
    console.error("Update failed:", error);
    const status = error.status === 404 ? 404 : 500;
    const message =
      error.status === 404 ? "User not found" : "Failed to update profile";
    return NextResponse.json({ error: message }, { status });
  }
}
