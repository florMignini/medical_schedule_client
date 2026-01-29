import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { storage } from "@/lib"; // tu storage server client
import { ENDPOINT, PROJECT_ID, PATIENT_ANALYSIS_BUCKET_ID } from "@/lib";
import { InputFile } from "node-appwrite/file";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Soportar múltiples archivos: "files"
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json({ success: true, urls: [] });
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const inputFile = InputFile.fromBuffer(buffer, file.name);

        const fileRes = await storage.createFile(
          PATIENT_ANALYSIS_BUCKET_ID!,
          ID.unique(),
          inputFile
        );

        return `${ENDPOINT}/storage/buckets/${PATIENT_ANALYSIS_BUCKET_ID!}/files/${fileRes.$id}/view?project=${PROJECT_ID}`;
      })
    );

    return NextResponse.json({ success: true, urls: uploads });
  } catch (e: any) {
    console.error("upload patient files error:", e);
    return NextResponse.json(
      { success: false, message: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
