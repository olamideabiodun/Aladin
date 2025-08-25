import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";
import busboy from "busboy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), "public", "uploads");

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    typeof (session.user as any).role !== "string" ||
    (session.user as any).role !== "ADMIN"
  ) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return new NextResponse("Missing Content-Type", { status: 400 });
  }

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    
    const bb = busboy({ headers: { "content-type": contentType } });

    const filePromises: Promise<any>[] = [];

    const requestBody = new Readable({
      read() {

      },
    });

    const stream = req.body as ReadableStream<Uint8Array>;
    const reader = stream.getReader();

    const readStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          requestBody.push(null);
          break;
        }
        requestBody.push(Buffer.from(value));
      }
    };

    readStream();

    let imageUrl = "";

    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const uniqueFilename = `${Date.now()}-${filename}`;
      const filepath = path.join(uploadDir, uniqueFilename);
      const writeStream = require("fs").createWriteStream(filepath);

      imageUrl = `/uploads/${uniqueFilename}`;

      filePromises.push(
        new Promise((resolve, reject) => {
          file.pipe(writeStream);
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        })
      );
    });

    bb.on("close", async () => {
      await Promise.all(filePromises);
    });

    requestBody.pipe(bb);
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return NextResponse.json({ imageUrl }, { status: 201 });

  } catch (error) {
    console.error("File upload error:", error);
    return new NextResponse("File upload failed", { status: 500 });
  }
}