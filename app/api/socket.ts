/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import http from 'http';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw requests
  },
};

let io: Server | null = null;

export default function socketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Ensure that res.socket and res.socket.server are defined
    const socket = res.socket as any;

    // Check if the socket is null
    if (!socket || !socket.server) {
      res.status(500).send('Socket not available');
      return;
    }

    // Initialize the Socket.IO server if it's not already initialized
    if (!io) {
      // Type assertion for socket.server
      const server = socket.server as http.Server;

      // Initialize Socket.IO server
      io = new Server(server, {
        cors: {
          origin: '*', // Allow all origins (adjust for production)
        },
      });

      io.on('connection', (socket) => {
        console.log('New client connected');

        // Send initial message
        socket.emit('message', 'Share your code now');

        socket.on('codeUpdate', (message: string) => {
          console.log(`Received message: ${message}`);
          // Broadcast to all connected clients
          socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
      });
    }

    // Attach the Socket.IO instance to the server for future requests
    socket.server.io = io; // No need for `any` here
    res.end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
