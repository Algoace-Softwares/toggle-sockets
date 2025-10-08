import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/entityTypes";

/**
 * FCM Token Schema
 * */
export const FcmTokenSchema = new Schema({
  deviceId: { type: String, required: [true, "deviceId is required"], index: true },
  fcmToken: { type: String, required: [true, "fcmToken is required"] },
});

/**
 * Sub-document for one saved location
 */
const savedLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["PICKUP", "DROPOFF"],
      required: true,
    },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  {
    _id: false,
    timestamps: { createdAt: true, updatedAt: false },
  },
);

/**
 * User Schema
 * */
const userSchema: Schema = new Schema(
  {
    cognitoId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowerCase: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["CUSTOMER", "DRIVER", "ADMIN"],
      required: true,
    },
    profileImage: { type: String },
    stripeCustomerId: { type: String },
    isBlocked: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "DISABLED", "BANNED", "TEMPORARY_BANNED"],
      default: "ACTIVE",
    },
    savedLocations: {
      type: [savedLocationSchema],
      default: [],
    },
    fcmTokens: {
      type: [FcmTokenSchema],
      default: [],
    },
  },
  { timestamps: true },
);

/**
 * @typedef User
 */
export default mongoose.model<IUser>("User", userSchema);
