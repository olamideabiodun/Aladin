
import { productService } from "@/lib/database";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const orders = await productService.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                address: true,
            },
        });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong" });
    }
}

export async function POST(req) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { cartItems, total, addressId, email, phone, name } = await req.json();

        const order = await productService.order.create({
            data: {
                userId,
                total,
                addressId,
                email,
                phone,
                name,
                orderItems: {
                    create: Object.keys(cartItems).map(itemId => ({
                        productId: itemId,
                        quantity: cartItems[itemId],
                        price: 0, // You might want to fetch the actual price from the product
                    })),
                },
            },
        });

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong" });
    }
}
