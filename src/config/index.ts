export const API_BYPASS_KEY = "674536e5-cbc9-46d2-9d7a-8b774b195a2c";
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

export const DATABASE_URL = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@toggle.ipoxjpg.mongodb.net/toggle?retryWrites=true&w=majority&appName=Toggle`;



export const STATUS_CODE = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SUCCESS: 200,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  INTERNAL_SERVER: 500,
  CONFLICT_DATA: 409,
};

/**
 * @description set of events that we are using in toggle websocket app
 */
export const ToggleEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTION_EVENT: "connection",
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? whensending server message to user
  SERVER_MESSAGE: "serverMessage",
  // ? user join events
  USER_JOIN: "userJoin",
  USER_LEAVE: "userLeave",
  // ? delivery tracking events
  DELIVERY_STATUS_UPDATE: "deliveryStatusUpdate",
  DELIVERY_TRACKING: "deliveryTracking",
  // ? toggle events
  TOGGLE_ON: "toggleOn",
  TOGGLE_OFF: "toggleOff",
  TOGGLE_STATUS: "toggleStatus",
});

export const AvailableToggleEvents = Object.values(ToggleEventEnum);
