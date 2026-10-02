import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

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

    if (!file) {
      return NextResponse.json({ success: false, message: "No certificate file provided" }, { status: 400 });
    }

    // Determine mime type / format
    const lowerName = file.name.toLowerCase();
    let mimeType = file.type.toLowerCase();

    if (!mimeType || mimeType === "application/octet-stream") {
      if (lowerName.endsWith(".pdf")) mimeType = "application/pdf";
      else if (lowerName.endsWith(".png")) mimeType = "image/png";
      else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (lowerName.endsWith(".webp")) mimeType = "image/webp";
    }

    const isImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mimeType) ||
      [".jpg", ".jpeg", ".png", ".webp"].some((ext) => lowerName.endsWith(ext));
    const isPdf = mimeType === "application/pdf" || lowerName.endsWith(".pdf");

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { success: false, message: "Invalid file format. Please upload a PDF or image (PNG, JPG, WebP)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Convert to Serverless & Vercel-safe Base64 Data URI
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${isPdf ? "application/pdf" : mimeType || "image/png"};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      fileUrl: dataUri,
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
