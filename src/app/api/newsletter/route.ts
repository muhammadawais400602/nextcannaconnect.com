import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Schema } from "mongoose";

interface ISubscriber {
  email: string;
  source: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: "blog" },
}, { timestamps: true });

const Subscriber =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ ok: true, message: "You're already subscribed!" });
    }

    await Subscriber.create({ email, source: body.source ?? "blog" });
    return NextResponse.json({ ok: true, message: "Successfully subscribed!" });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json({ ok: true, message: "You're already subscribed!" });
    }
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
