import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { userService } from '@/lib/database'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const addresses = await userService.getUserAddresses(userId)
    return NextResponse.json({ success: true, data: addresses })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const required = ['fullName','phoneNumber','street','city','state','zip','country']
    for (const key of required) if (!body?.[key]) return NextResponse.json({ success:false, error:`Missing ${key}` }, { status: 400 })

    const address = await userService.createUserAddress(userId, {
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      street: body.street,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      isDefault: Boolean(body.isDefault)
    })

    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to save address' }, { status: 500 })
  }
}




