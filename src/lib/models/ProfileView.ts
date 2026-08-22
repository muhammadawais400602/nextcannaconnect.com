import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfileView extends Document {
  companySlug: string;
  referrer: string;
  userAgent: string;
  createdAt: Date;
}

const ProfileViewSchema = new Schema<IProfileView>(
  {
    companySlug: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

ProfileViewSchema.index({ companySlug: 1, createdAt: -1 });

const ProfileView: Model<IProfileView> =
  mongoose.models.ProfileView ||
  mongoose.model<IProfileView>("ProfileView", ProfileViewSchema);

export default ProfileView;
