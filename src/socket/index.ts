import { Request } from "express";
import { API_BYPASS_KEY, ToggleEventEnum } from "../config";
import { Server as SocketIOServer, Socket } from "socket.io";
import logger from "../utils/logger";

/*
 ** Registering to an event so user can join using their user ID
 */
const mountUserJoinEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.USER_JOIN, ({ userId }: { userId: string }) => {
    console.log(`User ${userId} joined the socket room`);
    socket.join(userId);
    socket.emit(ToggleEventEnum.SERVER_MESSAGE, `User ${userId} successfully joined`);
    logger.info(`User ${userId} joined socket room`);
  });
};

/*
 ** Registering to an event so user can leave
 */
const mountUserLeaveEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.USER_LEAVE, ({ userId }: { userId: string }) => {
    console.log(`User ${userId} left the socket room`);
    socket.leave(userId);
    socket.emit(ToggleEventEnum.SERVER_MESSAGE, `User ${userId} successfully left`);
    logger.info(`User ${userId} left socket room`);
  });
};

/*
 ** Registering to an event for delivery status updates
 */
const mountDeliveryStatusUpdateEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.DELIVERY_STATUS_UPDATE, ({ 
    customerId, 
    deliveryId, 
    status 
  }: { 
    customerId: string; 
    deliveryId: string; 
    status: string; 
  }) => {
    console.log(`Delivery status update - Customer: ${customerId}, Delivery: ${deliveryId}, Status: ${status}`);
    
    // Log the delivery status update
    logger.info(`Delivery Status Update`, {
      customerId,
      deliveryId,
      status,
      timestamp: new Date().toISOString()
    });

    // Emit event to the specific customer
    socket.to(customerId).emit(ToggleEventEnum.DELIVERY_TRACKING, {
      customerId,
      deliveryId,
      status,
      timestamp: new Date().toISOString()
    });

    // Send confirmation back to sender
    socket.emit(ToggleEventEnum.SERVER_MESSAGE, `Delivery status update sent to customer ${customerId}`);
  });
};

/*
 ** Registering to an event so can user can toggle on
 */
const mountToggleOnEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.TOGGLE_ON, ({ userId }: { userId: string }) => {
    console.log(`${userId} toggled ON 🔛`);
    socket.emit(ToggleEventEnum.SERVER_MESSAGE, `Toggle turned ON for user ${userId}`);
    // Broadcast to all connected clients
    socket.broadcast.emit(ToggleEventEnum.TOGGLE_ON, { userId, status: true });
  });
};

/*
 ** Registering to an event so can user can toggle off
 */
const mountToggleOffEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.TOGGLE_OFF, ({ userId }: { userId: string }) => {
    console.log(`${userId} toggled OFF 🔘`);
    socket.emit(ToggleEventEnum.SERVER_MESSAGE, `Toggle turned OFF for user ${userId}`);
    // Broadcast to all connected clients
    socket.broadcast.emit(ToggleEventEnum.TOGGLE_OFF, { userId, status: false });
  });
};

/*
 ** Registering to an event so can user can get toggle status
 */
const mountToggleStatusEvent = (socket: Socket) => {
  socket.on(ToggleEventEnum.TOGGLE_STATUS, ({ userId }: { userId: string }) => {
    console.log(`${userId} requested toggle status`);
    // In a real app, you would check the actual status from database
    socket.emit(ToggleEventEnum.TOGGLE_STATUS, { userId, status: false });
  });
};

/*
 **  returning ioClient
 */
const initializeSocketIO = (ioClient: SocketIOServer) => {
  /*
   ** Middleware to check if user is authorized to connect or not
   ** if provide bypass key then bypass the user other wise authenticate user
   ** it will once every user is connected only
   */
  ioClient.use((socket, next) => {
    if (socket?.handshake?.headers?.authorization === API_BYPASS_KEY) {
      // if bypass key then setting random credential and hardcode ones
      next();
    } else {
      // For now, allow all connections
      next();
    }
  });

  /*
   ** Event listeners
   */
  ioClient.on(ToggleEventEnum.CONNECTION_EVENT, async (socket: Socket) => {
    console.log("🚀 ~ New client connected:", socket.id);
    
    try {
      socket.emit(ToggleEventEnum.SERVER_MESSAGE, "You have connected to toggle websocket server!");
      console.log(`Client connected with socket ID: ${socket.id}`);
      
      // Common events that needs to be mounted on the initialization
      mountUserJoinEvent(socket);
      mountUserLeaveEvent(socket);
      mountDeliveryStatusUpdateEvent(socket);
      mountToggleOnEvent(socket);
      mountToggleOffEvent(socket);
      mountToggleStatusEvent(socket);

      // Handle user disconnect
      socket.on(ToggleEventEnum.DISCONNECT_EVENT, async () => {
        console.log("Client disconnected", socket.id);
        logger.info(`Client disconnected: ${socket.id}`);
      });
    } catch (error: unknown) {
      console.log("🚀 ~ socket connection error:", error);
      socket.emit(
        ToggleEventEnum.SOCKET_ERROR_EVENT,
        (error as Error)?.message || "Something went wrong while connecting to the socket.",
      );
    }
  });
  return ioClient;
};

// Utility function responsible to abstract the logic of socket emission via the io instance
// and sending event into it
const emitSocketEvent = (req: Request, roomId: string, event: string, payload: string | object | unknown) => {
  req.app.get("ioClient").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
