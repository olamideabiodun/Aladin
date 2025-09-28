import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authSeller = async (userId) => {
    try {

        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        // Only allow users flagged via Clerk publicMetadata
        const isSellerByRole = user?.publicMetadata?.role === 'seller'
        return Boolean(isSellerByRole)
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export default authSeller;