import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const savedUrls = []

    for (const file of files) {
      if (!file || typeof file === 'string') continue
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`
      const filePath = path.join(uploadDir, uniqueName)
      await writeFile(filePath, buffer)
      // Served statically from /public/uploads
      savedUrls.push(`/uploads/${uniqueName}`)
    }

    return NextResponse.json({ success: true, files: savedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}


