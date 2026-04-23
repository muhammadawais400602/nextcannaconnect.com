import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISignupApplication extends Document {
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  stateProvince?: string;
  category?: string;
  tier: string;
  // Step 3 fields
  website?: string;
  description?: string;
  publicPhone?: string;
  serviceArea?: string;
  certifications?: string;
  socialLink?: string;
  contactName?: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "not_required" | "awaiting_payment" | "paid";
  stripeSessionId?: string;
  createdAt: Date;
}

const SignupApplicationSchema = new Schema<ISignupApplication>(
  {
    fullName:      { type: String, required: true },
    companyName:   { type: String, required: true },
    email:         { type: String, required: true, index: true },
    phone:         String,
    stateProvince: String,
    category:      String,
    tier:          { type: String, required: true },
    website:       String,
    description:   String,
    publicPhone:   String,
    serviceArea:   String,
    certifications: String,
    socialLink:    String,
    contactName:   String,
    status:          { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentStatus:   { type: String, enum: ["not_required", "awaiting_payment", "paid"], default: "not_required" },
    stripeSessionId: String,
  },
  { timestamps: true }
);

const SignupApplication: Model<ISignupApplication> =
  mongoose.models.SignupApplication ||
  mongoose.model<ISignupApplication>("SignupApplication", SignupApplicationSchema);

export default SignupApplication;
