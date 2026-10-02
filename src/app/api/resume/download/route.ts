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

    const relativePath = resume.pdfUrl.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", relativePath);

    try {
      const fileBuffer = await fs.readFile(filePath);
      const downloadName = resume.displayFileName || "Shivam_Patil_Resume.pdf";

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
        { success: false, message: "Resume file could not be found on server" },
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
