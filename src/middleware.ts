import clerkClient from "@clerk/clerk-sdk-node";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicPage = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isProfilePage = createRouteMatcher(["/profile(.*)"]);
const isEventsPage = createRouteMatcher(["/events(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow API routes to proceed without redirection; authentication is handled in Route Handlers
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /login for non-public routes
  if (!userId && !isPublicPage(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users without a tier to /profile

  // Fetch user to access publicMetadata
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  const tier = user?.publicMetadata?.tier as string | undefined;

  if (userId && !tier && !isProfilePage(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users with a tier to /events
  if (tier && !isEventsPage(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/events";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|json)).*)"],
};
