// src/app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { name, description, price, imageUrl } = await req.json();

  const newProduct = await prisma.product.create({
    data: { name, description, price, imageUrl },
  });

  return NextResponse.json(newProduct);
}