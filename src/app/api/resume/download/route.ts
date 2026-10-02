import { NextResponse } from "next/server";
import { getResume } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const resume = await getResume();

    if (!resume.pdfUrl) {
      return NextResponse.json(
        { success: false, message: "Resume is not available yet" },
        { status: 404 }
      );
    }

    const downloadName = resume.displayFileName || "Shivam_Patil_Resume.pdf";

    // 1. Handle Base64 Data URI (Vercel & Cloud standard)
    if (resume.pdfUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = resume.pdfUrl.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${downloadName}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // 2. Handle legacy local server file paths if any
    const relativePath = resume.pdfUrl.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", relativePath);

    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${downloadName}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, message: "Resume file could not be found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to download resume" },
      { status: 500 }
    );
  }
}
