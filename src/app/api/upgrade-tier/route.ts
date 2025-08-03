import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { TIERS } from "@/constant/user";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId: authUserId } = getAuth(request);

  if (!authUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, tier } = body;

  if (!userId || !tier) {
    return NextResponse.json(
      { error: "Missing required fields: userId and tier are required" },
      { status: 400 }
    );
  }

  if (userId !== authUserId) {
    return NextResponse.json(
      { error: "Forbidden: Cannot upgrade another user's tier" },
      { status: 403 }
    );
  }

  if (!TIERS.includes(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${TIERS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await clerkClient.users.updateUser(userId, {
      publicMetadata: { tier },
    });

    return NextResponse.json({
      message: "Tier upgraded",
      user: {
        id: updatedUser.id,
        tier: updatedUser.publicMetadata.tier,
      },
    });
  } catch (error: any) {
    console.error("Upgrade failed:", error);
    const status = error.status === 404 ? 404 : 500;
    const message =
      error.status === 404 ? "User not found" : "Failed to upgrade tier";
    return NextResponse.json({ error: message }, { status });
  }
}
