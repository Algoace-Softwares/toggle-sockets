import TrackingHistory from "../models/trackingHistory.model";
import { ILogTrackingStatusParams } from "../types/entityTypes";

/**
 * Log a delivery status update into TrackingHistory
 */
export const logTrackingStatus = async ({ deliveryId, status, location, note }: ILogTrackingStatusParams) => {
  try {
    await TrackingHistory.create({
      deliveryId,
      status,
      location,
      note,
    });
  } catch (err) {
    console.error("❌ Failed to log tracking status:", err);
  }
};
