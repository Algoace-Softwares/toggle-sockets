import mongoose, { Schema } from "mongoose";
import { IDelivery } from "../types/entityTypes";

// 8-char alphanumeric ID generator (36⁸ ≈ 2.8 trillion possibilities)
const generateOrderId = (): string => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
/**
 * Delivery Schema
 */
const deliverySchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    packageDetails: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
          required: false,
        },
        coordinates: {
          type: [Number], // [longitude, latitude] - GeoJSON format
          required: false,
          validate: {
            validator: function (coords: number[]) {
              return !coords || coords.length === 2;
            },
            message: "Coordinates must be an array of exactly 2 numbers [longitude, latitude]",
          },
        },
      },
      // Legacy fields for backward compatibility
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    dropoffLocation: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
          required: false,
        },
        coordinates: {
          type: [Number], // [longitude, latitude] - GeoJSON format
          required: false,
          validate: {
            validator: function (coords: number[]) {
              return !coords || coords.length === 2;
            },
            message: "Coordinates must be an array of exactly 2 numbers [longitude, latitude]",
          },
        },
      },
      // Legacy fields for backward compatibility
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    deliveryType: {
      type: String,
      enum: ["CASUAL", "ON_DEMAND"],
      required: true,
    },
    scheduledAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
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
      default: "DRAFT",
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => generateOrderId(),
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    tipAmount: {
      type: Number,
      default: 0,
    },
    isPriority: {
      type: Boolean,
      default: false,
    },
    priorityAmount: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
    },
    currency: {
      type: String,
      default: "USD",
    },
    pickedUpAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    canceledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    canceledAt: {
      type: Date,
    },

    // Payment Fields 
    orderPaymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    deliveryInstructions: {
      type: String,
      required: false,
      trim: true,
      maxLength: 1000,
    },
  },
  { timestamps: true },
);

// Create 2dsphere indexes for geospatial queries
deliverySchema.index({ "pickupLocation.coordinates": "2dsphere" });
deliverySchema.index({ "dropoffLocation.coordinates": "2dsphere" });

// Compound indexes for efficient queries
deliverySchema.index({ status: 1, "pickupLocation.coordinates": "2dsphere" });
deliverySchema.index({ status: 1, isPriority: -1, createdAt: -1 });
deliverySchema.index({ driverId: 1, status: 1 });

// Pre-save middleware to automatically set GeoJSON coordinates from lat/lng
deliverySchema.pre("save", function (next) {
  const delivery = this as any;

  // Set pickup coordinates from lat/lng
  if (delivery.pickupLocation.lat && delivery.pickupLocation.lng) {
    delivery.pickupLocation.coordinates = {
      type: "Point",
      coordinates: [delivery.pickupLocation.lng, delivery.pickupLocation.lat], // [longitude, latitude]
    };
  }

  // Set dropoff coordinates from lat/lng
  if (delivery.dropoffLocation.lat && delivery.dropoffLocation.lng) {
    delivery.dropoffLocation.coordinates = {
      type: "Point",
      coordinates: [delivery.dropoffLocation.lng, delivery.dropoffLocation.lat], // [longitude, latitude]
    };
  }

  next();
});

/**
 * Delivery Model
 */
export default mongoose.model<IDelivery>("Delivery", deliverySchema);
