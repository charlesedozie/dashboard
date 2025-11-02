import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs"; // Ensure Node APIs are available

// ----- CORS -----
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json(
    { status: "success", message: "CORS preflight OK" },
    { status: 200, headers: corsHeaders }
  );
}

// ----- Generate Signed URL (Temporary) -----
function generateSignedUrl(fileName: string): string {
  const secret = process.env.FILE_SECRET_KEY || "default_secret_key";
  const expires = Date.now() + 1000 * 60 * 10; // 10 minutes expiry
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${fileName}:${expires}`)
    .digest("hex");

  // Points to the GET endpoint below
  return `/api/files?file=${encodeURIComponent(fileName)}&exp=${expires}&sig=${signature}`;
}

// ----- Handle File Upload -----
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { status: "error", message: "No file uploaded", data: null },
        { status: 400, headers: corsHeaders }
      );
    }

    const maxSize = 20 * 1024 * 1024; // 20 MB
    const allowedTypes = [
      "jpg", "jpeg", "png", "gif",
      "pdf", "txt",
      "mp4", "mov", "avi", "mkv", "webm", "flv", "wmv",
    ];

    const fileName = file.name;
    const fileExt = path.extname(fileName).toLowerCase().replace(".", "");
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (!allowedTypes.includes(fileExt)) {
      return NextResponse.json(
        {
          status: "error",
          message: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
          data: null,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { status: "error", message: "File too large. Maximum size is 20 MB.", data: null },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create secure upload directory
    const uploadDir = path.join(process.cwd(), "server", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeFileName = `file_${Date.now()}_${fileName}`;
    const destination = path.join(uploadDir, safeFileName);
    fs.writeFileSync(destination, fileBuffer);

    // Generate signed access URL
    const signedUrl = generateSignedUrl(safeFileName);

    return NextResponse.json(
      {
        status: "success",
        message: "File uploaded successfully.",
        data: {
          fileName: safeFileName,
          size: file.size,
          type: file.type,
          signedUrl,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { status: "error", message: "Upload failed", error: err?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
