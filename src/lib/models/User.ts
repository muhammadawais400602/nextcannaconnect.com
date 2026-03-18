import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  companyName?: string;
  phone?: string;
  stateProvince?: string;
  accountType: "vendor" | "buyer";
  tier: "free" | "claimed" | "select" | "elite";
  category?: string;
  companyId?: mongoose.Types.ObjectId;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    companyName: String,
    phone: String,
    stateProvince: String,
    accountType: { type: String, enum: ["vendor", "buyer"], default: "vendor" },
    tier: { type: String, enum: ["free", "claimed", "select", "elite"], default: "free" },
    category: String,
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
