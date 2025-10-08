import mongoose from "mongoose";

type StatusType =
  | "PENDING"
  | "ASSIGNED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "PACKAGES_PICKED_UP"
  | "PACKAGE_ENROUTE"
  | "PACKAGE_DELIVERED"
  | "CANCELLED"
  | "FAILED";


/**
 * User Role Types
 */
export type UserRole = "CUSTOMER" | "DRIVER" | "ADMIN";
/**
 * Account Status Types
 */
export type AccountStatus = "ACTIVE" | "BANNED" | "SUSPENDED";


export interface ISavedLocation {
  type: "PICKUP" | "DROPOFF";
  address: string;
  lat: number;
  lng: number;
  createdAt: Date;
}
/**
 * Interface for FCM Token
 */
export interface IFcmToken {
  deviceId: string;
  fcmToken: string;
}

/**
* Log Tracking Status Params Interface
*/
export interface ILogTrackingStatusParams {
  deliveryId: mongoose.Types.ObjectId | string;
  status: StatusType;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  note?: string;
}


/**
 * User Interface
 */
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  stripeCustomerId?: string;
  isBlocked: boolean;
  accountStatus: AccountStatus;
  savedLocations: ISavedLocation[];
  fcmTokens: IFcmToken[];
  createdAt: Date;
  updatedAt: Date;
}



/**
 * Delivery Interface
 */
export interface IDelivery extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  packageDetails: mongoose.Types.ObjectId;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  deliveryType: "CASUAL" | "ON_DEMAND";
  scheduledAt?: Date;
  isPriority: boolean;
  status: StatusType;
  deliveryFee: number;
  serviceFee: number;
  taxAmount: number;
  tipAmount: number;
  priorityAmount: number;
  finalCost?: number;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  canceledBy?: mongoose.Types.ObjectId;
  canceledAt?: Date;
  orderPaymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  deliveryInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}


/**
 * Tracking History Interface
 */
export interface ITrackingHistory extends mongoose.Document {
  deliveryId: mongoose.Types.ObjectId;
  status: StatusType;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: Date;
}
