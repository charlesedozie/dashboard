import { NextRequest, NextResponse } from "next/server";

const STORAGE_ZONE_NAME = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE!;
const ACCESS_KEY = process.env.BUNNY_STORAGE_ACCESS_KEY!;
const BUNNY_PUBLIC_URL = `https://${STORAGE_ZONE_NAME}.b-cdn.net`;
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}`;

function getFolderPath() {
  const now = new Date();
  return `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folderPath = getFolderPath();
    const fileName = file.name;
    const storagePath = `${folderPath}/${fileName}`;
    const uploadUrl = `${BUNNY_STORAGE_URL}/${storagePath}`;

    console.log(`📤 Uploading ${fileName} to ${uploadUrl}`);

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Upload failed: ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    console.log(`✅ Uploaded ${fileName} successfully`);
    return NextResponse.json(
      {
        message: "Upload successful",
        fileUrl: `${BUNNY_PUBLIC_URL}/${storagePath}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
