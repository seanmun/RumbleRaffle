import { NextResponse } from "next/server";
import { wrestlers } from "@/app/api/wrestlers"; // ✅ Importing wrestlers list

export async function GET() {
  return NextResponse.json(wrestlers);
}
