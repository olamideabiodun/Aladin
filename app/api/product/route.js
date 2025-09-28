
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await database.product.findMany();
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong" });
    }
}
