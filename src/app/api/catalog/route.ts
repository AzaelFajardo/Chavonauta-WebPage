import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET() {
  const [categories, items] = await Promise.all([
    repository.getCategories(),
    repository.getCatalogItems(),
  ]);
  return NextResponse.json({ categories, items });
}
