import mongoose, { Schema, Document, Model } from "mongoose";

/** A message from a buyer to a vendor (profile contact form, quote requests). */
export interface IInquiry extends Document {
  vendorSlug: string;
  companyId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceNeeded?: string;
  message?: string;
  source?: string;
  vendorNotified: boolean;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    vendorSlug: { type: String, required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    serviceNeeded: String,
    message: String,
    source: String,
    vendorNotified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

InquirySchema.index({ vendorSlug: 1, createdAt: -1 });

const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
