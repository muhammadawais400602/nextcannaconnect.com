import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRFP extends Document {
  title: string;
  description: string;
  categorySlug: string;
  budget?: string;
  location: { city?: string; state?: string };
  deadline?: Date;
  postedBy: mongoose.Types.ObjectId;
  postedByName?: string;
  responses: {
    companyId: mongoose.Types.ObjectId;
    companyName: string;
    message: string;
    submittedAt: Date;
    tier: string;
  }[];
  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const RFPSchema = new Schema<IRFP>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    budget: String,
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    deadline: Date,
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postedByName: String,
    responses: [
      {
        companyId: { type: Schema.Types.ObjectId, ref: "Company" },
        companyName: String,
        message: String,
        submittedAt: { type: Date, default: Date.now },
        tier: String,
      },
    ],
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

RFPSchema.index({ status: 1, categorySlug: 1 });

const RFP: Model<IRFP> =
  mongoose.models.RFP || mongoose.model<IRFP>("RFP", RFPSchema);

export default RFP;
