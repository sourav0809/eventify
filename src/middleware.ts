import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes
const isPublicPage = createRouteMatcher(["/login(.*)", "/register(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow API routes without redirect
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // Allow access to public pages
  if (isPublicPage(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /login
  if (!userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allow authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|json)).*)"],
};
