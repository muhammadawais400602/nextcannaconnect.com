import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = request.cookies.get("vendor_session")?.value;
    if (!session || !session.startsWith("nc-vendor:")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.split(":")[1];
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findById(userId).select("isActive");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, WebP, or GIF images are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File must be smaller than 5 MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `vendors/${userId}/${Date.now()}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[vendor/upload]", err);
    return NextResponse.json({ error: "Upload failed", detail: String(err) }, { status: 500 });
  }
}
