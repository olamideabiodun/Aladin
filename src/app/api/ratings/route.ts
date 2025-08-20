import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { productId, value, comment } = await req.json();

    const newRating = await prisma.rating.create({
      data: {
        productId,
        value,
        comment,
      },
    });

    return NextResponse.json(newRating);
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json({ error: "Failed to create rating" }, { status: 500 });
  }
}