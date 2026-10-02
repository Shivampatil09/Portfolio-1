import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateResume, deleteResume } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

    // Convert to Serverless & Vercel-safe Base64 Data URI
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    // Default or custom display file name (must end with .pdf)
    let finalDisplayName = displayFileName || file.name || "Shivam_Patil_Resume.pdf";
    if (!finalDisplayName.toLowerCase().endsWith(".pdf")) {
      finalDisplayName += ".pdf";
    }

    // Update database directly
    const updated = await updateResume({
      pdfUrl: dataUri,
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
