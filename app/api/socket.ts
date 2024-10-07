/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: any;
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: Server | undefined;

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!io) {
    if (!res.socket || !res.socket.server) {
      console.error("Socket is not available.");
      res.status(500).end("Socket is not available.");
      return;
    }

    io = new Server(res.socket.server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("codeUpdate", (newCode: string) => {
        console.log("Code update received:", newCode);
        socket.broadcast.emit("codeUpdate", newCode);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;