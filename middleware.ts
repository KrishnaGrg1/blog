import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const config = {
  runtime: 'nodejs',
  matcher: ["/dashboard/:path*"],
};

export async function middleware(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers, // required
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}
