import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET() {
  const theme = await repository.getThemeConfig();
  return NextResponse.json(theme);
}
