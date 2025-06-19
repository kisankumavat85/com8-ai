import { cookies } from "next/headers";
import { removeSession } from "@/actions/sessions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const sessionId = cookies().get("session-id")?.value || "";
  await removeSession(sessionId);
  return NextResponse.redirect(new URL("/login", request.nextUrl));
};
