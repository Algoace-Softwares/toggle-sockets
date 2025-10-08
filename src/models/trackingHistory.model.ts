import mongoose, { Schema } from "mongoose";
import { ITrackingHistory } from "../types/entityTypes";

/**
 * Tracking History Schema
 */
const trackingHistorySchema: Schema = new Schema(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "ON_THE_WAY",
        "ARRIVED",
        "PACKAGES_PICKED_UP",
        "PACKAGE_ENROUTE",
        "PACKAGE_DELIVERED",
        "CANCELLED",
        "FAILED",
      ],
      required: true,
    },
    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/**
 * Tracking History Model
 */
export default mongoose.model<ITrackingHistory>("TrackingHistory", trackingHistorySchema);
