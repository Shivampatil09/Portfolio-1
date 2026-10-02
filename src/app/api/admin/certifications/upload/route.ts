import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldFileUrl = (formData.get("oldFileUrl") as string)?.trim();

    if (!file) {
      return NextResponse.json({ success: false, message: "No certificate file provided" }, { status: 400 });
    }

    // Check mime type / extension
    const mimeType = file.type.toLowerCase();
    const ext = path.extname(file.name).toLowerCase();
    const isImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mimeType) || [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    const isPdf = mimeType === "application/pdf" || ext === ".pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { success: false, message: "Invalid file format. Please upload an image (PNG, JPG, WebP) or PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const certsDir = path.join(process.cwd(), "public", "certificates");
    await fs.mkdir(certsDir, { recursive: true });

    // Clean up old file if replacing
    if (oldFileUrl && oldFileUrl.startsWith("/certificates/")) {
      const oldFileName = path.basename(oldFileUrl);
      const oldPath = path.join(certsDir, oldFileName);
      try {
        await fs.unlink(oldPath);
      } catch {
        // ignore if not found
      }
    }

    // Generate safe file name
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const serverFileName = `cert_${timestamp}_${sanitizedName}`;
    const filePath = path.join(certsDir, serverFileName);

    // Save buffer
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return NextResponse.json({
      success: true,
      fileUrl: `/certificates/${serverFileName}`,
      fileType: isPdf ? "pdf" : "image",
      fileName: file.name,
      message: "Certificate uploaded successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to upload certificate" },
      { status: 500 }
    );
  }
}
