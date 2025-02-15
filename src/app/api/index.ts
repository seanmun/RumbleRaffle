import { NextResponse } from "next/server";  // ✅ Remove NextRequest

// ✅ Health Check API
export async function GET() {
  return NextResponse.json({ message: "API is working inside Next.js!" });
}
