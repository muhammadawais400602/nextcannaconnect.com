import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  companyId: mongoose.Types.ObjectId;
  companySlug: string;
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  senderPhone?: string;
  senderState?: string;
  servicesInterested: string[];
  message?: string;
  tier: "claimed" | "select" | "elite";
  leadFee: number; // in cents
  charged: boolean;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    companySlug: { type: String, required: true },
    senderName: { type: String, required: true },
    senderCompany: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: String,
    senderState: String,
    servicesInterested: [String],
    message: String,
    tier: { type: String, enum: ["claimed", "select", "elite"], required: true },
    leadFee: { type: Number, required: true }, // 2000 = $20.00
    charged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
