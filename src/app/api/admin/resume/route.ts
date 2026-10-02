import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getResume, updateResume, deleteResume } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
    const displayFileName = (formData.get("displayFileName") as string)?.trim();
    const title = (formData.get("title") as string)?.trim();
    const summary = (formData.get("summary") as string)?.trim();

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Validate type (must be PDF)
    const isPdfMime = file.type === "application/pdf";
    const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfMime && !isPdfExt) {
      return NextResponse.json(
        { success: false, message: "Invalid file format. Please upload a PDF file only." },
        { status: 400 }
      );
    }

    // Validate size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Prepare destination folder
    const resumeDir = path.join(process.cwd(), "public", "resume");
    await fs.mkdir(resumeDir, { recursive: true });

    // Sanitize and generate safe server file name
    const timestamp = Date.now();
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const serverFileName = `resume_${timestamp}_${sanitizedOriginal}`;
    const filePath = path.join(resumeDir, serverFileName);

    // Save file buffer to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Remove previous old resume file if it existed
    const currentResume = await getResume();
    if (currentResume.pdfUrl && currentResume.pdfUrl.startsWith("/resume/")) {
      const oldFileName = path.basename(currentResume.pdfUrl);
      const oldPath = path.join(resumeDir, oldFileName);
      try {
        await fs.unlink(oldPath);
      } catch {
        // ignore if not found
      }
    }

    // Default or custom display file name (must end with .pdf)
    let finalDisplayName = displayFileName || file.name || "Shivam_Patil_Resume.pdf";
    if (!finalDisplayName.toLowerCase().endsWith(".pdf")) {
      finalDisplayName += ".pdf";
    }

    // Update database
    const updated = await updateResume({
      pdfUrl: `/resume/${serverFileName}`,
      originalFileName: file.name,
      displayFileName: finalDisplayName,
      fileSize: file.size,
      ...(title ? { title } : {}),
      ...(summary !== undefined ? { summary } : {}),
    });

    revalidatePath("/resume");
    revalidatePath("/");
    revalidatePath("/admin/resume");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to upload resume" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const currentResume = await getResume();
    if (currentResume.pdfUrl && currentResume.pdfUrl.startsWith("/resume/")) {
      const resumeDir = path.join(process.cwd(), "public", "resume");
      const fileName = path.basename(currentResume.pdfUrl);
      const filePath = path.join(resumeDir, fileName);
      try {
        await fs.unlink(filePath);
      } catch {
        // ignore if already deleted
      }
    }

    await deleteResume();

    revalidatePath("/resume");
    revalidatePath("/");
    revalidatePath("/admin/resume");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete resume" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let displayFileName = body.displayFileName?.trim();
    if (displayFileName && !displayFileName.toLowerCase().endsWith(".pdf")) {
      displayFileName += ".pdf";
    }

    const updated = await updateResume({
      ...(displayFileName ? { displayFileName } : {}),
      ...(body.title ? { title: body.title.trim() } : {}),
      ...(body.summary !== undefined ? { summary: body.summary } : {}),
    });

    revalidatePath("/resume");
    revalidatePath("/");
    revalidatePath("/admin/resume");

    return NextResponse.json({
      success: true,
      message: "Resume details updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update resume details" },
      { status: 500 }
    );
  }
}
