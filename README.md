# Toggle WebSockets

A simple WebSocket application for toggle functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.dev` file with the following content:
```
PORT=3001
NODE_ENV=development
```

3. Run the development server:
```bash
npm run dev
```

## Features

- WebSocket server with Socket.IO
- Toggle on/off functionality
- Real-time status updates
- MongoDB connection
- Express.js API server

## Available Scripts

- `npm run dev` - Start development server
- `npm run prod` - Start production server
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## WebSocket Events

- `toggleOn` - Toggle on event
- `toggleOff` - Toggle off event
- `toggleStatus` - Get toggle status
- `serverMessage` - Server messages
