// src/app/api/areas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireApiSession } from "@/lib/auth";


export async function GET() {
  const { session, response } = await requireApiSession();

  if (!session) return response;

  const areas = await prisma.area.findMany({
    orderBy: { label: "asc" },
  });

  return NextResponse.json(areas, { status: 200 });
}
