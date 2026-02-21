import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const { title } = (await req.json()) as { title?: string };
  if (!title || typeof title !== "string") {
    return NextResponse.json(
      { error: "title required" },
      { status: 400 }
    );
  }
  const task = await prisma.task.create({
    data: { title: title.trim() }
  });
  return NextResponse.json({ task });
}
