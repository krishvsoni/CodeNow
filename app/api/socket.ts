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
let connectedClientsCount = 0; // Track number of connected clients

export default function socketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET','POST',"OPTIONS",'PUT','DELETE') {
    const socket = res.socket as any;

    if (!socket || !socket.server) {
      res.status(500).send('Socket not available');
      return;
    }

    if (!io) {
      const server = socket.server as http.Server;

      io = new Server(server, {
        cors: {
          origin: '*', // Allow all origins (adjust for production)
        },
      });

      io.on('connection', (socket) => {
        connectedClientsCount++; // Increment connected clients count
        console.log('New client connected');

        // Send the updated count to all connected clients if io is initialized
        if (io) {
          io.emit('clientCountUpdate', connectedClientsCount);
        }

        socket.emit('message', 'Share your code now');

        socket.on('codeUpdate', (message: string) => {
          console.log(`Received message: ${message}`);
          socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', () => {
          connectedClientsCount--; // Decrement connected clients count
          console.log('Client disconnected');

          // Send the updated count to all connected clients if io is initialized
          if (io) {
            io.emit('clientCountUpdate', connectedClientsCount);
          }
        });
      });
    }

    socket.server.io = io; 
    res.end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
