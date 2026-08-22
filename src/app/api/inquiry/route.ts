import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Schema, Model } from "mongoose";

interface IInquiry {
  vendorSlug: string;
  name: string;
  email: string;
  phone?: string;
  serviceNeeded?: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    vendorSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    serviceNeeded: String,
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorSlug, name, email, phone, serviceNeeded } = body;

    if (!vendorSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    await Inquiry.create({ vendorSlug, name, email, phone, serviceNeeded });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
